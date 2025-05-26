---
title: "Yotes: My Quest to Build a Notes App That’s Actually Mine"
description: "Yotes!!! A Privacy Focused Notes App.. umm it's bit more than that. Come on Dive in."
date: 2024-02-26
author: "Yashraj Maher"
website: "yotes.vercel.app"
tags: [Supabase, Google Drive API, IndexedDB, Open Source, Web Development]  
---
Hey, I’m Yashraj Maher ([rajofearth](https://github.com/rajofearth)), and Yotes is my brainchild—a privacy-first notes app I’ve been hammering away at since late 2024. It’s not just for scribbling thoughts; it’s about owning them, no subscriptions, no corporate clouds. Yotes lives in your Google Drive, piggybacks on your storage, and dreams of being more—a hub for notes, files, and wild ideas. It’s live at [yotes.vercel.app](https://yotes.vercel.app), and this is the raw, unfiltered tale of how it came to life.

This isn’t some polished tech manual. It’s the real deal—late-night coding, maddening bugs, and the rush of cracking them. Over 40 commits, a sprawling codebase, and a vision that’s still unfolding, Yotes is my rebellion. An AI critic’s nudged me to push it further, and I’m game. Grab a drink; let’s roll through this journey.

---

## The Spark: Why Yotes?

I was fed up with notes apps. Evernote, Notion—they’re slick, sure, but they want your cash or your data, often both. Your words sit on their servers, locked away. Open-source champs like Obsidian caught my eye—privacy-first, community-driven—but they weren’t my fit. They’re heavyweight, guzzling compute, memory, and brainpower with steep learning curves. As a student juggling space science, web dev, and uni chaos, I didn’t have the bandwidth for that. I needed something lean, something *mine*.

Enter Google Drive—free, 15GB, right there. Why not use it? Yotes started as my escape hatch: a simple, dark-themed app (think JetBrains Mono and Tailwind CSS) to stash notes in my Drive. No fluff, just function. But it clicked—mathematically, there’s gotta be others like me, students or devs who want this too. So I built Yotes, and it felt just right.

---

## What Yotes Is Now

As of February 26, 2025, Yotes is a scrappy, solid notes tool:

- **Your Notes, Your Drive**: Create, edit, delete—notes land in a “Yotes App” folder in your Google Drive. No middleman—it’s your space.
- **Tags That Stick**: Custom tags (“Work,” “Ideas”) sync to `tags.json`. Newbies get a “Welcome to Yotes!” note with a “Getting Started” tag.
- **Find It Fast**: Search or filter by tags on the homepage. Quick, no fuss.
- **Heatmap Vibes**: Settings has a GitHub-style heatmap of your note activity over the past year—coder cred baked in.
- **Looks Good Anywhere**: Dark mode default, mobile and desktop ready, dev-friendly font.
- **Google Login**: Google OAuth via Supabase, scoped to just Drive file access.
- **Little Toasts**: Save a note, see “Note saved.” Screw up? It’ll tell you.

Hit [yotes.vercel.app](https://yotes.vercel.app) to try it. Getting here, though? That’s where the sweat comes in.

---

## The Journey: Blood, Sweat, and Code

Yotes kicked off in December 2024 with a blank slate. Over two months—minus a January break—it grew into something real. Here’s the ride, bumps and all.

### December 2024: Stumbling Out the Gate

It kicked off December 4 with a “Zeroth Commit”—bare React + Vite bones. I added Vercel Analytics and mocked up UI: `NoteCard`, some tags. December 5, Supabase brought Google OAuth to `App.jsx`, routing Home, Login, Signup. OAuth was silent—users clueless—so I added `ToastContext.jsx` for whispers like “Logging in…” By the 8th, `ProtectedRoute` locked pages, and `GoogleDriveContext.jsx` hit Drive. Sync lagged, so I cached in `localStorage`—a hasty move I’d ditch later. The 13th split `NoteDetail` into `EditNote` and `ViewNote`, adding deletes to `NoteCard.jsx`. I saw duplicates in Drive and relogin risks, but December didn’t crack ‘em—left that for February.

### January 2025: The Hiatus

January was a ghost town for Yotes. Uni hit hard—exams, projects—and I was rebuilding my personal site ([yashrajmaher.vercel.app](https://yashrajmaher.vercel.app)), where this post’ll live. No commits, just survival mode.

### February 2025: Grit and Grind

February 21, I stormed back after a January blackout—uni and rebuilding [yashrajmaher.vercel.app](https://yashrajmaher.vercel.app) ate me alive. Added `settings.jsx`—stats, tags, heatmap. Search in `home.jsx` got filters, but infinite loops hit; I yanked `notes` and `tags` from `useNotes.js`’s `loadData` deps. Ditched email/password login for Google-only in `loginLogic.js`, axed Signup. Tokens expiring hourly—relogins—haunted me. Tried patches in `GoogleDriveContext.jsx`, no dice yet.

February 23, I dropped a README and wrestled sessions. The 24th, swapped `localStorage` for IndexedDB in `useNotes.js`—offline mode’s my tough dream—but tossed Supabase sessions in there too, maybe breaking token refreshes. Duplicates? I punt one when they pop—not solved, just guarded. February 25, nada—internet died, postpaid data bills hit $63. Student life, man, it stings. February 26, I moved Supabase sessions back to defaults, hoping to fix relogins. Added `TextShimmer.tsx` to `ProgressBar.jsx`, `NavBar.jsx` got a dropdown, `groupNotesByDate.js` sped up 30%. But the relogin beast? Still alive. My fixes flopped—I’m burned, F.I.N.E.: Feeling overwhelmed, I’m not alright, Not sleeping, Every night.

---

## The Grit: Battles I Fought

- **Token Hell**: Hourly relogins plagued me ‘til February 26. LocalStorage-to-IndexedDB for Supabase sessions backfired—refreshes failed. Reverted to Supabase defaults and won.
- **Duplicate Ghosts**: Drive sync spawned twins. I punt one duplicate now—full fix pending.
- **Loading Lag**: Drive sync lagged UI. IndexedDB-first load and a shiny `ProgressBar` smoothed it.
- **Mobile Mess**: Heatmap overflowed phones. `overflow-x: auto` in `heatmap.css` tamed it.

Every fix was a late-night slugfest—OAuth docs, cold coffee, and victory yells.

---

## The Code: Yotes’ Heart

The codebase is my soul—rough, real, working:
- **`useNotes.js`**: CRUD, 5-second Drive sync, IndexedDB caching since February 24.
  ```javascript
  useEffect(() => {
    const interval = setInterval(() => syncToGoogleDrive(tags, notes), 5000);
    return () => clearInterval(interval);
  }, [syncToGoogleDrive, tags, notes]);
  ```
- **`GoogleDriveContext.jsx`**: Drive API, token juggling.
- **`NavBar.jsx`**: Search, create, logout—now a dropdown.

Built on React 18, Tailwind 3.4, Supabase—check the repo.

---

## The Future: TODOs and Dreams

An AI critic lit a fire—here’s my plan, blending their ideas with mine:
- **Design**: ARIA labels, shortcuts (`Ctrl + N`), rich text editor (TipTap).
- **Sessions**: Proactive token refresh at 90% expiry, secure cookies or encryption.
- **Auth**: Granular errors (network vs. cancel), session validation on load.
- **Storage**: Versioned notes for conflict-free edits, delta syncs over 5-second blasts.
- **More**: Mobile tag fix, static pages (Privacy, Terms), PDF views, AI summaries, file drops.

---

## The Soul: What I Learned

- **Privacy’s a Fight**: Drive sync was brutal, but owning my data’s worth it.
- **Code’s Alive**: Each commit’s a scar or a trophy.
- **Life Happens**: January’s hiatus and February 25’s outage—student struggles are real.

---

## Join Me

Clone it: `git clone https://github.com/rajofearth/yotes.git`, `npm install`, set `.env`, `npm run dev`. Open-source—fork it, tweak it, PR it.

---

## The End (For Now)

Yotes is my fight—two months of grit, from scratch to a tool I love, flaws and all. The relogin bug’s kicking my ass—my fixes flopped, and I’m burned. F.I.N.E., as Kyle Hume sings it: ***F**eeling overwhelmed, **I**’m not alright, **N**ot sleeping, **E**very night* ([check the lyrics](https://genius.com/Kyle-hume-fine-lyrics)). With March exams looming, Yotes might hibernate a bit. I’m wrecked but proud. Try [yotes.vercel.app](https://yotes.vercel.app)—tell me your dream feature on GitHub ([rajofearth](https://github.com/rajofearth)). I’ll be back post-exams to slay this.

Yashraj

*Thanks to React, Tailwind, Supabase, and an AI spark keeping me honest.*

---
