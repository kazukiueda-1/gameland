export default {
    /**
     * アプリ起動関数
     * @param {HTMLElement} container
     * @param {Object} system
     */
    launch(container, system) {
        // ---------------------------------------------------------
        // 1. DATA: 100 Words organized by 10 Levels (完全移植)
        // ---------------------------------------------------------
        const levels = [
            {
                name: "Level 1: Animals",
                emoji: "🐱",
                words: [
                    { t: "Cat", e: "🐱" }, { t: "Dog", e: "🐶" }, { t: "Pig", e: "🐷" }, 
                    { t: "Fox", e: "🦊" }, { t: "Bat", e: "🦇" }, { t: "Bee", e: "🐝" }, 
                    { t: "Ant", e: "🐜" }, { t: "Cow", e: "🐮" }, { t: "Hen", e: "🐔" }, { t: "Rat", e: "🐀" }
                ]
            },
            {
                name: "Level 2: Fruits",
                emoji: "🍎",
                words: [
                    { t: "Apple", e: "🍎" }, { t: "Banana", e: "🍌" }, { t: "Grape", e: "🍇" }, 
                    { t: "Lemon", e: "🍋" }, { t: "Melon", e: "🍈" }, { t: "Peach", e: "🍑" }, 
                    { t: "Kiwi", e: "🥝" }, { t: "Pear", e: "🍐" }, { t: "Plum", e: "🫐" }, { t: "Berry", e: "🍓" }
                ]
            },
            {
                name: "Level 3: Colors",
                emoji: "🎨",
                words: [
                    { t: "Red", e: "❤️" }, { t: "Blue", e: "💙" }, { t: "Pink", e: "💗" }, 
                    { t: "Green", e: "💚" }, { t: "Black", e: "🖤" }, { t: "White", e: "🤍" }, 
                    { t: "Yellow", e: "💛" }, { t: "Purple", e: "💜" }, { t: "Orange", e: "🧡" }, { t: "Brown", e: "🤎" }
                ]
            },
            {
                name: "Level 4: Nature",
                emoji: "🌳",
                words: [
                    { t: "Sun", e: "☀️" }, { t: "Moon", e: "🌙" }, { t: "Star", e: "⭐" }, 
                    { t: "Rain", e: "☔" }, { t: "Snow", e: "⛄" }, { t: "Cloud", e: "☁️" }, 
                    { t: "Fire", e: "🔥" }, { t: "Tree", e: "🌳" }, { t: "Flower", e: "🌸" }, { t: "Rainbow", e: "🌈" }
                ]
            },
            {
                name: "Level 5: Body",
                emoji: "👀",
                words: [
                    { t: "Eye", e: "👁️" }, { t: "Ear", e: "👂" }, { t: "Nose", e: "👃" }, 
                    { t: "Hand", e: "✋" }, { t: "Foot", e: "🦶" }, { t: "Mouth", e: "👄" }, 
                    { t: "Arm", e: "💪" }, { t: "Leg", e: "🦵" }, { t: "Brain", e: "🧠" }, { t: "Tooth", e: "🦷" }
                ]
            },
            {
                name: "Level 6: Family",
                emoji: "👨‍👩‍👧",
                words: [
                    { t: "Baby", e: "👶" }, { t: "Boy", e: "👦" }, { t: "Girl", e: "👧" }, 
                    { t: "Man", e: "👨" }, { t: "Woman", e: "👩" }, { t: "Grandpa", e: "👴" }, 
                    { t: "Grandma", e: "👵" }, { t: "Police", e: "👮" }, { t: "Doctor", e: "👩‍⚕️" }, { t: "Princess", e: "👸" }
                ]
            },
            {
                name: "Level 7: Food",
                emoji: "🍔",
                words: [
                    { t: "Cake", e: "🍰" }, { t: "Bread", e: "🍞" }, { t: "Egg", e: "🥚" }, 
                    { t: "Milk", e: "🥛" }, { t: "Rice", e: "🍚" }, { t: "Pizza", e: "🍕" }, 
                    { t: "Burger", e: "🍔" }, { t: "Cookie", e: "🍪" }, { t: "Candy", e: "🍬" }, { t: "Ice Cream", e: "🍦" }
                ]
            },
            {
                name: "Level 8: Things",
                emoji: "🚗",
                words: [
                    { t: "Car", e: "🚗" }, { t: "Bus", e: "🚌" }, { t: "Train", e: "🚆" }, 
                    { t: "Bike", e: "🚲" }, { t: "Plane", e: "✈️" }, { t: "Ship", e: "🚢" }, 
                    { t: "Book", e: "📕" }, { t: "Pen", e: "🖊️" }, { t: "Ball", e: "⚽" }, { t: "Balloon", e: "🎈" }
                ]
            },
            {
                name: "Level 9: Actions",
                emoji: "🏃",
                words: [
                    { t: "Run", e: "🏃" }, { t: "Walk", e: "🚶" }, { t: "Eat", e: "🍽️" }, 
                    { t: "Sleep", e: "😴" }, { t: "Swim", e: "🏊" }, { t: "Dance", e: "💃" }, 
                    { t: "Sing", e: "🎤" }, { t: "Read", e: "📖" }, { t: "Write", e: "✍️" }, { t: "Cry", e: "😭" }
                ]
            },
            {
                name: "Level 10: Feelings",
                emoji: "😊",
                words: [
                    { t: "Happy", e: "😄" }, { t: "Sad", e: "😢" }, { t: "Angry", e: "😠" }, 
                    { t: "Sleepy", e: "😪" }, { t: "Hot", e: "🥵" }, { t: "Cold", e: "🥶" }, 
                    { t: "Sick", e: "🤒" }, { t: "Scared", e: "😱" }, { t: "Surprised", e: "😲" }, { t: "Love", e: "❤️" }
                ]
            }
        ];

        const praiseList = ["Great!", "Good Job!", "Awesome!", "Perfect!", "You did it!", "Amazing!", "Super!"];

        // ---------------------------------------------------------
        // 2. STATE & UTILS
        // ---------------------------------------------------------
        let currentLevelIndex = 0;
        let quizQueue = [];
        let quizIndex = 0;
        let score = 0;
        let isProcessing = false;
        
        const synth = window.speechSynthesis;

        // Shuffle Helper
        const shuffle = (array) => {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        // Speech Helper
        const speak = (text, rate = 1.0, pitch = 1.0) => {
            synth.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'en-US';
            utter.rate = rate;
            utter.pitch = pitch;
            synth.speak(utter);
            return utter; // イベントハンドラ登録用に戻り値を返す
        };

        // Confetti Effect (CSS + DOM)
        const triggerConfetti = () => {
            const colors = ['#FF9AA2', '#C7CEEA', '#B5EAD7', '#FFDAC1', '#FFFFB7'];
            const containerRect = container.getBoundingClientRect();

            for (let i = 0; i < 30; i++) {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: absolute; width: 10px; height: 10px;
                    top: -10px; z-index: 50; pointer-events: none;
                    background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}%;
                    animation: fall ${Math.random() * 2 + 1.5}s linear forwards;
                `;
                container.appendChild(confetti);
                
                // Add keyframe animation dynamically if not exists
                if (!document.getElementById('confetti-style')) {
                    const style = document.createElement('style');
                    style.id = 'confetti-style';
                    style.innerHTML = `@keyframes fall { to { transform: translateY(${containerRect.height}px) rotate(720deg); } }`;
                    document.head.appendChild(style);
                }

                setTimeout(() => confetti.remove(), 3500);
            }
        };

        // ---------------------------------------------------------
        // 3. SCREENS
        // ---------------------------------------------------------

        // ★ Level Selection Screen
        const renderLevelSelect = () => {
            const buttonsHtml = levels.map((level, index) => `
                <button class="level-btn bg-white border-4 border-indigo-200 hover:bg-indigo-50 text-gray-600 font-bold p-4 rounded-3xl shadow-md transition transform active:scale-95 flex flex-col items-center gap-2" data-index="${index}">
                    <span class="text-4xl filter drop-shadow-sm">${level.emoji}</span>
                    <span class="text-sm md:text-base">${level.name}</span>
                </button>
            `).join('');

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    <button id="btn-quit" class="absolute top-4 left-4 bg-gray-100 text-gray-400 font-bold py-2 px-4 rounded-full text-sm hover:bg-gray-200">✕ Exit</button>
                    
                    <h2 class="text-3xl font-black text-pink-400 mb-2 drop-shadow-sm">🦄 English Fun!</h2>
                    <p class="text-gray-400 font-bold mb-6">Choose a Level!</p>
                    
                    <div class="w-full max-w-4xl flex-1 overflow-y-auto p-2">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                            ${buttonsHtml}
                        </div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-quit').onclick = () => system.goHome();
            container.querySelectorAll('.level-btn').forEach(btn => {
                btn.onclick = () => {
                    currentLevelIndex = parseInt(btn.dataset.index);
                    renderModeSelect();
                };
            });
        };

        // ★ Mode Selection Screen
        const renderModeSelect = () => {
            const level = levels[currentLevelIndex];
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-6 animate-pop">
                    <div class="text-6xl mb-4">${level.emoji}</div>
                    <h2 class="text-2xl font-black text-gray-700 mb-2">${level.name}</h2>
                    <p class="text-gray-400 font-bold mb-8">What do you want to do?</p>
                    
                    <div class="flex flex-col w-full max-w-sm gap-4">
                        <button id="btn-study" class="bg-indigo-200 hover:bg-indigo-300 text-white text-xl font-bold py-5 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                            <span>📖</span> Learn (Study)
                        </button>
                        <button id="btn-quiz" class="bg-pink-300 hover:bg-pink-400 text-white text-xl font-bold py-5 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                            <span>🎮</span> Play (Quiz)
                        </button>
                    </div>

                    <button id="btn-back" class="mt-8 border-2 border-gray-200 text-gray-400 font-bold py-2 px-6 rounded-full hover:bg-gray-50 transition">
                        ⬅ Back
                    </button>
                </div>
            `;

            container.querySelector('#btn-study').onclick = renderStudyMode;
            container.querySelector('#btn-quiz').onclick = startQuiz;
            container.querySelector('#btn-back').onclick = renderLevelSelect;
        };

        // ★ Study Mode
        const renderStudyMode = () => {
            const words = levels[currentLevelIndex].words;
            
            const cardsHtml = words.map(w => `
                <div class="word-card bg-white border-2 border-teal-200 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer shadow-sm hover:bg-teal-50 active:scale-95 transition" data-text="${w.t}">
                    <div class="text-5xl mb-2">${w.e}</div>
                    <div class="text-lg font-bold text-gray-600">${w.t}</div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="h-full flex flex-col p-4">
                    <div class="flex items-center justify-between mb-4">
                        <button id="btn-back-mode" class="border-2 border-gray-200 text-gray-400 font-bold py-1 px-4 rounded-full text-sm hover:bg-gray-50">⬅ Back</button>
                        <h2 class="font-bold text-indigo-400">Tap to Listen!</h2>
                        <div class="w-16"></div>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                            ${cardsHtml}
                        </div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-back-mode').onclick = renderModeSelect;
            container.querySelectorAll('.word-card').forEach(card => {
                card.onclick = () => {
                    const text = card.dataset.text;
                    speak(text);
                    // 視覚的フィードバック
                    card.classList.add('ring-4', 'ring-teal-200');
                    setTimeout(() => card.classList.remove('ring-4', 'ring-teal-200'), 300);
                };
            });
        };

        // ★ Quiz Logic
        const startQuiz = () => {
            const words = levels[currentLevelIndex].words;
            // クイズ用に10問セットを作成（シャッフル）
            quizQueue = shuffle([...words]);
            quizIndex = 0;
            score = 0;
            renderQuizQuestion();
            // 最初の問題を少し遅れて読み上げ
            setTimeout(() => {
                if(quizQueue[quizIndex]) speak(quizQueue[quizIndex].t, 0.85);
            }, 800);
        };

        const renderQuizQuestion = () => {
            if (quizIndex >= quizQueue.length) {
                renderResult();
                return;
            }

            isProcessing = false;
            const q = quizQueue[quizIndex];

            // 選択肢作成 (正解1 + 不正解2)
            let distractors = [];
            const allWords = levels[currentLevelIndex].words;
            while (distractors.length < 2) {
                const w = allWords[Math.floor(Math.random() * allWords.length)];
                if (w.t !== q.t && !distractors.some(d => d.t === w.t)) {
                    distractors.push(w);
                }
            }
            const options = shuffle([q, ...distractors]);

            container.innerHTML = `
                <div class="h-full flex flex-col p-4 relative">
                    <!-- Progress -->
                    <div class="flex justify-between items-center mb-4">
                        <button id="btn-quit-quiz" class="text-gray-400 font-bold text-sm bg-gray-100 px-3 py-1 rounded-full">✕ Stop</button>
                        <div class="bg-indigo-100 text-indigo-500 px-3 py-1 rounded-full font-bold text-sm">
                            ${quizIndex + 1} / ${quizQueue.length}
                        </div>
                    </div>

                    <!-- Question Area -->
                    <div class="flex-1 flex flex-col items-center justify-center mb-6">
                        <div class="text-8xl md:text-9xl mb-6 animate-pop filter drop-shadow-md" id="question-emoji">${q.e}</div>
                        
                        <button id="btn-speak" class="bg-indigo-200 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg active:scale-95 transition hover:bg-indigo-300">
                            🔊
                        </button>
                        <p class="text-gray-400 mt-4 font-bold text-sm">Listen & Look!</p>
                        <div id="message-area" class="h-8 mt-2 text-xl font-bold text-pink-400 transition-all"></div>
                    </div>

                    <!-- Options -->
                    <div class="grid grid-cols-1 gap-3 w-full max-w-md mx-auto mb-4">
                        ${options.map(opt => `
                            <button class="option-btn bg-white border-4 border-teal-200 text-gray-600 text-xl font-bold py-4 rounded-2xl shadow-sm hover:bg-teal-50 transition active:scale-95" data-text="${opt.t}">
                                ${opt.t}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            const speakBtn = container.querySelector('#btn-speak');
            speakBtn.onclick = () => {
                const u = speak(q.t, 0.85);
                speakBtn.classList.add('scale-110', 'bg-indigo-400');
                u.onend = () => speakBtn.classList.remove('scale-110', 'bg-indigo-400');
            };

            container.querySelector('#btn-quit-quiz').onclick = renderModeSelect;

            container.querySelectorAll('.option-btn').forEach(btn => {
                btn.onclick = () => checkAnswer(btn, q.t);
            });
        };

        const checkAnswer = (btn, correctText) => {
            if (isProcessing) return;
            const selectedText = btn.dataset.text;
            const messageArea = container.querySelector('#message-area');
            const q = quizQueue[quizIndex];
            const isCorrect = selectedText === correctText;

            // クイズログを記録
            if (system.logQuizResult) {
                system.logQuizResult('English Fun!', q.t, isCorrect, {
                    emoji: q.e,
                    selected: selectedText,
                    level: levels[currentLevelIndex].name
                });
            }

            if (isCorrect) {
                // CORRECT
                isProcessing = true;
                btn.classList.remove('bg-white', 'border-teal-200', 'text-gray-600');
                btn.classList.add('bg-teal-400', 'border-teal-500', 'text-white');

                system.playSound('correct');
                score += 10;
                triggerConfetti();

                // 褒める
                const praise = praiseList[Math.floor(Math.random() * praiseList.length)];
                messageArea.textContent = `${praise} 🌟`;
                speak(praise, 1.2, 1.2);

                setTimeout(() => {
                    quizIndex++;
                    renderQuizQuestion();
                    // 次の問題の発音を予約
                    setTimeout(() => {
                        if(quizQueue[quizIndex]) speak(quizQueue[quizIndex].t, 0.85);
                    }, 800);
                }, 2000);

            } else {
                // WRONG
                btn.classList.add('animate-shake', 'bg-red-100', 'border-red-300', 'text-red-500');
                messageArea.textContent = "Try again!";

                // 間違った単語を読み上げ
                speak(selectedText, 0.9);
                system.playSound('wrong');

                setTimeout(() => {
                    btn.classList.remove('animate-shake', 'bg-red-100', 'border-red-300', 'text-red-500');
                }, 500);
            }
        };

        // ★ Result Screen
        const renderResult = () => {
            let emoji = score === 100 ? "🏆" : (score >= 80 ? "🥈" : "🍀");
            
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-6 text-center animate-pop">
                    <div class="text-8xl mb-4">${emoji}</div>
                    <h2 class="text-3xl font-black text-pink-400 mb-2">Great Job!</h2>
                    <p class="text-gray-500 font-bold text-xl mb-8">Score: ${score}</p>
                    
                    <button id="btn-retry" class="w-full max-w-xs bg-teal-400 text-white font-bold py-3 rounded-full shadow-md mb-4 text-lg hover:bg-teal-500 transition">
                        Play Again
                    </button>
                    <button id="btn-back-level" class="w-full max-w-xs bg-gray-200 text-gray-600 font-bold py-3 rounded-full shadow-sm text-lg hover:bg-gray-300 transition">
                        Select Level
                    </button>
                </div>
            `;

            if(score >= 80) {
                system.playSound('correct');
                triggerConfetti();
                speak("You did it! Amazing!", 1.1);
            } else {
                speak("Good job!", 1.0);
            }

            container.querySelector('#btn-retry').onclick = startQuiz;
            container.querySelector('#btn-back-level').onclick = () => {
                system.addScore(score); // スコア保存
                renderLevelSelect();
            };
        };

        // ---------------------------------------------------------
        // 4. START
        // ---------------------------------------------------------
        
        // CSS Animation for Shake (Tailwindには標準でない場合があるため念のため追加)
        if(!document.getElementById('anim-style')) {
            const style = document.createElement('style');
            style.id = 'anim-style';
            style.innerHTML = `
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
                .animate-shake { animation: shake 0.4s ease-in-out; }
            `;
            document.head.appendChild(style);
        }

        renderLevelSelect();

        return () => {
            synth.cancel(); // 終了時に音声を止める
        };
    }
};