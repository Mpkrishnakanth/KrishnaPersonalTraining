# Krishna Kanth — Personal Trainer Portfolio

A static, GitHub Pages-friendly portfolio for a personal trainer focused on strength training, biomechanics, and nutrition habits.

## Pages
- `index.html` — main portfolio
- `contact.html` — consultation / booking page
- `styles.css` — responsive design system
- `script.js` — navigation, reveal animations, calendar link integration
- `assets/` — portfolio photography

## Connect the booking calendar
Open `script.js` and replace:

```js
const BOOKING_URL = "";
```

with your Google Calendar appointment schedule, Calendly, Cal.com, or another booking link.

Example:

```js
const BOOKING_URL = "https://calendar.app.google/your-booking-link";
```

## Contact form
The consultation form is currently a front-end demo and does not transmit visitor information. Before launch, connect it to a service such as Formspree, Netlify Forms, or your own backend.

## GitHub Pages
This site uses only relative file paths and can be hosted directly with GitHub Pages.


## Client review system (GitHub Pages + Supabase)

The homepage now includes a client review wall and a moderated review submission form. The UI works immediately, but persistent public reviews need a small database because GitHub Pages is static. The included `reviews.js` is already wired for Supabase.

1. Create a Supabase project.
2. Open **SQL Editor** and run:

```sql
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  rating integer not null check (rating between 1 and 5),
  goal text not null,
  review text not null check (char_length(review) between 1 and 700),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Public can read approved reviews"
on public.reviews
for select
using (approved = true);

create policy "Anyone can submit pending reviews"
on public.reviews
for insert
with check (approved = false);
```

3. In Supabase, copy **Project URL** and the **anon/public key**.
4. Open `reviews.js` and paste them into `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
5. Push the change to GitHub.
6. New submissions will arrive with `approved = false`. Review them in **Table Editor → reviews** and switch `approved` to `true` only for reviews you want to publish.

Do not place a Supabase service-role key in the website. Only use the anon/public key.
