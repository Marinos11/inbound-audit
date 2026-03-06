import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const apifyToken = process.env.APIFY_API_TOKEN;

// Apify LinkedIn scraper actor ID
const APIFY_LINKEDIN_ACTOR = 'apify/linkedin-company-posts-scraper';

interface LinkedInPost {
  url: string;
  text: string;
  likesCount?: number;
  commentsCount?: number;
  repostsCount?: number;
  impressionsCount?: number;
  postedAt?: string;
}

interface ApifyRun {
  data: {
    output: {
      results: LinkedInPost[];
    };
  };
}

export async function GET(request: NextRequest) {
  // Verify Vercel Cron Secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('LinkedIn post scraping cron job triggered');

    // 1. Fetch all clients from Supabase using REST API
    const clientsResponse = await fetch(
      `${supabaseUrl}/rest/v1/clients?select=id,linkedin_url&linkedin_url=not.is.null`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey!,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!clientsResponse.ok) {
      throw new Error(
        `Failed to fetch clients from Supabase: ${clientsResponse.status} ${clientsResponse.statusText}`
      );
    }

    const clients = await clientsResponse.json();

    if (!clients || clients.length === 0) {
      console.log('No clients with LinkedIn URLs found');
      return NextResponse.json({
        success: true,
        message: 'No clients to scrape',
        scrapedCount: 0
      });
    }

    let totalScraped = 0;
    const errors: string[] = [];

    // 2. For each client, scrape their LinkedIn posts
    for (const client of clients) {
      try {
        console.log(`Scraping LinkedIn for client ${client.id}`);

        // Call Apify to scrape LinkedIn posts
        const apifyRun = await callApifyActor(client.linkedin_url);

        if (!apifyRun.data.output.results) {
          console.log(`No posts found for client ${client.id}`);
          continue;
        }

        // 3. Store results in Supabase linkedin_posts table
        const postsToInsert = apifyRun.data.output.results.map((post: LinkedInPost) => ({
          client_id: client.id,
          post_url: post.url,
          post_text: post.text,
          likes_count: post.likesCount || 0,
          comments_count: post.commentsCount || 0,
          reposts_count: post.repostsCount || 0,
          impressions_count: post.impressionsCount || 0,
          posted_at: post.postedAt ? new Date(post.postedAt).toISOString() : null,
          scraped_at: new Date().toISOString()
        }));

        // Upsert posts (ignore duplicates based on unique constraint)
        const insertResponse = await fetch(
          `${supabaseUrl}/rest/v1/linkedin_posts?on_conflict=client_id,post_url`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey!,
              'Content-Type': 'application/json',
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(postsToInsert)
          }
        );

        if (!insertResponse.ok) {
          throw new Error(
            `Failed to insert posts for client ${client.id}: ${insertResponse.status} ${insertResponse.statusText}`
          );
        }

        const inserted = await insertResponse.json();
        totalScraped += Array.isArray(inserted) ? inserted.length : 0;
        console.log(`Scraped ${postsToInsert.length} posts for client ${client.id}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error scraping client ${client.id}:`, errorMsg);
        errors.push(`Client ${client.id}: ${errorMsg}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'LinkedIn scraping cron job completed',
      scrapedCount: totalScraped,
      clientsProcessed: clients.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function callApifyActor(linkedinUrl: string): Promise<ApifyRun> {
  if (!apifyToken) {
    throw new Error('APIFY_API_TOKEN not set');
  }

  // Extract LinkedIn profile/company name from URL
  const urlParts = linkedinUrl.split('/');
  const profileName = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];

  const apifyInput = {
    companyLinkedInUrls: [linkedinUrl],
    maxPostsPerCompany: 10,
    includeMetrics: true
  };

  // Start Apify actor run
  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/${APIFY_LINKEDIN_ACTOR}/runs?token=${apifyToken}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apifyInput)
    }
  );

  if (!runResponse.ok) {
    throw new Error(
      `Apify API error: ${runResponse.status} ${runResponse.statusText}`
    );
  }

  const runData = await runResponse.json();
  const runId = runData.data.id;

  // Wait for run to complete (with timeout)
  const maxAttempts = 60; // 5 minutes with 5-second intervals
  let attempts = 0;

  while (attempts < maxAttempts) {
    const statusResponse = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_LINKEDIN_ACTOR}/runs/${runId}?token=${apifyToken}`
    );

    if (!statusResponse.ok) {
      throw new Error(`Failed to check Apify run status: ${statusResponse.statusText}`);
    }

    const statusData = await statusResponse.json();
    const status = statusData.data.status;

    if (status === 'SUCCEEDED') {
      return statusData as ApifyRun;
    }

    if (status === 'FAILED' || status === 'ABORTED') {
      throw new Error(`Apify run failed with status: ${status}`);
    }

    // Wait 5 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error('Apify run timed out');
}
