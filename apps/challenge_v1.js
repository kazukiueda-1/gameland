/**
 * チャレンジきろく
 * やりたいこと・挑戦したいことを登録し、実際に挑戦した記録を残せるアプリ
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    getDocs,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyCcM38mjkSVXJDFJaxqZ8PXCuLr-bwNfsU",
    authDomain: "family-app-1006.firebaseapp.com",
    projectId: "family-app-1006",
    storageBucket: "family-app-1006.firebasestorage.app",
    messagingSenderId: "516894951381",
    appId: "1:516894951381:web:76d0b88cb8c406d6791f5c"
};

const app = initializeApp(firebaseConfig, 'challenge-app');
const db = getFirestore(app);

// カテゴリ定義
const categories = [
    { id: 'sports', name: 'うんどう', icon: '🏃', color: 'green' },
    { id: 'study', name: 'べんきょう', icon: '📖', color: 'blue' },
    { id: 'life', name: 'せいかつ', icon: '🏠', color: 'orange' },
    { id: 'hobby', name: 'しゅみ', icon: '🎨', color: 'purple' },
    { id: 'other', name: 'その他', icon: '⭐', color: 'gray' }
];

// 絵文字ピッカー用データ
const emojisByCategory = {
    'sports': ['🏃', '🚴', '⚽', '🏊', '💪', '🎾', '🧗', '⛷️', '🏀', '🎯'],
    'study': ['📖', '✏️', '🎹', '🎨', '🔢', '💡', '📚', '🔬', '🌍', '✍️'],
    'life': ['🧹', '🍳', '👕', '🌱', '⏰', '🛁', '🦷', '🧺', '🛏️', '🍽️'],
    'hobby': ['🎮', '🎬', '🎤', '📷', '🧩', '♟️', '🎨', '🎸', '📕', '✂️'],
    'other': ['⭐', '🌈', '🎯', '🔥', '💖', '✨', '🚀', '🌟', '🎪', '🎁']
};

export default {
    launch(container, system) {
        let unsubscribeChallenges = null;
        let challenges = [];
        let challengeLogs = {};  // challengeId -> logs array
        let currentView = 'list';  // 'list', 'add', 'detail', 'history'
        let selectedChallenge = null;
        let newChallenge = { title: '', icon: '🎯', category: 'other' };
        let showEmojiPicker = false;

        // 現在のログイン中の子供を取得
        const currentChild = window.getCurrentChild ? window.getCurrentChild() : null;
        const childId = currentChild?.id || null;
        const childName = currentChild?.name || null;

        // 今日の日付
        const getTodayString = () => {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        };

        // 日付を表示用にフォーマット
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const [year, month, day] = dateStr.split('-').map(Number);
            return `${month}/${day}`;
        };

        // ステータス情報
        const getStatusInfo = (status) => {
            switch (status) {
                case 'pending': return { text: 'チャレンジまち', color: 'blue', emoji: '🔵' };
                case 'active': return { text: 'チャレンジちゅう', color: 'yellow', emoji: '🟡' };
                case 'completed': return { text: 'できた！', color: 'green', emoji: '🟢' };
                default: return { text: '---', color: 'gray', emoji: '⚪' };
            }
        };

        // チャレンジのログを取得
        const loadChallengeLogs = async (challengeId) => {
            try {
                const q = query(
                    collection(db, 'challenge_logs'),
                    where('challengeId', '==', challengeId),
                    where('childId', '==', childId)
                );
                const snapshot = await getDocs(q);
                const logs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                logs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
                challengeLogs[challengeId] = logs;
                return logs;
            } catch (e) {
                console.error('ログ取得エラー:', e);
                return [];
            }
        };

        // 今日既に記録があるか確認
        const hasLoggedToday = (challengeId) => {
            const logs = challengeLogs[challengeId] || [];
            return logs.some(log => log.date === getTodayString());
        };

        // 連続日数を計算
        const getStreakDays = (challengeId) => {
            const logs = challengeLogs[challengeId] || [];
            if (logs.length === 0) return 0;

            const dates = logs.map(l => l.date).sort().reverse();
            let streak = 0;
            let checkDate = new Date();

            for (let i = 0; i < 365; i++) {
                const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
                if (dates.includes(dateStr)) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else if (i === 0) {
                    // 今日やってない場合は昨日から数える
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
            return streak;
        };

        // 今月の回数を計算
        const getMonthlyCount = (challengeId) => {
            const logs = challengeLogs[challengeId] || [];
            const now = new Date();
            const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            return logs.filter(l => l.date && l.date.startsWith(thisMonth)).length;
        };

        // 「きょうやった！」を記録
        const recordToday = async (challengeId) => {
            if (hasLoggedToday(challengeId)) {
                alert('きょうは もう きろくしたよ！');
                return;
            }

            try {
                await addDoc(collection(db, 'challenge_logs'), {
                    challengeId: challengeId,
                    childId: childId,
                    childName: childName,
                    date: getTodayString(),
                    createdAt: serverTimestamp()
                });

                // ステータスをactiveに更新（pendingの場合のみ）
                const challenge = challenges.find(c => c.id === challengeId);
                if (challenge && challenge.status === 'pending') {
                    await updateDoc(doc(db, 'challenges', challengeId), {
                        status: 'active'
                    });
                }

                // ログを再読み込み
                await loadChallengeLogs(challengeId);

                // 効果音と演出
                system.playSound('correct');

                render();
            } catch (e) {
                console.error('記録エラー:', e);
                alert('きろくできませんでした');
            }
        };

        // ステータスを「できた！」に変更
        const markAsCompleted = async (challengeId) => {
            try {
                await updateDoc(doc(db, 'challenges', challengeId), {
                    status: 'completed',
                    completedAt: serverTimestamp()
                });
                system.playSound('correct');
            } catch (e) {
                console.error('更新エラー:', e);
            }
        };

        // チャレンジを追加
        const addChallenge = async () => {
            if (!newChallenge.title.trim()) {
                alert('チャレンジの なまえを いれてね');
                return;
            }

            try {
                await addDoc(collection(db, 'challenges'), {
                    title: newChallenge.title.trim(),
                    icon: newChallenge.icon,
                    category: newChallenge.category,
                    status: 'pending',
                    childId: childId,
                    childName: childName,
                    createdAt: serverTimestamp()
                });

                newChallenge = { title: '', icon: '🎯', category: 'other' };
                currentView = 'list';
                render();
            } catch (e) {
                console.error('追加エラー:', e);
                alert('ついかできませんでした');
            }
        };

        // チャレンジを削除
        const deleteChallenge = async (challengeId) => {
            if (!confirm('このチャレンジを けす？\nきろくも ぜんぶ きえるよ')) return;

            try {
                // チャレンジを削除
                await deleteDoc(doc(db, 'challenges', challengeId));

                // 関連するログも削除
                const logs = challengeLogs[challengeId] || [];
                for (const log of logs) {
                    await deleteDoc(doc(db, 'challenge_logs', log.id));
                }

                selectedChallenge = null;
                currentView = 'list';
                render();
            } catch (e) {
                console.error('削除エラー:', e);
                alert('けせませんでした');
            }
        };

        // メイン描画
        const render = () => {
            const categoryInfo = categories.find(c => c.id === newChallenge.category) || categories[4];

            container.innerHTML = `
                <style>
                    .challenge-card { transition: all 0.2s ease; }
                    .challenge-card:active { transform: scale(0.98); }
                    .status-badge { font-size: 0.7rem; }
                    .log-dot { width: 8px; height: 8px; border-radius: 50%; }
                </style>

                <div class="h-full flex flex-col bg-gradient-to-b from-emerald-50 to-teal-50">
                    <!-- ヘッダー -->
                    <div class="bg-white shadow px-3 py-2 flex justify-between items-center">
                        <button id="btn-back" class="text-gray-500 font-bold text-sm">
                            ${currentView === 'list' ? '← もどる' : '← いちらん'}
                        </button>
                        <h1 class="text-lg font-black text-emerald-600 flex items-center gap-1">
                            🎯 チャレンジきろく
                        </h1>
                        ${currentView === 'list' ? `
                            <button id="btn-history" class="text-emerald-500 font-bold text-sm">📅</button>
                        ` : '<div class="w-8"></div>'}
                    </div>

                    <!-- メインコンテンツ -->
                    <div class="flex-1 overflow-y-auto p-3">
                        ${currentView === 'list' ? renderListView() : ''}
                        ${currentView === 'add' ? renderAddView(categoryInfo) : ''}
                        ${currentView === 'detail' ? renderDetailView() : ''}
                        ${currentView === 'history' ? renderHistoryView() : ''}
                    </div>

                    <!-- 追加ボタン（リスト画面のみ） -->
                    ${currentView === 'list' ? `
                        <div class="p-3 bg-white border-t">
                            <button id="btn-add" class="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition text-lg">
                                ＋ あたらしい チャレンジ
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;

            setupEventListeners();
        };

        // リスト画面
        const renderListView = () => {
            if (challenges.length === 0) {
                return `
                    <div class="h-full flex flex-col items-center justify-center text-gray-400">
                        <div class="text-5xl mb-3">🎯</div>
                        <p class="font-bold text-lg">チャレンジが まだないよ</p>
                        <p class="text-sm mt-1">したの ボタンから ついかしよう！</p>
                    </div>
                `;
            }

            return `
                <div class="space-y-3">
                    ${challenges.map(challenge => {
                        const status = getStatusInfo(challenge.status);
                        const streak = getStreakDays(challenge.id);
                        const todayDone = hasLoggedToday(challenge.id);
                        const category = categories.find(c => c.id === challenge.category) || categories[4];

                        return `
                            <div class="challenge-card bg-white rounded-2xl p-3 shadow-md border-2 border-${category.color}-100" data-id="${challenge.id}">
                                <div class="flex items-center gap-3">
                                    <!-- アイコン -->
                                    <div class="text-4xl w-14 h-14 bg-${category.color}-50 rounded-xl flex items-center justify-center">
                                        ${challenge.icon}
                                    </div>

                                    <!-- 情報 -->
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="status-badge bg-${status.color}-100 text-${status.color}-600 px-2 py-0.5 rounded-full font-bold">
                                                ${status.emoji} ${status.text}
                                            </span>
                                            ${streak > 0 ? `<span class="status-badge bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">🔥${streak}日</span>` : ''}
                                        </div>
                                        <p class="font-bold text-gray-700 truncate">${challenge.title}</p>
                                    </div>

                                    <!-- やった！ボタン -->
                                    <button class="btn-record flex-shrink-0 ${todayDone ? 'bg-gray-100 text-gray-400' : 'bg-emerald-400 text-white'} font-bold py-2 px-3 rounded-xl text-sm active:scale-95 transition"
                                        data-id="${challenge.id}" ${todayDone ? 'disabled' : ''}>
                                        ${todayDone ? '✓ きろくずみ' : 'きょうやった！'}
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        };

        // 追加画面
        const renderAddView = (categoryInfo) => {
            return `
                <div class="space-y-4">
                    <div class="bg-white rounded-2xl p-4 shadow-md">
                        <h3 class="font-bold text-gray-700 mb-3">🎯 あたらしい チャレンジ</h3>

                        <!-- アイコン選択 -->
                        <div class="mb-4">
                            <label class="block text-sm font-bold text-gray-600 mb-2">アイコン</label>
                            <button id="btn-emoji" class="text-4xl bg-gray-100 rounded-xl p-3 border-2 border-gray-200 hover:border-emerald-400 transition">
                                ${newChallenge.icon}
                            </button>
                        </div>

                        ${showEmojiPicker ? `
                            <div class="bg-gray-50 rounded-xl p-3 mb-4 border-2 border-gray-200">
                                <div class="grid grid-cols-5 gap-2">
                                    ${emojisByCategory[newChallenge.category].map(emoji => `
                                        <button class="emoji-btn text-2xl p-2 rounded-lg hover:bg-emerald-100 ${newChallenge.icon === emoji ? 'bg-emerald-100 ring-2 ring-emerald-400' : ''}" data-emoji="${emoji}">
                                            ${emoji}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- カテゴリ選択 -->
                        <div class="mb-4">
                            <label class="block text-sm font-bold text-gray-600 mb-2">カテゴリ</label>
                            <div class="flex flex-wrap gap-2">
                                ${categories.map(cat => `
                                    <button class="cat-btn px-3 py-1.5 rounded-full font-bold text-sm transition ${newChallenge.category === cat.id ? `bg-${cat.color}-400 text-white` : `bg-${cat.color}-100 text-${cat.color}-600`}" data-cat="${cat.id}">
                                        ${cat.icon} ${cat.name}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- 名前入力 -->
                        <div class="mb-4">
                            <label class="block text-sm font-bold text-gray-600 mb-2">チャレンジの なまえ</label>
                            <input type="text" id="input-title" value="${newChallenge.title}" placeholder="れい: まいにち 10ぷん はしる"
                                class="w-full border-2 border-gray-200 rounded-xl py-2 px-3 text-base font-bold focus:outline-none focus:border-emerald-400">
                        </div>

                        <!-- 追加ボタン -->
                        <button id="btn-submit" class="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition text-lg">
                            ついか する！
                        </button>
                    </div>
                </div>
            `;
        };

        // 詳細画面
        const renderDetailView = () => {
            if (!selectedChallenge) return '<p>エラー</p>';

            const challenge = selectedChallenge;
            const status = getStatusInfo(challenge.status);
            const logs = challengeLogs[challenge.id] || [];
            const streak = getStreakDays(challenge.id);
            const monthlyCount = getMonthlyCount(challenge.id);
            const category = categories.find(c => c.id === challenge.category) || categories[4];
            const todayDone = hasLoggedToday(challenge.id);

            return `
                <div class="space-y-4">
                    <!-- チャレンジ情報 -->
                    <div class="bg-white rounded-2xl p-4 shadow-md text-center">
                        <div class="text-5xl mb-2">${challenge.icon}</div>
                        <h2 class="text-xl font-black text-gray-700 mb-2">${challenge.title}</h2>
                        <span class="inline-block bg-${status.color}-100 text-${status.color}-600 px-3 py-1 rounded-full font-bold text-sm">
                            ${status.emoji} ${status.text}
                        </span>
                    </div>

                    <!-- 統計 -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-white rounded-xl p-3 shadow text-center">
                            <p class="text-2xl font-black text-orange-500">🔥 ${streak}</p>
                            <p class="text-xs font-bold text-gray-500">れんぞく日すう</p>
                        </div>
                        <div class="bg-white rounded-xl p-3 shadow text-center">
                            <p class="text-2xl font-black text-blue-500">📊 ${monthlyCount}</p>
                            <p class="text-xs font-bold text-gray-500">こんげつの かいすう</p>
                        </div>
                    </div>

                    <!-- やった！ボタン -->
                    <button id="btn-record-detail" class="${todayDone ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white'} font-bold py-3 rounded-xl shadow-lg w-full text-lg active:scale-95 transition" ${todayDone ? 'disabled' : ''}>
                        ${todayDone ? '✓ きょうは きろくずみ' : '🎉 きょう やった！'}
                    </button>

                    <!-- できた！ボタン -->
                    ${challenge.status !== 'completed' ? `
                        <button id="btn-complete" class="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-2 rounded-xl w-full text-base active:scale-95 transition">
                            🏆 できるように なった！
                        </button>
                    ` : ''}

                    <!-- 記録一覧 -->
                    <div class="bg-white rounded-2xl p-4 shadow-md">
                        <h3 class="font-bold text-gray-700 mb-3">📝 きろく</h3>
                        ${logs.length === 0 ? `
                            <p class="text-gray-400 text-sm text-center py-4">まだ きろくが ないよ</p>
                        ` : `
                            <div class="space-y-2 max-h-48 overflow-y-auto">
                                ${logs.slice(0, 20).map(log => `
                                    <div class="flex items-center gap-2 text-sm">
                                        <div class="log-dot bg-emerald-400"></div>
                                        <span class="font-bold text-gray-600">${formatDate(log.date)}</span>
                                        <span class="text-gray-400">${log.date === getTodayString() ? 'きょう' : ''}</span>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>

                    <!-- 削除ボタン -->
                    <button id="btn-delete" class="text-red-400 font-bold text-sm w-full py-2">
                        🗑️ このチャレンジを けす
                    </button>
                </div>
            `;
        };

        // 履歴画面（全チャレンジのタイムライン）
        const renderHistoryView = () => {
            // 全ログを集めて日付順にソート
            let allLogs = [];
            for (const challenge of challenges) {
                const logs = challengeLogs[challenge.id] || [];
                for (const log of logs) {
                    allLogs.push({
                        ...log,
                        challengeTitle: challenge.title,
                        challengeIcon: challenge.icon
                    });
                }
            }
            allLogs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

            // 日付でグループ化
            const grouped = {};
            for (const log of allLogs) {
                if (!grouped[log.date]) grouped[log.date] = [];
                grouped[log.date].push(log);
            }

            const dates = Object.keys(grouped).sort().reverse().slice(0, 30);

            return `
                <div class="space-y-4">
                    <div class="bg-white rounded-2xl p-4 shadow-md">
                        <h3 class="font-bold text-gray-700 mb-3">📅 ふりかえり</h3>

                        ${dates.length === 0 ? `
                            <p class="text-gray-400 text-sm text-center py-4">まだ きろくが ないよ</p>
                        ` : `
                            <div class="space-y-4">
                                ${dates.map(date => `
                                    <div>
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="font-bold text-emerald-600">${formatDate(date)}</span>
                                            ${date === getTodayString() ? '<span class="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">きょう</span>' : ''}
                                        </div>
                                        <div class="flex flex-wrap gap-2 ml-4">
                                            ${grouped[date].map(log => `
                                                <span class="bg-gray-100 px-2 py-1 rounded-lg text-sm font-bold text-gray-600">
                                                    ${log.challengeIcon} ${log.challengeTitle}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>
            `;
        };

        // イベントリスナー設定
        const setupEventListeners = () => {
            // 戻るボタン
            container.querySelector('#btn-back')?.addEventListener('click', () => {
                if (currentView === 'list') {
                    system.goHome();
                } else {
                    currentView = 'list';
                    selectedChallenge = null;
                    render();
                }
            });

            // 履歴ボタン
            container.querySelector('#btn-history')?.addEventListener('click', () => {
                currentView = 'history';
                render();
            });

            // 追加ボタン
            container.querySelector('#btn-add')?.addEventListener('click', () => {
                currentView = 'add';
                newChallenge = { title: '', icon: '🎯', category: 'other' };
                render();
            });

            // チャレンジカードクリック（詳細へ）
            container.querySelectorAll('.challenge-card').forEach(card => {
                card.addEventListener('click', async (e) => {
                    // ボタンクリックは除外
                    if (e.target.closest('.btn-record')) return;

                    const id = card.dataset.id;
                    selectedChallenge = challenges.find(c => c.id === id);
                    if (selectedChallenge) {
                        await loadChallengeLogs(id);
                        currentView = 'detail';
                        render();
                    }
                });
            });

            // やった！ボタン（リスト画面）
            container.querySelectorAll('.btn-record').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    recordToday(id);
                });
            });

            // 追加画面のイベント
            if (currentView === 'add') {
                container.querySelector('#btn-emoji')?.addEventListener('click', () => {
                    showEmojiPicker = !showEmojiPicker;
                    render();
                });

                container.querySelectorAll('.emoji-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        newChallenge.icon = btn.dataset.emoji;
                        showEmojiPicker = false;
                        render();
                    });
                });

                container.querySelectorAll('.cat-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        newChallenge.category = btn.dataset.cat;
                        newChallenge.icon = emojisByCategory[newChallenge.category][0];
                        render();
                    });
                });

                container.querySelector('#input-title')?.addEventListener('input', (e) => {
                    newChallenge.title = e.target.value;
                });

                container.querySelector('#btn-submit')?.addEventListener('click', addChallenge);
            }

            // 詳細画面のイベント
            if (currentView === 'detail' && selectedChallenge) {
                container.querySelector('#btn-record-detail')?.addEventListener('click', () => {
                    recordToday(selectedChallenge.id);
                });

                container.querySelector('#btn-complete')?.addEventListener('click', () => {
                    markAsCompleted(selectedChallenge.id);
                });

                container.querySelector('#btn-delete')?.addEventListener('click', () => {
                    deleteChallenge(selectedChallenge.id);
                });
            }
        };

        // Firestoreリアルタイム監視
        const startListening = () => {
            const q = childId
                ? query(collection(db, 'challenges'), where('childId', '==', childId))
                : query(collection(db, 'challenges'));

            unsubscribeChallenges = onSnapshot(q, async (snapshot) => {
                challenges = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // createdAtでソート
                challenges.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis?.() || 0;
                    const timeB = b.createdAt?.toMillis?.() || 0;
                    return timeB - timeA;
                });

                // 各チャレンジのログを読み込み
                for (const challenge of challenges) {
                    await loadChallengeLogs(challenge.id);
                }

                render();
            }, (error) => {
                console.error('Firestore監視エラー:', error);
            });
        };

        // 初期化
        render();
        startListening();

        // クリーンアップ
        return () => {
            if (unsubscribeChallenges) unsubscribeChallenges();
        };
    }
};
