# Quick Vercel Deployment Steps

## Fastest Way to Deploy

### 1. Push to GitHub
```bash
cd craft-haven
git init
git add .
git commit -m "Ready for deployment"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. **Important**: Set **Root Directory** to `craft-haven` (if your project is in a subfolder)
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
6. Click **"Deploy"**

### 3. Done! 🎉

Your site will be live at: `https://your-project.vercel.app`

---

**Need more details?** See `VERCEL_DEPLOYMENT_GUIDE.md` for complete instructions.

