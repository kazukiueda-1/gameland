/**
 * さんすうマスター
 * 足し算・引き算・かけ算・わり算（各5段階レベル）
 * レベル1: 小1前半 〜 レベル5: 小3後半
 * 数字ボタンで回答入力
 */

export default {
    launch(container, system) {
        // ========================================
        // 状態管理
        // ========================================
        let mode = null; // 'add', 'sub', 'mul', 'div'
        let level = 1;   // 1〜5
        let currentQuestion = null;
        let userAnswer = '';
        let questionIndex = 0;
        let score = 0;
        let totalQuestions = 10;
        let hasAnswered = false;

        const modeNames = { add: 'たしざん', sub: 'ひきざん', mul: 'かけざん', div: 'わりざん' };
        const modeColors = {
            add: { bg: 'from-green-50 to-emerald-50', accent: 'green', border: 'green-300', btnFrom: 'green-400', btnTo: 'emerald-400', btnHoverFrom: 'green-500', btnHoverTo: 'emerald-500' },
            sub: { bg: 'from-orange-50 to-red-50', accent: 'orange', border: 'orange-300', btnFrom: 'orange-400', btnTo: 'red-400', btnHoverFrom: 'orange-500', btnHoverTo: 'red-500' },
            mul: { bg: 'from-purple-50 to-pink-50', accent: 'purple', border: 'purple-300', btnFrom: 'purple-400', btnTo: 'pink-400', btnHoverFrom: 'purple-500', btnHoverTo: 'pink-500' },
            div: { bg: 'from-cyan-50 to-blue-50', accent: 'cyan', border: 'cyan-300', btnFrom: 'cyan-400', btnTo: 'blue-400', btnHoverFrom: 'cyan-500', btnHoverTo: 'blue-500' }
        };
        const levelDescs = {
            add: [
                'ひとけた + ひとけた（こたえ 20まで）',
                'ふたけた + ひとけた',
                'ふたけた + ふたけた',
                'おおきな ふたけた + ふたけた',
                'さんけた + さんけた'
            ],
            sub: [
                'こたえが 0いじょう（20まで）',
                'ふたけた − ひとけた',
                'ふたけた − ふたけた',
                'さんけた − ふたけた',
                'さんけた − さんけた'
            ],
            mul: [
                'かんたんな かけざん（1〜5）',
                'くく（1〜9 × 1〜9）',
                'ふたけた × ひとけた（かんたん）',
                'ふたけた × ひとけた（むずかしい）',
                'ふたけた × ふたけた'
            ],
            div: [
                'わりきれる わりざん（くくの はんい）',
                'すこし おおきな わりざん',
                'こたえが ふたけた（10〜20）',
                'こたえが ふたけた（10〜30）',
                'もっと おおきな わりざん'
            ]
        };

        // ========================================
        // ユーティリティ: 範囲内のランダム整数
        // ========================================
        const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        // ========================================
        // 問題生成
        // ========================================
        const generateQuestion = () => {
            let a, b, answer, symbol;

            switch (mode) {
                case 'add':
                    symbol = '+';
                    switch (level) {
                        case 1: // 小1前半: 1桁+1桁, 答え≤20
                            a = randInt(1, 10);
                            b = randInt(1, 20 - a);
                            break;
                        case 2: // 小1後半〜小2: 2桁+1桁
                            a = randInt(10, 50);
                            b = randInt(1, 9);
                            break;
                        case 3: // 小2: 2桁+2桁
                            a = randInt(10, 50);
                            b = randInt(10, 50);
                            break;
                        case 4: // 小2後半: 大きな2桁+2桁
                            a = randInt(20, 99);
                            b = randInt(10, 99);
                            break;
                        case 5: // 小3: 3桁+3桁
                            a = randInt(100, 500);
                            b = randInt(100, 500);
                            break;
                    }
                    answer = a + b;
                    break;

                case 'sub':
                    symbol = '−';
                    switch (level) {
                        case 1: // 小1: 20以内の引き算
                            a = randInt(5, 19);
                            b = randInt(1, a - 1);
                            break;
                        case 2: // 小1後半〜小2: 2桁−1桁
                            a = randInt(20, 50);
                            b = randInt(1, 9);
                            break;
                        case 3: // 小2: 2桁−2桁
                            a = randInt(30, 99);
                            b = randInt(10, a - 1);
                            break;
                        case 4: // 小2後半〜小3: 3桁−2桁
                            a = randInt(100, 300);
                            b = randInt(10, 99);
                            break;
                        case 5: // 小3: 3桁−3桁
                            a = randInt(200, 999);
                            b = randInt(100, a - 1);
                            break;
                    }
                    answer = a - b;
                    break;

                case 'mul':
                    symbol = '×';
                    switch (level) {
                        case 1: // 小2前半: かんたんな九九 1〜5
                            a = randInt(1, 5);
                            b = randInt(1, 5);
                            break;
                        case 2: // 小2: 九九全体 1〜9
                            a = randInt(1, 9);
                            b = randInt(1, 9);
                            break;
                        case 3: // 小3前半: 2桁×1桁（かんたん）
                            a = randInt(11, 19);
                            b = randInt(2, 5);
                            break;
                        case 4: // 小3: 2桁×1桁（むずかしい）
                            a = randInt(12, 30);
                            b = randInt(2, 9);
                            break;
                        case 5: // 小3後半: 2桁×2桁
                            a = randInt(11, 25);
                            b = randInt(11, 20);
                            break;
                    }
                    answer = a * b;
                    break;

                case 'div':
                    symbol = '÷';
                    switch (level) {
                        case 1: // 小3前半: 九九の範囲で割り切れる
                            b = randInt(2, 9);
                            answer = randInt(1, 9);
                            a = b * answer;
                            break;
                        case 2: // 少し大きめ
                            b = randInt(2, 9);
                            answer = randInt(2, 15);
                            a = b * answer;
                            break;
                        case 3: // 答えが2桁（10〜20）
                            b = randInt(2, 9);
                            answer = randInt(10, 20);
                            a = b * answer;
                            break;
                        case 4: // 答えが2桁（10〜30）
                            b = randInt(2, 9);
                            answer = randInt(10, 30);
                            a = b * answer;
                            break;
                        case 5: // もっと大きな割り算
                            b = randInt(2, 9);
                            answer = randInt(11, 50);
                            a = b * answer;
                            break;
                    }
                    break;
            }

            return { a, b, answer, symbol };
        };

        // 答えの最大桁数（レベルに応じて変動）
        const getMaxDigits = () => {
            if (level <= 2) return 3;
            return 4;
        };

        // 問題表示のフォントサイズ（大きい数字は小さめに）
        const getQuestionFontSize = () => {
            if (level >= 4) return 'text-2xl md:text-3xl';
            if (level >= 3) return 'text-3xl md:text-4xl';
            return 'text-4xl md:text-5xl';
        };

        // ========================================
        // 描画: モード選択
        // ========================================
        const renderModeSelect = () => {
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-3 bg-gradient-to-b from-blue-100 to-purple-100">
                    <button id="btn-quit" class="absolute top-3 left-3 bg-white/80 text-gray-500 font-bold py-1.5 px-3 rounded-full text-sm">
                        ✕ やめる
                    </button>

                    <div class="text-5xl md:text-6xl mb-2">🔢</div>
                    <h1 class="text-2xl md:text-3xl font-black text-blue-600 mb-1 text-center">
                        さんすうマスター
                    </h1>
                    <p class="text-gray-600 font-bold mb-4 text-center text-sm">
                        どれに チャレンジする？
                    </p>

                    <div class="flex flex-col gap-3 w-full max-w-sm">
                        <button id="btn-add" class="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-black text-xl md:text-2xl py-4 px-6 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                            <span class="text-2xl">➕</span> たしざん
                        </button>
                        <button id="btn-sub" class="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-black text-xl md:text-2xl py-4 px-6 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                            <span class="text-2xl">➖</span> ひきざん
                        </button>
                        <button id="btn-mul" class="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xl md:text-2xl py-4 px-6 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                            <span class="text-2xl">✖️</span> かけざん
                        </button>
                        <button id="btn-div" class="bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xl md:text-2xl py-4 px-6 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                            <span class="text-2xl">➗</span> わりざん
                        </button>
                    </div>
                </div>
            `;

            container.querySelector('#btn-quit').onclick = () => system.goHome();
            container.querySelector('#btn-add').onclick = () => selectMode('add');
            container.querySelector('#btn-sub').onclick = () => selectMode('sub');
            container.querySelector('#btn-mul').onclick = () => selectMode('mul');
            container.querySelector('#btn-div').onclick = () => selectMode('div');
        };

        // ========================================
        // 描画: レベル選択
        // ========================================
        const selectMode = (selectedMode) => {
            mode = selectedMode;
            renderLevelSelect();
        };

        const renderLevelSelect = () => {
            const colors = modeColors[mode];
            const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-3 bg-gradient-to-b ${colors.bg}">
                    <button id="btn-back" class="absolute top-3 left-3 bg-white/80 text-gray-500 font-bold py-1.5 px-3 rounded-full text-sm">
                        ← もどる
                    </button>

                    <h2 class="text-xl md:text-2xl font-black text-${colors.accent}-600 mb-1 text-center">
                        ${modeNames[mode]}
                    </h2>
                    <p class="text-gray-600 font-bold mb-3 text-center text-sm">
                        レベルを えらぼう！
                    </p>

                    <div class="flex flex-col gap-2 w-full max-w-sm">
                        ${[1,2,3,4,5].map(lv => `
                            <button class="level-btn bg-white hover:bg-${colors.accent}-50 border-2 border-${colors.border} rounded-2xl py-3 px-4 shadow-md active:scale-95 transition text-left" data-level="${lv}">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <span class="font-black text-lg text-${colors.accent}-600">Lv.${lv}</span>
                                        <span class="text-yellow-500 ml-2 text-sm">${stars(lv)}</span>
                                    </div>
                                </div>
                                <p class="text-gray-500 text-xs font-bold mt-0.5">${levelDescs[mode][lv - 1]}</p>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            container.querySelector('#btn-back').onclick = () => renderModeSelect();
            container.querySelectorAll('.level-btn').forEach(btn => {
                btn.onclick = () => startQuiz(parseInt(btn.dataset.level));
            });
        };

        // ========================================
        // クイズ開始
        // ========================================
        const startQuiz = (selectedLevel) => {
            level = selectedLevel;
            questionIndex = 0;
            score = 0;
            nextQuestion();
        };

        const nextQuestion = () => {
            if (questionIndex >= totalQuestions) {
                renderResult();
                return;
            }
            currentQuestion = generateQuestion();
            userAnswer = '';
            hasAnswered = false;
            renderQuestion();
        };

        // ========================================
        // 描画: 問題画面
        // ========================================
        const renderQuestion = () => {
            const colors = modeColors[mode];
            const fontSize = getQuestionFontSize();

            container.innerHTML = `
                <div class="h-full flex flex-col p-2 bg-gradient-to-b ${colors.bg}">
                    <!-- ヘッダー -->
                    <div class="flex justify-between items-center mb-1">
                        <button id="btn-quit" class="bg-white/80 text-gray-400 font-bold py-1 px-2 rounded-full text-xs">
                            やめる
                        </button>
                        <div class="bg-${colors.accent}-100 text-${colors.accent}-600 px-3 py-1 rounded-full font-bold text-sm">
                            ${modeNames[mode]} Lv.${level} ${questionIndex + 1}/${totalQuestions}
                        </div>
                        <div class="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-bold text-sm">
                            ⭐ ${score}
                        </div>
                    </div>

                    <!-- 問題エリア -->
                    <div class="flex-1 flex flex-col items-center justify-center">
                        <!-- 問題表示 -->
                        <div class="bg-white rounded-2xl p-4 shadow-xl border-4 border-${colors.border} mb-2 text-center min-w-[260px]">
                            <div class="${fontSize} font-black text-gray-800 mb-2">
                                ${currentQuestion.a} ${currentQuestion.symbol} ${currentQuestion.b} = ?
                            </div>

                            <!-- 回答表示 -->
                            <div class="bg-gray-100 rounded-xl px-4 py-2 min-h-[50px] flex items-center justify-center">
                                <span class="text-3xl md:text-4xl font-black ${userAnswer ? 'text-blue-600' : 'text-gray-300'}">
                                    ${userAnswer || '?'}
                                </span>
                            </div>
                        </div>

                        <!-- 数字ボタン -->
                        <div class="grid grid-cols-3 gap-2 w-full max-w-[240px] mb-2">
                            ${[1,2,3,4,5,6,7,8,9].map(n => `
                                <button class="num-btn bg-white hover:bg-blue-50 text-2xl md:text-3xl font-black text-gray-700 py-3 rounded-xl shadow-md border-2 border-gray-200 active:scale-95 transition" data-num="${n}">
                                    ${n}
                                </button>
                            `).join('')}
                            <button id="btn-clear" class="bg-gray-200 hover:bg-gray-300 text-base font-bold text-gray-600 py-3 rounded-xl shadow-md active:scale-95 transition">
                                けす
                            </button>
                            <button class="num-btn bg-white hover:bg-blue-50 text-2xl md:text-3xl font-black text-gray-700 py-3 rounded-xl shadow-md border-2 border-gray-200 active:scale-95 transition" data-num="0">
                                0
                            </button>
                            <button id="btn-submit" class="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white text-base font-bold py-3 rounded-xl shadow-md active:scale-95 transition ${!userAnswer ? 'opacity-50' : ''}">
                                こたえ
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 結果オーバーレイ -->
                <div id="result-overlay" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-3xl p-8 mx-4 text-center shadow-2xl max-w-sm w-full">
                        <div id="result-emoji" class="text-5xl mb-2"></div>
                        <h3 id="result-text" class="text-3xl font-black mb-3"></h3>
                        <p id="result-detail" class="text-xl text-gray-600 font-bold mb-5"></p>
                        <button id="btn-next" class="bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold text-xl py-3 px-8 rounded-full shadow-lg">
                            つぎへ →
                        </button>
                    </div>
                </div>
            `;

            setupQuestionListeners();
        };

        // ========================================
        // イベントリスナー
        // ========================================
        const setupQuestionListeners = () => {
            container.querySelector('#btn-quit').onclick = () => renderLevelSelect();

            // 数字ボタン
            container.querySelectorAll('.num-btn').forEach(btn => {
                btn.onclick = () => {
                    if (hasAnswered) return;
                    const maxDigits = getMaxDigits();
                    if (userAnswer.length < maxDigits) {
                        userAnswer += btn.dataset.num;
                        updateAnswerDisplay();
                    }
                };
            });

            // クリアボタン
            container.querySelector('#btn-clear').onclick = () => {
                if (hasAnswered) return;
                userAnswer = '';
                updateAnswerDisplay();
            };

            // 回答ボタン
            container.querySelector('#btn-submit').onclick = () => {
                if (hasAnswered || !userAnswer) return;
                checkAnswer();
            };
        };

        const updateAnswerDisplay = () => {
            const answerEl = container.querySelector('.bg-gray-100 span');
            const submitBtn = container.querySelector('#btn-submit');

            if (answerEl) {
                answerEl.textContent = userAnswer || '?';
                answerEl.className = `text-3xl md:text-4xl font-black ${userAnswer ? 'text-blue-600' : 'text-gray-300'}`;
            }

            if (submitBtn) {
                if (userAnswer) {
                    submitBtn.classList.remove('opacity-50');
                } else {
                    submitBtn.classList.add('opacity-50');
                }
            }
        };

        // ========================================
        // 回答チェック
        // ========================================
        const checkAnswer = () => {
            hasAnswered = true;
            const isCorrect = parseInt(userAnswer) === currentQuestion.answer;

            // ログ記録
            if (system.logQuizResult) {
                system.logQuizResult('さんすうマスター',
                    `${currentQuestion.a}${currentQuestion.symbol}${currentQuestion.b}`,
                    isCorrect, {
                        mode: modeNames[mode],
                        level: level,
                        answer: currentQuestion.answer,
                        userAnswer: parseInt(userAnswer)
                    }
                );
            }

            const overlay = container.querySelector('#result-overlay');
            const resultEmoji = container.querySelector('#result-emoji');
            const resultText = container.querySelector('#result-text');
            const resultDetail = container.querySelector('#result-detail');

            if (isCorrect) {
                score += 10;
                resultEmoji.textContent = '🎉';
                resultText.textContent = 'せいかい！';
                resultText.className = 'text-3xl font-black mb-3 text-green-500';
                resultDetail.textContent = `${currentQuestion.a} ${currentQuestion.symbol} ${currentQuestion.b} = ${currentQuestion.answer}`;
                system.playSound('correct');
            } else {
                resultEmoji.textContent = '😢';
                resultText.textContent = 'ざんねん...';
                resultText.className = 'text-3xl font-black mb-3 text-red-400';
                resultDetail.innerHTML = `こたえは <span class="text-blue-600">${currentQuestion.answer}</span> だよ`;
                system.playSound('wrong');
            }

            overlay.classList.remove('hidden');

            container.querySelector('#btn-next').onclick = () => {
                questionIndex++;
                nextQuestion();
            };
        };

        // ========================================
        // 結果画面
        // ========================================
        const renderResult = () => {
            const maxScore = totalQuestions * 10;
            const percentage = Math.round((score / maxScore) * 100);

            let emoji, message;
            if (percentage === 100) {
                emoji = '🏆';
                message = 'パーフェクト！<br>さんすうの てんさい！';
            } else if (percentage >= 80) {
                emoji = '🌟';
                message = 'すごい！<br>よくできました！';
            } else if (percentage >= 60) {
                emoji = '😊';
                message = 'いいね！<br>もうすこし がんばろう！';
            } else {
                emoji = '🌱';
                message = 'がんばったね！<br>れんしゅう しよう！';
            }

            const colors = modeColors[mode];

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-3 bg-gradient-to-b from-blue-100 to-purple-100 text-center">
                    <div class="text-5xl mb-2">${emoji}</div>
                    <h2 class="text-2xl font-black text-blue-600 mb-1">${modeNames[mode]} Lv.${level} おしまい！</h2>
                    <p class="text-yellow-500 font-bold text-sm mb-2">${'★'.repeat(level)}${'☆'.repeat(5 - level)}</p>

                    <div class="bg-white rounded-2xl p-4 shadow-xl mb-3 w-full max-w-sm">
                        <p class="text-gray-500 font-bold mb-1 text-sm">スコア</p>
                        <p class="text-4xl font-black text-orange-500 mb-1">${score}</p>
                        <p class="text-gray-400 font-bold text-sm">/ ${maxScore} てん</p>
                    </div>

                    <p class="text-base font-bold text-gray-600 mb-4">${message}</p>

                    <div class="flex flex-col gap-2 w-full max-w-xs">
                        <button id="btn-retry" class="bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold text-lg py-3 rounded-full shadow-lg">
                            🔄 もういちど
                        </button>
                        <button id="btn-level" class="bg-gradient-to-r from-${colors.btnFrom} to-${colors.btnTo} text-white font-bold text-lg py-3 rounded-full shadow-lg">
                            📊 レベルを かえる
                        </button>
                        <button id="btn-change" class="bg-white text-gray-600 font-bold text-lg py-3 rounded-full shadow-md border-2 border-gray-200">
                            🔢 べつの もんだい
                        </button>
                        <button id="btn-home" class="bg-gray-100 text-gray-500 font-bold text-base py-2 rounded-full">
                            🏠 ホームにもどる
                        </button>
                    </div>
                </div>
            `;

            system.addScore(score);

            container.querySelector('#btn-retry').onclick = () => startQuiz(level);
            container.querySelector('#btn-level').onclick = () => renderLevelSelect();
            container.querySelector('#btn-change').onclick = () => renderModeSelect();
            container.querySelector('#btn-home').onclick = () => system.goHome();
        };

        // 開始
        renderModeSelect();

        return () => {};
    }
};
