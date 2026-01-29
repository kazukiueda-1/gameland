/**
 * 家族のお買い物メモ アプリ
 * Firebase Firestore を使用したリアルタイム買い物リスト
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
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ========================================
// Firebase設定 (ここを自分のプロジェクトに置き換えてください)
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========================================
// 予測変換辞書 (ひらがな → 食材候補リスト)
// ========================================
const itemDictionary = {
    // あ行
    'あ': ['あめ🍬', 'アイス🍨', 'あぶらあげ', 'あずき'],
    'い': ['いちご🍓', 'いも🍠', 'いか🦑'],
    'う': ['うどん🍜', 'うめぼし', 'ウインナー🌭'],
    'え': ['えび🦐', 'えだまめ', 'えのき🍄'],
    'お': ['おにぎり🍙', 'おかし🍪', 'おちゃ🍵', 'おこめ🍚'],

    // か行
    'か': ['カレー🍛', 'かぼちゃ🎃', 'かまぼこ🍥', 'からあげ🍗'],
    'き': ['きゅうり🥒', 'キャベツ🥬', 'きのこ🍄', 'キウイ🥝'],
    'く': ['くだもの🍎', 'クッキー🍪', 'くり🌰'],
    'け': ['ケーキ🎂', 'ケチャップ'],
    'こ': ['こめ🍚', 'コーン🌽', 'こんにゃく', 'コーヒー☕'],

    // さ行
    'さ': ['さかな🐟', 'さとう', 'サラダ🥗', 'さくらんぼ🍒'],
    'し': ['しお🧂', 'しょうゆ', 'ジュース🧃', 'しいたけ🍄'],
    'す': ['すいか🍉', 'スープ🍲', 'すし🍣'],
    'せ': ['せんべい🍘', 'セロリ'],
    'そ': ['そうめん', 'ソーセージ🌭', 'ソース'],

    // た行
    'た': ['たまご🥚', 'たまねぎ🧅', 'たけのこ🎋', 'たこ🐙'],
    'ち': ['チーズ🧀', 'チョコ🍫', 'ちくわ', 'チキン🍗'],
    'つ': ['ツナ🐟', 'つけもの'],
    'て': ['てんぷら🍤'],
    'と': ['とうふ', 'トマト🍅', 'とりにく🍗', 'とうもろこし🌽'],

    // な行
    'な': ['なす🍆', 'なっとう', 'ナッツ🥜', 'なし🍐'],
    'に': ['にく🥩', 'にんじん🥕', 'にら'],
    'ぬ': ['ぬか'],
    'ね': ['ねぎ🧅'],
    'の': ['のり', 'のみもの🥤'],

    // は行
    'は': ['ハム🍖', 'はくさい🥬', 'はちみつ🍯', 'バナナ🍌'],
    'ひ': ['ひきにく🥩', 'ピーマン🫑', 'ピザ🍕'],
    'ふ': ['ふりかけ', 'ぶどう🍇', 'ブロッコリー🥦'],
    'へ': ['ベーコン🥓'],
    'ほ': ['ほうれんそう🥬', 'ポテト🍟', 'ほしいも'],

    // ま行
    'ま': ['まめ', 'マヨネーズ', 'まぐろ🐟', 'マカロニ'],
    'み': ['みかん🍊', 'みず💧', 'ミルク🥛', 'みそ'],
    'む': ['むぎちゃ🍵'],
    'め': ['めん🍜', 'めんつゆ', 'メロン🍈'],
    'も': ['もやし', 'もも🍑', 'もち'],

    // や行
    'や': ['やさい🥬', 'ヤクルト', 'やきそば'],
    'ゆ': ['ゆで卵🥚'],
    'よ': ['ヨーグルト🥛', 'ようかん'],

    // ら行
    'ら': ['ラーメン🍜', 'らっきょう'],
    'り': ['りんご🍎', 'りょくちゃ🍵'],
    'る': ['ルッコラ🥬'],
    'れ': ['レタス🥬', 'れいとうしょくひん🧊', 'レモン🍋'],
    'ろ': ['ロールパン🍞'],

    // わ行
    'わ': ['わかめ', 'ワッフル🧇'],
    'を': [],
    'ん': [],

    // 濁音・半濁音
    'が': ['がむ'],
    'ぎ': ['ぎゅうにゅう🥛', 'ぎゅうにく🥩', 'ぎょうざ🥟'],
    'ぐ': ['グミ🍬', 'グラノーラ'],
    'げ': ['げんまい🍚'],
    'ご': ['ごはん🍚', 'ごま', 'ごぼう'],

    'ざ': ['ざっこく'],
    'じ': ['じゃがいも🥔', 'ジャム🍓'],
    'ず': [],
    'ぜ': ['ゼリー🍮'],
    'ぞ': [],

    'だ': ['だいこん', 'だいず'],
    'ぢ': [],
    'づ': [],
    'で': [],
    'ど': ['ドーナツ🍩', 'ドレッシング'],

    'ば': ['バター🧈', 'バナナ🍌'],
    'び': ['ビスケット🍪', 'ビーフ🥩'],
    'ぶ': ['ぶたにく🐷', 'ぶどう🍇'],
    'べ': ['べんとう🍱'],
    'ぼ': ['ぼうろ'],

    'ぱ': ['パン🍞', 'パスタ🍝', 'パプリカ🫑'],
    'ぴ': ['ピーナッツ🥜', 'ピクルス🥒'],
    'ぷ': ['プリン🍮', 'ぷりん🍮'],
    'ぺ': ['ペットボトル🍶'],
    'ぽ': ['ポテトチップス🥔', 'ポップコーン🍿'],
};

// ========================================
// 50音キーボード配列
// ========================================
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
    ['わ', '', 'を', '', 'ん'],
];

const dakuonRows = [
    ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
    ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
    ['だ', 'ぢ', 'づ', 'で', 'ど'],
    ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
    ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
];

// ========================================
// メインアプリ
// ========================================
export default {
    launch(container, system) {
        let unsubscribe = null; // Firestoreリスナー解除用
        let shoppingList = []; // 現在のリスト
        let showDakuon = false; // 濁音モード表示フラグ
        let suggestions = []; // 現在の予測候補

        // ========================================
        // Firestore操作関数
        // ========================================

        // アイテム追加
        const addItem = async (name) => {
            try {
                await addDoc(collection(db, 'shopping_list'), {
                    name: name,
                    createdAt: serverTimestamp()
                });
            } catch (e) {
                console.error('追加エラー:', e);
                alert('ついかできませんでした');
            }
        };

        // アイテム削除
        const deleteItem = async (id) => {
            try {
                await deleteDoc(doc(db, 'shopping_list', id));
            } catch (e) {
                console.error('削除エラー:', e);
            }
        };

        // 全削除
        const deleteAll = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'shopping_list'));
                const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'shopping_list', d.id)));
                await Promise.all(deletePromises);
            } catch (e) {
                console.error('全削除エラー:', e);
            }
        };

        // クリップボードにコピー
        const copyToClipboard = () => {
            if (shoppingList.length === 0) {
                alert('リストがからっぽだよ');
                return;
            }
            const text = shoppingList.map(item => item.name).join('\n');
            navigator.clipboard.writeText(text).then(() => {
                alert('コピーしました！📋');
            }).catch(() => {
                alert('コピーできませんでした');
            });
        };

        // ========================================
        // 描画
        // ========================================
        const render = () => {
            const currentRows = showDakuon ? dakuonRows : hiraganaRows;

            container.innerHTML = `
                <div class="h-full flex flex-col bg-gradient-to-b from-yellow-100 to-orange-100">

                    <!-- ヘッダー -->
                    <div class="bg-white/90 backdrop-blur px-3 py-2 flex justify-between items-center shadow-md">
                        <button id="btn-quit" class="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-full text-sm active:scale-95 transition">
                            ✕ もどる
                        </button>
                        <h1 class="text-lg md:text-xl font-black text-orange-500 flex items-center gap-2">
                            🛒 おかいものメモ
                        </h1>
                        <div class="w-20"></div>
                    </div>

                    <!-- リスト表示エリア (30%) -->
                    <div class="h-[30%] min-h-[160px] bg-white m-2 rounded-2xl shadow-lg border-4 border-orange-300 flex flex-col overflow-hidden">

                        <!-- リストヘッダー -->
                        <div class="bg-orange-400 px-4 py-2 flex justify-between items-center">
                            <span class="text-white font-bold text-sm md:text-base">
                                📝 かうもの (<span id="list-count">${shoppingList.length}</span>こ)
                            </span>
                            <div class="flex gap-2">
                                <button id="btn-copy" class="bg-white/90 hover:bg-white text-orange-500 font-bold py-1 px-3 rounded-full text-xs md:text-sm active:scale-95 transition shadow">
                                    📋 コピー
                                </button>
                                <button id="btn-clear" class="bg-red-400 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-full text-xs md:text-sm active:scale-95 transition shadow">
                                    🗑️ ぜんぶ消す
                                </button>
                            </div>
                        </div>

                        <!-- リスト本体 -->
                        <div id="shopping-list" class="flex-1 overflow-y-auto p-2 md:p-3">
                            ${shoppingList.length === 0 ? `
                                <div class="h-full flex flex-col items-center justify-center text-gray-400">
                                    <span class="text-4xl mb-2">🛒</span>
                                    <p class="font-bold">まだ なにも ないよ</p>
                                    <p class="text-sm">したの キーボードで ついかしてね！</p>
                                </div>
                            ` : `
                                <div class="flex flex-wrap gap-2">
                                    ${shoppingList.map(item => `
                                        <div class="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full px-3 py-2 flex items-center gap-2 shadow-md border-2 border-orange-300 animate-pop">
                                            <span class="font-bold text-gray-700 text-sm md:text-base">${item.name}</span>
                                            <button data-id="${item.id}" class="delete-btn bg-red-400 hover:bg-red-500 text-white w-6 h-6 rounded-full font-bold text-sm active:scale-90 transition shadow">
                                                ×
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- キーボードエリア (70%) -->
                    <div class="flex-1 flex flex-col bg-gradient-to-b from-blue-100 to-purple-100 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] overflow-hidden">

                        <!-- 予測変換候補エリア -->
                        <div id="suggestions" class="min-h-[70px] bg-white/80 backdrop-blur p-2 border-b-2 border-blue-200 overflow-x-auto">
                            <div class="flex gap-2 min-h-[50px] items-center">
                                ${suggestions.length === 0 ? `
                                    <p class="text-gray-400 font-bold text-sm w-full text-center">
                                        👆 もじを おすと こうほが でるよ！
                                    </p>
                                ` : suggestions.map(item => `
                                    <button data-item="${item}" class="suggestion-btn bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-4 rounded-2xl text-base md:text-lg shadow-lg active:scale-95 transition whitespace-nowrap border-b-4 border-green-600">
                                        ${item}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- 濁音切り替えボタン -->
                        <div class="bg-white/50 px-2 py-1 flex justify-center gap-2">
                            <button id="btn-seion" class="font-bold py-1 px-4 rounded-full text-sm transition ${!showDakuon ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-600'}">
                                あかさたな
                            </button>
                            <button id="btn-dakuon" class="font-bold py-1 px-4 rounded-full text-sm transition ${showDakuon ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-200 text-gray-600'}">
                                がざだばぱ
                            </button>
                        </div>

                        <!-- 50音キーボード -->
                        <div id="keyboard" class="flex-1 p-2 overflow-y-auto">
                            <div class="grid gap-1 h-full" style="grid-template-rows: repeat(${currentRows.length}, 1fr);">
                                ${currentRows.map(row => `
                                    <div class="grid grid-cols-5 gap-1">
                                        ${row.map(char => char ? `
                                            <button data-char="${char}" class="key-btn bg-gradient-to-b from-white to-gray-100 hover:from-blue-100 hover:to-blue-200 text-gray-700 font-black text-2xl md:text-3xl rounded-xl shadow-md active:scale-95 active:shadow-inner transition border-b-4 border-gray-300 active:border-b-0 min-h-[50px]">
                                                ${char}
                                            </button>
                                        ` : `
                                            <div class="bg-transparent"></div>
                                        `).join('')}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // イベントリスナー設定
            setupEventListeners();
        };

        // ========================================
        // イベントリスナー
        // ========================================
        const setupEventListeners = () => {
            // 戻るボタン
            container.querySelector('#btn-quit').onclick = () => system.goHome();

            // コピーボタン
            container.querySelector('#btn-copy').onclick = copyToClipboard;

            // 全削除ボタン
            container.querySelector('#btn-clear').onclick = () => {
                if (shoppingList.length === 0) {
                    alert('リストは からっぽだよ');
                    return;
                }
                if (confirm('ぜんぶ けしても いい？')) {
                    deleteAll();
                }
            };

            // 個別削除ボタン
            container.querySelectorAll('.delete-btn').forEach(btn => {
                btn.onclick = () => {
                    const id = btn.dataset.id;
                    deleteItem(id);
                };
            });

            // キーボードボタン
            container.querySelectorAll('.key-btn').forEach(btn => {
                btn.onclick = () => {
                    const char = btn.dataset.char;
                    suggestions = itemDictionary[char] || [];
                    render();
                };
            });

            // 予測候補ボタン
            container.querySelectorAll('.suggestion-btn').forEach(btn => {
                btn.onclick = () => {
                    const item = btn.dataset.item;
                    addItem(item);
                    suggestions = [];
                    render();
                    system.playSound('correct');
                    system.addScore(1);
                };
            });

            // 清音/濁音切り替え
            container.querySelector('#btn-seion').onclick = () => {
                if (showDakuon) {
                    showDakuon = false;
                    render();
                }
            };
            container.querySelector('#btn-dakuon').onclick = () => {
                if (!showDakuon) {
                    showDakuon = true;
                    render();
                }
            };
        };

        // ========================================
        // Firestoreリアルタイム監視開始
        // ========================================
        const startListening = () => {
            const q = query(
                collection(db, 'shopping_list'),
                orderBy('createdAt', 'asc')
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                shoppingList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                render();
            }, (error) => {
                console.error('Firestore監視エラー:', error);
                // エラー時も表示は維持
                container.innerHTML = `
                    <div class="h-full flex flex-col items-center justify-center bg-red-50 p-4">
                        <div class="text-6xl mb-4">😢</div>
                        <h2 class="text-2xl font-black text-red-500 mb-2">つながらないよ</h2>
                        <p class="text-gray-600 font-bold mb-4 text-center">
                            Firebaseの せってい を<br>かくにんしてね
                        </p>
                        <button onclick="location.reload()" class="bg-blue-500 text-white font-bold py-3 px-6 rounded-full">
                            もういちど ためす
                        </button>
                        <button id="btn-back-home" class="mt-4 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full">
                            ホームにもどる
                        </button>
                    </div>
                `;
                container.querySelector('#btn-back-home').onclick = () => system.goHome();
            });
        };

        // 初期化
        render();
        startListening();

        // クリーンアップ関数を返す
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }
};
