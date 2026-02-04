/**
 * いないいないばぁ
 * 1歳児向けのかわいいゲーム
 * 隠れ場所をタップすると動物が飛び出す
 */

export default {
    launch(container, system) {
        // 動物の絵文字リスト
        const animals = ['🐼', '🦁', '🐰', '🐘', '🐶', '🐱', '🐻', '🐨', '🦊', '🐷', '🐮', '🐸'];

        // パーティクルの絵文字
        const particleEmojis = ['⭐', '✨', '💫', '🌟', '💖', '💕', '🎀'];

        // 各隠れ場所の状態
        const spotStates = {};

        // パーティクルエフェクト
        const createParticles = (x, y) => {
            const count = 8;
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'peekaboo-particle';
                particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];

                const angle = (i / count) * Math.PI * 2;
                const distance = 80 + Math.random() * 60;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance - 50;

                particle.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: peekaboo-particle-fly 1s ease-out forwards;
                    --tx: ${tx}px;
                    --ty: ${ty}px;
                `;

                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1000);
            }
        };

        // 隠れ場所を開く
        const openSpot = (spot, index, type) => {
            const state = spotStates[index];
            const animal = spot.querySelector('.peekaboo-animal');
            const baaText = spot.querySelector('.peekaboo-baa');

            state.isOpen = true;

            if (type === 'door') {
                spot.querySelector('.peekaboo-door').classList.add('open');
            } else if (type === 'box') {
                spot.querySelector('.peekaboo-lid').classList.add('open');
            }

            setTimeout(() => {
                animal.classList.add('visible');
                baaText.classList.add('visible');
                system.playSound('correct');
            }, type === 'grass' ? 0 : 200);

            if (state.timeout) clearTimeout(state.timeout);

            state.timeout = setTimeout(() => {
                closeSpot(spot, index, type);
            }, 3000);
        };

        // 隠れ場所を閉じる
        const closeSpot = (spot, index, type) => {
            const state = spotStates[index];
            const animal = spot.querySelector('.peekaboo-animal');
            const baaText = spot.querySelector('.peekaboo-baa');

            state.isOpen = false;
            animal.classList.remove('visible');
            baaText.classList.remove('visible');

            if (type === 'door') {
                spot.querySelector('.peekaboo-door').classList.remove('open');
            } else if (type === 'box') {
                spot.querySelector('.peekaboo-lid').classList.remove('open');
            }

            setTimeout(() => {
                animal.textContent = animals[Math.floor(Math.random() * animals.length)];
            }, 400);

            if (state.timeout) {
                clearTimeout(state.timeout);
                state.timeout = null;
            }
        };

        // タップ処理
        const handleSpotTap = (spot) => {
            const index = parseInt(spot.dataset.index);
            const type = spot.dataset.type;
            const state = spotStates[index];

            const rect = spot.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            if (state.isOpen) {
                closeSpot(spot, index, type);
            } else {
                openSpot(spot, index, type);
                createParticles(x, y);
            }
        };

        // 隠れ場所のHTML生成
        const createSpotHTML = (index, type) => {
            const animal = animals[Math.floor(Math.random() * animals.length)];
            spotStates[index] = { isOpen: false, timeout: null };

            let hideElement = '';
            if (type === 'grass') {
                hideElement = '<div class="peekaboo-grass"></div>';
            } else if (type === 'door') {
                hideElement = `
                    <div class="peekaboo-door-container">
                        <div class="peekaboo-door-frame"></div>
                        <div class="peekaboo-door"></div>
                    </div>
                `;
            } else if (type === 'box') {
                hideElement = `
                    <div class="peekaboo-box-container">
                        <div class="peekaboo-box"></div>
                        <div class="peekaboo-lid"></div>
                    </div>
                `;
            }

            return `
                <div class="peekaboo-spot" data-type="${type}" data-index="${index}">
                    <div class="peekaboo-animal">${animal}</div>
                    <div class="peekaboo-baa">ばぁ！</div>
                    ${hideElement}
                </div>
            `;
        };

        // 描画
        container.innerHTML = `
            <style>
                @keyframes peekaboo-particle-fly {
                    0% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg); }
                    100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg); }
                }
                @keyframes peekaboo-bounce {
                    0% { transform: translateY(30px) scale(0.5); opacity: 0; }
                    50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
                    100% { transform: translateY(-10px) scale(1); opacity: 1; }
                }
                @keyframes peekaboo-pop {
                    0% { transform: translateX(-50%) scale(0); }
                    50% { transform: translateX(-50%) scale(1.3); }
                    100% { transform: translateX(-50%) scale(1); }
                }
                @keyframes peekaboo-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes peekaboo-sway {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(5deg); }
                }

                .peekaboo-container {
                    height: 100%;
                    background: linear-gradient(180deg, #87CEEB 0%, #98FB98 50%, #90EE90 100%);
                    position: relative;
                    overflow: hidden;
                }

                .peekaboo-header {
                    background: white;
                    padding: 8px 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .peekaboo-title {
                    font-size: 20px;
                    font-weight: 900;
                    color: #FF69B4;
                    text-shadow: 2px 2px 0 white;
                }

                .peekaboo-sky {
                    position: absolute;
                    top: 50px;
                    left: 0;
                    right: 0;
                    height: 100px;
                    pointer-events: none;
                }

                .peekaboo-sun {
                    position: absolute;
                    top: 10px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    background: #FFD700;
                    border-radius: 50%;
                    box-shadow: 0 0 20px #FFD700, 0 0 40px #FFA500;
                    animation: peekaboo-float 3s ease-in-out infinite;
                }

                .peekaboo-cloud {
                    position: absolute;
                    background: white;
                    border-radius: 30px;
                    opacity: 0.9;
                }

                .peekaboo-cloud-1 {
                    width: 60px;
                    height: 25px;
                    top: 20px;
                    left: 10%;
                }

                .peekaboo-cloud-2 {
                    width: 80px;
                    height: 30px;
                    top: 5px;
                    left: 40%;
                }

                .peekaboo-game-area {
                    position: absolute;
                    top: 120px;
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
                    min-height: 100px;
                }

                .peekaboo-animal {
                    position: absolute;
                    font-size: 50px;
                    z-index: 1;
                    opacity: 0;
                    transform: translateY(30px) scale(0.5);
                    transition: none;
                    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                }

                .peekaboo-animal.visible {
                    animation: peekaboo-bounce 0.5s ease forwards;
                }

                .peekaboo-baa {
                    position: absolute;
                    top: 5px;
                    left: 50%;
                    transform: translateX(-50%) scale(0);
                    font-size: 18px;
                    font-weight: 900;
                    color: #FF1493;
                    text-shadow: 1px 1px 0 white;
                    white-space: nowrap;
                    z-index: 10;
                    opacity: 0;
                }

                .peekaboo-baa.visible {
                    opacity: 1;
                    animation: peekaboo-pop 0.4s ease forwards;
                }

                /* 草むら */
                .peekaboo-grass {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 65%;
                    background: linear-gradient(180deg, #32CD32 0%, #228B22 50%, #006400 100%);
                    border-radius: 50% 50% 0 0;
                    z-index: 2;
                    box-shadow: inset 0 10px 20px rgba(255,255,255,0.3);
                    transition: transform 0.2s ease;
                }

                .peekaboo-spot:active .peekaboo-grass {
                    transform: scale(1.05);
                }

                /* ドア */
                .peekaboo-door-container {
                    position: absolute;
                    bottom: 0;
                    width: 70%;
                    height: 85%;
                    perspective: 400px;
                }

                .peekaboo-door-frame {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(180deg, #FFB6C1 0%, #FF69B4 100%);
                    border-radius: 8px 8px 0 0;
                    z-index: 1;
                }

                .peekaboo-door {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(180deg, #DEB887 0%, #D2691E 100%);
                    border-radius: 8px 8px 0 0;
                    border: 3px solid #8B4513;
                    z-index: 2;
                    transform-origin: left center;
                    transition: transform 0.4s ease;
                    box-shadow: inset -15px 0 25px rgba(0,0,0,0.2);
                }

                .peekaboo-door::before {
                    content: '';
                    position: absolute;
                    right: 15%;
                    top: 45%;
                    width: 10px;
                    height: 10px;
                    background: #FFD700;
                    border-radius: 50%;
                }

                .peekaboo-door.open {
                    transform: rotateY(-70deg);
                }

                /* 箱 */
                .peekaboo-box-container {
                    position: absolute;
                    bottom: 0;
                    width: 80%;
                    height: 70%;
                }

                .peekaboo-box {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 75%;
                    background: linear-gradient(180deg, #FF69B4 0%, #FF1493 100%);
                    border-radius: 6px;
                    border: 3px solid #C71585;
                    z-index: 1;
                }

                .peekaboo-box::before {
                    content: '♡';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 24px;
                    color: white;
                    opacity: 0.5;
                }

                .peekaboo-lid {
                    position: absolute;
                    top: 15%;
                    width: 110%;
                    left: -5%;
                    height: 22%;
                    background: linear-gradient(180deg, #FF69B4 0%, #C71585 100%);
                    border-radius: 4px;
                    border: 3px solid #C71585;
                    z-index: 2;
                    transform-origin: bottom center;
                    transition: transform 0.3s ease;
                }

                .peekaboo-lid.open {
                    transform: rotateX(-120deg) translateY(-8px);
                }

                /* 花の装飾 */
                .peekaboo-flowers {
                    position: absolute;
                    bottom: 50px;
                    left: 0;
                    right: 0;
                    height: 40px;
                    pointer-events: none;
                    display: flex;
                    justify-content: space-around;
                    padding: 0 20px;
                }

                .peekaboo-flower {
                    font-size: 28px;
                    animation: peekaboo-sway 3s ease-in-out infinite;
                }

                .peekaboo-flower:nth-child(2) { animation-delay: -1s; }
                .peekaboo-flower:nth-child(3) { animation-delay: -2s; }

                .peekaboo-hint {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 14px;
                    color: #666;
                    background: rgba(255,255,255,0.8);
                    padding: 6px 14px;
                    border-radius: 15px;
                }
            </style>

            <div class="peekaboo-container">
                <div class="peekaboo-header">
                    <button id="peekaboo-back" class="text-gray-500 font-bold text-sm">← もどる</button>
                    <span class="peekaboo-title">🎀 いないいない ばぁ！</span>
                    <div style="width: 50px;"></div>
                </div>

                <div class="peekaboo-sky">
                    <div class="peekaboo-sun"></div>
                    <div class="peekaboo-cloud peekaboo-cloud-1"></div>
                    <div class="peekaboo-cloud peekaboo-cloud-2"></div>
                </div>

                <div class="peekaboo-game-area">
                    ${createSpotHTML(0, 'grass')}
                    ${createSpotHTML(1, 'door')}
                    ${createSpotHTML(2, 'box')}
                    ${createSpotHTML(3, 'box')}
                    ${createSpotHTML(4, 'door')}
                    ${createSpotHTML(5, 'grass')}
                </div>

                <div class="peekaboo-flowers">
                    <span class="peekaboo-flower">🌸</span>
                    <span class="peekaboo-flower">🌷</span>
                    <span class="peekaboo-flower">🌼</span>
                </div>

                <div class="peekaboo-hint">👆 タップしてね</div>
            </div>
        `;

        // イベント設定
        container.querySelector('#peekaboo-back').addEventListener('click', () => system.goHome());

        const spots = container.querySelectorAll('.peekaboo-spot');
        spots.forEach(spot => {
            spot.addEventListener('click', () => handleSpotTap(spot));
            spot.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleSpotTap(spot);
            }, { passive: false });
        });

        // 画面全体のタッチで最も近い隠れ場所を判定（1歳児対応）
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
                createParticles(touch.clientX, touch.clientY);
            }
        }, { passive: true });

        return () => {
            // クリーンアップ
            Object.values(spotStates).forEach(state => {
                if (state.timeout) clearTimeout(state.timeout);
            });
        };
    }
};
