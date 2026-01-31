/**
 * お手伝い・習慣記録アプリ (Daily Tasks)
 * 6歳の女の子向け、パステルカラーのかわいいデザイン
 */

// Firebase SDK (CDNからESM形式で読み込み)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    getDocs,
    getDoc,
    setDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ========================================
// Firebase設定
// ========================================
const firebaseConfig = {
    apiKey: "AIzaSyCcM38mjkSVXJDFJaxqZ8PXCuLr-bwNfsU",
    authDomain: "family-app-1006.firebaseapp.com",
    projectId: "family-app-1006",
    storageBucket: "family-app-1006.firebasestorage.app",
    messagingSenderId: "516894951381",
    appId: "1:516894951381:web:76d0b88cb8c406d6791f5c"
};

// Firebase初期化
const app = initializeApp(firebaseConfig, 'daily-app');
const db = getFirestore(app);

// ========================================
// 紙吹雪（Confetti）エフェクト
// ========================================
class ConfettiEffect {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.colors = ['#FF6B9D', '#FFE66D', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles(count = 150) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                size: Math.random() * 12 + 6,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                speedY: Math.random() * 4 + 2,
                speedX: Math.random() * 4 - 2,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let activeParticles = 0;

        this.particles.forEach(p => {
            if (p.y < this.canvas.height + 50) {
                activeParticles++;
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;

                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation * Math.PI / 180);
                this.ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                this.ctx.restore();
            }
        });

        if (activeParticles > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.stop();
        }
    }

    start() {
        if (!this.canvas) this.init();
        this.createParticles();
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            this.canvas = null;
        }
    }
}

// ========================================
// 絵文字ピッカー用データ
// ========================================
const emojiCategories = {
    'おうち': ['🧹', '🧺', '🍽️', '🪥', '🛁', '🛏️', '👕', '🧸', '📚', '✏️'],
    'たべもの': ['🍚', '🥗', '🍳', '🥛', '🍎', '🥕', '🍞', '🧃'],
    'うんどう': ['🏃', '🚴', '⚽', '🎾', '🏊', '🧘', '💪', '🌟'],
    'べんきょう': ['📖', '✍️', '🎹', '🎨', '🔢', '🌍', '🔬', '💡'],
    'その他': ['⭐', '🌈', '🎀', '💖', '🌸', '🦋', '🐱', '🐶']
};

// ========================================
// メインアプリ
// ========================================
export default {
    launch(container, system) {
        let unsubscribeTasks = null;
        let tasks = [];
        let selectedTaskIds = new Set();
        let todayLog = null;
        let showSettingsModal = false;
        let newTaskTitle = '';
        let newTaskIcon = '⭐';
        let showEmojiPicker = false;

        const confetti = new ConfettiEffect(document.body);

        // 今日の日付を取得
        const getTodayString = () => {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        };

        const getTodayDisplay = () => {
            const now = new Date();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const weekdays = ['にちようび', 'げつようび', 'かようび', 'すいようび', 'もくようび', 'きんようび', 'どようび'];
            return `${month}がつ ${day}にち (${weekdays[now.getDay()]})`;
        };

        // ========================================
        // Firestore操作
        // ========================================

        // 今日のログを取得
        const loadTodayLog = async () => {
            try {
                const docRef = doc(db, 'task_logs', getTodayString());
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    todayLog = docSnap.data();
                    selectedTaskIds = new Set(todayLog.completedTasks || []);
                } else {
                    todayLog = null;
                    selectedTaskIds = new Set();
                }
                render();
            } catch (e) {
                console.error('ログ読み込みエラー:', e);
            }
        };

        // タスク完了を保存
        const saveCompletedTasks = async () => {
            if (selectedTaskIds.size === 0) {
                alert('タスクを えらんでね！');
                return;
            }

            try {
                const points = selectedTaskIds.size * 10;
                const docRef = doc(db, 'task_logs', getTodayString());
                await setDoc(docRef, {
                    date: getTodayString(),
                    completedTasks: Array.from(selectedTaskIds),
                    points: points,
                    updatedAt: serverTimestamp()
                });

                // 紙吹雪エフェクト
                confetti.start();

                // お祝いメッセージ表示
                showCelebration(points);

                // スター加算
                system.addScore(points);

            } catch (e) {
                console.error('保存エラー:', e);
                alert('ほぞんできませんでした');
            }
        };

        // タスク追加
        const addTask = async () => {
            if (!newTaskTitle.trim()) {
                alert('なまえを いれてね');
                return;
            }
            try {
                await addDoc(collection(db, 'task_master'), {
                    title: newTaskTitle.trim(),
                    icon: newTaskIcon,
                    createdAt: serverTimestamp()
                });
                newTaskTitle = '';
                newTaskIcon = '⭐';
                render();
            } catch (e) {
                console.error('追加エラー:', e);
            }
        };

        // タスク削除
        const deleteTask = async (id) => {
            if (confirm('このタスクを けす？')) {
                try {
                    await deleteDoc(doc(db, 'task_master', id));
                } catch (e) {
                    console.error('削除エラー:', e);
                }
            }
        };

        // ========================================
        // お祝い表示
        // ========================================
        const showCelebration = (points) => {
            const overlay = document.createElement('div');
            overlay.className = 'celebration-overlay';
            overlay.innerHTML = `
                <div class="celebration-content">
                    <div class="celebration-icon">🎉</div>
                    <h2 class="celebration-title">すごい！</h2>
                    <p class="celebration-message">がんばったね！</p>
                    <div class="celebration-points">
                        <span class="points-label">きょうの ポイント</span>
                        <span class="points-value">+${points} ⭐</span>
                    </div>
                    <button class="celebration-button">やったー！</button>
                </div>
            `;
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(255,182,193,0.9); display: flex; align-items: center;
                justify-content: center; z-index: 10000; animation: fadeIn 0.5s ease;
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('.celebration-button').onclick = () => {
                overlay.remove();
                confetti.stop();
            };
        };

        // ========================================
        // 描画
        // ========================================
        const render = () => {
            const completedCount = selectedTaskIds.size;
            const totalPoints = completedCount * 10;

            container.innerHTML = `
                <style>
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes bounceIn {
                        0% { transform: scale(0.5); opacity: 0; }
                        60% { transform: scale(1.1); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    @keyframes sparkle {
                        0%, 100% { box-shadow: 0 0 5px #FFD700, 0 0 10px #FFD700; }
                        50% { box-shadow: 0 0 20px #FFD700, 0 0 30px #FFD700, 0 0 40px #FF69B4; }
                    }
                    .task-card { transition: all 0.3s ease; }
                    .task-card:hover { transform: translateY(-4px); }
                    .task-card.selected {
                        animation: sparkle 1.5s ease-in-out infinite;
                        background: linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%) !important;
                    }
                    .task-card.selected .check-mark { display: flex !important; }
                    .celebration-content {
                        background: white; border-radius: 30px; padding: 40px 60px;
                        text-align: center; animation: bounceIn 0.5s ease;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                    }
                    .celebration-icon { font-size: 80px; margin-bottom: 20px; }
                    .celebration-title { font-size: 48px; color: #FF6B9D; margin: 0 0 10px; }
                    .celebration-message { font-size: 28px; color: #666; margin: 0 0 30px; }
                    .celebration-points {
                        background: linear-gradient(135deg, #FFE66D, #FFD700);
                        padding: 20px 40px; border-radius: 20px; margin-bottom: 30px;
                    }
                    .points-label { display: block; font-size: 18px; color: #666; }
                    .points-value { font-size: 36px; font-weight: 900; color: #FF6B9D; }
                    .celebration-button {
                        background: linear-gradient(135deg, #FF6B9D, #FF8E53);
                        color: white; border: none; padding: 16px 50px; border-radius: 30px;
                        font-size: 24px; font-weight: bold; cursor: pointer;
                        box-shadow: 0 6px 20px rgba(255,107,157,0.4);
                    }
                    .modal-overlay {
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background: rgba(0,0,0,0.5); display: flex; align-items: center;
                        justify-content: center; z-index: 5000;
                    }
                    .modal-content {
                        background: white; border-radius: 24px; padding: 30px;
                        max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .emoji-grid {
                        display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;
                        margin-top: 10px;
                    }
                    .emoji-btn {
                        font-size: 28px; padding: 10px; background: #f0f0f0;
                        border: 2px solid transparent; border-radius: 12px; cursor: pointer;
                        transition: all 0.2s;
                    }
                    .emoji-btn:hover { background: #FFE4EC; }
                    .emoji-btn.selected { border-color: #FF6B9D; background: #FFE4EC; }
                </style>

                <div class="h-full flex flex-col" style="background: linear-gradient(180deg, #FFE4EC 0%, #E8F4F8 50%, #FFF9E6 100%); font-family: 'Zen Maru Gothic', sans-serif;">

                    <!-- ヘッダー -->
                    <div class="flex justify-between items-center px-4 py-3 bg-white/80 backdrop-blur shadow-md">
                        <button id="btn-quit" class="bg-pink-100 hover:bg-pink-200 text-pink-500 font-bold py-2 px-5 rounded-full text-lg active:scale-95 transition flex items-center gap-2">
                            <span>←</span> もどる
                        </button>
                        <h1 class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 flex items-center gap-3">
                            🌸 きょうの やること 🌸
                        </h1>
                        <button id="btn-settings" class="bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-2 px-4 rounded-full text-lg active:scale-95 transition">
                            ⚙️ せってい
                        </button>
                    </div>

                    <!-- メインエリア（横分割） -->
                    <div class="flex-1 flex overflow-hidden p-4 gap-4">

                        <!-- 左側: タスクエリア (70%) -->
                        <div class="w-[70%] bg-white/60 backdrop-blur rounded-3xl p-4 shadow-xl border-4 border-pink-200 overflow-hidden flex flex-col">
                            <h2 class="text-xl font-black text-pink-500 mb-4 flex items-center gap-2">
                                ✨ タップして できたことを おしえてね！
                            </h2>

                            <div class="flex-1 overflow-y-auto">
                                ${tasks.length === 0 ? `
                                    <div class="h-full flex flex-col items-center justify-center text-gray-400">
                                        <span class="text-6xl mb-4">📝</span>
                                        <p class="font-bold text-xl">タスクが まだ ないよ</p>
                                        <p class="text-base mt-2">「せってい」から ついかしてね</p>
                                    </div>
                                ` : `
                                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                        ${tasks.map(task => `
                                            <div data-id="${task.id}" class="task-card relative bg-gradient-to-br from-white to-pink-50 rounded-2xl p-5 cursor-pointer border-4 ${selectedTaskIds.has(task.id) ? 'border-yellow-400 selected' : 'border-pink-100 hover:border-pink-300'} shadow-lg">
                                                <!-- チェックマーク -->
                                                <div class="check-mark absolute top-3 right-3 w-8 h-8 bg-green-400 rounded-full items-center justify-center text-white font-bold text-xl shadow-md ${selectedTaskIds.has(task.id) ? 'flex' : 'hidden'}">
                                                    ✓
                                                </div>

                                                <!-- アイコン -->
                                                <div class="text-5xl md:text-6xl mb-3 text-center">${task.icon}</div>

                                                <!-- タスク名 -->
                                                <p class="text-lg md:text-xl font-black text-gray-700 text-center leading-tight">${task.title}</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                `}
                            </div>
                        </div>

                        <!-- 右側: ごほうびエリア (30%) -->
                        <div class="w-[30%] flex flex-col gap-4">

                            <!-- 日付カード -->
                            <div class="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl p-5 shadow-xl border-4 border-cyan-200 text-center">
                                <p class="text-lg font-bold text-cyan-600 mb-1">📅 きょうは</p>
                                <p class="text-2xl font-black text-cyan-700">${getTodayDisplay()}</p>
                            </div>

                            <!-- ポイントカード -->
                            <div class="flex-1 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-5 shadow-xl border-4 border-yellow-300 flex flex-col items-center justify-center">
                                <p class="text-lg font-bold text-yellow-600 mb-2">⭐ きょうの ポイント</p>
                                <div class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-2" style="animation: pulse 2s ease-in-out infinite;">
                                    ${totalPoints}
                                </div>
                                <p class="text-base text-yellow-600">(${completedCount}こ × 10ポイント)</p>

                                ${todayLog ? `
                                    <div class="mt-4 bg-green-100 rounded-xl px-4 py-2 border-2 border-green-300">
                                        <p class="text-green-600 font-bold text-sm">✅ きょうは もう ほぞんしたよ！</p>
                                    </div>
                                ` : ''}
                            </div>

                            <!-- 完了ボタン -->
                            <button id="btn-complete" class="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 text-white font-black text-2xl py-5 px-6 rounded-3xl shadow-xl active:scale-95 transition border-b-6 border-purple-500 flex items-center justify-center gap-3 ${selectedTaskIds.size === 0 ? 'opacity-50' : ''}">
                                🎉 きょうの おしまい！
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 設定モーダル -->
                ${showSettingsModal ? `
                    <div class="modal-overlay" id="modal-overlay">
                        <div class="modal-content">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-2xl font-black text-gray-700">⚙️ タスクの せってい</h3>
                                <button id="btn-close-modal" class="text-3xl text-gray-400 hover:text-gray-600">×</button>
                            </div>

                            <!-- タスク追加フォーム -->
                            <div class="bg-pink-50 rounded-2xl p-4 mb-6">
                                <h4 class="font-bold text-pink-600 mb-3">➕ あたらしい タスクを ついか</h4>

                                <div class="flex gap-3 mb-3">
                                    <button id="btn-emoji-picker" class="text-4xl bg-white rounded-xl p-3 border-2 border-pink-200 hover:border-pink-400 transition">
                                        ${newTaskIcon}
                                    </button>
                                    <input type="text" id="input-task-title" value="${newTaskTitle}" placeholder="タスクの なまえ"
                                        class="flex-1 bg-white border-2 border-pink-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-pink-400">
                                </div>

                                ${showEmojiPicker ? `
                                    <div class="bg-white rounded-xl p-3 mb-3 border-2 border-pink-200">
                                        ${Object.entries(emojiCategories).map(([category, emojis]) => `
                                            <p class="text-sm font-bold text-gray-500 mb-1">${category}</p>
                                            <div class="emoji-grid mb-3">
                                                ${emojis.map(emoji => `
                                                    <button class="emoji-btn ${newTaskIcon === emoji ? 'selected' : ''}" data-emoji="${emoji}">${emoji}</button>
                                                `).join('')}
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}

                                <button id="btn-add-task" class="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-3 rounded-xl text-lg hover:from-pink-500 hover:to-purple-500 transition">
                                    ついか する
                                </button>
                            </div>

                            <!-- 既存タスク一覧 -->
                            <div>
                                <h4 class="font-bold text-gray-600 mb-3">📋 いまの タスク</h4>
                                <div class="space-y-2 max-h-48 overflow-y-auto">
                                    ${tasks.length === 0 ? `
                                        <p class="text-gray-400 text-center py-4">タスクが ありません</p>
                                    ` : tasks.map(task => `
                                        <div class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                            <div class="flex items-center gap-3">
                                                <span class="text-2xl">${task.icon}</span>
                                                <span class="font-bold text-gray-700">${task.title}</span>
                                            </div>
                                            <button data-delete-id="${task.id}" class="text-red-400 hover:text-red-600 text-xl font-bold px-2">🗑️</button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            `;

            setupEventListeners();
        };

        // ========================================
        // イベントリスナー
        // ========================================
        const setupEventListeners = () => {
            // 戻るボタン
            container.querySelector('#btn-quit')?.addEventListener('click', () => system.goHome());

            // 設定ボタン
            container.querySelector('#btn-settings')?.addEventListener('click', () => {
                showSettingsModal = true;
                render();
            });

            // 完了ボタン
            container.querySelector('#btn-complete')?.addEventListener('click', saveCompletedTasks);

            // タスクカードのクリック
            container.querySelectorAll('.task-card').forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.dataset.id;
                    if (selectedTaskIds.has(id)) {
                        selectedTaskIds.delete(id);
                    } else {
                        selectedTaskIds.add(id);
                    }
                    render();
                });
            });

            // モーダル関連
            if (showSettingsModal) {
                container.querySelector('#btn-close-modal')?.addEventListener('click', () => {
                    showSettingsModal = false;
                    showEmojiPicker = false;
                    render();
                });

                container.querySelector('#modal-overlay')?.addEventListener('click', (e) => {
                    if (e.target.id === 'modal-overlay') {
                        showSettingsModal = false;
                        showEmojiPicker = false;
                        render();
                    }
                });

                container.querySelector('#input-task-title')?.addEventListener('input', (e) => {
                    newTaskTitle = e.target.value;
                });

                container.querySelector('#btn-emoji-picker')?.addEventListener('click', () => {
                    showEmojiPicker = !showEmojiPicker;
                    render();
                });

                container.querySelectorAll('.emoji-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        newTaskIcon = btn.dataset.emoji;
                        showEmojiPicker = false;
                        render();
                    });
                });

                container.querySelector('#btn-add-task')?.addEventListener('click', addTask);

                container.querySelectorAll('[data-delete-id]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        deleteTask(btn.dataset.deleteId);
                    });
                });
            }
        };

        // ========================================
        // Firestoreリアルタイム監視
        // ========================================
        const startListening = () => {
            const q = query(
                collection(db, 'task_master'),
                orderBy('createdAt', 'asc')
            );

            unsubscribeTasks = onSnapshot(q, (snapshot) => {
                tasks = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                render();
            }, (error) => {
                console.error('Firestore監視エラー:', error);
                container.innerHTML = `
                    <div class="h-full flex flex-col items-center justify-center bg-pink-50 p-4">
                        <div class="text-6xl mb-4">😢</div>
                        <h2 class="text-2xl font-black text-pink-500 mb-2">つながらないよ</h2>
                        <p class="text-gray-600 font-bold mb-4 text-center">
                            Firebaseの せってい を<br>かくにんしてね
                        </p>
                        <button id="btn-back-home" class="bg-pink-400 text-white font-bold py-3 px-6 rounded-full">
                            ホームにもどる
                        </button>
                    </div>
                `;
                container.querySelector('#btn-back-home')?.addEventListener('click', () => system.goHome());
            });

            // 今日のログも読み込む
            loadTodayLog();
        };

        // 初期化
        render();
        startListening();

        // クリーンアップ
        return () => {
            if (unsubscribeTasks) unsubscribeTasks();
            confetti.stop();
        };
    }
};
