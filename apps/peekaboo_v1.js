/**
 * いないいないばぁ
 * 1歳児向けのかわいいゲーム
 * 隠れ場所をタップすると動物が飛び出す
 */

export default {
    launch(container, system) {
        // 背景テーマ（10種類）
        const themes = [
            { id: 'flower', name: '🌸 おはなばたけ', bg: 'linear-gradient(180deg, #FFE4EC 0%, #FFCCE5 50%, #FFB6D3 100%)', accent: '#FF69B4' },
            { id: 'sky', name: '☁️ おそら', bg: 'linear-gradient(180deg, #E0F4FF 0%, #B8E4FF 50%, #87CEEB 100%)', accent: '#4FC3F7' },
            { id: 'forest', name: '🌲 もり', bg: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)', accent: '#66BB6A' },
            { id: 'candy', name: '🍭 おかし', bg: 'linear-gradient(180deg, #FCE4EC 0%, #F8BBD9 50%, #F48FB1 100%)', accent: '#EC407A' },
            { id: 'rainbow', name: '🌈 にじいろ', bg: 'linear-gradient(180deg, #FFECB3 0%, #FFE0B2 30%, #FFCCBC 60%, #F8BBD9 100%)', accent: '#FF8A65' },
            { id: 'ocean', name: '🐚 うみ', bg: 'linear-gradient(180deg, #E1F5FE 0%, #B3E5FC 50%, #81D4FA 100%)', accent: '#29B6F6' },
            { id: 'sunset', name: '🌅 ゆうやけ', bg: 'linear-gradient(180deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)', accent: '#FFA726' },
            { id: 'lavender', name: '💜 ラベンダー', bg: 'linear-gradient(180deg, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)', accent: '#AB47BC' },
            { id: 'peach', name: '🍑 もも', bg: 'linear-gradient(180deg, #FFF8E1 0%, #FFECB3 50%, #FFE082 100%)', accent: '#FFCA28' },
            { id: 'mint', name: '🍃 ミント', bg: 'linear-gradient(180deg, #E0F2F1 0%, #B2DFDB 50%, #80CBC4 100%)', accent: '#26A69A' },
        ];

        let currentTheme = 0;
        let showThemeSelect = false;

        // かわいい動物データ（SVGベース）
        const animals = [
            { name: 'うさぎ', color: '#FFB6C1', earColor: '#FF69B4', face: '◕ᴗ◕' },
            { name: 'くま', color: '#DEB887', earColor: '#D2691E', face: '●ᴗ●' },
            { name: 'ねこ', color: '#FFE4B5', earColor: '#FFA07A', face: '◕ω◕' },
            { name: 'いぬ', color: '#F5DEB3', earColor: '#D2B48C', face: '◕‿◕' },
            { name: 'パンダ', color: '#FFFFFF', earColor: '#333333', face: '◉ᴗ◉' },
            { name: 'ひよこ', color: '#FFD700', earColor: '#FFA500', face: '◕◡◕' },
            { name: 'ぶた', color: '#FFB6C1', earColor: '#FF69B4', face: '◉◡◉' },
            { name: 'こあら', color: '#A9A9A9', earColor: '#696969', face: '◕‿◕' },
        ];

        // 隠れ場所の状態
        const spotStates = {};

        // かわいい動物のHTML生成
        const createAnimalHTML = (animal) => {
            const isRabbit = animal.name === 'うさぎ';
            const isBear = animal.name === 'くま' || animal.name === 'こあら';
            const isCat = animal.name === 'ねこ';
            const isChick = animal.name === 'ひよこ';
            const isPanda = animal.name === 'パンダ';

            let ears = '';
            if (isRabbit) {
                ears = `
                    <div style="position:absolute;top:-45px;left:15px;width:18px;height:50px;background:${animal.color};border-radius:50%;border:3px solid ${animal.earColor};transform:rotate(-10deg);"></div>
                    <div style="position:absolute;top:-45px;right:15px;width:18px;height:50px;background:${animal.color};border-radius:50%;border:3px solid ${animal.earColor};transform:rotate(10deg);"></div>
                `;
            } else if (isBear || isPanda) {
                const earBg = isPanda ? '#333' : animal.earColor;
                ears = `
                    <div style="position:absolute;top:-15px;left:5px;width:25px;height:25px;background:${earBg};border-radius:50%;"></div>
                    <div style="position:absolute;top:-15px;right:5px;width:25px;height:25px;background:${earBg};border-radius:50%;"></div>
                `;
            } else if (isCat) {
                ears = `
                    <div style="position:absolute;top:-20px;left:5px;width:0;height:0;border-left:15px solid transparent;border-right:15px solid transparent;border-bottom:25px solid ${animal.earColor};"></div>
                    <div style="position:absolute;top:-20px;right:5px;width:0;height:0;border-left:15px solid transparent;border-right:15px solid transparent;border-bottom:25px solid ${animal.earColor};"></div>
                `;
            } else if (isChick) {
                ears = `<div style="position:absolute;top:-15px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:15px solid ${animal.earColor};"></div>`;
            } else {
                ears = `
                    <div style="position:absolute;top:-10px;left:0;width:22px;height:22px;background:${animal.earColor};border-radius:50%;"></div>
                    <div style="position:absolute;top:-10px;right:0;width:22px;height:22px;background:${animal.earColor};border-radius:50%;"></div>
                `;
            }

            const eyeStyle = isPanda ?
                `<div style="position:absolute;top:25px;left:15px;width:25px;height:20px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>
                 <div style="position:absolute;top:25px;right:15px;width:25px;height:20px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>` :
                `<div style="position:absolute;top:28px;left:22px;width:14px;height:14px;background:#333;border-radius:50%;"></div>
                 <div style="position:absolute;top:28px;right:22px;width:14px;height:14px;background:#333;border-radius:50%;"></div>
                 <div style="position:absolute;top:30px;left:25px;width:5px;height:5px;background:white;border-radius:50%;"></div>
                 <div style="position:absolute;top:30px;right:25px;width:5px;height:5px;background:white;border-radius:50%;"></div>`;

            const nose = isChick ?
                `<div style="position:absolute;top:45px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #FF6B35;"></div>` :
                `<div style="position:absolute;top:48px;left:50%;transform:translateX(-50%);width:12px;height:10px;background:${animal.name === 'ぶた' ? '#FF69B4' : '#333'};border-radius:50%;"></div>`;

            const mouth = `<div style="position:absolute;top:58px;left:50%;transform:translateX(-50%);width:20px;height:10px;border-bottom:3px solid #333;border-radius:0 0 50% 50%;"></div>`;

            const cheeks = `
                <div style="position:absolute;top:40px;left:8px;width:15px;height:10px;background:rgba(255,182,193,0.7);border-radius:50%;"></div>
                <div style="position:absolute;top:40px;right:8px;width:15px;height:10px;background:rgba(255,182,193,0.7);border-radius:50%;"></div>
            `;

            return `
                <div class="peekaboo-animal-body" style="background:${animal.color};">
                    ${ears}
                    ${eyeStyle}
                    ${nose}
                    ${mouth}
                    ${cheeks}
                </div>
            `;
        };

        // パーティクルエフェクト
        const createParticles = (x, y, theme) => {
            const particleTypes = ['✨', '💖', '⭐', '🌟', '💕', '🎀', '♡'];
            const count = 12;
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'peekaboo-particle';
                particle.textContent = particleTypes[Math.floor(Math.random() * particleTypes.length)];

                const angle = (i / count) * Math.PI * 2;
                const distance = 100 + Math.random() * 80;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance - 60;

                particle.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: ${20 + Math.random() * 15}px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: peekaboo-particle-fly 1.2s ease-out forwards;
                    --tx: ${tx}px;
                    --ty: ${ty}px;
                `;

                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1200);
            }
        };

        // 隠れ場所を開く
        const openSpot = (spot, index, type) => {
            const state = spotStates[index];
            const animalContainer = spot.querySelector('.peekaboo-animal-container');
            const baaText = spot.querySelector('.peekaboo-baa');
            const hideElement = spot.querySelector('.peekaboo-hide-element');

            state.isOpen = true;

            hideElement.classList.add('open');

            setTimeout(() => {
                animalContainer.classList.add('visible');
                baaText.classList.add('visible');
                system.playSound('correct');
            }, 150);

            if (state.timeout) clearTimeout(state.timeout);

            state.timeout = setTimeout(() => {
                closeSpot(spot, index, type);
            }, 3500);
        };

        // 隠れ場所を閉じる
        const closeSpot = (spot, index, type) => {
            const state = spotStates[index];
            const animalContainer = spot.querySelector('.peekaboo-animal-container');
            const baaText = spot.querySelector('.peekaboo-baa');
            const hideElement = spot.querySelector('.peekaboo-hide-element');

            state.isOpen = false;
            animalContainer.classList.remove('visible');
            baaText.classList.remove('visible');
            hideElement.classList.remove('open');

            setTimeout(() => {
                const newAnimal = animals[Math.floor(Math.random() * animals.length)];
                animalContainer.innerHTML = createAnimalHTML(newAnimal);
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
                createParticles(x, y, themes[currentTheme]);
            }
        };

        // 隠れ場所のHTML生成
        const createSpotHTML = (index, type) => {
            const animal = animals[Math.floor(Math.random() * animals.length)];
            spotStates[index] = { isOpen: false, timeout: null };

            let hideElement = '';
            if (type === 'flower') {
                hideElement = `
                    <div class="peekaboo-hide-element peekaboo-flower-hide">
                        <div class="flower-petal p1"></div>
                        <div class="flower-petal p2"></div>
                        <div class="flower-petal p3"></div>
                        <div class="flower-petal p4"></div>
                        <div class="flower-petal p5"></div>
                        <div class="flower-center"></div>
                    </div>
                `;
            } else if (type === 'cloud') {
                hideElement = `
                    <div class="peekaboo-hide-element peekaboo-cloud-hide">
                        <div class="cloud-puff c1"></div>
                        <div class="cloud-puff c2"></div>
                        <div class="cloud-puff c3"></div>
                    </div>
                `;
            } else if (type === 'present') {
                hideElement = `
                    <div class="peekaboo-hide-element peekaboo-present-hide">
                        <div class="present-box"></div>
                        <div class="present-lid"></div>
                        <div class="present-ribbon"></div>
                        <div class="present-bow"></div>
                    </div>
                `;
            } else if (type === 'heart') {
                hideElement = `
                    <div class="peekaboo-hide-element peekaboo-heart-hide">
                        <div class="heart-shape"></div>
                    </div>
                `;
            } else if (type === 'star') {
                hideElement = `
                    <div class="peekaboo-hide-element peekaboo-star-hide">
                        <div class="star-shape"></div>
                    </div>
                `;
            } else {
                hideElement = `
                    <div class="peekaboo-hide-element peekaboo-bush-hide">
                        <div class="bush-leaf l1"></div>
                        <div class="bush-leaf l2"></div>
                        <div class="bush-leaf l3"></div>
                    </div>
                `;
            }

            return `
                <div class="peekaboo-spot" data-type="${type}" data-index="${index}">
                    <div class="peekaboo-animal-container">
                        ${createAnimalHTML(animal)}
                    </div>
                    <div class="peekaboo-baa">ばぁ！</div>
                    ${hideElement}
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
                        0% { transform: translateY(60px) scale(0); opacity: 0; }
                        50% { transform: translateY(-30px) scale(1.3); opacity: 1; }
                        70% { transform: translateY(10px) scale(0.9); }
                        100% { transform: translateY(0) scale(1); opacity: 1; }
                    }
                    @keyframes peekaboo-pop-text {
                        0% { transform: translateX(-50%) scale(0) rotate(-20deg); }
                        50% { transform: translateX(-50%) scale(1.4) rotate(10deg); }
                        100% { transform: translateX(-50%) scale(1) rotate(0deg); }
                    }
                    @keyframes peekaboo-wiggle {
                        0%, 100% { transform: rotate(-3deg); }
                        50% { transform: rotate(3deg); }
                    }
                    @keyframes peekaboo-float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                    }
                    @keyframes peekaboo-sparkle {
                        0%, 100% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.2); }
                    }

                    .peekaboo-container {
                        height: 100%;
                        background: ${theme.bg};
                        position: relative;
                        overflow: hidden;
                    }

                    .peekaboo-header {
                        background: rgba(255,255,255,0.9);
                        padding: 8px 12px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        border-bottom: 3px solid ${theme.accent};
                    }

                    .peekaboo-title {
                        font-size: 18px;
                        font-weight: 900;
                        color: ${theme.accent};
                        text-shadow: 1px 1px 0 white;
                    }

                    .peekaboo-theme-btn {
                        background: ${theme.accent};
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 15px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    /* 背景デコレーション */
                    .peekaboo-deco {
                        position: absolute;
                        pointer-events: none;
                        font-size: 30px;
                        opacity: 0.6;
                        animation: peekaboo-float 4s ease-in-out infinite;
                    }

                    .peekaboo-game-area {
                        position: absolute;
                        top: 60px;
                        left: 0;
                        right: 0;
                        bottom: 50px;
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        grid-template-rows: repeat(2, 1fr);
                        gap: 15px;
                        padding: 15px;
                    }

                    .peekaboo-spot {
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    }

                    /* 動物コンテナ */
                    .peekaboo-animal-container {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) translateY(60px) scale(0);
                        opacity: 0;
                        z-index: 5;
                        transition: none;
                    }

                    .peekaboo-animal-container.visible {
                        animation: peekaboo-pop-animal 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                    }

                    .peekaboo-animal-body {
                        width: 90px;
                        height: 85px;
                        border-radius: 50% 50% 45% 45%;
                        position: relative;
                        box-shadow: 0 8px 25px rgba(0,0,0,0.2), inset 0 -5px 15px rgba(0,0,0,0.1);
                        border: 4px solid rgba(255,255,255,0.5);
                    }

                    /* ばぁ！テキスト */
                    .peekaboo-baa {
                        position: absolute;
                        top: 5px;
                        left: 50%;
                        transform: translateX(-50%) scale(0);
                        font-size: 26px;
                        font-weight: 900;
                        color: ${theme.accent};
                        text-shadow: 2px 2px 0 white, -1px -1px 0 white, 3px 3px 5px rgba(0,0,0,0.2);
                        white-space: nowrap;
                        z-index: 20;
                        opacity: 0;
                        letter-spacing: 0.1em;
                    }

                    .peekaboo-baa.visible {
                        opacity: 1;
                        animation: peekaboo-pop-text 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                    }

                    /* お花の隠れ場所 */
                    .peekaboo-flower-hide {
                        position: absolute;
                        width: 120px;
                        height: 120px;
                        z-index: 10;
                        transition: transform 0.4s ease;
                    }

                    .peekaboo-flower-hide.open {
                        transform: scale(0.3) translateY(80px);
                        opacity: 0.5;
                    }

                    .flower-petal {
                        position: absolute;
                        width: 45px;
                        height: 55px;
                        background: linear-gradient(135deg, #FFB6C1, #FF69B4);
                        border-radius: 50% 50% 50% 50%;
                        top: 50%;
                        left: 50%;
                        transform-origin: center bottom;
                        box-shadow: inset 0 5px 15px rgba(255,255,255,0.5);
                    }

                    .flower-petal.p1 { transform: translate(-50%, -100%) rotate(0deg); }
                    .flower-petal.p2 { transform: translate(-50%, -100%) rotate(72deg); }
                    .flower-petal.p3 { transform: translate(-50%, -100%) rotate(144deg); }
                    .flower-petal.p4 { transform: translate(-50%, -100%) rotate(216deg); }
                    .flower-petal.p5 { transform: translate(-50%, -100%) rotate(288deg); }

                    .flower-center {
                        position: absolute;
                        width: 40px;
                        height: 40px;
                        background: linear-gradient(135deg, #FFD700, #FFA500);
                        border-radius: 50%;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                    }

                    /* 雲の隠れ場所 */
                    .peekaboo-cloud-hide {
                        position: absolute;
                        width: 130px;
                        height: 80px;
                        z-index: 10;
                        transition: transform 0.4s ease, opacity 0.4s ease;
                    }

                    .peekaboo-cloud-hide.open {
                        transform: translateY(-60px) scale(0.5);
                        opacity: 0;
                    }

                    .cloud-puff {
                        position: absolute;
                        background: white;
                        border-radius: 50%;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1), inset 0 -10px 20px rgba(200,200,255,0.3);
                    }

                    .cloud-puff.c1 { width: 70px; height: 60px; bottom: 0; left: 30px; }
                    .cloud-puff.c2 { width: 55px; height: 50px; bottom: 10px; left: 0; }
                    .cloud-puff.c3 { width: 55px; height: 50px; bottom: 10px; right: 0; }

                    /* プレゼントの隠れ場所 */
                    .peekaboo-present-hide {
                        position: absolute;
                        width: 100px;
                        height: 100px;
                        z-index: 10;
                    }

                    .present-box {
                        position: absolute;
                        bottom: 0;
                        left: 5px;
                        width: 90px;
                        height: 70px;
                        background: linear-gradient(135deg, #FF69B4, #FF1493);
                        border-radius: 8px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    }

                    .present-lid {
                        position: absolute;
                        bottom: 65px;
                        left: 0;
                        width: 100px;
                        height: 25px;
                        background: linear-gradient(135deg, #FF69B4, #C71585);
                        border-radius: 5px;
                        transition: transform 0.4s ease;
                        transform-origin: bottom left;
                    }

                    .peekaboo-present-hide.open .present-lid {
                        transform: rotateZ(-30deg) translateY(-20px);
                    }

                    .present-ribbon {
                        position: absolute;
                        bottom: 0;
                        left: 42px;
                        width: 16px;
                        height: 90px;
                        background: linear-gradient(90deg, #FFD700, #FFC107);
                    }

                    .present-bow {
                        position: absolute;
                        bottom: 85px;
                        left: 35px;
                        width: 30px;
                        height: 20px;
                        background: #FFD700;
                        border-radius: 50%;
                        transition: transform 0.4s ease;
                    }

                    .peekaboo-present-hide.open .present-bow {
                        transform: translateY(-25px) rotate(-30deg);
                    }

                    /* ハートの隠れ場所 */
                    .peekaboo-heart-hide {
                        position: absolute;
                        z-index: 10;
                        transition: transform 0.4s ease;
                    }

                    .peekaboo-heart-hide.open {
                        transform: scale(0.3) translateY(60px);
                        opacity: 0.5;
                    }

                    .heart-shape {
                        width: 100px;
                        height: 90px;
                        background: linear-gradient(135deg, #FF6B9D, #FF1493);
                        position: relative;
                        transform: rotate(-45deg);
                        box-shadow: 0 5px 20px rgba(255,20,147,0.4);
                        animation: peekaboo-wiggle 2s ease-in-out infinite;
                    }

                    .heart-shape::before,
                    .heart-shape::after {
                        content: '';
                        position: absolute;
                        width: 100px;
                        height: 90px;
                        background: linear-gradient(135deg, #FF6B9D, #FF1493);
                        border-radius: 50%;
                    }

                    .heart-shape::before { top: -45px; left: 0; }
                    .heart-shape::after { left: 45px; top: 0; }

                    /* 星の隠れ場所 */
                    .peekaboo-star-hide {
                        position: absolute;
                        z-index: 10;
                        transition: transform 0.4s ease;
                        animation: peekaboo-sparkle 2s ease-in-out infinite;
                    }

                    .peekaboo-star-hide.open {
                        transform: scale(0.2) rotate(180deg);
                        opacity: 0;
                    }

                    .star-shape {
                        width: 100px;
                        height: 100px;
                        background: linear-gradient(135deg, #FFD700, #FFA500);
                        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                        box-shadow: 0 0 30px rgba(255,215,0,0.6);
                    }

                    /* 草むらの隠れ場所 */
                    .peekaboo-bush-hide {
                        position: absolute;
                        width: 130px;
                        height: 90px;
                        z-index: 10;
                        transition: transform 0.3s ease;
                    }

                    .peekaboo-bush-hide.open {
                        transform: scale(0.4) translateY(60px);
                        opacity: 0.5;
                    }

                    .bush-leaf {
                        position: absolute;
                        background: linear-gradient(180deg, #7CB342, #558B2F);
                        border-radius: 50%;
                        box-shadow: inset 0 5px 15px rgba(255,255,255,0.3);
                    }

                    .bush-leaf.l1 { width: 80px; height: 70px; bottom: 0; left: 25px; }
                    .bush-leaf.l2 { width: 60px; height: 55px; bottom: 15px; left: 0; background: linear-gradient(180deg, #8BC34A, #689F38); }
                    .bush-leaf.l3 { width: 60px; height: 55px; bottom: 15px; right: 0; background: linear-gradient(180deg, #8BC34A, #689F38); }

                    .peekaboo-spot:active .peekaboo-hide-element:not(.open) {
                        transform: scale(1.05);
                    }

                    .peekaboo-hint {
                        position: absolute;
                        bottom: 12px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 14px;
                        color: #666;
                        background: rgba(255,255,255,0.9);
                        padding: 8px 20px;
                        border-radius: 20px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        border: 2px solid ${theme.accent};
                    }

                    /* テーマ選択モーダル */
                    .theme-modal {
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.5);
                        display: ${showThemeSelect ? 'flex' : 'none'};
                        align-items: center;
                        justify-content: center;
                        z-index: 100;
                    }

                    .theme-modal-content {
                        background: white;
                        border-radius: 20px;
                        padding: 20px;
                        max-width: 90%;
                        max-height: 80%;
                        overflow-y: auto;
                    }

                    .theme-modal h3 {
                        text-align: center;
                        color: #FF69B4;
                        margin-bottom: 15px;
                        font-size: 18px;
                    }

                    .theme-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10px;
                    }

                    .theme-option {
                        padding: 12px;
                        border-radius: 12px;
                        border: 3px solid transparent;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        text-align: center;
                        transition: transform 0.2s;
                    }

                    .theme-option:active {
                        transform: scale(0.95);
                    }

                    .theme-option.selected {
                        border-color: #333;
                    }
                </style>

                <div class="peekaboo-container">
                    <div class="peekaboo-header">
                        <button id="peekaboo-back" class="text-gray-500 font-bold text-sm">← もどる</button>
                        <span class="peekaboo-title">🎀 いないいない ばぁ！</span>
                        <button class="peekaboo-theme-btn" id="theme-btn">🎨</button>
                    </div>

                    <!-- 背景デコレーション -->
                    <div class="peekaboo-deco" style="top:15%;left:5%;">✨</div>
                    <div class="peekaboo-deco" style="top:25%;right:8%;animation-delay:-1s;">💖</div>
                    <div class="peekaboo-deco" style="top:60%;left:3%;animation-delay:-2s;">🌟</div>
                    <div class="peekaboo-deco" style="top:70%;right:5%;animation-delay:-3s;">⭐</div>

                    <div class="peekaboo-game-area">
                        ${createSpotHTML(0, 'flower')}
                        ${createSpotHTML(1, 'cloud')}
                        ${createSpotHTML(2, 'present')}
                        ${createSpotHTML(3, 'heart')}
                        ${createSpotHTML(4, 'star')}
                        ${createSpotHTML(5, 'bush')}
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
                    render();
                });
            });

            const spots = container.querySelectorAll('.peekaboo-spot');
            spots.forEach(spot => {
                spot.addEventListener('click', () => handleSpotTap(spot));
                spot.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    handleSpotTap(spot);
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

                    if (distance < closestDistance && distance < 100) {
                        closestDistance = distance;
                        closestSpot = spot;
                    }
                });

                if (closestSpot) {
                    handleSpotTap(closestSpot);
                    createParticles(touch.clientX, touch.clientY, themes[currentTheme]);
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
