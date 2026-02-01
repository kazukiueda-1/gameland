/**
 * かぞくメッセージ
 * 子供と親がテキスト・ボイスメッセージをやり取りするアプリ
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    doc,
    updateDoc,
    where,
    getDocs
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

const app = initializeApp(firebaseConfig, 'message-app');
const db = getFirestore(app);

export default {
    launch(container, system) {
        let messages = [];
        let unsubscribe = null;
        let inputText = '';
        let isRecording = false;
        let mediaRecorder = null;
        let audioChunks = [];
        let userType = 'child'; // 'child' or 'parent'

        // ユーザータイプを判定（保護者モードかどうか）
        const isParentMode = () => {
            return window.location.hash === '#parent' || sessionStorage.getItem('parentMode') === 'true';
        };

        // 初期化時にユーザータイプを設定
        userType = isParentMode() ? 'parent' : 'child';

        // 未読カウントを更新（グローバル通知用）
        const updateUnreadCount = async () => {
            try {
                const q = query(
                    collection(db, 'family_messages'),
                    where('to', '==', userType),
                    where('read', '==', false)
                );
                const snapshot = await getDocs(q);
                const count = snapshot.size;

                // グローバルな通知カウント更新イベントを発火
                window.dispatchEvent(new CustomEvent('messageNotification', {
                    detail: { count, userType }
                }));

                return count;
            } catch (e) {
                console.error('未読カウント取得エラー:', e);
                return 0;
            }
        };

        // メッセージを既読にする
        const markAsRead = async () => {
            try {
                const q = query(
                    collection(db, 'family_messages'),
                    where('to', '==', userType),
                    where('read', '==', false)
                );
                const snapshot = await getDocs(q);
                const updates = snapshot.docs.map(d =>
                    updateDoc(doc(db, 'family_messages', d.id), { read: true })
                );
                await Promise.all(updates);
                updateUnreadCount();
            } catch (e) {
                console.error('既読更新エラー:', e);
            }
        };

        // メッセージ送信
        const sendMessage = async (type, content) => {
            if (!content) return;

            try {
                await addDoc(collection(db, 'family_messages'), {
                    type: type, // 'text' or 'voice'
                    content: content,
                    from: userType,
                    to: userType === 'child' ? 'parent' : 'child',
                    read: false,
                    timestamp: serverTimestamp()
                });
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
                        const base64Audio = reader.result;
                        sendMessage('voice', base64Audio);
                    };
                    reader.readAsDataURL(audioBlob);

                    // ストリームを停止
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

        // 描画
        const render = () => {
            const fromLabel = userType === 'child' ? 'わたし' : 'ほごしゃ';
            const toLabel = userType === 'child' ? 'パパママ' : 'こども';

            container.innerHTML = `
                <style>
                    .message-bubble {
                        max-width: 80%;
                        word-break: break-word;
                    }
                    .message-from-me {
                        background: linear-gradient(135deg, #FFB6C1, #DDA0DD);
                        margin-left: auto;
                        border-radius: 20px 20px 4px 20px;
                    }
                    .message-from-other {
                        background: white;
                        margin-right: auto;
                        border-radius: 20px 20px 20px 4px;
                        border: 2px solid #E5E7EB;
                    }
                    .voice-btn {
                        animation: ${isRecording ? 'pulse 1s infinite' : 'none'};
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                </style>

                <div class="h-full flex flex-col bg-gradient-to-b from-pink-50 to-purple-50">
                    <!-- ヘッダー -->
                    <div class="bg-white shadow px-3 py-2 flex justify-between items-center">
                        <button id="btn-back" class="text-gray-500 font-bold text-sm">
                            ← もどる
                        </button>
                        <h1 class="text-lg font-black text-pink-500 flex items-center gap-2">
                            💌 ${userType === 'child' ? 'パパママへ' : 'こどもへ'}
                        </h1>
                        <div class="text-xs text-gray-400 font-bold">${fromLabel}</div>
                    </div>

                    <!-- メッセージ一覧 -->
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
                                        ${msg.type === 'text' ? `
                                            <p class="font-bold">${msg.content}</p>
                                        ` : `
                                            <button class="play-audio flex items-center gap-2 font-bold" data-audio="${msg.content}">
                                                <span class="text-2xl">🔊</span>
                                                <span>ボイスメッセージ</span>
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

                    <!-- 入力エリア -->
                    <div class="bg-white border-t p-3">
                        <div class="flex gap-2 items-end">
                            <!-- 音声ボタン -->
                            <button id="btn-voice" class="voice-btn flex-shrink-0 w-14 h-14 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gradient-to-r from-purple-400 to-pink-400'} text-white text-2xl shadow-lg active:scale-95 transition flex items-center justify-center">
                                ${isRecording ? '⏹️' : '🎤'}
                            </button>

                            <!-- テキスト入力 -->
                            <div class="flex-1 flex gap-2">
                                <input type="text" id="input-message" value="${inputText}" placeholder="メッセージを いれてね"
                                    class="flex-1 bg-gray-100 border-2 border-gray-200 rounded-full px-4 py-3 font-bold focus:outline-none focus:border-pink-300 text-lg">
                                <button id="btn-send" class="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white text-2xl shadow-lg active:scale-95 transition flex items-center justify-center ${!inputText ? 'opacity-50' : ''}">
                                    📨
                                </button>
                            </div>
                        </div>

                        ${isRecording ? `
                            <div class="mt-2 text-center">
                                <p class="text-red-500 font-bold animate-pulse">🎙️ ろくおん中... ボタンを おして おわる</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

            setupListeners();
            scrollToBottom();
        };

        const scrollToBottom = () => {
            const list = container.querySelector('#message-list');
            if (list) {
                list.scrollTop = list.scrollHeight;
            }
        };

        const setupListeners = () => {
            container.querySelector('#btn-back')?.onclick = () => system.goHome();

            // テキスト入力
            const inputEl = container.querySelector('#input-message');
            inputEl?.addEventListener('input', (e) => {
                inputText = e.target.value;
                const sendBtn = container.querySelector('#btn-send');
                if (sendBtn) {
                    if (inputText) {
                        sendBtn.classList.remove('opacity-50');
                    } else {
                        sendBtn.classList.add('opacity-50');
                    }
                }
            });

            // 送信ボタン
            container.querySelector('#btn-send')?.onclick = () => {
                if (inputText.trim()) {
                    sendMessage('text', inputText.trim());
                }
            };

            // Enterキーで送信
            inputEl?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && inputText.trim()) {
                    sendMessage('text', inputText.trim());
                }
            });

            // 音声ボタン
            container.querySelector('#btn-voice')?.onclick = () => {
                if (isRecording) {
                    stopRecording();
                } else {
                    startRecording();
                }
            };

            // 音声再生
            container.querySelectorAll('.play-audio').forEach(btn => {
                btn.onclick = () => {
                    playAudio(btn.dataset.audio);
                };
            });
        };

        // リアルタイム監視
        const startListening = () => {
            const q = query(
                collection(db, 'family_messages'),
                orderBy('timestamp', 'asc')
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                messages = snapshot.docs.map(d => ({
                    id: d.id,
                    ...d.data()
                }));
                render();
                markAsRead();
            }, (error) => {
                console.error('メッセージ監視エラー:', error);
            });
        };

        // 初期化
        render();
        startListening();
        markAsRead();

        // クリーンアップ
        return () => {
            if (unsubscribe) unsubscribe();
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
            }
        };
    }
};
