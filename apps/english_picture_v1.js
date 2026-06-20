export default {
    launch(container, system) {
        // ─── Word data ──────────────────────────────────────────────────────
        const GENRES = [
            {
                id: 'food', name: 'たべもの', emoji: '🍎',
                bg: ['#ff6b6b', '#ee5a24'],
                words: [
                    { en: 'apple',      emoji: '🍎' },
                    { en: 'banana',     emoji: '🍌' },
                    { en: 'strawberry', emoji: '🍓' },
                    { en: 'watermelon', emoji: '🍉' },
                    { en: 'grapes',     emoji: '🍇' },
                    { en: 'cake',       emoji: '🎂' },
                    { en: 'ice cream',  emoji: '🍦' },
                    { en: 'pizza',      emoji: '🍕' },
                    { en: 'cookie',     emoji: '🍪' },
                    { en: 'orange',     emoji: '🍊' },
                    { en: 'cherry',     emoji: '🍒' },
                    { en: 'corn',       emoji: '🌽' },
                ]
            },
            {
                id: 'animals', name: 'どうぶつ', emoji: '🐱',
                bg: ['#20bf6b', '#0fb9b1'],
                words: [
                    { en: 'cat',      emoji: '🐱' },
                    { en: 'dog',      emoji: '🐶' },
                    { en: 'rabbit',   emoji: '🐰' },
                    { en: 'elephant', emoji: '🐘' },
                    { en: 'lion',     emoji: '🦁' },
                    { en: 'monkey',   emoji: '🐵' },
                    { en: 'panda',    emoji: '🐼' },
                    { en: 'penguin',  emoji: '🐧' },
                    { en: 'fish',     emoji: '🐟' },
                    { en: 'bird',     emoji: '🐦' },
                    { en: 'frog',     emoji: '🐸' },
                    { en: 'tiger',    emoji: '🐯' },
                ]
            },
            {
                id: 'vehicles', name: 'のりもの', emoji: '🚗',
                bg: ['#4776e6', '#8e54e9'],
                words: [
                    { en: 'car',         emoji: '🚗' },
                    { en: 'bus',         emoji: '🚌' },
                    { en: 'train',       emoji: '🚂' },
                    { en: 'airplane',    emoji: '✈️' },
                    { en: 'boat',        emoji: '⛵' },
                    { en: 'bicycle',     emoji: '🚲' },
                    { en: 'truck',       emoji: '🚚' },
                    { en: 'helicopter',  emoji: '🚁' },
                    { en: 'rocket',      emoji: '🚀' },
                    { en: 'ambulance',   emoji: '🚑' },
                    { en: 'taxi',        emoji: '🚕' },
                    { en: 'fire truck',  emoji: '🚒' },
                ]
            },
            {
                id: 'jobs', name: 'おしごと', emoji: '👨‍⚕️',
                bg: ['#cc5de8', '#a855f7'],
                words: [
                    { en: 'doctor',      emoji: '👨‍⚕️' },
                    { en: 'teacher',     emoji: '👩‍🏫' },
                    { en: 'police',      emoji: '👮' },
                    { en: 'chef',        emoji: '👨‍🍳' },
                    { en: 'farmer',      emoji: '👨‍🌾' },
                    { en: 'astronaut',   emoji: '👨‍🚀' },
                    { en: 'artist',      emoji: '👨‍🎨' },
                    { en: 'firefighter', emoji: '👩‍🚒' },
                    { en: 'pilot',       emoji: '👨‍✈️' },
                    { en: 'nurse',       emoji: '👩‍⚕️' },
                ]
            },
            {
                id: 'body', name: 'からだ', emoji: '👁️',
                bg: ['#f7971e', '#ffd200'],
                words: [
                    { en: 'eye',   emoji: '👁️' },
                    { en: 'nose',  emoji: '👃' },
                    { en: 'mouth', emoji: '👄' },
                    { en: 'ear',   emoji: '👂' },
                    { en: 'hand',  emoji: '✋' },
                    { en: 'foot',  emoji: '🦶' },
                    { en: 'tooth', emoji: '🦷' },
                    { en: 'arm',   emoji: '💪' },
                    { en: 'leg',   emoji: '🦵' },
                    { en: 'heart', emoji: '❤️' },
                ]
            },
        ];

        // ─── State ──────────────────────────────────────────────────────────
        let phase = 'genre'; // 'genre' | 'quiz' | 'result'
        let genre = null;
        let questions = [];
        let qIdx = 0;
        let score = 0;
        let locked = false;

        // ─── Speech ─────────────────────────────────────────────────────────
        let voices = [];
        const loadVoices = () => { voices = window.speechSynthesis.getVoices(); };
        loadVoices();
        if ('onvoiceschanged' in window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        const speak = (text) => {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(text);
            utt.lang = 'en-US';
            utt.rate = 0.75;
            utt.pitch = 1.1;
            const v = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en'));
            if (v) utt.voice = v;
            window.speechSynthesis.speak(utt);
        };

        // ─── Helpers ────────────────────────────────────────────────────────
        const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

        const buildQuestions = (g) => {
            const pool = shuffle(g.words).slice(0, 10);
            return pool.map(word => {
                const others = shuffle(g.words.filter(w => w.en !== word.en)).slice(0, 3);
                return { word, choices: shuffle([word, ...others]) };
            });
        };

        const grad = (g) => `linear-gradient(135deg, ${g.bg[0]}, ${g.bg[1]})`;

        // ─── Feedback overlay ───────────────────────────────────────────────
        const showFeedback = (ok) => {
            const el = document.createElement('div');
            el.style.cssText = `
                position: fixed; inset: 0; display: flex; align-items: center;
                justify-content: center; z-index: 999; pointer-events: none;
            `;
            el.innerHTML = `
                <div style="
                    background: ${ok ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#f87171,#dc2626)'};
                    border-radius: 60px; padding: 22px 48px;
                    font-size: 36px; font-weight: bold; color: #fff;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.35);
                    animation: fbPop .25s cubic-bezier(.34,1.56,.64,1) forwards;
                ">${ok ? '✨ せいかい！' : '😢 ざんねん'}</div>
            `;
            const st = document.createElement('style');
            st.textContent = `@keyframes fbPop{from{transform:scale(0.4);opacity:0}to{transform:scale(1);opacity:1}}`;
            document.head.appendChild(st);
            document.body.appendChild(el);
            setTimeout(() => { el.remove(); st.remove(); }, 1400);
        };

        // ─── RENDER: Genre select ────────────────────────────────────────────
        const renderGenre = () => {
            container.innerHTML = `
<style>
.gc-btn { transition: transform .12s; }
.gc-btn:active { transform: scale(0.93) !important; }
</style>
<div style="
    min-height: 100vh;
    background: linear-gradient(160deg, #667eea 0%, #764ba2 100%);
    display: flex; flex-direction: column; align-items: center;
    padding: 20px 16px 32px; box-sizing: border-box;
">
    <!-- Header -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;width:100%;max-width:420px;">
        <button id="g-home" style="
            background: rgba(255,255,255,0.25); border: none; border-radius: 50%;
            width: 44px; height: 44px; font-size: 22px; cursor: pointer; flex-shrink: 0;
        ">🏠</button>
        <h1 style="
            flex: 1; text-align: center; margin: 0;
            font-size: 28px; font-weight: bold; color: #fff;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
        ">えいごえクイズ 🔤</h1>
        <div style="width:44px;"></div>
    </div>

    <p style="color:rgba(255,255,255,.9);font-size:19px;margin:0 0 24px;text-align:center;">
        ジャンルをえらんでね！
    </p>

    <!-- 2×2 grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%;max-width:400px;">
        ${GENRES.slice(0, 4).map((g, i) => `
        <button class="gc-btn" data-gid="${g.id}" style="
            background: ${grad(g)}; border: none; border-radius: 24px;
            padding: 26px 12px; cursor: pointer;
            box-shadow: 0 6px 22px rgba(0,0,0,0.22);
            display: flex; flex-direction: column; align-items: center; gap: 10px;
        ">
            <span style="font-size:52px;line-height:1;">${g.emoji}</span>
            <span style="font-size:18px;font-weight:bold;color:#fff;text-shadow:1px 1px 4px rgba(0,0,0,0.3);">${g.name}</span>
        </button>
        `).join('')}
    </div>

    <!-- 5th genre centered -->
    <div style="margin-top:14px;width:100%;max-width:400px;">
        <button class="gc-btn" data-gid="${GENRES[4].id}" style="
            background: ${grad(GENRES[4])}; border: none; border-radius: 24px;
            padding: 22px 12px; cursor: pointer; width: 100%;
            box-shadow: 0 6px 22px rgba(0,0,0,0.22);
            display: flex; flex-direction: column; align-items: center; gap: 10px;
        ">
            <span style="font-size:52px;line-height:1;">${GENRES[4].emoji}</span>
            <span style="font-size:18px;font-weight:bold;color:#fff;text-shadow:1px 1px 4px rgba(0,0,0,0.3);">${GENRES[4].name}</span>
        </button>
    </div>
</div>`;

            container.querySelector('#g-home').onclick = () => {
                window.speechSynthesis.cancel();
                system.goHome();
            };

            container.querySelectorAll('[data-gid]').forEach(btn => {
                btn.onclick = () => {
                    genre = GENRES.find(g => g.id === btn.dataset.gid);
                    questions = buildQuestions(genre);
                    qIdx = 0; score = 0; locked = false;
                    phase = 'quiz';
                    render();
                };
            });
        };

        // ─── RENDER: Quiz ────────────────────────────────────────────────────
        const renderQuiz = () => {
            const q = questions[qIdx];
            const pct = Math.round((qIdx / questions.length) * 100);

            container.innerHTML = `
<style>
.ch-btn {
    background: rgba(255,255,255,.96);
    border: 4px solid transparent; border-radius: 24px;
    padding: 16px 8px; cursor: pointer;
    display: flex; flex-direction: column; align-items: center;
    box-shadow: 0 4px 18px rgba(0,0,0,.12);
    transition: transform .1s, border-color .2s, background .2s;
}
.ch-btn:active { transform: scale(0.93); }
.ch-btn.correct { border-color: #22c55e !important; background: #f0fdf4 !important; }
.ch-btn.wrong   { border-color: #ef4444 !important; background: #fef2f2 !important; }
.speak-btn { transition: transform .1s; }
.speak-btn:active { transform: scale(0.92); }
</style>
<div style="
    min-height: 100vh;
    background: ${grad(genre)};
    display: flex; flex-direction: column; align-items: center;
    padding: 16px 16px 28px; box-sizing: border-box;
">
    <!-- Progress header -->
    <div style="display:flex;align-items:center;gap:10px;width:100%;max-width:420px;margin-bottom:14px;">
        <button id="q-back" style="
            background:rgba(255,255,255,.28);border:none;border-radius:50%;
            width:42px;height:42px;font-size:20px;cursor:pointer;flex-shrink:0;
        ">◀</button>
        <div style="flex:1;">
            <div style="background:rgba(255,255,255,.3);border-radius:10px;height:12px;overflow:hidden;">
                <div id="prog-bar" style="background:#fff;height:100%;width:${pct}%;border-radius:10px;transition:width .5s;"></div>
            </div>
            <div style="color:rgba(255,255,255,.85);font-size:13px;text-align:center;margin-top:4px;">
                ${qIdx + 1} / ${questions.length}もん
            </div>
        </div>
        <div style="
            background:rgba(255,255,255,.28);border-radius:16px;
            padding:6px 14px;color:#fff;font-size:15px;font-weight:bold;
        ">⭐ ${score}</div>
    </div>

    <!-- Word card -->
    <div style="
        background: rgba(255,255,255,.97); border-radius: 28px;
        padding: 28px 20px 24px; width: 100%; max-width: 400px;
        box-sizing: border-box; text-align: center;
        box-shadow: 0 8px 32px rgba(0,0,0,.15); margin-bottom: 18px;
    ">
        <p style="font-size:16px;color:#888;margin:0 0 10px;">どれのことかな？</p>
        <div style="font-size:40px;font-weight:bold;color:#222;letter-spacing:3px;margin-bottom:22px;">${q.word.en}</div>
        <button id="speak-btn" class="speak-btn" style="
            background: ${grad(genre)}; border: none; border-radius: 50px;
            padding: 14px 36px; cursor: pointer;
            box-shadow: 0 4px 18px rgba(0,0,0,.2);
            color: #fff; font-size: 20px; font-weight: bold;
            display: inline-flex; align-items: center; gap: 8px;
        ">
            🔊 <span style="font-size:15px;">もういちどきく</span>
        </button>
    </div>

    <!-- 2×2 choices -->
    <div id="choices-grid" style="
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 14px; width: 100%; max-width: 400px;
    ">
        ${q.choices.map((c, i) => `
        <button class="ch-btn" data-cidx="${i}">
            <span style="font-size:72px;line-height:1.1;">${c.emoji}</span>
        </button>
        `).join('')}
    </div>
</div>`;

            // Auto-speak on new question
            setTimeout(() => speak(q.word.en), 300);

            container.querySelector('#speak-btn').onclick = () => speak(q.word.en);

            container.querySelector('#q-back').onclick = () => {
                window.speechSynthesis.cancel();
                phase = 'genre';
                render();
            };

            const choiceBtns = [...container.querySelectorAll('[data-cidx]')];
            choiceBtns.forEach(btn => {
                btn.onclick = () => {
                    if (locked) return;
                    locked = true;

                    const chosen = q.choices[parseInt(btn.dataset.cidx)];
                    const correct = chosen.en === q.word.en;

                    // Visual feedback on all buttons
                    choiceBtns.forEach((b, i) => {
                        const word = q.choices[i];
                        if (word.en === q.word.en) {
                            b.classList.add('correct');
                        } else if (b === btn) {
                            b.classList.add('wrong');
                        }
                    });

                    if (correct) {
                        score += 10;
                        system.addScore(10);
                        system.playSound('correct');
                    } else {
                        system.playSound('wrong');
                    }

                    system.logQuizResult('えいごえクイズ', q.word.en, correct, {
                        genre: genre.id,
                        chosen: chosen.en,
                    });

                    showFeedback(correct);

                    setTimeout(() => {
                        qIdx++;
                        locked = false;
                        if (qIdx >= questions.length) {
                            phase = 'result';
                        }
                        render();
                    }, 1500);
                };
            });
        };

        // ─── RENDER: Result ──────────────────────────────────────────────────
        const renderResult = () => {
            const total = questions.length * 10;
            const pct = Math.round((score / total) * 100);
            let msg, icon;
            if (pct === 100)       { msg = 'パーフェクト！すごい！'; icon = '🏆'; }
            else if (pct >= 80)    { msg = 'とってもよくできた！';   icon = '🌟'; }
            else if (pct >= 60)    { msg = 'よくがんばった！';       icon = '😊'; }
            else if (pct >= 40)    { msg = 'がんばったね！';         icon = '💪'; }
            else                   { msg = 'またちょうせんしよう！'; icon = '🎵'; }

            container.innerHTML = `
<style>.r-btn{transition:transform .1s;}.r-btn:active{transform:scale(0.93);}</style>
<div style="
    min-height: 100vh;
    background: ${grad(genre)};
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 24px 16px; box-sizing: border-box;
">
    <div style="
        background: rgba(255,255,255,.97); border-radius: 36px;
        padding: 44px 32px; width: 100%; max-width: 360px;
        text-align: center; box-shadow: 0 10px 48px rgba(0,0,0,.22);
    ">
        <div style="font-size:80px;margin-bottom:14px;">${icon}</div>
        <div style="font-size:24px;font-weight:bold;color:#333;margin-bottom:6px;">${msg}</div>
        <div style="font-size:16px;color:#888;margin-bottom:28px;">${genre.name}コース</div>

        <div style="
            background: ${grad(genre)}; border-radius: 22px;
            padding: 22px 16px; margin-bottom: 28px;
        ">
            <div style="font-size:52px;font-weight:bold;color:#fff;line-height:1;">${score}</div>
            <div style="font-size:14px;color:rgba(255,255,255,.8);margin-top:4px;">
                てん（${questions.length}もん中 ${Math.round(score/10)}もんせいかい）
            </div>
        </div>

        <!-- Stars display -->
        <div style="font-size:28px;letter-spacing:4px;margin-bottom:28px;">
            ${[...Array(questions.length)].map((_, i) => i < Math.round(score/10) ? '⭐' : '☆').join('')}
        </div>

        <div style="display:flex;gap:12px;">
            <button id="retry-btn" class="r-btn" style="
                flex:1; background: ${grad(genre)}; color:#fff;
                border:none; border-radius:20px; padding:18px 8px;
                font-size:17px; font-weight:bold; cursor:pointer;
                box-shadow:0 4px 18px rgba(0,0,0,.2);
            ">🔄 もういちど</button>
            <button id="res-home" class="r-btn" style="
                flex:1; background:#f1f5f9; color:#555;
                border:none; border-radius:20px; padding:18px 8px;
                font-size:17px; font-weight:bold; cursor:pointer;
            ">🏠 おうちへ</button>
        </div>
    </div>
</div>`;

            container.querySelector('#retry-btn').onclick = () => {
                questions = buildQuestions(genre);
                qIdx = 0; score = 0; locked = false;
                phase = 'quiz';
                render();
            };

            container.querySelector('#res-home').onclick = () => {
                window.speechSynthesis.cancel();
                system.goHome();
            };
        };

        // ─── Master render ───────────────────────────────────────────────────
        const render = () => {
            if (phase === 'genre')  renderGenre();
            else if (phase === 'quiz')   renderQuiz();
            else                         renderResult();
        };

        render();

        // Cleanup
        return () => {
            window.speechSynthesis.cancel();
            window.speechSynthesis.onvoiceschanged = null;
        };
    }
};
