@echo off
cd /d "%~dp0"
echo Starting Ambiental IA at %date% %time% > run-localhost.log
"C:\Program Files\nodejs\node.exe" .\node_modules\next\dist\bin\next dev -p 3000 >> run-localhost.log 2>&1
echo Server exited with code %errorlevel% at %date% %time% >> run-localhost.log
