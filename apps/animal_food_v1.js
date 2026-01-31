/**
 * どうぶつの ごはんクイズ
 * 動物が食べるものを選ぶクイズゲーム
 */

export default {
    launch(container, system) {
        // ========================================
        // データ定義
        // ========================================
        const animals = [
            {
                name: 'うさぎ',
                emoji: '🐰',
                foods: ['にんじん🥕', 'キャベツ🥬', 'りんご🍎'],
                correctCount: 2
            },
            {
                name: 'ねこ',
                emoji: '🐱',
                foods: ['さかな🐟', 'にく🍖'],
                correctCount: 2
            },
            {
                name: 'いぬ',
                emoji: '🐶',
                foods: ['にく🍖', 'ほね🦴', 'ドッグフード🥫'],
                correctCount: 2
            },
            {
                name: 'さる',
                emoji: '🐵',
                foods: ['バナナ🍌', 'りんご🍎', 'もも🍑'],
                correctCount: 2
            },
            {
                name: 'ぞう',
                emoji: '🐘',
                foods: ['バナナ🍌', 'りんご🍎', 'くさ🌿'],
                correctCount: 2
            },
            {
                name: 'パンダ',
                emoji: '🐼',
                foods: ['ささ🎋', 'たけのこ🎍'],
                correctCount: 2
            },
            {
                name: 'ライオン',
                emoji: '🦁',
                foods: ['にく🍖', 'にく🥩'],
                correctCount: 1
            },
            {
                name: 'ペンギン',
                emoji: '🐧',
                foods: ['さかな🐟', 'いか🦑', 'えび🦐'],
                correctCount: 2
            },
            {
                name: 'くま',
                emoji: '🐻',
                foods: ['さかな🐟', 'はちみつ🍯', 'ベリー🫐'],
                correctCount: 2
            },
            {
                name: 'にわとり',
                emoji: '🐔',
                foods: ['とうもろこし🌽', 'むし🐛', 'たね🌻'],
                correctCount: 2
            },
            {
                name: 'ぶた',
                emoji: '🐷',
                foods: ['とうもろこし🌽', 'やさい🥬', 'りんご🍎'],
                correctCount: 2
            },
            {
                name: 'うま',
                emoji: '🐴',
                foods: ['にんじん🥕', 'りんご🍎', 'くさ🌿'],
                correctCount: 2
            },
            {
                name: 'うし',
                emoji: '🐮',
                foods: ['くさ🌿', 'ほしくさ🌾'],
                correctCount: 2
            },
            {
                name: 'ひつじ',
                emoji: '🐑',
                foods: ['くさ🌿', 'クローバー🍀'],
                correctCount: 2
            },
            {
                name: 'りす',
                emoji: '🐿️',
                foods: ['どんぐり🌰', 'くるみ🥜', 'まつのみ🌲'],
                correctCount: 2
            }
        ];

        // 不正解の選択肢プール
        const allFoods = [
            'にんじん🥕', 'キャベツ🥬', 'りんご🍎', 'さかな🐟', 'にく🍖',
            'バナナ🍌', 'もも🍑', 'ささ🎋', 'たけのこ🎍', 'はちみつ🍯',
            'とうもろこし🌽', 'くさ🌿', 'どんぐり🌰', 'くるみ🥜', 'チーズ🧀',
            'パン🍞', 'ケーキ🍰', 'アイス🍦', 'チョコ🍫', 'ポテト🍟',
            'ピザ🍕', 'ラーメン🍜', 'おにぎり🍙', 'たまご🥚', 'ミルク🥛',
            'ほね🦴', 'えび🦐', 'いか🦑', 'ベリー🫐', 'むし🐛'
        ];

        // ========================================
        // 状態管理
        // ========================================
        let currentQuestionIndex = 0;
        let score = 0;
        let quizQuestions = [];
        let selectedAnswers = new Set();
        let hasAnswered = false;

        const TOTAL_QUESTIONS = 5;

        // シャッフル
        const shuffle = (array) => {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        // クイズ問題を生成
        const generateQuestions = () => {
            const shuffledAnimals = shuffle(animals).slice(0, TOTAL_QUESTIONS);

            quizQuestions = shuffledAnimals.map(animal => {
                // 正解の食べ物をcorrectCount個選ぶ
                const correctFoods = shuffle(animal.foods).slice(0, animal.correctCount);

                // 不正解の食べ物を選ぶ（正解と重複しないもの）
                const wrongFoods = shuffle(
                    allFoods.filter(f => !animal.foods.includes(f))
                ).slice(0, 6 - animal.correctCount);

                // 選択肢を生成してシャッフル
                const choices = shuffle([...correctFoods, ...wrongFoods]);

                return {
                    animal: animal,
                    correctFoods: correctFoods,
                    correctCount: animal.correctCount,
                    choices: choices
                };
            });
        };

        // ========================================
        // 描画
        // ========================================
        const renderStart = () => {
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-100 to-yellow-100">
                    <button id="btn-quit" class="absolute top-4 left-4 bg-white/80 text-gray-500 font-bold py-2 px-4 rounded-full text-sm">
                        ✕ やめる
                    </button>

                    <div class="text-8xl md:text-9xl mb-4 animate-bounce">🐾</div>
                    <h1 class="text-3xl md:text-5xl font-black text-green-600 mb-3 text-center">
                        どうぶつの ごはんクイズ
                    </h1>
                    <p class="text-gray-600 font-bold mb-6 text-center text-lg md:text-xl">
                        どうぶつが たべるものを<br>えらんでね！
                    </p>

                    <button id="btn-start" class="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-black text-2xl py-5 px-14 rounded-full shadow-lg active:scale-95 transition">
                        🎮 スタート！
                    </button>
                </div>
            `;

            container.querySelector('#btn-quit').onclick = () => system.goHome();
            container.querySelector('#btn-start').onclick = () => {
                generateQuestions();
                currentQuestionIndex = 0;
                score = 0;
                renderQuestion();
            };
        };

        const renderQuestion = () => {
            if (currentQuestionIndex >= quizQuestions.length) {
                renderResult();
                return;
            }

            const q = quizQuestions[currentQuestionIndex];
            selectedAnswers = new Set();
            hasAnswered = false;

            container.innerHTML = `
                <div class="h-full flex flex-col p-2 md:p-4 bg-gradient-to-b from-green-50 to-yellow-50">
                    <!-- ヘッダー -->
                    <div class="flex justify-between items-center mb-2">
                        <button id="btn-quit" class="bg-white/80 text-gray-400 font-bold py-1.5 px-3 rounded-full text-sm">
                            やめる
                        </button>
                        <div class="bg-green-100 text-green-600 px-4 py-1.5 rounded-full font-bold">
                            ${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}
                        </div>
                        <div class="bg-yellow-100 text-yellow-600 px-4 py-1.5 rounded-full font-bold">
                            ⭐ ${score}
                        </div>
                    </div>

                    <!-- 問題エリア（横向き対応のフレックスレイアウト） -->
                    <div class="flex-1 flex flex-col landscape:flex-row landscape:items-center landscape:gap-8 items-center justify-center">
                        <!-- 左側: 動物と質問 -->
                        <div class="flex flex-col items-center landscape:flex-shrink-0">
                            <!-- 動物 -->
                            <div class="bg-white rounded-3xl p-4 md:p-8 shadow-xl border-4 border-green-200 mb-3 text-center">
                                <div class="text-7xl md:text-9xl mb-2">${q.animal.emoji}</div>
                                <h2 class="text-2xl md:text-3xl font-black text-gray-700">${q.animal.name}</h2>
                            </div>

                            <!-- 質問 -->
                            <div class="bg-yellow-100 rounded-2xl px-6 py-3 mb-3 border-2 border-yellow-300">
                                <p class="text-lg md:text-xl font-bold text-yellow-700 text-center">
                                    なにを たべる？ <span class="text-2xl text-orange-500">${q.correctCount}こ</span> えらんでね！
                                </p>
                            </div>

                            <!-- 選択したもの表示 -->
                            <div class="mb-2 h-12 flex items-center justify-center gap-2">
                                <span class="text-gray-500 font-bold">えらんだ:</span>
                                <div id="selected-display" class="flex gap-2">
                                    ${Array(q.correctCount).fill('').map((_, i) => `
                                        <div class="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">?</div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- 右側: 選択肢と決定ボタン -->
                        <div class="flex flex-col items-center w-full landscape:flex-1 landscape:max-w-xl">
                            <!-- 選択肢 -->
                            <div class="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-xl">
                                ${q.choices.map((choice, i) => `
                                    <button class="choice-btn bg-white hover:bg-green-50 text-xl font-bold py-3 md:py-4 px-2 rounded-2xl shadow-md border-4 border-gray-200 active:scale-95 transition flex flex-col items-center justify-center min-h-[80px] md:min-h-[100px]"
                                        data-choice="${choice}" data-index="${i}">
                                        <span class="text-2xl md:text-3xl">${choice.match(/[\u{1F300}-\u{1F9FF}]/u)?.[0] || ''}</span>
                                        <span class="text-sm md:text-base text-gray-600">${choice.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}</span>
                                    </button>
                                `).join('')}
                            </div>

                            <!-- 決定ボタン -->
                            <button id="btn-submit" class="mt-4 bg-gradient-to-r from-orange-400 to-red-400 text-white font-black text-xl py-4 px-12 rounded-full shadow-lg opacity-50 cursor-not-allowed transition" disabled>
                                けってい！
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 結果オーバーレイ -->
                <div id="result-overlay" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-3xl p-8 mx-4 text-center shadow-2xl max-w-sm w-full">
                        <div id="result-emoji" class="text-8xl mb-4"></div>
                        <h3 id="result-text" class="text-3xl font-black mb-4"></h3>
                        <p id="result-detail" class="text-gray-600 font-bold mb-6"></p>
                        <button id="btn-next" class="bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold text-xl py-3 px-8 rounded-full shadow-lg">
                            つぎへ →
                        </button>
                    </div>
                </div>
            `;

            setupQuestionListeners(q);
        };

        const setupQuestionListeners = (q) => {
            container.querySelector('#btn-quit').onclick = () => system.goHome();

            const choiceBtns = container.querySelectorAll('.choice-btn');
            const submitBtn = container.querySelector('#btn-submit');
            const selectedDisplay = container.querySelector('#selected-display');

            // 選択肢クリック
            choiceBtns.forEach(btn => {
                btn.onclick = () => {
                    if (hasAnswered) return;

                    const choice = btn.dataset.choice;

                    if (selectedAnswers.has(choice)) {
                        // 選択解除
                        selectedAnswers.delete(choice);
                        btn.classList.remove('border-green-400', 'bg-green-100');
                        btn.classList.add('border-gray-200');
                    } else if (selectedAnswers.size < q.correctCount) {
                        // 選択
                        selectedAnswers.add(choice);
                        btn.classList.remove('border-gray-200');
                        btn.classList.add('border-green-400', 'bg-green-100');
                    }

                    // 選択表示を更新
                    const selected = Array.from(selectedAnswers);
                    selectedDisplay.innerHTML = Array(q.correctCount).fill('').map((_, i) => {
                        if (selected[i]) {
                            const emoji = selected[i].match(/[\u{1F300}-\u{1F9FF}]/u)?.[0] || '?';
                            return `<div class="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl border-2 border-green-400">${emoji}</div>`;
                        }
                        return `<div class="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">?</div>`;
                    }).join('');

                    // 決定ボタンの有効化
                    if (selectedAnswers.size === q.correctCount) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    } else {
                        submitBtn.disabled = true;
                        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    }
                };
            });

            // 決定ボタン
            submitBtn.onclick = () => {
                if (hasAnswered || selectedAnswers.size !== q.correctCount) return;
                hasAnswered = true;

                // 正解判定
                const selectedArray = Array.from(selectedAnswers);
                const correctCount = selectedArray.filter(s => q.correctFoods.includes(s)).length;
                const isAllCorrect = correctCount === q.correctCount;

                // ログ記録
                if (system.logQuizResult) {
                    system.logQuizResult('どうぶつのごはん', q.animal.name, isAllCorrect, {
                        selected: selectedArray,
                        correct: q.correctFoods
                    });
                }

                // 結果表示
                const overlay = container.querySelector('#result-overlay');
                const resultEmoji = container.querySelector('#result-emoji');
                const resultText = container.querySelector('#result-text');
                const resultDetail = container.querySelector('#result-detail');

                if (isAllCorrect) {
                    score += 20;
                    resultEmoji.textContent = '🎉';
                    resultText.textContent = 'せいかい！';
                    resultText.className = 'text-3xl font-black mb-4 text-green-500';
                    resultDetail.textContent = `${q.animal.name}は ${q.correctFoods.join('と')} をたべるよ！`;
                    system.playSound('correct');
                } else {
                    resultEmoji.textContent = '😢';
                    resultText.textContent = 'ざんねん...';
                    resultText.className = 'text-3xl font-black mb-4 text-red-400';
                    resultDetail.innerHTML = `せいかいは<br>${q.correctFoods.join(' と ')} だよ`;
                    system.playSound('wrong');
                }

                overlay.classList.remove('hidden');

                container.querySelector('#btn-next').onclick = () => {
                    currentQuestionIndex++;
                    renderQuestion();
                };
            };
        };

        const renderResult = () => {
            const maxScore = TOTAL_QUESTIONS * 20;
            const percentage = Math.round((score / maxScore) * 100);

            let emoji, message;
            if (percentage === 100) {
                emoji = '🏆';
                message = 'パーフェクト！<br>どうぶつ はかせ だね！';
            } else if (percentage >= 60) {
                emoji = '🌟';
                message = 'すごい！<br>よくできました！';
            } else {
                emoji = '🌱';
                message = 'がんばったね！<br>またチャレンジしよう！';
            }

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-100 to-yellow-100 text-center">
                    <div class="text-7xl md:text-9xl mb-4">${emoji}</div>
                    <h2 class="text-3xl md:text-4xl font-black text-green-600 mb-3">おしまい！</h2>

                    <div class="bg-white rounded-3xl p-6 md:p-8 shadow-xl mb-4 w-full max-w-sm">
                        <p class="text-gray-500 font-bold mb-1">スコア</p>
                        <p class="text-5xl md:text-6xl font-black text-orange-500 mb-1">${score}</p>
                        <p class="text-gray-400 font-bold">/ ${maxScore} てん</p>
                    </div>

                    <p class="text-xl font-bold text-gray-600 mb-6">${message}</p>

                    <div class="flex flex-col md:flex-row gap-3 w-full max-w-md">
                        <button id="btn-retry" class="bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold text-xl py-4 px-8 rounded-full shadow-lg flex-1">
                            🔄 もういちど
                        </button>
                        <button id="btn-home" class="bg-white text-gray-600 font-bold text-xl py-4 px-8 rounded-full shadow-md border-2 border-gray-200 flex-1">
                            🏠 ホームにもどる
                        </button>
                    </div>
                </div>
            `;

            system.addScore(score);

            container.querySelector('#btn-retry').onclick = () => {
                generateQuestions();
                currentQuestionIndex = 0;
                score = 0;
                renderQuestion();
            };
            container.querySelector('#btn-home').onclick = () => system.goHome();
        };

        // 開始
        renderStart();

        return () => {};
    }
};
