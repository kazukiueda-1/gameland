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
    setDoc
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
        let viewMode = 'usage'; // 'usage', 'quiz', or 'apps'
        let isLoading = true;
        let allApps = [];
        let visibleAppIds = [];
        let isSaving = false;

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
            const filteredUsage = getLogsForDate(usageLogs, selectedDate);
            const filteredQuiz = getLogsForDate(quizLogs, selectedDate);
            const usageByApp = groupByApp(filteredUsage);
            const quizSummary = summarizeQuizLogs(filteredQuiz);

            container.innerHTML = `
                <style>
                    .parent-container { font-family: 'Zen Maru Gothic', sans-serif; }
                    .tab-btn.active { background: #3B82F6; color: white; }
                    .date-btn.active { background: #3B82F6; color: white; }
                </style>

                <div class="parent-container h-full flex flex-col bg-gray-50">
                    <!-- ヘッダー -->
                    <div class="bg-white shadow px-4 py-3 flex justify-between items-center">
                        <button id="btn-back" class="text-gray-500 hover:text-gray-700 font-bold">
                            ← もどる
                        </button>
                        <h1 class="text-lg font-bold text-gray-700">👤 ほごしゃよう</h1>
                        <div class="w-16"></div>
                    </div>

                    <!-- タブ切り替え -->
                    <div class="bg-white border-b flex">
                        <button class="tab-btn flex-1 py-3 font-bold text-sm ${viewMode === 'usage' ? 'active' : 'text-gray-500'}" data-mode="usage">
                            📱 使用履歴
                        </button>
                        <button class="tab-btn flex-1 py-3 font-bold text-sm ${viewMode === 'quiz' ? 'active' : 'text-gray-500'}" data-mode="quiz">
                            📝 クイズ
                        </button>
                        <button class="tab-btn flex-1 py-3 font-bold text-sm ${viewMode === 'apps' ? 'active' : 'text-gray-500'}" data-mode="apps">
                            ⚙️ アプリ設定
                        </button>
                    </div>

                    <!-- 日付選択 -->
                    <div class="bg-white border-b px-2 py-2 overflow-x-auto">
                        <div class="flex gap-2 min-w-max">
                            <button class="date-btn px-3 py-1 rounded-full text-sm font-bold ${!selectedDate ? 'active' : 'bg-gray-100 text-gray-600'}" data-date="">
                                すべて
                            </button>
                            ${dateList.slice(0, 14).map(d => `
                                <button class="date-btn px-3 py-1 rounded-full text-sm font-bold ${selectedDate === d.value ? 'active' : 'bg-gray-100 text-gray-600'}" data-date="${d.value}">
                                    ${d.display}${d.isToday ? '(今日)' : ''}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- コンテンツ -->
                    <div class="flex-1 overflow-y-auto p-4">
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
                        ` : `
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
                        `}
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

            // アプリ設定用
            container.querySelectorAll('.app-toggle').forEach(toggle => {
                toggle.addEventListener('change', () => {
                    toggleAppVisibility(toggle.dataset.appId);
                });
            });

            container.querySelector('#btn-save-settings')?.addEventListener('click', saveVisibilitySettings);
        };

        // 初期化
        const init = async () => {
            render();
            await loadAppRegistry();
            await Promise.all([loadUsageLogs(), loadQuizLogs(), loadVisibilitySettings()]);
            isLoading = false;
            render();
        };

        init();

        return () => {};
    }
};
