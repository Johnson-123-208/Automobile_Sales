# Fix: Next.js Module Loading Error

## Problem
You're seeing this error:
```
Failed to load chunk server/chunks/ssr/[root-of-the-server]__04ebd221._.js
Cannot use import statement outside a module
```

## Solution

This is a Next.js build cache issue. Follow these steps:

### Option 1: Using PowerShell Script (Recommended)
1. Stop your dev server (Ctrl+C)
2. Run this command in the `craft-haven` directory:
   ```powershell
   .\clear-cache.ps1
   ```
3. Restart your dev server:
   ```bash
   npm run dev
   ```

### Option 2: Manual Steps
1. Stop your dev server (Ctrl+C)
2. Delete the `.next` folder:
   ```powershell
   cd craft-haven
   Remove-Item -Recurse -Force .next
   ```
3. Restart your dev server:
   ```bash
   npm run dev
   ```

### Option 3: Full Clean (if above doesn't work)
1. Stop your dev server
2. Delete both `.next` and `node_modules/.cache`:
   ```powershell
   cd craft-haven
   Remove-Item -Recurse -Force .next
   if (Test-Path node_modules\.cache) { Remove-Item -Recurse -Force node_modules\.cache }
   ```
3. Restart:
   ```bash
   npm run dev
   ```

## Why This Happens
Next.js caches compiled chunks in the `.next` directory. Sometimes these cached files can become corrupted or incompatible, especially after code changes or dependency updates. Clearing the cache forces Next.js to rebuild everything fresh.

