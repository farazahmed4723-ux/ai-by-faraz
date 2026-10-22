@echo off
echo ========================================================
echo   Pushing "AI by Faraz" to GitHub (origin/main)
echo ========================================================
git push -u origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Repository pushed to GitHub successfully!
) else (
    echo.
    echo [NOTICE] If you haven't created the repository on GitHub yet:
    echo 1. Go to https://github.com/new
    echo 2. Set Repository Name to: ai-by-faraz
    echo 3. Click "Create repository"
    echo 4. Run this script again!
)
pause
