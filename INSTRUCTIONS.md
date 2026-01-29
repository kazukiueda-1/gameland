Claude Code 開発ガイドライン (Kids Web Land)このプロジェクトは、GitHub Pagesでホスティングされる子供向けの学習Webプラットフォームです。index.html がメインシステムとして機能し、apps/ ディレクトリ内のJSモジュールを動的に読み込んで実行します。プロジェクト構造index.html: メインシステム（UI、ルーティング、セキュリティ機能）。このファイルは原則変更しません。apps/registry.json: アプリの登録リスト。新しいアプリを追加する際はここを更新します。apps/\*.js: 個別のアプリモジュール。各アプリは1つのJSファイルで完結します。新しいアプリの作成手順ユーザーから「〇〇のアプリを作って」と指示された場合、以下の手順に従って実装してください。1. アプリモジュールの作成 (apps/xxxx\_v1.js)apps/ ディレクトリ内に新しいJavaScriptファイルを作成します。ファイル名は アプリ名\_v1.js のようにバージョンを含めることを推奨します。以下のテンプレートを使用してください：export default {

&nbsp;   /\*\*

&nbsp;    \* アプリ起動関数

&nbsp;    \* @param {HTMLElement} container - アプリを描画するDOM要素（すでにスタイル適用済み）

&nbsp;    \* @param {Object} system - システム連携用オブジェクト

&nbsp;    \* @param {Function} system.addScore - スコアを加算する関数 (例: system.addScore(10))

&nbsp;    \* @param {Function} system.goHome - ホーム画面に戻る関数

&nbsp;    \* @param {Function} system.playSound - 効果音再生関数 (引数: 'correct' | 'wrong')

&nbsp;    \* @returns {Function} クリーンアップ関数（アプリ終了時にタイマー解除などを行うため）

&nbsp;    \*/

&nbsp;   launch(container, system) {

&nbsp;       // 1. 変数・データの初期化

&nbsp;       let score = 0;



&nbsp;       // 2. 描画関数

&nbsp;       const render = () => {

&nbsp;           // Tailwind CSSを使用し、子供向けの大きなUIにする

&nbsp;           // 色は Tailwindの \*-400 〜 \*-500 番台のパステルカラーを使用

&nbsp;           

&nbsp;           container.innerHTML = `

&nbsp;               <div class="h-full flex flex-col items-center justify-center">

&nbsp;                   <!-- ヘッダー（やめるボタンなど） -->

&nbsp;                   <div class="w-full flex justify-between p-4">

&nbsp;                       <button id="btn-quit" class="bg-gray-100 text-gray-500 font-bold py-2 px-4 rounded-full">✕ やめる</button>

&nbsp;                   </div>



&nbsp;                   <!-- コンテンツ -->

&nbsp;                   <h2 class="text-4xl font-black text-blue-500 mb-8">タイトル</h2>

&nbsp;                   

&nbsp;                   <!-- 操作ボタン -->

&nbsp;                   <button id="btn-action" class="bg-blue-400 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-lg active:scale-95 transition">

&nbsp;                       ボタン

&nbsp;                   </button>

&nbsp;               </div>

&nbsp;           `;



&nbsp;           // 3. イベントリスナーの設定

&nbsp;           container.querySelector('#btn-quit').onclick = () => system.goHome();

&nbsp;           

&nbsp;           container.querySelector('#btn-action').onclick = () => {

&nbsp;               system.playSound('correct'); // または 'wrong'

&nbsp;               system.addScore(10);

&nbsp;               // 次の画面へ...

&nbsp;           };

&nbsp;       };



&nbsp;       // 初回描画

&nbsp;       render();



&nbsp;       // 4. クリーンアップ関数を返す

&nbsp;       return () => {

&nbsp;           // setIntervalなどを使用している場合はここで clear する

&nbsp;       };

&nbsp;   }

};

2\. レジストリへの登録 (apps/registry.json)apps/registry.json を読み込み、新しいアプリの設定を配列の先頭に追加してください。{

&nbsp;   "id": "ユニークなID (例: math\_01)",

&nbsp;   "title": "アプリのタイトル (子供に読みやすく)",

&nbsp;   "desc": "短い説明文 (例: たしざん に チャレンジ)",

&nbsp;   "icon": "絵文字 (例: 🔢)",

&nbsp;   "file": "作成したファイル名.js",

&nbsp;   "color": "テーマカラー (例: blue-400, pink-400, green-400, orange-400, purple-400)",

&nbsp;   "category": "カテゴリ (study または play)"

}

category:study: 学習系（国語、算数、英語、理科など）play: 遊び系（パズル、クイズ、反射神経ゲーム、お絵かきなど）デザインガイドラインフォント: 親画面で Zen Maru Gothic が設定されているため、継承されます。明示的な指定は不要です。ターゲット: 子供（幼児〜小学生）が対象です。ボタンは大きく（高さ 60px以上推奨）。漢字の使用は学年に合わせるか、ひらがなを多用してください。フィードバック（正解・不正解）は分かりやすくアニメーションや色で伝えてください。

