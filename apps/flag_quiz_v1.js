/**
 * こっきクイズ
 * 5歳児向けの国旗当てクイズ
 * 国旗を見て4択から国名を選ぶ
 * 5段階のレベル制（有名な国から順番に）
 */

export default {
    launch(container, system) {
        // レベル別 国データ（有名度順）
        // レベル1: 超有名（子供でも知ってる）
        const level1 = [
            { code: 'jp', name: '日本', ruby: 'にほん' },
            { code: 'us', name: 'アメリカ', ruby: 'あめりか' },
            { code: 'cn', name: '中国', ruby: 'ちゅうごく' },
            { code: 'kr', name: '韓国', ruby: 'かんこく' },
            { code: 'gb', name: 'イギリス', ruby: 'いぎりす' },
            { code: 'fr', name: 'フランス', ruby: 'ふらんす' },
            { code: 'de', name: 'ドイツ', ruby: 'どいつ' },
            { code: 'it', name: 'イタリア', ruby: 'いたりあ' },
            { code: 'au', name: 'オーストラリア', ruby: 'おーすとらりあ' },
            { code: 'br', name: 'ブラジル', ruby: 'ぶらじる' },
            { code: 'in', name: 'インド', ruby: 'いんど' },
            { code: 'ru', name: 'ロシア', ruby: 'ろしあ' },
        ];

        // レベル2: 有名（ニュースやスポーツで聞く）
        const level2 = [
            { code: 'ca', name: 'カナダ', ruby: 'かなだ' },
            { code: 'mx', name: 'メキシコ', ruby: 'めきしこ' },
            { code: 'es', name: 'スペイン', ruby: 'すぺいん' },
            { code: 'th', name: 'タイ', ruby: 'たい' },
            { code: 'vn', name: 'ベトナム', ruby: 'べとなむ' },
            { code: 'sg', name: 'シンガポール', ruby: 'しんがぽーる' },
            { code: 'eg', name: 'エジプト', ruby: 'えじぷと' },
            { code: 'ar', name: 'アルゼンチン', ruby: 'あるぜんちん' },
            { code: 'nl', name: 'オランダ', ruby: 'おらんだ' },
            { code: 'ch', name: 'スイス', ruby: 'すいす' },
            { code: 'nz', name: 'ニュージーランド', ruby: 'にゅーじーらんど' },
            { code: 'tr', name: 'トルコ', ruby: 'とるこ' },
            { code: 'za', name: '南アフリカ', ruby: 'みなみあふりか' },
            { code: 'sa', name: 'サウジアラビア', ruby: 'さうじあらびあ' },
            { code: 'ae', name: 'アラブ首長国連邦', ruby: 'あらぶ' },
            { code: 'id', name: 'インドネシア', ruby: 'いんどねしあ' },
            { code: 'tw', name: '台湾', ruby: 'たいわん' },
            { code: 'pt', name: 'ポルトガル', ruby: 'ぽるとがる' },
            { code: 'gr', name: 'ギリシャ', ruby: 'ぎりしゃ' },
            { code: 'se', name: 'スウェーデン', ruby: 'すうぇーでん' },
        ];

        // レベル3: 中程度（聞いたことある）
        const level3 = [
            { code: 'ph', name: 'フィリピン', ruby: 'ふぃりぴん' },
            { code: 'my', name: 'マレーシア', ruby: 'まれーしあ' },
            { code: 'kp', name: '北朝鮮', ruby: 'きたちょうせん' },
            { code: 'at', name: 'オーストリア', ruby: 'おーすとりあ' },
            { code: 'be', name: 'ベルギー', ruby: 'べるぎー' },
            { code: 'pl', name: 'ポーランド', ruby: 'ぽーらんど' },
            { code: 'no', name: 'ノルウェー', ruby: 'のるうぇー' },
            { code: 'dk', name: 'デンマーク', ruby: 'でんまーく' },
            { code: 'fi', name: 'フィンランド', ruby: 'ふぃんらんど' },
            { code: 'ie', name: 'アイルランド', ruby: 'あいるらんど' },
            { code: 'cz', name: 'チェコ', ruby: 'ちぇこ' },
            { code: 'hu', name: 'ハンガリー', ruby: 'はんがりー' },
            { code: 'ua', name: 'ウクライナ', ruby: 'うくらいな' },
            { code: 'ir', name: 'イラン', ruby: 'いらん' },
            { code: 'iq', name: 'イラク', ruby: 'いらく' },
            { code: 'il', name: 'イスラエル', ruby: 'いすらえる' },
            { code: 'pk', name: 'パキスタン', ruby: 'ぱきすたん' },
            { code: 'ng', name: 'ナイジェリア', ruby: 'ないじぇりあ' },
            { code: 'ke', name: 'ケニア', ruby: 'けにあ' },
            { code: 'ma', name: 'モロッコ', ruby: 'もろっこ' },
            { code: 'pe', name: 'ペルー', ruby: 'ぺるー' },
            { code: 'cl', name: 'チリ', ruby: 'ちり' },
            { code: 'co', name: 'コロンビア', ruby: 'ころんびあ' },
            { code: 'cu', name: 'キューバ', ruby: 'きゅーば' },
            { code: 'jm', name: 'ジャマイカ', ruby: 'じゃまいか' },
            { code: 'np', name: 'ネパール', ruby: 'ねぱーる' },
            { code: 'qa', name: 'カタール', ruby: 'かたーる' },
            { code: 'mn', name: 'モンゴル', ruby: 'もんごる' },
            { code: 'hr', name: 'クロアチア', ruby: 'くろあちあ' },
            { code: 'ro', name: 'ルーマニア', ruby: 'るーまにあ' },
        ];

        // レベル4: やや難しい（大人でも迷う）
        const level4 = [
            { code: 'lk', name: 'スリランカ', ruby: 'すりらんか' },
            { code: 'bd', name: 'バングラデシュ', ruby: 'ばんぐらでしゅ' },
            { code: 'mm', name: 'ミャンマー', ruby: 'みゃんまー' },
            { code: 'kh', name: 'カンボジア', ruby: 'かんぼじあ' },
            { code: 'la', name: 'ラオス', ruby: 'らおす' },
            { code: 'af', name: 'アフガニスタン', ruby: 'あふがにすたん' },
            { code: 'sk', name: 'スロバキア', ruby: 'すろばきあ' },
            { code: 'bg', name: 'ブルガリア', ruby: 'ぶるがりあ' },
            { code: 'rs', name: 'セルビア', ruby: 'せるびあ' },
            { code: 'si', name: 'スロベニア', ruby: 'すろべにあ' },
            { code: 'is', name: 'アイスランド', ruby: 'あいすらんど' },
            { code: 'ee', name: 'エストニア', ruby: 'えすとにあ' },
            { code: 'lv', name: 'ラトビア', ruby: 'らとびあ' },
            { code: 'lt', name: 'リトアニア', ruby: 'りとあにあ' },
            { code: 'by', name: 'ベラルーシ', ruby: 'べらるーし' },
            { code: 've', name: 'ベネズエラ', ruby: 'べねずえら' },
            { code: 'ec', name: 'エクアドル', ruby: 'えくあどる' },
            { code: 'bo', name: 'ボリビア', ruby: 'ぼりびあ' },
            { code: 'py', name: 'パラグアイ', ruby: 'ぱらぐあい' },
            { code: 'uy', name: 'ウルグアイ', ruby: 'うるぐあい' },
            { code: 'cr', name: 'コスタリカ', ruby: 'こすたりか' },
            { code: 'pa', name: 'パナマ', ruby: 'ぱなま' },
            { code: 'et', name: 'エチオピア', ruby: 'えちおぴあ' },
            { code: 'tz', name: 'タンザニア', ruby: 'たんざにあ' },
            { code: 'gh', name: 'ガーナ', ruby: 'がーな' },
            { code: 'sn', name: 'セネガル', ruby: 'せねがる' },
            { code: 'cm', name: 'カメルーン', ruby: 'かめるーん' },
            { code: 'dz', name: 'アルジェリア', ruby: 'あるじぇりあ' },
            { code: 'tn', name: 'チュニジア', ruby: 'ちゅにじあ' },
            { code: 'jo', name: 'ヨルダン', ruby: 'よるだん' },
            { code: 'lb', name: 'レバノン', ruby: 'ればのん' },
            { code: 'kw', name: 'クウェート', ruby: 'くうぇーと' },
            { code: 'om', name: 'オマーン', ruby: 'おまーん' },
            { code: 'kz', name: 'カザフスタン', ruby: 'かざふすたん' },
            { code: 'uz', name: 'ウズベキスタン', ruby: 'うずべきすたん' },
            { code: 'ge', name: 'ジョージア', ruby: 'じょーじあ' },
            { code: 'cy', name: 'キプロス', ruby: 'きぷろす' },
            { code: 'pg', name: 'パプアニューギニア', ruby: 'ぱぷあ' },
            { code: 'fj', name: 'フィジー', ruby: 'ふぃじー' },
            { code: 'mv', name: 'モルディブ', ruby: 'もるでぃぶ' },
        ];

        // レベル5: 難問（マニアレベル）
        const level5 = [
            { code: 'bt', name: 'ブータン', ruby: 'ぶーたん' },
            { code: 'bn', name: 'ブルネイ', ruby: 'ぶるねい' },
            { code: 'tl', name: '東ティモール', ruby: 'ひがしてぃもーる' },
            { code: 'bh', name: 'バーレーン', ruby: 'ばーれーん' },
            { code: 'ye', name: 'イエメン', ruby: 'いえめん' },
            { code: 'sy', name: 'シリア', ruby: 'しりあ' },
            { code: 'ps', name: 'パレスチナ', ruby: 'ぱれすちな' },
            { code: 'am', name: 'アルメニア', ruby: 'あるめにあ' },
            { code: 'az', name: 'アゼルバイジャン', ruby: 'あぜるばいじゃん' },
            { code: 'tm', name: 'トルクメニスタン', ruby: 'とるくめにすたん' },
            { code: 'kg', name: 'キルギス', ruby: 'きるぎす' },
            { code: 'tj', name: 'タジキスタン', ruby: 'たじきすたん' },
            { code: 'lu', name: 'ルクセンブルク', ruby: 'るくせんぶるく' },
            { code: 'mt', name: 'マルタ', ruby: 'まるた' },
            { code: 'mc', name: 'モナコ', ruby: 'もなこ' },
            { code: 'ad', name: 'アンドラ', ruby: 'あんどら' },
            { code: 'sm', name: 'サンマリノ', ruby: 'さんまりの' },
            { code: 'li', name: 'リヒテンシュタイン', ruby: 'りひてんしゅたいん' },
            { code: 'md', name: 'モルドバ', ruby: 'もるどば' },
            { code: 'ba', name: 'ボスニア・ヘルツェゴビナ', ruby: 'ぼすにあ' },
            { code: 'me', name: 'モンテネグロ', ruby: 'もんてねぐろ' },
            { code: 'mk', name: '北マケドニア', ruby: 'きたまけどにあ' },
            { code: 'al', name: 'アルバニア', ruby: 'あるばにあ' },
            { code: 'xk', name: 'コソボ', ruby: 'こそぼ' },
            { code: 'gt', name: 'グアテマラ', ruby: 'ぐあてまら' },
            { code: 'bz', name: 'ベリーズ', ruby: 'べりーず' },
            { code: 'hn', name: 'ホンジュラス', ruby: 'ほんじゅらす' },
            { code: 'sv', name: 'エルサルバドル', ruby: 'えるさるばどる' },
            { code: 'ni', name: 'ニカラグア', ruby: 'にからぐあ' },
            { code: 'ht', name: 'ハイチ', ruby: 'はいち' },
            { code: 'do', name: 'ドミニカ共和国', ruby: 'どみにか' },
            { code: 'bs', name: 'バハマ', ruby: 'ばはま' },
            { code: 'bb', name: 'バルバドス', ruby: 'ばるばどす' },
            { code: 'tt', name: 'トリニダード・トバゴ', ruby: 'とりにだーど' },
            { code: 'gd', name: 'グレナダ', ruby: 'ぐれなだ' },
            { code: 'vc', name: 'セントビンセント', ruby: 'せんとびんせんと' },
            { code: 'lc', name: 'セントルシア', ruby: 'せんとるしあ' },
            { code: 'dm', name: 'ドミニカ国', ruby: 'どみにかこく' },
            { code: 'ag', name: 'アンティグア・バーブーダ', ruby: 'あんてぃぐあ' },
            { code: 'kn', name: 'セントクリストファー・ネイビス', ruby: 'せんとくりす' },
            { code: 'gy', name: 'ガイアナ', ruby: 'がいあな' },
            { code: 'sr', name: 'スリナム', ruby: 'すりなむ' },
            { code: 'ly', name: 'リビア', ruby: 'りびあ' },
            { code: 'sd', name: 'スーダン', ruby: 'すーだん' },
            { code: 'ss', name: '南スーダン', ruby: 'みなみすーだん' },
            { code: 'er', name: 'エリトリア', ruby: 'えりとりあ' },
            { code: 'dj', name: 'ジブチ', ruby: 'じぶち' },
            { code: 'so', name: 'ソマリア', ruby: 'そまりあ' },
            { code: 'ug', name: 'ウガンダ', ruby: 'うがんだ' },
            { code: 'rw', name: 'ルワンダ', ruby: 'るわんだ' },
            { code: 'bi', name: 'ブルンジ', ruby: 'ぶるんじ' },
            { code: 'cd', name: 'コンゴ民主共和国', ruby: 'こんご' },
            { code: 'cg', name: 'コンゴ共和国', ruby: 'こんご' },
            { code: 'cf', name: '中央アフリカ', ruby: 'ちゅうおう' },
            { code: 'ne', name: 'ニジェール', ruby: 'にじぇーる' },
            { code: 'td', name: 'チャド', ruby: 'ちゃど' },
            { code: 'ml', name: 'マリ', ruby: 'まり' },
            { code: 'bf', name: 'ブルキナファソ', ruby: 'ぶるきなふぁそ' },
            { code: 'gm', name: 'ガンビア', ruby: 'がんびあ' },
            { code: 'gw', name: 'ギニアビサウ', ruby: 'ぎにあびさう' },
            { code: 'gn', name: 'ギニア', ruby: 'ぎにあ' },
            { code: 'sl', name: 'シエラレオネ', ruby: 'しえられおね' },
            { code: 'lr', name: 'リベリア', ruby: 'りべりあ' },
            { code: 'ci', name: 'コートジボワール', ruby: 'こーとじぼわーる' },
            { code: 'tg', name: 'トーゴ', ruby: 'とーご' },
            { code: 'bj', name: 'ベナン', ruby: 'べなん' },
            { code: 'mr', name: 'モーリタニア', ruby: 'もーりたにあ' },
            { code: 'cv', name: 'カーボベルデ', ruby: 'かーぼべるで' },
            { code: 'gq', name: '赤道ギニア', ruby: 'せきどうぎにあ' },
            { code: 'ga', name: 'ガボン', ruby: 'がぼん' },
            { code: 'st', name: 'サントメ・プリンシペ', ruby: 'さんとめ' },
            { code: 'ao', name: 'アンゴラ', ruby: 'あんごら' },
            { code: 'zm', name: 'ザンビア', ruby: 'ざんびあ' },
            { code: 'zw', name: 'ジンバブエ', ruby: 'じんばぶえ' },
            { code: 'mw', name: 'マラウイ', ruby: 'まらうい' },
            { code: 'mz', name: 'モザンビーク', ruby: 'もざんびーく' },
            { code: 'mg', name: 'マダガスカル', ruby: 'まだがすかる' },
            { code: 'mu', name: 'モーリシャス', ruby: 'もーりしゃす' },
            { code: 'km', name: 'コモロ', ruby: 'こもろ' },
            { code: 'sc', name: 'セーシェル', ruby: 'せーしぇる' },
            { code: 'na', name: 'ナミビア', ruby: 'なみびあ' },
            { code: 'bw', name: 'ボツワナ', ruby: 'ぼつわな' },
            { code: 'ls', name: 'レソト', ruby: 'れそと' },
            { code: 'sz', name: 'エスワティニ', ruby: 'えすわてぃに' },
            { code: 'sb', name: 'ソロモン諸島', ruby: 'そろもん' },
            { code: 'vu', name: 'バヌアツ', ruby: 'ばぬあつ' },
            { code: 'ws', name: 'サモア', ruby: 'さもあ' },
            { code: 'to', name: 'トンガ', ruby: 'とんが' },
            { code: 'ki', name: 'キリバス', ruby: 'きりばす' },
            { code: 'tv', name: 'ツバル', ruby: 'つばる' },
            { code: 'nr', name: 'ナウル', ruby: 'なうる' },
            { code: 'pw', name: 'パラオ', ruby: 'ぱらお' },
            { code: 'fm', name: 'ミクロネシア', ruby: 'みくろねしあ' },
            { code: 'mh', name: 'マーシャル諸島', ruby: 'まーしゃる' },
            { code: 'va', name: 'バチカン', ruby: 'ばちかん' },
        ];

        const levels = [level1, level2, level3, level4, level5];
        const levelNames = ['かんたん', 'ふつう', 'ちょいむず', 'むずかしい', 'マニア'];
        const levelColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#7c3aed'];
        const levelEmojis = ['🌟', '⭐', '🔥', '💪', '👑'];

        let currentLevel = 0;
        let currentQuestion = null;
        let score = 0;
        let questionCount = 0;
        let totalQuestions = 10;
        let answered = false;
        let selectedAnswer = null;
        let showCelebration = false;
        let showWrongAnswer = false;
        let showResult = false;
        let showLevelSelect = true;

        // シャッフル関数
        const shuffle = (array) => {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        // 国旗画像URL
        const getFlagUrl = (code) => `https://flagcdn.com/w320/${code}.png`;

        // そのレベルまでの国を取得
        const getCountriesForLevel = (level) => {
            let countries = [];
            for (let i = 0; i <= level; i++) {
                countries = [...countries, ...levels[i]];
            }
            return countries;
        };

        // 新しい問題を生成
        const generateQuestion = () => {
            const countries = getCountriesForLevel(currentLevel);
            const shuffled = shuffle(countries);
            const correct = shuffled[0];
            const choices = shuffle([correct, ...shuffled.slice(1, 4)]);

            return {
                correct,
                choices,
            };
        };

        // 次の問題へ
        const nextQuestion = () => {
            if (questionCount >= totalQuestions) {
                showResult = true;
                render();
                return;
            }

            currentQuestion = generateQuestion();
            answered = false;
            selectedAnswer = null;
            showCelebration = false;
            showWrongAnswer = false;
            questionCount++;
            render();
        };

        // パーティクル演出
        const createParticles = () => {
            const particleTypes = ['⭐', '🌟', '✨', '💖', '🎉', '🎊', '💫', '🌈', '🏆', '👏', '🥳'];
            const count = 25;

            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.textContent = particleTypes[Math.floor(Math.random() * particleTypes.length)];

                const startX = Math.random() * window.innerWidth;
                const startY = window.innerHeight + 50;
                const endX = startX + (Math.random() - 0.5) * 300;
                const endY = Math.random() * window.innerHeight * 0.4;

                particle.style.cssText = `
                    position: fixed;
                    left: ${startX}px;
                    top: ${startY}px;
                    font-size: ${35 + Math.random() * 30}px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: flag-particle-rise 1.8s ease-out forwards;
                    --endX: ${endX}px;
                    --endY: ${endY}px;
                `;

                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1800);
            }
        };

        // 回答処理
        const handleAnswer = (choice) => {
            if (answered) return;

            answered = true;
            selectedAnswer = choice;

            if (choice.code === currentQuestion.correct.code) {
                score++;
                showCelebration = true;
                system.playSound('correct');
                createParticles();
            } else {
                showWrongAnswer = true;
                system.playSound('incorrect');
            }

            render();

            // 次の問題へ
            setTimeout(() => {
                nextQuestion();
            }, showCelebration ? 2500 : 2500);
        };

        // レベル選択
        const selectLevel = (level) => {
            currentLevel = level;
            showLevelSelect = false;
            score = 0;
            questionCount = 0;
            showResult = false;
            nextQuestion();
        };

        // レベル選択に戻る
        const backToLevelSelect = () => {
            showLevelSelect = true;
            showResult = false;
            render();
        };

        // 描画
        const render = () => {
            container.innerHTML = `
                <style>
                    @keyframes flag-particle-rise {
                        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(calc(var(--endY) - 100vh)) translateX(calc(var(--endX) - 50vw)) rotate(360deg); opacity: 0; }
                    }
                    @keyframes flag-bounce {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.08); }
                    }
                    @keyframes flag-shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-8px); }
                        75% { transform: translateX(8px); }
                    }
                    @keyframes flag-celebrate {
                        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
                        50% { transform: scale(1.2) rotate(10deg); opacity: 1; }
                        100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    }
                    @keyframes flag-wrong-pop {
                        0% { transform: scale(0); opacity: 0; }
                        40% { transform: scale(1.15); }
                        70% { transform: scale(0.95); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes flag-wrong-shake {
                        0%, 100% { transform: rotate(0deg); }
                        20% { transform: rotate(-8deg); }
                        40% { transform: rotate(8deg); }
                        60% { transform: rotate(-5deg); }
                        80% { transform: rotate(5deg); }
                    }
                    @keyframes flag-wave {
                        0%, 100% { transform: perspective(400px) rotateY(-5deg); }
                        50% { transform: perspective(400px) rotateY(5deg); }
                    }
                    @keyframes level-pop {
                        0% { transform: scale(0.8); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }

                    .flag-container {
                        height: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                        background-size: 200% 200%;
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                    }

                    .flag-header {
                        background: rgba(255,255,255,0.95);
                        padding: 10px 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 2px 15px rgba(0,0,0,0.1);
                    }

                    .flag-back-btn {
                        background: none;
                        border: none;
                        font-size: 14px;
                        color: #666;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    .flag-title {
                        font-size: 20px;
                        font-weight: 900;
                        color: #7c3aed;
                    }

                    .flag-score {
                        background: linear-gradient(135deg, #fbbf24, #f59e0b);
                        color: white;
                        padding: 5px 12px;
                        border-radius: 15px;
                        font-weight: bold;
                        font-size: 14px;
                    }

                    .flag-progress {
                        background: rgba(255,255,255,0.3);
                        height: 8px;
                        margin: 0;
                    }

                    .flag-progress-bar {
                        background: linear-gradient(90deg, #34d399, #10b981);
                        height: 100%;
                        transition: width 0.5s ease;
                    }

                    .flag-content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 15px;
                        gap: 15px;
                    }

                    .flag-question-num {
                        background: rgba(255,255,255,0.9);
                        padding: 8px 20px;
                        border-radius: 20px;
                        font-weight: bold;
                        color: #7c3aed;
                        font-size: 16px;
                    }

                    .flag-level-badge {
                        background: ${levelColors[currentLevel]};
                        color: white;
                        padding: 4px 12px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: bold;
                        margin-left: 8px;
                    }

                    .flag-display {
                        width: min(70vw, 280px);
                        height: auto;
                        border-radius: 8px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                        animation: flag-wave 3s ease-in-out infinite;
                        border: 4px solid white;
                    }

                    .flag-instruction {
                        background: rgba(255,255,255,0.95);
                        padding: 12px 25px;
                        border-radius: 25px;
                        font-size: 18px;
                        font-weight: bold;
                        color: #374151;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    }

                    .flag-choices {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                        width: 100%;
                        max-width: 400px;
                    }

                    .flag-choice {
                        background: white;
                        border: 4px solid #e5e7eb;
                        border-radius: 16px;
                        padding: 12px 8px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        text-align: center;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    }

                    .flag-choice:active {
                        transform: scale(0.95);
                    }

                    .flag-choice.correct {
                        background: linear-gradient(135deg, #d1fae5, #a7f3d0);
                        border-color: #10b981;
                        animation: flag-bounce 0.5s ease;
                    }

                    .flag-choice.incorrect {
                        background: linear-gradient(135deg, #fee2e2, #fecaca);
                        border-color: #ef4444;
                        animation: flag-shake 0.3s ease;
                    }

                    .flag-choice.show-correct {
                        border-color: #10b981;
                        border-width: 4px;
                        background: linear-gradient(135deg, #d1fae5, #a7f3d0);
                    }

                    .flag-choice-name {
                        font-size: 18px;
                        font-weight: bold;
                        color: #1f2937;
                        margin-bottom: 2px;
                    }

                    .flag-choice-ruby {
                        font-size: 13px;
                        color: #6b7280;
                    }

                    /* レベル選択 */
                    .level-select {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        gap: 15px;
                    }

                    .level-select-title {
                        font-size: 24px;
                        font-weight: 900;
                        color: white;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                        margin-bottom: 10px;
                    }

                    .level-buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        width: 100%;
                        max-width: 320px;
                    }

                    .level-btn {
                        background: white;
                        border: none;
                        border-radius: 20px;
                        padding: 18px 25px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                        transition: all 0.2s ease;
                        animation: level-pop 0.4s ease backwards;
                    }

                    .level-btn:nth-child(1) { animation-delay: 0.05s; }
                    .level-btn:nth-child(2) { animation-delay: 0.1s; }
                    .level-btn:nth-child(3) { animation-delay: 0.15s; }
                    .level-btn:nth-child(4) { animation-delay: 0.2s; }
                    .level-btn:nth-child(5) { animation-delay: 0.25s; }

                    .level-btn:active {
                        transform: scale(0.97);
                    }

                    .level-emoji {
                        font-size: 32px;
                    }

                    .level-info {
                        flex: 1;
                        text-align: left;
                    }

                    .level-name {
                        font-size: 18px;
                        font-weight: bold;
                        color: #374151;
                    }

                    .level-desc {
                        font-size: 12px;
                        color: #9ca3af;
                        margin-top: 2px;
                    }

                    .level-num {
                        font-size: 14px;
                        font-weight: bold;
                        color: white;
                        padding: 5px 12px;
                        border-radius: 15px;
                    }

                    /* お祝い演出 */
                    .flag-celebration {
                        position: fixed;
                        left: 0;
                        right: 0;
                        bottom: 180px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: none;
                        z-index: 100;
                    }

                    .flag-celebration-content {
                        background: white;
                        border-radius: 25px;
                        padding: 15px 35px;
                        text-align: center;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.25);
                        animation: flag-celebrate 0.6s ease-out;
                    }

                    .flag-celebration-emoji {
                        font-size: 50px;
                        margin-bottom: 3px;
                    }

                    .flag-celebration-text {
                        font-size: 26px;
                        font-weight: 900;
                        color: #10b981;
                        text-shadow: 2px 2px 0 #d1fae5;
                    }

                    .flag-celebration-sub {
                        font-size: 14px;
                        color: #6b7280;
                        margin-top: 3px;
                    }

                    /* 残念演出 */
                    .flag-wrong {
                        position: fixed;
                        left: 0;
                        right: 0;
                        bottom: 180px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: none;
                        z-index: 100;
                    }

                    .flag-wrong-content {
                        background: linear-gradient(135deg, #fff5f5, #fff);
                        border-radius: 25px;
                        padding: 15px 25px;
                        text-align: center;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.25);
                        border: 3px solid #fca5a5;
                        animation: flag-wrong-pop 0.5s ease-out;
                    }

                    .flag-wrong-emoji {
                        font-size: 45px;
                        margin-bottom: 5px;
                        animation: flag-wrong-shake 0.6s ease-out;
                    }

                    .flag-wrong-text {
                        font-size: 20px;
                        font-weight: 900;
                        color: #f87171;
                        margin-bottom: 5px;
                    }

                    .flag-wrong-answer {
                        font-size: 16px;
                        font-weight: bold;
                        color: #374151;
                        background: linear-gradient(135deg, #fef3c7, #fde68a);
                        padding: 8px 16px;
                        border-radius: 15px;
                        display: inline-block;
                    }

                    .flag-wrong-answer-name {
                        font-size: 20px;
                        color: #7c3aed;
                        font-weight: 900;
                    }

                    .flag-wrong-cheer {
                        font-size: 12px;
                        color: #9ca3af;
                        margin-top: 6px;
                    }

                    /* 結果画面 */
                    .flag-result {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        text-align: center;
                    }

                    .flag-result-card {
                        background: white;
                        border-radius: 30px;
                        padding: 30px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                        max-width: 350px;
                        width: 100%;
                    }

                    .flag-result-emoji {
                        font-size: 80px;
                        margin-bottom: 15px;
                    }

                    .flag-result-title {
                        font-size: 28px;
                        font-weight: 900;
                        color: #7c3aed;
                        margin-bottom: 10px;
                    }

                    .flag-result-score {
                        font-size: 50px;
                        font-weight: 900;
                        color: #10b981;
                        margin: 15px 0;
                    }

                    .flag-result-message {
                        font-size: 18px;
                        color: #6b7280;
                        margin-bottom: 25px;
                    }

                    .flag-result-buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .flag-restart-btn {
                        background: linear-gradient(135deg, #7c3aed, #a855f7);
                        color: white;
                        border: none;
                        padding: 15px 40px;
                        border-radius: 30px;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                        box-shadow: 0 5px 20px rgba(124, 58, 237, 0.4);
                    }

                    .flag-level-btn {
                        background: white;
                        color: #7c3aed;
                        border: 3px solid #7c3aed;
                        padding: 12px 30px;
                        border-radius: 30px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    .flag-restart-btn:active, .flag-level-btn:active {
                        transform: scale(0.95);
                    }
                </style>

                <div class="flag-container">
                    <div class="flag-header">
                        <button class="flag-back-btn" id="flag-back">← もどる</button>
                        <span class="flag-title">🌍 こっきクイズ</span>
                        ${showLevelSelect ? '<span></span>' : `<span class="flag-score">⭐ ${score}てん</span>`}
                    </div>

                    ${!showLevelSelect ? `
                        <div class="flag-progress">
                            <div class="flag-progress-bar" style="width: ${(questionCount / totalQuestions) * 100}%;"></div>
                        </div>
                    ` : ''}

                    ${showLevelSelect ? `
                        <div class="level-select">
                            <div class="level-select-title">レベルを えらんでね！</div>
                            <div class="level-buttons">
                                ${levels.map((_, i) => `
                                    <button class="level-btn" data-level="${i}">
                                        <span class="level-emoji">${levelEmojis[i]}</span>
                                        <div class="level-info">
                                            <div class="level-name">レベル ${i + 1} : ${levelNames[i]}</div>
                                            <div class="level-desc">${getCountriesForLevel(i).length}か国</div>
                                        </div>
                                        <span class="level-num" style="background: ${levelColors[i]};">Lv.${i + 1}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    ` : showResult ? `
                        <div class="flag-result">
                            <div class="flag-result-card">
                                <div class="flag-result-emoji">${score >= 8 ? '🏆' : score >= 5 ? '🎉' : '💪'}</div>
                                <h2 class="flag-result-title">けっか はっぴょう！</h2>
                                <div class="flag-result-score">${score} / ${totalQuestions}</div>
                                <p class="flag-result-message">
                                    ${score === 10 ? 'パーフェクト！すごすぎる！🌟' :
                                      score >= 8 ? 'すばらしい！こっきはかせだね！' :
                                      score >= 5 ? 'よくがんばったね！' :
                                      'また ちょうせん してね！'}
                                </p>
                                <div class="flag-result-buttons">
                                    <button class="flag-restart-btn" id="restart-btn">もういちど あそぶ</button>
                                    <button class="flag-level-btn" id="level-select-btn">レベルを かえる</button>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="flag-content">
                            <div class="flag-question-num">
                                だい ${questionCount}もん / ${totalQuestions}もん
                                <span class="flag-level-badge">${levelEmojis[currentLevel]} ${levelNames[currentLevel]}</span>
                            </div>

                            <img
                                src="${getFlagUrl(currentQuestion?.correct.code || 'jp')}"
                                alt="国旗"
                                class="flag-display"
                                onerror="this.style.display='none'"
                            />

                            <div class="flag-instruction">
                                この こっきは どこの くに？
                            </div>

                            <div class="flag-choices">
                                ${currentQuestion?.choices.map(choice => {
                                    let className = 'flag-choice';
                                    if (answered) {
                                        if (choice.code === currentQuestion.correct.code) {
                                            className += ' correct show-correct';
                                        } else if (selectedAnswer && choice.code === selectedAnswer.code) {
                                            className += ' incorrect';
                                        }
                                    }
                                    return `
                                        <button class="${className}" data-code="${choice.code}">
                                            <div class="flag-choice-name">${choice.name}</div>
                                            <div class="flag-choice-ruby">${choice.ruby}</div>
                                        </button>
                                    `;
                                }).join('') || ''}
                            </div>
                        </div>
                    `}

                    ${showCelebration ? `
                        <div class="flag-celebration">
                            <div class="flag-celebration-content">
                                <div class="flag-celebration-emoji">🎉</div>
                                <div class="flag-celebration-text">せいかい！</div>
                                <div class="flag-celebration-sub">すごいね！</div>
                            </div>
                        </div>
                    ` : ''}

                    ${showWrongAnswer ? `
                        <div class="flag-wrong">
                            <div class="flag-wrong-content">
                                <div class="flag-wrong-emoji">🙈</div>
                                <div class="flag-wrong-text">ざんねん！</div>
                                <div class="flag-wrong-answer">
                                    これは <span class="flag-wrong-answer-name">${currentQuestion?.correct.name}</span> だよ！
                                </div>
                                <div class="flag-wrong-cheer">つぎは がんばろう！💪</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;

            // イベント設定
            container.querySelector('#flag-back')?.addEventListener('click', () => {
                if (showLevelSelect) {
                    system.goHome();
                } else {
                    backToLevelSelect();
                }
            });
            container.querySelector('#restart-btn')?.addEventListener('click', () => selectLevel(currentLevel));
            container.querySelector('#level-select-btn')?.addEventListener('click', backToLevelSelect);

            container.querySelectorAll('.level-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const level = parseInt(btn.dataset.level);
                    selectLevel(level);
                });
            });

            container.querySelectorAll('.flag-choice').forEach(btn => {
                btn.addEventListener('click', () => {
                    const code = btn.dataset.code;
                    const choice = currentQuestion.choices.find(c => c.code === code);
                    if (choice) handleAnswer(choice);
                });
            });
        };

        // レベル選択画面を表示
        render();

        return () => {};
    }
};
