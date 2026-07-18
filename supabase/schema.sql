-- Run this whole file once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create extension if not exists "pgcrypto";

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_name text not null,
  content text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;
alter table comments enable row level security;

-- Anyone can read published posts.
create policy "posts_public_read"
  on posts for select
  using (published = true);

-- The logged-in admin can read everything, including drafts.
create policy "posts_admin_read_all"
  on posts for select
  to authenticated
  using (true);

-- Only the logged-in admin can create, edit, or delete posts.
create policy "posts_admin_insert"
  on posts for insert
  to authenticated
  with check (true);

create policy "posts_admin_update"
  on posts for update
  to authenticated
  using (true)
  with check (true);

create policy "posts_admin_delete"
  on posts for delete
  to authenticated
  using (true);

-- Anyone can read comments.
create policy "comments_public_read"
  on comments for select
  using (true);

-- Anyone (including your friends, with no account) can post a comment.
create policy "comments_public_insert"
  on comments for insert
  with check (true);

-- Only the logged-in admin can edit or delete comments (e.g. remove spam).
create policy "comments_admin_update"
  on comments for update
  to authenticated
  using (true)
  with check (true);

create policy "comments_admin_delete"
  on comments for delete
  to authenticated
  using (true);

create index if not exists comments_post_id_idx on comments(post_id);
