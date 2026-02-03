/**
 * アプリリクエスト
 * 子供がほしいアプリのアイデアを入力するアプリ
 */

export default {
    launch(container, system) {
        let db = null;
        let requests = [];
        let unsubscribe = null;
        let inputText = '';
        let showForm = false;
        let showHistory = false;

        // 現在ログイン中の子供を取得
        const currentChild = window.getCurrentChild ? window.getCurrentChild() : null;
        const childId = currentChild?.id || null;

        const initFirebase = async () => {
            try {
                const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
                const { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, where } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

                const firebaseConfig = {
                    apiKey: "AIzaSyCcM38mjkSVXJDFJaxqZ8PXCuLr-bwNfsU",
                    authDomain: "family-app-1006.firebaseapp.com",
                    projectId: "family-app-1006",
                    storageBucket: "family-app-1006.firebasestorage.app",
                    messagingSenderId: "516894951381",
                    appId: "1:516894951381:web:76d0b88cb8c406d6791f5c"
                };

                const appName = 'request-app';
                let app = getApps().find(a => a.name === appName);
                if (!app) {
                    app = initializeApp(firebaseConfig, appName);
                }
                db = getFirestore(app);

                window._reqFirestore = { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, where };

                return true;
            } catch (e) {
                console.error('Firebase初期化エラー:', e);
                return false;
            }
        };

        // リクエスト送信
        const submitRequest = async () => {
            if (!inputText.trim()) {
                alert('リクエストを いれてね');
                return;
            }
            if (!db || !window._reqFirestore) return;
            const { collection, addDoc, serverTimestamp } = window._reqFirestore;

            try {
                await addDoc(collection(db, 'app_requests'), {
                    content: inputText.trim(),
                    status: 'new',
                    createdAt: serverTimestamp(),
                    childId: childId,
                    childName: currentChild?.name || null
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
            if (!confirm('このリクエストを けす？')) return;
            if (!db || !window._reqFirestore) return;
            const { deleteDoc, doc } = window._reqFirestore;

            try {
                await deleteDoc(doc(db, 'app_requests', id));
            } catch (e) {
                console.error('削除エラー:', e);
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

        // 日付を詳細フォーマット
        const formatDateDetail = (timestamp) => {
            if (!timestamp) return '';
            const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            const weekdays = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];
            return `${d.getMonth() + 1}/${d.getDate()}(${weekdays[d.getDay()]})`;
        };

        // 描画
        const render = () => {
            container.innerHTML = `
                <style>
                    .request-card { transition: all 0.3s ease; }
                    .request-card:hover { transform: translateY(-2px); }
                </style>

                <div class="h-full flex flex-col bg-gradient-to-b from-yellow-50 to-orange-50">
                    <div class="bg-white shadow px-3 py-2 flex justify-between items-center">
                        <button id="btn-back" class="text-gray-500 font-bold text-sm">← もどる</button>
                        <h1 class="text-lg font-black text-orange-500 flex items-center gap-2">💡 アプリリクエスト</h1>
                        <div class="w-14"></div>
                    </div>

                    <div class="bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-3 border-b">
                        <p class="text-orange-700 font-bold text-sm text-center">🌟 こんなアプリが ほしい！を おしえてね 🌟</p>
                    </div>

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
                                                <span class="${status.color} text-xs font-bold px-3 py-1 rounded-full">${status.emoji} ${status.text}</span>
                                                <button class="delete-btn text-gray-300 hover:text-red-400 text-lg" data-id="${req.id}">✕</button>
                                            </div>
                                            <p class="text-gray-700 font-bold text-lg leading-relaxed mb-2">${req.content}</p>
                                            <p class="text-gray-400 text-xs">📅 ${formatDate(req.createdAt)}</p>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        `}
                    </div>

                    ${showForm ? `
                        <div class="bg-white border-t p-4">
                            <div class="mb-3">
                                <textarea id="input-request" placeholder="どんなアプリが ほしい？&#10;たとえば...&#10;・えを かくアプリ&#10;・どうぶつクイズ&#10;・おんがくアプリ"
                                    class="w-full h-32 bg-gray-50 border-2 border-orange-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-orange-400 text-lg resize-none">${inputText}</textarea>
                            </div>
                            <div class="flex gap-3">
                                <button id="btn-cancel" class="flex-1 bg-gray-200 text-gray-600 font-bold py-3 rounded-xl">やめる</button>
                                <button id="btn-submit" class="flex-1 bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold py-3 rounded-xl shadow-lg">📨 おくる！</button>
                            </div>
                        </div>
                    ` : `
                        <div class="p-4 space-y-2">
                            <button id="btn-new" class="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-3">
                                <span class="text-2xl">✨</span> あたらしい リクエスト
                            </button>
                            <button id="btn-history" class="w-full bg-gradient-to-r from-purple-300 to-indigo-300 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-lg py-3 rounded-xl shadow-md active:scale-95 transition flex items-center justify-center gap-2">
                                📖 きろく
                            </button>
                        </div>
                    `}
                </div>

                ${showHistory ? `
                    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="history-overlay">
                        <div class="bg-white rounded-2xl p-5 max-w-lg w-[90%] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-xl font-black text-purple-600 flex items-center gap-2">📖 リクエストの きろく</h3>
                                <button id="btn-close-history" class="text-2xl text-gray-400 hover:text-gray-600">×</button>
                            </div>
                            <div class="flex-1 overflow-y-auto space-y-3">
                                ${requests.length === 0 ? `
                                    <div class="text-center py-8 text-gray-400">
                                        <span class="text-5xl block mb-3">📝</span>
                                        <p class="font-bold">まだ きろくが ないよ</p>
                                    </div>
                                ` : requests.map(req => {
                                    const status = getStatusLabel(req.status);
                                    return `
                                        <div class="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border-2 border-orange-200">
                                            <div class="flex justify-between items-start mb-2">
                                                <span class="text-sm font-bold text-orange-600">📅 ${formatDateDetail(req.createdAt)}</span>
                                                <span class="${status.color} text-xs font-bold px-2 py-1 rounded-full">${status.emoji} ${status.text}</span>
                                            </div>
                                            <p class="text-gray-700 font-bold">${req.content}</p>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}
            `;

            setupListeners();
        };

        const setupListeners = () => {
            container.querySelector('#btn-back')?.addEventListener('click', () => system.goHome());

            container.querySelector('#btn-new')?.addEventListener('click', () => {
                showForm = true;
                render();
                container.querySelector('#input-request')?.focus();
            });

            container.querySelector('#btn-cancel')?.addEventListener('click', () => {
                showForm = false;
                inputText = '';
                render();
            });

            container.querySelector('#input-request')?.addEventListener('input', (e) => {
                inputText = e.target.value;
            });

            container.querySelector('#btn-submit')?.addEventListener('click', submitRequest);

            container.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteRequest(btn.dataset.id));
            });

            // 履歴ボタン
            container.querySelector('#btn-history')?.addEventListener('click', () => {
                showHistory = true;
                render();
            });

            // 履歴閉じる
            container.querySelector('#btn-close-history')?.addEventListener('click', () => {
                showHistory = false;
                render();
            });

            container.querySelector('#history-overlay')?.addEventListener('click', (e) => {
                if (e.target.id === 'history-overlay') {
                    showHistory = false;
                    render();
                }
            });
        };

        // リアルタイム監視
        const startListening = () => {
            if (!db || !window._reqFirestore) return;
            const { collection, query, orderBy, onSnapshot, where } = window._reqFirestore;

            // 自分のリクエストのみ取得
            const q = childId
                ? query(collection(db, 'app_requests'), where('childId', '==', childId))
                : query(collection(db, 'app_requests'));

            unsubscribe = onSnapshot(q, (snapshot) => {
                requests = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                // createdAtでソート（新しい順）
                requests.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis?.() || 0;
                    const timeB = b.createdAt?.toMillis?.() || 0;
                    return timeB - timeA;
                });
                render();
            }, (error) => {
                console.error('リクエスト監視エラー:', error);
            });
        };

        // 初期化
        const init = async () => {
            render();
            const success = await initFirebase();
            if (success) {
                startListening();
            } else {
                container.innerHTML = `
                    <div class="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                        <div class="text-5xl mb-4">😢</div>
                        <p class="font-bold">つながらないよ</p>
                        <button id="btn-back-error" class="mt-4 bg-orange-400 text-white font-bold py-2 px-6 rounded-full">もどる</button>
                    </div>
                `;
                container.querySelector('#btn-back-error')?.addEventListener('click', () => system.goHome());
            }
        };

        init();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }
};
