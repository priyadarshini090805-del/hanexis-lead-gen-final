# Setup Guide — Click by Click

This walks you through every click. No prior knowledge needed. Total time: about 30–45 minutes.

Your GitHub repo: **https://github.com/priyadarshini090805-del/hanexis-lead-gen**

---

## PART 1 — Push the code to GitHub (5 min)

You have all the project files in your workspace folder. We need to send them to your GitHub repo.

### Option A — Easiest: drag-and-drop upload on github.com

1. Open your repo in a browser: **https://github.com/priyadarshini090805-del/hanexis-lead-gen**
2. You'll see a page that says "Quick setup — if you've done this kind of thing before".
3. Look for the link that says **"uploading an existing file"** (it's a blue link in the middle of the page). Click it.
4. A page opens that says **"Drag files here to add them to your repository"**.
5. Open your workspace folder on your computer (the one where these files live).
6. Select **everything** inside (all the folders: `src`, `prisma`, plus all the files: `package.json`, `tailwind.config.ts`, `next.config.js`, `tsconfig.json`, `postcss.config.js`, `vercel.json`, `README.md`, `SETUP_GUIDE.md`, `.env.example`, `.gitignore`).
7. Drag them all onto the GitHub page.
8. Wait for the upload bar to finish (around 30 seconds).
9. Scroll down. In the **"Commit changes"** box at the bottom, type: `initial commit`.
10. Make sure the radio button **"Commit directly to the main branch"** is selected.
11. Click the green **"Commit changes"** button.

> **Important about the `.env.example` file:** GitHub may hide files starting with a dot. If `.env.example` and `.gitignore` don't appear, that's fine — you can add them later or the deploy will still work without them.

### Option B — Using git on the command line

If you're comfortable with the terminal:

```bash
cd <path-to-your-workspace-folder>
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/priyadarshini090805-del/hanexis-lead-gen.git
git push -u origin main
```

When done, refresh your repo page on GitHub. You should see the `src` folder, `package.json`, and everything else listed.

---

## PART 2 — Create your Neon Postgres database (3 min)

1. Open **https://neon.tech** in a new tab.
2. Click the **"Sign up"** button (top right).
3. Sign up with GitHub — click **"Continue with GitHub"** and authorize.
4. After signing in, you land on a page that says **"Create a project"** or **"New Project"**. Click it.
5. Fill the form:
   - **Project name:** `hanexis`
   - **Postgres version:** leave default
   - **Region:** pick the one closest to you (e.g. AWS US East, Europe Frankfurt, AP Singapore)
6. Click **"Create project"**.
7. After 5–10 seconds, you land on a page titled **"Connection details"** or **"Quickstart"**.
8. You'll see a connection string that looks like:
   ```
   postgres://username:abcd1234@ep-cool-name-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
9. **Copy this entire string** to a temporary notepad. You'll paste it in Vercel in Part 5.
10. Make sure it's the **"Pooled connection"** version (Neon usually shows it by default — there's a toggle that says "Pooled" / "Direct"; keep it on Pooled).

---

## PART 3 — Create your Google OAuth credentials (5 min)

1. Open **https://console.cloud.google.com** in a new tab.
2. Sign in with your Google account.
3. At the top of the page there's a project dropdown (might say "Select a project"). Click it.
4. In the popup, click **"New Project"** (top right of the popup).
5. **Project name:** `hanexis`. Click **"Create"**.
6. Wait 10 seconds — a notification appears at the top right. Click **"Select project"** in that notification (or pick `hanexis` from the dropdown again).
7. In the search bar at the top of the page, type `OAuth consent screen` and click the result.
8. Choose **"External"** (it's the only option if you don't have a Google Workspace). Click **"Create"**.
9. Fill the form:
   - **App name:** `Hanexis`
   - **User support email:** your email
   - **Developer contact email:** your email
   - Leave everything else blank.
10. Click **"Save and Continue"** three times to skip through Scopes, Test users, Summary.
11. Click **"Back to Dashboard"**.
12. In the left menu, click **"Credentials"** (or search `Credentials` in the top search bar).
13. At the top click **"+ Create Credentials" → "OAuth client ID"**.
14. Fill the form:
    - **Application type:** Web application
    - **Name:** `Hanexis Web`
    - **Authorized JavaScript origins:** click **+ ADD URI** → paste `http://localhost:3000` → click **+ ADD URI** again → leave the second blank for now (you'll add your Vercel URL after Part 5)
    - **Authorized redirect URIs:** click **+ ADD URI** → paste `http://localhost:3000/api/auth/callback/google`
15. Click **"Create"**.
16. A popup appears with **Client ID** and **Client Secret**. Copy both to your temporary notepad. Label them clearly.
17. Click **OK**.

---

## PART 4 — Create your LinkedIn OAuth app (10 min)

1. Open **https://www.linkedin.com/developers/apps** in a new tab.
2. Sign in with LinkedIn.
3. Click the **"Create app"** button (top right).
4. Fill the form:
   - **App name:** `Hanexis`
   - **LinkedIn Page:** You need a LinkedIn Company page. If you don't have one, click "Create a LinkedIn Page" and make a basic one (takes 2 minutes — just give it a name like "Hanexis"). Then come back.
   - **Privacy policy URL:** put any URL you have, or `https://example.com/privacy` for now
   - **App logo:** upload any small image (a pink square works)
   - **Tick the legal checkbox**
5. Click **"Create app"**.
6. You land on your app's dashboard.
7. Click the **"Products"** tab at the top.
8. Find **"Sign In with LinkedIn using OpenID Connect"** and click **"Request access"**. Accept the agreement. (This is usually approved instantly.)
9. Click the **"Auth"** tab at the top.
10. Under **"OAuth 2.0 settings"**, find **"Authorized redirect URLs for your app"**. Click the pencil/edit icon.
11. Click **"+ Add redirect URL"** and paste: `http://localhost:3000/api/auth/callback/linkedin`
12. Click **"Update"**.
13. Scroll up to **"Application credentials"**.
14. Copy the **Client ID** and **Client Secret** to your temporary notepad.

---

## PART 5 — Deploy to Vercel (5 min)

1. Open **https://vercel.com/signup** in a new tab.
2. Click **"Continue with GitHub"** and authorize.
3. Once signed in, you land on the dashboard. Click **"Add New..." → "Project"** (top right).
4. You'll see a list of your GitHub repos. Find **`hanexis-lead-gen`** and click **"Import"** next to it.
5. The "Configure Project" page opens. Most fields are auto-filled correctly. **Don't deploy yet.**
6. Expand the **"Environment Variables"** section. You'll add the variables one by one:

   For each variable below, type the **NAME** in the left field, the **VALUE** in the right field, and click **"Add"** (or press Tab then Enter).

   | NAME | VALUE |
   |---|---|
   | `DATABASE_URL` | The Neon connection string you copied in Part 2 |
   | `NEXTAUTH_SECRET` | A long random string. **Generate one at https://generate-secret.vercel.app/32 and paste the result** |
   | `NEXTAUTH_URL` | `https://hanexis-lead-gen.vercel.app` (you may need to come back and edit this if Vercel gives you a different URL) |
   | `GOOGLE_CLIENT_ID` | From Part 3 |
   | `GOOGLE_CLIENT_SECRET` | From Part 3 |
   | `LINKEDIN_CLIENT_ID` | From Part 4 |
   | `LINKEDIN_CLIENT_SECRET` | From Part 4 |
   | `ADMIN_EMAIL` | Your email — first sign-up with this email becomes admin |

   You can **leave `OPENAI_API_KEY` out** — the app uses a high-quality mock generator when this is missing.

7. Click the big black **"Deploy"** button.
8. Vercel builds the project. This takes 2–3 minutes. You'll see a progress log.
9. When it finishes, you see confetti and a **"Congratulations"** screen with your live URL (e.g. `https://hanexis-lead-gen-abc123.vercel.app`).
10. **Copy your real Vercel URL.** You may need it to fix `NEXTAUTH_URL`.

---

## PART 6 — Run the database migration (2 min)

Vercel deployed your code, but your Neon database is empty (no tables yet). We need to create them.

### Easiest way — via Vercel CLI on your computer

If you don't have Node.js installed, skip to **"Alternate way"** below.

```bash
# In your project folder
npx vercel env pull .env
npx prisma db push
```

This pulls your env vars from Vercel and creates all the database tables.

### Alternate way — paste SQL into Neon's web console

1. Go to your Neon project at **https://console.neon.tech**.
2. Click your project, then click **"SQL Editor"** in the left sidebar.
3. We need the raw SQL. The easiest way is to run `npx prisma migrate dev --name init` locally to generate it, but since you may not have Node installed, here's an alternative:
4. **Easier:** Visit `https://hanexis-lead-gen.vercel.app/api/auth/register` once and the database will auto-error in a way that tells you to push the schema. If you can't run `prisma db push`, contact me and I'll generate the raw SQL for you to paste.

---

## PART 7 — Update OAuth callback URLs with your real Vercel URL (3 min)

Once you have your Vercel URL (e.g. `https://hanexis-lead-gen.vercel.app`), update three places:

### 7a — Vercel env var

1. Vercel Dashboard → your project → **Settings** → **Environment Variables**.
2. Find `NEXTAUTH_URL`. Click the three dots → **Edit**.
3. Set value to your **exact** Vercel URL (no trailing slash). Save.
4. Go to **Deployments** tab → click the three dots on the latest deployment → **Redeploy**.

### 7b — Google Cloud Console

1. Back to https://console.cloud.google.com → **APIs & Services** → **Credentials** → click your OAuth Client.
2. Under **Authorized JavaScript origins**, click **+ ADD URI** → paste `https://hanexis-lead-gen.vercel.app`.
3. Under **Authorized redirect URIs**, click **+ ADD URI** → paste `https://hanexis-lead-gen.vercel.app/api/auth/callback/google`.
4. Click **Save**.

### 7c — LinkedIn

1. Back to https://www.linkedin.com/developers/apps → your app → **Auth** tab.
2. Edit **Authorized redirect URLs** → **+ Add redirect URL** → paste `https://hanexis-lead-gen.vercel.app/api/auth/callback/linkedin`.
3. Click **Update**.

---

## PART 8 — Try it out

1. Open your Vercel URL.
2. Click **"Get started"**.
3. Sign up with your email + password (use the email you set in `ADMIN_EMAIL` to get admin role).
4. You land in the dashboard. Try:
   - **Leads → New lead** — add a test lead
   - **Leads → click the lead's name** — opens the drawer → click "Generate message"
   - **AI Messages** — generate a connection request, follow-up, or sales pitch
   - **Prompt Library** — 6 templates are seeded automatically
   - **Settings** — see your role

---

## Troubleshooting

**"Build failed: Prisma generate"** — usually a missing `DATABASE_URL`. Check Vercel env vars.

**"Google sign-in: redirect_uri_mismatch"** — Part 7b. Make sure the URI in Google Cloud Console exactly matches your Vercel URL.

**"LinkedIn sign-in: invalid redirect URL"** — Part 7c. Same as above.

**"Internal Server Error" on first sign-up** — your DB tables don't exist yet. Run `npx prisma db push` (Part 6).

**Mock AI instead of real OpenAI** — `OPENAI_API_KEY` is missing. Add it as an env var in Vercel → redeploy.

---

Everything else (the pink theme, animations, lead CRUD, AI generation, prompt library, role-based access) is already wired up and works out of the box. Enjoy.
