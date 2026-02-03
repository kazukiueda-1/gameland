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

// デフォルトカテゴリ定義
const defaultCategories = [
    { id: 'sports', name: 'うんどう', icon: '🏃', color: 'green' },
    { id: 'study', name: 'べんきょう', icon: '📖', color: 'blue' },
    { id: 'craft', name: 'こうさく', icon: '✂️', color: 'pink' },
    { id: 'cooking', name: 'りょうり', icon: '🍳', color: 'orange' },
    { id: 'other', name: 'その他', icon: '⭐', color: 'gray' }
];

// 絵文字ピッカー用データ
const emojisByCategory = {
    'sports': ['🏃', '🚴', '⚽', '🏊', '💪', '🎾', '🧗', '⛷️', '🏀', '🎯'],
    'study': ['📖', '✏️', '🎹', '🎨', '🔢', '💡', '📚', '🔬', '🌍', '✍️'],
    'craft': ['✂️', '🎨', '🧶', '📐', '🖍️', '📎', '🧵', '🪡', '🎭', '🖼️'],
    'cooking': ['🍳', '🥗', '🍰', '🍪', '🥞', '🍙', '🥪', '🍜', '🧁', '🍱'],
    'other': ['⭐', '🌈', '🎯', '🔥', '💖', '✨', '🚀', '🌟', '🎪', '🎁'],
    'custom': ['🌸', '🎵', '🎮', '📷', '🌻', '🦋', '🐾', '🎈', '💫', '🌙']
};

// ひらがなキーボード配列
const hiraganaRows = [
    ['あ', 'い', 'う', 'え', 'お'],
    ['か', 'き', 'く', 'け', 'こ'],
    ['さ', 'し', 'す', 'せ', 'そ'],
    ['た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の'],
    ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['ま', 'み', 'む', 'め', 'も'],
    ['や', '', 'ゆ', '', 'よ'],
    ['ら', 'り', 'る', 'れ', 'ろ'],
    ['わ', 'を', 'ん', 'ー', '']
];

const dakutenMap = {
    'か': 'が', 'き': 'ぎ', 'く': 'ぐ', 'け': 'げ', 'こ': 'ご',
    'さ': 'ざ', 'し': 'じ', 'す': 'ず', 'せ': 'ぜ', 'そ': 'ぞ',
    'た': 'だ', 'ち': 'ぢ', 'つ': 'づ', 'て': 'で', 'と': 'ど',
    'は': 'ば', 'ひ': 'び', 'ふ': 'ぶ', 'へ': 'べ', 'ほ': 'ぼ'
};

const handakutenMap = {
    'は': 'ぱ', 'ひ': 'ぴ', 'ふ': 'ぷ', 'へ': 'ぺ', 'ほ': 'ぽ'
};

const smallKanaMap = {
    'あ': 'ぁ', 'い': 'ぃ', 'う': 'ぅ', 'え': 'ぇ', 'お': 'ぉ',
    'や': 'ゃ', 'ゆ': 'ゅ', 'よ': 'ょ', 'つ': 'っ'
};

export default {
    launch(container, system) {
        let unsubscribeChallenges = null;
        let unsubscribeCategories = null;
        let challenges = [];
        let customCategories = [];  // ユーザー追加カテゴリ
        let challengeLogs = {};
        let currentView = 'list';
        let selectedChallenge = null;
        let newChallenge = { title: '', icon: '🎯', category: 'other' };
        let showEmojiPicker = false;
        let showHiraganaKeyboard = false;
        let inputTarget = 'title';  // 'title' or 'newCategory'
        let newCategoryName = '';
        let showAddCategory = false;

        const currentChild = window.getCurrentChild ? window.getCurrentChild() : null;
        const childId = currentChild?.id || null;
        const childName = currentChild?.name || null;

        // 全カテゴリを取得（デフォルト + カスタム）
        const getAllCategories = () => {
            return [...defaultCategories, ...customCategories];
        };

        // カテゴリを取得
        const getCategory = (categoryId) => {
            return getAllCategories().find(c => c.id === categoryId) || defaultCategories[4];
        };

        const getTodayString = () => {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        };

        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const [year, month, day] = dateStr.split('-').map(Number);
            return `${month}/${day}`;
        };

        const formatTime = (timestamp) => {
            if (!timestamp) return '';
            const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
        };

        const getStatusInfo = (status) => {
            switch (status) {
                case 'pending': return { text: 'チャレンジまち', color: 'blue', emoji: '🔵' };
                case 'active': return { text: 'チャレンジちゅう', color: 'yellow', emoji: '🟡' };
                case 'completed': return { text: 'できた！', color: 'green', emoji: '🟢' };
                default: return { text: '---', color: 'gray', emoji: '⚪' };
            }
        };

        // カスタムカテゴリを読み込み
        const loadCustomCategories = async () => {
            try {
                const q = query(
                    collection(db, 'challenge_categories'),
                    where('childId', '==', childId)
                );
                const snapshot = await getDocs(q);
                customCategories = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    color: 'purple'  // カスタムカテゴリは紫色
                }));
            } catch (e) {
                console.error('カテゴリ取得エラー:', e);
            }
        };

        // カスタムカテゴリを追加
        const addCustomCategory = async () => {
            if (!newCategoryName.trim()) {
                alert('カテゴリの なまえを いれてね');
                return;
            }

            try {
                const docRef = await addDoc(collection(db, 'challenge_categories'), {
                    name: newCategoryName.trim(),
                    icon: '🏷️',
                    childId: childId,
                    createdAt: serverTimestamp()
                });

                customCategories.push({
                    id: docRef.id,
                    name: newCategoryName.trim(),
                    icon: '🏷️',
                    color: 'purple'
                });

                newCategoryName = '';
                showAddCategory = false;
                render();
            } catch (e) {
                console.error('カテゴリ追加エラー:', e);
            }
        };

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
                // 日付と時間でソート（新しい順）
                logs.sort((a, b) => {
                    const dateCompare = (b.date || '').localeCompare(a.date || '');
                    if (dateCompare !== 0) return dateCompare;
                    const timeA = a.createdAt?.toMillis?.() || 0;
                    const timeB = b.createdAt?.toMillis?.() || 0;
                    return timeB - timeA;
                });
                challengeLogs[challengeId] = logs;
                return logs;
            } catch (e) {
                console.error('ログ取得エラー:', e);
                return [];
            }
        };

        // 今日のチャレンジ回数を取得
        const getTodayCount = (challengeId) => {
            const logs = challengeLogs[challengeId] || [];
            return logs.filter(log => log.date === getTodayString()).length;
        };

        // 連続日数を計算（1日1回以上で連続とみなす）
        const getStreakDays = (challengeId) => {
            const logs = challengeLogs[challengeId] || [];
            if (logs.length === 0) return 0;

            const uniqueDates = [...new Set(logs.map(l => l.date))].sort().reverse();
            let streak = 0;
            let checkDate = new Date();

            for (let i = 0; i < 365; i++) {
                const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
                if (uniqueDates.includes(dateStr)) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else if (i === 0) {
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
            return streak;
        };

        const getMonthlyCount = (challengeId) => {
            const logs = challengeLogs[challengeId] || [];
            const now = new Date();
            const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            return logs.filter(l => l.date && l.date.startsWith(thisMonth)).length;
        };

        // 「チャレンジした」を記録（何回でも可）
        const recordChallenge = async (challengeId) => {
            try {
                await addDoc(collection(db, 'challenge_logs'), {
                    challengeId: challengeId,
                    childId: childId,
                    childName: childName,
                    date: getTodayString(),
                    createdAt: serverTimestamp()
                });

                const challenge = challenges.find(c => c.id === challengeId);
                if (challenge && challenge.status === 'pending') {
                    await updateDoc(doc(db, 'challenges', challengeId), {
                        status: 'active'
                    });
                }

                await loadChallengeLogs(challengeId);
                system.playSound('correct');
                render();
            } catch (e) {
                console.error('記録エラー:', e);
                alert('きろくできませんでした');
            }
        };

        const markAsCompleted = async (challengeId) => {
            try {
                await updateDoc(doc(db, 'challenges', challengeId), {
                    status: 'completed',
                    completedAt: serverTimestamp()
                });
                system.playSound('correct');

                // selectedChallengeを更新
                if (selectedChallenge && selectedChallenge.id === challengeId) {
                    selectedChallenge.status = 'completed';
                }
                render();
            } catch (e) {
                console.error('更新エラー:', e);
            }
        };

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
                showHiraganaKeyboard = false;
                currentView = 'list';
                render();
            } catch (e) {
                console.error('追加エラー:', e);
                alert('ついかできませんでした');
            }
        };

        const deleteChallenge = async (challengeId) => {
            if (!confirm('このチャレンジを けす？\nきろくも ぜんぶ きえるよ')) return;

            try {
                await deleteDoc(doc(db, 'challenges', challengeId));

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

        // ひらがなキーボード入力処理
        const handleHiraganaInput = (char) => {
            if (inputTarget === 'title') {
                newChallenge.title += char;
            } else if (inputTarget === 'newCategory') {
                newCategoryName += char;
            }
            render();
        };

        const handleBackspace = () => {
            if (inputTarget === 'title') {
                newChallenge.title = newChallenge.title.slice(0, -1);
            } else if (inputTarget === 'newCategory') {
                newCategoryName = newCategoryName.slice(0, -1);
            }
            render();
        };

        const handleDakuten = () => {
            let text = inputTarget === 'title' ? newChallenge.title : newCategoryName;
            if (text.length === 0) return;

            const lastChar = text.slice(-1);
            let newChar = dakutenMap[lastChar] || handakutenMap[lastChar] || lastChar;

            // 濁点→半濁点→元に戻る
            if (dakutenMap[lastChar]) {
                newChar = dakutenMap[lastChar];
            } else if (Object.values(dakutenMap).includes(lastChar)) {
                const original = Object.keys(dakutenMap).find(k => dakutenMap[k] === lastChar);
                newChar = handakutenMap[original] || lastChar;
            } else if (Object.values(handakutenMap).includes(lastChar)) {
                const original = Object.keys(handakutenMap).find(k => handakutenMap[k] === lastChar);
                newChar = original;
            }

            if (inputTarget === 'title') {
                newChallenge.title = text.slice(0, -1) + newChar;
            } else {
                newCategoryName = text.slice(0, -1) + newChar;
            }
            render();
        };

        const handleSmallKana = () => {
            let text = inputTarget === 'title' ? newChallenge.title : newCategoryName;
            if (text.length === 0) return;

            const lastChar = text.slice(-1);
            let newChar = smallKanaMap[lastChar];

            if (!newChar) {
                const original = Object.keys(smallKanaMap).find(k => smallKanaMap[k] === lastChar);
                newChar = original || lastChar;
            }

            if (inputTarget === 'title') {
                newChallenge.title = text.slice(0, -1) + newChar;
            } else {
                newCategoryName = text.slice(0, -1) + newChar;
            }
            render();
        };

        // ひらがなキーボードHTML
        const renderHiraganaKeyboard = () => {
            return `
                <div class="bg-gray-100 rounded-xl p-2 mt-2">
                    <div class="grid gap-1">
                        ${hiraganaRows.map(row => `
                            <div class="flex justify-center gap-1">
                                ${row.map(char => char ? `
                                    <button class="kana-btn bg-white hover:bg-emerald-100 w-10 h-10 rounded-lg font-bold text-lg text-gray-700 active:scale-95 transition shadow-sm" data-char="${char}">
                                        ${char}
                                    </button>
                                ` : '<div class="w-10 h-10"></div>').join('')}
                            </div>
                        `).join('')}
                        <div class="flex justify-center gap-1 mt-1">
                            <button id="btn-dakuten" class="bg-yellow-100 hover:bg-yellow-200 px-3 h-10 rounded-lg font-bold text-sm text-gray-700 active:scale-95 transition">
                                ゛゜
                            </button>
                            <button id="btn-small" class="bg-yellow-100 hover:bg-yellow-200 px-3 h-10 rounded-lg font-bold text-sm text-gray-700 active:scale-95 transition">
                                小
                            </button>
                            <button class="kana-btn bg-white hover:bg-emerald-100 px-4 h-10 rounded-lg font-bold text-gray-700 active:scale-95 transition shadow-sm" data-char=" ">
                                スペース
                            </button>
                            <button id="btn-backspace" class="bg-red-100 hover:bg-red-200 px-3 h-10 rounded-lg font-bold text-gray-700 active:scale-95 transition">
                                ←けす
                            </button>
                        </div>
                    </div>
                </div>
            `;
        };

        const render = () => {
            const allCategories = getAllCategories();

            container.innerHTML = `
                <style>
                    .challenge-card { transition: all 0.2s ease; }
                    .challenge-card:active { transform: scale(0.98); }
                    .status-badge { font-size: 0.7rem; }
                    .log-dot { width: 8px; height: 8px; border-radius: 50%; }
                </style>

                <div class="h-full flex flex-col bg-gradient-to-b from-emerald-50 to-teal-50">
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

                    <div class="flex-1 overflow-y-auto p-3">
                        ${currentView === 'list' ? renderListView() : ''}
                        ${currentView === 'add' ? renderAddView(allCategories) : ''}
                        ${currentView === 'detail' ? renderDetailView() : ''}
                        ${currentView === 'history' ? renderHistoryView() : ''}
                    </div>

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
                        const todayCount = getTodayCount(challenge.id);
                        const category = getCategory(challenge.category);

                        return `
                            <div class="challenge-card bg-white rounded-2xl p-3 shadow-md border-2 border-${category.color}-100" data-id="${challenge.id}">
                                <div class="flex items-center gap-3">
                                    <div class="text-4xl w-14 h-14 bg-${category.color}-50 rounded-xl flex items-center justify-center">
                                        ${challenge.icon}
                                    </div>

                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                                            <span class="status-badge bg-${status.color}-100 text-${status.color}-600 px-2 py-0.5 rounded-full font-bold">
                                                ${status.emoji} ${status.text}
                                            </span>
                                            ${streak > 0 ? `<span class="status-badge bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">🔥${streak}日</span>` : ''}
                                            ${todayCount > 0 ? `<span class="status-badge bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">きょう${todayCount}回</span>` : ''}
                                        </div>
                                        <p class="font-bold text-gray-700 truncate">${challenge.title}</p>
                                    </div>

                                    <button class="btn-record flex-shrink-0 bg-emerald-400 text-white font-bold py-2 px-3 rounded-xl text-sm active:scale-95 transition"
                                        data-id="${challenge.id}">
                                        チャレンジした！
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        };

        const renderAddView = (allCategories) => {
            const currentCategoryEmojis = emojisByCategory[newChallenge.category] || emojisByCategory['other'];

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
                                    ${currentCategoryEmojis.map(emoji => `
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
                                ${allCategories.map(cat => `
                                    <button class="cat-btn px-3 py-1.5 rounded-full font-bold text-sm transition ${newChallenge.category === cat.id ? `bg-${cat.color}-400 text-white` : `bg-${cat.color}-100 text-${cat.color}-600`}" data-cat="${cat.id}">
                                        ${cat.icon} ${cat.name}
                                    </button>
                                `).join('')}
                                <button id="btn-add-category" class="px-3 py-1.5 rounded-full font-bold text-sm bg-gray-200 text-gray-600 hover:bg-gray-300 transition">
                                    ＋ ついか
                                </button>
                            </div>
                        </div>

                        <!-- カテゴリ追加フォーム -->
                        ${showAddCategory ? `
                            <div class="bg-purple-50 rounded-xl p-3 mb-4 border-2 border-purple-200">
                                <label class="block text-sm font-bold text-purple-600 mb-2">あたらしいカテゴリ</label>
                                <div class="flex gap-2">
                                    <input type="text" id="input-category" value="${newCategoryName}" placeholder="カテゴリのなまえ"
                                        class="flex-1 border-2 border-purple-200 rounded-lg py-2 px-3 text-sm font-bold focus:outline-none focus:border-purple-400"
                                        onfocus="inputTarget='newCategory'">
                                    <button id="btn-save-category" class="bg-purple-400 text-white font-bold px-4 rounded-lg text-sm">
                                        ついか
                                    </button>
                                </div>
                                ${showHiraganaKeyboard && inputTarget === 'newCategory' ? renderHiraganaKeyboard() : ''}
                            </div>
                        ` : ''}

                        <!-- 名前入力 -->
                        <div class="mb-4">
                            <label class="block text-sm font-bold text-gray-600 mb-2">チャレンジの なまえ</label>
                            <input type="text" id="input-title" value="${newChallenge.title}" placeholder="れい: まいにち 10ぷん はしる"
                                class="w-full border-2 border-gray-200 rounded-xl py-2 px-3 text-base font-bold focus:outline-none focus:border-emerald-400"
                                onfocus="inputTarget='title'">

                            <button id="btn-toggle-keyboard" class="mt-2 text-sm text-emerald-600 font-bold">
                                ${showHiraganaKeyboard && inputTarget === 'title' ? '⌨️ キーボードをとじる' : '⌨️ ひらがなキーボード'}
                            </button>

                            ${showHiraganaKeyboard && inputTarget === 'title' ? renderHiraganaKeyboard() : ''}
                        </div>

                        <button id="btn-submit" class="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition text-lg">
                            ついか する！
                        </button>
                    </div>
                </div>
            `;
        };

        const renderDetailView = () => {
            if (!selectedChallenge) return '<p>エラー</p>';

            const challenge = selectedChallenge;
            const status = getStatusInfo(challenge.status);
            const logs = challengeLogs[challenge.id] || [];
            const streak = getStreakDays(challenge.id);
            const monthlyCount = getMonthlyCount(challenge.id);
            const todayCount = getTodayCount(challenge.id);
            const category = getCategory(challenge.category);

            return `
                <div class="space-y-4">
                    <div class="bg-white rounded-2xl p-4 shadow-md text-center">
                        <div class="text-5xl mb-2">${challenge.icon}</div>
                        <h2 class="text-xl font-black text-gray-700 mb-2">${challenge.title}</h2>
                        <span class="inline-block bg-${status.color}-100 text-${status.color}-600 px-3 py-1 rounded-full font-bold text-sm">
                            ${status.emoji} ${status.text}
                        </span>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                        <div class="bg-white rounded-xl p-2 shadow text-center">
                            <p class="text-xl font-black text-orange-500">🔥 ${streak}</p>
                            <p class="text-xs font-bold text-gray-500">れんぞく</p>
                        </div>
                        <div class="bg-white rounded-xl p-2 shadow text-center">
                            <p class="text-xl font-black text-blue-500">📊 ${monthlyCount}</p>
                            <p class="text-xs font-bold text-gray-500">こんげつ</p>
                        </div>
                        <div class="bg-white rounded-xl p-2 shadow text-center">
                            <p class="text-xl font-black text-emerald-500">✨ ${todayCount}</p>
                            <p class="text-xs font-bold text-gray-500">きょう</p>
                        </div>
                    </div>

                    <button id="btn-record-detail" class="bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-bold py-3 rounded-xl shadow-lg w-full text-lg active:scale-95 transition">
                        🎉 チャレンジした！
                    </button>

                    ${challenge.status !== 'completed' ? `
                        <button id="btn-complete" class="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-2 rounded-xl w-full text-base active:scale-95 transition">
                            🏆 できるように なった！
                        </button>
                    ` : ''}

                    <div class="bg-white rounded-2xl p-4 shadow-md">
                        <h3 class="font-bold text-gray-700 mb-3">📝 きろく</h3>
                        ${logs.length === 0 ? `
                            <p class="text-gray-400 text-sm text-center py-4">まだ きろくが ないよ</p>
                        ` : `
                            <div class="space-y-2 max-h-48 overflow-y-auto">
                                ${logs.slice(0, 30).map(log => `
                                    <div class="flex items-center gap-2 text-sm">
                                        <div class="log-dot bg-emerald-400"></div>
                                        <span class="font-bold text-gray-600">${formatDate(log.date)}</span>
                                        <span class="text-gray-400 text-xs">${formatTime(log.createdAt)}</span>
                                        ${log.date === getTodayString() ? '<span class="text-emerald-500 text-xs font-bold">きょう</span>' : ''}
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>

                    <button id="btn-delete" class="text-red-400 font-bold text-sm w-full py-2">
                        🗑️ このチャレンジを けす
                    </button>
                </div>
            `;
        };

        const renderHistoryView = () => {
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
            allLogs.sort((a, b) => {
                const dateCompare = (b.date || '').localeCompare(a.date || '');
                if (dateCompare !== 0) return dateCompare;
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });

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
                                            <span class="text-xs text-gray-400">(${grouped[date].length}回)</span>
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

        const setupEventListeners = () => {
            container.querySelector('#btn-back')?.addEventListener('click', () => {
                if (currentView === 'list') {
                    system.goHome();
                } else {
                    currentView = 'list';
                    selectedChallenge = null;
                    showHiraganaKeyboard = false;
                    showAddCategory = false;
                    render();
                }
            });

            container.querySelector('#btn-history')?.addEventListener('click', () => {
                currentView = 'history';
                render();
            });

            container.querySelector('#btn-add')?.addEventListener('click', () => {
                currentView = 'add';
                newChallenge = { title: '', icon: '🎯', category: 'other' };
                showHiraganaKeyboard = false;
                showAddCategory = false;
                render();
            });

            container.querySelectorAll('.challenge-card').forEach(card => {
                card.addEventListener('click', async (e) => {
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

            container.querySelectorAll('.btn-record').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    recordChallenge(id);
                });
            });

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
                        const catEmojis = emojisByCategory[newChallenge.category] || emojisByCategory['custom'];
                        newChallenge.icon = catEmojis[0];
                        render();
                    });
                });

                container.querySelector('#btn-add-category')?.addEventListener('click', () => {
                    showAddCategory = !showAddCategory;
                    inputTarget = 'newCategory';
                    render();
                });

                container.querySelector('#btn-save-category')?.addEventListener('click', addCustomCategory);

                container.querySelector('#input-category')?.addEventListener('input', (e) => {
                    newCategoryName = e.target.value;
                });

                container.querySelector('#input-category')?.addEventListener('focus', () => {
                    inputTarget = 'newCategory';
                });

                container.querySelector('#input-title')?.addEventListener('input', (e) => {
                    newChallenge.title = e.target.value;
                });

                container.querySelector('#input-title')?.addEventListener('focus', () => {
                    inputTarget = 'title';
                });

                container.querySelector('#btn-toggle-keyboard')?.addEventListener('click', () => {
                    showHiraganaKeyboard = !showHiraganaKeyboard;
                    inputTarget = 'title';
                    render();
                });

                container.querySelectorAll('.kana-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const char = btn.dataset.char;
                        if (char) handleHiraganaInput(char);
                    });
                });

                container.querySelector('#btn-dakuten')?.addEventListener('click', handleDakuten);
                container.querySelector('#btn-small')?.addEventListener('click', handleSmallKana);
                container.querySelector('#btn-backspace')?.addEventListener('click', handleBackspace);

                container.querySelector('#btn-submit')?.addEventListener('click', addChallenge);
            }

            if (currentView === 'detail' && selectedChallenge) {
                container.querySelector('#btn-record-detail')?.addEventListener('click', () => {
                    recordChallenge(selectedChallenge.id);
                });

                container.querySelector('#btn-complete')?.addEventListener('click', () => {
                    markAsCompleted(selectedChallenge.id);
                });

                container.querySelector('#btn-delete')?.addEventListener('click', () => {
                    deleteChallenge(selectedChallenge.id);
                });
            }
        };

        const startListening = () => {
            const q = childId
                ? query(collection(db, 'challenges'), where('childId', '==', childId))
                : query(collection(db, 'challenges'));

            unsubscribeChallenges = onSnapshot(q, async (snapshot) => {
                challenges = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                challenges.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis?.() || 0;
                    const timeB = b.createdAt?.toMillis?.() || 0;
                    return timeB - timeA;
                });

                for (const challenge of challenges) {
                    await loadChallengeLogs(challenge.id);
                }

                render();
            }, (error) => {
                console.error('Firestore監視エラー:', error);
            });
        };

        // 初期化
        const init = async () => {
            await loadCustomCategories();
            render();
            startListening();
        };

        init();

        return () => {
            if (unsubscribeChallenges) unsubscribeChallenges();
        };
    }
};
