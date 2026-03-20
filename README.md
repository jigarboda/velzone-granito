# Velzone Granito - Master Tile Management

## Deployment to Vercel (Step by Step)

### 1. Push to GitHub
1. Go to github.com and create a new repository named `velzone-granito`
2. Upload all these files to the repository (you can use GitHub's web uploader)
3. OR use GitHub Desktop app to push the code

### 2. Deploy on Vercel
1. Go to vercel.com → click "Add New Project"
2. Import your `velzone-granito` GitHub repository
3. Vercel will auto-detect it's a Vite project
4. Before deploying, add Environment Variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click "Deploy"
6. Your app will be live at `velzone-granito.vercel.app`

### 3. Connect Custom Domain (Optional)
1. In Vercel, go to Settings → Domains
2. Add `app.velzonegranito.com`
3. In GoDaddy DNS, add a CNAME record:
   - Name: `app`
   - Value: `cname.vercel-dns.com`
4. Wait 5-10 minutes for DNS to propagate

## Login
Use the email/password you created in Supabase Authentication.
