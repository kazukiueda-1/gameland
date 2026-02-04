/**
 * こっきクイズ
 * 5歳児向けの国旗当てクイズ
 * 国旗を見て4択から国名を選ぶ
 */

export default {
    launch(container, system) {
        // 国データ（国旗絵文字、正式名、ひらがな）
        const countries = [
            { flag: '🇯🇵', name: '日本', ruby: 'にほん' },
            { flag: '🇺🇸', name: 'アメリカ', ruby: 'あめりか' },
            { flag: '🇬🇧', name: 'イギリス', ruby: 'いぎりす' },
            { flag: '🇫🇷', name: 'フランス', ruby: 'ふらんす' },
            { flag: '🇩🇪', name: 'ドイツ', ruby: 'どいつ' },
            { flag: '🇮🇹', name: 'イタリア', ruby: 'いたりあ' },
            { flag: '🇨🇳', name: '中国', ruby: 'ちゅうごく' },
            { flag: '🇰🇷', name: '韓国', ruby: 'かんこく' },
            { flag: '🇧🇷', name: 'ブラジル', ruby: 'ぶらじる' },
            { flag: '🇦🇺', name: 'オーストラリア', ruby: 'おーすとらりあ' },
            { flag: '🇨🇦', name: 'カナダ', ruby: 'かなだ' },
            { flag: '🇮🇳', name: 'インド', ruby: 'いんど' },
            { flag: '🇷🇺', name: 'ロシア', ruby: 'ろしあ' },
            { flag: '🇪🇸', name: 'スペイン', ruby: 'すぺいん' },
            { flag: '🇲🇽', name: 'メキシコ', ruby: 'めきしこ' },
            { flag: '🇪🇬', name: 'エジプト', ruby: 'えじぷと' },
            { flag: '🇹🇭', name: 'タイ', ruby: 'たい' },
            { flag: '🇻🇳', name: 'ベトナム', ruby: 'べとなむ' },
            { flag: '🇵🇭', name: 'フィリピン', ruby: 'ふぃりぴん' },
            { flag: '🇮🇩', name: 'インドネシア', ruby: 'いんどねしあ' },
            { flag: '🇳🇿', name: 'ニュージーランド', ruby: 'にゅーじーらんど' },
            { flag: '🇸🇬', name: 'シンガポール', ruby: 'しんがぽーる' },
            { flag: '🇨🇭', name: 'スイス', ruby: 'すいす' },
            { flag: '🇳🇱', name: 'オランダ', ruby: 'おらんだ' },
            { flag: '🇧🇪', name: 'ベルギー', ruby: 'べるぎー' },
            { flag: '🇸🇪', name: 'スウェーデン', ruby: 'すうぇーでん' },
            { flag: '🇳🇴', name: 'ノルウェー', ruby: 'のるうぇー' },
            { flag: '🇫🇮', name: 'フィンランド', ruby: 'ふぃんらんど' },
            { flag: '🇩🇰', name: 'デンマーク', ruby: 'でんまーく' },
            { flag: '🇬🇷', name: 'ギリシャ', ruby: 'ぎりしゃ' },
            { flag: '🇹🇷', name: 'トルコ', ruby: 'とるこ' },
            { flag: '🇿🇦', name: '南アフリカ', ruby: 'みなみあふりか' },
            { flag: '🇦🇷', name: 'アルゼンチン', ruby: 'あるぜんちん' },
            { flag: '🇵🇪', name: 'ペルー', ruby: 'ぺるー' },
            { flag: '🇵🇹', name: 'ポルトガル', ruby: 'ぽるとがる' },
            { flag: '🇵🇱', name: 'ポーランド', ruby: 'ぽーらんど' },
            { flag: '🇦🇹', name: 'オーストリア', ruby: 'おーすとりあ' },
            { flag: '🇭🇺', name: 'ハンガリー', ruby: 'はんがりー' },
            { flag: '🇨🇿', name: 'チェコ', ruby: 'ちぇこ' },
            { flag: '🇺🇦', name: 'ウクライナ', ruby: 'うくらいな' },
        ];

        let currentQuestion = null;
        let score = 0;
        let questionCount = 0;
        let totalQuestions = 10;
        let answered = false;
        let selectedAnswer = null;
        let showCelebration = false;
        let showResult = false;

        // シャッフル関数
        const shuffle = (array) => {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        // 新しい問題を生成
        const generateQuestion = () => {
            const shuffled = shuffle(countries);
            const correct = shuffled[0];
            const choices = shuffle([correct, ...shuffled.slice(1, 4)]);

            return {
                correct,
                choices,
            };
        };

        // 次の問題へ
        const nextQuestion = () => {
            if (questionCount >= totalQuestions) {
                showResult = true;
                render();
                return;
            }

            currentQuestion = generateQuestion();
            answered = false;
            selectedAnswer = null;
            showCelebration = false;
            questionCount++;
            render();
        };

        // パーティクル演出
        const createParticles = () => {
            const particleTypes = ['⭐', '🌟', '✨', '💖', '🎉', '🎊', '💫', '🌈', '🏆'];
            const count = 20;

            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.textContent = particleTypes[Math.floor(Math.random() * particleTypes.length)];

                const startX = Math.random() * window.innerWidth;
                const startY = window.innerHeight + 50;
                const endX = startX + (Math.random() - 0.5) * 200;
                const endY = Math.random() * window.innerHeight * 0.5;

                particle.style.cssText = `
                    position: fixed;
                    left: ${startX}px;
                    top: ${startY}px;
                    font-size: ${30 + Math.random() * 25}px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: flag-particle-rise 1.5s ease-out forwards;
                    --endX: ${endX}px;
                    --endY: ${endY}px;
                `;

                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1500);
            }
        };

        // 回答処理
        const handleAnswer = (choice) => {
            if (answered) return;

            answered = true;
            selectedAnswer = choice;

            if (choice.name === currentQuestion.correct.name) {
                score++;
                showCelebration = true;
                system.playSound('correct');
                createParticles();
            } else {
                system.playSound('incorrect');
            }

            render();

            // 次の問題へ
            setTimeout(() => {
                nextQuestion();
            }, showCelebration ? 2500 : 1800);
        };

        // ゲームをリスタート
        const restartGame = () => {
            score = 0;
            questionCount = 0;
            showResult = false;
            nextQuestion();
        };

        // 描画
        const render = () => {
            container.innerHTML = `
                <style>
                    @keyframes flag-particle-rise {
                        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(calc(var(--endY) - 100vh)) translateX(calc(var(--endX) - 50vw)) rotate(360deg); opacity: 0; }
                    }
                    @keyframes flag-bounce {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    @keyframes flag-shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-5px); }
                        75% { transform: translateX(5px); }
                    }
                    @keyframes flag-celebrate {
                        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
                        50% { transform: scale(1.2) rotate(10deg); opacity: 1; }
                        100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    }
                    @keyframes flag-float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes flag-correct-bg {
                        0% { background-position: 0% 50%; }
                        100% { background-position: 100% 50%; }
                    }

                    .flag-container {
                        height: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                        background-size: 200% 200%;
                        position: relative;
                        overflow: hidden;
                    }

                    .flag-header {
                        background: rgba(255,255,255,0.95);
                        padding: 10px 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 2px 15px rgba(0,0,0,0.1);
                    }

                    .flag-back-btn {
                        background: none;
                        border: none;
                        font-size: 14px;
                        color: #666;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    .flag-title {
                        font-size: 20px;
                        font-weight: 900;
                        color: #7c3aed;
                    }

                    .flag-score {
                        background: linear-gradient(135deg, #fbbf24, #f59e0b);
                        color: white;
                        padding: 5px 12px;
                        border-radius: 15px;
                        font-weight: bold;
                        font-size: 14px;
                    }

                    .flag-progress {
                        background: rgba(255,255,255,0.3);
                        height: 8px;
                        margin: 0;
                    }

                    .flag-progress-bar {
                        background: linear-gradient(90deg, #34d399, #10b981);
                        height: 100%;
                        transition: width 0.5s ease;
                    }

                    .flag-content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 15px;
                        gap: 20px;
                    }

                    .flag-question-num {
                        background: rgba(255,255,255,0.9);
                        padding: 8px 20px;
                        border-radius: 20px;
                        font-weight: bold;
                        color: #7c3aed;
                        font-size: 16px;
                    }

                    .flag-display {
                        font-size: min(40vw, 150px);
                        filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
                        animation: flag-float 3s ease-in-out infinite;
                    }

                    .flag-instruction {
                        background: rgba(255,255,255,0.95);
                        padding: 12px 25px;
                        border-radius: 25px;
                        font-size: 18px;
                        font-weight: bold;
                        color: #374151;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    }

                    .flag-choices {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                        width: 100%;
                        max-width: 400px;
                    }

                    .flag-choice {
                        background: white;
                        border: 4px solid #e5e7eb;
                        border-radius: 16px;
                        padding: 15px 10px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        text-align: center;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    }

                    .flag-choice:active {
                        transform: scale(0.95);
                    }

                    .flag-choice.correct {
                        background: linear-gradient(135deg, #d1fae5, #a7f3d0);
                        border-color: #10b981;
                        animation: flag-bounce 0.5s ease;
                    }

                    .flag-choice.incorrect {
                        background: linear-gradient(135deg, #fee2e2, #fecaca);
                        border-color: #ef4444;
                        animation: flag-shake 0.3s ease;
                    }

                    .flag-choice.correct-answer {
                        border-color: #10b981;
                        border-width: 4px;
                    }

                    .flag-choice-name {
                        font-size: 20px;
                        font-weight: bold;
                        color: #1f2937;
                        margin-bottom: 4px;
                    }

                    .flag-choice-ruby {
                        font-size: 14px;
                        color: #6b7280;
                    }

                    /* お祝い演出 */
                    .flag-celebration {
                        position: fixed;
                        inset: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: none;
                        z-index: 100;
                    }

                    .flag-celebration-content {
                        background: white;
                        border-radius: 30px;
                        padding: 30px 50px;
                        text-align: center;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        animation: flag-celebrate 0.6s ease-out;
                    }

                    .flag-celebration-emoji {
                        font-size: 80px;
                        margin-bottom: 10px;
                    }

                    .flag-celebration-text {
                        font-size: 32px;
                        font-weight: 900;
                        color: #10b981;
                        text-shadow: 2px 2px 0 #d1fae5;
                    }

                    .flag-celebration-sub {
                        font-size: 18px;
                        color: #6b7280;
                        margin-top: 5px;
                    }

                    /* 結果画面 */
                    .flag-result {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        text-align: center;
                    }

                    .flag-result-card {
                        background: white;
                        border-radius: 30px;
                        padding: 30px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                        max-width: 350px;
                        width: 100%;
                    }

                    .flag-result-emoji {
                        font-size: 80px;
                        margin-bottom: 15px;
                    }

                    .flag-result-title {
                        font-size: 28px;
                        font-weight: 900;
                        color: #7c3aed;
                        margin-bottom: 10px;
                    }

                    .flag-result-score {
                        font-size: 50px;
                        font-weight: 900;
                        color: #10b981;
                        margin: 15px 0;
                    }

                    .flag-result-message {
                        font-size: 18px;
                        color: #6b7280;
                        margin-bottom: 25px;
                    }

                    .flag-restart-btn {
                        background: linear-gradient(135deg, #7c3aed, #a855f7);
                        color: white;
                        border: none;
                        padding: 15px 40px;
                        border-radius: 30px;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                        box-shadow: 0 5px 20px rgba(124, 58, 237, 0.4);
                    }

                    .flag-restart-btn:active {
                        transform: scale(0.95);
                    }
                </style>

                <div class="flag-container" style="display: flex; flex-direction: column;">
                    <div class="flag-header">
                        <button class="flag-back-btn" id="flag-back">← もどる</button>
                        <span class="flag-title">🌍 こっきクイズ</span>
                        <span class="flag-score">⭐ ${score}てん</span>
                    </div>

                    <div class="flag-progress">
                        <div class="flag-progress-bar" style="width: ${(questionCount / totalQuestions) * 100}%;"></div>
                    </div>

                    ${showResult ? `
                        <div class="flag-result">
                            <div class="flag-result-card">
                                <div class="flag-result-emoji">${score >= 8 ? '🏆' : score >= 5 ? '🎉' : '💪'}</div>
                                <h2 class="flag-result-title">けっか はっぴょう！</h2>
                                <div class="flag-result-score">${score} / ${totalQuestions}</div>
                                <p class="flag-result-message">
                                    ${score === 10 ? 'パーフェクト！すごすぎる！🌟' :
                                      score >= 8 ? 'すばらしい！こっきはかせだね！' :
                                      score >= 5 ? 'よくがんばったね！' :
                                      'また ちょうせん してね！'}
                                </p>
                                <button class="flag-restart-btn" id="restart-btn">もういちど あそぶ</button>
                            </div>
                        </div>
                    ` : `
                        <div class="flag-content">
                            <div class="flag-question-num">
                                だい ${questionCount}もん / ${totalQuestions}もん
                            </div>

                            <div class="flag-display">${currentQuestion?.correct.flag || ''}</div>

                            <div class="flag-instruction">
                                この こっきは どこの くに？
                            </div>

                            <div class="flag-choices">
                                ${currentQuestion?.choices.map(choice => {
                                    let className = 'flag-choice';
                                    if (answered) {
                                        if (choice.name === currentQuestion.correct.name) {
                                            className += ' correct correct-answer';
                                        } else if (selectedAnswer && choice.name === selectedAnswer.name) {
                                            className += ' incorrect';
                                        }
                                    }
                                    return `
                                        <button class="${className}" data-name="${choice.name}">
                                            <div class="flag-choice-name">${choice.name}</div>
                                            <div class="flag-choice-ruby">${choice.ruby}</div>
                                        </button>
                                    `;
                                }).join('') || ''}
                            </div>
                        </div>
                    `}

                    ${showCelebration ? `
                        <div class="flag-celebration">
                            <div class="flag-celebration-content">
                                <div class="flag-celebration-emoji">🎉</div>
                                <div class="flag-celebration-text">せいかい！</div>
                                <div class="flag-celebration-sub">すごいね！</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;

            // イベント設定
            container.querySelector('#flag-back')?.addEventListener('click', () => system.goHome());
            container.querySelector('#restart-btn')?.addEventListener('click', restartGame);

            container.querySelectorAll('.flag-choice').forEach(btn => {
                btn.addEventListener('click', () => {
                    const name = btn.dataset.name;
                    const choice = currentQuestion.choices.find(c => c.name === name);
                    if (choice) handleAnswer(choice);
                });
            });
        };

        // ゲーム開始
        nextQuestion();

        return () => {};
    }
};
