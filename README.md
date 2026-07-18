# Notebook — a small personal blog

A minimal blog for you: post, edit, delete entries, and let friends leave comments
that you can reply to. Built with React + Vite, backed by Supabase (Postgres + auth).

## 1. Set up Supabase (free)

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Once it's ready, open **SQL Editor → New query**, paste the contents of
   `supabase/schema.sql`, and run it. This creates the `posts` and `comments`
   tables with the right permissions (anyone can read and comment, only you
   can create/edit/delete posts).
3. Go to **Authentication → Users → Add user** and create yourself an account
   with your email and a password. This is the only login the app will ever
   have — you, as the author.
4. Go to **Project Settings → API** and copy the **Project URL** and the
   **anon public key**.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=<your project URL>
VITE_SUPABASE_ANON_KEY=<your anon public key>
VITE_ADMIN_EMAIL=<the email you used in step 1.3>
```

The login page only asks for a password — your email is filled in behind the
scenes from this file, so it still feels like "just a password" to you.

## 3. Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL, click **Sign in**, enter your password, and click
**New entry** to write your first post.

## 4. Deploy (Vercel — recommended)

Vercel is the easiest fit for a Vite app and has a generous free tier.

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Vercel auto-detects Vite. Before deploying, add the same three environment
   variables from your `.env` file under **Settings → Environment Variables**.
4. Deploy. You'll get a URL like `notebook-yourname.vercel.app` you can share
   with friends.

Netlify works just as well if you'd rather use that — same steps, same env vars.

## How it works

- **Posts** live in a `posts` table. Only you (signed in) can create, edit, or
  delete them; everyone can read published ones.
- **Comments** live in a `comments` table. Anyone can leave one (just a name +
  message, no account needed). Only you can delete a comment. When you're
  signed in and reply, your comment is tagged `is_admin` so it's styled
  differently and always shows as "Nenad."
- There's no other login, no sign-up flow, and no public admin panel — the
  `/new` and `/edit/:slug` routes just redirect to `/login` if you're not
  signed in.

## Project structure

```
src/
  components/
    Header.jsx        top bar + sign in/out
    Login.jsx          password-only login
    PostList.jsx        homepage feed
    PostView.jsx         single entry + admin actions
    PostEditor.jsx        create/edit form
    CommentSection.jsx     comments + reply form
    RequireAdmin.jsx        route guard
  AuthContext.jsx      tracks your Supabase session
  supabaseClient.js      Supabase connection
supabase/schema.sql     run once in Supabase's SQL editor
```
# MyNotes
