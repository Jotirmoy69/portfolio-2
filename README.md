# Jotirmoy Bhowmik — Portfolio

Personal site for **Jotirmoy Bhowmik** — full-stack developer and co-founder of Hylith (Rajshahi, Bangladesh).

**Live:** [jotirmoy.vercel.app](https://jotirmoy.vercel.app)

## What’s included

- Portfolio homepage (work, about, services, writing preview)
- Markdown-powered blog (`/blog` + `/blog/[slug]`)
- Contact popup (email, LinkedIn, GitHub, Instagram)
- Motion (Lenis smooth scroll, custom cursor, stairs page transition)
- SEO: metadata, Open Graph, sitemap, `robots.txt`, JSON-LD, `llms.txt`

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Motion | Motion + Lenis |
| Blog | Markdown + `gray-matter` + `react-markdown` |
| Deploy | Vercel |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve the build
npm run lint    # ESLint
```

## Environment

Copy `.env.example` and set your public site URL (no trailing slash):

```bash
NEXT_PUBLIC_SITE_URL=https://jotirmoy.vercel.app
```

On Vercel: **Project → Settings → Environment Variables**. Use your custom domain here when you attach one. This value drives canonical URLs, the sitemap, Open Graph, and JSON-LD.

## Project structure (high level)

```
content/blog/          ← blog posts (Markdown)
public/                ← images, llms.txt
src/
  app/                 ← routes (home, /blog, icons, sitemap)
  components/          ← UI, sections, motion, contact
  content/site.ts      ← name, about, projects, services, socials
  content/seo.ts       ← titles, keywords, structured data helpers
  lib/blog.ts          ← loads & sorts Markdown posts
```

## Editing site content

Most non-blog copy lives in [`src/content/site.ts`](src/content/site.ts):

- Name, role, location, email, social links
- Hero intro
- About / statement text
- Projects (covers, links, close-up images)
- Services

Project mockups usually go in `public/` (e.g. `public/hylith_mockup.jpg`) and are referenced as `/hylith_mockup.jpg`.

## How to add a new blog post

You do **not** hardcode posts in React. Drop a Markdown file into `content/blog/` and redeploy.

### 1. Create a file

```
content/blog/your-post-slug.md
```

The filename (without `.md`) becomes the URL:

```
https://your-domain.com/blog/your-post-slug
```

Use lowercase kebab-case: `how-to-reduce-llm-costs.md` → `/blog/how-to-reduce-llm-costs`.

### 2. Add frontmatter and body

```md
---
title: How to Reduce LLM Costs in Production
description: Practical ways to cut LLM spend—caching, model routing, tighter prompts, and agent limits.
date: 2026-04-20
tags:
  - ai
  - llm
  - production
---

Write your article in Markdown.

## Section heading

More paragraphs, lists, and **emphasis** as needed.
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Yes | Page title & list heading |
| `description` | Yes | SEO meta + list preview |
| `date` | Yes | ISO date `YYYY-MM-DD` (newest posts sort first) |
| `tags` | No | Shown on the post page |

### 3. What updates automatically

After you save the file (and rebuild / redeploy):

- `/blog` list
- Homepage “Writing” preview (latest 3)
- `/blog/your-post-slug` article page
- `sitemap.xml`
- Per-post metadata + `BlogPosting` JSON-LD

### 4. Publish

```bash
git add content/blog/your-post-slug.md
git commit -m "Add blog post: your post title"
git push
```

Vercel builds the new post on deploy. Locally, restart or refresh `npm run dev` if a new file does not show up yet.

### Tips

- Keep descriptions ~140–160 characters for clean search snippets.
- Prefer one clear idea per post; use `##` headings for structure.
- To remove a post, delete its `.md` file and redeploy.
- Existing examples live in [`content/blog/`](content/blog/).

## Scripts reference

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | Lint |

## License

Private portfolio project — all rights reserved unless you add a license later.
