Here is a clean, **submission-ready `README.md`** that satisfies all your requirements exactly:

---

# 📘 Course App (React Native + Supabase + SQLite)

An **offline-first course management app** built with React Native (Expo), Supabase, and SQLite.

It supports:

* Offline cached course browsing
* Background sync with Supabase
* Search, filter, and sorting
* Course detail view with enrollment persistence

---

# 🚀 Supabase Project Setup

## 1. Create Project

Go to 👉 [https://supabase.com](https://supabase.com)
Create a new project and wait for database initialization.

---

## 2. Enable Database

Use Supabase SQL Editor to create required tables (see schema below).

---

## 3. Environment Variables Setup

Create a `.env` file in the root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

⚠️ Important:

* Never hardcode secrets inside code
* Never commit `.env` to GitHub

---

## 4. Supabase Client Setup

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

# 🗄️ Database Schema

## 📌 Courses Table

```sql
create table courses (
  course_id text primary key,
  title text not null,
  description_short text,
  instructor_id text,
  instructor_name text not null,
  instructor_expertise_level text,
  duration_weeks int not null,
  price_usd numeric not null,
  is_premium boolean not null,
  tags text[],
  rating numeric not null,
  last_updated text
);
```

---

## 📌 Optional: User Enrollment Table

```sql
create table user_enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  course_id text not null,
  is_enrolled boolean default true
);
```

---

# 🔐 Row Level Security (RLS)

## Enable RLS

```sql
alter table courses enable row level security;
```

---

## Allow Public Read Access

```sql
create policy "Allow public read access"
on courses
for select
using (true);
```

---

## Optional: Authenticated Write Access

```sql
create policy "Allow insert for authenticated users"
on courses
for insert
with check (auth.role() = 'authenticated');
```

---

# ⚠️ Security Notes

* ❌ Do NOT hardcode Supabase keys in source code
* ❌ Do NOT expose service role key in frontend
* ✅ Use `.env` file with `EXPO_PUBLIC_` prefix (Expo safe)
* ✅ Use RLS policies to protect data access

---

# 🧠 Assumptions

* Courses are global (shared for all users)
* Enrollment is user-specific (stored locally or in separate table)
* SQLite is used for offline caching
* Supabase is the source of truth for remote data
* Local fields like `is_enrolled` must NOT be overwritten during sync

---

# 🔄 Data Flow (Offline First)

```
App Start
   ↓
Load SQLite (instant UI)
   ↓
Fetch Supabase (background sync)
   ↓
Update local DB
   ↓
Refresh UI
```

---

# 📦 Tech Stack

* React Native (Expo Router)
* Supabase (Backend)
* SQLite (Local storage)
* Redux Toolkit
* TypeScript

---

# ✨ Features

* Offline-first course list
* Supabase sync engine
* Course search, filter, sort
* Course detail screen
* Enrollment toggle (persisted locally)
* Instant UI updates across screens

