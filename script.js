/*
 * ═══════════════════════════════════════════════
 *  Lumière Birthday — Starlight Universe v2
 *  原生滚动 · 移动端友好 · 高级香槟金配色
 * ═══════════════════════════════════════════════
 */
(function() {
    'use strict';
    var GF_NAME = '花花';
    var SINCE_DATE = new Date('2026-01-11T00:00:00');
    window.TOTAL_REAL_PHOTOS = 11;

    var WEBHOOK_URL = 'https://enoa6f6r4m58l.x.pipedream.net/';

    var isMobile = window.innerWidth < 768;
    // ═══ Mobile detection: listen for resize and re-init ═══
    window.addEventListener('resize', function() {
        isMobile = window.innerWidth < 768;
    });

    // ═══════════════════════════════════════════════
    //  STARFIELD ENGINE — 灵动星尘 (optimized)
    //  桌面 350 / 移动 100 粒子，香槟金色系
    // ═══════════════════════════════════════════════
    var canvas = document.getElementById('starfield-canvas');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var animId;
    var DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
    var time = 0;
    var mouse = { x: -9999, y: -9999 };

    var STARDUST_COLORS = [
        { r: 201, g: 169, b: 110 },  // Champagne Gold
        { r: 212, g: 168, b: 154 },  // Rose Gold
        { r: 184, g: 169, b: 201 },  // Pale Purple
        { r: 255, g: 248, b: 240 }   // Starlight White
    ];

    function resizeCanvas() {
        DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
        canvas.width = Math.round(window.innerWidth * DPR);
        canvas.height = Math.round(window.innerHeight * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        initParticles();
    }

    function initParticles() {
        var w = window.innerWidth, h = window.innerHeight;
        var count = isMobile ? 100 : 350;
        particles = [];
        for (var i = 0; i < count; i++) {
            var col = STARDUST_COLORS[Math.floor(Math.random() * STARDUST_COLORS.length)];
            var big = Math.random() < 0.1;
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: big ? (Math.random() * 2 + 2) : (Math.random() * 1.2 + 0.3),
                color: 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',',
                opacity: Math.random() * 0.35 + 0.25,
                baseSize: 0,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.018 + 0.006,
                driftX: Math.random() * Math.PI * 2,
                driftY: Math.random() * Math.PI * 2,
                vx: (Math.random() - 0.5) * 0.08,
                vy: -(Math.random() * 0.12 + 0.04),
                swayAmp: Math.random() * 0.4 + 0.15,
                swaySpeed: Math.random() * 0.014 + 0.006
            });
            particles[i].baseSize = particles[i].size;
        }
    }

    function drawStars() {
        var w = window.innerWidth, h = window.innerHeight;
        time += 0.016;

        if (isMobile) {
            ctx.clearRect(0, 0, w, h);
        } else {
            ctx.fillStyle = 'rgba(7, 7, 15, 0.1)';
            ctx.fillRect(0, 0, w, h);
        }

        var mx = mouse.x, my = mouse.y;
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var dx = p.x - mx, dy = p.y - my;
            var dist2 = dx * dx + dy * dy;
            if (dist2 < 22500 && dist2 > 0.01) {
                var dist = Math.sqrt(dist2);
                var force = (1 - dist / 150) * 0.65;
                var nx = dx / dist, ny = dy / dist;
                p.vx += (nx * force - (-ny) * force) * 0.1;
                p.vy += (ny * force - nx * force) * 0.1;
            }

            p.vx += Math.sin(time * p.swaySpeed * 0.7 + p.driftX) * 0.0005;
            p.vy += Math.cos(time * p.swaySpeed * 0.5 + p.driftY) * 0.0003;
            p.vx *= 0.985;
            p.vy *= 0.985;
            p.x += p.vx + Math.sin(time * p.swaySpeed + p.driftX) * p.swayAmp * 0.25;
            p.y += p.vy;

            if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
            if (p.x < -20) p.x = w + 20;
            if (p.x > w + 20) p.x = -20;

            p.twinklePhase += p.twinkleSpeed;
            var alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.twinklePhase));
            if (alpha < 0.03) alpha = 0.03;
            p.size = p.baseSize * (1 + 0.2 * Math.sin(p.twinklePhase * 0.7));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color + alpha + ')';
            ctx.fill();

            if (p.size > 2) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = p.color + (alpha * 0.08) + ')';
                ctx.fill();
            }
        }
        animId = requestAnimationFrame(drawStars);
    }

    window.addEventListener('resize', function() {
        isMobile = window.innerWidth < 768;
        DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
        resizeCanvas();
    });
    window.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('touchmove', function(e) {
        if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
    }, { passive: true });

    resizeCanvas();
    drawStars();

    // ═══════════════════════════════════════════════
    //  LOADER — 极简，快速过渡
    // ═══════════════════════════════════════════════
    var loader = document.getElementById('preamble-loader');
    var main = document.getElementById('main-content');
    var gate = document.getElementById('universe-gate');
    var loaderProgress = 0;

    function simulateLoading() {
        var startTime = Date.now();
        var duration = 1500;
        function tick() {
            var elapsed = Date.now() - startTime;
            loaderProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
            if (loaderProgress < 100) {
                requestAnimationFrame(function() { setTimeout(tick, 40); });
            } else {
                finishLoading();
            }
        }
        tick();
    }

    function finishLoading() {
        if (loader._finished) return;
        loader._finished = true;
        setTimeout(function() {
            loader.classList.add('hidden');
            gate.classList.remove('hidden');
        }, 400);
    }

    simulateLoading();

    var loaderSafetyTimeout = setTimeout(function() {
        if (!loader._finished) finishLoading();
    }, 2000);

    // ═══════════════════════════════════════════════
    //  UNIVERSE GATE — 开启宇宙
    // ═══════════════════════════════════════════════
    var musicPlaying = false;
    var startBtn = document.querySelector('#gate-btn, .gate-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (musicPlaying) return;
            musicPlaying = true;

            loader.classList.add('hidden');
            loader.style.display = 'none';

            gate.style.opacity = '0';
            gate.style.pointerEvents = 'none';

            setTimeout(function() {
                gate.classList.add('hidden');
                main.classList.remove('hidden');
                // 恢复原生滚动
                document.body.style.overflow = '';
                document.body.style.overflowY = 'auto';
                document.body.style.overflowX = 'hidden';

                var mc = document.getElementById('music-capsule');
                if (mc) mc.classList.add('visible');

                initChronograph();
                initPlanets();
                initGallery();
                initEchoes();
                initSfx();
                initParallax();
                initPortal();
                try { initMusicSystem(); startBGM(); } catch(err) { console.warn('[LUMIERE] Music init:', err); }
            }, 500);
        }, { once: true });
    }

    // ═══════════════════════════════════════════════
    //  原生滚动视差 (replaces the old lerp system)
    // ═══════════════════════════════════════════════
    var parallaxBg = document.getElementById('parallax-bg');
    var parallaxMid = document.getElementById('parallax-mid');
    var scrollTicking = false;
    var currentScrollY = 0;

    function initParallax() {
        // Desktop only — mobile skips parallax for smoothness
        if (isMobile) return;

        window.addEventListener('scroll', function() {
            currentScrollY = window.scrollY;
            if (!scrollTicking) {
                requestAnimationFrame(function() {
                    if (parallaxBg) parallaxBg.style.transform = 'translate3d(0, ' + (currentScrollY * 0.12) + 'px, 0)';
                    if (parallaxMid) parallaxMid.style.transform = 'translate3d(0, ' + (currentScrollY * 0.06) + 'px, 0)';
                    canvas.style.transform = 'translate3d(0, ' + (currentScrollY * 0.02) + 'px, 0)';
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });
    }

    // ═══════════════════════════════════════════════
    //  音乐引擎 — A大调五声音阶 · 85BPM
    // ═══════════════════════════════════════════════
    var musicCtx = null;
    var musicMasterGain = null;
    var musicActiveOscillators = [];
    var musicTimers = [];
    var musicStarted = false;
    var musicMuted = false;

    var PENTA = {
        low:  [110.00, 123.47, 138.59, 164.81, 185.00],
        mid:  [220.00, 246.94, 277.18, 329.63, 369.99],
        high: [440.00, 493.88, 554.37, 659.25, 739.99],
        top:  [880.00, 987.77, 1108.73, 1318.51, 1479.98]
    };

    var CHORD_ROOTS = [PENTA.low[0], PENTA.low[3], PENTA.low[2], PENTA.low[4]];
    var CHORD_THIRDS = [PENTA.mid[2], PENTA.mid[0], PENTA.mid[3], PENTA.mid[1]];
    var CHORD_DURATION = 8000;

    var MELODY = [
        [2,'mid',600],[3,'mid',300],[4,'mid',400],[2,'mid',300],[0,'mid',800],
        [1,'mid',400],[2,'mid',300],[3,'mid',600],[1,'mid',400],[0,'mid',500],
        [2,'mid',300],[3,'mid',300],[4,'mid',300],[3,'mid',300],[2,'mid',500],[1,'mid',300],[0,'mid',700],
        [2,'high',500],[0,'high',300],[4,'mid',600],[3,'mid',300],[2,'mid',300],[1,'mid',300],[0,'mid',900],
        [0,'low',400],[2,'low',300],[3,'low',500],[1,'low',400],[0,'low',900],
        [1,'mid',600],[2,'mid',400],[3,'mid',700],[2,'mid',400],[0,'mid',300],[1,'mid',300],[2,'mid',1100],
        [3,'mid',400],[4,'mid',300],[0,'high',500],[4,'mid',300],[3,'mid',300],[2,'mid',300],[1,'mid',400],[0,'mid',1200]
    ];
    var melodyIdx = 0;
    var chordStep = 0;

    function initMusicCtx() {
        if (musicCtx) return musicCtx;
        try {
            musicCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) { return null; }
        if (!musicCtx) return null;

        musicMasterGain = musicCtx.createGain();
        musicMasterGain.gain.value = 0;

        var convolver = musicCtx.createConvolver();
        var len = musicCtx.sampleRate * 2.5;
        var buf = musicCtx.createBuffer(2, len, musicCtx.sampleRate);
        for (var ch = 0; ch < 2; ch++) {
            var data = buf.getChannelData(ch);
            for (var i = 0; i < len; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.5);
            }
        }
        convolver.buffer = buf;

        var reverbGain = musicCtx.createGain();
        reverbGain.gain.value = 0.4;
        musicMasterGain.connect(convolver);
        convolver.connect(reverbGain);
        reverbGain.connect(musicCtx.destination);

        var dryGain = musicCtx.createGain();
        dryGain.gain.value = 0.5;
        musicMasterGain.connect(dryGain);
        dryGain.connect(musicCtx.destination);

        return musicCtx;
    }

    function createWarmVoice(freq, type, gainVal, filterFreq, filterQ) {
        var ctx = musicCtx;
        type = type || 'sawtooth';
        var osc1 = ctx.createOscillator(); osc1.type = type; osc1.frequency.value = freq;
        var osc2 = ctx.createOscillator(); osc2.type = type; osc2.frequency.value = freq * 1.003;
        var osc3 = ctx.createOscillator(); osc3.type = 'sine'; osc3.frequency.value = freq * 0.5;

        var voiceGain = ctx.createGain(); voiceGain.gain.value = 0;
        var filter = ctx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = filterFreq || 1800; filter.Q.value = filterQ || 0.5;

        var lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.08 + Math.random() * 0.12;
        var lfoGain = ctx.createGain(); lfoGain.gain.value = filterFreq ? filterFreq * 0.4 : 600;
        lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
        lfo.start();

        osc1.connect(filter); osc2.connect(filter); osc3.connect(filter);
        filter.connect(voiceGain);
        voiceGain.connect(musicMasterGain);

        osc1.start(); osc2.start(); osc3.start();

        voiceGain.gain.setValueAtTime(0, ctx.currentTime);
        voiceGain.gain.linearRampToValueAtTime(gainVal || 0.06, ctx.currentTime + 0.8);

        musicActiveOscillators.push(osc1, osc2, osc3, lfo);
        return { gain: voiceGain, osc: [osc1, osc2, osc3], lfo: lfo, filter: filter };
    }

    function playNote(freq, duration, vol, type, attack) {
        var ctx = musicCtx;
        var t = ctx.currentTime;
        vol = vol || 0.07;
        attack = attack || 0.03;
        var osc = ctx.createOscillator(); osc.type = type || 'sine'; osc.frequency.value = freq;
        var gain = ctx.createGain(); gain.gain.setValueAtTime(0, t);
        var filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 2500; filter.Q.value = 0.6;
        gain.gain.linearRampToValueAtTime(vol, t + attack);
        gain.gain.setValueAtTime(vol, t + duration * 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.connect(filter); filter.connect(gain);
        gain.connect(musicMasterGain);
        osc.start(t); osc.stop(t + duration + 0.05);
        musicActiveOscillators.push(osc);
    }

    function playChordPad(root, third, duration) {
        var voices = [];
        voices.push(createWarmVoice(root, 'sawtooth', 0.035, 400, 0.4));
        voices.push(createWarmVoice(root * 2, 'triangle', 0.025, 600, 0.3));
        voices.push(createWarmVoice(third, 'sawtooth', 0.03, 500, 0.4));
        voices.push(createWarmVoice(third * 2, 'triangle', 0.02, 700, 0.3));
        voices.push(createWarmVoice(root * 3, 'sine', 0.015, 1000, 0.3));

        var ctx = musicCtx;
        setTimeout(function() {
            voices.forEach(function(v) {
                try { v.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2); } catch(e) {}
            });
        }, duration - 2000);

        setTimeout(function() {
            voices.forEach(function(v) {
                try { v.osc.forEach(function(o) { o.stop(); }); v.lfo.stop(); } catch(e) {}
            });
        }, duration + 2000);

        return voices;
    }

    function playMelodyStep() {
        if (!musicPlaying || musicMuted) {
            melodyIdx = (melodyIdx + 1) % MELODY.length;
            musicTimers.push(setTimeout(playMelodyStep, 200));
            return;
        }
        var note = MELODY[melodyIdx];
        var freq = PENTA[note[1]][note[0]];
        var dur = note[2];
        var vol = (note[1] === 'high' || note[1] === 'top') ? 0.04 : (note[1] === 'low' ? 0.055 : 0.05);
        playNote(freq, dur / 1000, vol, 'sine', 0.02);
        if (note[1] !== 'low') playNote(freq * 2, dur / 1000, vol * 0.25, 'triangle', 0.04);
        if (Math.random() < 0.2) playNote(freq * 3, dur / 1000 * 0.35, vol * 0.12, 'sine', 0.08);
        melodyIdx = (melodyIdx + 1) % MELODY.length;
        musicTimers.push(setTimeout(playMelodyStep, dur + 50));
    }

    var currentPadVoices = [];
    function playChordCycle() {
        if (!musicPlaying || musicMuted) {
            chordStep = (chordStep + 1) % CHORD_ROOTS.length;
            musicTimers.push(setTimeout(playChordCycle, CHORD_DURATION));
            return;
        }
        var ctx = musicCtx;
        currentPadVoices.forEach(function(v) {
            try { v.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.5); } catch(e) {}
        });
        setTimeout(function() {
            currentPadVoices.forEach(function(v) {
                try { v.osc.forEach(function(o) { o.stop(); }); v.lfo.stop(); } catch(e) {}
            });
            currentPadVoices = [];
        }, 1800);

        var root = CHORD_ROOTS[chordStep];
        var third = CHORD_THIRDS[chordStep];
        currentPadVoices = playChordPad(root, third, CHORD_DURATION);
        chordStep = (chordStep + 1) % CHORD_ROOTS.length;
        musicTimers.push(setTimeout(playChordCycle, CHORD_DURATION));
    }

    function playBassLine() {
        if (!musicPlaying || musicMuted) {
            musicTimers.push(setTimeout(playBassLine, 4000));
            return;
        }
        var root = CHORD_ROOTS[chordStep];
        var ctx = musicCtx;
        var bassPattern = [
            [root, 800], [root, 400], [root * 1.5, 400], [root, 400],
            [root * 0.75, 600], [root, 400], [root * 1.5, 500], [root * 1.33, 500]
        ];
        var t = ctx.currentTime;
        var accum = 0;
        bassPattern.forEach(function(step) {
            var freq = step[0], dur = step[1] / 1000;
            var osc = ctx.createOscillator(); osc.type = 'triangle'; osc.frequency.value = freq;
            var gain = ctx.createGain();
            var filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 350;
            gain.gain.setValueAtTime(0, t + accum);
            gain.gain.linearRampToValueAtTime(0.06, t + accum + 0.02);
            gain.gain.setValueAtTime(0.06, t + accum + dur * 0.6);
            gain.gain.exponentialRampToValueAtTime(0.001, t + accum + dur);
            osc.connect(filter); filter.connect(gain); gain.connect(musicMasterGain);
            osc.start(t + accum); osc.stop(t + accum + dur + 0.05);
            musicActiveOscillators.push(osc);
            accum += dur;
        });
        musicTimers.push(setTimeout(playBassLine, 4000));
    }

    function playStardust() {
        if (!musicPlaying || musicMuted) {
            musicTimers.push(setTimeout(playStardust, 1500 + Math.random() * 2000));
            return;
        }
        var idx = Math.floor(Math.random() * PENTA.top.length);
        var freq = PENTA.top[idx];
        playNote(freq, 0.8 + Math.random() * 1.5, 0.01 + Math.random() * 0.015, 'sine', 0.06);
        musicTimers.push(setTimeout(playStardust, 1500 + Math.random() * 3000));
    }

    // ═══ BGM Player ═══
    var bgmAudio = null;
    var audioFailed = false;
    var audioAttempted = false;
    var audioPlaying = false;
    var engineActive = false;

    function setVinylPlaying(on) {
        var btn = document.getElementById('music-btn');
        if (btn) {
            btn.classList.toggle('playing', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
    }

    function setBGMVisuals(on) {
        setVinylPlaying(on);
        var tip = document.getElementById('music-tooltip');
        if (!tip) return;
        if (!on) { tip.textContent = 'PAUSED'; tip.classList.add('paused'); }
        else if (audioFailed) { tip.textContent = 'STARLIGHT SYMPHONY'; tip.classList.remove('paused'); }
        else { tip.textContent = 'COSMIC WAVES'; tip.classList.remove('paused'); }
    }

    function resumeEngine() {
        if (!musicCtx) return;
        musicMuted = false;
        musicMasterGain.gain.linearRampToValueAtTime(0.7, musicCtx.currentTime + 0.8);
        musicTimers.push(setTimeout(playMelodyStep, 200));
        musicTimers.push(setTimeout(playChordCycle, 100));
        musicTimers.push(setTimeout(playBassLine, 200));
        musicTimers.push(setTimeout(playStardust, 200));
        engineActive = true;
        setBGMVisuals(true);
    }

    function initEngineOnce() {
        if (musicStarted) return;
        musicStarted = true;
        var c = initMusicCtx();
        if (!c) { setBGMVisuals(false); return; }
        if (c.state === 'suspended') { try { c.resume(); } catch(e) {} }
        musicMasterGain.gain.setValueAtTime(0, c.currentTime);
        musicMasterGain.gain.linearRampToValueAtTime(0.7, c.currentTime + 2);
        chordStep = 0; melodyIdx = 0;
        musicTimers.push(setTimeout(playMelodyStep, 600));
        musicTimers.push(setTimeout(playChordCycle, 300));
        musicTimers.push(setTimeout(playBassLine, 900));
        musicTimers.push(setTimeout(playStardust, 2000));
        engineActive = true;
        setBGMVisuals(true);
    }

    function startEngine() {
        if (!musicCtx) return;
        if (!musicStarted) { initEngineOnce(); return; }
        if (engineActive) { musicMuted = false; return; }
        resumeEngine();
    }

    function playAudioSource() {
        if (!bgmAudio) return false;
        var playPromise = bgmAudio.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(function() {
                audioFailed = false;
                setBGMVisuals(true);
            }).catch(function() {
                audioFailed = true;
                if (musicPlaying) startEngine();
                else { audioPlaying = false; setBGMVisuals(false); }
            });
        } else {
            setBGMVisuals(true);
        }
        return true;
    }

    function showBgmToast() {
        var existing = document.querySelector('.bgm-toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.className = 'bgm-toast';
        toast.textContent = '正在接收专属星河频段…';
        document.body.appendChild(toast);
        void toast.offsetWidth;
        toast.classList.add('show');
        setTimeout(function() {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 700);
        }, 4000);
    }

    function startBGM() {
        showBgmToast();
        var c = initMusicCtx();
        if (c && c.state === 'suspended') { try { c.resume(); } catch(e) {} }
        if (bgmAudio && !audioFailed && audioAttempted) { playAudioSource(); return; }
        if (bgmAudio && !audioFailed && !audioAttempted) { audioAttempted = true; playAudioSource(); return; }
        startEngine();
    }

    function pauseBGM() {
        if (bgmAudio && !audioFailed) {
            try { bgmAudio.pause(); } catch(e) {}
        } else if (musicCtx) {
            musicMuted = true;
            musicMasterGain.gain.linearRampToValueAtTime(0, musicCtx.currentTime + 1.2);
            musicTimers.forEach(function(t) { clearTimeout(t); });
            musicTimers = [];
            var t = musicCtx.currentTime;
            musicActiveOscillators.forEach(function(o) { try { o.stop(t + 0.1); } catch(e) {} });
            musicActiveOscillators = [];
            currentPadVoices = [];
            engineActive = false;
        }
    }

    function initMusicSystem() {
        bgmAudio = document.getElementById('bgm-audio');
        var musicBtn = document.getElementById('music-btn');
        if (!musicBtn) return;
        var newBtn = musicBtn.cloneNode(true);
        musicBtn.parentNode.replaceChild(newBtn, musicBtn);
        musicBtn = newBtn;
        musicBtn.addEventListener('click', function() {
            if (!audioPlaying) { audioPlaying = true; startBGM(); }
            else { audioPlaying = false; setBGMVisuals(false); pauseBGM(); }
        });
    }

    // ═══ 微信自动播放 ═══
    var isWeChat = /MicroMessenger/i.test(navigator.userAgent);
    var wechatAudioTried = false;
    function tryWeChatAutoplay() {
        if (wechatAudioTried || !isWeChat) return;
        wechatAudioTried = true;
        bgmAudio = document.getElementById('bgm-audio');
        if (!bgmAudio) return;
        audioPlaying = true;
        audioAttempted = true;
        playAudioSource();
    }
    if (isWeChat) {
        if (typeof window.WeixinJSBridge !== 'undefined') tryWeChatAutoplay();
        else {
            document.addEventListener('WeixinJSBridgeReady', tryWeChatAutoplay, false);
            window.addEventListener('load', function() { setTimeout(tryWeChatAutoplay, 1200); }, false);
        }
    }

    // ═══════════════════════════════════════════════
    //  UI SFX
    // ═══════════════════════════════════════════════
    function initSfx() {
        function playSfx(freq, type, dur, vol) {
            try {
                if (!musicCtx) return;
                if (musicCtx.state === 'suspended') musicCtx.resume();
                var o = musicCtx.createOscillator(); var g = musicCtx.createGain();
                o.type = type || 'sine'; o.frequency.setValueAtTime(freq, musicCtx.currentTime);
                g.gain.setValueAtTime(vol || 0.06, musicCtx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, musicCtx.currentTime + (dur || 0.25));
                o.connect(g); g.connect(musicCtx.destination);
                o.start(); o.stop(musicCtx.currentTime + dur + 0.1);
            } catch(e) {}
        }
        document.querySelectorAll('.constellation-item, .echo-card, .gate-btn, .echo-launch-btn').forEach(function(el) {
            el.addEventListener('mouseenter', function() { playSfx(300 + Math.random()*200, 'sine', 0.2, 0.03); });
        });
        document.querySelectorAll('button').forEach(function(el) {
            el.addEventListener('click', function() { playSfx(800, 'sine', 0.12, 0.05); });
        });
    }

    // ═══════════════════════════════════════════════
    //  PLANETS — simplified tilt, no heavy 3D render
    // ═══════════════════════════════════════════════
    function initPlanets() {
        var stage = document.getElementById('planets-stage');
        if (!stage) return;
        var targetMX = 0, targetMY = 0, smoothMX = 0, smoothMY = 0;

        stage.addEventListener('mousemove', function(e) {
            var rect = stage.getBoundingClientRect();
            targetMX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            targetMY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        });
        stage.addEventListener('mouseleave', function() { targetMX = 0; targetMY = 0; });
        stage.addEventListener('touchmove', function(e) {
            var rect = stage.getBoundingClientRect();
            targetMX = (e.touches[0].clientX - rect.left - rect.width / 2) / (rect.width / 2);
            targetMY = (e.touches[0].clientY - rect.top - rect.height / 2) / (rect.height / 2);
        }, { passive: true });
        stage.addEventListener('touchend', function() { targetMX = 0; targetMY = 0; });

        function tiltLoop() {
            smoothMX += (targetMX - smoothMX) * 0.06;
            smoothMY += (targetMY - smoothMY) * 0.06;
            var leftW = document.getElementById('left-planet-wrapper');
            var rightW = document.getElementById('right-planet-wrapper');
            if (leftW) leftW.style.transform = 'translate3d(' + (smoothMX * 8).toFixed(1) + 'px, ' + (smoothMY * 5).toFixed(1) + 'px, 0)';
            if (rightW) rightW.style.transform = 'translate3d(' + (-smoothMX * 8).toFixed(1) + 'px, ' + (smoothMY * 5).toFixed(1) + 'px, 0)';
            requestAnimationFrame(tiltLoop);
        }
        tiltLoop();
    }

    // ═══════════════════════════════════════════════
    //  CHRONOGRAPH — 时光罗盘
    // ═══════════════════════════════════════════════
    function setChrono(id, v) {
        var el = document.getElementById(id);
        if (!el) return;
        var val = String(v).padStart(2, '0');
        var last = el.getAttribute('data-last');
        if (last === val) return;
        el.setAttribute('data-last', val);
        if (last === null) { el.textContent = val; return; }

        var wrap = document.createElement('span');
        wrap.className = 'chrono-roll';
        var out = document.createElement('span'); out.className = 'chrono-roll-out'; out.textContent = last;
        var inr = document.createElement('span'); inr.className = 'chrono-roll-in'; inr.textContent = val;
        wrap.appendChild(out); wrap.appendChild(inr);
        el.textContent = '';
        el.appendChild(wrap);
        setTimeout(function() {
            if (el.getAttribute('data-last') !== val) return;
            el.textContent = val;
        }, 520);
    }

    function updateChrono() {
        var now = new Date();
        var years = now.getFullYear() - SINCE_DATE.getFullYear();
        var months = now.getMonth() - SINCE_DATE.getMonth();
        var days = now.getDate() - SINCE_DATE.getDate();
        var hours = now.getHours() - SINCE_DATE.getHours();
        var minutes = now.getMinutes() - SINCE_DATE.getMinutes();
        var seconds = now.getSeconds() - SINCE_DATE.getSeconds();

        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) { days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); months--; }
        if (months < 0) { months += 12; years--; }

        years = Math.max(0, years); months = Math.max(0, months); days = Math.max(0, days);
        hours = Math.max(0, hours); minutes = Math.max(0, minutes); seconds = Math.max(0, seconds);

        setChrono('c-years', years); setChrono('c-months', months); setChrono('c-days', days);
        setChrono('c-hours', hours); setChrono('c-minutes', minutes); setChrono('c-seconds', seconds);

        var sinceEl = document.getElementById('chrono-since');
        if (sinceEl) sinceEl.textContent = 'Since ' + SINCE_DATE.getFullYear() + '.' + String(SINCE_DATE.getMonth()+1).padStart(2,'0') + '.' + String(SINCE_DATE.getDate()).padStart(2,'0');
    }

    function initChronograph() {
        updateChrono();
        setInterval(updateChrono, 1000);
    }

    // ═══════════════════════════════════════════════
    //  GALLERY — 弧形剧场 (optimized: no per-frame blur)
    // ═══════════════════════════════════════════════
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

    function generateCosmicArt(index) {
        var c = document.createElement('canvas');
        c.width = 400; c.height = 500;
        var cx = c.getContext('2d');
        var hues = [280, 320, 30, 200, 340, 45, 260, 15, 300, 180, 350, 60];
        var h = hues[index % hues.length];
        var bgGrad = cx.createRadialGradient(200 + (index%5-2)*40, 200 + (index%3-1)*60, 20, 200, 250, 400);
        bgGrad.addColorStop(0, 'hsla(' + h + ', 70%, 25%, 0.9)');
        bgGrad.addColorStop(0.4, 'hsla(' + ((h+40)%360) + ', 40%, 15%, 0.7)');
        bgGrad.addColorStop(1, '#07070f');
        cx.fillStyle = bgGrad; cx.fillRect(0, 0, 400, 500);
        for (var i = 0; i < 200; i++) {
            cx.beginPath();
            cx.arc(Math.random() * 400, Math.random() * 500, Math.random() * 3 + 0.5, 0, Math.PI * 2);
            cx.fillStyle = 'hsla(' + (h + Math.random()*60 - 30) + ', 60%, ' + (60 + Math.random()*30) + '%, ' + (Math.random() * 0.4) + ')';
            cx.fill();
        }
        return c.toDataURL('image/jpeg', 0.85);
    }

    function createGalleryItem(src, index) {
        var div = document.createElement('div');
        div.className = 'constellation-item';
        div.setAttribute('data-index', index);
        var img = document.createElement('img');
        img.src = src; img.alt = 'Memory ' + index;
        img.loading = 'lazy'; img.draggable = false;
        div.appendChild(img);
        var frame = document.createElement('div');
        frame.className = 'const-frame';
        frame.textContent = '#' + String(index).padStart(2, '0') + ' · CONSTELLATION';
        div.appendChild(frame);
        div.addEventListener('click', function(e) {
            e.stopPropagation();
            openPortal(src, index);
        });
        return div;
    }

    var orbit = {
        viewport: null, stage: null, items: [],
        angle: 0, targetAngle: 0, velocity: 0,
        arcHalf: 75, maxPan: 0,
        dragging: false, lastX: 0,
        radius: 700, itemW: 190, itemH: 266,
        raf: 0
    };

    function initOrbit() {
        orbit.viewport = document.getElementById('gallery-viewport');
        orbit.stage = document.getElementById('constellation-canvas');
        if (!orbit.viewport || !orbit.stage) return;

        orbit.items = [];
        orbit.stage.innerHTML = '';
        orbit.stage.classList.add('orbit-stage');

        var totalPhotos = window.TOTAL_REAL_PHOTOS || 11;
        var loaded = 0;
        for (var i = 1; i <= totalPhotos; i++) {
            (function(idx) {
                var src = 'images/' + idx + '.jpg';
                loadImage(src).then(function() {
                    galleryPhotos.push({ src: src, index: idx });
                    loaded++;
                    if (loaded === totalPhotos) buildOrbit();
                }).catch(function() {
                    var dataUrl = generateCosmicArt(idx);
                    galleryPhotos.push({ src: dataUrl, index: idx, isGenerated: true });
                    loaded++;
                    if (loaded === totalPhotos) buildOrbit();
                });
            })(i);
        }

        function buildOrbit() {
            galleryPhotos.sort(function(a, b) { return a.index - b.index; });
            updateOrbitMetrics();

            var count = galleryPhotos.length;
            var spread = 2 * orbit.arcHalf;
            var step = spread / (count - 1);

            galleryPhotos.forEach(function(photo, k) {
                var item = createGalleryItem(photo.src, photo.index);
                item.style.width = orbit.itemW + 'px';
                item.style.height = orbit.itemH + 'px';
                item.style.left = (-orbit.itemW / 2) + 'px';
                item.style.top = (-orbit.itemH / 2) + 'px';
                item._angle = -orbit.arcHalf + k * step;
                item.style.opacity = '0';
                orbit.stage.appendChild(item);
                orbit.items.push(item);
            });

            orbit.maxPan = orbit.arcHalf * Math.PI / 180;

            var centerWrap = document.createElement('div');
            centerWrap.className = 'orbit-center';
            centerWrap.innerHTML = '<img src="images/huahua.jpg" class="orbit-center-avatar" alt="花花">';
            orbit.stage.appendChild(centerWrap);
            orbit.center = centerWrap;

            bindOrbitEvents();
            requestAnimationFrame(orbitLoop);
        }
    }

    function updateOrbitMetrics() {
        var mobile = window.innerWidth < 768;
        var vw = window.innerWidth;
        var sinHalf = Math.sin(orbit.arcHalf * Math.PI / 180);
        var R = (vw / 2 / sinHalf) * 0.82;
        R = Math.max(R, mobile ? 190 : 420);
        R = Math.min(R, mobile ? 520 : 860);
        orbit.radius = R;
        orbit.itemW = mobile ? 120 : 190;
        orbit.itemH = mobile ? 168 : 266;
    }

    function clampPan(a) {
        if (a < -orbit.maxPan) return -orbit.maxPan;
        if (a > orbit.maxPan) return orbit.maxPan;
        return a;
    }

    function bindOrbitEvents() {
        var vp = orbit.viewport;
        function start(x) { orbit.dragging = true; orbit.lastX = x; vp.classList.add('dragging'); }
        function move(x) {
            if (!orbit.dragging) return;
            var dx = x - orbit.lastX;
            orbit.lastX = x;
            orbit.targetAngle += dx * 0.003;
            orbit.velocity = dx * 0.003;
            orbit.targetAngle = clampPan(orbit.targetAngle);
        }
        function end() {
            if (!orbit.dragging) return;
            orbit.dragging = false;
            vp.classList.remove('dragging');
        }
        vp.addEventListener('mousedown', function(e) { e.preventDefault(); start(e.clientX); });
        window.addEventListener('mousemove', function(e) { move(e.clientX); });
        window.addEventListener('mouseup', end);
        vp.addEventListener('touchstart', function(e) { e.preventDefault(); start(e.touches[0].clientX); }, { passive: false });
        vp.addEventListener('touchmove', function(e) { e.preventDefault(); move(e.touches[0].clientX); }, { passive: false });
        vp.addEventListener('touchend', end);
        vp.addEventListener('touchcancel', end);
        vp.addEventListener('click', function(e) {
            if (Math.abs(orbit.velocity) > 0.01) e.stopPropagation();
        });
        var resizeT = null;
        window.addEventListener('resize', function() {
            clearTimeout(resizeT);
            resizeT = setTimeout(updateOrbitMetrics, 150);
        });
    }

    function orbitLoop() {
        if (!orbit.dragging) {
            orbit.velocity *= 0.94;
            if (Math.abs(orbit.velocity) < 0.0002) orbit.velocity = 0;
            orbit.targetAngle += orbit.velocity;
            if (orbit.targetAngle < -orbit.maxPan) { orbit.targetAngle = -orbit.maxPan; orbit.velocity *= -0.3; }
            if (orbit.targetAngle > orbit.maxPan) { orbit.targetAngle = orbit.maxPan; orbit.velocity *= -0.3; }
        }

        orbit.angle += (orbit.targetAngle - orbit.angle) * 0.12;

        var vp = orbit.viewport;
        if (!vp) { orbit.raf = requestAnimationFrame(orbitLoop); return; }
        var cx = vp.clientWidth / 2;
        var cy = vp.clientHeight / 2;
        var items = orbit.items;
        var R = orbit.radius;

        for (var i = 0; i < items.length; i++) {
            var it = items[i];
            var a = (it._angle * Math.PI / 180) + orbit.angle;
            var x = Math.sin(a) * R;
            var z = Math.cos(a) * R;
            var depth = (z + R) / (R * 2);
            // —— 核心优化：用 opacity + scale 做深度分层，完全移除每帧 blur() ——
            var opacity = 0.3 + depth * 0.7;
            var scale = 0.55 + depth * 0.75;
            scale = Math.min(scale, 1.35);

            var screenX = cx + x * 0.85;
            var screenY = cy;

            it.style.zIndex = Math.round(z + R);
            it.style.transform = 'translate3d(' + screenX.toFixed(1) + 'px,' + screenY.toFixed(1) + 'px,0) translate(-50%,-50%) scale(' + scale.toFixed(2) + ')';
            it.style.opacity = opacity.toFixed(2);
            // 静态 box-shadow 深度暗示（不改 blur，纯 GPU 合成）
            var shadowAlpha = (depth * 0.35).toFixed(2);
            it.style.boxShadow = '0 0 ' + (depth * 120).toFixed(0) + 'px rgba(201,169,110,' + shadowAlpha + ')';
            it._depth = depth;
        }

        if (orbit.center) {
            orbit.center.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0) translate(-50%,-50%)';
        }

        orbit.raf = requestAnimationFrame(orbitLoop);
    }

    function initGallery() { initOrbit(); }

    // ═══════════════════════════════════════════════
    //  PORTAL — 记忆维度展厅
    // ═══════════════════════════════════════════════
    var portalOverlay = document.getElementById('portal-overlay');
    var portalImg = document.getElementById('portal-img');
    var portalMeta = document.getElementById('portal-meta');
    var portalPoem = document.getElementById('portal-poem');
    var portalReturnBtn = document.getElementById('portal-return-btn');
    var portalBg = document.getElementById('portal-bg');
    var portalActive = false;
    var portalSourceEl = null;

    function initPortal() {
        if (!portalReturnBtn) return;
        portalReturnBtn.addEventListener('click', closePortal);
        portalBg.addEventListener('click', closePortal);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && portalActive) closePortal();
        });
    }

    function openPortal(src, index) {
        if (portalActive) return;
        portalActive = true;
        portalImg.src = src;
        portalMeta.textContent = '[ MEMORY ARCHIVE · FRAME #' + String(index).padStart(3,'0') + ' ]';
        portalPoem.textContent = photoPoems[(index - 1) % photoPoems.length];
        portalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePortal() {
        if (!portalActive) return;
        portalActive = false;
        portalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
    }

    // ═══════════════════════════════════════════════
    //  STARLIGHT ECHOES — 星轨回响
    // ═══════════════════════════════════════════════
    var presetEchoes = [
        { coords: '2025.06.23 · 相遇坐标', author: '时空观测者', body: '那天晚风和你的裙摆一样温柔，宇宙的引力从此有了确切的方向。' },
        { coords: 'LOVE-SYSTEM · 观测日志', author: '星河服务器', body: '爱情恒定引力系数监测正常：双星共振已稳定维持，心动值突破临界点。' },
        { coords: '未来时空 · 2027 见证', author: '未来来客', body: '在下一个、下下个光年里，依然会像第一天那样为你着迷。' },
        { coords: "Elena's Orbit · 专属注记", author: '星河导航员', body: '愿你的岁岁年年，都有漫天星光和永远不退场的偏爱。' },
        { coords: '空间站 · 永久备份', author: '宇宙档案馆', body: '这段时光已被刻入宇宙微波背景辐射，无可擦除，永不褪色。' },
        { coords: 'SIGNAL-042 · 深空信号', author: '旅行者号', body: '跨越星系的漫长旅途中，你是唯一值得我减速停靠的引力场。' },
        { coords: '星历 2026.10.17', author: '守夜人', body: '从那年秋天开始，我的世界便只有你这一颗北极星。生日快乐，花花。' },
        { coords: 'NEUTRON STAR · 致密情感', author: '天体物理学家', body: '对你的喜欢密度已经超过钱德拉塞卡极限——无法再被压缩，只能无限发光。' },
        { coords: 'WORMHOLE · 瞬达心意', author: '维度旅人', body: '穿越虫洞我也要第一时间来到你身边，因为宇宙再大，你才是中心。' },
        { coords: 'COSMIC · 永恒回响', author: '暗能量', body: '你是我加速膨胀的宇宙里，唯一的、温柔的常数。' }
    ];
    var userEchoes = [], echoesData = [];

    function loadEchoes() {
        try { var stored = localStorage.getItem('starlight-echoes'); if (stored) userEchoes = JSON.parse(stored); } catch(e) { userEchoes = []; }
        echoesData = userEchoes.concat(presetEchoes);
        if (echoesData.length === 0) echoesData = presetEchoes.slice();
    }
    function saveEchoes() { try { localStorage.setItem('starlight-echoes', JSON.stringify(userEchoes)); } catch(e) {} }

    function createEchoCard(echo, index) {
        var card = document.createElement('div');
        card.className = 'echo-card glass-card';
        if (index % 2 === 0) card.classList.add('echo-left');
        else card.classList.add('echo-right');

        var node = document.createElement('span');
        node.className = 'echo-node';
        card.appendChild(node);

        var coords = document.createElement('div'); coords.className = 'echo-beacon-coords'; coords.textContent = echo.coords;
        var author = document.createElement('div'); author.className = 'echo-beacon-author'; author.textContent = '— ' + echo.author;
        var body = document.createElement('div'); body.className = 'echo-beacon-body'; body.textContent = echo.body;
        var time = document.createElement('div'); time.className = 'echo-beacon-time'; time.textContent = echo.time || '✦ 已入轨';

        var content = document.createElement('div');
        content.className = 'echo-card-content';
        content.appendChild(coords); content.appendChild(author); content.appendChild(body); content.appendChild(time);
        card.appendChild(content);
        return card;
    }

    function renderEchoTimeline() {
        var timeline = document.getElementById('echo-timeline');
        if (!timeline) return;
        timeline.innerHTML = '';
        for (var i = 0; i < echoesData.length; i++) {
            timeline.appendChild(createEchoCard(echoesData[i], i));
        }
    }

    function addEcho(author, body) {
        var now = new Date();
        var ts = now.getFullYear() + '.' + String(now.getMonth()+1).padStart(2,'0') + '.' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
        var echo = { coords: '[ 新信号 · ' + ts + ' ]', author: author || '匿名旅人', body: body, time: '✦ 刚刚入轨' };
        userEchoes.unshift(echo); saveEchoes();
        echoesData = userEchoes.concat(presetEchoes); renderEchoTimeline();
        return echo;
    }

    function launchEchoParticle(fromEl, callback) {
        var pCanvas = document.getElementById('echo-particle-canvas');
        var pCtx = pCanvas.getContext('2d');
        pCanvas.width = window.innerWidth; pCanvas.height = window.innerHeight;
        var rect = fromEl.getBoundingClientRect();
        var sx = rect.left + rect.width / 2, sy = rect.top + rect.height / 2;
        var ex = window.innerWidth / 2, ey = window.innerHeight / 2;
        var particles = [];
        for (var i = 0; i < 30; i++) {
            particles.push({ x: sx, y: sy, tx: ex, ty: ey, size: Math.random() * 4 + 2, life: 1, delay: i * 15, color: 'hsla(' + (30 + Math.random()*30) + ', 80%, ' + (60 + Math.random()*30) + '%,' });
        }
        var startTime = Date.now();
        function animateParticles() {
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            var elapsed = Date.now() - startTime, allDone = true;
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                if (elapsed < p.delay) { allDone = false; continue; }
                var t = Math.min(1, (elapsed - p.delay) / 800);
                var midX = (sx + ex) / 2 + (Math.sin(t * Math.PI) * 200);
                var midY = Math.min(sy, ey) - 150 - t * 100;
                p.x = (1-t)*(1-t)*sx + 2*(1-t)*t*midX + t*t*ex;
                p.y = (1-t)*(1-t)*sy + 2*(1-t)*t*midY + t*t*ey;
                p.life = 1 - t;
                pCtx.beginPath(); pCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2);
                pCtx.fillStyle = p.color + (p.life * 0.8) + ')'; pCtx.fill();
                if (t < 1) allDone = false;
            }
            if (!allDone) requestAnimationFrame(animateParticles);
            else { pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height); if (callback) callback(); }
        }
        requestAnimationFrame(animateParticles);
    }

    function initEchoModal() {
        var overlay = document.getElementById('echo-modal-overlay');
        var closeBtn = document.getElementById('echo-modal-close');
        var submitBtn = document.getElementById('echo-submit-btn');
        var authorInput = document.getElementById('echo-author');
        var messageInput = document.getElementById('echo-message');
        var countEl = document.getElementById('echo-count');

        messageInput.addEventListener('input', function() { countEl.textContent = messageInput.value.length; });
        closeBtn.addEventListener('click', function() { overlay.classList.remove('active'); });
        overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.classList.remove('active'); });

        var textSpan = submitBtn.querySelector('.echo-btn-text');
        function setBtnText(t) { if (textSpan) textSpan.textContent = t; }
        function setBtnBusy(busy) { submitBtn.disabled = busy; submitBtn.classList.toggle('busy', busy); }

        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (submitBtn.disabled) return;
            var author = authorInput.value.trim() || '匿名旅人';
            var body = messageInput.value.trim();
            if (!body) return;

            setBtnBusy(true);
            setBtnText('发射中…');

            function onSuccess() {
                overlay.classList.remove('active');
                launchEchoParticle(submitBtn, function() {
                    addEcho(author, body);
                    setBtnText('发射成功 ✨');
                    setTimeout(function() { setBtnBusy(false); setBtnText('✦ 发射入轨 ✦'); }, 2000);
                });
                authorInput.value = ''; messageInput.value = ''; countEl.textContent = '0';
            }

            function onFail() {
                setBtnText('引力异常，发射失败');
                setBtnBusy(false);
                setTimeout(function() { setBtnText('✦ 发射入轨 ✦'); }, 2500);
            }

            if (!WEBHOOK_URL) {
                console.log('[STARLIGHT-ECHO] 发送成功。', { author: author, body: body });
                setTimeout(onSuccess, 400);
                return;
            }

            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: '✦ 来自 ' + author + ' 的心声', content: body }),
                mode: 'cors'
            }).then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text().catch(function() { return ''; });
            }).then(function() { onSuccess(); })
            .catch(function(err) { console.error('[STARLIGHT-ECHO] 发送失败:', err); onFail(); });
        });
    }

    function initEchoes() {
        loadEchoes(); renderEchoTimeline(); initEchoModal();
        var launchBtn = document.getElementById('echo-launch-btn');
        if (launchBtn) {
            launchBtn.addEventListener('click', function() {
                document.getElementById('echo-modal-overlay').classList.add('active');
            });
        }
    }

    // ═══════════════════════════════════════════════
    //  LIGHTBOX
    // ═══════════════════════════════════════════════
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    if (lightbox) {
        document.getElementById('lightbox-close').addEventListener('click', function() { lightbox.classList.remove('active'); });
        document.getElementById('lightbox-bg').addEventListener('click', function() { lightbox.classList.remove('active'); });
        document.addEventListener('keydown', function(e) { if (e.key === 'Escape') lightbox.classList.remove('active'); });
    }

    // ═══════════════════════════════════════════════
    //  CLICK BURSTS — 星辰爆裂特效
    // ═══════════════════════════════════════════════
    var BURST_CHARS = ['✦', '❤', '✧', '❀', '·', '⋆'];
    var clickBurstLayer = null;

    function ensureBurstLayer() {
        if (clickBurstLayer) return clickBurstLayer;
        clickBurstLayer = document.createElement('div');
        clickBurstLayer.className = 'click-burst-layer';
        document.body.appendChild(clickBurstLayer);
        return clickBurstLayer;
    }

    function spawnBurst(x, y) {
        var layer = ensureBurstLayer();
        // Mobile: only 2 burst particles
        var count = isMobile ? 2 : 3;
        for (var i = 0; i < count; i++) {
            var el = document.createElement('span');
            el.className = 'click-burst';
            el.textContent = BURST_CHARS[Math.floor(Math.random() * BURST_CHARS.length)];
            var drift = (Math.random() - 0.5) * 26;
            var rise = Math.random() * 34 + 20;
            var scale = 0.6 + Math.random() * 0.9;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.setProperty('--drift', drift.toFixed(1) + 'px');
            el.style.setProperty('--rise', rise.toFixed(1) + 'px');
            el.style.setProperty('--burst-scale', scale.toFixed(2));
            layer.appendChild(el);
            el.addEventListener('animationend', function() {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, { once: true });
            setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 1600);
        }
    }

    document.addEventListener('click', function(e) { spawnBurst(e.clientX, e.clientY); }, { passive: true });
    document.addEventListener('touchstart', function(e) {
        if (e.touches[0]) spawnBurst(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // ═══════════════════════════════════════════════
    //  GLASS TILT — 3D 倾斜（仅桌面端）
    // ═══════════════════════════════════════════════
    function initGlassTilt() {
        if (isMobile) return;

        document.querySelectorAll('.avatar-planet').forEach(function(el) {
            el.addEventListener('mousemove', function(e) {
                var r = el.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width;
                var py = (e.clientY - r.top) / r.height;
                var rx = (py - 0.5) * -12;
                var ry = (px - 0.5) * 14;
                el.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
                el.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
                el.style.transform = 'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale3d(1.02,1.02,1.02)';
            });
            el.addEventListener('mouseleave', function() { el.style.transform = ''; });
        });
    }

    // ═══════════════════════════════════════════════
    //  INIT EVERYTHING
    // ═══════════════════════════════════════════════
    document.getElementById('title-name').textContent = GF_NAME;
    document.getElementById('name-label').textContent = GF_NAME;

    initGlassTilt();

})();