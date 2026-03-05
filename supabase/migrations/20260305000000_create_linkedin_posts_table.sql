-- Create linkedin_posts table
create table if not exists public.linkedin_posts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null,
  post_url text not null,
  post_text text,
  likes_count integer default 0,
  comments_count integer default 0,
  reposts_count integer default 0,
  impressions_count integer default 0,
  posted_at timestamp with time zone,
  scraped_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  constraint fk_client foreign key (client_id) references public.clients(id) on delete cascade,
  constraint unique_post_per_client unique(client_id, post_url)
);

-- Create index for faster queries
create index if not exists idx_linkedin_posts_client_id on public.linkedin_posts(client_id);
create index if not exists idx_linkedin_posts_posted_at on public.linkedin_posts(posted_at);
create index if not exists idx_linkedin_posts_scraped_at on public.linkedin_posts(scraped_at);

-- Enable Row Level Security
alter table public.linkedin_posts enable row level security;

-- Create policies for RLS (adjust based on your auth model)
create policy "Enable read for authenticated users" on public.linkedin_posts
  for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for service role" on public.linkedin_posts
  for insert
  with check (auth.role() = 'service_role');

create policy "Enable update for service role" on public.linkedin_posts
  for update
  using (auth.role() = 'service_role');
