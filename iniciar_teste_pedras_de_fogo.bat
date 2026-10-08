@echo off
title LocBUS - Teste Pedras de Fogo
cd /d "%~dp0"
call .venv\Scripts\activate.bat
python run_pedras_de_fogo.py
pause
