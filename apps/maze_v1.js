/**
 * めいろあそび
 * 5〜6歳向けのかわいい迷路ゲーム
 * 矢印ボタンで操作
 * 全レベルで正解ルートは1つだけ（行き止まりあり）
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
            { player: '🦊', goal: '🍇', name: 'きつねさん', goalName: 'ぶどう' },
            { player: '🐸', goal: '🪷', name: 'かえるさん', goalName: 'はす' },
            { player: '🐧', goal: '❄️', name: 'ペンギンさん', goalName: 'こおり' },
            { player: '🦁', goal: '👑', name: 'ライオンさん', goalName: 'おうかん' },
        ];

        // レベル設定（サイズとテーマ）
        const levelConfigs = [
            { width: 5, height: 5, theme: 0 },    // レベル1
            { width: 7, height: 7, theme: 1 },    // レベル2
            { width: 9, height: 9, theme: 2 },    // レベル3
            { width: 11, height: 11, theme: 3 },  // レベル4
            { width: 13, height: 13, theme: 4 },  // レベル5
            { width: 15, height: 15, theme: 5 },  // レベル6
            { width: 17, height: 17, theme: 6 },  // レベル7
            { width: 21, height: 21, theme: 7 },  // レベル8
            { width: 25, height: 25, theme: 8 },  // レベル9
            { width: 41, height: 41, theme: 9 },  // レベル10: 40x40相当
        ];

        // 迷路生成（再帰的バックトラッキング法）
        // 正解ルートは1つだけで、それ以外は行き止まり
        const generateMaze = (width, height) => {
            // 奇数サイズに調整（壁と通路の交互配置のため）
            const w = width % 2 === 0 ? width + 1 : width;
            const h = height % 2 === 0 ? height + 1 : height;

            // 全て壁で初期化
            const grid = [];
            for (let y = 0; y < h; y++) {
                grid[y] = [];
                for (let x = 0; x < w; x++) {
                    grid[y][x] = 1; // 壁
                }
            }

            // 迷路生成用の訪問済みセル
            const visited = new Set();

            // 方向（上、右、下、左）
            const directions = [
                { dx: 0, dy: -2 },
                { dx: 2, dy: 0 },
                { dx: 0, dy: 2 },
                { dx: -2, dy: 0 }
            ];

            // シャッフル関数
            const shuffle = (array) => {
                const arr = [...array];
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr;
            };

            // 再帰的に迷路を掘る
            const carve = (x, y) => {
                visited.add(`${x},${y}`);
                grid[y][x] = 0; // 通路

                const dirs = shuffle(directions);
                for (const { dx, dy } of dirs) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && !visited.has(`${nx},${ny}`)) {
                        // 壁を壊して通路を作る
                        grid[y + dy / 2][x + dx / 2] = 0;
                        carve(nx, ny);
                    }
                }
            };

            // 開始点から迷路を生成
            carve(1, 1);

            // スタートとゴールを設定
            grid[1][1] = 2; // スタート（左上）
            grid[h - 2][w - 2] = 3; // ゴール（右下）

            return grid;
        };

        // 各レベルの迷路を生成（シードを固定して毎回同じ迷路にする）
        const generateSeededMaze = (width, height, seed) => {
            // 簡易的なシード付き乱数生成器
            let s = seed;
            const random = () => {
                s = (s * 1103515245 + 12345) & 0x7fffffff;
                return s / 0x7fffffff;
            };

            const w = width % 2 === 0 ? width + 1 : width;
            const h = height % 2 === 0 ? height + 1 : height;

            const grid = [];
            for (let y = 0; y < h; y++) {
                grid[y] = [];
                for (let x = 0; x < w; x++) {
                    grid[y][x] = 1;
                }
            }

            const visited = new Set();

            const directions = [
                { dx: 0, dy: -2 },
                { dx: 2, dy: 0 },
                { dx: 0, dy: 2 },
                { dx: -2, dy: 0 }
            ];

            const shuffle = (array) => {
                const arr = [...array];
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr;
            };

            const carve = (x, y) => {
                visited.add(`${x},${y}`);
                grid[y][x] = 0;

                const dirs = shuffle(directions);
                for (const { dx, dy } of dirs) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && !visited.has(`${nx},${ny}`)) {
                        grid[y + dy / 2][x + dx / 2] = 0;
                        carve(nx, ny);
                    }
                }
            };

            carve(1, 1);

            grid[1][1] = 2;
            grid[h - 2][w - 2] = 3;

            return grid;
        };

        // レベルごとのシード値（毎回同じ迷路になる）
        const levelSeeds = [12345, 23456, 34567, 45678, 56789, 67890, 78901, 89012, 90123, 13579];

        // 迷路を初期化
        const initLevel = (levelIndex) => {
            if (levelIndex >= levelConfigs.length) levelIndex = 0;
            currentLevel = levelIndex;
            const config = levelConfigs[levelIndex];

            // シード付きで迷路を生成
            maze = generateSeededMaze(config.width, config.height, levelSeeds[levelIndex]);
            moveCount = 0;

            // スタートとゴールの位置を取得
            for (let y = 0; y < maze.length; y++) {
                for (let x = 0; x < maze[y].length; x++) {
                    if (maze[y][x] === 2) playerPos = { x, y };
                    else if (maze[y][x] === 3) goalPos = { x, y };
                }
            }
            render();
        };

        // プレイヤーを移動（方向指定）
        const movePlayer = (dx, dy) => {
            if (showCelebration) return;

            const newX = playerPos.x + dx;
            const newY = playerPos.y + dy;

            if (newY < 0 || newY >= maze.length || newX < 0 || newX >= maze[0].length) return;
            if (maze[newY][newX] === 1) return;

            playerPos = { x: newX, y: newY };
            moveCount++;

            if (newX === goalPos.x && newY === goalPos.y) {
                showCelebration = true;
                if (!completedLevels.includes(currentLevel)) {
                    completedLevels.push(currentLevel);
                }
                system.playSound('correct');
            }
            render();
        };

        // 描画
        const render = () => {
            const config = levelConfigs[currentLevel];
            const theme = themes[config.theme];
            const mazeHeight = maze.length;
            const mazeWidth = maze[0].length;

            // 画面サイズに応じてセルサイズを調整
            const maxMazeWidth = Math.min(window.innerWidth - 32, 500);
            const maxMazeHeight = Math.min(window.innerHeight - 280, 400);
            const cellSize = Math.max(Math.floor(Math.min(maxMazeWidth / mazeWidth, maxMazeHeight / mazeHeight)), 6);

            container.innerHTML = `
                <style>
                    .maze-cell {
                        width: ${cellSize}px;
                        height: ${cellSize}px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: ${Math.max(cellSize * 0.7, 8)}px;
                        box-sizing: border-box;
                    }
                    .wall { background: #5D4037; }
                    .path { background: #C8E6C9; }
                    @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
                    @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
                    .player-anim { animation: bounce 0.4s ease-in-out infinite; }
                    .goal-anim { animation: pulse 1.2s ease-in-out infinite; }
                    .arrow-btn {
                        width: 56px; height: 56px;
                        border-radius: 50%;
                        font-size: 24px;
                        display: flex; align-items: center; justify-content: center;
                        background: linear-gradient(145deg, #4CAF50, #388E3C);
                        color: white;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                        border: none;
                        cursor: pointer;
                    }
                    .arrow-btn:active { transform: scale(0.9); }
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
                            Lv.${currentLevel + 1}
                        </span>
                        <div class="flex items-center gap-1">
                            <span class="font-bold text-gray-700 text-sm">${theme.goalName}</span>
                            <span class="text-xl">${theme.goal}</span>
                        </div>
                    </div>

                    <div class="flex-1 flex flex-col items-center justify-center p-2 overflow-auto">
                        <div id="maze-area" class="bg-white rounded-lg shadow-lg" style="line-height: 0;">
                            ${maze.map((row, y) => `
                                <div style="display: flex;">
                                    ${row.map((cell, x) => {
                                        const isPlayer = playerPos.x === x && playerPos.y === y;
                                        const isGoal = goalPos.x === x && goalPos.y === y;
                                        const isWall = cell === 1;
                                        let content = '';
                                        let extraClass = '';
                                        let cellClass = isWall ? 'wall' : 'path';

                                        if (isPlayer) {
                                            content = theme.player;
                                            extraClass = 'player-anim';
                                        } else if (isGoal) {
                                            content = theme.goal;
                                            extraClass = 'goal-anim';
                                        }

                                        return `<div class="maze-cell ${cellClass}"><span class="${extraClass}">${content}</span></div>`;
                                    }).join('')}
                                </div>
                            `).join('')}
                        </div>

                        <!-- 矢印ボタン -->
                        <div class="mt-3 flex flex-col items-center">
                            <button id="btn-up" class="arrow-btn mb-1">▲</button>
                            <div class="flex gap-8">
                                <button id="btn-left" class="arrow-btn">◀</button>
                                <button id="btn-right" class="arrow-btn">▶</button>
                            </div>
                            <button id="btn-down" class="arrow-btn mt-1">▼</button>
                        </div>

                        <div class="flex justify-center gap-4 mt-2">
                            <span class="text-sm text-gray-500 font-bold">${moveCount}かい うごいた</span>
                            <button id="btn-retry" class="text-sm text-blue-500 font-bold">🔄 やりなおす</button>
                        </div>
                    </div>
                </div>

                ${showCelebration ? `
                    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" id="celebration-overlay">
                        <div class="bg-white rounded-3xl p-6 mx-4 text-center shadow-2xl max-w-sm w-full" style="animation: bounceIn 0.5s ease-out;">
                            <div class="text-6xl mb-3" style="animation: wiggle 0.5s ease-in-out infinite;">🎉</div>
                            <h3 class="text-2xl font-black text-green-500 mb-2">ゴール！</h3>
                            <p class="text-lg font-bold text-gray-700 mb-1">${theme.name}が ${theme.goalName}を みつけたよ！</p>
                            <p class="text-gray-500 font-bold mb-4">${moveCount}かい うごいたね</p>
                            <div class="flex flex-col gap-2">
                                ${currentLevel < levelConfigs.length - 1 ? `
                                    <button id="btn-next-level" class="bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold text-lg py-3 px-6 rounded-full shadow-lg active:scale-95">
                                        つぎの めいろへ →
                                    </button>
                                ` : `<p class="text-yellow-600 font-bold mb-2">🏆 ぜんぶ クリア！すごい！</p>`}
                                <button id="btn-retry-celebration" class="bg-gray-200 text-gray-600 font-bold py-2 px-6 rounded-full">もういちど あそぶ</button>
                                <button id="btn-select-level" class="text-gray-500 font-bold text-sm">レベルを えらぶ</button>
                            </div>
                        </div>
                    </div>
                    <style>
                        @keyframes bounceIn { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
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
                            ${levelConfigs.map((config, index) => {
                                const theme = themes[config.theme];
                                const isCompleted = completedLevels.includes(index);
                                const difficulty = index < 3 ? 'かんたん' : index < 6 ? 'ふつう' : index < 9 ? 'むずかしい' : 'ちょうむずかしい';
                                const diffColor = index < 3 ? 'green' : index < 6 ? 'yellow' : index < 9 ? 'orange' : 'red';
                                return `
                                    <button class="level-btn bg-white rounded-2xl p-3 shadow-md text-center ${isCompleted ? 'border-2 border-green-400' : ''}" data-level="${index}">
                                        <div class="text-2xl mb-1">${theme.player}→${theme.goal}</div>
                                        <p class="font-bold text-gray-700">レベル ${index + 1}</p>
                                        <p class="text-xs text-${diffColor}-500 font-bold">${difficulty}</p>
                                        <p class="text-xs text-gray-400">${config.width}×${config.height}</p>
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
            container.querySelector('#btn-back')?.addEventListener('click', () => system.goHome());
            container.querySelector('#btn-levels')?.addEventListener('click', renderLevelSelect);
            container.querySelector('#btn-retry')?.addEventListener('click', () => { showCelebration = false; initLevel(currentLevel); });
            container.querySelector('#btn-next-level')?.addEventListener('click', () => { showCelebration = false; initLevel(currentLevel + 1); });
            container.querySelector('#btn-retry-celebration')?.addEventListener('click', () => { showCelebration = false; initLevel(currentLevel); });
            container.querySelector('#btn-select-level')?.addEventListener('click', () => { showCelebration = false; renderLevelSelect(); });

            // 矢印ボタン操作
            container.querySelector('#btn-up')?.addEventListener('click', () => movePlayer(0, -1));
            container.querySelector('#btn-down')?.addEventListener('click', () => movePlayer(0, 1));
            container.querySelector('#btn-left')?.addEventListener('click', () => movePlayer(-1, 0));
            container.querySelector('#btn-right')?.addEventListener('click', () => movePlayer(1, 0));
        };

        // 初期化
        initLevel(0);

        return () => {};
    }
};
