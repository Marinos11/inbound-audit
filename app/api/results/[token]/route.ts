import { NextRequest, NextResponse } from 'next/server';
import { resultStore } from '@/lib/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  const result = resultStore.get(token);

  if (!result) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Never expose contact info via API (privacy)
  const { contact: _contact, ...safeResult } = result;

  return NextResponse.json(safeResult);
}
