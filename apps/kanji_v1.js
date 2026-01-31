export default {
    /**
     * アプリ起動関数
     * @param {HTMLElement} container
     * @param {Object} system
     */
    launch(container, system) {
        // ---------------------------------------------------------
        // 1. データ定義 (小学1年生の漢字80字)
        // ---------------------------------------------------------
        const kanjiData = [
            {k:"一", r:"いち"}, {k:"右", r:"みぎ"}, {k:"雨", r:"あめ"}, {k:"円", r:"えん"}, 
            {k:"王", r:"おう"}, {k:"音", r:"おと"}, {k:"下", r:"した"}, {k:"火", r:"ひ"}, 
            {k:"花", r:"はな"}, {k:"貝", r:"かい"}, {k:"学", r:"がく"}, {k:"気", r:"き"}, 
            {k:"九", r:"きゅう"}, {k:"休", r:"やすみ"}, {k:"玉", r:"たま"}, {k:"金", r:"きん"}, 
            {k:"空", r:"そら"}, {k:"月", r:"つき"}, {k:"犬", r:"いぬ"}, {k:"見", r:"み"}, 
            {k:"口", r:"くち"}, {k:"校", r:"こう"}, {k:"左", r:"ひだり"}, {k:"三", r:"さん"}, 
            {k:"山", r:"やま"}, {k:"子", r:"こ"}, {k:"四", r:"よん"}, {k:"糸", r:"いと"}, 
            {k:"字", r:"じ"}, {k:"耳", r:"みみ"}, {k:"七", r:"なな"}, {k:"車", r:"くるま"}, 
            {k:"手", r:"て"}, {k:"十", r:"じゅう"}, {k:"出", r:"で"}, {k:"女", r:"おんな"}, 
            {k:"小", r:"ちい"}, {k:"上", r:"うえ"}, {k:"森", r:"もり"}, {k:"人", r:"ひと"}, 
            {k:"水", r:"みず"}, {k:"正", r:"ただ"}, {k:"生", r:"いき"}, {k:"青", r:"あお"}, 
            {k:"夕", r:"ゆう"}, {k:"石", r:"いし"}, {k:"赤", r:"あか"}, {k:"千", r:"せん"}, 
            {k:"川", r:"かわ"}, {k:"先", r:"さき"}, {k:"早", r:"はや"}, {k:"草", r:"くさ"}, 
            {k:"足", r:"あし"}, {k:"村", r:"むら"}, {k:"大", r:"おお"}, {k:"男", r:"おとこ"}, 
            {k:"竹", r:"たけ"}, {k:"中", r:"なか"}, {k:"虫", r:"むし"}, {k:"町", r:"まち"}, 
            {k:"天", r:"てん"}, {k:"田", r:"た"}, {k:"土", r:"つち"}, {k:"二", r:"に"}, 
            {k:"日", r:"ひ"}, {k:"入", r:"いり"}, {k:"年", r:"とし"}, {k:"白", r:"しろ"}, 
            {k:"八", r:"はち"}, {k:"百", r:"ひゃく"}, {k:"文", r:"ぶん"}, {k:"木", r:"き"}, 
            {k:"本", r:"ほん"}, {k:"名", r:"な"}, {k:"目", r:"め"}, {k:"立", r:"た"}, 
            {k:"力", r:"ちから"}, {k:"林", r:"はやし"}, {k:"六", r:"ろく"}, {k:"五", r:"ご"}
        ];

        // ---------------------------------------------------------
        // 2. 状態管理
        // ---------------------------------------------------------
        const QUESTIONS_PER_LEVEL = 10;
        const NUM_LEVELS = Math.ceil(kanjiData.length / QUESTIONS_PER_LEVEL);
        
        let currentLevel = 0;   // 0-7
        let quizQuestions = []; // クイズ用の問題リスト
        let quizIndex = 0;      // 現在の問題番号
        let score = 0;          // 現在のスコア
        let hasMistaken = false;// 現在の問題で間違えたか

        // 配列シャッフル用ユーティリティ
        const shuffle = (array) => {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        // ---------------------------------------------------------
        // 3. 画面レンダリング関数群
        // ---------------------------------------------------------

        // ★ レベル選択画面 (最初に表示)
        const renderLevelSelect = () => {
            let buttonsHtml = '';
            for (let i = 0; i < NUM_LEVELS; i++) {
                buttonsHtml += `
                    <button class="level-btn bg-orange-400 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-md active:scale-95 transition text-xl" data-level="${i}">
                        レベル ${i + 1}
                    </button>
                `;
            }

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-4">
                    <button id="btn-quit-app" class="absolute top-4 left-4 bg-gray-100 text-gray-500 font-bold py-2 px-4 rounded-full text-sm">✕ やめる</button>
                    
                    <h2 class="text-3xl md:text-4xl font-black text-blue-500 mb-2 text-center">かんじマスター</h2>
                    <p class="text-gray-500 font-bold mb-8">どの レベル に チャレンジ する？</p>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                        ${buttonsHtml}
                    </div>
                </div>
            `;

            container.querySelector('#btn-quit-app').onclick = () => system.goHome();
            container.querySelectorAll('.level-btn').forEach(btn => {
                btn.onclick = () => {
                    currentLevel = parseInt(btn.dataset.level);
                    renderModeSelect();
                };
            });
        };

        // ★ モード選択画面 (べんきょう or クイズ)
        const renderModeSelect = () => {
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-4 animate-pop">
                    <h2 class="text-3xl font-black text-orange-400 mb-2">レベル ${currentLevel + 1}</h2>
                    <p class="text-gray-500 font-bold mb-8">なに を する？</p>
                    
                    <div class="flex flex-col md:flex-row gap-6 w-full max-w-lg justify-center">
                        <button id="btn-study" class="bg-green-400 hover:bg-green-500 text-white text-2xl font-bold py-6 px-8 rounded-3xl shadow-lg active:scale-95 transition flex-1">
                            📖 べんきょう
                        </button>
                        <button id="btn-quiz" class="bg-blue-400 hover:bg-blue-500 text-white text-2xl font-bold py-6 px-8 rounded-3xl shadow-lg active:scale-95 transition flex-1">
                            🔥 クイズ
                        </button>
                    </div>

                    <button id="btn-back" class="mt-12 bg-gray-200 text-gray-600 font-bold py-3 px-8 rounded-full">
                        レベルをえらぶ
                    </button>
                </div>
            `;

            container.querySelector('#btn-study').onclick = renderStudyMode;
            container.querySelector('#btn-quiz').onclick = startQuiz;
            container.querySelector('#btn-back').onclick = renderLevelSelect;
        };

        // ★ べんきょうモード
        const renderStudyMode = () => {
            const start = currentLevel * QUESTIONS_PER_LEVEL;
            const end = start + QUESTIONS_PER_LEVEL;
            const targetKanji = kanjiData.slice(start, end);

            const cardsHtml = targetKanji.map(item => `
                <div class="bg-white border-4 border-sky-200 rounded-3xl p-4 flex flex-col items-center justify-center aspect-square shadow-sm">
                    <div class="text-6xl font-black text-gray-800 mb-2">${item.k}</div>
                    <div class="text-xl font-bold text-gray-500">${item.r}</div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="h-full flex flex-col p-4">
                    <div class="flex justify-between items-center mb-4">
                        <button id="btn-back-mode" class="bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-full text-sm">◀ もどる</button>
                        <h2 class="text-xl font-bold text-green-500">レベル ${currentLevel + 1} の かんじ</h2>
                        <div class="w-16"></div> <!-- Spacer -->
                    </div>
                    
                    <div class="flex-1 overflow-y-auto">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                            ${cardsHtml}
                        </div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-back-mode').onclick = renderModeSelect;
        };

        // ★ クイズ開始処理
        const startQuiz = () => {
            const start = currentLevel * QUESTIONS_PER_LEVEL;
            const end = start + QUESTIONS_PER_LEVEL;
            const targetKanji = kanjiData.slice(start, end);
            
            // クイズ用にシャッフル
            quizQuestions = shuffle([...targetKanji]);
            quizIndex = 0;
            score = 0;
            renderQuizQuestion();
        };

        // ★ クイズ出題画面
        const renderQuizQuestion = () => {
            if (quizIndex >= quizQuestions.length) {
                renderResult();
                return;
            }

            hasMistaken = false; // 間違いフラグリセット
            const q = quizQuestions[quizIndex];
            
            // 選択肢生成ロジック (正解1 + 不正解3)
            // 読みが重複しないように他から選ぶ
            let distractors = [];
            const candidates = shuffle(kanjiData.filter(k => k.r !== q.r));
            const usedReadings = new Set([q.r]);
            
            for (const c of candidates) {
                if (!usedReadings.has(c.r)) {
                    distractors.push(c);
                    usedReadings.add(c.r);
                    if (distractors.length >= 3) break;
                }
            }
            
            const choices = shuffle([q, ...distractors]);

            container.innerHTML = `
                <div class="h-full flex flex-col p-4 relative">
                    <!-- ヘッダー -->
                    <div class="flex justify-between items-center mb-4">
                        <button id="btn-quit-quiz" class="bg-gray-100 text-gray-400 font-bold py-2 px-4 rounded-full text-sm">やめる</button>
                        <div class="bg-blue-100 text-blue-500 px-4 py-1 rounded-full font-bold">
                            あと ${quizQuestions.length - quizIndex} もん
                        </div>
                        <div class="font-bold text-orange-400">てんすう: ${score}</div>
                    </div>

                    <!-- 問題エリア -->
                    <div class="flex-1 flex flex-col items-center justify-center mb-4 relative">
                        <div class="bg-yellow-50 border-4 border-yellow-200 rounded-3xl p-8 w-full max-w-md text-center shadow-sm relative z-10">
                            <p class="text-brown-500 font-bold text-sm mb-2">この かんじ の よみかた は？</p>
                            <h2 class="text-8xl md:text-9xl font-black text-gray-800">${q.k}</h2>
                        </div>
                        
                        <!-- オーバーレイ (正解/不正解表示用) -->
                        <div id="feedback-overlay" class="absolute inset-0 bg-white/95 rounded-3xl z-50 hidden flex-col items-center justify-center animate-pop">
                            <div id="fb-mark" class="text-9xl font-black mb-4"></div>
                            <div id="fb-text" class="text-2xl font-bold text-gray-700 text-center px-4"></div>
                        </div>
                    </div>

                    <!-- 選択肢エリア -->
                    <div class="grid grid-cols-2 gap-3 h-1/3">
                        ${choices.map(c => `
                            <button class="choice-btn bg-white border-b-4 border-green-200 hover:bg-green-50 text-2xl md:text-3xl font-bold text-gray-600 rounded-2xl shadow-sm active:border-b-0 active:translate-y-1 transition-all"
                                data-reading="${c.r}" data-kanji="${c.k}">
                                ${c.r}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            container.querySelector('#btn-quit-quiz').onclick = renderModeSelect;

            container.querySelectorAll('.choice-btn').forEach(btn => {
                btn.onclick = () => checkAnswer(btn.dataset.reading, q.r, btn.dataset.kanji);
            });
        };

        // ★ 答え合わせロジック
        const checkAnswer = (selectedReading, correctReading, selectedKanji) => {
            const overlay = document.getElementById('feedback-overlay');
            const fbMark = document.getElementById('fb-mark');
            const fbText = document.getElementById('fb-text');

            if (!overlay || overlay.style.display === 'flex') return; // 連打防止

            overlay.style.display = 'flex'; // 表示
            const q = quizQuestions[quizIndex];
            const isCorrect = selectedReading === correctReading;

            // クイズログを記録
            if (system.logQuizResult) {
                system.logQuizResult('かんじマスター', q.k, isCorrect, {
                    reading: q.r,
                    selected: selectedReading,
                    level: currentLevel + 1
                });
            }

            if (isCorrect) {
                // 正解
                fbMark.textContent = '◎';
                fbMark.className = 'text-9xl font-black mb-4 text-red-500';
                fbText.innerHTML = '';
                system.playSound('correct');

                if (!hasMistaken) {
                    score += 10;
                }

                setTimeout(() => {
                    quizIndex++;
                    renderQuizQuestion();
                }, 1200);

            } else {
                // 不正解
                hasMistaken = true;
                fbMark.textContent = '×';
                fbMark.className = 'text-9xl font-black mb-4 text-blue-500';
                // 親切なフィードバック
                fbText.innerHTML = `それは <span class="text-4xl text-blue-500 mx-1">${selectedKanji}</span> の<br>よみかた だよ`;
                system.playSound('wrong');

                setTimeout(() => {
                    overlay.style.display = 'none'; // 問題に戻る
                }, 2500);
            }
        };

        // ★ 結果画面
        const renderResult = () => {
            let comment = "";
            let emoji = "";
            if (score === 100) {
                comment = "パーフェクト！<br>かんじは バッチリだね！";
                emoji = "🏆";
            } else if (score >= 80) {
                comment = "すごい！<br>そのちょうし！";
                emoji = "🥈";
            } else {
                comment = "がんばったね！<br>べんきょうモードで<br>ふくしゅう しよう！";
                emoji = "🍀";
            }

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-4 text-center animate-pop">
                    <div class="text-8xl mb-4">${emoji}</div>
                    <h2 class="text-3xl font-black text-blue-500 mb-2">おしまい！</h2>
                    <p class="text-gray-500 font-bold text-xl mb-6">てんすう: <span class="text-4xl text-orange-500">${score}</span> てん</p>
                    
                    <div class="bg-blue-50 rounded-2xl p-6 mb-8 w-full max-w-sm">
                        <p class="text-lg font-bold text-gray-600 leading-relaxed">${comment}</p>
                    </div>

                    <button id="btn-retry" class="w-full max-w-sm bg-orange-400 text-white font-bold py-3 rounded-full shadow-md mb-3 text-lg">
                        もういちど
                    </button>
                    <button id="btn-home" class="w-full max-w-sm bg-gray-200 text-gray-600 font-bold py-3 rounded-full shadow-sm text-lg">
                        レベルをえらぶ
                    </button>
                </div>
            `;
            
            // 効果音
            if(score >= 80) system.playSound('correct');

            // リトライボタン
            container.querySelector('#btn-retry').onclick = startQuiz;
            
            // ホーム（レベル選択）へ戻る
            container.querySelector('#btn-home').onclick = () => {
                // スコアをシステムに保存してから戻る
                system.addScore(score);
                renderLevelSelect();
            };
        };

        // ---------------------------------------------------------
        // 4. アプリ起動
        // ---------------------------------------------------------
        renderLevelSelect();

        // クリーンアップ関数
        return () => {
            // 特にタイマーなどは使っていないので空でOK
        };
    }
};