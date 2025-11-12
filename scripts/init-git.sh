#!/bin/bash

# Initialize Git repository and push to GitHub
# Usage: ./scripts/init-git.sh

echo "Initializing Git repository..."

# Initialize git if not already initialized
if [ ! -d .git ]; then
    git init
    echo "Git repository initialized"
fi

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Sri Abhayanjaneya Swamy Temple website"

echo ""
echo "Repository initialized and committed."
echo ""
echo "To push to GitHub:"
echo "1. Create a new repository named 'anjaneyaswami_webpage' on GitHub"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/anjaneyaswami_webpage.git"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"

