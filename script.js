(function() {
    'use strict';
    const GF_NAME = 'ELENA';
    const SINCE_DATE = new Date('2024-01-01T00:00:00');

    // 星空
    const canvas = document.getElementById('starfield-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [], mouse = { x: -1000, y: -1000 }, animationId;
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initParticles(); }
    function initParticles() {
        const area = canvas.width * canvas.height;
        const count = Math.floor(area * (area < 600000 ? 0.00008 : 0.00012));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 1.8 + 0.3, baseX: 0, baseY: 0, speed: Math.random() * 0.03 + 0.01, opacity: Math.random() * 0.7 + 0.3, trail: [] });
            particles[i].baseX = particles[i].x;
            particles[i].baseY = particles[i].y;
        }
    }
    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const mx = mouse.x, my = mouse.y;
        for (let p of particles) {
            const dx = mx - p.x, dy = my - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) { const force = (1 - dist / 150) * 0.6; p.x += dx * force * 0.02; p.y += dy * force * 0.02; }
            p.x += (p.baseX - p.x) * 0.015; p.y += (p.baseY - p.y) * 0.015;
            p.baseX += p.speed * 0.2;
            if (p.baseX > canvas.width + 20) p.baseX = -20;
            if (p.baseX < -20) p.baseX = canvas.width + 20;
            p.trail.push({ x: p.x, y: p.y }); if (p.trail.length > 5) p.trail.shift();
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(212,175,135,${p.opacity})`; ctx.fill();
            for (let i = 0; i < p.trail.length; i++) {
                const t = p.trail[i]; ctx.beginPath(); ctx.arc(t.x, t.y, p.size * 0.4, 0, Math.PI * 2); ctx.fillStyle = `rgba(180,150,210,${p.opacity * 0.2 * (i / p.trail.length)})`; ctx.fill();
            }
        }
        animationId = requestAnimationFrame(drawStars);
    }
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, { passive: true });
    resizeCanvas(); drawStars();

    // 加载器
    const loader = document.getElementById('preamble-loader');
    const fill = document.getElementById('loader-fill');
    const text = document.getElementById('loader-text');
    const main = document.getElementById('main-content');
    let progress = 0;
    function simulateLoading() {
        if (progress < 100) {
            progress += Math.random() * 15 + 2; if (progress > 100) progress = 100;
            fill.style.width = progress + '%'; text.textContent = `Loading our memories... ${Math.floor(progress)}%`;
            requestAnimationFrame(() => setTimeout(simulateLoading, 120 + Math.random() * 150));
        } else {
            setTimeout(() => { loader.classList.add('hidden'); main.classList.remove('hidden'); main.style.opacity = 1; main.style.visibility = 'visible'; initChronograph(); initGallery(); initGift(); initAudio(); }, 500);
        }
    }
    simulateLoading();

    // 双星
    const leftWrapper = document.getElementById('left-planet-wrapper');
    const rightWrapper = document.getElementById('right-planet-wrapper');
    const stage = document.getElementById('planets-stage');
    stage.addEventListener('mousemove', e => {
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const ix = x / (rect.width / 2) * 8, iy = y / (rect.height / 2) * 8;
        leftWrapper.style.transform = `translate(${ix * 0.7}px, ${iy * 0.5}px)`;
        rightWrapper.style.transform = `translate(${-ix * 0.7}px, ${iy * 0.5}px)`;
    });
    stage.addEventListener('mouseleave', () => { leftWrapper.style.transform = 'translate(0,0)'; rightWrapper.style.transform = 'translate(0,0)'; });

    // 时光罗盘
    function updateChrono() {
        const now = new Date(); let diff = now - SINCE_DATE;
        const s = Math.floor(diff / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
        const d = Math.floor(h / 24), mo = Math.floor(d / 30.436875), y = Math.floor(mo / 12);
        document.getElementById('c-years').textContent = String(y).padStart(2, '0');
        document.getElementById('c-months').textContent = String(mo % 12).padStart(2, '0');
        document.getElementById('c-days').textContent = String(Math.floor(d % 30.436875)).padStart(2, '0');
        document.getElementById('c-hours').textContent = String(h % 24).padStart(2, '0');
        document.getElementById('c-minutes').textContent = String(m % 60).padStart(2, '0');
        document.getElementById('c-seconds').textContent = String(s % 60).padStart(2, '0');
        document.getElementById('chrono-since').textContent = `Since ${SINCE_DATE.getFullYear()}.${String(SINCE_DATE.getMonth()+1).padStart(2,'0')}.${String(SINCE_DATE.getDate()).padStart(2,'0')}`;
    }
    function initChronograph() { updateChrono(); setInterval(updateChrono, 1000); }

    // 图像探测
    async function initGallery() {
        const grid = document.getElementById('gallery-grid'); let index = 1;
        while (index <= 100) {
            const src = `images/${index}.jpg`;
            try { await loadImage(src); const item = createGalleryItem(src, index); grid.appendChild(item); index++; } catch (e) { break; }
        }
        if (grid.children.length === 0) grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:rgba(180,150,200,0.5);">在 images/ 目录下放入 1.jpg, 2.jpg ... 照片会自动展示</p>';
    }
    function loadImage(src) { return new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error('Not found')); img.src = src; }); }
    function createGalleryItem(src, index) { const div = document.createElement('div'); div.className = 'gallery-item'; const img = document.createElement('img'); img.src = src; img.alt = `Memory ${index}`; img.loading = 'lazy'; div.appendChild(img); div.addEventListener('click', () => openLightbox(src)); return div; }

    // 灯箱
    const lightbox = document.getElementById('lightbox'), lightboxImg = document.getElementById('lightbox-img');
    function openLightbox(src) { lightboxImg.src = src; lightbox.classList.add('active'); document.body.style.overflow = 'hidden'; }
    document.getElementById('lightbox-close').addEventListener('click', () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; });
    document.getElementById('lightbox-bg').addEventListener('click', () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.style.overflow = ''; } });

    // 音乐
    const audio = document.getElementById('bgm-audio'), musicBtn = document.getElementById('music-btn'), waveBars = document.querySelectorAll('.wave-bar');
    let isPlaying = false;
    function initAudio() { audio.volume = 0.3; musicBtn.addEventListener('click', () => { if (isPlaying) { audio.pause(); waveBars.forEach(b => b.classList.remove('playing')); isPlaying = false; } else { audio.play().then(() => { waveBars.forEach(b => b.classList.add('playing')); isPlaying = true; }).catch(() => {}); } }); }

    // Web Audio 音效
    let audioCtx;
    function getCtx() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
    function playTone(f, t, d, v = 0.1) { try { const c = getCtx(), o = c.createOscillator(), g = c.createGain(); o.type = t; o.frequency.setValueAtTime(f, c.currentTime); g.gain.setValueAtTime(v, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d); } catch (e) {} }
    document.querySelectorAll('button, .gallery-item, .planet').forEach(el => { el.addEventListener('mouseenter', () => playTone(600, 'sine', 0.2, 0.05)); });

    // 礼盒
    const giftBox = document.getElementById('gift-box'), holdIndicator = document.getElementById('hold-indicator');
    const heartbeatRing = document.getElementById('heartbeat-ring'), loveOverlay = document.getElementById('love-letter-overlay');
    const loveContent = document.getElementById('love-letter-content'), confettiCanvas = document.getElementById('confetti-canvas');
    const ctxC = confettiCanvas.getContext('2d');
    let holdInterval, holdStart;
    function initGift() {
        giftBox.addEventListener('mousedown', startHold); giftBox.addEventListener('touchstart', startHold, { passive: false });
        giftBox.addEventListener('mouseup', cancelHold); giftBox.addEventListener('mouseleave', cancelHold);
        giftBox.addEventListener('touchend', cancelHold); giftBox.addEventListener('touchcancel', cancelHold);
        document.getElementById('love-letter-close').addEventListener('click', () => { loveOverlay.classList.remove('active'); });
    }
    function startHold(e) { e.preventDefault(); holdStart = Date.now(); holdIndicator.textContent = 'Hold 3s'; heartbeatRing.classList.add('active'); playTone(200, 'sine', 0.3, 0.1); holdInterval = setInterval(() => { const e = Date.now() - holdStart; holdIndicator.textContent = `Hold ${Math.max(0,Math.ceil((3000-e)/1000))}s`; if (e >= 3000) { unlockGift(); clearInterval(holdInterval); } }, 100); }
    function cancelHold() { if (holdInterval) clearInterval(holdInterval); holdIndicator.textContent = 'Hold 3s'; heartbeatRing.classList.remove('active'); }
    function unlockGift() { giftBox.classList.add('unlocked'); holdIndicator.textContent = 'Unlocked ❤'; heartbeatRing.classList.remove('active'); playTone(800, 'triangle', 0.5, 0.2); setTimeout(() => playTone(1200, 'sine', 0.6, 0.3), 200); startConfetti(); setTimeout(() => { loveOverlay.classList.add('active'); typeWriterLetter(); }, 800); }
    function typeWriterLetter() { const letter = `我最亲爱的 ${GF_NAME}：\n\n在这个属于你的特别日子里，我想把整个宇宙的星光都献给你。\n\n从我们相遇的那一刻起，我的世界便不再有黑暗。你是那颗最明亮的星辰，照亮了我所有的日夜。\n\n我为你保存了一段时间——它不在钟表里，不在日历上，而是在每一次心跳、每一个凝视、每一句没说出口却早已被你知道的「我爱你」中。\n\n愿这片数字星河，能成为我们故事的见证。生日快乐，我的爱人。\n\n永远爱你的，\n[ 你的名字 ]`; loveContent.textContent = ''; let i = 0; const t = setInterval(() => { if (i < letter.length) { loveContent.textContent += letter.charAt(i); i++; } else clearInterval(t); }, 40); }
    function startConfetti() { confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; const p = []; for (let i = 0; i < 150; i++) p.push({ x: Math.random() * confettiCanvas.width, y: Math.random() * confettiCanvas.height - confettiCanvas.height, size: Math.random() * 6 + 2, sy: Math.random() * 3 + 2, sx: (Math.random() - 0.5) * 2, color: `hsl(${Math.random()*60+30},80%,70%)`, op: Math.random() * 0.8 + 0.2 }); function d() { ctxC.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); for (let r of p) { ctxC.fillStyle = r.color; ctxC.globalAlpha = r.op; ctxC.fillRect(r.x, r.y, r.size, r.size * 0.6); r.y += r.sy; r.x += r.sx; if (r.y > confettiCanvas.height + 20) r.y = -20; if (r.x > confettiCanvas.width + 20) r.x = -20; if (r.x < -20) r.x = confettiCanvas.width + 20; } requestAnimationFrame(d); } d(); setTimeout(() => ctxC.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height), 6000); }

    // 初始设定
    document.getElementById('title-name').textContent = GF_NAME;
    document.getElementById('name-label').textContent = GF_NAME;
})();