/**
 * めいろあそび
 * 5〜6歳向けのかわいい迷路ゲーム
 * 指でなぞって進むタブレット向けUI
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
        let isDragging = false;
        let visitedCells = new Set();

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

        // 迷路データ（0=通路, 1=壁, 2=スタート, 3=ゴール）
        const levels = [
            // レベル1: 5x5 とても簡単
            {
                maze: [
                    [2, 0, 0, 0, 1],
                    [1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1],
                    [1, 0, 0, 0, 3],
                ],
                theme: 0
            },
            // レベル2: 6x6 簡単
            {
                maze: [
                    [2, 0, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 3],
                ],
                theme: 1
            },
            // レベル3: 7x7 簡単
            {
                maze: [
                    [2, 0, 0, 1, 1, 1, 1],
                    [1, 1, 0, 0, 0, 0, 1],
                    [1, 0, 0, 1, 1, 0, 1],
                    [1, 0, 1, 1, 0, 0, 1],
                    [1, 0, 0, 0, 0, 1, 1],
                    [1, 1, 1, 1, 0, 0, 1],
                    [1, 1, 1, 1, 1, 0, 3],
                ],
                theme: 2
            },
            // レベル4: 8x8 普通
            {
                maze: [
                    [1, 1, 2, 0, 0, 1, 1, 1],
                    [1, 1, 1, 1, 0, 0, 0, 1],
                    [1, 0, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1, 0, 3],
                ],
                theme: 3
            },
            // レベル5: 9x9 普通
            {
                maze: [
                    [2, 0, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 1, 1, 1, 1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1, 1, 0, 1],
                    [1, 0, 1, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 0, 0, 1],
                    [1, 0, 0, 0, 1, 1, 1, 0, 1],
                    [1, 1, 1, 1, 1, 1, 1, 0, 3],
                ],
                theme: 4
            },
            // レベル6: 10x10 やや難しい
            {
                maze: [
                    [1, 1, 1, 1, 2, 0, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
                    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
                    [1, 0, 0, 0, 0, 1, 1, 1, 0, 3],
                ],
                theme: 5
            },
            // レベル7: 10x10 難しい
            {
                maze: [
                    [2, 0, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
                    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
                    [1, 1, 1, 0, 0, 0, 0, 0, 0, 3],
                ],
                theme: 6
            },
            // レベル8: 11x11 難しい
            {
                maze: [
                    [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
                    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3],
                ],
                theme: 7
            },
            // レベル9: 12x12 とても難しい
            {
                maze: [
                    [2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
                    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
                    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
                ],
                theme: 8
            },
            // レベル10: 14x14 超難しい
            {
                maze: [
                    [1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
                    [1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
                    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 3],
                ],
                theme: 9
            },
        ];

        // 迷路を初期化
        const initLevel = (levelIndex) => {
            if (levelIndex >= levels.length) levelIndex = 0;
            currentLevel = levelIndex;
            const level = levels[levelIndex];
            maze = level.maze.map(row => [...row]);
            moveCount = 0;
            visitedCells.clear();

            for (let y = 0; y < maze.length; y++) {
                for (let x = 0; x < maze[y].length; x++) {
                    if (maze[y][x] === 2) playerPos = { x, y };
                    else if (maze[y][x] === 3) goalPos = { x, y };
                }
            }
            visitedCells.add(`${playerPos.x},${playerPos.y}`);
            render();
        };

        // プレイヤーを移動（隣接セルのみ）
        const movePlayerTo = (newX, newY) => {
            if (showCelebration) return false;

            // 範囲チェック
            if (newY < 0 || newY >= maze.length || newX < 0 || newX >= maze[0].length) return false;

            // 隣接チェック（上下左右のみ）
            const dx = Math.abs(newX - playerPos.x);
            const dy = Math.abs(newY - playerPos.y);
            if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                // 壁チェック
                if (maze[newY][newX] === 1) return false;

                // 移動
                playerPos = { x: newX, y: newY };
                moveCount++;
                visitedCells.add(`${newX},${newY}`);

                // ゴールチェック
                if (newX === goalPos.x && newY === goalPos.y) {
                    showCelebration = true;
                    if (!completedLevels.includes(currentLevel)) {
                        completedLevels.push(currentLevel);
                    }
                    system.playSound('correct');
                    render();
                    return true;
                }
                return true;
            }
            return false;
        };

        // タッチ座標からセル位置を取得
        const getCellFromTouch = (touch, mazeElement) => {
            const rect = mazeElement.getBoundingClientRect();
            const cellElements = mazeElement.querySelectorAll('.maze-cell');
            if (cellElements.length === 0) return null;

            const cellRect = cellElements[0].getBoundingClientRect();
            const cellSize = cellRect.width;

            const x = Math.floor((touch.clientX - rect.left) / cellSize);
            const y = Math.floor((touch.clientY - rect.top) / cellSize);

            if (x >= 0 && x < maze[0].length && y >= 0 && y < maze.length) {
                return { x, y };
            }
            return null;
        };

        // 描画
        const render = () => {
            const level = levels[currentLevel];
            const theme = themes[level.theme];
            const mazeSize = maze.length;
            // 画面サイズに応じてセルサイズを調整
            const maxMazeWidth = Math.min(window.innerWidth - 32, 500);
            const cellSize = Math.floor(maxMazeWidth / mazeSize);

            container.innerHTML = `
                <style>
                    .maze-cell {
                        width: ${cellSize}px;
                        height: ${cellSize}px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: ${Math.max(cellSize * 0.6, 14)}px;
                        transition: background 0.1s;
                    }
                    .wall { background: linear-gradient(135deg, #5D4037, #795548); border: 1px solid #4E342E; }
                    .path { background: linear-gradient(135deg, #C8E6C9, #A5D6A7); border: 1px solid #81C784; }
                    .path.visited { background: linear-gradient(135deg, #FFF9C4, #FFF59D); }
                    .path.current { background: linear-gradient(135deg, #FFCC80, #FFB74D); }
                    @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
                    @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
                    .player-anim { animation: bounce 0.4s ease-in-out infinite; }
                    .goal-anim { animation: pulse 1.2s ease-in-out infinite; }
                    .maze-container { touch-action: none; user-select: none; }
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

                    <div class="flex-1 flex flex-col items-center justify-center p-2">
                        <p class="text-green-600 font-bold text-sm mb-2">👆 ゆびで みちを なぞってね</p>
                        <div id="maze-area" class="maze-container bg-white rounded-2xl p-1 shadow-lg">
                            ${maze.map((row, y) => `
                                <div class="flex">
                                    ${row.map((cell, x) => {
                                        const isPlayer = playerPos.x === x && playerPos.y === y;
                                        const isGoal = goalPos.x === x && goalPos.y === y;
                                        const isWall = cell === 1;
                                        const isVisited = visitedCells.has(`${x},${y}`);
                                        let content = '';
                                        let extraClass = '';
                                        let cellClass = isWall ? 'wall' : 'path';

                                        if (isPlayer) {
                                            content = theme.player;
                                            extraClass = 'player-anim';
                                            cellClass += ' current';
                                        } else if (isGoal) {
                                            content = theme.goal;
                                            extraClass = 'goal-anim';
                                        } else if (isVisited && !isWall) {
                                            cellClass += ' visited';
                                        }

                                        return `<div class="maze-cell ${cellClass}" data-x="${x}" data-y="${y}"><span class="${extraClass}">${content}</span></div>`;
                                    }).join('')}
                                </div>
                            `).join('')}
                        </div>
                        <div class="flex justify-center gap-4 mt-3">
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
                                ${currentLevel < levels.length - 1 ? `
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
                            ${levels.map((level, index) => {
                                const theme = themes[level.theme];
                                const isCompleted = completedLevels.includes(index);
                                const difficulty = index < 3 ? 'かんたん' : index < 6 ? 'ふつう' : index < 9 ? 'むずかしい' : 'ちょうむずかしい';
                                const diffColor = index < 3 ? 'green' : index < 6 ? 'yellow' : index < 9 ? 'orange' : 'red';
                                return `
                                    <button class="level-btn bg-white rounded-2xl p-3 shadow-md text-center ${isCompleted ? 'border-2 border-green-400' : ''}" data-level="${index}">
                                        <div class="text-2xl mb-1">${theme.player}→${theme.goal}</div>
                                        <p class="font-bold text-gray-700">レベル ${index + 1}</p>
                                        <p class="text-xs text-${diffColor}-500 font-bold">${difficulty}</p>
                                        <p class="text-xs text-gray-400">${level.maze.length}×${level.maze[0].length}</p>
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

            // タッチ操作
            const mazeArea = container.querySelector('#maze-area');
            if (mazeArea) {
                let lastCell = null;

                const handleTouchStart = (e) => {
                    e.preventDefault();
                    isDragging = true;
                    const touch = e.touches[0];
                    const cell = getCellFromTouch(touch, mazeArea);
                    if (cell) {
                        lastCell = cell;
                        // スタート地点からのみ開始
                        if (cell.x === playerPos.x && cell.y === playerPos.y) {
                            // 現在位置にいるので OK
                        }
                    }
                };

                const handleTouchMove = (e) => {
                    e.preventDefault();
                    if (!isDragging) return;
                    const touch = e.touches[0];
                    const cell = getCellFromTouch(touch, mazeArea);
                    if (cell && lastCell && (cell.x !== lastCell.x || cell.y !== lastCell.y)) {
                        const moved = movePlayerTo(cell.x, cell.y);
                        if (moved) {
                            lastCell = cell;
                            render();
                        }
                    }
                };

                const handleTouchEnd = (e) => {
                    e.preventDefault();
                    isDragging = false;
                    lastCell = null;
                };

                mazeArea.addEventListener('touchstart', handleTouchStart, { passive: false });
                mazeArea.addEventListener('touchmove', handleTouchMove, { passive: false });
                mazeArea.addEventListener('touchend', handleTouchEnd, { passive: false });

                // マウス操作（PC用）
                mazeArea.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    const cell = getCellFromMouse(e, mazeArea);
                    if (cell) lastCell = cell;
                });

                mazeArea.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    const cell = getCellFromMouse(e, mazeArea);
                    if (cell && lastCell && (cell.x !== lastCell.x || cell.y !== lastCell.y)) {
                        const moved = movePlayerTo(cell.x, cell.y);
                        if (moved) {
                            lastCell = cell;
                            render();
                        }
                    }
                });

                mazeArea.addEventListener('mouseup', () => {
                    isDragging = false;
                    lastCell = null;
                });

                mazeArea.addEventListener('mouseleave', () => {
                    isDragging = false;
                    lastCell = null;
                });
            }
        };

        // マウス座標からセル位置を取得
        const getCellFromMouse = (e, mazeElement) => {
            const rect = mazeElement.getBoundingClientRect();
            const cellElements = mazeElement.querySelectorAll('.maze-cell');
            if (cellElements.length === 0) return null;

            const cellRect = cellElements[0].getBoundingClientRect();
            const cellSize = cellRect.width;

            const x = Math.floor((e.clientX - rect.left) / cellSize);
            const y = Math.floor((e.clientY - rect.top) / cellSize);

            if (x >= 0 && x < maze[0].length && y >= 0 && y < maze.length) {
                return { x, y };
            }
            return null;
        };

        // 初期化
        initLevel(0);

        return () => {};
    }
};
