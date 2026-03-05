import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import type { LeadPayload } from '@/types';
import { resultStore } from '@/lib/store';

// In-memory store for development (replace with DB in production)
const leads: LeadPayload[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadPayload;

    // Basic validation
    if (!body.email && body.email !== 'anonymous') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const token = randomUUID();

    const lead: LeadPayload = {
      ...body,
      token,
      createdAt: body.createdAt ?? new Date().toISOString(),
    };

    leads.push(lead);

    // Store full result data under token
    resultStore.set(token, {
      token,
      score: body.score,
      categoryScores: body.categoryScores,
      leaks: body.leaks ?? [],
      qualified: body.qualified,
      answers: body.answers,
      contact: {
        email: body.email,
        name: body.name,
        linkedinUrl: body.linkedinUrl,
      },
      createdAt: lead.createdAt,
    });

    // Log in dev
    if (process.env.NODE_ENV === 'development') {
      console.log('[Lead submitted]', {
        token,
        email: lead.email,
        score: lead.score,
        qualified: lead.qualified,
        createdAt: lead.createdAt,
      });
    }

    // Optional webhook forwarding
    const webhookUrl = process.env.WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        });
      } catch (err) {
        console.error('[Webhook] Failed to forward lead:', err);
      }
    }

    return NextResponse.json({ success: true, token, leadsTotal: leads.length });
  } catch (err) {
    console.error('[Lead API] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Dev-only: list all leads
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ leads, total: leads.length });
}
