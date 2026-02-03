/**
 * かぞくメッセージ
 * 子供と親がテキスト・ボイスメッセージをやり取りするアプリ
 */

// EmailJS設定
const EMAILJS_PUBLIC_KEY = 'SGmpo1Qk1dUUhM9m5';
const EMAILJS_SERVICE_ID = 'service_zfirp4f';
const EMAILJS_TEMPLATE_ID = 'template_brrkdem';

export default {
    launch(container, system) {
        // Firebase初期化（launch内で遅延初期化）
        let db = null;
        let messages = [];
        let unsubscribe = null;
        let inputText = '';
        let isRecording = false;
        let mediaRecorder = null;
        let audioChunks = [];
        let userType = 'child';
        let emailjsLoaded = false;
        let showHistory = false;

        // 現在ログイン中の子供を取得
        const currentChild = window.getCurrentChild ? window.getCurrentChild() : null;
        const childId = currentChild?.id || null;

        // EmailJS読み込み
        const loadEmailJS = async () => {
            if (emailjsLoaded) return true;
            try {
                // EmailJS SDKを動的に読み込み
                if (!window.emailjs) {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }
                window.emailjs.init(EMAILJS_PUBLIC_KEY);
                emailjsLoaded = true;
                return true;
            } catch (e) {
                console.error('EmailJS読み込みエラー:', e);
                return false;
            }
        };

        // メール通知送信
        const sendEmailNotification = async (messageContent, messageType) => {
            if (!emailjsLoaded) {
                await loadEmailJS();
            }
            try {
                const fromName = userType === 'child' ? 'こども' : 'おやこ';
                const messageText = messageType === 'voice' ? '🎤 ボイスメッセージ' : messageContent;

                await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    from_name: fromName,
                    message: messageText
                });
                console.log('メール通知送信成功');
            } catch (e) {
                console.error('メール通知送信エラー:', e);
            }
        };

        const initFirebase = async () => {
            try {
                const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
                const { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

                const firebaseConfig = {
                    apiKey: "AIzaSyCcM38mjkSVXJDFJaxqZ8PXCuLr-bwNfsU",
                    authDomain: "family-app-1006.firebaseapp.com",
                    projectId: "family-app-1006",
                    storageBucket: "family-app-1006.firebasestorage.app",
                    messagingSenderId: "516894951381",
                    appId: "1:516894951381:web:76d0b88cb8c406d6791f5c"
                };

                const appName = 'message-app';
                let app = getApps().find(a => a.name === appName);
                if (!app) {
                    app = initializeApp(firebaseConfig, appName);
                }
                db = getFirestore(app);

                // Firestoreの関数をグローバルに保存
                window._msgFirestore = { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, where, getDocs };

                return true;
            } catch (e) {
                console.error('Firebase初期化エラー:', e);
                return false;
            }
        };

        // ユーザータイプを判定
        const isParentMode = () => {
            return window.location.hash === '#parent' || sessionStorage.getItem('parentMode') === 'true';
        };
        userType = isParentMode() ? 'parent' : 'child';

        // メッセージを既読にする（自分の子供のメッセージのみ）
        const markAsRead = async () => {
            if (!db || !window._msgFirestore) return;
            const { collection, query, where, getDocs, doc, updateDoc } = window._msgFirestore;
            try {
                // 自分の子供のメッセージのみ取得
                const baseQuery = collection(db, 'family_messages');
                const snapshot = await getDocs(baseQuery);

                // childIdでフィルタリングして未読のものを既読に
                const updates = snapshot.docs
                    .filter(d => {
                        const data = d.data();
                        return data.to === userType &&
                               data.read === false &&
                               (childId ? data.childId === childId : true);
                    })
                    .map(d => updateDoc(doc(db, 'family_messages', d.id), { read: true }));

                await Promise.all(updates);
            } catch (e) {
                console.error('既読更新エラー:', e);
            }
        };

        // メッセージ送信
        const sendMessage = async (type, content) => {
            if (!content || !db || !window._msgFirestore) return;
            const { collection, addDoc, serverTimestamp } = window._msgFirestore;

            try {
                await addDoc(collection(db, 'family_messages'), {
                    type: type,
                    content: content,
                    from: userType,
                    to: userType === 'child' ? 'parent' : 'child',
                    read: false,
                    timestamp: serverTimestamp(),
                    childId: childId,
                    childName: currentChild?.name || null
                });

                // 子供が親にメッセージを送った場合、メール通知
                if (userType === 'child') {
                    sendEmailNotification(content, type);
                }

                inputText = '';
                render();
            } catch (e) {
                console.error('送信エラー:', e);
                alert('おくれませんでした');
            }
        };

        // 音声録音開始
        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = (e) => {
                    audioChunks.push(e.data);
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        sendMessage('voice', reader.result);
                    };
                    reader.readAsDataURL(audioBlob);
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                isRecording = true;
                render();
            } catch (e) {
                console.error('録音エラー:', e);
                alert('マイクが つかえません');
            }
        };

        // 音声録音停止
        const stopRecording = () => {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                isRecording = false;
                render();
            }
        };

        // 音声再生
        const playAudio = (base64Audio) => {
            const audio = new Audio(base64Audio);
            audio.play();
        };

        // 時刻フォーマット
        const formatTime = (timestamp) => {
            if (!timestamp) return '';
            const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            const now = new Date();
            const isToday = d.toDateString() === now.toDateString();
            if (isToday) {
                return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
            } else {
                return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
            }
        };

        // 日付を詳細フォーマット
        const formatDateDetail = (timestamp) => {
            if (!timestamp) return '';
            const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            const weekdays = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];
            return `${d.getMonth() + 1}/${d.getDate()}(${weekdays[d.getDay()]})`;
        };

        // メッセージを日付でグループ化
        const groupMessagesByDate = () => {
            const groups = {};
            messages.forEach(msg => {
                if (!msg.timestamp) return;
                const d = msg.timestamp.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp);
                const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (!groups[dateKey]) {
                    groups[dateKey] = { date: d, messages: [] };
                }
                groups[dateKey].messages.push(msg);
            });
            // 日付の新しい順にソート
            return Object.entries(groups)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([key, value]) => value);
        };

        // 描画
        const render = () => {
            const fromLabel = userType === 'child' ? 'わたし' : 'ほごしゃ';
            const toLabel = userType === 'child' ? 'パパママ' : 'こども';

            container.innerHTML = `
                <style>
                    .message-bubble { max-width: 80%; word-break: break-word; }
                    .message-from-me { background: linear-gradient(135deg, #FFB6C1, #DDA0DD); margin-left: auto; border-radius: 20px 20px 4px 20px; }
                    .message-from-other { background: white; margin-right: auto; border-radius: 20px 20px 20px 4px; border: 2px solid #E5E7EB; }
                    .voice-btn { animation: ${isRecording ? 'pulse 1s infinite' : 'none'}; }
                    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                </style>

                <div class="h-full flex flex-col bg-gradient-to-b from-pink-50 to-purple-50">
                    <div class="bg-white shadow px-3 py-2 flex justify-between items-center">
                        <button id="btn-back" class="text-gray-500 font-bold text-sm">← もどる</button>
                        <h1 class="text-lg font-black text-pink-500 flex items-center gap-2">
                            💌 ${userType === 'child' ? 'パパママへ' : 'こどもへ'}
                        </h1>
                        <button id="btn-history" class="text-purple-500 font-bold text-sm">📖 きろく</button>
                    </div>

                    <div id="message-list" class="flex-1 overflow-y-auto p-3 space-y-3">
                        ${messages.length === 0 ? `
                            <div class="h-full flex flex-col items-center justify-center text-gray-400">
                                <div class="text-5xl mb-3">💬</div>
                                <p class="font-bold">まだ メッセージが ないよ</p>
                                <p class="text-sm mt-1">${toLabel}に メッセージを おくろう！</p>
                            </div>
                        ` : messages.map(msg => {
                            const isMe = msg.from === userType;
                            return `
                                <div class="flex flex-col ${isMe ? 'items-end' : 'items-start'}">
                                    <div class="message-bubble ${isMe ? 'message-from-me text-white' : 'message-from-other text-gray-700'} px-4 py-3 shadow-sm">
                                        ${msg.type === 'text' ? `<p class="font-bold">${msg.content}</p>` : `
                                            <button class="play-audio flex items-center gap-2 font-bold" data-audio="${msg.content}">
                                                <span class="text-2xl">🔊</span><span>ボイスメッセージ</span>
                                            </button>
                                        `}
                                    </div>
                                    <span class="text-xs text-gray-400 mt-1 px-2">
                                        ${isMe ? '' : (msg.from === 'child' ? '👧' : '👨‍👩‍👧')} ${formatTime(msg.timestamp)}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="bg-white border-t p-3">
                        <div class="flex gap-2 items-end">
                            <button id="btn-voice" class="voice-btn flex-shrink-0 w-14 h-14 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gradient-to-r from-purple-400 to-pink-400'} text-white text-2xl shadow-lg active:scale-95 transition flex items-center justify-center">
                                ${isRecording ? '⏹️' : '🎤'}
                            </button>
                            <div class="flex-1 flex gap-2">
                                <input type="text" id="input-message" value="${inputText}" placeholder="メッセージを いれてね"
                                    class="flex-1 bg-gray-100 border-2 border-gray-200 rounded-full px-4 py-3 font-bold focus:outline-none focus:border-pink-300 text-lg">
                                <button id="btn-send" class="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white text-2xl shadow-lg active:scale-95 transition flex items-center justify-center ${!inputText ? 'opacity-50' : ''}">
                                    📨
                                </button>
                            </div>
                        </div>
                        ${isRecording ? `<div class="mt-2 text-center"><p class="text-red-500 font-bold animate-pulse">🎙️ ろくおん中... ボタンを おして おわる</p></div>` : ''}
                    </div>
                </div>

                ${showHistory ? `
                    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="history-overlay">
                        <div class="bg-white rounded-2xl p-5 max-w-lg w-[90%] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-xl font-black text-purple-600 flex items-center gap-2">📖 メッセージの きろく</h3>
                                <button id="btn-close-history" class="text-2xl text-gray-400 hover:text-gray-600">×</button>
                            </div>
                            <div class="flex-1 overflow-y-auto space-y-4">
                                ${messages.length === 0 ? `
                                    <div class="text-center py-8 text-gray-400">
                                        <span class="text-5xl block mb-3">💬</span>
                                        <p class="font-bold">まだ きろくが ないよ</p>
                                    </div>
                                ` : groupMessagesByDate().map(group => `
                                    <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border-2 border-pink-200">
                                        <div class="flex items-center gap-2 mb-3">
                                            <span class="text-lg">📅</span>
                                            <span class="font-black text-purple-600">${formatDateDetail(group.date)}</span>
                                            <span class="text-xs text-gray-400">(${group.messages.length}けん)</span>
                                        </div>
                                        <div class="space-y-2">
                                            ${group.messages.map(msg => `
                                                <div class="flex items-start gap-2 ${msg.from === userType ? 'flex-row-reverse' : ''}">
                                                    <span class="text-lg">${msg.from === 'child' ? '👧' : '👨‍👩‍👧'}</span>
                                                    <div class="${msg.from === userType ? 'bg-pink-200 text-pink-800' : 'bg-white border border-gray-200 text-gray-700'} rounded-lg px-3 py-2 text-sm font-bold max-w-[80%]">
                                                        ${msg.type === 'text' ? msg.content : '🎤 ボイスメッセージ'}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}
            `;

            setupListeners();
            scrollToBottom();
        };

        const scrollToBottom = () => {
            const list = container.querySelector('#message-list');
            if (list) list.scrollTop = list.scrollHeight;
        };

        const setupListeners = () => {
            container.querySelector('#btn-back')?.addEventListener('click', () => system.goHome());

            const inputEl = container.querySelector('#input-message');
            inputEl?.addEventListener('input', (e) => {
                inputText = e.target.value;
                const sendBtn = container.querySelector('#btn-send');
                if (sendBtn) {
                    sendBtn.classList.toggle('opacity-50', !inputText);
                }
            });

            container.querySelector('#btn-send')?.addEventListener('click', () => {
                if (inputText.trim()) sendMessage('text', inputText.trim());
            });

            inputEl?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && inputText.trim()) sendMessage('text', inputText.trim());
            });

            container.querySelector('#btn-voice')?.addEventListener('click', () => {
                if (isRecording) stopRecording();
                else startRecording();
            });

            container.querySelectorAll('.play-audio').forEach(btn => {
                btn.addEventListener('click', () => playAudio(btn.dataset.audio));
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

        // リアルタイム監視（自分の子供のメッセージのみ）
        const startListening = () => {
            if (!db || !window._msgFirestore) return;
            const { collection, query, orderBy, onSnapshot, where } = window._msgFirestore;

            // 自分の子供のメッセージのみ取得
            const q = childId
                ? query(collection(db, 'family_messages'), where('childId', '==', childId))
                : query(collection(db, 'family_messages'));

            unsubscribe = onSnapshot(q, (snapshot) => {
                messages = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                // timestampでソート
                messages.sort((a, b) => {
                    const timeA = a.timestamp?.toMillis?.() || 0;
                    const timeB = b.timestamp?.toMillis?.() || 0;
                    return timeA - timeB;
                });
                render();
                markAsRead();
            }, (error) => {
                console.error('メッセージ監視エラー:', error);
            });
        };

        // 初期化
        const init = async () => {
            render(); // まず画面を表示
            const success = await initFirebase();
            if (success) {
                startListening();
                markAsRead();
            } else {
                container.innerHTML = `
                    <div class="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                        <div class="text-5xl mb-4">😢</div>
                        <p class="font-bold">つながらないよ</p>
                        <button id="btn-back-error" class="mt-4 bg-pink-400 text-white font-bold py-2 px-6 rounded-full">もどる</button>
                    </div>
                `;
                container.querySelector('#btn-back-error')?.addEventListener('click', () => system.goHome());
            }
        };

        init();

        return () => {
            if (unsubscribe) unsubscribe();
            if (mediaRecorder && isRecording) mediaRecorder.stop();
        };
    }
};
