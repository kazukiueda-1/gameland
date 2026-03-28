export default {
    /**
     * アプリ起動関数
     * @param {HTMLElement} container
     * @param {Object} system
     */
    launch(container, system) {
        // ---------------------------------------------------------
        // 1. データ定義 (小学1年生の漢字80字 / 送り仮名対応)
        //    k: 漢字, r: 読み(漢字部分のみ), o: 送り仮名(省略可)
        //
        //    送り仮名あり (13字):
        //      い形容詞: 小さい,正しい,青い,赤い,早い,大きい,白い
        //      動詞:     休み,見る,出る,生き,立つ
        //      名詞形:   入り
        // ---------------------------------------------------------
        const kanjiData = [
            {k:"一", r:"いち"}, {k:"右", r:"みぎ"}, {k:"雨", r:"あめ"}, {k:"円", r:"えん"},
            {k:"王", r:"おう"}, {k:"音", r:"おと"}, {k:"下", r:"した"}, {k:"火", r:"ひ"},
            {k:"花", r:"はな"}, {k:"貝", r:"かい"}, {k:"学", r:"がく"}, {k:"気", r:"き"},
            {k:"九", r:"きゅう"}, {k:"休", r:"やす", o:"み"}, {k:"玉", r:"たま"}, {k:"金", r:"きん"},
            {k:"空", r:"そら"}, {k:"月", r:"つき"}, {k:"犬", r:"いぬ"}, {k:"見", r:"み", o:"る"},
            {k:"口", r:"くち"}, {k:"校", r:"こう"}, {k:"左", r:"ひだり"}, {k:"三", r:"さん"},
            {k:"山", r:"やま"}, {k:"子", r:"こ"}, {k:"四", r:"よん"}, {k:"糸", r:"いと"},
            {k:"字", r:"じ"}, {k:"耳", r:"みみ"}, {k:"七", r:"なな"}, {k:"車", r:"くるま"},
            {k:"手", r:"て"}, {k:"十", r:"じゅう"}, {k:"出", r:"で", o:"る"}, {k:"女", r:"おんな"},
            {k:"小", r:"ちい", o:"さい"}, {k:"上", r:"うえ"}, {k:"森", r:"もり"}, {k:"人", r:"ひと"},
            {k:"水", r:"みず"}, {k:"正", r:"ただ", o:"しい"}, {k:"生", r:"い", o:"き"}, {k:"青", r:"あお", o:"い"},
            {k:"夕", r:"ゆう"}, {k:"石", r:"いし"}, {k:"赤", r:"あか", o:"い"}, {k:"千", r:"せん"},
            {k:"川", r:"かわ"}, {k:"先", r:"さき"}, {k:"早", r:"はや", o:"い"}, {k:"草", r:"くさ"},
            {k:"足", r:"あし"}, {k:"村", r:"むら"}, {k:"大", r:"おお", o:"きい"}, {k:"男", r:"おとこ"},
            {k:"竹", r:"たけ"}, {k:"中", r:"なか"}, {k:"虫", r:"むし"}, {k:"町", r:"まち"},
            {k:"天", r:"てん"}, {k:"田", r:"た"}, {k:"土", r:"つち"}, {k:"二", r:"に"},
            {k:"日", r:"ひ"}, {k:"入", r:"い", o:"り"}, {k:"年", r:"とし"}, {k:"白", r:"しろ", o:"い"},
            {k:"八", r:"はち"}, {k:"百", r:"ひゃく"}, {k:"文", r:"ぶん"}, {k:"木", r:"き"},
            {k:"本", r:"ほん"}, {k:"名", r:"な"}, {k:"目", r:"め"}, {k:"立", r:"た", o:"つ"},
            {k:"力", r:"ちから"}, {k:"林", r:"はやし"}, {k:"六", r:"ろく"}, {k:"五", r:"ご"}
        ];

        // ---------------------------------------------------------
        // 1b. 二字熟語データ (1年生の漢字のみで構成 / 全80語)
        //     j: 熟語, r: 読み
        // ---------------------------------------------------------
        const jukugoData = [
            // レベル1: しぜん
            {j:"天気", r:"てんき", m:"はれやくもりなど そらのようす"},
            {j:"空気", r:"くうき", m:"めにみえないけど まわりにあるもの"},
            {j:"青空", r:"あおぞら", m:"くもがなくて あおいそら"},
            {j:"大雨", r:"おおあめ", m:"たくさんふる つよいあめ"},
            {j:"小雨", r:"こさめ", m:"すこしだけふる よわいあめ"},
            {j:"夕日", r:"ゆうひ", m:"ゆうがたに しずむ おひさま"},
            {j:"夕立", r:"ゆうだち", m:"なつのゆうがたに ふるにわかあめ"},
            {j:"火山", r:"かざん", m:"ひやようがんが ふきだすやま"},
            {j:"草花", r:"くさばな", m:"のやまに さく くさのはな"},
            {j:"小川", r:"おがわ", m:"ちいさな かわ"},
            // レベル2: しぜん・ぎょうじ
            {j:"小石", r:"こいし", m:"ちいさな いし"},
            {j:"大木", r:"たいぼく", m:"おおきな き"},
            {j:"森林", r:"しんりん", m:"きがたくさん はえているところ"},
            {j:"竹林", r:"ちくりん", m:"たけがたくさん はえているところ"},
            {j:"水田", r:"すいでん", m:"おこめをつくる たんぼ"},
            {j:"青虫", r:"あおむし", m:"みどりいろの ちいさなむし"},
            {j:"火花", r:"ひばな", m:"ぱちぱちと ちるひのこ"},
            {j:"花火", r:"はなび", m:"よぞらにあがる きれいなひかり"},
            {j:"花見", r:"はなみ", m:"さくらのはなを みてたのしむこと"},
            {j:"月見", r:"つきみ", m:"おつきさまを みてたのしむこと"},
            // レベル3: ぎょうじ・がっこう
            {j:"七夕", r:"たなばた", m:"7がつ7にちの ほしのおまつり"},
            {j:"正月", r:"しょうがつ", m:"1ねんのはじめ おいわいするとき"},
            {j:"学校", r:"がっこう", m:"べんきょうをする ところ"},
            {j:"大学", r:"だいがく", m:"こうこうのつぎに いくがっこう"},
            {j:"中学", r:"ちゅうがく", m:"しょうがっこうのつぎに いくがっこう"},
            {j:"入学", r:"にゅうがく", m:"がっこうに はいること"},
            {j:"学年", r:"がくねん", m:"がっこうの 1ねんせいや2ねんせいのこと"},
            {j:"学生", r:"がくせい", m:"がっこうで べんきょうするひと"},
            {j:"先生", r:"せんせい", m:"べんきょうを おしえてくれるひと"},
            {j:"休校", r:"きゅうこう", m:"がっこうが おやすみになること"},
            // レベル4: がっこう・ひと
            {j:"下校", r:"げこう", m:"がっこうから いえにかえること"},
            {j:"見学", r:"けんがく", m:"じっさいに みて べんきょうすること"},
            {j:"大人", r:"おとな", m:"からだもこころも おおきくなったひと"},
            {j:"一人", r:"ひとり", m:"ひとりだけ"},
            {j:"二人", r:"ふたり", m:"ふたりのひと"},
            {j:"人気", r:"にんき", m:"みんなから すかれていること"},
            {j:"名人", r:"めいじん", m:"なにかが とてもじょうずなひと"},
            {j:"男子", r:"だんし", m:"おとこのこ"},
            {j:"女子", r:"じょし", m:"おんなのこ"},
            {j:"男女", r:"だんじょ", m:"おとこのこと おんなのこ"},
            // レベル5: ひと・からだ
            {j:"女王", r:"じょおう", m:"くにをおさめる おんなのひと"},
            {j:"王子", r:"おうじ", m:"おうさまの むすこ"},
            {j:"子犬", r:"こいぬ", m:"ちいさな いぬのあかちゃん"},
            {j:"大男", r:"おおおとこ", m:"からだが とてもおおきいおとこのひと"},
            {j:"村人", r:"むらびと", m:"むらに すんでいるひと"},
            {j:"手足", r:"てあし", m:"てと あし"},
            {j:"右手", r:"みぎて", m:"みぎがわの て"},
            {j:"左手", r:"ひだりて", m:"ひだりがわの て"},
            {j:"右足", r:"みぎあし", m:"みぎがわの あし"},
            {j:"左足", r:"ひだりあし", m:"ひだりがわの あし"},
            // レベル6: からだ・ほうこう・ばしょ
            {j:"目玉", r:"めだま", m:"めのまるいぶぶん"},
            {j:"足音", r:"あしおと", m:"あるくときに でるおと"},
            {j:"上下", r:"じょうげ", m:"うえと した"},
            {j:"左右", r:"さゆう", m:"ひだりと みぎ"},
            {j:"上手", r:"じょうず", m:"うまくできること"},
            {j:"下手", r:"へた", m:"うまくできないこと"},
            {j:"年上", r:"としうえ", m:"じぶんより としがうえのひと"},
            {j:"年下", r:"としした", m:"じぶんより としがしたのひと"},
            {j:"入口", r:"いりぐち", m:"なかにはいるところ"},
            {j:"出口", r:"でぐち", m:"そとにでるところ"},
            // レベル7: ばしょ・じかん・たべもの
            {j:"水中", r:"すいちゅう", m:"みずのなか"},
            {j:"空中", r:"くうちゅう", m:"そらのなか くうきのなか"},
            {j:"休日", r:"きゅうじつ", m:"おやすみのひ"},
            {j:"土日", r:"どにち", m:"どようびと にちようび"},
            {j:"先月", r:"せんげつ", m:"いまのつきの ひとつまえのつき"},
            {j:"玉子", r:"たまご", m:"にわとりなどが うむたまご"},
            {j:"白玉", r:"しらたま", m:"おもちのような しろくてまるいおかし"},
            {j:"本気", r:"ほんき", m:"まじめに いっしょうけんめいなきもち"},
            {j:"文字", r:"もじ", m:"ことばをかくときの かたち"},
            {j:"名字", r:"みょうじ", m:"かぞくでおなじ なまえのうえのぶぶん"},
            // レベル8: そのほか
            {j:"早口", r:"はやくち", m:"はやく しゃべること"},
            {j:"空手", r:"からて", m:"てやあしで たたかう ぶどう"},
            {j:"十字", r:"じゅうじ", m:"たてとよこに まじわるかたち"},
            {j:"水玉", r:"みずたま", m:"まるいてんてんの もよう"},
            {j:"手本", r:"てほん", m:"おてほん まねするもの"},
            {j:"大小", r:"だいしょう", m:"おおきいことと ちいさいこと"},
            {j:"水車", r:"すいしゃ", m:"みずのちからで まわるくるま"},
            {j:"雨天", r:"うてん", m:"あめがふっている てんき"},
            {j:"百円", r:"ひゃくえん", m:"100えんのおかね"},
            {j:"一口", r:"ひとくち", m:"ひとくちぶんの りょう"}
        ];

        // ---------------------------------------------------------
        // 2. 状態管理
        // ---------------------------------------------------------
        const QUESTIONS_PER_LEVEL = 10;
        const NUM_LEVELS = Math.ceil(kanjiData.length / QUESTIONS_PER_LEVEL);
        const NUM_JUKUGO_LEVELS = Math.ceil(jukugoData.length / QUESTIONS_PER_LEVEL);

        let currentLevel = 0;
        let category = 'kanji'; // 'kanji' or 'jukugo'
        let quizMode = 'reading'; // 'reading', 'kanji', or 'jukugo'
        let quizQuestions = [];
        let quizIndex = 0;
        let score = 0;
        let hasMistaken = false;

        // ---------------------------------------------------------
        // 3. ユーティリティ関数
        // ---------------------------------------------------------

        const shuffle = (array) => {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        // 完全な読み (読み + 送り仮名)
        const fullR = (item) => item.r + (item.o || '');

        // 漢字 + 送り仮名のHTML
        // 漢字は濃い色、送り仮名はオレンジ背景ピル
        const kanjiHtml = (item, kCls, oCls) => {
            let html = `<span class="${kCls}">${item.k}</span>`;
            if (item.o) html += `<span class="${oCls}">${item.o}</span>`;
            return html;
        };

        // 読み + 送り仮名のHTML
        // 送り仮名がある場合: 読み=水色ピル、送り仮名=オレンジピルで明確に区別
        // 送り仮名がない場合: プレーンテキスト
        const readingHtml = (item, rCls, oCls, plainCls) => {
            if (item.o) {
                return `<span class="${rCls}">${item.r}</span><span class="${oCls}">${item.o}</span>`;
            }
            return `<span class="${plainCls}">${item.r}</span>`;
        };

        // 凡例HTML (べんきょう・クイズ共通)
        const legendHtml = `
            <div class="flex items-center justify-center gap-3 text-xs font-bold">
                <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-sky-200 border border-sky-300"></span> よみ</span>
                <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-orange-200 border border-orange-300"></span> おくりがな</span>
            </div>
        `;

        // よみかたクイズの選択肢生成 (送り仮名を正解と同じに揃えて表示)
        const generateReadingChoices = (q) => {
            const hasOku = !!q.o;
            const usedReadings = new Set([q.r]);
            const distractors = [];

            if (hasOku) {
                // 送り仮名あり: 全選択肢の送り仮名を正解と同じに揃える
                // 優先1: 同じ送り仮名を持つ漢字
                let cands = shuffle(kanjiData.filter(k => k.o === q.o && k.r !== q.r));
                for (const c of cands) {
                    if (!usedReadings.has(c.r)) {
                        distractors.push({...c});
                        usedReadings.add(c.r);
                        if (distractors.length >= 3) break;
                    }
                }
                // 優先2: 他の漢字 (送り仮名を正解に合わせて上書き)
                if (distractors.length < 3) {
                    cands = shuffle(kanjiData.filter(k => k.k !== q.k && !usedReadings.has(k.r)));
                    for (const c of cands) {
                        if (!usedReadings.has(c.r)) {
                            distractors.push({...c, o: q.o});
                            usedReadings.add(c.r);
                            if (distractors.length >= 3) break;
                        }
                    }
                }
            } else {
                // 送り仮名なし: 送り仮名なしの漢字を優先
                let cands = shuffle(kanjiData.filter(k => !k.o && k.r !== q.r));
                for (const c of cands) {
                    if (!usedReadings.has(c.r)) {
                        distractors.push({...c});
                        usedReadings.add(c.r);
                        if (distractors.length >= 3) break;
                    }
                }
                // 足りなければ送り仮名ありから (送り仮名を除去して表示)
                if (distractors.length < 3) {
                    cands = shuffle(kanjiData.filter(k => k.o && !usedReadings.has(k.r)));
                    for (const c of cands) {
                        if (!usedReadings.has(c.r)) {
                            distractors.push({...c, o: undefined});
                            usedReadings.add(c.r);
                            if (distractors.length >= 3) break;
                        }
                    }
                }
            }

            return shuffle([{...q}, ...distractors.slice(0, 3)]);
        };

        // かんじクイズの選択肢生成 (送り仮名を正解と同じに揃えて表示)
        const generateKanjiChoices = (q) => {
            const hasOku = !!q.o;
            const usedKanji = new Set([q.k]);
            const distractors = [];

            if (hasOku) {
                // 送り仮名あり: 全選択肢の送り仮名を正解と同じに揃える
                // 優先1: 同じ送り仮名を持つ漢字
                let cands = shuffle(kanjiData.filter(k => k.o === q.o && k.k !== q.k));
                for (const c of cands) {
                    if (!usedKanji.has(c.k)) {
                        distractors.push({...c});
                        usedKanji.add(c.k);
                        if (distractors.length >= 3) break;
                    }
                }
                // 優先2: 他の漢字 (送り仮名を正解に合わせて上書き)
                if (distractors.length < 3) {
                    cands = shuffle(kanjiData.filter(k => !usedKanji.has(k.k)));
                    for (const c of cands) {
                        if (!usedKanji.has(c.k)) {
                            distractors.push({...c, o: q.o});
                            usedKanji.add(c.k);
                            if (distractors.length >= 3) break;
                        }
                    }
                }
            } else {
                // 送り仮名なし: 送り仮名なしの漢字を優先
                let cands = shuffle(kanjiData.filter(k => !k.o && k.k !== q.k));
                for (const c of cands) {
                    if (!usedKanji.has(c.k)) {
                        distractors.push({...c});
                        usedKanji.add(c.k);
                        if (distractors.length >= 3) break;
                    }
                }
                // 足りなければ送り仮名ありから (送り仮名を除去して表示)
                if (distractors.length < 3) {
                    cands = shuffle(kanjiData.filter(k => k.o && !usedKanji.has(k.k)));
                    for (const c of cands) {
                        if (!usedKanji.has(c.k)) {
                            distractors.push({...c, o: undefined});
                            usedKanji.add(c.k);
                            if (distractors.length >= 3) break;
                        }
                    }
                }
            }

            return shuffle([{...q}, ...distractors.slice(0, 3)]);
        };

        // じゅくごクイズの選択肢生成
        const generateJukugoChoices = (q) => {
            const usedReadings = new Set([q.r]);
            const distractors = [];
            const cands = shuffle(jukugoData.filter(j => j.r !== q.r));
            for (const c of cands) {
                if (!usedReadings.has(c.r)) {
                    distractors.push(c);
                    usedReadings.add(c.r);
                    if (distractors.length >= 3) break;
                }
            }
            return shuffle([q, ...distractors.slice(0, 3)]);
        };

        // ---------------------------------------------------------
        // 4. 画面レンダリング関数群
        // ---------------------------------------------------------

        // ★ レベル選択画面
        const renderLevelSelect = () => {
            const isJukugo = category === 'jukugo';
            const numLevels = isJukugo ? NUM_JUKUGO_LEVELS : NUM_LEVELS;
            const btnColor = isJukugo ? 'bg-pink-400 hover:bg-pink-500' : 'bg-orange-400 hover:bg-orange-500';

            let buttonsHtml = '';
            for (let i = 0; i < numLevels; i++) {
                buttonsHtml += `
                    <button class="level-btn ${btnColor} text-white font-bold py-2 md:py-3 rounded-xl shadow-md active:scale-95 transition text-base md:text-lg" data-level="${i}">
                        レベル ${i + 1}
                    </button>
                `;
            }

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-3">
                    <button id="btn-quit-app" class="absolute top-2 left-2 bg-gray-100 text-gray-500 font-bold py-1 px-2 rounded-full text-xs">✕ やめる</button>

                    <h2 class="text-xl md:text-2xl font-black text-blue-500 mb-1 text-center">かんじマスター</h2>

                    <div class="flex gap-2 mb-2">
                        <button class="cat-tab px-4 py-1.5 rounded-full font-bold text-sm transition ${category === 'kanji' ? 'bg-orange-400 text-white shadow' : 'bg-gray-200 text-gray-400'}" data-cat="kanji">
                            かんじ
                        </button>
                        <button class="cat-tab px-4 py-1.5 rounded-full font-bold text-sm transition ${category === 'jukugo' ? 'bg-pink-400 text-white shadow' : 'bg-gray-200 text-gray-400'}" data-cat="jukugo">
                            じゅくご
                        </button>
                    </div>

                    <p class="text-gray-500 font-bold mb-3 text-xs">どの レベル に チャレンジ する？</p>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-2xl">
                        ${buttonsHtml}
                    </div>
                </div>
            `;

            container.querySelector('#btn-quit-app').onclick = () => system.goHome();
            container.querySelectorAll('.cat-tab').forEach(btn => {
                btn.onclick = () => {
                    category = btn.dataset.cat;
                    renderLevelSelect();
                };
            });
            container.querySelectorAll('.level-btn').forEach(btn => {
                btn.onclick = () => {
                    currentLevel = parseInt(btn.dataset.level);
                    renderModeSelect();
                };
            });
        };

        // ★ モード選択画面
        const renderModeSelect = () => {
            const isJukugo = category === 'jukugo';
            const titleColor = isJukugo ? 'text-pink-400' : 'text-orange-400';

            const buttonsHtml = isJukugo ? `
                <button id="btn-study" class="bg-green-400 hover:bg-green-500 text-white text-lg md:text-xl font-bold py-3 md:py-4 px-5 rounded-xl shadow-lg active:scale-95 transition">
                    📖 べんきょう
                </button>
                <button id="btn-jukugo-quiz" class="bg-pink-400 hover:bg-pink-500 text-white text-lg md:text-xl font-bold py-3 md:py-4 px-5 rounded-xl shadow-lg active:scale-95 transition">
                    📚 じゅくごクイズ
                </button>
            ` : `
                <button id="btn-study" class="bg-green-400 hover:bg-green-500 text-white text-lg md:text-xl font-bold py-3 md:py-4 px-5 rounded-xl shadow-lg active:scale-95 transition">
                    📖 べんきょう
                </button>
                <button id="btn-reading-quiz" class="bg-blue-400 hover:bg-blue-500 text-white text-lg md:text-xl font-bold py-3 md:py-4 px-5 rounded-xl shadow-lg active:scale-95 transition">
                    🔥 よみかたクイズ
                </button>
                <button id="btn-kanji-quiz" class="bg-purple-400 hover:bg-purple-500 text-white text-lg md:text-xl font-bold py-3 md:py-4 px-5 rounded-xl shadow-lg active:scale-95 transition">
                    ✏️ かんじクイズ
                </button>
            `;

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-3 animate-pop">
                    <h2 class="text-xl md:text-2xl font-black ${titleColor} mb-1">レベル ${currentLevel + 1}</h2>
                    <p class="text-gray-500 font-bold mb-3 text-xs">なに を する？</p>

                    <div class="flex flex-col gap-3 w-full max-w-lg justify-center">
                        ${buttonsHtml}
                    </div>

                    <button id="btn-back" class="mt-4 bg-gray-200 text-gray-600 font-bold py-1.5 px-4 rounded-full text-xs">
                        レベルをえらぶ
                    </button>
                </div>
            `;

            if (isJukugo) {
                container.querySelector('#btn-study').onclick = renderJukugoStudy;
                container.querySelector('#btn-jukugo-quiz').onclick = () => { quizMode = 'jukugo'; startJukugoQuiz(); };
            } else {
                container.querySelector('#btn-study').onclick = renderStudyMode;
                container.querySelector('#btn-reading-quiz').onclick = () => { quizMode = 'reading'; startQuiz(); };
                container.querySelector('#btn-kanji-quiz').onclick = () => { quizMode = 'kanji'; startQuiz(); };
            }
            container.querySelector('#btn-back').onclick = renderLevelSelect;
        };

        // ★ べんきょうモード (送り仮名をピル型バッジで区別表示)
        const renderStudyMode = () => {
            const start = currentLevel * QUESTIONS_PER_LEVEL;
            const end = start + QUESTIONS_PER_LEVEL;
            const targetKanji = kanjiData.slice(start, end);

            const cardsHtml = targetKanji.map(item => `
                <div class="bg-white border-4 border-sky-200 rounded-3xl p-3 flex flex-col items-center justify-center aspect-square shadow-sm">
                    <div class="mb-2 text-center">
                        ${kanjiHtml(item,
                            'text-6xl font-black text-gray-800',
                            'text-3xl font-bold text-orange-500 bg-orange-100 rounded px-1 ml-0.5'
                        )}
                    </div>
                    <div class="text-center flex items-baseline justify-center gap-1 flex-wrap">
                        ${readingHtml(item,
                            'inline-block bg-sky-100 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-lg font-bold text-xl',
                            'inline-block bg-orange-100 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-lg font-bold text-lg',
                            'text-xl font-bold text-gray-500'
                        )}
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="h-full flex flex-col p-4">
                    <div class="flex justify-between items-center mb-2">
                        <button id="btn-back-mode" class="bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-full text-sm">◀ もどる</button>
                        <h2 class="text-xl font-bold text-green-500">レベル ${currentLevel + 1} の かんじ</h2>
                        <div class="w-16"></div>
                    </div>

                    <div class="mb-3">${legendHtml}</div>

                    <div class="flex-1 overflow-y-auto">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                            ${cardsHtml}
                        </div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-back-mode').onclick = renderModeSelect;
        };

        // ★ じゅくご べんきょうモード
        const renderJukugoStudy = () => {
            const start = currentLevel * QUESTIONS_PER_LEVEL;
            const end = Math.min(start + QUESTIONS_PER_LEVEL, jukugoData.length);
            const targetJukugo = jukugoData.slice(start, end);

            const cardsHtml = targetJukugo.map(item => `
                <div class="bg-white border-4 border-pink-200 rounded-3xl p-3 flex flex-col items-center justify-center aspect-square shadow-sm">
                    <div class="text-5xl md:text-6xl font-black text-gray-800 mb-1 tracking-wider">${item.j}</div>
                    <div class="inline-block bg-pink-100 text-pink-700 border border-pink-200 px-3 py-0.5 rounded-lg font-bold text-lg md:text-xl mb-1">
                        ${item.r}
                    </div>
                    <div class="text-xs text-gray-400 font-bold text-center leading-tight px-1">${item.m}</div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="h-full flex flex-col p-4">
                    <div class="flex justify-between items-center mb-2">
                        <button id="btn-back-mode" class="bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-full text-sm">◀ もどる</button>
                        <h2 class="text-xl font-bold text-green-500">レベル ${currentLevel + 1} の じゅくご</h2>
                        <div class="w-16"></div>
                    </div>

                    <div class="flex-1 overflow-y-auto">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                            ${cardsHtml}
                        </div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-back-mode').onclick = renderModeSelect;
        };

        // ★ クイズ開始処理
        const startQuiz = () => {
            const start = currentLevel * QUESTIONS_PER_LEVEL;
            const end = start + QUESTIONS_PER_LEVEL;
            const targetKanji = kanjiData.slice(start, end);

            quizQuestions = shuffle([...targetKanji]);
            quizIndex = 0;
            score = 0;
            renderQuizQuestion();
        };

        // ★ じゅくごクイズ開始処理
        const startJukugoQuiz = () => {
            const start = currentLevel * QUESTIONS_PER_LEVEL;
            const end = Math.min(start + QUESTIONS_PER_LEVEL, jukugoData.length);
            const targetJukugo = jukugoData.slice(start, end);

            quizQuestions = shuffle([...targetJukugo]);
            quizIndex = 0;
            score = 0;
            renderQuizQuestion();
        };

        // ★ クイズ出題ディスパッチ
        const renderQuizQuestion = () => {
            if (quizMode === 'reading') renderReadingQuiz();
            else if (quizMode === 'kanji') renderKanjiQuiz();
            else renderJukugoQuiz();
        };

        // ★ よみかたクイズ (漢字を見て読みを答える)
        const renderReadingQuiz = () => {
            if (quizIndex >= quizQuestions.length) { renderResult(); return; }

            hasMistaken = false;
            const q = quizQuestions[quizIndex];
            const choices = generateReadingChoices(q);
            const correctFull = fullR(q);

            container.innerHTML = `
                <div class="h-full flex flex-col p-3 relative">
                    <!-- ヘッダー -->
                    <div class="flex justify-between items-center mb-2 md:mb-3">
                        <button id="btn-quit-quiz" class="bg-gray-100 text-gray-400 font-bold py-1.5 px-3 rounded-full text-sm">やめる</button>
                        <div class="bg-blue-100 text-blue-500 px-3 py-1 rounded-full font-bold text-sm">
                            あと ${quizQuestions.length - quizIndex} もん
                        </div>
                        <div class="font-bold text-orange-400 text-sm">てんすう: ${score}</div>
                    </div>

                    <!-- 問題エリア -->
                    <div class="flex-1 flex flex-col items-center justify-center mb-2 md:mb-3 relative">
                        <div class="bg-yellow-50 border-4 border-yellow-200 rounded-2xl p-4 md:p-6 w-full max-w-sm text-center shadow-sm relative z-10">
                            <p class="text-brown-500 font-bold text-xs md:text-sm mb-1">この かんじ の よみかた は？</p>
                            <div>
                                ${kanjiHtml(q,
                                    'text-7xl md:text-8xl font-black text-gray-800',
                                    'text-4xl md:text-5xl font-bold text-orange-500 bg-orange-100 rounded-lg px-1 ml-1'
                                )}
                            </div>
                        </div>

                        <!-- オーバーレイ -->
                        <div id="feedback-overlay" class="absolute inset-0 bg-white/95 rounded-2xl z-50 hidden flex-col items-center justify-center animate-pop">
                            <div id="fb-mark" class="text-8xl font-black mb-2"></div>
                            <div id="fb-text" class="text-xl font-bold text-gray-700 text-center px-4"></div>
                        </div>
                    </div>

                    <!-- 選択肢エリア -->
                    <div class="grid grid-cols-2 gap-2 md:gap-3 h-[35%]">
                        ${choices.map(c => `
                            <button class="choice-btn bg-white border-b-4 border-green-200 hover:bg-green-50 rounded-xl md:rounded-2xl shadow-sm active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-0.5 px-1"
                                data-full="${fullR(c)}" data-kanji="${c.k}" data-oku="${c.o || ''}">
                                ${readingHtml(c,
                                    'inline-block bg-sky-100 text-sky-700 border border-sky-200 px-2 py-1 rounded-lg font-bold text-lg md:text-xl',
                                    'inline-block bg-orange-100 text-orange-600 border border-orange-200 px-2 py-1 rounded-lg font-bold text-base md:text-lg',
                                    'text-xl md:text-2xl font-bold text-gray-600'
                                )}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            container.querySelector('#btn-quit-quiz').onclick = renderModeSelect;
            container.querySelectorAll('.choice-btn').forEach(btn => {
                btn.onclick = () => checkReadingAnswer(btn.dataset.full, correctFull, btn.dataset.kanji, btn.dataset.oku);
            });
        };

        // ★ かんじクイズ (読みを見て漢字を答える)
        const renderKanjiQuiz = () => {
            if (quizIndex >= quizQuestions.length) { renderResult(); return; }

            hasMistaken = false;
            const q = quizQuestions[quizIndex];
            const choices = generateKanjiChoices(q);

            container.innerHTML = `
                <div class="h-full flex flex-col p-3 relative">
                    <!-- ヘッダー -->
                    <div class="flex justify-between items-center mb-2 md:mb-3">
                        <button id="btn-quit-quiz" class="bg-gray-100 text-gray-400 font-bold py-1.5 px-3 rounded-full text-sm">やめる</button>
                        <div class="bg-purple-100 text-purple-500 px-3 py-1 rounded-full font-bold text-sm">
                            あと ${quizQuestions.length - quizIndex} もん
                        </div>
                        <div class="font-bold text-orange-400 text-sm">てんすう: ${score}</div>
                    </div>

                    <!-- 問題エリア -->
                    <div class="flex-1 flex flex-col items-center justify-center mb-2 md:mb-3 relative">
                        <div class="bg-purple-50 border-4 border-purple-200 rounded-2xl p-4 md:p-6 w-full max-w-sm text-center shadow-sm relative z-10">
                            <p class="text-brown-500 font-bold text-xs md:text-sm mb-1">この よみかた の かんじ は？</p>
                            <div class="mt-2 flex items-baseline justify-center gap-1">
                                ${readingHtml(q,
                                    'inline-block bg-sky-100 text-sky-700 border border-sky-300 px-3 py-1 rounded-xl font-black text-4xl md:text-5xl',
                                    'inline-block bg-orange-100 text-orange-600 border border-orange-300 px-3 py-1 rounded-xl font-bold text-2xl md:text-3xl',
                                    'text-5xl md:text-6xl font-black text-gray-800'
                                )}
                            </div>
                        </div>

                        <!-- オーバーレイ -->
                        <div id="feedback-overlay" class="absolute inset-0 bg-white/95 rounded-2xl z-50 hidden flex-col items-center justify-center animate-pop">
                            <div id="fb-mark" class="text-8xl font-black mb-2"></div>
                            <div id="fb-text" class="text-xl font-bold text-gray-700 text-center px-4"></div>
                        </div>
                    </div>

                    <!-- 選択肢エリア -->
                    <div class="grid grid-cols-2 gap-2 md:gap-3 h-[35%]">
                        ${choices.map(c => `
                            <button class="choice-btn bg-white border-b-4 border-purple-200 hover:bg-purple-50 rounded-xl md:rounded-2xl shadow-sm active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center"
                                data-kanji="${c.k}">
                                ${kanjiHtml(c,
                                    'text-4xl md:text-5xl font-black text-gray-800',
                                    'text-xl md:text-2xl font-bold text-orange-500 bg-orange-100 rounded px-1 ml-0.5'
                                )}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            container.querySelector('#btn-quit-quiz').onclick = renderModeSelect;
            container.querySelectorAll('.choice-btn').forEach(btn => {
                btn.onclick = () => checkKanjiAnswer(btn.dataset.kanji, q.k);
            });
        };

        // ★ じゅくごクイズ (熟語を見て読みを答える)
        const renderJukugoQuiz = () => {
            if (quizIndex >= quizQuestions.length) { renderResult(); return; }

            hasMistaken = false;
            const q = quizQuestions[quizIndex];
            const choices = generateJukugoChoices(q);

            container.innerHTML = `
                <div class="h-full flex flex-col p-3 relative">
                    <!-- ヘッダー -->
                    <div class="flex justify-between items-center mb-2 md:mb-3">
                        <button id="btn-quit-quiz" class="bg-gray-100 text-gray-400 font-bold py-1.5 px-3 rounded-full text-sm">やめる</button>
                        <div class="bg-pink-100 text-pink-500 px-3 py-1 rounded-full font-bold text-sm">
                            あと ${quizQuestions.length - quizIndex} もん
                        </div>
                        <div class="font-bold text-orange-400 text-sm">てんすう: ${score}</div>
                    </div>

                    <!-- 問題エリア -->
                    <div class="flex-1 flex flex-col items-center justify-center mb-2 md:mb-3 relative">
                        <div class="bg-pink-50 border-4 border-pink-200 rounded-2xl p-4 md:p-6 w-full max-w-sm text-center shadow-sm relative z-10">
                            <p class="font-bold text-xs md:text-sm mb-1 text-gray-500">この じゅくご の よみかた は？</p>
                            <div class="text-7xl md:text-8xl font-black text-gray-800 tracking-wider">${q.j}</div>
                        </div>

                        <!-- オーバーレイ -->
                        <div id="feedback-overlay" class="absolute inset-0 bg-white/95 rounded-2xl z-50 hidden flex-col items-center justify-center animate-pop">
                            <div id="fb-mark" class="text-8xl font-black mb-2"></div>
                            <div id="fb-text" class="text-xl font-bold text-gray-700 text-center px-4"></div>
                        </div>
                    </div>

                    <!-- 選択肢エリア -->
                    <div class="grid grid-cols-2 gap-2 md:gap-3 h-[35%]">
                        ${choices.map(c => `
                            <button class="choice-btn bg-white border-b-4 border-pink-200 hover:bg-pink-50 rounded-xl md:rounded-2xl shadow-sm active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center"
                                data-reading="${c.r}">
                                <span class="text-xl md:text-2xl font-bold text-gray-600">${c.r}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            container.querySelector('#btn-quit-quiz').onclick = renderModeSelect;
            container.querySelectorAll('.choice-btn').forEach(btn => {
                btn.onclick = () => checkJukugoAnswer(btn.dataset.reading, q.r);
            });
        };

        // ---------------------------------------------------------
        // 5. 答え合わせロジック
        // ---------------------------------------------------------

        // よみかたクイズの答え合わせ
        const checkReadingAnswer = (selectedFull, correctFull, selectedKanji, selectedOku) => {
            const overlay = document.getElementById('feedback-overlay');
            const fbMark = document.getElementById('fb-mark');
            const fbText = document.getElementById('fb-text');

            if (!overlay || overlay.style.display === 'flex') return;
            overlay.style.display = 'flex';

            const q = quizQuestions[quizIndex];
            const isCorrect = selectedFull === correctFull;

            if (system.logQuizResult) {
                system.logQuizResult('かんじマスター', q.k, isCorrect, {
                    reading: fullR(q), selected: selectedFull, level: currentLevel + 1, mode: 'reading'
                });
            }

            if (isCorrect) {
                fbMark.textContent = '◎';
                fbMark.className = 'text-9xl font-black mb-4 text-red-500';
                fbText.innerHTML = '';
                system.playSound('correct');
                if (!hasMistaken) score += 10;
                setTimeout(() => { quizIndex++; renderQuizQuestion(); }, 1200);
            } else {
                hasMistaken = true;
                fbMark.textContent = '×';
                fbMark.className = 'text-9xl font-black mb-4 text-blue-500';
                const selItem = kanjiData.find(k => k.k === selectedKanji);
                const realOku = selItem?.o || '';
                const okuPart = realOku
                    ? `<span class="text-2xl font-bold text-orange-500 bg-orange-100 rounded px-1">${realOku}</span>`
                    : '';
                fbText.innerHTML = `それは <span class="text-4xl text-blue-500 mx-1">${selectedKanji}</span>${okuPart} の<br>よみかた だよ`;
                system.playSound('wrong');
                setTimeout(() => { overlay.style.display = 'none'; }, 2500);
            }
        };

        // かんじクイズの答え合わせ
        const checkKanjiAnswer = (selectedKanji, correctKanji) => {
            const overlay = document.getElementById('feedback-overlay');
            const fbMark = document.getElementById('fb-mark');
            const fbText = document.getElementById('fb-text');

            if (!overlay || overlay.style.display === 'flex') return;
            overlay.style.display = 'flex';

            const q = quizQuestions[quizIndex];
            const isCorrect = selectedKanji === correctKanji;

            if (system.logQuizResult) {
                system.logQuizResult('かんじマスター', q.k, isCorrect, {
                    reading: fullR(q), selected: selectedKanji, level: currentLevel + 1, mode: 'kanji'
                });
            }

            if (isCorrect) {
                fbMark.textContent = '◎';
                fbMark.className = 'text-9xl font-black mb-4 text-red-500';
                fbText.innerHTML = '';
                system.playSound('correct');
                if (!hasMistaken) score += 10;
                setTimeout(() => { quizIndex++; renderQuizQuestion(); }, 1200);
            } else {
                hasMistaken = true;
                fbMark.textContent = '×';
                fbMark.className = 'text-9xl font-black mb-4 text-blue-500';
                const selItem = kanjiData.find(k => k.k === selectedKanji);
                if (selItem) {
                    const selKanjiOku = selItem.o
                        ? `<span class="text-2xl font-bold text-orange-500 bg-orange-100 rounded px-1">${selItem.o}</span>`
                        : '';
                    const selReadPart = `<span class="inline-block bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-bold text-2xl">${selItem.r}</span>`;
                    const selReadOku = selItem.o
                        ? `<span class="inline-block bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold text-xl">${selItem.o}</span>`
                        : '';
                    fbText.innerHTML = `<span class="text-4xl text-blue-500">${selectedKanji}</span>${selKanjiOku} は<br>${selReadPart}${selReadOku} と よむよ`;
                } else {
                    fbText.innerHTML = `ざんねん！<br>もう いちど やってみよう`;
                }
                system.playSound('wrong');
                setTimeout(() => { overlay.style.display = 'none'; }, 2500);
            }
        };

        // じゅくごクイズの答え合わせ
        const checkJukugoAnswer = (selected, correct) => {
            const overlay = document.getElementById('feedback-overlay');
            const fbMark = document.getElementById('fb-mark');
            const fbText = document.getElementById('fb-text');

            if (!overlay || overlay.style.display === 'flex') return;
            overlay.style.display = 'flex';

            const q = quizQuestions[quizIndex];
            const isCorrect = selected === correct;

            if (system.logQuizResult) {
                system.logQuizResult('かんじマスター', q.j, isCorrect, {
                    reading: q.r, selected: selected, level: currentLevel + 1, mode: 'jukugo'
                });
            }

            if (isCorrect) {
                fbMark.textContent = '◎';
                fbMark.className = 'text-9xl font-black mb-4 text-red-500';
                fbText.innerHTML = '';
                system.playSound('correct');
                if (!hasMistaken) score += 10;
                setTimeout(() => { quizIndex++; renderQuizQuestion(); }, 1200);
            } else {
                hasMistaken = true;
                fbMark.textContent = '×';
                fbMark.className = 'text-9xl font-black mb-4 text-blue-500';
                fbText.innerHTML = `<span class="text-4xl font-black text-pink-500">${q.j}</span> は<br><span class="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-lg font-bold text-2xl mt-1">${q.r}</span> だよ`;
                system.playSound('wrong');
                setTimeout(() => { overlay.style.display = 'none'; }, 2500);
            }
        };

        // ★ 結果画面
        const renderResult = () => {
            const isJukugo = quizMode === 'jukugo';
            let comment = "";
            let emoji = "";
            if (score === 100) {
                comment = isJukugo
                    ? "パーフェクト！<br>じゅくごは バッチリだね！"
                    : "パーフェクト！<br>かんじは バッチリだね！";
                emoji = "🏆";
            } else if (score >= 80) {
                comment = "すごい！<br>そのちょうし！";
                emoji = "🥈";
            } else {
                comment = "がんばったね！<br>べんきょうモードで<br>ふくしゅう しよう！";
                emoji = "🍀";
            }

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-3 text-center animate-pop">
                    <div class="text-6xl md:text-7xl mb-2">${emoji}</div>
                    <h2 class="text-2xl md:text-3xl font-black text-blue-500 mb-1">おしまい！</h2>
                    <p class="text-gray-500 font-bold text-lg mb-3">てんすう: <span class="text-3xl text-orange-500">${score}</span> てん</p>

                    <div class="bg-blue-50 rounded-xl p-4 mb-4 w-full max-w-sm">
                        <p class="text-base font-bold text-gray-600 leading-relaxed">${comment}</p>
                    </div>

                    <button id="btn-retry" class="w-full max-w-sm bg-orange-400 text-white font-bold py-2.5 rounded-full shadow-md mb-2 text-base">
                        もういちど
                    </button>
                    <button id="btn-home" class="w-full max-w-sm bg-gray-200 text-gray-600 font-bold py-2.5 rounded-full shadow-sm text-base">
                        レベルをえらぶ
                    </button>
                </div>
            `;

            if(score >= 80) system.playSound('correct');

            container.querySelector('#btn-retry').onclick = isJukugo ? startJukugoQuiz : startQuiz;
            container.querySelector('#btn-home').onclick = () => {
                system.addScore(score);
                renderLevelSelect();
            };
        };

        // ---------------------------------------------------------
        // 6. アプリ起動
        // ---------------------------------------------------------
        renderLevelSelect();

        return () => {};
    }
};
