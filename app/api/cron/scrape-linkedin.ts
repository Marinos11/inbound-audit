import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const apifyToken = process.env.APIFY_API_TOKEN || '';

if (!supabaseUrl || !supabaseServiceKey || !apifyToken) {
  console.error('Missing environment variables for LinkedIn scraping');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

interface ApifyActorInput {
  urlOrHandle: string;
  maxResultsCount?: number;
  maxRequestsPerMinute?: number;
}

interface LinkedInPost {
  url: string;
  text?: string;
  likesCount?: number;
  commentsCount?: number;
  repostsCount?: number;
  impressions?: number;
  postedDate?: string;
}

interface Client {
  id: string;
  name: string;
  linkedin_url?: string;
}

async function callApifyActor(input: ApifyActorInput): Promise<LinkedInPost[]> {
  if (!apifyToken) throw new Error('APIFY_API_TOKEN not set');

  const response = await fetch('https://api.apify.com/v2/acts/apify~linkedin-profile-scraper/call', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apifyToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...input,
      maxResultsCount: input.maxResultsCount || 50,
      maxRequestsPerMinute: input.maxRequestsPerMinute || 60,
    }),
  });

  if (!response.ok) {
    throw new Error(`Apify API error: ${response.statusText}`);
  }

  const data = await response.json();
  const runId = data.data.id;

  // Poll for completion
  let isRunning = true;
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max wait

  while (isRunning && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    attempts++;

    const statusResponse = await fetch(
      `https://api.apify.com/v2/acts/apify~linkedin-profile-scraper/runs/${runId}`,
      {
        headers: { 'Authorization': `Bearer ${apifyToken}` }
      }
    );

    const statusData = await statusResponse.json();
    isRunning = statusData.data.status === 'RUNNING';
  }

  // Get results
  const resultsResponse = await fetch(
    `https://api.apify.com/v2/acts/apify~linkedin-profile-scraper/runs/${runId}/dataset/items`,
    {
      headers: { 'Authorization': `Bearer ${apifyToken}` }
    }
  );

  if (!resultsResponse.ok) {
    throw new Error('Failed to fetch Apify results');
  }

  const results = await resultsResponse.json();
  return results || [];
}

async function scrapeClientPosts(client: Client): Promise<void> {
  if (!client.linkedin_url) {
    console.log(`Skipping ${client.name}: no LinkedIn URL`);
    return;
  }

  try {
    console.log(`Scraping posts for ${client.name}...`);

    // Extract username from LinkedIn URL
    const match = client.linkedin_url.match(/(?:linkedin\.com\/in\/|linkedin\.com\/company\/)([a-zA-Z0-9\-]+)/);
    if (!match) {
      console.warn(`Invalid LinkedIn URL for ${client.name}: ${client.linkedin_url}`);
      return;
    }

    const username = match[1];

    // Call Apify Actor
    const posts = await callApifyActor({
      urlOrHandle: username,
      maxResultsCount: 50,
    });

    // Store in Supabase
    for (const post of posts) {
      const { error } = await supabase
        .from('linkedin_posts')
        .upsert({
          client_id: client.id,
          post_url: post.url || '',
          post_text: post.text || null,
          likes_count: post.likesCount || 0,
          comments_count: post.commentsCount || 0,
          reposts_count: post.repostsCount || 0,
          impressions_count: post.impressions || 0,
          posted_at: post.postedDate || null,
          scraped_at: new Date().toISOString(),
        }, {
          onConflict: 'client_id,post_url'
        });

      if (error) {
        console.error(`Error storing post for ${client.name}:`, error);
      }
    }

    console.log(`✓ Scraped ${posts.length} posts for ${client.name}`);
  } catch (error) {
    console.error(`Failed to scrape ${client.name}:`, error);
  }
}

export async function GET(request: NextRequest) {
  // Verify Vercel Cron Secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting LinkedIn post scraping...');

    // Fetch all clients
    const { data: clients, error } = await supabase
      .from('clients')
      .select('id, name, linkedin_url')
      .returns<Client[]>();

    if (error) {
      throw error;
    }

    // Scrape posts for each client
    for (const client of clients || []) {
      await scrapeClientPosts(client);
    }

    console.log('LinkedIn scraping completed');
    return NextResponse.json({ success: true, message: 'Scraping completed' });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
