# Deployment Guide — TransientBook

## 1. Push to GitHub

```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/colewan-design/transient-booking.git
git branch -M main
git push -u origin main
```

> After the first push, future updates are just:
> ```powershell
> git add .
> git commit -m "your message"
> git push
> ```
> Vercel auto-redeploys on every push to `main`.

---

## 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New... → Project**
2. Click **Adjust GitHub App Permissions** if the repo isn't showing → select the repo → Save
3. Import `transient-booking` → click **Deploy**

---

## 3. Add Environment Variables

Vercel → your project → **Settings → Environment Variables** → add all 3:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |
| `NEXT_PUBLIC_APP_URL` | `https://book.salidumay.com` |

After saving → **Deployments → three dots → Redeploy**

---

## 4. Add Custom Domain (book.salidumay.com)

**In Vercel:**
1. Project → **Settings → Domains**
2. Add `book.salidumay.com`
3. Copy the CNAME record Vercel gives you (looks like `xxxx.vercel-dns-017.com`)

**In Hostinger:**
1. Login → **Domains** → `salidumay.com` → **DNS / Zone Editor**
2. Delete any existing record with Name `book` (if there is one)
3. Add new record:
   - Type: `CNAME`
   - Name: `book`
   - Target: `xxxx.vercel-dns-017.com` (the value Vercel gave you)
4. Save → wait 5–10 minutes

Vercel will show green once DNS propagates.

---

## 5. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) → create a project
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run
3. You should see "Success. No rows returned" — that means it worked

---

## Done

Your app is live at `https://book.salidumay.com`.

**First-time setup:**
1. Go to `/login` → sign up as owner
2. Go to **Settings** → fill in property name, slug, GCash details
3. Go to **Rooms** → add your rooms
4. Test the guest flow at `/book/your-slug`
