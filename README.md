# bibibigbar — The Big Little Show

A personal website styled as a vintage circus: a cream-and-vermilion playbill, an original SVG circus tent with interactive lighting, a personal introduction, and a live journal feed. Existing Dallas–Fort Worth topic boards, member workspaces, and admin tools remain available.

## Features

- Responsive **bibibigbar** landing page with program, introduction, journal, and invitation sections
- Keyboard-accessible stage lighting toggle and reduced-motion support
- System font stacks and self-contained illustration; no external image or font downloads needed
- Multiple topic boards (Free Talk, Living Tips, Housing, Food, Jobs, Marketplace, Q&A)
- Member area (`/my`) for writing and managing your own posts
- Admin console (`/admin`) for boards, moderation, and user roles
- Cookie-based sign-in for the site owner only

## Account

Sign-in is limited to `bibibigbar@gmail.com`. Set the password in `.env.local` as `ADMIN_PASSWORD`. There is no public registration.

## Tech stack

- Next.js 15 App Router + React + TypeScript
- Tailwind CSS + custom design tokens
- Server Actions + JSON file store (`data/store.json`)
- JWT session cookies (`jose` + `bcryptjs`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- The first run seeds `data/store.json` automatically.
- This store is intended for local / demo use. For production, swap it for a real database (e.g. Supabase / Postgres).
- GitHub Pages static export was removed because writing posts requires a Node server.
