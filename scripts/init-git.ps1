# PowerShell script to initialize Git repository
# Usage: .\scripts\init-git.ps1

Write-Host "Initializing Git repository..." -ForegroundColor Green

# Initialize git if not already initialized
if (-not (Test-Path .git)) {
    git init
    Write-Host "Git repository initialized" -ForegroundColor Green
}

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Sri Abhayanjaneya Swamy Temple website"

Write-Host ""
Write-Host "Repository initialized and committed." -ForegroundColor Green
Write-Host ""
Write-Host "To push to GitHub:" -ForegroundColor Yellow
Write-Host "1. Create a new repository named 'anjaneyaswami_webpage' on GitHub"
Write-Host "2. Run: git remote add origin https://github.com/YOUR_USERNAME/anjaneyaswami_webpage.git"
Write-Host "3. Run: git branch -M main"
Write-Host "4. Run: git push -u origin main"

