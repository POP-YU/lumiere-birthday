(function() {
    'use strict';
    const GF_NAME = '花花';
    const SINCE_DATE = new Date('2026-10-17T00:00:00');

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

    // 图像探测 — 无照片时生成抽象星空艺术画
    function generateCosmicArt(index) {
        const c = document.createElement('canvas');
        c.width = 400; c.height = 500;
        const cx = c.getContext('2d');
        // 深空背景
        const bgGrad = cx.createRadialGradient(200 + (index%5-2)*40, 200 + (index%3-1)*60, 20, 200, 250, 400);
        const hues = [280, 320, 30, 200, 340, 45, 260, 15];
        const h = hues[index % hues.length];
        bgGrad.addColorStop(0, `hsla(${h}, 70%, 25%, 0.9)`);
        bgGrad.addColorStop(0.4, `hsla(${(h+40)%360}, 40%, 15%, 0.7)`);
        bgGrad.addColorStop(1, '#07070f');
        cx.fillStyle = bgGrad; cx.fillRect(0, 0, 400, 500);
        // 星云纹理
        for (let i = 0; i < 300; i++) {
            const sx = Math.random() * 400, sy = Math.random() * 500;
            cx.beginPath(); cx.arc(sx, sy, Math.random() * 3 + 0.5, 0, Math.PI * 2);
            cx.fillStyle = `hsla(${h + Math.random()*60 - 30}, 60%, ${60 + Math.random()*30}%, ${Math.random() * 0.4})`;
            cx.fill();
        }
        // 主星
        const gx = 200 + (Math.sin(index * 1.7) * 80), gy = 200 + (Math.cos(index * 2.1) * 100);
        const glow = cx.createRadialGradient(gx, gy, 0, gx, gy, 120);
        glow.addColorStop(0, `hsla(${h}, 80%, 80%, 0.9)`);
        glow.addColorStop(0.3, `hsla(${h}, 70%, 50%, 0.4)`);
        glow.addColorStop(1, 'transparent');
        cx.fillStyle = glow; cx.beginPath(); cx.arc(gx, gy, 120, 0, Math.PI*2); cx.fill();
        // 光晕环
        cx.strokeStyle = `hsla(${h}, 70%, 70%, 0.3)`; cx.lineWidth = 0.5;
        cx.beginPath(); cx.arc(gx, gy, 80 + (index%3)*15, 0, Math.PI*2); cx.stroke();
        cx.beginPath(); cx.arc(gx, gy, 50 + (index%5)*10, 0, Math.PI*2); cx.stroke();
        return c.toDataURL('image/jpeg', 0.85);
    }

    async function initGallery() {
        const grid = document.getElementById('gallery-grid');
        let index = 1, hasRealPhotos = false;

        // 先尝试真实照片
        while (index <= 100) {
            const src = `images/${index}.jpg`;
            try {
                await loadImage(src);
                const item = createGalleryItem(src, index);
                grid.appendChild(item);
                hasRealPhotos = true;
                index++;
            } catch (e) { break; }
        }

        // 没有真实照片则生成 12 张抽象星云图
        if (!hasRealPhotos) {
            for (let i = 0; i < 12; i++) {
                const dataUrl = generateCosmicArt(i);
                const item = createGalleryItem(dataUrl, i + 1);
                grid.appendChild(item);
            }
        }
    }
    function loadImage(src) { return new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error('Not found')); img.src = src; }); }
    function createGalleryItem(src, index) { const div = document.createElement('div'); div.className = 'gallery-item glass-card'; const img = document.createElement('img'); img.src = src; img.alt = `Memory ${index}`; img.loading = 'lazy'; div.appendChild(img); div.addEventListener('click', () => openLightbox(src)); return div; }

    // 灯箱
    const lightbox = document.getElementById('lightbox'), lightboxImg = document.getElementById('lightbox-img');
    function openLightbox(src) { lightboxImg.src = src; lightbox.classList.add('active'); document.body.style.overflow = 'hidden'; }
    document.getElementById('lightbox-close').addEventListener('click', () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; });
    document.getElementById('lightbox-bg').addEventListener('click', () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.style.overflow = ''; } });

    // 音乐 — Web Audio 生成式星空氛围乐
    const musicBtn = document.getElementById('music-btn'), waveBars = document.querySelectorAll('.wave-bar');
    let audioCtx, isPlaying = false;
    let masterGain;

    // 和弦进行：Fmaj7 → Am7 → Dm7 → G7 (温柔梦幻)
    const chordProgression = [
        [261.63, 329.63, 392.00, 440.00],   // Fmaj7: F A C E
        [220.00, 261.63, 329.63, 392.00],   // Am7:  A C E G
        [293.66, 349.23, 440.00, 523.25],   // Dm7:  D F A C
        [196.00, 246.94, 293.66, 349.23],   // G7:   G B D F
    ];

    function initCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 0;
            masterGain.connect(audioCtx.destination);
        }
        return audioCtx;
    }

    // 创建带滤波的持续音色 — 温暖模拟感
    function createPadVoice(freq, detune, type) {
        const ctx = initCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = type || 'sine';
        osc.frequency.value = freq;
        osc.detune.value = detune || 0;

        filter.type = 'lowpass';
        filter.frequency.value = 600;
        filter.Q.value = 0.5;

        gain.gain.value = 0;

        lfo.type = 'sine';
        lfo.frequency.value = 0.03 + Math.random() * 0.04;
        lfoGain.gain.value = 15;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        lfo.start();
        return { osc, gain, filter, lfo, lfoGain };
    }

    // 星尘闪烁 — 高频短音点缀
    function createSparkle(freq) {
        const ctx = initCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = ctx.createDelay(1.0);

        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5 + Math.random() * 2);

        delay.delayTime.value = 0.3 + Math.random() * 0.4;
        const feedback = ctx.createGain();
        feedback.gain.value = 0.3;
        const wetGain = ctx.createGain();
        wetGain.gain.value = 0.4;

        osc.connect(gain);
        gain.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        gain.connect(masterGain);
        delay.connect(wetGain);
        wetGain.connect(masterGain);

        osc.start();
        osc.stop(ctx.currentTime + 3);
        return { osc, gain, delay, feedback, wetGain };
    }

    // 低音暖底
    function createBassDrone() {
        const ctx = initCtx();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'triangle';
        osc1.frequency.value = 43.65;  // F1
        osc2.type = 'sine';
        osc2.frequency.value = 87.31;  // F2
        osc2.detune.value = 5;

        filter.type = 'lowpass';
        filter.frequency.value = 120;

        gain.gain.value = 0.05;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc1.start();
        osc2.start();
        return { osc1, osc2, gain, filter };
    }

    let chordIndex = 0, chordTimeout, currentChordNodes = [], oldChordNodes = [];
    function cycleChords() {
        if (!isPlaying) return;
        const chord = chordProgression[chordIndex % chordProgression.length];

        // 标记旧节点待清理
        oldChordNodes = currentChordNodes;
        oldChordNodes.forEach(n => {
            try { if (n.gain) n.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5); } catch(e) {}
        });

        // 新和弦 — 存入独立数组避免竞态
        currentChordNodes = chord.flatMap(f => [
            createPadVoice(f, 0, 'sine'),
            createPadVoice(f / 2, 7 + Math.random() * 5, 'triangle'),
            createPadVoice(f * 2, -5, 'sine'),
        ]);

        // 淡入新和弦
        currentChordNodes.forEach(n => {
            try { if (n.gain) { n.gain.gain.setValueAtTime(0, audioCtx.currentTime); n.gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 2); } } catch(e) {}
        });

        // 延迟清理旧节点
        setTimeout(() => {
            oldChordNodes.forEach(n => {
                try { n.osc && n.osc.stop(); n.lfo && n.lfo.stop(); } catch(e) {}
            });
            oldChordNodes = [];
        }, 2000);

        // 星尘随和弦切换洒落
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                if (!isPlaying) return;
                const sparkFreq = chord[Math.floor(Math.random() * chord.length)] * (2 + Math.random() * 4);
                createSparkle(sparkFreq);
            }, i * 600 + Math.random() * 400);
        }

        chordIndex++;
        chordTimeout = setTimeout(cycleChords, 12000 + Math.random() * 4000);
    }

    // 撒星尘
    let sparkleInterval;
    function startSparkles() {
        sparkleInterval = setInterval(() => {
            if (!isPlaying) return;
            const freqs = [1047, 1319, 1568, 1760, 2093, 2637];  // 高音区
            createSparkle(freqs[Math.floor(Math.random() * freqs.length)]);
        }, 1500 + Math.random() * 3000);
    }

    function initAudio() {
        initCtx();
        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                // 停止
                masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);
                const allNodes = [...currentChordNodes, ...oldChordNodes];
                allNodes.forEach(n => { try { if (n.gain) n.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5); } catch(e) {} });
                clearTimeout(chordTimeout);
                clearInterval(sparkleInterval);
                waveBars.forEach(b => b.classList.remove('playing'));
                isPlaying = false;
                setTimeout(() => {
                    allNodes.forEach(n => { try { n.osc && n.osc.stop(); n.lfo && n.lfo.stop(); } catch(e) {} });
                    currentChordNodes = []; oldChordNodes = [];
                }, 2500);
            } else {
                // 播放
                if (audioCtx.state === 'suspended') audioCtx.resume();
                masterGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 2);
                createBassDrone();
                chordIndex = 0;
                cycleChords();
                startSparkles();
                waveBars.forEach(b => b.classList.add('playing'));
                isPlaying = true;
            }
        });
    }

    // Web Audio 交互音效
    function playTone(f, t, d, v = 0.1) { try { const c = initCtx(), o = c.createOscillator(), g = c.createGain(); o.type = t; o.frequency.setValueAtTime(f, c.currentTime); g.gain.setValueAtTime(v, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d); } catch (e) {} }
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

    // 评论区
    (function() {
        var script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.setAttribute('repo', 'pop-yu/lumiere-birthday');
        script.setAttribute('issue-term', 'pathname');
        script.setAttribute('theme', 'github-dark');
        script.setAttribute('crossorigin', 'anonymous');
        script.async = true;
        document.getElementById('utterances-comments').appendChild(script);
    })();
})();