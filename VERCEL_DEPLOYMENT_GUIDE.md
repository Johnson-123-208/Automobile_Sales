# Vercel Deployment Guide for JEN Automobiles

This guide will walk you through deploying your Next.js application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com) - free tier available)
2. Your Supabase project URL and anon key
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Project

### 1.1 Ensure `.env.local` is NOT committed
Make sure `.env.local` is in your `.gitignore` file:

```gitignore
# .gitignore
.env.local
.env*.local
.next
node_modules
```

### 1.2 Verify your project structure
Ensure you have:
- ✅ `package.json` with all dependencies
- ✅ `next.config.js` (if you have custom config)
- ✅ All your source files are in place

## Step 2: Push to Git Repository

### Option A: If you already have a Git repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Option B: If you need to create a new repository

1. **Initialize Git** (if not already done):
```bash
cd craft-haven
git init
git add .
git commit -m "Initial commit"
```

2. **Create a new repository on GitHub**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it (e.g., "jen-automobiles")
   - Don't initialize with README
   - Click "Create repository"

3. **Connect and push**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/jen-automobiles.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in or create an account
   - Click "Add New Project"

2. **Import Your Repository**:
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository (`jen-automobiles` or your repo name)
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `craft-haven` (if your project is in a subfolder)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
   
   - Make sure to add these for **Production**, **Preview**, and **Development** environments
   - Click "Add" after each variable

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)
   - Your site will be live at `https://your-project-name.vercel.app`

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd craft-haven
vercel
```

4. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (for first deployment)
   - Project name? (Press Enter for default or enter custom name)
   - Directory? `./` (if you're in craft-haven folder) or `./craft-haven` (if in parent)
   - Override settings? **No**

5. **Add Environment Variables**:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted
# Select: Production, Preview, Development
```

6. **Redeploy with environment variables**:
```bash
vercel --prod
```

## Step 4: Post-Deployment Configuration

### 4.1 Update Supabase RLS Policies (if needed)

If you encounter authentication issues, verify your RLS policies in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Policies**
3. Ensure all tables have proper RLS policies enabled

### 4.2 Verify Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Verify both variables are set for all environments

### 4.3 Test Your Deployment

1. Visit your deployed URL: `https://your-project-name.vercel.app`
2. Test key features:
   - ✅ Home page loads
   - ✅ Login works
   - ✅ Dashboard displays
   - ✅ Products load
   - ✅ Favorites work

## Step 5: Custom Domain (Optional)

1. **Add Domain in Vercel**:
   - Go to your project dashboard
   - Click **Settings** > **Domains**
   - Enter your domain name
   - Follow the DNS configuration instructions

2. **Update DNS Records**:
   - Add the CNAME or A record as instructed by Vercel
   - Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### Build Fails

**Error: Module not found**
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: Environment variables missing**
- Double-check environment variables in Vercel dashboard
- Ensure variable names match exactly (case-sensitive)

### Runtime Errors

**Error: Invalid supabaseUrl**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- Check for trailing slashes (should NOT have one)

**Error: 406 Not Acceptable (Favorites)**
- This should be fixed with the recent changes
- If persists, check RLS policies in Supabase

### Database Connection Issues

**Error: RLS policy violation**
- Go to Supabase Dashboard
- Check Row Level Security policies
- Ensure policies allow authenticated users

## Quick Deploy Checklist

- [ ] Project is pushed to Git repository
- [ ] `.env.local` is NOT committed
- [ ] All dependencies are in `package.json`
- [ ] Environment variables are set in Vercel
- [ ] Build completes successfully
- [ ] Site is accessible
- [ ] Login functionality works
- [ ] Database queries work

## Useful Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# View deployment logs
vercel logs

# Open project in browser
vercel open

# List all deployments
vercel ls
```

## Support

If you encounter issues:
1. Check Vercel deployment logs in the dashboard
2. Check browser console for client-side errors
3. Verify Supabase connection and RLS policies
4. Review environment variables configuration

---

**Your site will be live at**: `https://your-project-name.vercel.app`

Happy deploying! 🚀

