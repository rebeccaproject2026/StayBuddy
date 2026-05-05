import mongoose, { Schema, Document } from 'mongoose';

export type ContractStatus =
  | 'DRAFT'
  | 'PENDING_OWNER_REVIEW'
  | 'REVISION_REQUIRED'
  | 'OWNER_SIGNED'
  | 'PENDING_TENANT_REVIEW'
  | 'TENANT_SIGNED';

export interface IContract extends Document {
  lawyer: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  property?: mongoose.Types.ObjectId;
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
  revisionNote?: string;
  status: ContractStatus;
  ownerSignature?: string;
  ownerSignedAt?: Date;
  tenantSignature?: string;
  tenantSignedAt?: Date;
  tenantSignToken?: string; // one-time token for tenant signing link
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<IContract>(
  {
    lawyer:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
    property:        { type: Schema.Types.ObjectId, ref: 'Property' },
    tenantName:      { type: String, default: '' },
    tenantEmail:     { type: String, default: '' },
    tenantPhone:     { type: String, default: '' },
    propertyAddress: { type: String, default: '' },
    monthlyRent:     { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    leaseDuration:   { type: String, default: '11 months' },
    startDate:       { type: String, default: '' },
    endDate:         { type: String, default: '' },
    noticePeriod:    { type: String, default: '1 month' },
    terms:           { type: String, default: '' },
    policies:        { type: String, default: '' },
    revisionNote:    { type: String },
    status:          { type: String, enum: ['DRAFT','PENDING_OWNER_REVIEW','REVISION_REQUIRED','OWNER_SIGNED','PENDING_TENANT_REVIEW','TENANT_SIGNED'], default: 'DRAFT' },
    ownerSignature:  { type: String },
    ownerSignedAt:   { type: Date },
    tenantSignature: { type: String },
    tenantSignedAt:  { type: Date },
    tenantSignToken: { type: String },
  },
  { timestamps: true }
);

ContractSchema.index({ lawyer: 1, createdAt: -1 });
ContractSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.models.Contract ||
  mongoose.model<IContract>('Contract', ContractSchema);
