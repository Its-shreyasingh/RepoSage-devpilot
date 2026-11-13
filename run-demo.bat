@echo off
echo ========================================================
echo   Repo Sage - Full-Stack Interview Demo Launcher
echo ========================================================
echo.

echo [1/3] Starting PostgreSQL with pgvector container...
docker compose up -d postgres
if %errorlevel% neq 0 (
    echo Error starting Docker Postgres. Please ensure Docker Desktop is running.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Starting Spring Boot 3 Backend on port 8080...
start "RepoSage-Backend" cmd /k "cd /d %~dp0backend && set SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/reposage?stringtype=unspecified&& java -jar target\backend-0.0.1-SNAPSHOT.jar"

echo.
echo [3/3] Starting React Vite Frontend on port 5173...
start "RepoSage-Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo.
echo ========================================================
echo   All services launched!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8080
echo ========================================================
echo.
pause

