import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contract from '@/models/Contract';
import { authenticateUser } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    
    if (user.role !== 'lawyer') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const lawyerId = user.id;

    // Get all contracts for this lawyer
    const allContracts = await Contract.find({ lawyer: lawyerId });

    // Calculate statistics
    const totalContracts = allContracts.length;
    
    // Pending: DRAFT, PENDING_OWNER_REVIEW, PENDING_TENANT_REVIEW
    const pendingContracts = allContracts.filter(c => 
      ['DRAFT', 'PENDING_OWNER_REVIEW', 'PENDING_TENANT_REVIEW'].includes(c.status)
    ).length;
    
    // Approved: OWNER_SIGNED, TENANT_SIGNED (fully signed)
    const approvedContracts = allContracts.filter(c => 
      ['OWNER_SIGNED', 'TENANT_SIGNED'].includes(c.status)
    ).length;
    
    // Rejected: REVISION_REQUIRED
    const rejectedContracts = allContracts.filter(c => 
      c.status === 'REVISION_REQUIRED'
    ).length;
    
    // Expired in last 7 days (contracts with endDate in the past 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const expiredContracts = allContracts.filter(c => {
      if (!c.endDate) return false;
      const endDate = new Date(c.endDate);
      const now = new Date();
      return endDate < now && endDate >= sevenDaysAgo;
    }).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalContracts,
        pendingContracts,
        approvedContracts,
        rejectedContracts,
        expiredContracts,
      },
    });
  } catch (error: any) {
    console.error('Error fetching lawyer stats:', error);
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
}
