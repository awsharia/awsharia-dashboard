# AWSharia Dashboard

React dashboard for AWSharia — Overview, Students, Revenue, Certificates, Email (Kit).

## Deploy to Vercel (20 minutes, free)

### Step 1 — GitHub
1. Go to github.com → New repository → name it `awsharia-dashboard` → Create
2. Upload ALL files from this folder (drag them into GitHub's file uploader, maintain folder structure)

### Step 2 — Vercel
1. Go to vercel.com → Sign up with GitHub → New Project
2. Import your `awsharia-dashboard` repo
3. Framework: Create React App (auto-detected)
4. Click **Deploy** — you'll get a live URL in ~2 minutes

### Step 3 — Environment Variables
In your Vercel project → Settings → Environment Variables, add:

| Variable | Value | Required |
|----------|-------|----------|
| `REACT_APP_GSHEETS_KEY` | Your Google Sheets API key | Yes |
| `REACT_APP_STUDENTS_SHEET_ID` | Sheet ID for student tracker | Yes |
| `REACT_APP_PAYMENTS_SHEET_ID` | Sheet ID for payments (Zapier-fed) | No |
| `REACT_APP_KIT_KEY` | Your Kit API key | No |

After adding variables → Deployments → Redeploy

### Google Sheets setup
Your student tracker sheet needs these columns (row 1 = headers, data from row 2):
- A: Name
- B: Email  
- C: Package (Course Only / Course + Recordings / Full Package)
- D: Enrolled date
- E: Progress % (number 0-100)
- F: Status (active / completed / pending)
- G: Certificate Issued (Yes / No)
- H: Certificate Date

Share the sheet: Share → Anyone with the link → Viewer

### Payments sheet (optional, fed by Zapier)
Columns: Name, Email, Description/Package, Amount, Currency, Date, Status

### Google Sheets API key
1. console.cloud.google.com → New project
2. APIs & Services → Enable → Google Sheets API
3. APIs & Services → Credentials → Create Credentials → API key
4. Restrict key to Google Sheets API only

### Custom domain
Vercel project → Settings → Domains → Add your domain
