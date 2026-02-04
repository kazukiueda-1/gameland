/**
 * めいろあそび
 * 5〜6歳向けのかわいい迷路ゲーム
 */

export default {
    launch(container, system) {
        let currentLevel = 0;
        let playerPos = { x: 0, y: 0 };
        let goalPos = { x: 0, y: 0 };
        let maze = [];
        let moveCount = 0;
        let showCelebration = false;
        let completedLevels = [];

        // キャラクターと目標のテーマ
        const themes = [
            { player: '🐰', goal: '🥕', name: 'うさぎさん', goalName: 'にんじん' },
            { player: '🐱', goal: '🐟', name: 'ねこちゃん', goalName: 'おさかな' },
            { player: '🐶', goal: '🦴', name: 'わんちゃん', goalName: 'ほね' },
            { player: '🐭', goal: '🧀', name: 'ねずみさん', goalName: 'チーズ' },
            { player: '🐻', goal: '🍯', name: 'くまさん', goalName: 'はちみつ' },
            { player: '🐼', goal: '🎋', name: 'パンダさん', goalName: 'ささ' },
        ];

        // 迷路データ（0=通路, 1=壁, 2=スタート, 3=ゴール）
        const levels = [
            // レベル1: とても簡単（5x5）
            {
                maze: [
                    [2, 0, 1, 1, 1],
                    [1, 0, 0, 0, 1],
                    [1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 1],
                    [1, 1, 1, 0, 3],
                ],
                theme: 0
            },
            // レベル2: 簡単（5x5）
            {
                maze: [
                    [2, 0, 0, 1, 1],
                    [1, 1, 0, 0, 1],
                    [1, 0, 0, 1, 1],
                    [1, 0, 1, 0, 0],
                    [1, 0, 0, 0, 3],
                ],
                theme: 1
            },
            // レベル3: 簡単（6x6）
            {
                maze: [
                    [2, 0, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 0, 1],
                    [1, 0, 1, 0, 0, 1],
                    [1, 0, 0, 0, 1, 1],
                    [1, 1, 1, 0, 0, 3],
                ],
                theme: 2
            },
            // レベル4: 普通（6x6）
            {
                maze: [
                    [1, 1, 2, 0, 1, 1],
                    [1, 0, 1, 0, 0, 1],
                    [1, 0, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 1, 0, 1, 0, 1],
                    [3, 0, 0, 1, 0, 1],
                ],
                theme: 3
            },
            // レベル5: 普通（7x7）
            {
                maze: [
                    [2, 0, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 1],
                    [1, 1, 1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 1, 0, 1],
                    [1, 1, 1, 0, 0, 0, 3],
                ],
                theme: 4
            },
            // レベル6: やや難しい（7x7）
            {
                maze: [
                    [1, 1, 1, 2, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1, 0, 1],
                    [1, 0, 1, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 0, 3],
                ],
                theme: 5
            },
            // レベル7: 難しい（8x8）
            {
                maze: [
                    [2, 0, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 1],
                    [1, 1, 1, 0, 1, 0, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1, 0, 1],
                    [1, 0, 1, 0, 0, 0, 0, 1],
                    [1, 0, 0, 0, 1, 1, 0, 1],
                    [1, 1, 1, 0, 1, 1, 0, 3],
                ],
                theme: 0
            },
            // レベル8: 難しい（8x8）
            {
                maze: [
                    [1, 1, 1, 1, 2, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1, 0, 1],
                    [1, 0, 1, 0, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 0, 1, 1, 1],
                    [3, 0, 0, 0, 0, 1, 1, 1],
                ],
                theme: 1
            },
        ];

        // 迷路を初期化
        const initLevel = (levelIndex) => {
            if (levelIndex >= levels.length) {
                levelIndex = 0;
            }
            currentLevel = levelIndex;
            const level = levels[levelIndex];
            maze = level.maze.map(row => [...row]);
            moveCount = 0;

            for (let y = 0; y < maze.length; y++) {
                for (let x = 0; x < maze[y].length; x++) {
                    if (maze[y][x] === 2) {
                        playerPos = { x, y };
                    } else if (maze[y][x] === 3) {
                        goalPos = { x, y };
                    }
                }
            }
            render();
        };

        // プレイヤーを移動
        const movePlayer = (dx, dy) => {
            if (showCelebration) return;

            const newX = playerPos.x + dx;
            const newY = playerPos.y + dy;

            if (newY < 0 || newY >= maze.length || newX < 0 || newX >= maze[0].length) {
                return;
            }

            if (maze[newY][newX] === 1) {
                system.playSound('wrong');
                return;
            }

            playerPos = { x: newX, y: newY };
            moveCount++;
            system.playSound('click');

            if (newX === goalPos.x && newY === goalPos.y) {
                showCelebration = true;
                if (!completedLevels.includes(currentLevel)) {
                    completedLevels.push(currentLevel);
                }
                system.playSound('correct');
            }

            render();
        };

        // キーボード操作
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp': movePlayer(0, -1); break;
                case 'ArrowDown': movePlayer(0, 1); break;
                case 'ArrowLeft': movePlayer(-1, 0); break;
                case 'ArrowRight': movePlayer(1, 0); break;
            }
        };

        // 描画
        const render = () => {
            const level = levels[currentLevel];
            const theme = themes[level.theme];
            const cellSize = Math.min(44, Math.floor((window.innerWidth - 48) / maze[0].length));

            container.innerHTML = `
                <style>
                    .maze-cell {
                        width: ${cellSize}px;
                        height: ${cellSize}px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: ${cellSize * 0.65}px;
                    }
                    .wall { background: linear-gradient(135deg, #8B4513, #A0522D); border: 1px solid #654321; }
                    .path { background: linear-gradient(135deg, #90EE90, #98FB98); border: 1px solid #7CFC00; }
                    .control-btn {
                        width: 56px;
                        height: 56px;
                        font-size: 22px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #FFB6C1, #FFC0CB);
                        border: 3px solid #FF69B4;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                    }
                    .control-btn:active { transform: scale(0.9); }
                    @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
                    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                    .player-bounce { animation: bounce 0.5s ease-in-out infinite; }
                    .goal-float { animation: float 1s ease-in-out infinite; }
                </style>

                <div class="h-full flex flex-col bg-gradient-to-b from-green-100 to-blue-100">
                    <div class="bg-white shadow px-3 py-2 flex justify-between items-center">
                        <button id="btn-back" class="text-gray-500 font-bold text-sm">← もどる</button>
                        <h1 class="text-lg font-black text-green-600">🌳 めいろあそび</h1>
                        <button id="btn-levels" class="text-green-500 font-bold text-sm">📋</button>
                    </div>

                    <div class="bg-white/80 mx-3 mt-2 rounded-xl p-2 flex justify-between items-center">
                        <div class="flex items-center gap-1">
                            <span class="text-xl">${theme.player}</span>
                            <span class="font-bold text-gray-700 text-sm">${theme.name}</span>
                        </div>
                        <span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold text-sm">
                            レベル ${currentLevel + 1}
                        </span>
                        <div class="flex items-center gap-1">
                            <span class="font-bold text-gray-700 text-sm">${theme.goalName}</span>
                            <span class="text-xl">${theme.goal}</span>
                        </div>
                    </div>

                    <div class="flex-1 flex items-center justify-center p-2">
                        <div class="bg-white rounded-2xl p-2 shadow-lg">
                            ${maze.map((row, y) => `
                                <div class="flex">
                                    ${row.map((cell, x) => {
                                        const isPlayer = playerPos.x === x && playerPos.y === y;
                                        const isGoal = goalPos.x === x && goalPos.y === y;
                                        const isWall = cell === 1;
                                        let content = '';
                                        let extraClass = '';
                                        if (isPlayer) { content = theme.player; extraClass = 'player-bounce'; }
                                        else if (isGoal) { content = theme.goal; extraClass = 'goal-float'; }
                                        return `<div class="maze-cell ${isWall ? 'wall' : 'path'}"><span class="${extraClass}">${content}</span></div>`;
                                    }).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-white/90 p-2 border-t">
                        <div class="flex flex-col items-center gap-1">
                            <button class="control-btn" data-dir="up">⬆️</button>
                            <div class="flex gap-12">
                                <button class="control-btn" data-dir="left">⬅️</button>
                                <button class="control-btn" data-dir="right">➡️</button>
                            </div>
                            <button class="control-btn" data-dir="down">⬇️</button>
                        </div>
                        <div class="flex justify-center gap-4 mt-2">
                            <span class="text-sm text-gray-500 font-bold">${moveCount}かい あるいた</span>
                            <button id="btn-retry" class="text-sm text-blue-500 font-bold">🔄 やりなおす</button>
                        </div>
                    </div>
                </div>

                ${showCelebration ? `
                    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" id="celebration-overlay">
                        <div class="bg-white rounded-3xl p-6 mx-4 text-center shadow-2xl max-w-sm w-full" style="animation: bounce-in 0.5s ease-out;">
                            <div class="text-6xl mb-3" style="animation: wiggle 0.5s ease-in-out infinite;">🎉</div>
                            <h3 class="text-2xl font-black text-green-500 mb-2">ゴール！</h3>
                            <p class="text-lg font-bold text-gray-700 mb-1">${theme.name}が ${theme.goalName}を みつけたよ！</p>
                            <p class="text-gray-500 font-bold mb-4">${moveCount}かい あるいたね</p>
                            <div class="flex flex-col gap-2">
                                ${currentLevel < levels.length - 1 ? `
                                    <button id="btn-next-level" class="bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold text-lg py-3 px-6 rounded-full shadow-lg">
                                        つぎの めいろへ →
                                    </button>
                                ` : `<p class="text-yellow-600 font-bold mb-2">🏆 ぜんぶ クリア！</p>`}
                                <button id="btn-retry-celebration" class="bg-gray-200 text-gray-600 font-bold py-2 px-6 rounded-full">もういちど あそぶ</button>
                                <button id="btn-select-level" class="text-gray-500 font-bold text-sm">レベルを えらぶ</button>
                            </div>
                        </div>
                    </div>
                    <style>
                        @keyframes bounce-in { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
                        @keyframes wiggle { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
                    </style>
                ` : ''}
            `;

            setupEventListeners();
        };

        // レベル選択画面
        const renderLevelSelect = () => {
            container.innerHTML = `
                <div class="h-full flex flex-col bg-gradient-to-b from-green-100 to-blue-100">
                    <div class="bg-white shadow px-3 py-2 flex justify-between items-center">
                        <button id="btn-back-to-maze" class="text-gray-500 font-bold text-sm">← もどる</button>
                        <h1 class="text-lg font-black text-green-600">📋 レベルを えらぼう</h1>
                        <div class="w-8"></div>
                    </div>
                    <div class="flex-1 overflow-y-auto p-3">
                        <div class="grid grid-cols-2 gap-3">
                            ${levels.map((level, index) => {
                                const theme = themes[level.theme];
                                const isCompleted = completedLevels.includes(index);
                                return `
                                    <button class="level-btn bg-white rounded-2xl p-3 shadow-md text-center ${isCompleted ? 'border-2 border-green-400' : ''}" data-level="${index}">
                                        <div class="text-2xl mb-1">${theme.player}→${theme.goal}</div>
                                        <p class="font-bold text-gray-700">レベル ${index + 1}</p>
                                        <p class="text-xs text-gray-500">${level.maze.length}×${level.maze[0].length}</p>
                                        ${isCompleted ? '<span class="text-green-500 font-bold text-xs">✓ クリア</span>' : ''}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-back-to-maze')?.addEventListener('click', render);
            container.querySelectorAll('.level-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    showCelebration = false;
                    initLevel(parseInt(btn.dataset.level));
                });
            });
        };

        // イベントリスナー
        const setupEventListeners = () => {
            container.querySelector('#btn-back')?.addEventListener('click', () => {
                document.removeEventListener('keydown', handleKeyDown);
                system.goHome();
            });
            container.querySelector('#btn-levels')?.addEventListener('click', renderLevelSelect);
            container.querySelector('#btn-retry')?.addEventListener('click', () => { showCelebration = false; initLevel(currentLevel); });
            container.querySelectorAll('.control-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const dir = btn.dataset.dir;
                    if (dir === 'up') movePlayer(0, -1);
                    if (dir === 'down') movePlayer(0, 1);
                    if (dir === 'left') movePlayer(-1, 0);
                    if (dir === 'right') movePlayer(1, 0);
                });
            });
            container.querySelector('#btn-next-level')?.addEventListener('click', () => { showCelebration = false; initLevel(currentLevel + 1); });
            container.querySelector('#btn-retry-celebration')?.addEventListener('click', () => { showCelebration = false; initLevel(currentLevel); });
            container.querySelector('#btn-select-level')?.addEventListener('click', () => { showCelebration = false; renderLevelSelect(); });
        };

        document.addEventListener('keydown', handleKeyDown);
        initLevel(0);

        return () => { document.removeEventListener('keydown', handleKeyDown); };
    }
};
