@echo off
echo ===================================================
echo   Starting SolarOps Bangladesh Monitoring Platform
echo ===================================================
echo.
echo Opening SolarOps in your default browser...
start http://localhost:8080
echo Starting local web server on port 8080...
python -m http.server 8080
pause
