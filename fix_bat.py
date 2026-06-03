import codecs

content = """@echo off
chcp 1254 >nul
title GAIA Başlatıcı

echo ===================================================
echo   GAIA Başlatıcı
echo   Lütfen açılan tarayıcı penceresindeki
echo   "Uygulamayı Başlat" butonuna tıklayın.
echo ===================================================

node launcher.js

pause
"""

with codecs.open(r'c:\Users\derbe\OneDrive\Masaüstü\Final\GAIA_Baslat.bat', 'w', 'cp1254') as f:
    f.write(content)

print("Batch file encoding fixed.")
