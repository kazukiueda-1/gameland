/**
 * 保護者用 履歴閲覧ページ
 * アプリ使用履歴とクイズの詳細結果を表示
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
    getFirestore,
    collection,
    query,
    orderBy,
    getDocs,
    where,
    limit,
    doc,
    getDoc,
    setDoc,
    addDoc,
    deleteDoc,
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

const app = initializeApp(firebaseConfig, 'parent-app');
const db = getFirestore(app);

export default {
    launch(container, system) {
        let usageLogs = [];
        let quizLogs = [];
        let selectedDate = null;
        let viewMode = 'usage'; // 'usage', 'quiz', 'apps', 'theme', or 'admin'
        let isLoading = true;
        let allApps = [];
        let visibleAppIds = [];
        let isSaving = false;
        let currentTheme = 'cute';

        // 管理者モード関連
        const isAdminMode = system.adminMode || false;
        let children = [];
        // 子供フィルター：管理者モードなら全員、通常モードなら現在ログイン中の子供
        let selectedChildFilter = isAdminMode ? null : (system.currentChild?.id || null);
        let editingChild = null; // 編集中の子供
        let adminPassword = 'admin1234'; // 管理者パスワード（実運用では別途管理）
        let isAdminAuthenticated = isAdminMode; // 長押しで入った場合は認証済み

        // 利用可能なアバター絵文字
        const avatarEmojis = ['👧', '👦', '👶', '🧒', '👸', '🤴', '🦸', '🦹', '🧙', '🧚', '🐱', '🐶', '🐰', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸', '🐵'];

        // 日付リストを取得（過去30日分）
        const getDateList = () => {
            const dates = [];
            for (let i = 0; i < 30; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                dates.push({
                    value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
                    display: `${d.getMonth() + 1}/${d.getDate()}`,
                    isToday: i === 0
                });
            }
            return dates;
        };

        // 使用履歴を取得
        const loadUsageLogs = async () => {
            try {
                const q = query(
                    collection(db, 'app_usage_logs'),
                    orderBy('timestamp', 'desc'),
                    limit(200)
                );
                const snapshot = await getDocs(q);
                usageLogs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (e) {
                console.error('使用履歴取得エラー:', e);
                usageLogs = [];
            }
        };

        // クイズ履歴を取得
        const loadQuizLogs = async () => {
            try {
                const q = query(
                    collection(db, 'quiz_logs'),
                    orderBy('timestamp', 'desc'),
                    limit(500)
                );
                const snapshot = await getDocs(q);
                quizLogs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (e) {
                console.error('クイズ履歴取得エラー:', e);
                quizLogs = [];
            }
        };

        // アプリ一覧を取得
        const loadAppRegistry = async () => {
            try {
                const res = await fetch('./apps/registry.json?t=' + Date.now());
                if (res.ok) {
                    allApps = await res.json();
                } else {
                    console.error('registry.json取得失敗:', res.status);
                    allApps = [];
                }
            } catch (e) {
                console.error('アプリ一覧取得エラー:', e);
                allApps = [];
            }
        };

        // 表示設定を取得
        const loadVisibilitySettings = async () => {
            try {
                const docRef = doc(db, 'settings', 'visible_apps');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    visibleAppIds = docSnap.data().appIds || [];
                } else {
                    // 初期状態：全アプリを表示
                    visibleAppIds = allApps.map(app => app.id);
                }
            } catch (e) {
                console.error('表示設定取得エラー:', e);
                visibleAppIds = allApps.map(app => app.id);
            }
        };

        // 表示設定を保存
        const saveVisibilitySettings = async () => {
            isSaving = true;
            render();
            try {
                const docRef = doc(db, 'settings', 'visible_apps');
                await setDoc(docRef, {
                    appIds: visibleAppIds,
                    updatedAt: new Date()
                });
                alert('保存しました！');
            } catch (e) {
                console.error('表示設定保存エラー:', e);
                alert('保存に失敗しました');
            }
            isSaving = false;
            render();
        };

        // テーマ設定を読み込み（子供ごと）
        const loadThemeSetting = async () => {
            try {
                const childId = system.currentChild?.id;
                if (childId) {
                    const childDocRef = doc(db, 'children', childId);
                    const childDocSnap = await getDoc(childDocRef);
                    if (childDocSnap.exists() && childDocSnap.data().theme) {
                        currentTheme = childDocSnap.data().theme;
                        return;
                    }
                }
                currentTheme = 'cute';
            } catch (e) {
                console.error('テーマ設定取得エラー:', e);
                currentTheme = 'cute';
            }
        };

        // テーマ設定を保存（子供ごと）
        const saveThemeSetting = async (theme) => {
            const childId = system.currentChild?.id;
            if (!childId) {
                alert('ログイン中の子供がいません');
                return;
            }

            isSaving = true;
            render();
            try {
                // 子供ドキュメントにテーマを保存
                const childDocRef = doc(db, 'children', childId);
                await updateDoc(childDocRef, { theme: theme });
                currentTheme = theme;
                alert(`${system.currentChild.name}のテーマを変更しました！\nトップページに戻ると反映されます。`);
            } catch (e) {
                console.error('テーマ設定保存エラー:', e);
                alert('保存に失敗しました');
            }
            isSaving = false;
            render();
        };

        // === 子供管理機能 ===

        // 子供一覧を読み込み
        const loadChildren = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'children'));
                children = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // createdAtでソート
                children.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis?.() || 0;
                    const timeB = b.createdAt?.toMillis?.() || 0;
                    return timeA - timeB;
                });
            } catch (e) {
                console.error('子供一覧取得エラー:', e);
                children = [];
            }
        };

        // 子供を追加
        const addChild = async (name, pin, avatarEmoji) => {
            isSaving = true;
            render();
            try {
                await addDoc(collection(db, 'children'), {
                    name: name,
                    pin: pin,
                    avatarEmoji: avatarEmoji,
                    isActive: true,
                    createdAt: serverTimestamp()
                });
                await loadChildren();
                alert(`${name} を追加しました！`);
            } catch (e) {
                console.error('子供追加エラー:', e);
                alert('追加に失敗しました');
            }
            isSaving = false;
            render();
        };

        // 子供を更新
        const updateChild = async (childId, name, pin, avatarEmoji) => {
            isSaving = true;
            render();
            try {
                const docRef = doc(db, 'children', childId);
                await updateDoc(docRef, {
                    name: name,
                    pin: pin,
                    avatarEmoji: avatarEmoji
                });
                await loadChildren();
                alert(`${name} を更新しました！`);
            } catch (e) {
                console.error('子供更新エラー:', e);
                alert('更新に失敗しました');
            }
            isSaving = false;
            editingChild = null;
            render();
        };

        // 子供を削除（非アクティブ化）
        const deleteChild = async (childId, childName) => {
            if (!confirm(`${childName} を削除しますか？\n（履歴データは残ります）`)) return;

            isSaving = true;
            render();
            try {
                const docRef = doc(db, 'children', childId);
                await updateDoc(docRef, {
                    isActive: false
                });
                await loadChildren();
                alert(`${childName} を削除しました`);
            } catch (e) {
                console.error('子供削除エラー:', e);
                alert('削除に失敗しました');
            }
            isSaving = false;
            render();
        };

        // アプリの表示/非表示を切り替え
        const toggleAppVisibility = (appId) => {
            if (visibleAppIds.includes(appId)) {
                visibleAppIds = visibleAppIds.filter(id => id !== appId);
            } else {
                visibleAppIds.push(appId);
            }
            render();
        };

        // 日付でフィルタ
        const getLogsForDate = (logs, date) => {
            if (!date) return logs;
            return logs.filter(log => log.date === date);
        };

        // 子供でフィルタ
        const getLogsForChild = (logs, childId) => {
            if (!childId) return logs;
            if (childId === '__old__') {
                // 古いログ（childIdがないもの）
                return logs.filter(log => !log.childId);
            }
            return logs.filter(log => log.childId === childId);
        };

        // アプリごとに集計
        const groupByApp = (logs) => {
            const grouped = {};
            logs.forEach(log => {
                const key = log.appTitle || log.appFile;
                if (!grouped[key]) {
                    grouped[key] = { count: 0, logs: [] };
                }
                grouped[key].count++;
                grouped[key].logs.push(log);
            });
            return grouped;
        };

        // クイズ結果を集計
        const summarizeQuizLogs = (logs) => {
            const summary = {};
            logs.forEach(log => {
                const app = log.appTitle || 'Unknown';
                if (!summary[app]) {
                    summary[app] = { correct: 0, wrong: 0, questions: [] };
                }
                if (log.isCorrect) {
                    summary[app].correct++;
                } else {
                    summary[app].wrong++;
                }
                summary[app].questions.push({
                    question: log.question,
                    isCorrect: log.isCorrect,
                    details: log.details || {}
                });
            });
            return summary;
        };

        // 時刻フォーマット
        const formatTime = (timestamp) => {
            if (!timestamp) return '';
            const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
        };

        // 描画
        const render = () => {
            const dateList = getDateList();

            // 子供フィルター：通常モードでは常にログイン中の子供、管理者モードでは選択したフィルター
            const effectiveChildFilter = isAdminAuthenticated
                ? selectedChildFilter
                : (system.currentChild?.id || null);

            // 日付と子供でフィルタ
            let filteredUsage = getLogsForDate(usageLogs, selectedDate);
            filteredUsage = getLogsForChild(filteredUsage, effectiveChildFilter);
            let filteredQuiz = getLogsForDate(quizLogs, selectedDate);
            filteredQuiz = getLogsForChild(filteredQuiz, effectiveChildFilter);

            const usageByApp = groupByApp(filteredUsage);
            const quizSummary = summarizeQuizLogs(filteredQuiz);

            // アクティブな子供のみ
            const activeChildren = children.filter(c => c.isActive);

            container.innerHTML = `
                <style>
                    .parent-container { font-family: 'Zen Maru Gothic', sans-serif; }
                    .tab-btn.active { background: #3B82F6; color: white; }
                    .date-btn.active { background: #3B82F6; color: white; }
                </style>

                <div class="parent-container h-full flex flex-col bg-gray-50">
                    <!-- ヘッダー -->
                    <div class="bg-white shadow px-3 py-2 flex justify-between items-center">
                        <button id="btn-back" class="text-gray-500 hover:text-gray-700 font-bold text-sm">
                            ← もどる
                        </button>
                        <h1 class="text-base font-bold text-gray-700">👤 ほごしゃよう</h1>
                        <div class="w-14"></div>
                    </div>

                    <!-- タブ切り替え -->
                    <div class="bg-white border-b flex">
                        <button class="tab-btn flex-1 py-2 font-bold text-xs ${viewMode === 'usage' ? 'active' : 'text-gray-500'}" data-mode="usage">
                            📱 履歴
                        </button>
                        <button class="tab-btn flex-1 py-2 font-bold text-xs ${viewMode === 'quiz' ? 'active' : 'text-gray-500'}" data-mode="quiz">
                            📝 クイズ
                        </button>
                        <button class="tab-btn flex-1 py-2 font-bold text-xs ${viewMode === 'apps' ? 'active' : 'text-gray-500'}" data-mode="apps">
                            ⚙️ アプリ
                        </button>
                        <button class="tab-btn flex-1 py-2 font-bold text-xs ${viewMode === 'theme' ? 'active' : 'text-gray-500'}" data-mode="theme">
                            🎨 テーマ
                        </button>
                        ${isAdminAuthenticated ? `
                        <button class="tab-btn flex-1 py-2 font-bold text-xs ${viewMode === 'admin' ? 'active' : 'text-gray-500'}" data-mode="admin">
                            👥 管理
                        </button>
                        ` : ''}
                    </div>

                    <!-- 日付選択（履歴・クイズタブのみ表示） -->
                    ${viewMode === 'usage' || viewMode === 'quiz' ? `
                    <div class="bg-white border-b px-2 py-1.5 overflow-x-auto">
                        <div class="flex gap-1.5 min-w-max">
                            <button class="date-btn px-2.5 py-0.5 rounded-full text-xs font-bold ${!selectedDate ? 'active' : 'bg-gray-100 text-gray-600'}" data-date="">
                                すべて
                            </button>
                            ${dateList.slice(0, 14).map(d => `
                                <button class="date-btn px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedDate === d.value ? 'active' : 'bg-gray-100 text-gray-600'}" data-date="${d.value}">
                                    ${d.display}${d.isToday ? '(今日)' : ''}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 子供フィルター（管理者モードのみ表示） -->
                    ${isAdminAuthenticated && activeChildren.length > 0 ? `
                    <div class="bg-gray-50 border-b px-2 py-1.5 overflow-x-auto">
                        <div class="flex gap-1.5 min-w-max items-center">
                            <span class="text-xs text-gray-500 font-bold mr-1">👤</span>
                            <button class="child-filter-btn px-2.5 py-0.5 rounded-full text-xs font-bold ${!selectedChildFilter ? 'bg-pink-400 text-white' : 'bg-gray-100 text-gray-600'}" data-child="">
                                全員
                            </button>
                            ${activeChildren.map(c => `
                                <button class="child-filter-btn px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedChildFilter === c.id ? 'bg-pink-400 text-white' : 'bg-gray-100 text-gray-600'}" data-child="${c.id}">
                                    ${c.avatarEmoji || '👤'} ${c.name}
                                </button>
                            `).join('')}
                            <button class="child-filter-btn px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedChildFilter === '__old__' ? 'bg-pink-400 text-white' : 'bg-gray-100 text-gray-600'}" data-child="__old__">
                                📜 むかしのきろく
                            </button>
                        </div>
                    </div>
                    ` : !isAdminAuthenticated && system.currentChild ? `
                    <div class="bg-blue-50 border-b px-3 py-2">
                        <div class="flex items-center gap-2 text-sm text-blue-700 font-bold">
                            <span class="text-lg">${system.currentChild.avatarEmoji || '👤'}</span>
                            <span>${system.currentChild.name} のきろく</span>
                        </div>
                    </div>
                    ` : ''}
                    ` : ''}

                    <!-- コンテンツ -->
                    <div class="flex-1 overflow-y-auto p-3">
                        ${isLoading ? `
                            <div class="flex items-center justify-center h-full text-gray-400">
                                <div class="text-center">
                                    <div class="text-4xl mb-2 animate-spin">⏳</div>
                                    <p class="font-bold">読み込み中...</p>
                                </div>
                            </div>
                        ` : viewMode === 'usage' ? `
                            <!-- 使用履歴 -->
                            ${Object.keys(usageByApp).length === 0 ? `
                                <div class="text-center text-gray-400 py-8">
                                    <div class="text-4xl mb-2">📭</div>
                                    <p class="font-bold">まだ履歴がありません</p>
                                </div>
                            ` : `
                                <div class="space-y-4">
                                    ${Object.entries(usageByApp).map(([appName, data]) => `
                                        <div class="bg-white rounded-xl p-4 shadow-sm">
                                            <div class="flex justify-between items-center mb-2">
                                                <h3 class="font-bold text-gray-700">${appName}</h3>
                                                <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                                                    ${data.count}回
                                                </span>
                                            </div>
                                            <div class="text-sm text-gray-500">
                                                ${data.logs.slice(0, 5).map(log => `
                                                    <span class="inline-block bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                                                        ${log.date} ${formatTime(log.timestamp)}
                                                    </span>
                                                `).join('')}
                                                ${data.logs.length > 5 ? `<span class="text-gray-400">...他${data.logs.length - 5}件</span>` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            `}
                        ` : viewMode === 'quiz' ? `
                            <!-- クイズ詳細 -->
                            ${Object.keys(quizSummary).length === 0 ? `
                                <div class="text-center text-gray-400 py-8">
                                    <div class="text-4xl mb-2">📭</div>
                                    <p class="font-bold">クイズ履歴がありません</p>
                                </div>
                            ` : `
                                <div class="space-y-6">
                                    ${Object.entries(quizSummary).map(([appName, data]) => `
                                        <div class="bg-white rounded-xl p-4 shadow-sm">
                                            <div class="flex justify-between items-center mb-3">
                                                <h3 class="font-bold text-gray-700">${appName}</h3>
                                                <div class="flex gap-2">
                                                    <span class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
                                                        ⭕ ${data.correct}
                                                    </span>
                                                    <span class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                                                        ❌ ${data.wrong}
                                                    </span>
                                                </div>
                                            </div>

                                            <!-- 正答率バー -->
                                            <div class="mb-3">
                                                <div class="flex justify-between text-sm text-gray-500 mb-1">
                                                    <span>正答率</span>
                                                    <span>${Math.round((data.correct / (data.correct + data.wrong)) * 100)}%</span>
                                                </div>
                                                <div class="w-full bg-gray-200 rounded-full h-2">
                                                    <div class="bg-green-400 h-2 rounded-full" style="width: ${(data.correct / (data.correct + data.wrong)) * 100}%"></div>
                                                </div>
                                            </div>

                                            <!-- 間違えた問題 -->
                                            ${data.questions.filter(q => !q.isCorrect).length > 0 ? `
                                                <div class="mt-3 pt-3 border-t">
                                                    <p class="text-sm font-bold text-red-500 mb-2">❌ 間違えた問題:</p>
                                                    <div class="flex flex-wrap gap-2">
                                                        ${[...new Set(data.questions.filter(q => !q.isCorrect).map(q => q.question))].slice(0, 10).map(q => `
                                                            <span class="bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-bold">${q}</span>
                                                        `).join('')}
                                                    </div>
                                                </div>
                                            ` : ''}

                                            <!-- 正解した問題 -->
                                            ${data.questions.filter(q => q.isCorrect).length > 0 ? `
                                                <div class="mt-3 pt-3 border-t">
                                                    <p class="text-sm font-bold text-green-500 mb-2">⭕ 正解した問題:</p>
                                                    <div class="flex flex-wrap gap-2">
                                                        ${[...new Set(data.questions.filter(q => q.isCorrect).map(q => q.question))].slice(0, 10).map(q => `
                                                            <span class="bg-green-50 text-green-600 px-2 py-1 rounded text-sm font-bold">${q}</span>
                                                        `).join('')}
                                                    </div>
                                                </div>
                                            ` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            `}
                        ` : viewMode === 'apps' ? `
                            <!-- アプリ設定 -->
                            <div class="space-y-4">
                                <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                    <p class="text-blue-700 font-bold text-sm">
                                        💡 トップページに表示するアプリを選択できます。<br>
                                        チェックを外すとトップページから非表示になります。
                                    </p>
                                </div>

                                <div class="space-y-3">
                                    ${allApps.map(app => `
                                        <div class="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                                            <div class="flex items-center gap-4">
                                                <span class="text-3xl">${app.icon}</span>
                                                <div>
                                                    <h3 class="font-bold text-gray-700">${app.title}</h3>
                                                    <p class="text-sm text-gray-500">${app.desc}</p>
                                                </div>
                                            </div>
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" class="sr-only peer app-toggle" data-app-id="${app.id}" ${visibleAppIds.includes(app.id) ? 'checked' : ''}>
                                                <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-400"></div>
                                            </label>
                                        </div>
                                    `).join('')}
                                </div>

                                <button id="btn-save-settings" class="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-4 rounded-xl shadow-lg hover:from-pink-500 hover:to-purple-500 transition ${isSaving ? 'opacity-50' : ''}">
                                    ${isSaving ? '保存中...' : '💾 設定を保存'}
                                </button>

                                <p class="text-center text-gray-400 text-sm">
                                    現在 ${visibleAppIds.length} / ${allApps.length} 個のアプリが表示されています
                                </p>
                            </div>
                        ` : viewMode === 'theme' ? `
                            <!-- テーマ設定 -->
                            <div class="space-y-4">
                                <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                    <p class="text-purple-700 font-bold text-sm">
                                        🎨 <strong>${system.currentChild?.name || 'ゲスト'}</strong>のテーマを選択できます。<br>
                                        アカウントごとに別のテーマを設定できます。
                                    </p>
                                </div>

                                <div class="space-y-4">
                                    <!-- かわいいテーマ -->
                                    <div class="theme-card cursor-pointer rounded-2xl overflow-hidden shadow-lg border-4 ${currentTheme === 'cute' ? 'border-pink-400 ring-4 ring-pink-200' : 'border-transparent hover:border-pink-200'}" data-theme="cute">
                                        <div class="h-32 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 relative">
                                            <div class="absolute inset-0 flex items-center justify-center">
                                                <span class="text-5xl">🏰</span>
                                            </div>
                                            <div class="absolute top-2 left-2 text-2xl opacity-60">🌸</div>
                                            <div class="absolute top-4 right-4 text-xl opacity-60">💖</div>
                                            <div class="absolute bottom-2 left-4 text-xl opacity-60">✨</div>
                                            <div class="absolute bottom-4 right-2 text-2xl opacity-60">🦋</div>
                                        </div>
                                        <div class="bg-white p-4">
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <h3 class="font-black text-pink-500 text-lg">かわいい</h3>
                                                    <p class="text-gray-500 text-sm">ピンクと紫のファンタジー風</p>
                                                    <p class="text-gray-400 text-xs mt-1">低学年の女の子におすすめ</p>
                                                </div>
                                                ${currentTheme === 'cute' ? '<span class="bg-pink-400 text-white px-3 py-1 rounded-full text-sm font-bold">選択中</span>' : ''}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- かっこいいテーマ -->
                                    <div class="theme-card cursor-pointer rounded-2xl overflow-hidden shadow-lg border-4 ${currentTheme === 'cool' ? 'border-cyan-400 ring-4 ring-cyan-200' : 'border-transparent hover:border-cyan-200'}" data-theme="cool">
                                        <div class="h-32 bg-gradient-to-br from-slate-800 via-cyan-800 to-teal-700 relative">
                                            <div class="absolute inset-0 flex items-center justify-center">
                                                <span class="text-5xl">🚀</span>
                                            </div>
                                            <div class="absolute top-2 left-2 text-2xl opacity-60">🦖</div>
                                            <div class="absolute top-4 right-4 text-xl opacity-60">⚡</div>
                                            <div class="absolute bottom-2 left-4 text-xl opacity-60">🎮</div>
                                            <div class="absolute bottom-4 right-2 text-2xl opacity-60">🔥</div>
                                        </div>
                                        <div class="bg-white p-4">
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <h3 class="font-black text-cyan-600 text-lg">かっこいい</h3>
                                                    <p class="text-gray-500 text-sm">ダークブルーのアドベンチャー風</p>
                                                    <p class="text-gray-400 text-xs mt-1">低学年の男の子におすすめ</p>
                                                </div>
                                                ${currentTheme === 'cool' ? '<span class="bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold">選択中</span>' : ''}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- スマートテーマ -->
                                    <div class="theme-card cursor-pointer rounded-2xl overflow-hidden shadow-lg border-4 ${currentTheme === 'smart' ? 'border-slate-400 ring-4 ring-slate-200' : 'border-transparent hover:border-slate-200'}" data-theme="smart">
                                        <div class="h-32 bg-gradient-to-br from-slate-200 via-gray-200 to-slate-300 relative">
                                            <div class="absolute inset-0 flex items-center justify-center">
                                                <span class="text-5xl">📱</span>
                                            </div>
                                            <div class="absolute top-2 left-2 text-2xl text-slate-400 opacity-60">◆</div>
                                            <div class="absolute top-4 right-4 text-xl text-slate-400 opacity-60">○</div>
                                            <div class="absolute bottom-2 left-4 text-xl text-slate-400 opacity-60">□</div>
                                            <div class="absolute bottom-4 right-2 text-2xl text-slate-400 opacity-60">△</div>
                                        </div>
                                        <div class="bg-white p-4">
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <h3 class="font-black text-slate-600 text-lg">スマート</h3>
                                                    <p class="text-gray-500 text-sm">シンプルでモダンなデザイン</p>
                                                    <p class="text-gray-400 text-xs mt-1">高学年の男女におすすめ</p>
                                                </div>
                                                ${currentTheme === 'smart' ? '<span class="bg-slate-500 text-white px-3 py-1 rounded-full text-sm font-bold">選択中</span>' : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                ${isSaving ? '<p class="text-center text-gray-400 font-bold animate-pulse">保存中...</p>' : ''}
                            </div>
                        ` : viewMode === 'admin' ? `
                            <!-- 管理者画面 -->
                            <div class="space-y-4">
                                <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                    <p class="text-purple-700 font-bold text-sm">
                                        👥 子供アカウントを管理できます。<br>
                                        名前・PIN・アバターを設定してください。
                                    </p>
                                </div>

                                <!-- 子供一覧 -->
                                <div class="space-y-3">
                                    ${activeChildren.length === 0 ? `
                                        <div class="text-center text-gray-400 py-8">
                                            <div class="text-4xl mb-2">👶</div>
                                            <p class="font-bold">まだ子供がいません</p>
                                            <p class="text-sm mt-1">下のボタンから追加してください</p>
                                        </div>
                                    ` : activeChildren.map(child => `
                                        <div class="bg-white rounded-xl p-4 shadow-sm">
                                            <div class="flex items-center justify-between">
                                                <div class="flex items-center gap-3">
                                                    <span class="text-3xl">${child.avatarEmoji || '👤'}</span>
                                                    <div>
                                                        <h3 class="font-bold text-gray-700">${child.name}</h3>
                                                        <p class="text-sm text-gray-400">PIN: ****</p>
                                                    </div>
                                                </div>
                                                <div class="flex gap-2">
                                                    <button class="edit-child-btn bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold hover:bg-blue-200" data-child-id="${child.id}">
                                                        編集
                                                    </button>
                                                    <button class="delete-child-btn bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold hover:bg-red-200" data-child-id="${child.id}" data-child-name="${child.name}">
                                                        削除
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>

                                <!-- 追加/編集フォーム -->
                                <div class="bg-white rounded-xl p-4 shadow-sm border-2 border-dashed border-purple-200">
                                    <h3 class="font-bold text-gray-700 mb-4">
                                        ${editingChild ? `✏️ ${editingChild.name} を編集` : '➕ 新しい子供を追加'}
                                    </h3>

                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-bold text-gray-600 mb-1">なまえ（ひらがな）</label>
                                            <input type="text" id="child-name-input" placeholder="かりん" value="${editingChild?.name || ''}"
                                                class="w-full border-2 rounded-lg py-2 px-3 text-lg font-bold focus:outline-none focus:border-purple-400">
                                        </div>

                                        <div>
                                            <label class="block text-sm font-bold text-gray-600 mb-1">PIN（4桁の数字）</label>
                                            <input type="text" id="child-pin-input" placeholder="1234" maxlength="4" pattern="[0-9]{4}" value="${editingChild?.pin || ''}"
                                                class="w-full border-2 rounded-lg py-2 px-3 text-lg font-bold focus:outline-none focus:border-purple-400 tracking-widest">
                                        </div>

                                        <div>
                                            <label class="block text-sm font-bold text-gray-600 mb-2">アバター</label>
                                            <div class="flex flex-wrap gap-2" id="avatar-selector">
                                                ${avatarEmojis.map(emoji => `
                                                    <button class="avatar-btn w-10 h-10 text-2xl rounded-lg border-2 transition ${(editingChild?.avatarEmoji || '👧') === emoji ? 'border-purple-400 bg-purple-100' : 'border-gray-200 hover:border-purple-200'}" data-emoji="${emoji}">
                                                        ${emoji}
                                                    </button>
                                                `).join('')}
                                            </div>
                                            <input type="hidden" id="child-avatar-input" value="${editingChild?.avatarEmoji || '👧'}">
                                        </div>

                                        <div class="flex gap-2">
                                            ${editingChild ? `
                                                <button id="btn-cancel-edit" class="flex-1 bg-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-300 transition">
                                                    キャンセル
                                                </button>
                                                <button id="btn-save-child" class="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold py-3 rounded-xl shadow-lg hover:from-blue-500 hover:to-purple-500 transition ${isSaving ? 'opacity-50' : ''}">
                                                    ${isSaving ? '保存中...' : '💾 更新'}
                                                </button>
                                            ` : `
                                                <button id="btn-save-child" class="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-3 rounded-xl shadow-lg hover:from-pink-500 hover:to-purple-500 transition ${isSaving ? 'opacity-50' : ''}">
                                                    ${isSaving ? '保存中...' : '➕ 追加'}
                                                </button>
                                            `}
                                        </div>
                                    </div>
                                </div>

                                <p class="text-center text-gray-400 text-sm">
                                    現在 ${activeChildren.length} 人のアカウントがあります
                                </p>
                            </div>
                        ` : ``}
                    </div>
                </div>
            `;

            setupEventListeners();
        };

        // イベントリスナー
        const setupEventListeners = () => {
            container.querySelector('#btn-back')?.addEventListener('click', () => system.goHome());

            container.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    viewMode = btn.dataset.mode;
                    render();
                });
            });

            container.querySelectorAll('.date-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    selectedDate = btn.dataset.date || null;
                    render();
                });
            });

            // 子供フィルター
            container.querySelectorAll('.child-filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    selectedChildFilter = btn.dataset.child || null;
                    render();
                });
            });

            // アプリ設定用
            container.querySelectorAll('.app-toggle').forEach(toggle => {
                toggle.addEventListener('change', () => {
                    toggleAppVisibility(toggle.dataset.appId);
                });
            });

            container.querySelector('#btn-save-settings')?.addEventListener('click', saveVisibilitySettings);

            // テーマ設定用
            container.querySelectorAll('.theme-card').forEach(card => {
                card.addEventListener('click', () => {
                    const theme = card.dataset.theme;
                    if (theme && theme !== currentTheme) {
                        saveThemeSetting(theme);
                    }
                });
            });

            // === 管理者機能用 ===

            // アバター選択
            container.querySelectorAll('.avatar-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const emoji = btn.dataset.emoji;
                    const input = container.querySelector('#child-avatar-input');
                    if (input) input.value = emoji;

                    // 選択状態を更新
                    container.querySelectorAll('.avatar-btn').forEach(b => {
                        b.classList.remove('border-purple-400', 'bg-purple-100');
                        b.classList.add('border-gray-200');
                    });
                    btn.classList.remove('border-gray-200');
                    btn.classList.add('border-purple-400', 'bg-purple-100');
                });
            });

            // 子供を追加/更新
            container.querySelector('#btn-save-child')?.addEventListener('click', () => {
                const name = container.querySelector('#child-name-input')?.value.trim();
                const pin = container.querySelector('#child-pin-input')?.value.trim();
                const avatar = container.querySelector('#child-avatar-input')?.value || '👧';

                // バリデーション
                if (!name) {
                    alert('なまえを入力してください');
                    return;
                }
                if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
                    alert('PINは4桁の数字で入力してください');
                    return;
                }

                if (editingChild) {
                    updateChild(editingChild.id, name, pin, avatar);
                } else {
                    addChild(name, pin, avatar);
                }
            });

            // 編集ボタン
            container.querySelectorAll('.edit-child-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const childId = btn.dataset.childId;
                    editingChild = children.find(c => c.id === childId);
                    render();
                });
            });

            // 削除ボタン
            container.querySelectorAll('.delete-child-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const childId = btn.dataset.childId;
                    const childName = btn.dataset.childName;
                    deleteChild(childId, childName);
                });
            });

            // キャンセルボタン
            container.querySelector('#btn-cancel-edit')?.addEventListener('click', () => {
                editingChild = null;
                render();
            });
        };

        // 初期化
        const init = async () => {
            // 管理者モードで入った場合は管理タブを最初に表示
            if (isAdminMode) {
                viewMode = 'admin';
            }
            render();
            await loadAppRegistry();
            await Promise.all([
                loadUsageLogs(),
                loadQuizLogs(),
                loadVisibilitySettings(),
                loadThemeSetting(),
                loadChildren()
            ]);
            isLoading = false;
            render();
        };

        init();

        return () => {};
    }
};
