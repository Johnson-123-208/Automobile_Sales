# Clear Cache & Restart Instructions

## Issue: Old Website Still Showing

If you're still seeing the old Craft Haven website instead of the new AutoSales Pro platform, follow these steps:

### Step 1: Stop the Development Server
Press `Ctrl + C` in your terminal to stop the current server.

### Step 2: Clear Next.js Cache
```bash
cd craft-haven
rm -rf .next
```

**Windows PowerShell:**
```powershell
cd craft-haven
Remove-Item -Recurse -Force .next
```

**Windows CMD:**
```cmd
cd craft-haven
rmdir /s /q .next
```

### Step 3: Clear Node Modules Cache (Optional but Recommended)
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

**Windows:**
```powershell
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
```

### Step 4: Clear Browser Cache
1. **Chrome/Edge**: Press `Ctrl + Shift + Delete` → Clear cached images and files
2. **Firefox**: Press `Ctrl + Shift + Delete` → Clear cache
3. Or use **Incognito/Private mode** to test

### Step 5: Restart Development Server
```bash
npm run dev
```

### Step 6: Hard Refresh Browser
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

## Verify Changes

After restarting, you should see:
- ✅ **New homepage** with "AutoSales Pro" branding
- ✅ **Red automotive theme** (not orange interior design theme)
- ✅ **Navigation** showing "Vehicles", "Spare Parts", "Admin Login", "Employee Login"
- ✅ **Hero section** with "Drive Your Dreams" heading

## If Still Not Working

1. **Check file priority**: Make sure `app/page.tsx` exists and `app/page.js` is deleted
2. **Check terminal output**: Look for any errors during build
3. **Check browser console**: Press F12 → Console tab for errors
4. **Try different port**: 
   ```bash
   npm run dev -- -p 3001
   ```
   Then visit: http://localhost:3001

## Files Changed

The following old files have been removed/updated:
- ✅ `app/page.js` - DELETED (was showing old content)
- ✅ `app/page.tsx` - UPDATED (new automotive homepage)
- ✅ `app/layout.tsx` - UPDATED (new metadata)

Old route directories (about, contact, gallery, projects) can be removed if not needed.

