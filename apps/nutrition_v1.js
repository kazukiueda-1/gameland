/**
 * もぐもぐえいよう
 * 三色食品群（あか・きいろ・みどり）で栄養素とそのはたらきを学ぶアプリ
 * - べんきょうモード：たべものずかん（色ごとに10種類・1枚ずつ詳しく見る）
 * - クイズモード：なにいろクイズ／はたらきクイズ／バランスごはん
 */

export default {
    launch(container, system) {

        // ========================================
        // データ定義（三色食品群）
        // ========================================
        const GROUPS = [
            {
                id: 'red',
                name: 'あか',
                emoji: '🔴',
                work: 'からだを つくる',
                workSentence: 'からだを つくって くれるよ',
                nutrientTitle: 'たんぱくしつ・カルシウム',
                summary: 'にくや さかな、たまご、ぎゅうにゅうの なかま。ちや にく、ほねに なって、からだを おおきく つよく するよ。',
                css: {
                    solid: 'bg-red-400',
                    solidHover: 'hover:bg-red-500',
                    light: 'bg-red-50',
                    border: 'border-red-300',
                    text: 'text-red-500',
                    chip: 'bg-red-100 text-red-600'
                },
                foods: [
                    { name: 'にく',        emoji: '🥩', nutrient: 'たんぱくしつ', effect: 'きんにくを つくるよ。はしったり とんだり、ちからが でる からだに なる！' },
                    { name: 'とりにく',    emoji: '🍗', nutrient: 'たんぱくしつ', effect: 'あぶらが すくなくて からだを つくるのが とくい。げんきの もとだよ。' },
                    { name: 'さかな',      emoji: '🐟', nutrient: 'たんぱくしつ', effect: 'あたまの はたらきを たすけるよ。ほねも じょうぶに なる！' },
                    { name: 'えび',        emoji: '🍤', nutrient: 'たんぱくしつ', effect: 'ぷりぷりの みは からだを つくる ざいりょうに なるよ。' },
                    { name: 'たまご',      emoji: '🥚', nutrient: 'たんぱくしつ', effect: 'からだに ひつような ものが たくさん。「かんぜんしょくひん」と よばれるよ。' },
                    { name: 'ぎゅうにゅう', emoji: '🥛', nutrient: 'カルシウム',   effect: 'ほねを つよく するよ。のむと せが のびる おてつだいを してくれる！' },
                    { name: 'チーズ',      emoji: '🧀', nutrient: 'カルシウム',   effect: 'ぎゅうにゅうから できているよ。ほねと はを じょうぶに するよ。' },
                    { name: 'ヨーグルト',  emoji: '🥣', nutrient: 'カルシウム',   effect: 'おなかの ちょうしも よく してくれる やさしい たべもの。' },
                    { name: 'まめ',        emoji: '🫘', nutrient: 'たんぱくしつ', effect: 'とうふや なっとうの なかま。やさいみたいだけど からだを つくる なかまだよ。' },
                    { name: 'ハム',        emoji: '🥓', nutrient: 'たんぱくしつ', effect: 'ぶたにくから できているよ。おにくの なかまだね。' }
                ]
            },
            {
                id: 'yellow',
                name: 'きいろ',
                emoji: '🟡',
                work: 'ちからの もとに なる',
                workSentence: 'げんきに うごく ちからに なるよ',
                nutrientTitle: 'たんすいかぶつ・あぶら',
                summary: 'ごはんや パン、いもの なかま。からだを うごかす ガソリンに なって、げんきに あそべる ちからを くれるよ。',
                css: {
                    solid: 'bg-amber-400',
                    solidHover: 'hover:bg-amber-500',
                    light: 'bg-amber-50',
                    border: 'border-amber-300',
                    text: 'text-amber-500',
                    chip: 'bg-amber-100 text-amber-700'
                },
                foods: [
                    { name: 'ごはん',       emoji: '🍚', nutrient: 'たんすいかぶつ', effect: 'いちにちの ちからの もと。あさ たべると げんきに うごけるよ。' },
                    { name: 'パン',         emoji: '🍞', nutrient: 'たんすいかぶつ', effect: 'むぎから できているよ。ごはんと おなじ ちからの もとだね。' },
                    { name: 'うどん',       emoji: '🍜', nutrient: 'たんすいかぶつ', effect: 'すぐ ちからに なるよ。げんきが ないときにも たべやすい。' },
                    { name: 'スパゲッティ', emoji: '🍝', nutrient: 'たんすいかぶつ', effect: 'ながく ちからが つづくよ。うんどうの まえに ぴったり。' },
                    { name: 'じゃがいも',   emoji: '🥔', nutrient: 'たんすいかぶつ', effect: 'つちの なかで そだつよ。ちからの もとに なる やさいだよ。' },
                    { name: 'さつまいも',   emoji: '🍠', nutrient: 'たんすいかぶつ', effect: 'あまくて ちからが たっぷり。おなかの ちょうしも たすけるよ。' },
                    { name: 'とうもろこし', emoji: '🌽', nutrient: 'たんすいかぶつ', effect: 'つぶつぶに ちからが つまっているよ。' },
                    { name: 'バター',       emoji: '🧈', nutrient: 'あぶら',         effect: 'すこしで つよい ちからに なるよ。たべすぎには ちゅうい！' },
                    { name: 'ナッツ',       emoji: '🥜', nutrient: 'あぶら',         effect: 'ちいさいけど ちからが たっぷり。あたまの はたらきも たすけるよ。' },
                    { name: 'さとう',       emoji: '🍬', nutrient: 'たんすいかぶつ', effect: 'すぐに ちからに なるよ。でも たべすぎると はが むしばに なっちゃう。' }
                ]
            },
            {
                id: 'green',
                name: 'みどり',
                emoji: '🟢',
                work: 'ちょうしを ととのえる',
                workSentence: 'からだの ちょうしを ととのえて くれるよ',
                nutrientTitle: 'ビタミン・しょくもつせんい',
                summary: 'やさいと くだものの なかま。かぜを ひきにくく したり、おなかの ちょうしを よく したり、からだを まもってくれるよ。',
                css: {
                    solid: 'bg-green-400',
                    solidHover: 'hover:bg-green-500',
                    light: 'bg-green-50',
                    border: 'border-green-300',
                    text: 'text-green-500',
                    chip: 'bg-green-100 text-green-700'
                },
                foods: [
                    { name: 'にんじん',     emoji: '🥕', nutrient: 'ビタミン',         effect: 'めの はたらきを たすけるよ。くらいところでも みえやすく なる！' },
                    { name: 'トマト',       emoji: '🍅', nutrient: 'ビタミン',         effect: 'あかい ちからで からだを げんきに。おひさまの えいようだよ。' },
                    { name: 'ブロッコリー', emoji: '🥦', nutrient: 'ビタミン',         effect: 'ビタミンが とっても おおいよ。かぜを ひきにくく してくれる。' },
                    { name: 'キャベツ',     emoji: '🥬', nutrient: 'しょくもつせんい', effect: 'おなかの そうじを してくれるよ。うんちが でやすく なる！' },
                    { name: 'きゅうり',     emoji: '🥒', nutrient: 'ビタミン',         effect: 'みずが たっぷり。あついひに からだを ひやしてくれるよ。' },
                    { name: 'ピーマン',     emoji: '🫑', nutrient: 'ビタミン',         effect: 'にがいけど ビタミンが たっぷり。おはだも つるつるに なるよ。' },
                    { name: 'りんご',       emoji: '🍎', nutrient: 'しょくもつせんい', effect: 'おなかの ちょうしを ととのえるよ。まいにち たべると げんきに なる！' },
                    { name: 'みかん',       emoji: '🍊', nutrient: 'ビタミン',         effect: 'ビタミンCが たっぷり。ふゆの かぜから からだを まもってくれる。' },
                    { name: 'いちご',       emoji: '🍓', nutrient: 'ビタミン',         effect: 'ちいさいけど ビタミンCは みかんより おおいよ。' },
                    { name: 'きのこ',       emoji: '🍄', nutrient: 'しょくもつせんい', effect: 'おなかを きれいに するよ。ほねを つよく する てつだいも！' }
                ]
            }
        ];

        const ALL_FOODS = GROUPS.flatMap(g => g.foods.map(f => ({ ...f, group: g })));
        const QUESTION_COUNT = 10;

        // ========================================
        // サウンド（Web Audio）
        // ========================================
        let audioCtx = null;
        const getCtx = () => {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            return audioCtx;
        };

        const playCorrectSound = () => {
            try {
                const ctx = getCtx();
                // ピンポンピンポーン
                const notes = [
                    { freq: 880, t: 0.00, dur: 0.18 },
                    { freq: 587, t: 0.22, dur: 0.18 },
                    { freq: 880, t: 0.48, dur: 0.18 },
                    { freq: 587, t: 0.70, dur: 0.55 }
                ];
                notes.forEach(({ freq, t, dur }) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    const start = ctx.currentTime + t;
                    gain.gain.setValueAtTime(0, start);
                    gain.gain.linearRampToValueAtTime(0.5, start + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
                    osc.start(start);
                    osc.stop(start + dur + 0.05);
                });
            } catch (_) {}
        };

        const playWrongSound = () => {
            try {
                const ctx = getCtx();
                // ブー
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'square';
                osc.frequency.value = 160;
                gain.gain.setValueAtTime(0.35, ctx.currentTime);
                gain.gain.setValueAtTime(0.35, ctx.currentTime + 0.45);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.58);
            } catch (_) {}
        };

        const playFanfare = () => {
            try {
                const ctx = getCtx();
                [523, 659, 784, 1046].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'triangle';
                    osc.frequency.value = freq;
                    const start = ctx.currentTime + i * 0.14;
                    const dur = i === 3 ? 0.6 : 0.2;
                    gain.gain.setValueAtTime(0, start);
                    gain.gain.linearRampToValueAtTime(0.45, start + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
                    osc.start(start);
                    osc.stop(start + dur + 0.05);
                });
            } catch (_) {}
        };

        // ========================================
        // ヘルパー
        // ========================================
        const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
        const pick = arr => arr[Math.floor(Math.random() * arr.length)];
        const groupById = id => GROUPS.find(g => g.id === id);

        const headerHtml = (title, backId, backLabel = '◀ もどる') => `
            <div class="flex justify-between items-center gap-2 mb-3 shrink-0">
                <button id="${backId}" class="bg-gray-100 text-gray-500 font-bold py-2 px-4 rounded-full text-sm active:scale-95 transition">${backLabel}</button>
                <h2 class="text-lg md:text-2xl font-black text-gray-700 text-center">${title}</h2>
                <div class="w-20"></div>
            </div>
        `;

        // ========================================
        // 状態
        // ========================================
        let quizType = null;      // 'color' | 'work' | 'balance'
        let questions = [];
        let qIndex = 0;
        let correctCount = 0;
        let answered = false;
        let feedbackTimer = null;

        // ========================================
        // メインメニュー
        // ========================================
        const renderMenu = () => {
            container.innerHTML = `
                <div class="h-full flex flex-col p-4 animate-pop">
                    <div class="flex justify-start shrink-0">
                        <button id="btn-quit" class="bg-gray-100 text-gray-500 font-bold py-2 px-4 rounded-full text-sm active:scale-95 transition">✕ やめる</button>
                    </div>

                    <div class="flex-1 flex flex-col items-center justify-center gap-6 overflow-y-auto">
                        <div class="text-center">
                            <div class="text-6xl mb-2">🍱</div>
                            <h2 class="text-3xl md:text-4xl font-black text-red-400">もぐもぐ えいよう</h2>
                            <p class="text-gray-500 font-bold mt-2 text-sm md:text-base">たべものは からだの なかで はたらいているよ</p>
                        </div>

                        <div class="flex flex-col gap-4 w-full max-w-md">
                            <button id="btn-study" class="bg-green-400 hover:bg-green-500 text-white text-2xl font-black py-6 px-6 rounded-3xl shadow-lg active:scale-95 transition">
                                📖 たべものずかん
                                <span class="block text-sm font-bold opacity-90 mt-1">3つの いろを しらべよう</span>
                            </button>
                            <button id="btn-quiz" class="bg-red-400 hover:bg-red-500 text-white text-2xl font-black py-6 px-6 rounded-3xl shadow-lg active:scale-95 transition">
                                🎯 クイズ
                                <span class="block text-sm font-bold opacity-90 mt-1">10もん に ちょうせん！</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.querySelector('#btn-quit').onclick = () => system.goHome();
            container.querySelector('#btn-study').onclick = renderStudyGroups;
            container.querySelector('#btn-quiz').onclick = renderQuizSelect;
        };

        // ========================================
        // べんきょう：いろ えらび
        // ========================================
        const renderStudyGroups = () => {
            const cards = GROUPS.map(g => `
                <button data-group="${g.id}" class="group-card ${g.css.light} border-4 ${g.css.border} rounded-3xl p-4 text-left shadow-sm active:scale-95 transition w-full">
                    <div class="flex items-center gap-3">
                        <div class="text-4xl shrink-0">${g.emoji}</div>
                        <div class="min-w-0">
                            <div class="text-xl font-black ${g.css.text}">${g.name}の なかま</div>
                            <div class="text-base font-bold text-gray-600">${g.work}</div>
                            <div class="text-xs font-bold text-gray-400 mt-0.5">${g.nutrientTitle}</div>
                        </div>
                    </div>
                    <div class="flex gap-1 mt-2 text-2xl">${g.foods.slice(0, 6).map(f => f.emoji).join('')}</div>
                </button>
            `).join('');

            container.innerHTML = `
                <div class="h-full flex flex-col p-4">
                    ${headerHtml('たべものずかん', 'btn-back')}
                    <p class="text-center text-gray-500 font-bold text-sm mb-3 shrink-0">たべものは 3つの いろの なかまに わかれるよ</p>
                    <div class="flex-1 overflow-y-auto">
                        <div class="flex flex-col gap-3 max-w-2xl mx-auto pb-4">${cards}</div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-back').onclick = renderMenu;
            container.querySelectorAll('.group-card').forEach(btn => {
                btn.onclick = () => renderStudyList(groupById(btn.dataset.group));
            });
        };

        // ========================================
        // べんきょう：たべもの いちらん
        // ========================================
        const renderStudyList = (group) => {
            const cards = group.foods.map((f, i) => `
                <button data-index="${i}" class="food-card bg-white border-4 ${group.css.border} rounded-2xl p-2 flex flex-col items-center justify-center shadow-sm active:scale-95 transition">
                    <div class="text-5xl">${f.emoji}</div>
                    <div class="text-sm md:text-base font-black text-gray-700 mt-1 text-center leading-tight">${f.name}</div>
                </button>
            `).join('');

            container.innerHTML = `
                <div class="h-full flex flex-col p-4">
                    ${headerHtml(`${group.emoji} ${group.name}の なかま`, 'btn-back')}
                    <div class="${group.css.light} border-4 ${group.css.border} rounded-2xl p-3 mb-3 shrink-0">
                        <div class="text-lg font-black ${group.css.text}">${group.work}</div>
                        <p class="text-sm font-bold text-gray-600 mt-1 leading-relaxed">${group.summary}</p>
                    </div>
                    <p class="text-center text-gray-400 font-bold text-xs mb-2 shrink-0">タップすると くわしく わかるよ 👆</p>
                    <div class="flex-1 overflow-y-auto">
                        <div class="grid grid-cols-3 md:grid-cols-5 gap-3 pb-4">${cards}</div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-back').onclick = renderStudyGroups;
            container.querySelectorAll('.food-card').forEach(btn => {
                btn.onclick = () => renderStudyDetail(group, parseInt(btn.dataset.index));
            });
        };

        // ========================================
        // べんきょう：たべもの くわしく
        // ========================================
        const renderStudyDetail = (group, index) => {
            const f = group.foods[index];
            const prevIdx = (index - 1 + group.foods.length) % group.foods.length;
            const nextIdx = (index + 1) % group.foods.length;

            container.innerHTML = `
                <div class="h-full flex flex-col p-4">
                    ${headerHtml(`${group.emoji} ${group.name}の なかま`, 'btn-back', '◀ いちらん')}
                    <div class="flex-1 overflow-y-auto">
                        <div class="max-w-xl mx-auto animate-pop">
                            <div class="bg-white border-4 ${group.css.border} rounded-3xl p-5 shadow-sm text-center">
                                <div class="text-8xl mb-2">${f.emoji}</div>
                                <div class="text-3xl font-black text-gray-800">${f.name}</div>
                                <div class="inline-block ${group.css.chip} font-black text-base px-4 py-1 rounded-full mt-3">${f.nutrient}</div>
                                <div class="${group.css.light} rounded-2xl p-4 mt-4">
                                    <div class="text-lg font-black ${group.css.text} mb-1">${group.work}</div>
                                    <p class="text-base font-bold text-gray-700 leading-relaxed">${f.effect}</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center gap-3 mt-4 pb-4">
                                <button id="btn-prev" class="flex-1 bg-gray-100 text-gray-600 font-black py-4 rounded-2xl active:scale-95 transition">◀ まえ</button>
                                <div class="text-sm font-bold text-gray-400 shrink-0">${index + 1} / ${group.foods.length}</div>
                                <button id="btn-next" class="flex-1 ${group.css.solid} ${group.css.solidHover} text-white font-black py-4 rounded-2xl active:scale-95 transition">つぎ ▶</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-back').onclick = () => renderStudyList(group);
            container.querySelector('#btn-prev').onclick = () => renderStudyDetail(group, prevIdx);
            container.querySelector('#btn-next').onclick = () => renderStudyDetail(group, nextIdx);
        };

        // ========================================
        // クイズ：しゅるい えらび
        // ========================================
        const QUIZ_TYPES = [
            { id: 'color',   icon: '🎨', title: 'なにいろの なかま？', desc: 'たべものの いろを あてよう',       css: 'bg-red-400',    cssHover: 'hover:bg-red-500' },
            { id: 'work',    icon: '💪', title: 'どんな はたらき？',   desc: 'からだで なにを するか あてよう', css: 'bg-blue-400',   cssHover: 'hover:bg-blue-500' },
            { id: 'balance', icon: '🍽️', title: 'バランス ごはん',     desc: '3つの いろを そろえよう',         css: 'bg-purple-400', cssHover: 'hover:bg-purple-500' }
        ];

        const renderQuizSelect = () => {
            const buttons = QUIZ_TYPES.map(t => `
                <button data-type="${t.id}" class="quiz-type ${t.css} ${t.cssHover} text-white text-left py-5 px-6 rounded-3xl shadow-lg active:scale-95 transition w-full">
                    <div class="text-2xl font-black">${t.icon} ${t.title}</div>
                    <div class="text-sm font-bold opacity-90 mt-1">${t.desc}</div>
                </button>
            `).join('');

            container.innerHTML = `
                <div class="h-full flex flex-col p-4">
                    ${headerHtml('クイズ', 'btn-back')}
                    <p class="text-center text-gray-500 font-bold text-sm mb-4 shrink-0">どの クイズに する？（10もん）</p>
                    <div class="flex-1 overflow-y-auto">
                        <div class="flex flex-col gap-4 max-w-md mx-auto pb-4">${buttons}</div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-back').onclick = renderMenu;
            container.querySelectorAll('.quiz-type').forEach(btn => {
                btn.onclick = () => startQuiz(btn.dataset.type);
            });
        };

        // ========================================
        // クイズ：もんだい づくり
        // ========================================
        const buildColorQuestion = (food) => ({
            type: 'color',
            logLabel: `なにいろ:${food.name}`,
            emoji: food.emoji,
            title: `${food.name} は なにいろの なかま？`,
            sub: '',
            choices: shuffle(GROUPS.map(g => ({
                key: g.id,
                label: `${g.emoji} ${g.name}`,
                sub: g.work,
                correct: g.id === food.group.id
            }))),
            group: food.group,
            explain: `${food.name} には 「${food.nutrient}」が はいっているよ。${food.group.work} ${food.group.name}の なかま！`
        });

        const buildWorkQuestion = (food) => ({
            type: 'work',
            logLabel: `はたらき:${food.name}`,
            emoji: food.emoji,
            title: `${food.name} を たべると どうなる？`,
            sub: '',
            choices: shuffle(GROUPS.map(g => ({
                key: g.id,
                label: g.work,
                sub: g.nutrientTitle,
                correct: g.id === food.group.id
            }))),
            group: food.group,
            explain: `${food.name} の 「${food.nutrient}」が ${food.group.workSentence}。${food.effect}`
        });

        const buildBalanceQuestion = () => {
            const missing = pick(GROUPS);
            const present = GROUPS.filter(g => g.id !== missing.id);
            const tray = present.map(g => ({ group: g, food: pick(g.foods) }));
            const correctFood = pick(missing.foods);

            // まちがいの せんたくしは、おさらに ある いろ（＝すでに たりている いろ）から
            const wrongFoods = tray.map(t => pick(t.group.foods.filter(f => f.name !== t.food.name)));

            const choices = shuffle([
                { key: missing.id, label: `${correctFood.emoji} ${correctFood.name}`, sub: '', correct: true },
                ...wrongFoods.map((f, i) => ({ key: tray[i].group.id, label: `${f.emoji} ${f.name}`, sub: '', correct: false }))
            ]);

            const trayHtml = tray.map(t => `
                <div class="${t.group.css.light} border-4 ${t.group.css.border} rounded-2xl p-2 flex flex-col items-center w-24">
                    <div class="text-4xl">${t.food.emoji}</div>
                    <div class="text-xs font-black text-gray-600 mt-1">${t.food.name}</div>
                </div>
            `).join('') + `
                <div class="bg-gray-100 border-4 border-dashed border-gray-300 rounded-2xl p-2 flex flex-col items-center justify-center w-24">
                    <div class="text-4xl text-gray-300">？</div>
                    <div class="text-xs font-black text-gray-400 mt-1">なに？</div>
                </div>
            `;

            return {
                type: 'balance',
                logLabel: `バランス:${missing.name}が たりない`,
                emoji: tray.map(t => t.food.emoji).join(''),
                title: 'たりない いろは どれ？',
                sub: `おさらには ${tray.map(t => `${t.group.emoji}${t.group.name}`).join(' と ')} が あるよ`,
                choices,
                group: missing,
                explain: `${correctFood.name} は ${missing.emoji}${missing.name}の なかま。${missing.work} えいようが そろって バランス ばっちり！`,
                trayHtml
            };
        };

        const startQuiz = (type) => {
            quizType = type;
            qIndex = 0;
            correctCount = 0;
            answered = false;

            if (type === 'balance') {
                questions = Array.from({ length: QUESTION_COUNT }, () => buildBalanceQuestion());
            } else {
                const pool = shuffle(ALL_FOODS).slice(0, QUESTION_COUNT);
                questions = pool.map(f => type === 'color' ? buildColorQuestion(f) : buildWorkQuestion(f));
            }
            renderQuiz();
        };

        // ========================================
        // クイズ：しゅつだい がめん
        // ========================================
        const renderQuiz = () => {
            const q = questions[qIndex];
            const typeInfo = QUIZ_TYPES.find(t => t.id === quizType);
            const progress = Math.round((qIndex / QUESTION_COUNT) * 100);

            const choicesHtml = q.choices.map((c, i) => `
                <button data-index="${i}" class="choice-btn bg-white border-4 border-gray-200 rounded-2xl py-4 px-4 text-left shadow-sm active:scale-95 transition w-full">
                    <div class="text-xl md:text-2xl font-black text-gray-700">${c.label}</div>
                    ${c.sub ? `<div class="text-xs font-bold text-gray-400 mt-0.5">${c.sub}</div>` : ''}
                </button>
            `).join('');

            const stageHtml = q.type === 'balance'
                ? `<div class="flex justify-center gap-2 flex-wrap">${q.trayHtml}</div>`
                : `<div class="text-7xl md:text-8xl text-center">${q.emoji}</div>`;

            container.innerHTML = `
                <div class="h-full flex flex-col p-4">
                    <div class="flex justify-between items-center gap-2 mb-2 shrink-0">
                        <button id="btn-quit-quiz" class="bg-gray-100 text-gray-500 font-bold py-2 px-4 rounded-full text-sm active:scale-95 transition">✕ やめる</button>
                        <div class="text-base font-black text-gray-500">${qIndex + 1} / ${QUESTION_COUNT}もん</div>
                        <div id="quiz-star" class="text-base font-black text-yellow-500">⭐ ${correctCount}</div>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-3 mb-3 shrink-0">
                        <div class="${typeInfo.css} h-3 rounded-full transition-all duration-300" style="width:${progress}%"></div>
                    </div>

                    <div id="quiz-scroll" class="flex-1 overflow-y-auto">
                        <div class="max-w-xl mx-auto animate-pop">
                            <div class="bg-gray-50 rounded-3xl p-4 mb-4">
                                ${stageHtml}
                                <h3 class="text-xl md:text-2xl font-black text-gray-700 text-center mt-3">${q.title}</h3>
                                ${q.sub ? `<p class="text-sm font-bold text-gray-400 text-center mt-1">${q.sub}</p>` : ''}
                            </div>
                            <div id="choices" class="flex flex-col gap-3">${choicesHtml}</div>
                            <div id="feedback" class="pb-4"></div>
                        </div>
                    </div>
                </div>
            `;

            answered = false;
            container.querySelector('#btn-quit-quiz').onclick = renderQuizSelect;
            container.querySelectorAll('.choice-btn').forEach(btn => {
                btn.onclick = () => handleAnswer(parseInt(btn.dataset.index));
            });
        };

        // ========================================
        // クイズ：こたえあわせ
        // ========================================
        const handleAnswer = (index) => {
            if (answered) return;
            answered = true;

            const q = questions[qIndex];
            const chosen = q.choices[index];
            const isCorrect = !!chosen.correct;
            const correctChoice = q.choices.find(c => c.correct);

            // せんたくしの みための こうしん
            container.querySelectorAll('.choice-btn').forEach((btn, i) => {
                btn.onclick = null;
                const c = q.choices[i];
                btn.classList.remove('border-gray-200', 'bg-white');
                if (c.correct) {
                    btn.classList.add('border-green-400', 'bg-green-50');
                } else if (i === index) {
                    btn.classList.add('border-red-400', 'bg-red-50');
                } else {
                    btn.classList.add('border-gray-200', 'bg-white', 'opacity-40');
                }
            });

            if (isCorrect) {
                correctCount++;
                playCorrectSound();
                if (system.addScore) system.addScore(10);
                const star = container.querySelector('#quiz-star');
                if (star) star.textContent = `⭐ ${correctCount}`;
            } else {
                playWrongSound();
            }

            if (system.logQuizResult) {
                system.logQuizResult('もぐもぐえいよう', q.logLabel, isCorrect, {
                    mode: quizType,
                    answer: chosen.label,
                    correctAnswer: correctChoice.label
                });
            }

            const isLast = qIndex === QUESTION_COUNT - 1;
            const fb = container.querySelector('#feedback');
            fb.innerHTML = `
                <div class="${isCorrect ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'} border-4 rounded-3xl p-4 mt-4 animate-pop">
                    <div class="text-center text-4xl mb-1">${isCorrect ? '⭕' : '❌'}</div>
                    <div class="text-center text-xl font-black ${isCorrect ? 'text-green-500' : 'text-orange-500'} mb-2">
                        ${isCorrect ? 'せいかい！' : `こたえは 「${correctChoice.label}」`}
                    </div>
                    <div class="${q.group.css.light} rounded-2xl p-3">
                        <p class="text-base font-bold text-gray-700 leading-relaxed">${q.explain}</p>
                    </div>
                    <button id="btn-next-q" class="w-full ${isCorrect ? 'bg-green-400 hover:bg-green-500' : 'bg-orange-400 hover:bg-orange-500'} text-white text-xl font-black py-4 rounded-2xl mt-4 shadow-lg active:scale-95 transition">
                        ${isLast ? 'けっかを みる 🎉' : 'つぎへ ▶'}
                    </button>
                </div>
            `;

            const nextBtn = fb.querySelector('#btn-next-q');
            nextBtn.onclick = () => {
                if (isLast) {
                    renderResult();
                } else {
                    qIndex++;
                    renderQuiz();
                }
            };
            // かいせつと「つぎへ」ボタンが かならず みえるように いちばん したまで スクロールする
            // （アプリ内の スクロールと ページぜんたいの スクロール どちらでも うごくように）
            const scrollToFeedback = () => {
                const scrollArea = container.querySelector('#quiz-scroll');
                if (scrollArea && scrollArea.scrollHeight > scrollArea.clientHeight) {
                    scrollArea.scrollTop = scrollArea.scrollHeight;
                }
                fb.scrollIntoView({ behavior: 'auto', block: 'end' });
            };
            scrollToFeedback();
            // レイアウトが おちついた あとに もういちど（ふきだしの アニメーションたいさく）
            clearTimeout(feedbackTimer);
            feedbackTimer = setTimeout(scrollToFeedback, 80);
        };

        // ========================================
        // けっか がめん
        // ========================================
        const renderResult = () => {
            const perfect = correctCount === QUESTION_COUNT;
            let icon, message;
            if (perfect) {
                icon = '🏆';
                message = 'ぜんもん せいかい！えいよう はかせだね！';
            } else if (correctCount >= 7) {
                icon = '🌟';
                message = 'よく できました！あと すこしだよ！';
            } else if (correctCount >= 4) {
                icon = '😊';
                message = 'いい ちょうし！ずかんで もういちど みてみよう';
            } else {
                icon = '🌱';
                message = 'たべものずかんを みてから もういちど やってみよう';
            }

            if (perfect) {
                playFanfare();
                if (system.addScore) system.addScore(20);
            }

            container.innerHTML = `
                <div class="h-full flex flex-col p-4">
                    <div class="flex-1 flex flex-col items-center justify-center overflow-y-auto">
                        <div class="text-center animate-pop max-w-md w-full py-4">
                            <div class="text-7xl mb-3">${icon}</div>
                            <h2 class="text-3xl font-black text-gray-700 mb-2">${correctCount} / ${QUESTION_COUNT} もん せいかい</h2>
                            <p class="text-base font-bold text-gray-500 mb-2">${message}</p>
                            <p class="text-lg font-black text-yellow-500 mb-6">⭐ ${correctCount * 10 + (perfect ? 20 : 0)} こ ゲット！</p>

                            <div class="flex flex-col gap-3">
                                <button id="btn-retry" class="bg-red-400 hover:bg-red-500 text-white text-xl font-black py-4 rounded-2xl shadow-lg active:scale-95 transition">🔁 もういちど</button>
                                <button id="btn-other" class="bg-blue-400 hover:bg-blue-500 text-white text-xl font-black py-4 rounded-2xl shadow-lg active:scale-95 transition">🎯 ほかの クイズ</button>
                                <button id="btn-study-again" class="bg-green-400 hover:bg-green-500 text-white text-xl font-black py-4 rounded-2xl shadow-lg active:scale-95 transition">📖 たべものずかん</button>
                                <button id="btn-home" class="bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl active:scale-95 transition">✕ やめる</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-retry').onclick = () => startQuiz(quizType);
            container.querySelector('#btn-other').onclick = renderQuizSelect;
            container.querySelector('#btn-study-again').onclick = renderStudyGroups;
            container.querySelector('#btn-home').onclick = () => system.goHome();
        };

        // ========================================
        // きどう
        // ========================================
        renderMenu();

        // クリーンアップ
        return () => {
            clearTimeout(feedbackTimer);
            try { audioCtx?.close(); } catch (_) {}
            audioCtx = null;
        };
    }
};
