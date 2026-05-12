echo "Initializing Git..."
git init
echo "Adding files..."
git add .
echo "Creating first commit..."
git commit -m "Initial commit - Somalia Tourism Project"
echo "Setting branch to main..."
git branch -M main
echo "Adding remote origin..."
git remote add origin https://github.com/engabdallah224-web/Tourism-project.git
echo "Pushing to GitHub..."
git push -u origin main
echo "Done! Check your GitHub repository."
pause
