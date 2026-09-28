@echo off
REM ==============================================================================
REM One-Command Launcher for Regulatory OS (Windows)
REM ==============================================================================

cd /d "%~dp0"
echo ==========================================================
echo  🏛️  Starting Maharashtra Jurisdiction Intelligence OS
echo ==========================================================

node scripts/run.js dev
