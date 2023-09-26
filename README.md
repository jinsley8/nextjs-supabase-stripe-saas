# Next.js with Supabase and Stripe Subscriptions

## SQL for Supabase

Run as a new SQL Query in Supabase SQL Editor.

```sql
-- PROFILES
CREATE TABLE IF NOT EXISTS public.profile (
    id                  uuid references auth.users(id) on delete cascade PRIMARY KEY,
    email               text UNIQUE,
    is_subscribed       boolean NOT NULL DEFAULT false,
    interval            text,
    stripe_customer     text,
    created_at          timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
comment on table public.profile is 'Profile data for active users';

-- LESSONS
CREATE TABLE IF NOT EXISTS public.lesson (
    id                  bigint generated always as identity PRIMARY KEY,
    text                text,
    description         text,
    created_at          timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
comment on table public.lesson is 'Lessons for users to view';

-- PREMIUM CONTENT
CREATE TABLE IF NOT EXISTS public.premium_content (
    id                  bigint generated always as identity PRIMARY KEY,
    video_url           text,
    created_at          timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
comment on table public.premium_content is 'Premium content for lessons';

-- ENABLE RLS POLICIES
ALTER TABLE public.profile enable row level security;
ALTER TABLE public.lesson enable row level security;
ALTER TABLE public.premium_content enable row level security;

-- CREATE RLS POLICIES
CREATE POLICY "Only user can select their own profile" ON public.profile FOR
SELECT
USING (auth.uid() = id)

CREATE POLICY "Enable read access for all users" ON public.lesson FOR
SELECT
USING (true);

CREATE POLICY "Subscribed users can select premium content" ON public.lesson FOR
SELECT
USING (EXISTS
    (SELECT 1
    FROM public.profile
    WHERE ((auth.uid() = profile.id) AND (profile.is_subscribed = true))))

-- Trigger automatically creates a public.profile entry when a new user is created in auth.users.
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER
AS $$
    BEGIN
        INSERT INTO public.profile (id, email)
        VALUES (NEW.id, NEW.email);
        RETURN NEW;
    END;
$$
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public;

CREATE TRIGGER create_new_profile_for_user
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();
```

## Login with GitHub

Setup OAuth with GitHub. Follow the [guide outlined by Supabase](https://supabase.com/docs/guides/auth/social-login/auth-github).


## Stripe

Setup a Stripe account and [create checkout](https://stripe.com/docs/checkout/quickstart).

## Next.js Auth Helpers for Supabase

Use the new Supabase [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) to get client-side and server-side sessions if using `@supabase/supabase-js` v2 JS client library.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
