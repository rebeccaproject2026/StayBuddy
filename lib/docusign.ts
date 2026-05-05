/**
 * DocuSign JWT Grant authentication + envelope helpers.
 *
 * Setup (one-time):
 * 1. Create a free developer account at https://developers.docusign.com
 * 2. Create an app → copy Integration Key, Account ID, User ID
 * 3. Generate RSA keypair in the app → paste private key in DOCUSIGN_PRIVATE_KEY env var
 * 4. Grant consent once by visiting:
 *    https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation
 *      &client_id=YOUR_INTEGRATION_KEY&redirect_uri=http://localhost:3000
 */

const DS_BASE_URL   = process.env.DOCUSIGN_BASE_URL   || 'https://demo.docusign.net/restapi';
const DS_AUTH_URL   = 'https://account-d.docusign.com'; // demo; use account.docusign.com for prod
const INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY!;
const ACCOUNT_ID      = process.env.DOCUSIGN_ACCOUNT_ID!;
const USER_ID         = process.env.DOCUSIGN_USER_ID!;
const PRIVATE_KEY     = (process.env.DOCUSIGN_PRIVATE_KEY || '').replace(/\\n/g, '\n');

// ── JWT token cache ───────────────────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  if (!INTEGRATION_KEY || !USER_ID || !PRIVATE_KEY || PRIVATE_KEY.includes('your_private_key')) {
    throw new Error('DocuSign credentials not configured. See .env for setup instructions.');
  }

  // Build JWT assertion
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: INTEGRATION_KEY,
    sub: USER_ID,
    aud: 'account-d.docusign.com',
    iat: now,
    exp: now + 3600,
    scope: 'signature impersonation',
  })).toString('base64url');

  const crypto = await import('crypto');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(PRIVATE_KEY, 'base64url');
  const assertion = `${header}.${payload}.${signature}`;

  const res = await fetch(`${DS_AUTH_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DocuSign auth failed: ${err}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken!;
}

// ── Build contract document as plain text (base64) ───────────────────────────
export function buildContractDocument(contract: {
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  propertyAddress: string;
  monthlyRent: number;
  securityDeposit: number;
  leaseDuration: string;
  startDate: string;
  endDate: string;
  noticePeriod: string;
  terms: string;
  policies: string;
  owner: { fullName: string; email: string };
  lawyer: { fullName: string; email: string };
}): string {
  const text = `
RENTAL AGREEMENT
================

Prepared by: ${contract.lawyer.fullName} (${contract.lawyer.email})
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

PARTIES
-------
Owner:  ${contract.owner.fullName} (${contract.owner.email})
Tenant: ${contract.tenantName} (${contract.tenantEmail}) | ${contract.tenantPhone}

PROPERTY
--------
Address: ${contract.propertyAddress}

FINANCIAL TERMS
---------------
Monthly Rent:     ₹${contract.monthlyRent?.toLocaleString('en-IN') || 0}
Security Deposit: ₹${contract.securityDeposit?.toLocaleString('en-IN') || 0}
Lease Duration:   ${contract.leaseDuration}
Start Date:       ${contract.startDate}
End Date:         ${contract.endDate}
Notice Period:    ${contract.noticePeriod}

${contract.terms}

${contract.policies}

SIGNATURES
----------
Owner Signature: ____________________________  Date: ____________

By signing above, the owner agrees to all terms and conditions stated in this agreement.
`.trim();

  return Buffer.from(text).toString('base64');
}

// ── Create envelope and return embedded signing URL ───────────────────────────
export async function createSigningUrl(params: {
  contractId: string;
  ownerName: string;
  ownerEmail: string;
  documentBase64: string;
  returnUrl: string;
}): Promise<string> {
  const token = await getAccessToken();

  // 1. Create envelope
  const envelopeBody = {
    emailSubject: 'Please sign your rental agreement',
    documents: [{
      documentBase64: params.documentBase64,
      name: 'Rental Agreement',
      fileExtension: 'txt',
      documentId: '1',
    }],
    recipients: {
      signers: [{
        email: params.ownerEmail,
        name: params.ownerName,
        recipientId: '1',
        clientUserId: params.contractId, // marks as embedded signer
        tabs: {
          signHereTabs: [{
            anchorString: 'Owner Signature:',
            anchorXOffset: '140',
            anchorYOffset: '-5',
            anchorUnits: 'pixels',
          }],
          dateSignedTabs: [{
            anchorString: 'Date: ____________',
            anchorXOffset: '0',
            anchorYOffset: '-5',
            anchorUnits: 'pixels',
          }],
        },
      }],
    },
    status: 'sent',
  };

  const envRes = await fetch(`${DS_BASE_URL}/v2.1/accounts/${ACCOUNT_ID}/envelopes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(envelopeBody),
  });

  if (!envRes.ok) {
    const err = await envRes.text();
    throw new Error(`DocuSign create envelope failed: ${err}`);
  }

  const { envelopeId } = await envRes.json();

  // 2. Get recipient view (embedded signing URL)
  const viewRes = await fetch(
    `${DS_BASE_URL}/v2.1/accounts/${ACCOUNT_ID}/envelopes/${envelopeId}/views/recipient`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: params.returnUrl,
        authenticationMethod: 'none',
        email: params.ownerEmail,
        userName: params.ownerName,
        clientUserId: params.contractId,
      }),
    }
  );

  if (!viewRes.ok) {
    const err = await viewRes.text();
    throw new Error(`DocuSign recipient view failed: ${err}`);
  }

  const { url } = await viewRes.json();
  return url;
}
