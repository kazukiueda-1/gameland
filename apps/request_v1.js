/**
 * アプリリクエスト
 * 子供がほしいアプリのアイデアを入力するアプリ
 */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    deleteDoc,
    doc,
    updateDoc
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

// 既存のアプリがあれば使用、なければ新規作成
const appName = 'request-app';
const app = getApps().find(a => a.name === appName) || initializeApp(firebaseConfig, appName);
const db = getFirestore(app);

export default {
    launch(container, system) {
        let requests = [];
        let unsubscribe = null;
        let inputText = '';
        let showForm = false;

        // リクエスト送信
        const submitRequest = async () => {
            if (!inputText.trim()) {
                alert('リクエストを いれてね');
                return;
            }

            try {
                await addDoc(collection(db, 'app_requests'), {
                    content: inputText.trim(),
                    status: 'new', // 'new', 'reading', 'done'
                    createdAt: serverTimestamp()
                });
                inputText = '';
                showForm = false;
                render();
            } catch (e) {
                console.error('送信エラー:', e);
                alert('おくれませんでした');
            }
        };

        // リクエスト削除
        const deleteRequest = async (id) => {
            if (confirm('このリクエストを けす？')) {
                try {
                    await deleteDoc(doc(db, 'app_requests', id));
                } catch (e) {
                    console.error('削除エラー:', e);
                }
            }
        };

        // ステータス更新（保護者用）
        const updateStatus = async (id, status) => {
            try {
                await updateDoc(doc(db, 'app_requests', id), { status });
            } catch (e) {
                console.error('ステータス更新エラー:', e);
            }
        };

        // ステータスラベル
        const getStatusLabel = (status) => {
            switch (status) {
                case 'new': return { text: 'しんちょく', color: 'bg-yellow-100 text-yellow-600', emoji: '💭' };
                case 'reading': return { text: 'よんだよ', color: 'bg-blue-100 text-blue-600', emoji: '👀' };
                case 'done': return { text: 'つくったよ', color: 'bg-green-100 text-green-600', emoji: '✅' };
                default: return { text: '---', color: 'bg-gray-100 text-gray-600', emoji: '❓' };
            }
        };

        // 日付フォーマット
        const formatDate = (timestamp) => {
            if (!timestamp) return '';
            const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return `${d.getMonth() + 1}/${d.getDate()}`;
        };

        // 描画
        const render = () => {
            container.innerHTML = `
                <style>
                    .request-card {
                        transition: all 0.3s ease;
                    }
                    .request-card:hover {
                        transform: translateY(-2px);
                    }
                </style>

                <div class="h-full flex flex-col bg-gradient-to-b from-yellow-50 to-orange-50">
                    <!-- ヘッダー -->
                    <div class="bg-white shadow px-3 py-2 flex justify-between items-center">
                        <button id="btn-back" class="text-gray-500 font-bold text-sm">
                            ← もどる
                        </button>
                        <h1 class="text-lg font-black text-orange-500 flex items-center gap-2">
                            💡 アプリリクエスト
                        </h1>
                        <div class="w-14"></div>
                    </div>

                    <!-- 説明 -->
                    <div class="bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-3 border-b">
                        <p class="text-orange-700 font-bold text-sm text-center">
                            🌟 こんなアプリが ほしい！を おしえてね 🌟
                        </p>
                    </div>

                    <!-- リクエスト一覧 -->
                    <div class="flex-1 overflow-y-auto p-3">
                        ${requests.length === 0 ? `
                            <div class="h-full flex flex-col items-center justify-center text-gray-400">
                                <div class="text-6xl mb-4">🎨</div>
                                <p class="font-bold text-lg">まだ リクエストが ないよ</p>
                                <p class="text-sm mt-2">したの ボタンから<br>アイデアを おくろう！</p>
                            </div>
                        ` : `
                            <div class="space-y-3">
                                ${requests.map(req => {
                                    const status = getStatusLabel(req.status);
                                    return `
                                        <div class="request-card bg-white rounded-2xl p-4 shadow-md border-2 border-orange-100">
                                            <div class="flex justify-between items-start mb-2">
                                                <span class="${status.color} text-xs font-bold px-3 py-1 rounded-full">
                                                    ${status.emoji} ${status.text}
                                                </span>
                                                <button class="delete-btn text-gray-300 hover:text-red-400 text-lg" data-id="${req.id}">
                                                    ✕
                                                </button>
                                            </div>
                                            <p class="text-gray-700 font-bold text-lg leading-relaxed mb-2">
                                                ${req.content}
                                            </p>
                                            <p class="text-gray-400 text-xs">
                                                📅 ${formatDate(req.createdAt)}
                                            </p>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        `}
                    </div>

                    <!-- 入力フォーム -->
                    ${showForm ? `
                        <div class="bg-white border-t p-4">
                            <div class="mb-3">
                                <textarea id="input-request" placeholder="どんなアプリが ほしい？&#10;たとえば...&#10;・えを かくアプリ&#10;・どうぶつクイズ&#10;・おんがくアプリ"
                                    class="w-full h-32 bg-gray-50 border-2 border-orange-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-orange-400 text-lg resize-none">${inputText}</textarea>
                            </div>
                            <div class="flex gap-3">
                                <button id="btn-cancel" class="flex-1 bg-gray-200 text-gray-600 font-bold py-3 rounded-xl">
                                    やめる
                                </button>
                                <button id="btn-submit" class="flex-1 bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold py-3 rounded-xl shadow-lg">
                                    📨 おくる！
                                </button>
                            </div>
                        </div>
                    ` : `
                        <div class="p-4">
                            <button id="btn-new" class="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                                <span class="text-2xl">✨</span>
                                あたらしい リクエスト
                            </button>
                        </div>
                    `}
                </div>
            `;

            setupListeners();
        };

        const setupListeners = () => {
            container.querySelector('#btn-back')?.onclick = () => system.goHome();

            // 新規ボタン
            container.querySelector('#btn-new')?.onclick = () => {
                showForm = true;
                render();
                container.querySelector('#input-request')?.focus();
            };

            // キャンセル
            container.querySelector('#btn-cancel')?.onclick = () => {
                showForm = false;
                inputText = '';
                render();
            };

            // テキスト入力
            container.querySelector('#input-request')?.addEventListener('input', (e) => {
                inputText = e.target.value;
            });

            // 送信
            container.querySelector('#btn-submit')?.onclick = submitRequest;

            // 削除
            container.querySelectorAll('.delete-btn').forEach(btn => {
                btn.onclick = () => deleteRequest(btn.dataset.id);
            });
        };

        // リアルタイム監視
        const startListening = () => {
            const q = query(
                collection(db, 'app_requests'),
                orderBy('createdAt', 'desc')
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                requests = snapshot.docs.map(d => ({
                    id: d.id,
                    ...d.data()
                }));
                render();
            }, (error) => {
                console.error('リクエスト監視エラー:', error);
            });
        };

        // 初期化
        render();
        startListening();

        // クリーンアップ
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }
};
