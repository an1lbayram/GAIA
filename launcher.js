const http = require('http');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 3050;
let viteProcess = null;

const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎓 GAIA</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body { 
            font-family: 'Outfit', sans-serif; 
            background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%); 
            color: #ffffff; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            overflow: hidden; 
        }

        .glass-panel { 
            background: rgba(255, 255, 255, 0.05); 
            backdrop-filter: blur(16px); 
            -webkit-backdrop-filter: blur(16px); 
            border-radius: 24px; 
            padding: 50px; 
            text-align: center; 
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3); 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            max-width: 600px; 
            width: 90%; 
            animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        h1 { 
            margin-bottom: 20px; 
            font-size: 3rem; 
            font-weight: 800;
            color: #ffffff;
        }

        .accent-text {
            background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        }

        p.subtitle { 
            font-size: 1.2rem; 
            line-height: 1.6; 
            margin-bottom: 40px; 
            color: rgba(255, 255, 255, 0.85); 
            font-weight: 300;
        }

        .features {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }

        .feature-badge {
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 0.9rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #4facfe;
            font-weight: 600;
        }

        .btn { 
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white; 
            border: none; 
            padding: 16px 48px; 
            font-size: 1.2rem; 
            font-family: 'Outfit', sans-serif;
            border-radius: 50px; 
            cursor: pointer; 
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
            box-shadow: 0 10px 20px rgba(0, 242, 254, 0.3); 
            font-weight: 600; 
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .btn:hover { 
            transform: translateY(-3px) scale(1.05); 
            box-shadow: 0 15px 30px rgba(0, 242, 254, 0.4); 
        }

        .btn:active {
            transform: translateY(1px);
        }

        .loader-container {
            display: none;
            margin-top: 30px;
            animation: fadeIn 0.5s ease-out;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.1);
            border-left-color: #00f2fe;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px auto;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .loader-text {
            color: #4facfe;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .loader-subtext {
            font-size: 0.85rem;
            color: rgba(255,255,255,0.6);
            margin-top: 5px;
        }

        .logo-icon {
            font-size: 4rem;
            margin-bottom: 10px;
            display: block;
        }

        .footer-credit {
            margin-top: 30px;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
            font-weight: 500;
        }
        
        .footer-credit a {
            color: #4facfe;
            text-decoration: none;
            font-weight: 700;
        }
        
        .footer-credit a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="glass-panel">
        <div class="logo-icon">🎓</div>
        <h1>GA<span class="accent-text">IA</span></h1>
        
        <div class="features">
            <span class="feature-badge">Yapay Zeka Destekli</span>
            <span class="feature-badge">Anlık Geri Bildirim</span>
            <span class="feature-badge">Gelişmiş İstatistikler</span>
        </div>
        
        <button id="startBtn" class="btn" onclick="startApp()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Uygulamayı Başlat
        </button>
        
        <div id="loader" class="loader-container">
            <div class="spinner"></div>
            <div class="loader-text">Geliştirme sunucusu başlatılıyor...</div>
            <div class="loader-subtext">Bu işlem birkaç saniye sürebilir, lütfen bekleyin. Otomatik olarak yönlendirileceksiniz.</div>
        </div>

        <div class="footer-credit">
            Created by <a href="https://an1lbayram.github.io/" target="_blank" rel="noopener noreferrer">an1lbayram</a>
        </div>
    </div>

    <script>
        function startApp() {
            document.getElementById('startBtn').style.display = 'none';
            document.getElementById('loader').style.display = 'block';
            
            fetch('/start', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        let dotCount = 0;
                        const loaderText = document.querySelector('.loader-text');
                        
                        const interval = setInterval(() => {
                            dotCount = (dotCount + 1) % 4;
                            loaderText.textContent = "Sunucu hazırlanıyor" + ".".repeat(dotCount);
                        }, 500);

                        // Wait a bit for Vite to compile and start completely
                        setTimeout(() => {
                            clearInterval(interval);
                            window.location.href = data.url;
                        }, 3000);
                    }
                })
                .catch(err => {
                    alert("Sunucu başlatılırken bir hata oluştu. Lütfen komut satırını kontrol edin.");
                    document.getElementById('startBtn').style.display = 'inline-flex';
                    document.getElementById('loader').style.display = 'none';
                });
        }
    </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    } else if (req.url === '/start' && req.method === 'POST') {
        if (!viteProcess) {
            const appDir = path.join(__dirname, 'quiz-app');
            const nmDir = path.join(appDir, 'node_modules');
            
            if (!fs.existsSync(nmDir)) {
                console.log("-> node_modules klasörü bulunamadı. Bağımlılıklar yükleniyor, lütfen bekleyin...");
                try {
                    execSync('npm install', { cwd: appDir, stdio: 'inherit' });
                    console.log("-> Bağımlılıklar başarıyla yüklendi.");
                } catch (e) {
                    console.error("-> npm install sırasında hata oluştu:", e);
                }
            }

            console.log("-> React uygulaması (Vite) başlatılıyor...");
            viteProcess = spawn('npm', ['run', 'dev'], {
                cwd: appDir,
                stdio: 'inherit',
                shell: true
            });

            viteProcess.on('close', (code) => {
                console.log(`-> Vite sunucusu ${code} kodu ile kapandı.`);
                viteProcess = null;
            });
        } else {
            console.log("-> Sunucu zaten çalışıyor.");
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, url: 'http://localhost:5173/' }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 GAIA Aktif!`);
    console.log(`Tarayıcınızda şu adresi açın: http://localhost:${PORT}`);
    console.log(`=================================================\n`);
    
    // Automatically open browser
    const startCmd = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    require('child_process').exec(startCmd + ' http://localhost:' + PORT);
});
