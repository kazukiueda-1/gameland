/**
 * さんすうマスター
 * 小学1年生レベルの足し算・引き算・かけ算
 * 数字ボタンで回答入力
 */

export default {
    launch(container, system) {
        // ========================================
        // 状態管理
        // ========================================
        let mode = null; // 'add', 'sub', 'mul'
        let currentQuestion = null;
        let userAnswer = '';
        let questionIndex = 0;
        let score = 0;
        let totalQuestions = 10;
        let hasAnswered = false;

        // ========================================
        // 問題生成
        // ========================================
        const generateQuestion = () => {
            let a, b, answer, symbol;

            switch (mode) {
                case 'add': // 足し算: 答えが20以下
                    a = Math.floor(Math.random() * 10) + 1;
                    b = Math.floor(Math.random() * (20 - a)) + 1;
                    answer = a + b;
                    symbol = '+';
                    break;

                case 'sub': // 引き算: 答えが0以上
                    a = Math.floor(Math.random() * 15) + 5;
                    b = Math.floor(Math.random() * a) + 1;
                    answer = a - b;
                    symbol = '−';
                    break;

                case 'mul': // かけ算: 1〜5の範囲
                    a = Math.floor(Math.random() * 5) + 1;
                    b = Math.floor(Math.random() * 5) + 1;
                    answer = a * b;
                    symbol = '×';
                    break;
            }

            return { a, b, answer, symbol };
        };

        // ========================================
        // 描画: モード選択
        // ========================================
        const renderModeSelect = () => {
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100">
                    <button id="btn-quit" class="absolute top-3 left-3 bg-white/80 text-gray-500 font-bold py-1.5 px-3 rounded-full text-sm">
                        ✕ やめる
                    </button>

                    <div class="text-7xl mb-4">🔢</div>
                    <h1 class="text-3xl md:text-4xl font-black text-blue-600 mb-2 text-center">
                        さんすうマスター
                    </h1>
                    <p class="text-gray-600 font-bold mb-6 text-center">
                        どれに チャレンジする？
                    </p>

                    <div class="flex flex-col gap-4 w-full max-w-sm">
                        <button id="btn-add" class="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-black text-2xl py-5 px-8 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                            <span class="text-3xl">➕</span> たしざん
                        </button>
                        <button id="btn-sub" class="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-black text-2xl py-5 px-8 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                            <span class="text-3xl">➖</span> ひきざん
                        </button>
                        <button id="btn-mul" class="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-black text-2xl py-5 px-8 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                            <span class="text-3xl">✖️</span> かけざん
                        </button>
                    </div>
                </div>
            `;

            container.querySelector('#btn-quit').onclick = () => system.goHome();
            container.querySelector('#btn-add').onclick = () => startQuiz('add');
            container.querySelector('#btn-sub').onclick = () => startQuiz('sub');
            container.querySelector('#btn-mul').onclick = () => startQuiz('mul');
        };

        // ========================================
        // クイズ開始
        // ========================================
        const startQuiz = (selectedMode) => {
            mode = selectedMode;
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
            const modeColors = {
                add: { bg: 'from-green-50 to-emerald-50', accent: 'green', border: 'green-300' },
                sub: { bg: 'from-orange-50 to-red-50', accent: 'orange', border: 'orange-300' },
                mul: { bg: 'from-purple-50 to-pink-50', accent: 'purple', border: 'purple-300' }
            };
            const colors = modeColors[mode];
            const modeNames = { add: 'たしざん', sub: 'ひきざん', mul: 'かけざん' };

            container.innerHTML = `
                <div class="h-full flex flex-col p-3 bg-gradient-to-b ${colors.bg}">
                    <!-- ヘッダー -->
                    <div class="flex justify-between items-center mb-2">
                        <button id="btn-quit" class="bg-white/80 text-gray-400 font-bold py-1.5 px-3 rounded-full text-sm">
                            やめる
                        </button>
                        <div class="bg-${colors.accent}-100 text-${colors.accent}-600 px-4 py-1.5 rounded-full font-bold">
                            ${modeNames[mode]} ${questionIndex + 1}/${totalQuestions}
                        </div>
                        <div class="bg-yellow-100 text-yellow-600 px-4 py-1.5 rounded-full font-bold">
                            ⭐ ${score}
                        </div>
                    </div>

                    <!-- 問題エリア -->
                    <div class="flex-1 flex flex-col items-center justify-center">
                        <!-- 問題表示 -->
                        <div class="bg-white rounded-3xl p-6 shadow-xl border-4 border-${colors.border} mb-4 text-center min-w-[280px]">
                            <div class="text-5xl md:text-6xl font-black text-gray-800 mb-4">
                                ${currentQuestion.a} ${currentQuestion.symbol} ${currentQuestion.b} = ?
                            </div>

                            <!-- 回答表示 -->
                            <div class="bg-gray-100 rounded-xl px-6 py-4 min-h-[60px] flex items-center justify-center">
                                <span class="text-4xl md:text-5xl font-black ${userAnswer ? 'text-blue-600' : 'text-gray-300'}">
                                    ${userAnswer || '?'}
                                </span>
                            </div>
                        </div>

                        <!-- 数字ボタン -->
                        <div class="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-xs mb-4">
                            ${[1,2,3,4,5,6,7,8,9].map(n => `
                                <button class="num-btn bg-white hover:bg-blue-50 text-3xl md:text-4xl font-black text-gray-700 py-4 rounded-2xl shadow-md border-3 border-gray-200 active:scale-95 transition" data-num="${n}">
                                    ${n}
                                </button>
                            `).join('')}
                            <button id="btn-clear" class="bg-gray-200 hover:bg-gray-300 text-xl font-bold text-gray-600 py-4 rounded-2xl shadow-md active:scale-95 transition">
                                けす
                            </button>
                            <button class="num-btn bg-white hover:bg-blue-50 text-3xl md:text-4xl font-black text-gray-700 py-4 rounded-2xl shadow-md border-3 border-gray-200 active:scale-95 transition" data-num="0">
                                0
                            </button>
                            <button id="btn-submit" class="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white text-xl font-bold py-4 rounded-2xl shadow-md active:scale-95 transition ${!userAnswer ? 'opacity-50' : ''}">
                                こたえ
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 結果オーバーレイ -->
                <div id="result-overlay" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-3xl p-8 mx-4 text-center shadow-2xl max-w-sm w-full">
                        <div id="result-emoji" class="text-7xl mb-3"></div>
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
            container.querySelector('#btn-quit').onclick = () => renderModeSelect();

            // 数字ボタン
            container.querySelectorAll('.num-btn').forEach(btn => {
                btn.onclick = () => {
                    if (hasAnswered) return;
                    if (userAnswer.length < 3) { // 最大3桁
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
                answerEl.className = `text-4xl md:text-5xl font-black ${userAnswer ? 'text-blue-600' : 'text-gray-300'}`;
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
                const modeNames = { add: 'たしざん', sub: 'ひきざん', mul: 'かけざん' };
                system.logQuizResult('さんすうマスター',
                    `${currentQuestion.a}${currentQuestion.symbol}${currentQuestion.b}`,
                    isCorrect, {
                        mode: modeNames[mode],
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
            const modeNames = { add: 'たしざん', sub: 'ひきざん', mul: 'かけざん' };

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

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100 text-center">
                    <div class="text-7xl mb-3">${emoji}</div>
                    <h2 class="text-3xl font-black text-blue-600 mb-2">${modeNames[mode]} おしまい！</h2>

                    <div class="bg-white rounded-3xl p-6 shadow-xl mb-4 w-full max-w-sm">
                        <p class="text-gray-500 font-bold mb-1">スコア</p>
                        <p class="text-5xl font-black text-orange-500 mb-1">${score}</p>
                        <p class="text-gray-400 font-bold">/ ${maxScore} てん</p>
                    </div>

                    <p class="text-xl font-bold text-gray-600 mb-6">${message}</p>

                    <div class="flex flex-col gap-3 w-full max-w-xs">
                        <button id="btn-retry" class="bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold text-xl py-4 rounded-full shadow-lg">
                            🔄 もういちど
                        </button>
                        <button id="btn-change" class="bg-white text-gray-600 font-bold text-xl py-4 rounded-full shadow-md border-2 border-gray-200">
                            🔢 べつの もんだい
                        </button>
                        <button id="btn-home" class="bg-gray-100 text-gray-500 font-bold text-lg py-3 rounded-full">
                            🏠 ホームにもどる
                        </button>
                    </div>
                </div>
            `;

            system.addScore(score);

            container.querySelector('#btn-retry').onclick = () => startQuiz(mode);
            container.querySelector('#btn-change').onclick = () => renderModeSelect();
            container.querySelector('#btn-home').onclick = () => system.goHome();
        };

        // 開始
        renderModeSelect();

        return () => {};
    }
};
