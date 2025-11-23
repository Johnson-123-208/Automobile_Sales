# Clear Next.js cache
Write-Host "Clearing Next.js cache..."
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ .next directory removed"
} else {
    Write-Host "✓ .next directory not found (already clean)"
}

Write-Host ""
Write-Host "Cache cleared! Please restart your dev server with: npm run dev"
Write-Host ""

