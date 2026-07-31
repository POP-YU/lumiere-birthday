(function() {
    'use strict';
    var GF_NAME = '花花';
    var SINCE_DATE = new Date('2026-10-17T00:00:00');

    // ============ 星空粒子系统 ============
    var canvas = document.getElementById('starfield-canvas');
    var ctx = canvas.getContext('2d');
    var particles = [], mouse = { x: -1000, y: -1000 }, animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    function initParticles() {
        var area = canvas.width * canvas.height;
        var count = Math.floor(area * (area < 600000 ? 0.0001 : 0.00015));
        particles = [];
        for (var i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.3,
                baseX: 0, baseY: 0,
                speed: Math.random() * 0.03 + 0.01,
                opacity: Math.random() * 0.7 + 0.3,
                trail: []
            });
            particles[i].baseX = particles[i].x;
            particles[i].baseY = particles[i].y;
        }
    }
    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var mx = mouse.x, my = mouse.y;
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var dx = mx - p.x, dy = my - p.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                var force = (1 - dist / 150) * 0.6;
                p.x += dx * force * 0.02;
                p.y += dy * force * 0.02;
            }
            p.x += (p.baseX - p.x) * 0.015;
            p.y += (p.baseY - p.y) * 0.015;
            p.baseX += p.speed * 0.2;
            if (p.baseX > canvas.width + 20) p.baseX = -20;
            if (p.baseX < -20) p.baseX = canvas.width + 20;
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 5) p.trail.shift();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212,175,135,' + p.opacity + ')';
            ctx.fill();
            for (var j = 0; j < p.trail.length; j++) {
                var t = p.trail[j];
                ctx.beginPath();
                ctx.arc(t.x, t.y, p.size * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(180,150,210,' + (p.opacity * 0.2 * (j / p.trail.length)) + ')';
                ctx.fill();
            }
        }
        // 根据滚动偏移移动星场
        var sy = smoothScrollY * 0.02;
        ctx.save();
        ctx.translate(0, -sy);
        animationId = requestAnimationFrame(drawStars);
    }
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('touchmove', function(e) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, { passive: true });
    resizeCanvas();
    drawStars();

    // ============ 加载器 ============
    var loader = document.getElementById('preamble-loader');
    var fill = document.getElementById('loader-fill');
    var loaderText = document.getElementById('loader-text');
    var loaderPct = document.getElementById('loader-pct');
    var main = document.getElementById('main-content');
    var gate = document.getElementById('universe-gate');
    var progress = 0;
    var photoCount = 0;
    var photoPaths = [];

    // 预设照片列表
    for (var pi = 1; pi <= 100; pi++) {
        photoPaths.push('images/' + pi + '.jpg');
    }

    function simulateLoading() {
        if (progress < 85) {
            progress += Math.random() * 12 + 3;
            if (progress > 85) progress = 85;
            fill.style.width = progress + '%';
            loaderPct.textContent = Math.floor(progress);
            requestAnimationFrame(function() {
                setTimeout(simulateLoading, 120 + Math.random() * 120);
            });
        } else {
            // 探测照片
            probePhotos(0);
        }
    }

    function probePhotos(idx) {
        if (idx >= 50 || photoCount >= photoPaths.length) {
            finishLoading();
            return;
        }
        var src = photoPaths[idx];
        var img = new Image();
        var done = false;
        img.onload = function() {
            if (!done) { done = true; photoCount++; updateProgressFromProbe(); probePhotos(idx + 1); }
        };
        img.onerror = function() {
            if (!done) { done = true; updateProgressFromProbe(); probePhotos(idx + 1); }
        };
        img.src = src;
        setTimeout(function() {
            if (!done) { done = true; updateProgressFromProbe(); probePhotos(idx + 1); }
        }, 800);
    }

    function updateProgressFromProbe() {
        progress = Math.min(100, 85 + Math.floor((photoCount / Math.max(1, Math.min(50, photoPaths.length))) * 15));
        fill.style.width = progress + '%';
        loaderPct.textContent = Math.floor(progress);
    }

    function finishLoading() {
        progress = 100;
        fill.style.width = '100%';
        loaderPct.textContent = '100';
        loaderText.textContent = 'STELLAR GATEWAY READY';
        setTimeout(function() {
            loader.classList.add('hidden');
            gate.classList.remove('hidden');
        }, 600);
    }

    simulateLoading();

    // ============ 宇宙之门 ============
    var gateBtn = document.getElementById('gate-btn');
    var musicPlaying = false;
    gateBtn.addEventListener('click', function() {
        if (musicPlaying) return;
        musicPlaying = true;
        // 开启音乐
        startAmbientMusic();
        // 隐藏gate
        gate.style.opacity = '0';
        setTimeout(function() {
            gate.classList.add('hidden');
            // 显示主内容
            main.classList.remove('hidden');
            main.style.opacity = '1';
            main.style.visibility = 'visible';
            document.body.style.overflow = '';
            // 初始化各模块
            initChronograph();
            initGallery();
            initEchoes();
            initGift();
            initSfx();
            initLerpScroll();
            initPortal();
        }, 600);
    });

    // ============ 沉浸式氛围音乐引擎 ============
    var audioCtx, masterGain, reverbNode, musicNodes = [];
    var bassNodes = [], padNodes = [], shimmerNodes = [];
    var chordTimeout, shimmerInterval;

    function initAudioCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            // Master gain
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 0;
            // 混响模拟：多级延迟
            reverbNode = createReverb();
            masterGain.connect(reverbNode);
            reverbNode.connect(audioCtx.destination);
            // 干信号也直接输出
            var dryGain = audioCtx.createGain();
            dryGain.gain.value = 0.4;
            masterGain.connect(dryGain);
            dryGain.connect(audioCtx.destination);
        }
        return audioCtx;
    }

    function createReverb() {
        var ctx = initAudioCtx();
        var input = ctx.createGain();
        var output = ctx.createGain();
        output.gain.value = 0.5;
        var delays = [0.037, 0.043, 0.051, 0.059, 0.067, 0.073, 0.081, 0.089];
        for (var i = 0; i < delays.length; i++) {
            var d = ctx.createDelay(1);
            d.delayTime.value = delays[i];
            var g = ctx.createGain();
            g.gain.value = 0.06;
            var f = ctx.createBiquadFilter();
            f.type = 'lowpass';
            f.frequency.value = 2000 + Math.random() * 3000;
            input.connect(d);
            d.connect(g);
            g.connect(f);
            f.connect(output);
            g.connect(d); // feedback
        }
        return { input: input, output: output, connect: function(dest) { output.connect(dest); } };
    }

    function createLayeredVoice(freq, detune, type, filterFreq, gainVal) {
        var ctx = initAudioCtx();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var filter = ctx.createBiquadFilter();
        var lfoOsc = ctx.createOscillator();
        var lfoGain = ctx.createGain();

        osc.type = type || 'sawtooth';
        osc.frequency.value = freq;
        osc.detune.value = detune || 0;

        filter.type = 'lowpass';
        filter.frequency.value = filterFreq || 800;
        filter.Q.value = 0.4;

        gain.gain.value = 0;

        lfoOsc.type = 'sine';
        lfoOsc.frequency.value = 0.02 + Math.random() * 0.06;
        lfoGain.gain.value = filterFreq * 0.3;

        lfoOsc.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        lfoOsc.start();

        // 渐入
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(gainVal || 0.04, ctx.currentTime + 2);

        return { osc: osc, gain: gain, filter: filter, lfo: lfoOsc, lfoGain: lfoGain };
    }

    function createBassDrone() {
        var ctx = initAudioCtx();
        var osc1 = ctx.createOscillator();
        var osc2 = ctx.createOscillator();
        var osc3 = ctx.createOscillator();
        var gain = ctx.createGain();
        var filter = ctx.createBiquadFilter();

        osc1.type = 'triangle';
        osc1.frequency.value = 43.65;
        osc2.type = 'sine';
        osc2.frequency.value = 87.31;
        osc2.detune.value = 6;
        osc3.type = 'sawtooth';
        osc3.frequency.value = 43.65;
        osc3.detune.value = -4;

        filter.type = 'lowpass';
        filter.frequency.value = 140;
        filter.Q.value = 0.6;

        gain.gain.value = 0;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3);

        osc1.connect(filter);
        osc2.connect(filter);
        osc3.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc1.start(); osc2.start(); osc3.start();
        return { osc1: osc1, osc2: osc2, osc3: osc3, gain: gain, filter: filter };
    }

    // 和弦进行：Fmaj7 → Am9 → Dm7 → G9sus4
    var chordProgression = [
        [261.63, 329.63, 392.00, 440.00, 523.25],
        [220.00, 261.63, 329.63, 392.00, 493.88],
        [293.66, 349.23, 440.00, 523.25, 587.33],
        [196.00, 246.94, 293.66, 349.23, 440.00]
    ];

    var chordIdx = 0, currentPads = [], oldPads = [];

    function cyclePadChords() {
        if (!musicPlaying) return;
        var chord = chordProgression[chordIdx % chordProgression.length];

        // 淡出旧和弦
        oldPads = currentPads;
        oldPads.forEach(function(n) {
            try { if (n.gain) n.gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.5); } catch(e) {}
        });

        // 新和弦：多层叠加
        currentPads = [];
        chord.forEach(function(f) {
            currentPads.push(createLayeredVoice(f, 0, 'sawtooth', 500, 0.035));
            currentPads.push(createLayeredVoice(f / 2, 8, 'triangle', 300, 0.03));
            currentPads.push(createLayeredVoice(f * 2, -6, 'sine', 1200, 0.025));
        });

        // 延迟清理
        setTimeout(function() {
            oldPads.forEach(function(n) {
                try { n.osc && n.osc.stop(); n.lfo && n.lfo.stop(); } catch(e) {}
            });
            oldPads = [];
        }, 2000);

        // 星尘洒落
        for (var i = 0; i < 4; i++) {
            (function(delay) {
                setTimeout(function() {
                    if (!musicPlaying) return;
                    createShimmer(chord[Math.floor(Math.random() * chord.length)] * (2 + Math.random() * 5));
                }, delay);
            })(i * 500 + Math.random() * 500);
        }

        chordIdx++;
        chordTimeout = setTimeout(cyclePadChords, 14000 + Math.random() * 5000);
    }

    function createShimmer(freq) {
        var ctx = initAudioCtx();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var filter = ctx.createBiquadFilter();
        var delay = ctx.createDelay(1);

        osc.type = 'sine';
        osc.frequency.value = freq;
        filter.type = 'bandpass';
        filter.frequency.value = freq;
        filter.Q.value = 3;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

        delay.delayTime.value = 0.25 + Math.random() * 0.5;
        var fb = ctx.createGain();
        fb.gain.value = 0.4;
        var wet = ctx.createGain();
        wet.gain.value = 0.5;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(delay);
        delay.connect(fb);
        fb.connect(delay);
        gain.connect(masterGain);
        delay.connect(wet);
        wet.connect(masterGain);

        osc.start();
        osc.stop(ctx.currentTime + 3.5);
    }

    function startShimmerCycle() {
        shimmerInterval = setInterval(function() {
            if (!musicPlaying) return;
            var freqs = [1047, 1319, 1568, 1760, 2093, 2349, 2637, 2794, 3136, 3520];
            createShimmer(freqs[Math.floor(Math.random() * freqs.length)]);
        }, 2000 + Math.random() * 3000);
    }

    function startAmbientMusic() {
        initAudioCtx();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        // 主音量渐入 1.5s → 0.8 (80%)
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 1.5);

        // 低音层
        bassNodes = [createBassDrone(), createBassDrone()];

        // 开始和弦循环
        chordIdx = 0;
        cyclePadChords();
        startShimmerCycle();

        // 波形动效
        var waveBars = document.querySelectorAll('.wave-bar');
        waveBars.forEach(function(b) { b.classList.add('playing'); });

        // 音乐按钮事件
        var musicBtn = document.getElementById('music-btn');
        musicBtn.addEventListener('click', function() {
            if (musicPlaying) {
                // 暂停：淡出
                masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
                clearTimeout(chordTimeout);
                clearInterval(shimmerInterval);
                waveBars.forEach(function(b) { b.classList.remove('playing'); });
                musicPlaying = false;
                // 清理节点
                setTimeout(function() {
                    var all = currentPads.concat(oldPads, bassNodes);
                    all.forEach(function(n) {
                        try { if (n.osc) n.osc.stop(); if (n.osc1) { n.osc1.stop(); n.osc2.stop(); n.osc3.stop(); } if (n.lfo) n.lfo.stop(); } catch(e) {}
                    });
                    currentPads = []; oldPads = []; bassNodes = [];
                }, 2000);
            } else {
                // 继续
                if (audioCtx.state === 'suspended') audioCtx.resume();
                masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
                masterGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.8);
                bassNodes = [createBassDrone()];
                chordIdx = 0;
                cyclePadChords();
                startShimmerCycle();
                waveBars.forEach(function(b) { b.classList.add('playing'); });
                musicPlaying = true;
            }
        });
    }

    // ============ UI 交互音效 ============
    function initSfx() {
        function playSfx(freq, type, dur, vol, filterType, filterFreq) {
            try {
                var c = initAudioCtx();
                var o = c.createOscillator();
                var g = c.createGain();
                var f = filterType ? c.createBiquadFilter() : null;
                o.type = type || 'sine';
                o.frequency.setValueAtTime(freq, c.currentTime);
                g.gain.setValueAtTime(vol || 0.08, c.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (dur || 0.3));
                if (f) { f.type = filterType; f.frequency.value = filterFreq || 1000; f.Q.value = 2; o.connect(f); f.connect(g); }
                else { o.connect(g); }
                g.connect(audioCtx.destination);
                o.start(); o.stop(c.currentTime + dur + 0.1);
            } catch(e) {}
        }

        // 卡片悬停：气流声
        document.querySelectorAll('.gallery-item, .echo-capsule, .gate-btn, .echo-launch-btn').forEach(function(el) {
            el.addEventListener('mouseenter', function() { playSfx(200 + Math.random()*200, 'sine', 0.25, 0.04, 'lowpass', 400); });
        });

        // 按钮点击：空间回响
        document.querySelectorAll('button').forEach(function(el) {
            el.addEventListener('click', function() { playSfx(800, 'sine', 0.15, 0.06, 'bandpass', 1200); });
        });
    }

    // ============ 双星交互 ============
    var leftWrapper = document.getElementById('left-planet-wrapper');
    var rightWrapper = document.getElementById('right-planet-wrapper');
    var stage = document.getElementById('planets-stage');
    if (stage) {
        stage.addEventListener('mousemove', function(e) {
            var rect = stage.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            var ix = x / (rect.width / 2) * 8;
            var iy = y / (rect.height / 2) * 8;
            leftWrapper.style.transform = 'translate(' + (ix * 0.7) + 'px, ' + (iy * 0.5) + 'px)';
            rightWrapper.style.transform = 'translate(' + (-ix * 0.7) + 'px, ' + (iy * 0.5) + 'px)';
        });
        stage.addEventListener('mouseleave', function() {
            leftWrapper.style.transform = 'translate(0,0)';
            rightWrapper.style.transform = 'translate(0,0)';
        });
    }

    // ============ 时光罗盘 ============
    function updateChrono() {
        var now = new Date();
        var diff = now - SINCE_DATE;
        var s = Math.floor(diff / 1000);
        var m = Math.floor(s / 60);
        var h = Math.floor(m / 60);
        var d = Math.floor(h / 24);
        var mo = Math.floor(d / 30.436875);
        var y = Math.floor(mo / 12);
        document.getElementById('c-years').textContent = String(y).padStart(2, '0');
        document.getElementById('c-months').textContent = String(mo % 12).padStart(2, '0');
        document.getElementById('c-days').textContent = String(Math.floor(d % 30.436875)).padStart(2, '0');
        document.getElementById('c-hours').textContent = String(h % 24).padStart(2, '0');
        document.getElementById('c-minutes').textContent = String(m % 60).padStart(2, '0');
        document.getElementById('c-seconds').textContent = String(s % 60).padStart(2, '0');
        document.getElementById('chrono-since').textContent = 'Since ' + SINCE_DATE.getFullYear() + '.' + String(SINCE_DATE.getMonth()+1).padStart(2,'0') + '.' + String(SINCE_DATE.getDate()).padStart(2,'0');
    }
    function initChronograph() {
        updateChrono();
        setInterval(updateChrono, 1000);
    }

    // ============ 相册画廊 + 3D倾斜 + 穿越动画 ============
    function generateCosmicArt(index) {
        var c = document.createElement('canvas');
        c.width = 400; c.height = 500;
        var cx = c.getContext('2d');
        var bgGrad = cx.createRadialGradient(200 + (index%5-2)*40, 200 + (index%3-1)*60, 20, 200, 250, 400);
        var hues = [280, 320, 30, 200, 340, 45, 260, 15, 300, 180, 350, 60];
        var h = hues[index % hues.length];
        bgGrad.addColorStop(0, 'hsla(' + h + ', 70%, 25%, 0.9)');
        bgGrad.addColorStop(0.4, 'hsla(' + ((h+40)%360) + ', 40%, 15%, 0.7)');
        bgGrad.addColorStop(1, '#07070f');
        cx.fillStyle = bgGrad;
        cx.fillRect(0, 0, 400, 500);
        for (var i = 0; i < 300; i++) {
            cx.beginPath();
            cx.arc(Math.random() * 400, Math.random() * 500, Math.random() * 3 + 0.5, 0, Math.PI * 2);
            cx.fillStyle = 'hsla(' + (h + Math.random()*60 - 30) + ', 60%, ' + (60 + Math.random()*30) + '%, ' + (Math.random() * 0.4) + ')';
            cx.fill();
        }
        var gx = 200 + Math.sin(index * 1.7) * 80;
        var gy = 200 + Math.cos(index * 2.1) * 100;
        var glow = cx.createRadialGradient(gx, gy, 0, gx, gy, 120);
        glow.addColorStop(0, 'hsla(' + h + ', 80%, 80%, 0.9)');
        glow.addColorStop(0.3, 'hsla(' + h + ', 70%, 50%, 0.4)');
        glow.addColorStop(1, 'transparent');
        cx.fillStyle = glow;
        cx.beginPath();
        cx.arc(gx, gy, 120, 0, Math.PI*2);
        cx.fill();
        cx.strokeStyle = 'hsla(' + h + ', 70%, 70%, 0.3)';
        cx.lineWidth = 0.5;
        cx.beginPath();
        cx.arc(gx, gy, 80 + (index%3)*15, 0, Math.PI*2);
        cx.stroke();
        cx.beginPath();
        cx.arc(gx, gy, 50 + (index%5)*10, 0, Math.PI*2);
        cx.stroke();
        return c.toDataURL('image/jpeg', 0.85);
    }

    var galleryPhotos = [];
    var photoPoems = [
        '宇宙广袤，星河璀璨，\n但有你的那一隅，\n才是我唯一想停留的坐标。',
        '你的笑是引力波，\n穿越亿万光年，\n抵达我心底最柔软的地方。',
        '时间在我遇见你之后\n才开始真正流动——\n每一秒都有了意义。',
        '我们之间的距离，\n像是两颗相互环绕的恒星，\n靠近、远离，但永远不会脱离彼此的轨道。',
        '如果宇宙有尽头，\n我希望尽头那端，\n站着你。',
        '你是我所有浪漫方程\n的唯一解。',
        '在我混乱的熵增宇宙里，\n你是唯一的负熵——\n让一切有了秩序。',
        '把对你的思念\n折叠进每一帧相片，\n打开就是整个星河。',
        '平行宇宙里\n有无数个我，\n但每一个都只会爱你。',
        '愿做你环游宇宙时\n那颗永远为你发光的\n北极星。',
        '在这个无限膨胀的宇宙里，\n你是我不变的常数。'
    ];

    function loadImage(src) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() { resolve(img); };
            img.onerror = function() { reject(new Error('Not found')); };
            img.src = src;
        });
    }

    function createGalleryItem(src, index) {
        var div = document.createElement('div');
        div.className = 'gallery-item glass-card';
        div.setAttribute('data-index', index);
        var scanLine = document.createElement('div');
        scanLine.className = 'scan-line';
        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Memory ' + index;
        img.loading = 'lazy';
        div.appendChild(img);
        div.appendChild(scanLine);

        // 3D倾斜
        div.addEventListener('mousemove', function(e) {
            var rect = div.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var cx = rect.width / 2, cy = rect.height / 2;
            var rx = (y - cy) / cy * 12;
            var ry = (x - cx) / cx * -12;
            div.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.03)';
        });
        div.addEventListener('mouseleave', function() {
            div.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
        });

        // 点击穿越
        div.addEventListener('click', function() {
            openPortal(src, index);
        });

        return div;
    }

    function initGallery() {
        var grid = document.getElementById('gallery-grid');
        var realCount = 0;

        // 批量加载真实照片
        function loadBatch(startIdx) {
            if (startIdx > 50 || realCount >= 50) {
                finishGallery();
                return;
            }
            var src = 'images/' + startIdx + '.jpg';
            loadImage(src).then(function() {
                realCount++;
                galleryPhotos.push({ src: src, index: realCount });
                loadBatch(startIdx + 1);
            }).catch(function() {
                loadBatch(startIdx + 1);
            });
        }

        function finishGallery() {
            if (galleryPhotos.length === 0) {
                // 无照片，生成星云图
                for (var i = 0; i < 12; i++) {
                    var dataUrl = generateCosmicArt(i);
                    galleryPhotos.push({ src: dataUrl, index: i + 1, isGenerated: true });
                }
            }
            // 渲染
            galleryPhotos.forEach(function(photo) {
                var item = createGalleryItem(photo.src, photo.index);
                grid.appendChild(item);
            });
        }

        loadBatch(1);
    }

    // ============ 记忆维度沉浸展厅 ============
    var portalOverlay = document.getElementById('portal-overlay');
    var portalImg = document.getElementById('portal-img');
    var portalMeta = document.getElementById('portal-meta');
    var portalPoem = document.getElementById('portal-poem');
    var portalReturnBtn = document.getElementById('portal-return-btn');
    var portalBg = document.getElementById('portal-bg');
    var portalActive = false;
    var portalSourceEl = null;

    function initPortal() {
        portalReturnBtn.addEventListener('click', closePortal);
        portalBg.addEventListener('click', closePortal);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && portalActive) closePortal();
        });
    }

    function openPortal(src, index) {
        if (portalActive) return;
        portalActive = true;

        // 找到源卡片做FLIP
        var items = document.querySelectorAll('.gallery-item');
        portalSourceEl = null;
        items.forEach(function(item) {
            if (item.querySelector('img') && item.querySelector('img').src === src) {
                portalSourceEl = item;
            }
        });

        portalImg.src = src;
        portalMeta.textContent = '[ MEMORY ARCHIVE · FRAME #' + String(index).padStart(3,'0') + ' ]  ◆  ' + SINCE_DATE.getFullYear() + ' ~ ∞';
        portalPoem.textContent = photoPoems[(index - 1) % photoPoems.length];

        // 背景模糊
        main.style.filter = 'blur(20px)';
        main.style.transform = 'scale(0.95)';
        main.style.transition = 'filter 0.8s ease, transform 0.8s ease';

        portalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 卡片放大动画
        if (portalSourceEl) {
            var rect = portalSourceEl.getBoundingClientRect();
            portalSourceEl.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            portalSourceEl.style.transform = 'translate(' +
                (window.innerWidth/2 - rect.left - rect.width/2) + 'px, ' +
                (window.innerHeight/2 - rect.top - rect.height/2) + 'px) scale(0.01)';
            portalSourceEl.style.opacity = '0';
        }
    }

    function closePortal() {
        if (!portalActive) return;
        portalActive = false;

        main.style.filter = 'blur(0px)';
        main.style.transform = 'scale(1)';
        portalOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // 恢复卡片
        if (portalSourceEl) {
            setTimeout(function() {
                portalSourceEl.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                portalSourceEl.style.transform = '';
                portalSourceEl.style.opacity = '1';
            }, 300);
        }
    }

    // ============ 物理惯性视差滚动 ============
    var smoothScrollY = 0;
    var currentScrollY = 0;
    var targetScrollY = 0;
    var scrollDamping = 0.09;
    var parallaxBg = document.getElementById('parallax-bg');
    var parallaxMid = document.getElementById('parallax-mid');

    function initLerpScroll() {
        document.body.style.height = main.scrollHeight + 'px';
        document.body.style.overflowY = 'scroll';
        document.body.style.overflowX = 'hidden';

        window.addEventListener('wheel', function(e) {
            e.preventDefault();
            targetScrollY += e.deltaY;
            targetScrollY = Math.max(0, Math.min(targetScrollY, document.body.scrollHeight - window.innerHeight));
        }, { passive: false });

        var touchStartY = 0, touchStartScroll = 0;
        window.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            touchStartScroll = targetScrollY;
        }, { passive: false });

        window.addEventListener('touchmove', function(e) {
            e.preventDefault();
            var dy = touchStartY - e.touches[0].clientY;
            targetScrollY = touchStartScroll + dy;
            targetScrollY = Math.max(0, Math.min(targetScrollY, document.body.scrollHeight - window.innerHeight));
        }, { passive: false });

        function lerpLoop() {
            currentScrollY += (targetScrollY - currentScrollY) * scrollDamping;
            if (Math.abs(targetScrollY - currentScrollY) < 0.05) currentScrollY = targetScrollY;
            smoothScrollY = currentScrollY;

            // 主内容位移
            main.style.transform = 'translateY(' + (-currentScrollY) + 'px)';

            // 视差层
            if (parallaxBg) parallaxBg.style.transform = 'translateY(' + (-currentScrollY * 0.15) + 'px)';
            if (parallaxMid) parallaxMid.style.transform = 'translateY(' + (-currentScrollY * 0.08) + 'px)';

            // 星空偏移
            canvas.style.transform = 'translateY(' + (-currentScrollY * 0.03) + 'px)';

            // 更新body高度
            var newH = main.scrollHeight;
            if (Math.abs(document.body.scrollHeight - newH) > 10) {
                document.body.style.height = newH + 'px';
            }

            requestAnimationFrame(lerpLoop);
        }
        lerpLoop();
    }

    // ============ Starlight Echoes 超维星轨情感回响 ============
    var presetEchoes = [
        { coords: '2025.06.23 · 相遇坐标', author: '时空观测者', body: '那天晚风和你的裙摆一样温柔，宇宙的引力从此有了确切的方向。' },
        { coords: 'LOVE-SYSTEM · 观测日志', author: '星河服务器', body: '爱情恒定引力系数监测正常：双星共振已稳定维持，心动值突破临界点。' },
        { coords: '未来时空 · 2027 见证', author: '未来来客', body: '在下一个、下下个光年里，依然会像第一天那样为你着迷。' },
        { coords: 'Elena\'s Orbit · 专属注记', author: '星河导航员', body: '愿你的岁岁年年，都有漫天星光和永远不退场的偏爱。' },
        { coords: '空间站 · 永久备份', author: '宇宙档案馆', body: '这段时光已被刻入宇宙微波背景辐射，无可擦除，永不褪色。' },
        { coords: 'SIGNAL-042 · 深空信号', author: '旅行者号', body: '跨越星系的漫长旅途中，你是唯一值得我减速停靠的引力场。' },
        { coords: '星历 2026.10.17', author: '守夜人', body: '从那年秋天开始，我的世界便只有你这一颗北极星。生日快乐，花花。' },
        { coords: 'NEUTRON STAR · 致密情感', author: '天体物理学家', body: '对你的喜欢密度已经超过钱德拉塞卡极限——无法再被压缩，只能无限发光。' },
        { coords: 'WORMHOLE · 瞬达心意', author: '维度旅人', body: '穿越虫洞我也要第一时间来到你身边，因为宇宙再大，你才是中心。' },
        { coords: 'COSMIC · 永恒回响', author: '暗能量', body: '你是我加速膨胀的宇宙里，唯一的、温柔的常数。' }
    ];

    var userEchoes = [];
    var echoesData = [];

    function loadEchoes() {
        try {
            var stored = localStorage.getItem('starlight-echoes');
            if (stored) {
                userEchoes = JSON.parse(stored);
            }
        } catch(e) {
            userEchoes = [];
        }
        echoesData = userEchoes.concat(presetEchoes);
        if (echoesData.length === 0) echoesData = presetEchoes.slice();
    }

    function saveEchoes() {
        try {
            localStorage.setItem('starlight-echoes', JSON.stringify(userEchoes));
        } catch(e) {}
    }

    function createEchoCapsule(echo, isNew) {
        var capsule = document.createElement('div');
        capsule.className = 'echo-capsule glass-card';
        if (isNew) {
            capsule.style.animation = 'none';
            capsule.offsetHeight;
            capsule.style.animation = 'capsuleAppear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }

        var coordsEl = document.createElement('div');
        coordsEl.className = 'echo-capsule-coords';
        coordsEl.textContent = echo.coords;

        var authorEl = document.createElement('div');
        authorEl.className = 'echo-capsule-author';
        authorEl.textContent = '— ' + echo.author;

        var bodyEl = document.createElement('div');
        bodyEl.className = 'echo-capsule-body';
        bodyEl.textContent = echo.body;

        var timeEl = document.createElement('div');
        timeEl.className = 'echo-capsule-time';
        timeEl.textContent = echo.time || '✦ 已入轨';

        capsule.appendChild(coordsEl);
        capsule.appendChild(authorEl);
        capsule.appendChild(bodyEl);
        capsule.appendChild(timeEl);
        return capsule;
    }

    function renderEchoStream() {
        var track = document.getElementById('echoes-track');
        if (!track) return;
        track.innerHTML = '';

        // 双倍渲染确保无缝循环
        for (var dup = 0; dup < 2; dup++) {
            for (var i = 0; i < echoesData.length; i++) {
                var capsule = createEchoCapsule(echoesData[i], false);
                track.appendChild(capsule);
            }
        }
    }

    function addEcho(author, body) {
        var now = new Date();
        var ts = now.getFullYear() + '.' + String(now.getMonth()+1).padStart(2,'0') + '.' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
        var echo = {
            coords: '[ 新信号 · ' + ts + ' ]',
            author: author || '匿名旅人',
            body: body,
            time: '✦ 刚刚入轨'
        };
        userEchoes.unshift(echo);
        saveEchoes();
        echoesData = userEchoes.concat(presetEchoes);
        renderEchoStream();
        return echo;
    }

    // 发射粒子动画
    function launchEchoParticle(fromEl, callback) {
        var pCanvas = document.getElementById('echo-particle-canvas');
        var pCtx = pCanvas.getContext('2d');
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;

        var rect = fromEl.getBoundingClientRect();
        var sx = rect.left + rect.width / 2;
        var sy = rect.top + rect.height / 2;
        var ex = window.innerWidth / 2;
        var ey = window.innerHeight / 2;

        var particles = [];
        for (var i = 0; i < 40; i++) {
            particles.push({
                x: sx, y: sy,
                tx: ex, ty: ey,
                size: Math.random() * 4 + 2,
                life: 1,
                delay: i * 15,
                color: 'hsla(' + (30 + Math.random()*30) + ', 80%, ' + (60 + Math.random()*30) + '%,'
            });
        }

        var startTime = Date.now();
        function animateParticles() {
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            var elapsed = Date.now() - startTime;
            var allDone = true;

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                if (elapsed < p.delay) { allDone = false; continue; }
                var t = Math.min(1, (elapsed - p.delay) / 800);
                // 贝塞尔轨迹
                var midX = (sx + ex) / 2 + (Math.sin(t * Math.PI) * 200);
                var midY = Math.min(sy, ey) - 150 - t * 100;
                var bx = (1-t)*(1-t)*sx + 2*(1-t)*t*midX + t*t*ex;
                var by = (1-t)*(1-t)*sy + 2*(1-t)*t*midY + t*t*ey;

                p.x = bx; p.y = by;
                p.life = 1 - t;

                var alpha = p.life * 0.8;
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2);
                pCtx.fillStyle = p.color + alpha + ')';
                pCtx.fill();

                // 光环
                if (t > 0.7) {
                    var ringAlpha = (t - 0.7) / 0.3 * 0.5;
                    pCtx.beginPath();
                    pCtx.arc(ex, ey, (1-t) * 80, 0, Math.PI*2);
                    pCtx.strokeStyle = 'rgba(212,175,135,' + ringAlpha + ')';
                    pCtx.lineWidth = 1.5;
                    pCtx.stroke();
                }

                if (t < 1) allDone = false;
            }

            if (!allDone) {
                requestAnimationFrame(animateParticles);
            } else {
                pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
                // 最终爆裂光环
                pCtx.beginPath();
                pCtx.arc(ex, ey, 60, 0, Math.PI*2);
                pCtx.strokeStyle = 'rgba(212,175,135,0.6)';
                pCtx.lineWidth = 2;
                pCtx.stroke();
                setTimeout(function() { pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height); }, 300);
                if (callback) callback();
            }
        }
        requestAnimationFrame(animateParticles);
    }

    // 回响Modal
    function initEchoModal() {
        var overlay = document.getElementById('echo-modal-overlay');
        var closeBtn = document.getElementById('echo-modal-close');
        var submitBtn = document.getElementById('echo-submit-btn');
        var authorInput = document.getElementById('echo-author');
        var messageInput = document.getElementById('echo-message');
        var countEl = document.getElementById('echo-count');

        messageInput.addEventListener('input', function() {
            countEl.textContent = messageInput.value.length;
        });

        closeBtn.addEventListener('click', function() {
            overlay.classList.remove('active');
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.classList.remove('active');
        });

        submitBtn.addEventListener('click', function() {
            var author = authorInput.value.trim() || '匿名旅人';
            var body = messageInput.value.trim();
            if (!body) return;

            overlay.classList.remove('active');
            var btnRect = submitBtn.getBoundingClientRect();
            launchEchoParticle(submitBtn, function() {
                addEcho(author, body);
            });

            // 清空
            authorInput.value = '';
            messageInput.value = '';
            countEl.textContent = '0';
        });

        // 回响流hover暂停
        var track = document.getElementById('echoes-track');
        if (track) {
            track.addEventListener('mouseenter', function() { track.classList.add('paused'); });
            track.addEventListener('mouseleave', function() { track.classList.remove('paused'); });
        }
    }

    function initEchoes() {
        loadEchoes();
        renderEchoStream();
        initEchoModal();

        // 发射按钮
        var launchBtn = document.getElementById('echo-launch-btn');
        if (launchBtn) {
            launchBtn.addEventListener('click', function() {
                document.getElementById('echo-modal-overlay').classList.add('active');
            });
        }

        // CSS keyframe for capsule appear
        var style = document.createElement('style');
        style.textContent = '@keyframes capsuleAppear{0%{opacity:0;transform:scale(0.8) translateY(20px)}100%{opacity:1;transform:scale(1) translateY(0)}}';
        document.head.appendChild(style);
    }

    // ============ 礼盒 ============
    var giftBox = document.getElementById('gift-box');
    var holdIndicator = document.getElementById('hold-indicator');
    var heartbeatRing = document.getElementById('heartbeat-ring');
    var loveOverlay = document.getElementById('love-letter-overlay');
    var loveContent = document.getElementById('love-letter-content');
    var confettiCanvas = document.getElementById('confetti-canvas');
    var ctxC = confettiCanvas.getContext('2d');
    var holdInterval, holdStart;

    function initGift() {
        if (!giftBox) return;
        giftBox.addEventListener('mousedown', startHold);
        giftBox.addEventListener('touchstart', startHold, { passive: false });
        giftBox.addEventListener('mouseup', cancelHold);
        giftBox.addEventListener('mouseleave', cancelHold);
        giftBox.addEventListener('touchend', cancelHold);
        giftBox.addEventListener('touchcancel', cancelHold);
        document.getElementById('love-letter-close').addEventListener('click', function() {
            loveOverlay.classList.remove('active');
        });
    }

    function startHold(e) {
        e.preventDefault();
        holdStart = Date.now();
        holdIndicator.textContent = 'Hold 3s';
        heartbeatRing.classList.add('active');
        holdInterval = setInterval(function() {
            var e2 = Date.now() - holdStart;
            holdIndicator.textContent = 'Hold ' + Math.max(0, Math.ceil((3000 - e2) / 1000)) + 's';
            if (e2 >= 3000) { unlockGift(); clearInterval(holdInterval); }
        }, 100);
    }

    function cancelHold() {
        if (holdInterval) clearInterval(holdInterval);
        holdIndicator.textContent = 'Hold 3s';
        heartbeatRing.classList.remove('active');
    }

    function unlockGift() {
        giftBox.classList.add('unlocked');
        holdIndicator.textContent = 'Unlocked ❤';
        heartbeatRing.classList.remove('active');
        startConfetti();
        setTimeout(function() {
            loveOverlay.classList.add('active');
            typeWriterLetter();
        }, 800);
    }

    function typeWriterLetter() {
        var letter = '我最亲爱的 ' + GF_NAME + '：\n\n在这个属于你的特别日子里，我想把整个宇宙的星光都献给你。\n\n从我们相遇的那一刻起，我的世界便不再有黑暗。你是那颗最明亮的星辰，照亮了我所有的日夜。\n\n我为你保存了一段时间——它不在钟表里，不在日历上，而是在每一次心跳、每一个凝视、每一句没说出口却早已被你知道的「我爱你」中。\n\n愿这片数字星河，能成为我们故事的见证。生日快乐，我的爱人。\n\n永远爱你的，\n[ 你的名字 ]';
        loveContent.textContent = '';
        var i = 0;
        var t = setInterval(function() {
            if (i < letter.length) { loveContent.textContent += letter.charAt(i); i++; }
            else clearInterval(t);
        }, 40);
    }

    function startConfetti() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        var p = [];
        for (var i = 0; i < 150; i++) {
            p.push({
                x: Math.random() * confettiCanvas.width,
                y: Math.random() * confettiCanvas.height - confettiCanvas.height,
                size: Math.random() * 6 + 2,
                sy: Math.random() * 3 + 2,
                sx: (Math.random() - 0.5) * 2,
                color: 'hsl(' + (Math.random()*60+30) + ',80%,70%)',
                op: Math.random() * 0.8 + 0.2
            });
        }
        function d() {
            ctxC.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            for (var j = 0; j < p.length; j++) {
                var r = p[j];
                ctxC.fillStyle = r.color;
                ctxC.globalAlpha = r.op;
                ctxC.fillRect(r.x, r.y, r.size, r.size * 0.6);
                r.y += r.sy; r.x += r.sx;
                if (r.y > confettiCanvas.height + 20) r.y = -20;
                if (r.x > confettiCanvas.width + 20) r.x = -20;
                if (r.x < -20) r.x = confettiCanvas.width + 20;
            }
            requestAnimationFrame(d);
        }
        d();
        setTimeout(function() { ctxC.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); }, 6000);
    }

    // ============ 灯箱（保留兼容） ============
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    document.getElementById('lightbox-close').addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
    document.getElementById('lightbox-bg').addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ============ 初始设定 ============
    document.getElementById('title-name').textContent = GF_NAME;
    document.getElementById('name-label').textContent = GF_NAME;
})();