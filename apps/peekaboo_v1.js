/**
 * いないいないばぁ
 * 1歳児向けのかわいいゲーム
 * 隠れ場所をタップすると動物が飛び出す
 */

export default {
    launch(container, system) {
        // 背景テーマ（10種類）- 隠れ場所アイコンも変わる
        const themes = [
            {
                id: 'flower', name: '🌸 おはなばたけ',
                bg: 'linear-gradient(180deg, #FFE4EC 0%, #FFCCE5 50%, #FFB6D3 100%)',
                accent: '#FF69B4',
                hideIcons: ['🌸', '🌷', '🌺', '🌻', '💐', '🌹']
            },
            {
                id: 'sky', name: '☁️ おそら',
                bg: 'linear-gradient(180deg, #E0F4FF 0%, #B8E4FF 50%, #87CEEB 100%)',
                accent: '#4FC3F7',
                hideIcons: ['☁️', '🌤️', '⭐', '🌙', '✨', '🌈']
            },
            {
                id: 'forest', name: '🌲 もり',
                bg: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)',
                accent: '#66BB6A',
                hideIcons: ['🌳', '🌲', '🍀', '🌿', '🍃', '🪴']
            },
            {
                id: 'candy', name: '🍭 おかし',
                bg: 'linear-gradient(180deg, #FCE4EC 0%, #F8BBD9 50%, #F48FB1 100%)',
                accent: '#EC407A',
                hideIcons: ['🍭', '🍬', '🧁', '🍩', '🎂', '🍪']
            },
            {
                id: 'rainbow', name: '🌈 にじいろ',
                bg: 'linear-gradient(180deg, #FFECB3 0%, #FFE0B2 30%, #FFCCBC 60%, #F8BBD9 100%)',
                accent: '#FF8A65',
                hideIcons: ['🌈', '💖', '💛', '💚', '💙', '💜']
            },
            {
                id: 'ocean', name: '🐚 うみ',
                bg: 'linear-gradient(180deg, #E1F5FE 0%, #B3E5FC 50%, #81D4FA 100%)',
                accent: '#29B6F6',
                hideIcons: ['🐚', '🌊', '⚓', '🏝️', '🦪', '💎']
            },
            {
                id: 'sunset', name: '🌅 ゆうやけ',
                bg: 'linear-gradient(180deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)',
                accent: '#FFA726',
                hideIcons: ['🌅', '🌄', '☀️', '🌻', '🧡', '🔶']
            },
            {
                id: 'lavender', name: '💜 ラベンダー',
                bg: 'linear-gradient(180deg, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)',
                accent: '#AB47BC',
                hideIcons: ['💜', '🔮', '🦄', '🎀', '👑', '💎']
            },
            {
                id: 'fruit', name: '🍓 フルーツ',
                bg: 'linear-gradient(180deg, #FFF8E1 0%, #FFECB3 50%, #FFE082 100%)',
                accent: '#FFCA28',
                hideIcons: ['🍓', '🍎', '🍊', '🍋', '🍇', '🍑']
            },
            {
                id: 'heart', name: '💕 ハート',
                bg: 'linear-gradient(180deg, #FCE4EC 0%, #F8BBD9 50%, #F48FB1 100%)',
                accent: '#E91E63',
                hideIcons: ['💖', '💗', '💓', '💕', '💝', '❤️']
            },
        ];

        let currentTheme = 0;
        let showThemeSelect = false;

        // わかりやすい動物（大きな絵文字）
        const animals = [
            { emoji: '🦁', name: 'ライオン' },
            { emoji: '🐘', name: 'ぞう' },
            { emoji: '🐰', name: 'うさぎ' },
            { emoji: '🐼', name: 'パンダ' },
            { emoji: '🐶', name: 'いぬ' },
            { emoji: '🐱', name: 'ねこ' },
            { emoji: '🐻', name: 'くま' },
            { emoji: '🐷', name: 'ぶた' },
            { emoji: '🐸', name: 'かえる' },
            { emoji: '🐵', name: 'さる' },
            { emoji: '🦊', name: 'きつね' },
            { emoji: '🐯', name: 'とら' },
        ];

        // 隠れ場所の状態
        const spotStates = {};

        // パーティクルエフェクト
        const createParticles = (x, y) => {
            const particleTypes = ['✨', '💖', '⭐', '🌟', '💕', '🎀', '♡', '🌈'];
            const count = 15;
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'peekaboo-particle';
                particle.textContent = particleTypes[Math.floor(Math.random() * particleTypes.length)];

                const angle = (i / count) * Math.PI * 2;
                const distance = 120 + Math.random() * 100;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance - 80;

                particle.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: ${25 + Math.random() * 20}px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: peekaboo-particle-fly 1.5s ease-out forwards;
                    --tx: ${tx}px;
                    --ty: ${ty}px;
                `;

                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1500);
            }
        };

        // 隠れ場所を開く
        const openSpot = (spot, index) => {
            const state = spotStates[index];
            const animalEl = spot.querySelector('.peekaboo-animal');
            const baaText = spot.querySelector('.peekaboo-baa');
            const hideIcon = spot.querySelector('.peekaboo-hide-icon');

            state.isOpen = true;

            // 隠れアイコンを小さく
            hideIcon.classList.add('open');

            // 動物を表示
            setTimeout(() => {
                animalEl.classList.add('visible');
                baaText.classList.add('visible');
                system.playSound('correct');
            }, 100);

            if (state.timeout) clearTimeout(state.timeout);

            state.timeout = setTimeout(() => {
                closeSpot(spot, index);
            }, 2000);
        };

        // 隠れ場所を閉じる
        const closeSpot = (spot, index) => {
            const state = spotStates[index];
            const animalEl = spot.querySelector('.peekaboo-animal');
            const baaText = spot.querySelector('.peekaboo-baa');
            const hideIcon = spot.querySelector('.peekaboo-hide-icon');

            state.isOpen = false;
            animalEl.classList.remove('visible');
            baaText.classList.remove('visible');
            hideIcon.classList.remove('open');

            // 新しい動物を設定
            setTimeout(() => {
                const newAnimal = animals[Math.floor(Math.random() * animals.length)];
                animalEl.textContent = newAnimal.emoji;
                animalEl.dataset.name = newAnimal.name;
            }, 400);

            if (state.timeout) {
                clearTimeout(state.timeout);
                state.timeout = null;
            }
        };

        // タップ処理（どこを押しても必ず動物が出る）
        const handleSpotTap = (spot) => {
            const index = parseInt(spot.dataset.index);

            const rect = spot.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // 他の開いている隠れ場所を閉じる
            const allSpots = document.querySelectorAll('.peekaboo-spot');
            allSpots.forEach((s, i) => {
                if (spotStates[i] && spotStates[i].isOpen && i !== index) {
                    closeSpot(s, i);
                }
            });

            // タップした場所を開く（既に開いていても新しい動物で再表示）
            const state = spotStates[index];
            if (state.isOpen) {
                // 既に開いている場合は新しい動物に変えて再表示
                const animalEl = spot.querySelector('.peekaboo-animal');
                const newAnimal = animals[Math.floor(Math.random() * animals.length)];
                animalEl.textContent = newAnimal.emoji;
                animalEl.dataset.name = newAnimal.name;

                // タイマーリセット
                if (state.timeout) clearTimeout(state.timeout);
                state.timeout = setTimeout(() => {
                    closeSpot(spot, index);
                }, 2000);
            } else {
                openSpot(spot, index);
            }
            createParticles(x, y);
        };

        // 隠れ場所のHTML生成
        const createSpotHTML = (index, hideIcon) => {
            const animal = animals[Math.floor(Math.random() * animals.length)];
            spotStates[index] = { isOpen: false, timeout: null };

            return `
                <div class="peekaboo-spot" data-index="${index}">
                    <div class="peekaboo-animal" data-name="${animal.name}">${animal.emoji}</div>
                    <div class="peekaboo-baa">ばぁ！</div>
                    <div class="peekaboo-hide-icon">${hideIcon}</div>
                </div>
            `;
        };

        // 描画
        const render = () => {
            const theme = themes[currentTheme];

            container.innerHTML = `
                <style>
                    @keyframes peekaboo-particle-fly {
                        0% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg); }
                        100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0) rotate(720deg); }
                    }
                    @keyframes peekaboo-pop-animal {
                        0% {
                            transform: translate(-50%, -50%) scale(0) rotate(-10deg);
                            opacity: 0;
                        }
                        40% {
                            transform: translate(-50%, -50%) scale(1.4) rotate(5deg);
                            opacity: 1;
                        }
                        60% {
                            transform: translate(-50%, -50%) scale(0.9) rotate(-3deg);
                        }
                        80% {
                            transform: translate(-50%, -50%) scale(1.1) rotate(2deg);
                        }
                        100% {
                            transform: translate(-50%, -50%) scale(1) rotate(0deg);
                            opacity: 1;
                        }
                    }
                    @keyframes peekaboo-pop-text {
                        0% { transform: translateX(-50%) translateY(20px) scale(0); opacity: 0; }
                        50% { transform: translateX(-50%) translateY(-10px) scale(1.3); opacity: 1; }
                        100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
                    }
                    @keyframes peekaboo-wiggle {
                        0%, 100% { transform: rotate(-5deg) scale(1); }
                        50% { transform: rotate(5deg) scale(1.05); }
                    }
                    @keyframes peekaboo-float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes peekaboo-hide-shrink {
                        0% { transform: scale(1); opacity: 1; }
                        100% { transform: scale(0.3) translateY(40px); opacity: 0.3; }
                    }

                    .peekaboo-container {
                        height: 100%;
                        background: ${theme.bg};
                        position: relative;
                        overflow: hidden;
                    }

                    .peekaboo-header {
                        background: rgba(255,255,255,0.95);
                        padding: 8px 12px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 2px 15px rgba(0,0,0,0.1);
                        border-bottom: 4px solid ${theme.accent};
                    }

                    .peekaboo-back-btn {
                        background: none;
                        border: none;
                        font-size: 14px;
                        color: #666;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    .peekaboo-title {
                        font-size: 20px;
                        font-weight: 900;
                        color: ${theme.accent};
                        text-shadow: 2px 2px 0 white;
                    }

                    .peekaboo-theme-btn {
                        background: ${theme.accent};
                        color: white;
                        border: none;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        font-size: 18px;
                        cursor: pointer;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                    }

                    .peekaboo-game-area {
                        position: absolute;
                        top: 70px;
                        left: 0;
                        right: 0;
                        bottom: 60px;
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        grid-template-rows: repeat(2, 1fr);
                        gap: 10px;
                        padding: 10px;
                    }

                    .peekaboo-spot {
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    }

                    /* 動物（画面の1/3サイズ） */
                    .peekaboo-animal {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) scale(0);
                        font-size: min(35vw, 180px);
                        z-index: 50;
                        opacity: 0;
                        filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
                        transition: none;
                        pointer-events: none;
                    }

                    .peekaboo-animal.visible {
                        animation: peekaboo-pop-animal 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                    }

                    /* ばぁ！テキスト */
                    .peekaboo-baa {
                        position: fixed;
                        top: 18%;
                        left: 50%;
                        transform: translateX(-50%) scale(0);
                        font-size: min(12vw, 60px);
                        font-weight: 900;
                        color: ${theme.accent};
                        text-shadow: 3px 3px 0 white, -2px -2px 0 white,
                                     4px 4px 10px rgba(0,0,0,0.2);
                        white-space: nowrap;
                        z-index: 60;
                        opacity: 0;
                        letter-spacing: 0.15em;
                        pointer-events: none;
                    }

                    .peekaboo-baa.visible {
                        animation: peekaboo-pop-text 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                    }

                    /* 隠れアイコン */
                    .peekaboo-hide-icon {
                        font-size: min(18vw, 90px);
                        animation: peekaboo-wiggle 3s ease-in-out infinite;
                        filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2));
                        transition: transform 0.4s ease, opacity 0.4s ease;
                    }

                    .peekaboo-hide-icon.open {
                        transform: scale(0.3) translateY(40px);
                        opacity: 0.3;
                        animation: none;
                    }

                    .peekaboo-spot:active .peekaboo-hide-icon:not(.open) {
                        transform: scale(1.15);
                    }

                    /* デコレーション */
                    .peekaboo-deco {
                        position: absolute;
                        pointer-events: none;
                        font-size: 35px;
                        opacity: 0.5;
                        animation: peekaboo-float 4s ease-in-out infinite;
                    }

                    .peekaboo-hint {
                        position: absolute;
                        bottom: 15px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 16px;
                        color: #555;
                        background: rgba(255,255,255,0.95);
                        padding: 10px 25px;
                        border-radius: 25px;
                        box-shadow: 0 3px 15px rgba(0,0,0,0.1);
                        border: 3px solid ${theme.accent};
                        font-weight: bold;
                    }

                    /* テーマ選択モーダル */
                    .theme-modal {
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.6);
                        display: ${showThemeSelect ? 'flex' : 'none'};
                        align-items: center;
                        justify-content: center;
                        z-index: 200;
                    }

                    .theme-modal-content {
                        background: white;
                        border-radius: 25px;
                        padding: 20px;
                        max-width: 90%;
                        max-height: 80%;
                        overflow-y: auto;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    }

                    .theme-modal h3 {
                        text-align: center;
                        color: #FF69B4;
                        margin-bottom: 15px;
                        font-size: 20px;
                    }

                    .theme-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                    }

                    .theme-option {
                        padding: 15px 10px;
                        border-radius: 15px;
                        border: 4px solid transparent;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: bold;
                        text-align: center;
                        transition: transform 0.2s;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                    }

                    .theme-option:active {
                        transform: scale(0.95);
                    }

                    .theme-option.selected {
                        border-color: #333;
                    }

                    /* オーバーレイ（動物表示時の背景） */
                    .peekaboo-overlay {
                        position: fixed;
                        inset: 0;
                        background: rgba(255,255,255,0.3);
                        z-index: 40;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.3s;
                    }

                    .peekaboo-overlay.visible {
                        opacity: 1;
                    }
                </style>

                <div class="peekaboo-container">
                    <div class="peekaboo-header">
                        <button class="peekaboo-back-btn" id="peekaboo-back">← もどる</button>
                        <span class="peekaboo-title">🎀 いないいない ばぁ！</span>
                        <button class="peekaboo-theme-btn" id="theme-btn">🎨</button>
                    </div>

                    <!-- 背景デコレーション -->
                    <div class="peekaboo-deco" style="top:12%;left:5%;">✨</div>
                    <div class="peekaboo-deco" style="top:20%;right:8%;animation-delay:-1s;">💖</div>
                    <div class="peekaboo-deco" style="top:55%;left:3%;animation-delay:-2s;">🌟</div>
                    <div class="peekaboo-deco" style="top:65%;right:5%;animation-delay:-3s;">⭐</div>

                    <!-- オーバーレイ -->
                    <div class="peekaboo-overlay" id="overlay"></div>

                    <div class="peekaboo-game-area">
                        ${theme.hideIcons.map((icon, i) => createSpotHTML(i, icon)).join('')}
                    </div>

                    <div class="peekaboo-hint">👆 タップしてね</div>

                    <!-- テーマ選択モーダル -->
                    <div class="theme-modal" id="theme-modal">
                        <div class="theme-modal-content">
                            <h3>🎨 テーマを えらんでね</h3>
                            <div class="theme-grid">
                                ${themes.map((t, i) => `
                                    <div class="theme-option ${i === currentTheme ? 'selected' : ''}"
                                         data-theme="${i}"
                                         style="background: ${t.bg}; color: ${t.accent};">
                                        ${t.name}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // イベント設定
            container.querySelector('#peekaboo-back').addEventListener('click', () => system.goHome());

            container.querySelector('#theme-btn').addEventListener('click', () => {
                showThemeSelect = true;
                render();
            });

            container.querySelector('#theme-modal').addEventListener('click', (e) => {
                if (e.target.id === 'theme-modal') {
                    showThemeSelect = false;
                    render();
                }
            });

            container.querySelectorAll('.theme-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    currentTheme = parseInt(opt.dataset.theme);
                    showThemeSelect = false;
                    // 状態リセット
                    Object.keys(spotStates).forEach(k => {
                        if (spotStates[k].timeout) clearTimeout(spotStates[k].timeout);
                    });
                    render();
                });
            });

            const spots = container.querySelectorAll('.peekaboo-spot');
            const overlay = container.querySelector('#overlay');

            // オーバーレイ更新
            const updateOverlay = () => {
                const anyOpen = Object.values(spotStates).some(s => s.isOpen);
                overlay.classList.toggle('visible', anyOpen);
            };

            // 元のopenSpot/closeSpotを拡張
            const originalOpenSpot = openSpot;
            const originalCloseSpot = closeSpot;

            spots.forEach(spot => {
                const handleTap = () => {
                    handleSpotTap(spot);
                    updateOverlay();
                };

                spot.addEventListener('click', handleTap);
                spot.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    handleTap();
                }, { passive: false });
            });

            // 画面全体のタッチで最も近い隠れ場所を判定
            container.querySelector('.peekaboo-game-area').addEventListener('touchstart', (e) => {
                if (e.target.closest('.peekaboo-spot')) return;

                const touch = e.touches[0];
                let closestSpot = null;
                let closestDistance = Infinity;

                spots.forEach(spot => {
                    const rect = spot.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const distance = Math.hypot(touch.clientX - centerX, touch.clientY - centerY);

                    if (distance < closestDistance && distance < 120) {
                        closestDistance = distance;
                        closestSpot = spot;
                    }
                });

                if (closestSpot) {
                    handleSpotTap(closestSpot);
                    updateOverlay();
                    createParticles(touch.clientX, touch.clientY);
                }
            }, { passive: true });
        };

        render();

        return () => {
            Object.values(spotStates).forEach(state => {
                if (state.timeout) clearTimeout(state.timeout);
            });
        };
    }
};
