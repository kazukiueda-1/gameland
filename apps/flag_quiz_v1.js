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

        // 国の緯度経度データ（ちずクイズ用）
        const countryCoords = {
            'jp':[36.2,138.2],'us':[37.1,-95.7],'cn':[35.9,104.2],'kr':[35.9,127.8],
            'gb':[55.4,-3.4],'fr':[46.2,2.2],'de':[51.2,10.4],'it':[41.9,12.6],
            'au':[-25.3,133.8],'br':[-14.2,-51.9],'in':[20.6,78.9],'ru':[61.5,105.3],
            'ca':[56.1,-106.3],'mx':[23.6,-102.6],'es':[40.5,-3.7],'th':[15.9,100.9],
            'vn':[14.1,108.3],'sg':[1.4,103.8],'eg':[26.8,30.8],'ar':[-38.4,-63.6],
            'nl':[52.1,5.3],'ch':[46.8,8.2],'nz':[-40.9,174.9],'tr':[38.9,35.2],
            'za':[-30.6,22.9],'sa':[23.9,45.1],'ae':[23.4,53.8],'id':[-0.8,113.9],
            'tw':[23.7,121.0],'pt':[39.4,-8.2],'gr':[39.1,22.0],'se':[60.1,18.6],
            'ph':[12.9,121.8],'my':[4.2,108.0],'kp':[40.3,127.5],'at':[47.5,14.6],
            'be':[50.5,4.5],'pl':[51.9,19.1],'no':[60.5,8.5],'dk':[56.3,9.5],
            'fi':[64.0,26.0],'ie':[53.4,-8.2],'cz':[49.8,15.5],'hu':[47.2,19.5],
            'ua':[48.4,31.2],'ir':[32.4,53.7],'iq':[33.2,43.7],'il':[31.0,35.0],
            'pk':[30.4,69.3],'ng':[9.1,8.7],'ke':[-0.0,37.9],'ma':[31.8,-7.1],
            'pe':[-9.2,-75.0],'cl':[-35.7,-71.5],'co':[4.6,-74.3],'cu':[21.5,-79.5],
            'jm':[18.1,-77.3],'np':[28.4,84.1],'qa':[25.4,51.2],'mn':[46.9,103.8],
            'hr':[45.1,16.4],'ro':[45.9,24.9],'lk':[7.9,80.8],'bd':[23.7,90.4],
            'mm':[21.9,95.9],'kh':[12.6,104.9],'la':[19.9,102.5],'af':[33.9,67.7],
            'sk':[48.7,19.7],'bg':[42.7,25.5],'rs':[44.0,21.0],'si':[46.2,14.8],
            'is':[64.9,-18.0],'ee':[58.6,25.0],'lv':[56.9,24.6],'lt':[55.2,23.9],
            'by':[53.7,27.9],'ve':[6.4,-66.6],'ec':[-1.8,-78.2],'bo':[-16.3,-63.6],
            'py':[-23.4,-58.4],'uy':[-32.5,-55.8],'cr':[9.7,-83.8],'pa':[8.5,-80.0],
            'et':[9.1,40.5],'tz':[-6.4,34.9],'gh':[7.9,-1.0],'sn':[14.5,-14.5],
            'cm':[5.7,12.4],'dz':[28.0,2.6],'tn':[33.9,9.6],'jo':[30.6,36.2],
            'lb':[33.9,35.5],'kw':[29.3,47.5],'om':[21.5,55.9],'kz':[48.0,68.0],
            'uz':[41.4,64.6],'ge':[42.3,43.4],'cy':[35.1,33.4],'pg':[-6.3,143.9],
            'fj':[-17.7,178.1],'mv':[3.2,73.2],'bt':[27.5,90.4],'bn':[4.5,114.7],
            'tl':[-8.9,125.7],'bh':[26.0,50.6],'ye':[15.6,48.5],'sy':[34.8,38.8],
            'ps':[31.9,35.3],'am':[40.1,45.0],'az':[40.1,47.6],'tm':[38.9,59.6],
            'kg':[41.2,74.8],'tj':[38.9,71.3],'lu':[49.8,6.1],'mt':[35.9,14.5],
            'mc':[43.7,7.4],'ad':[42.5,1.6],'sm':[43.9,12.5],'li':[47.2,9.6],
            'md':[47.4,28.4],'ba':[44.2,17.7],'me':[42.7,19.4],'mk':[41.6,21.7],
            'al':[41.2,20.2],'xk':[42.6,20.9],'gt':[15.8,-90.2],'bz':[17.2,-88.5],
            'hn':[15.2,-86.2],'sv':[13.8,-88.9],'ni':[12.9,-85.2],'ht':[19.0,-72.5],
            'do':[18.7,-70.2],'bs':[25.0,-77.4],'bb':[13.2,-59.6],'tt':[10.7,-61.2],
            'gd':[12.1,-61.7],'vc':[13.2,-61.2],'lc':[13.9,-60.9],'dm':[15.4,-61.4],
            'ag':[17.1,-61.8],'kn':[17.4,-62.8],'gy':[4.9,-58.9],'sr':[3.9,-56.0],
            'ly':[26.3,17.2],'sd':[12.9,30.2],'ss':[6.9,31.3],'er':[15.2,39.8],
            'dj':[11.8,42.6],'so':[5.2,46.2],'ug':[1.4,32.3],'rw':[-1.9,29.9],
            'bi':[-3.4,29.9],'cd':[-4.0,21.8],'cg':[-0.2,15.8],'cf':[6.6,20.9],
            'ne':[17.6,8.1],'td':[15.5,18.7],'ml':[17.6,-4.0],'bf':[12.4,-1.6],
            'gm':[13.4,-15.3],'gw':[11.8,-15.2],'gn':[9.9,-11.3],'sl':[8.5,-11.8],
            'lr':[6.4,-9.4],'ci':[7.5,-5.5],'tg':[8.6,0.8],'bj':[9.3,2.3],
            'mr':[21.0,-10.9],'cv':[16.0,-24.0],'gq':[1.7,10.3],'ga':[-0.8,11.6],
            'st':[0.2,6.6],'ao':[-11.2,17.9],'zm':[-13.1,27.8],'zw':[-19.0,29.2],
            'mw':[-13.3,34.3],'mz':[-18.7,35.5],'mg':[-18.8,46.9],'mu':[-20.3,57.6],
            'km':[-11.9,43.9],'sc':[-4.7,55.5],'na':[-22.0,17.0],'bw':[-22.3,24.7],
            'ls':[-29.6,28.2],'sz':[-26.5,31.5],'sb':[-9.6,160.2],'vu':[-15.4,166.9],
            'ws':[-13.8,-172.1],'to':[-21.2,-175.2],'ki':[1.3,173.0],'tv':[-8.5,178.7],
            'nr':[-0.5,166.9],'pw':[7.5,134.6],'fm':[6.9,158.2],'mh':[7.1,171.2],
            'va':[41.9,12.5],
        };

        const enrichCountry = (c) => ({
            ...c,
            lat: (countryCoords[c.code] || [0,0])[0],
            lng: (countryCoords[c.code] || [0,0])[1],
        });

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
        let studyMode = false;
        let studyIndex = 0;

        // ちずクイズ用状態
        let mapMode = false;
        let mapScore = 0;
        let mapQuestionCount = 0;
        let mapQuestion = null;
        let mapAnswered = false;
        let globeScene = null;
        let globeTargetRotY = 0, globeTargetRotX = 0;
        let globeCurrentRotY = 0, globeCurrentRotX = 0;
        let globeMarkerMeshes = [];
        let globeIsDragging = false;
        let globeTouchStartX = 0, globeTouchStartY = 0;

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

        // そのレベルまでの国を取得（lat/lng付き）
        const getCountriesForLevel = (level) => {
            let countries = [];
            for (let i = 0; i <= level; i++) {
                countries = [...countries, ...levels[i]];
            }
            return countries.map(enrichCountry);
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
            cleanupGlobe();
            mapMode = false;
            showLevelSelect = true;
            showResult = false;
            studyMode = false;
            render();
        };

        // 勉強モード
        const startStudyMode = (level) => {
            currentLevel = level;
            studyMode = true;
            studyIndex = 0;
            showLevelSelect = false;
            render();
        };

        const prevStudyCard = () => {
            if (studyIndex > 0) {
                studyIndex--;
                render();
            }
        };

        const nextStudyCard = () => {
            if (studyIndex < levels[currentLevel].length - 1) {
                studyIndex++;
                render();
            }
        };

        // ======= ちずクイズ（3D地球儀）関連 =======

        // Three.js 動的ロード
        const loadThreeJS = () => new Promise((resolve, reject) => {
            if (window.THREE) { resolve(window.THREE); return; }
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            s.onload = () => resolve(window.THREE);
            s.onerror = reject;
            document.head.appendChild(s);
        });

        // TopoJSON クライアント動的ロード
        const loadTopojson = () => new Promise((resolve, reject) => {
            if (window.topojson) { resolve(); return; }
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });

        // 世界地図データのフェッチ（キャッシュ）
        let cachedWorldData = null;
        const fetchWorldData = async () => {
            if (cachedWorldData) return cachedWorldData;
            const r = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
            cachedWorldData = await r.json();
            return cachedWorldData;
        };

        // GeoJSON フィーチャを canvas に描画
        const drawGeoFeature = (ctx, feature, w, h) => {
            const drawRing = (ring) => {
                ring.forEach(([lng, lat], i) => {
                    const x = (lng + 180) / 360 * w;
                    const y = (90 - lat) / 180 * h;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                });
                ctx.closePath();
            };
            ctx.beginPath();
            const { type, coordinates } = feature.geometry;
            if (type === 'Polygon') coordinates.forEach(drawRing);
            else if (type === 'MultiPolygon') coordinates.forEach(poly => poly.forEach(drawRing));
        };

        // 地図スタイルのテクスチャを canvas で生成
        const generateMapTexture = (topo) => {
            const w = 2048, h = 1024;
            const cvs = document.createElement('canvas');
            cvs.width = w; cvs.height = h;
            const ctx = cvs.getContext('2d');

            // 海（鮮やかな青）
            ctx.fillStyle = '#1a7ab5';
            ctx.fillRect(0, 0, w, h);

            // 陸地（鮮やかな緑）
            const countries = topojson.feature(topo, topo.objects.countries);
            ctx.fillStyle = '#5aaa2a';
            countries.features.forEach(f => { drawGeoFeature(ctx, f, w, h); ctx.fill('evenodd'); });

            // 海岸線（濃い緑アウトライン）
            const coasts = topojson.mesh(topo, topo.objects.countries, (a, b) => a === b);
            ctx.strokeStyle = 'rgba(20,70,10,0.8)';
            ctx.lineWidth = 1.2;
            coasts.coordinates.forEach(line => {
                ctx.beginPath();
                line.forEach(([lng, lat], i) => {
                    const x = (lng + 180) / 360 * w;
                    const y = (90 - lat) / 180 * h;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                });
                ctx.stroke();
            });

            // 国境線（濃いグレー・細め）
            const borders = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);
            ctx.strokeStyle = 'rgba(60,60,60,0.85)';
            ctx.lineWidth = 1.5;
            borders.coordinates.forEach(line => {
                ctx.beginPath();
                line.forEach(([lng, lat], i) => {
                    const x = (lng + 180) / 360 * w;
                    const y = (90 - lat) / 180 * h;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                });
                ctx.stroke();
            });

            return cvs;
        };

        // lat/lng → 3D座標
        const latLngToVec3 = (THREE, lat, lng, r = 1.05) => {
            const phi   = (90 - lat)  * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);
            return new THREE.Vector3(
                -r * Math.sin(phi) * Math.cos(theta),
                 r * Math.cos(phi),
                 r * Math.sin(phi) * Math.sin(theta)
            );
        };

        // 地球儀の向き目標を設定
        const setGlobeTarget = (lat, lng) => {
            globeTargetRotY = -((lng + 90) * Math.PI / 180);
            globeTargetRotX =  (lat * Math.PI / 180) * 0.25;
        };

        // WebGLリソース解放
        const cleanupGlobe = () => {
            if (!globeScene) return;
            cancelAnimationFrame(globeScene.animFrameId);
            globeScene.scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (obj.material.map) obj.material.map.dispose();
                    obj.material.dispose();
                }
            });
            globeScene.renderer.dispose();
            globeScene = null;
            globeMarkerMeshes = [];
        };

        // ちずクイズ問題生成
        const generateMapQuestion = () => {
            const countries = getCountriesForLevel(currentLevel);
            const shuffled = shuffle(countries);
            const correct = shuffled[0];
            // デコイ: 正解と同じ大陸の国を避けずランダム3択
            const decoys = shuffle(shuffled.slice(1)).slice(0, 3);
            return { correct, choices: shuffle([correct, ...decoys]) };
        };

        // マーカーを配置（earthMeshの子要素にして地球儀の回転に追従させる）
        const placeMarkers = (THREE, earthMesh, question) => {
            // 既存マーカーをearthMeshから削除
            globeMarkerMeshes.forEach(m => earthMesh.remove(m));
            globeMarkerMeshes = [];
            // 日本マーカーも削除
            [...earthMesh.children].filter(c => c.userData?.isJapan).forEach(c => earthMesh.remove(c));

            // 日本マーカー（赤・非選択）
            const jpCoords = countryCoords['jp'];
            const jpGeo = new THREE.SphereGeometry(0.042, 16, 16);
            const jpMat = new THREE.MeshStandardMaterial({ color: 0xff2244, emissive: 0xff2244, emissiveIntensity: 0.5 });
            const jpMesh = new THREE.Mesh(jpGeo, jpMat);
            jpMesh.position.copy(latLngToVec3(THREE, jpCoords[0], jpCoords[1], 1.05));
            jpMesh.userData = { isJapan: true };
            earthMesh.add(jpMesh);  // earthMeshの子要素として追加

            // 4択マーカー（小さめ・鮮やかな色）
            question.choices.forEach(country => {
                const geo = new THREE.SphereGeometry(0.038, 16, 16);
                const mat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff2200, emissiveIntensity: 0.7 });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.copy(latLngToVec3(THREE, country.lat, country.lng, 1.05));
                mesh.userData = { countryCode: country.code, country };
                earthMesh.add(mesh);
                globeMarkerMeshes.push(mesh);
            });

            // 日本ラベルのみ（選択肢は非表示）
            const labelContainer = container.querySelector('#globe-label-container');
            if (labelContainer) {
                labelContainer.innerHTML = '';
                const jpDiv = document.createElement('div');
                jpDiv.id = 'japan-map-label';
                jpDiv.style.cssText = [
                    'position:absolute',
                    'transform:translateX(-50%)',
                    'background:rgba(200,0,40,0.88)',
                    'color:#fff',
                    'font-size:11px',
                    'font-weight:bold',
                    'padding:2px 8px',
                    'border-radius:10px',
                    'white-space:nowrap',
                    'pointer-events:none',
                    'border:1.5px solid #ff2244',
                    'text-shadow:0 1px 2px rgba(0,0,0,0.9)',
                    'opacity:0',
                ].join(';');
                jpDiv.textContent = '日本';
                labelContainer.appendChild(jpDiv);
            }
        };

        // マーカーラベルを 3D→2D 投影して位置更新
        const updateMarkerLabels = (camera) => {
            const labelContainer = container.querySelector('#globe-label-container');
            if (!labelContainer || !globeScene) return;
            const canvas = container.querySelector('#globe-canvas');
            if (!canvas) return;
            const canvasRect = canvas.getBoundingClientRect();
            const wrapRect = labelContainer.parentElement.getBoundingClientRect();
            // 日本ラベルを地図上のマーカー近くに表示
            const jpLabelEl = labelContainer.querySelector('#japan-map-label');
            if (jpLabelEl) {
                const jpMesh = globeScene.earthMesh.children.find(c => c.userData?.isJapan);
                if (jpMesh) {
                    const worldPos = new globeScene.THREE.Vector3();
                    jpMesh.getWorldPosition(worldPos);
                    if (worldPos.clone().normalize().z < 0) {
                        jpLabelEl.style.opacity = '0';
                    } else {
                        worldPos.project(camera);
                        const x = (worldPos.x * 0.5 + 0.5) * canvasRect.width + (canvasRect.left - wrapRect.left);
                        const y = (-worldPos.y * 0.5 + 0.5) * canvasRect.height + (canvasRect.top - wrapRect.top);
                        jpLabelEl.style.opacity = '1';
                        jpLabelEl.style.left = `${x}px`;
                        jpLabelEl.style.top = `${y + 12}px`;
                    }
                }
            }
        };

        const mountGlobe = async (question) => {
            const canvasEl = container.querySelector('#globe-canvas');
            if (!canvasEl) return;

            const THREE = await loadThreeJS();
            await loadTopojson();
            const worldData = await fetchWorldData();

            // すでに地球儀が存在する場合はマーカーのみ更新（キャンバス・レンダラーは再利用）
            if (globeScene && document.getElementById('globe-canvas')) {
                placeMarkers(THREE, globeScene.earthMesh, question);
                // 日本へ即スナップ後に対象国へアニメーション
                globeCurrentRotY = -((138.2 + 90) * Math.PI / 180);
                globeCurrentRotX = (36.2 * Math.PI / 180) * 0.25;
                globeTargetRotY = globeCurrentRotY;
                globeTargetRotX = globeCurrentRotX;
                setTimeout(() => setGlobeTarget(question.correct.lat, question.correct.lng), 600);
                return;
            }
            // globeSceneがあってもキャンバスが消えている場合はクリーンアップして再作成
            if (globeScene) cleanupGlobe();

            // 親コンテナの寸法を使う（Three.jsのCSS上書きを避けるため）
            const wrap = canvasEl.parentElement;
            const W = wrap.clientWidth || 392;
            // min-height:160pxをCSSで保証しているのでclientHeightは最低160px
            const H = wrap.clientHeight || 300;

            const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
            // updateStyle=false でThree.jsによるCSS style上書きを防止
            renderer.setSize(W, H, false);
            canvasEl.style.width = '100%';
            canvasEl.style.height = '100%';

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
            camera.position.set(0, 0, 3);

            // 明るい均一照明（地図スタイルは影不要）
            scene.add(new THREE.AmbientLight(0xffffff, 2.5));

            // 地図スタイルのテクスチャを canvas で生成
            const earthGeo = new THREE.SphereGeometry(1, 64, 64);
            const mapCanvas = generateMapTexture(worldData);
            const mapTexture = new THREE.CanvasTexture(mapCanvas);
            const earthMat = new THREE.MeshLambertMaterial({ map: mapTexture });
            const earthMesh = new THREE.Mesh(earthGeo, earthMat);
            scene.add(earthMesh);

            globeScene = { THREE, renderer, scene, camera, earthMesh, animFrameId: null };

            // 日本へ即スナップ
            globeCurrentRotY = -((138.2 + 90) * Math.PI / 180);
            globeCurrentRotX = (36.2 * Math.PI / 180) * 0.25;
            globeTargetRotY = globeCurrentRotY;
            globeTargetRotX = globeCurrentRotX;

            placeMarkers(THREE, earthMesh, question);
            setTimeout(() => setGlobeTarget(question.correct.lat, question.correct.lng), 600);

            // タッチ操作（1本指：回転、2本指：ピンチズーム）
            let lastPinchDist = 0;
            canvasEl.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    lastPinchDist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    globeIsDragging = true;
                } else {
                    globeTouchStartX = e.touches[0].clientX;
                    globeTouchStartY = e.touches[0].clientY;
                    globeIsDragging = false;
                }
            }, { passive: true });
            canvasEl.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2) {
                    // ピンチズーム
                    const dist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    const delta = lastPinchDist - dist;
                    globeScene.camera.position.z = Math.max(1.4, Math.min(5.5, globeScene.camera.position.z + delta * 0.012));
                    lastPinchDist = dist;
                    globeIsDragging = true;
                } else if (e.touches.length === 1) {
                    const dx = e.touches[0].clientX - globeTouchStartX;
                    const dy = e.touches[0].clientY - globeTouchStartY;
                    if (Math.hypot(dx, dy) > 5) globeIsDragging = true;
                    globeTargetRotY += dx * 0.006;
                    globeTargetRotX = Math.max(-0.8, Math.min(0.8, globeTargetRotX + dy * 0.006));
                    globeTouchStartX = e.touches[0].clientX;
                    globeTouchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            // マウスドラッグ
            let mouseDown = false, lastMouseX = 0, lastMouseY = 0;
            canvasEl.addEventListener('mousedown', (e) => {
                mouseDown = true; lastMouseX = e.clientX; lastMouseY = e.clientY;
                globeIsDragging = false;
            });
            canvasEl.addEventListener('mousemove', (e) => {
                if (!mouseDown) return;
                const dx = e.clientX - lastMouseX, dy = e.clientY - lastMouseY;
                if (Math.hypot(dx, dy) > 3) globeIsDragging = true;
                globeTargetRotY += dx * 0.006;
                globeTargetRotX = Math.max(-0.8, Math.min(0.8, globeTargetRotX + dy * 0.006));
                lastMouseX = e.clientX; lastMouseY = e.clientY;
            });
            canvasEl.addEventListener('mouseup', () => { mouseDown = false; });

            // ホイールズーム（PC）
            canvasEl.addEventListener('wheel', (e) => {
                e.preventDefault();
                globeScene.camera.position.z = Math.max(1.4, Math.min(5.5, globeScene.camera.position.z + e.deltaY * 0.004));
            }, { passive: false });

            // クリック/タップ → 答え判定
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            const onInteract = (e) => {
                if (mapAnswered || globeIsDragging) { globeIsDragging = false; return; }
                const pt = e.changedTouches ? e.changedTouches[0] : e;
                const rect = canvasEl.getBoundingClientRect();
                mouse.x =  ((pt.clientX - rect.left) / rect.width)  * 2 - 1;
                mouse.y = -((pt.clientY - rect.top)  / rect.height) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                const hits = raycaster.intersectObjects(globeMarkerMeshes);
                if (hits.length) handleGlobeAnswer(hits[0].object.userData.countryCode);
            };
            canvasEl.addEventListener('click', onInteract);
            canvasEl.addEventListener('touchend', onInteract, { passive: true });

            // アニメーションループ
            const tick = () => {
                globeScene.animFrameId = requestAnimationFrame(tick);
                globeCurrentRotY += (globeTargetRotY - globeCurrentRotY) * 0.05;
                globeCurrentRotX += (globeTargetRotX - globeCurrentRotX) * 0.05;
                earthMesh.rotation.y = globeCurrentRotY;
                earthMesh.rotation.x = globeCurrentRotX;
                // ズームに関わらずマーカーの画面サイズを一定に保つ
                const zoomScale = camera.position.z / 3;
                const t = Date.now() * 0.005;
                globeMarkerMeshes.forEach(m => {
                    if (mapAnswered && m.userData.countryCode === question.correct.code) {
                        m.scale.setScalar(zoomScale * (1 + 0.3 * Math.sin(t)));
                    } else {
                        m.scale.setScalar(zoomScale);
                    }
                });
                earthMesh.children.filter(c => c.userData?.isJapan).forEach(m => m.scale.setScalar(zoomScale));
                updateMarkerLabels(camera);
                renderer.render(scene, camera);
            };
            tick();
        };

        // ちずクイズ 回答処理
        const handleGlobeAnswer = (code) => {
            if (mapAnswered || !globeScene) return;
            mapAnswered = true;
            const isCorrect = code === mapQuestion.correct.code;
            const chosenCountry = mapQuestion.choices.find(c => c.code === code);

            // マーカー色変更（正解=緑、不正解=グレー）
            globeMarkerMeshes.forEach(m => {
                const isCorrectMarker = m.userData.countryCode === mapQuestion.correct.code;
                if (isCorrectMarker) {
                    m.material.color.set(0x22cc66);
                    m.material.emissive.set(0x22cc66);
                    m.material.emissiveIntensity = 0.5;
                } else {
                    m.material.color.set(0xcccccc);
                    m.material.emissive.set(0x000000);
                }
            });

            if (isCorrect) {
                mapScore++;
                system.playSound('correct');
                createParticles();
                setGlobeTarget(mapQuestion.correct.lat, mapQuestion.correct.lng);
            } else {
                system.playSound('wrong');
                // 不正解時は地球儀をその場で止める（globeTargetを現在値に固定）
                globeTargetRotY = globeCurrentRotY;
                globeTargetRotX = globeCurrentRotX;
            }

            // 結果バナー（不正解時は選んだ国名を表示）
            const banner = container.querySelector('#map-answer-banner');
            if (banner) {
                banner.textContent = isCorrect
                    ? '⭕ せいかい！'
                    : `❌ ざんねん！ ${chosenCountry?.name ?? ''} だよ`;
                banner.style.background = isCorrect ? 'rgba(34,204,102,0.92)' : 'rgba(239,68,68,0.92)';
                banner.style.display = 'block';
            }
            const scoreEl = container.querySelector('#map-score-display');
            if (scoreEl) scoreEl.textContent = `⭐ ${mapScore}てん`;

            const advanceQuestion = () => {
                mapQuestionCount++;
                mapAnswered = false;
                if (mapQuestionCount >= totalQuestions) {
                    cleanupGlobe();
                    mapMode = false;
                    showResult = true;
                    score = mapScore;
                    questionCount = totalQuestions;
                    render();
                } else {
                    mapQuestion = generateMapQuestion();
                    const flagImg = container.querySelector('.map-flag-img');
                    if (flagImg) { flagImg.src = getFlagUrl(mapQuestion.correct.code); flagImg.style.display = ''; }
                    const nameEl = container.querySelector('.map-country-name');
                    if (nameEl) nameEl.textContent = mapQuestion.correct.name;
                    const progEl = container.querySelector('.map-progress-text');
                    if (progEl) progEl.textContent = `だい${mapQuestionCount + 1}もん / ${totalQuestions}もん`;
                    const b = container.querySelector('#map-answer-banner');
                    if (b) b.style.display = 'none';
                    const nw = container.querySelector('#map-next-wrap');
                    if (nw) nw.style.display = 'none';
                    mountGlobe(mapQuestion);
                }
            };

            if (isCorrect) {
                setTimeout(advanceQuestion, 2500);
            } else {
                // 2.5秒後: 正解の国へ地球儀を回して「〇〇はここだよ」を表示
                setTimeout(() => {
                    setGlobeTarget(mapQuestion.correct.lat, mapQuestion.correct.lng);
                    const b = container.querySelector('#map-answer-banner');
                    if (b) {
                        b.textContent = `📍 ${mapQuestion.correct.name} はここだよ`;
                        b.style.background = 'rgba(59,130,246,0.92)';
                    }
                    // 手動ボタンで次の問題へ
                    const nextWrap = container.querySelector('#map-next-wrap');
                    if (nextWrap) {
                        nextWrap.style.display = 'block';
                        container.querySelector('#map-next-btn').onclick = () => {
                            nextWrap.style.display = 'none';
                            advanceQuestion();
                        };
                    }
                }, 2500);
            }
        };

        // ちずクイズ モード起動
        const startMapMode = (level) => {
            currentLevel = level;
            mapMode = true;
            mapScore = 0;
            mapQuestionCount = 0;
            mapAnswered = false;
            mapQuestion = generateMapQuestion();
            renderMapMode();
            mountGlobe(mapQuestion);
        };

        // ちずクイズ 画面描画
        const renderMapMode = () => {
            if (!mapQuestion) return;
            container.innerHTML = `
                <style>
                    .map-container {
                        height: 100%;
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                        display: flex;
                        flex-direction: column;
                        position: relative;
                        overflow: hidden;
                    }
                    .map-header {
                        background: rgba(255,255,255,0.95);
                        padding: 10px 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 2px 15px rgba(0,0,0,0.3);
                        flex-shrink: 0;
                    }
                    .map-back-btn {
                        background: none; border: none; font-size: 14px;
                        color: #666; font-weight: bold; cursor: pointer; padding: 4px 8px;
                    }
                    .map-title { font-size: 18px; font-weight: 900; color: #1a1a2e; }
                    .map-score {
                        background: linear-gradient(135deg, #fbbf24, #f59e0b);
                        color: white; padding: 5px 12px; border-radius: 15px;
                        font-weight: bold; font-size: 14px;
                    }
                    .map-question-panel {
                        background: rgba(255,255,255,0.12);
                        backdrop-filter: blur(10px);
                        padding: 8px 14px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        flex-shrink: 0;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                    }
                    .map-flag-img {
                        width: 56px; height: auto;
                        border-radius: 5px; border: 2px solid white;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                        flex-shrink: 0;
                    }
                    .map-question-text {
                        color: white; font-size: 13px; font-weight: bold; line-height: 1.3;
                    }
                    .map-country-name {
                        font-size: 20px; font-weight: 900; color: #fbbf24;
                        display: block; margin-top: 1px;
                    }
                    .map-progress-text {
                        color: rgba(255,255,255,0.7); font-size: 11px; margin-top: 2px;
                    }
                    .map-globe-wrap {
                        flex: 1; display: flex; flex-direction: column;
                        position: relative; min-height: 160px;
                    }
                    .map-answer-banner {
                        display: none;
                        position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
                        background: rgba(34,204,102,0.92); color: white;
                        padding: 10px 24px; border-radius: 30px;
                        font-size: 18px; font-weight: 900; z-index: 10;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                        white-space: nowrap;
                    }
                    .map-legend {
                        background: rgba(0,0,0,0.5); padding: 6px 14px;
                        display: flex; gap: 16px; justify-content: center;
                        font-size: 13px; color: white; font-weight: bold;
                        flex-shrink: 0;
                    }
                    .map-hint {
                        text-align: center; color: rgba(255,255,255,0.6);
                        font-size: 12px; padding: 4px; flex-shrink: 0;
                    }
                </style>
                <div class="map-container">
                    <div class="map-header">
                        <button class="map-back-btn" id="map-back-btn">✕ もどる</button>
                        <span class="map-title">🌍 ちずクイズ</span>
                        <span class="map-score" id="map-score-display">⭐ ${mapScore}てん</span>
                    </div>
                    <div class="map-question-panel">
                        <img src="${getFlagUrl(mapQuestion.correct.code)}" class="map-flag-img"
                            onerror="this.style.display='none'" />
                        <div class="map-question-text">
                            この くには どこ？
                            <span class="map-country-name">${mapQuestion.correct.name}</span>
                            <span class="map-progress-text">だい${mapQuestionCount + 1}もん / ${totalQuestions}もん</span>
                        </div>
                    </div>
                    <div class="map-globe-wrap">
                        <div class="map-answer-banner" id="map-answer-banner"></div>
                        <canvas id="globe-canvas"
                            style="flex:1; width:100%; display:block; touch-action:none; cursor:pointer;"></canvas>
                        <div id="globe-label-container"
                            style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;"></div>
                        <div id="map-next-wrap"
                            style="display:none;position:absolute;bottom:12px;left:50%;transform:translateX(-50%);z-index:20;">
                            <button id="map-next-btn"
                                style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;font-size:15px;font-weight:bold;padding:10px 28px;border:none;border-radius:30px;box-shadow:0 4px 14px rgba(0,0,0,0.35);cursor:pointer;white-space:nowrap;">
                                つぎの もんだいへ →
                            </button>
                        </div>
                    </div>
                    <div class="map-legend">
                        <span style="color:#ff2244">● にほん</span>
                        <span style="color:#ff3300">● こたえを えらんでね</span>
                    </div>
                    <div class="map-hint">ぐるぐるまわして さがそう！</div>
                </div>
            `;
            container.querySelector('#map-back-btn').addEventListener('click', backToLevelSelect);
        };

        // ======= ちずクイズ関連ここまで =======

        // 描画
        const render = () => {
            if (mapMode) { renderMapMode(); return; }
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

                    .level-card {
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                        animation: level-pop 0.4s ease backwards;
                        overflow: hidden;
                    }

                    .level-card:nth-child(1) { animation-delay: 0.05s; }
                    .level-card:nth-child(2) { animation-delay: 0.1s; }
                    .level-card:nth-child(3) { animation-delay: 0.15s; }
                    .level-card:nth-child(4) { animation-delay: 0.2s; }
                    .level-card:nth-child(5) { animation-delay: 0.25s; }

                    .level-card-header {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        padding: 15px 20px;
                    }

                    .level-card-actions {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        border-top: 1px solid #f3f4f6;
                    }

                    .level-study-btn {
                        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                        border: none;
                        padding: 11px 4px;
                        font-size: 13px;
                        font-weight: bold;
                        color: #059669;
                        cursor: pointer;
                        border-right: 1px solid #f3f4f6;
                        transition: opacity 0.15s;
                    }

                    .level-quiz-btn {
                        background: linear-gradient(135deg, #faf5ff, #ede9fe);
                        border: none;
                        padding: 11px 4px;
                        font-size: 13px;
                        font-weight: bold;
                        color: #7c3aed;
                        cursor: pointer;
                        border-right: 1px solid #f3f4f6;
                        transition: opacity 0.15s;
                    }

                    .level-map-btn {
                        background: linear-gradient(135deg, #eff6ff, #dbeafe);
                        border: none;
                        padding: 11px 4px;
                        font-size: 13px;
                        font-weight: bold;
                        color: #1d4ed8;
                        cursor: pointer;
                        transition: opacity 0.15s;
                    }

                    .level-study-btn:active, .level-quiz-btn:active, .level-map-btn:active {
                        opacity: 0.7;
                    }

                    @keyframes study-fade {
                        from { opacity: 0; transform: scale(0.96); }
                        to { opacity: 1; transform: scale(1); }
                    }

                    .study-content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        gap: 18px;
                    }

                    .study-progress {
                        background: rgba(255,255,255,0.93);
                        padding: 7px 22px;
                        border-radius: 20px;
                        font-size: 15px;
                        font-weight: bold;
                        color: #7c3aed;
                    }

                    .study-card {
                        background: white;
                        border-radius: 24px;
                        padding: 25px 20px;
                        box-shadow: 0 15px 50px rgba(0,0,0,0.2);
                        width: 100%;
                        max-width: 320px;
                        text-align: center;
                        animation: study-fade 0.25s ease;
                    }

                    .study-flag {
                        width: min(65vw, 230px);
                        height: auto;
                        border-radius: 8px;
                        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                        border: 3px solid #e5e7eb;
                        margin-bottom: 18px;
                        animation: flag-wave 3s ease-in-out infinite;
                    }

                    .study-country-name {
                        font-size: 30px;
                        font-weight: 900;
                        color: #1f2937;
                        margin-bottom: 6px;
                    }

                    .study-country-ruby {
                        font-size: 18px;
                        color: #7c3aed;
                        font-weight: bold;
                    }

                    .study-nav {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                    }

                    .study-nav-btn {
                        background: white;
                        border: none;
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        font-size: 24px;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                    }

                    .study-nav-btn:disabled {
                        opacity: 0.3;
                        cursor: default;
                    }

                    .study-nav-btn:active:not(:disabled) {
                        transform: scale(0.9);
                    }

                    .study-end-btn {
                        background: linear-gradient(135deg, #7c3aed, #a855f7);
                        color: white;
                        border: none;
                        padding: 13px 35px;
                        border-radius: 30px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        box-shadow: 0 5px 20px rgba(124, 58, 237, 0.35);
                    }

                    .study-end-btn:active {
                        transform: scale(0.95);
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
                        ${showLevelSelect || studyMode ? '<span></span>' : `<span class="flag-score">⭐ ${score}てん</span>`}
                    </div>

                    ${!showLevelSelect && !studyMode ? `
                        <div class="flag-progress">
                            <div class="flag-progress-bar" style="width: ${(questionCount / totalQuestions) * 100}%;"></div>
                        </div>
                    ` : ''}

                    ${showLevelSelect ? `
                        <div class="level-select">
                            <div class="level-select-title">レベルを えらんでね！</div>
                            <div class="level-buttons">
                                ${levels.map((_, i) => `
                                    <div class="level-card">
                                        <div class="level-card-header">
                                            <span class="level-emoji">${levelEmojis[i]}</span>
                                            <div class="level-info">
                                                <div class="level-name">レベル ${i + 1} : ${levelNames[i]}</div>
                                                <div class="level-desc">${levels[i].length}か国</div>
                                            </div>
                                            <span class="level-num" style="background: ${levelColors[i]};">Lv.${i + 1}</span>
                                        </div>
                                        <div class="level-card-actions">
                                            <button class="level-study-btn" data-level="${i}">📖 べんきょう</button>
                                            <button class="level-quiz-btn" data-level="${i}">🎮 クイズ</button>
                                            <button class="level-map-btn" data-level="${i}">🌍 ちず</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : studyMode ? `
                        <div class="study-content">
                            <div class="study-progress">
                                📖 ${studyIndex + 1} / ${levels[currentLevel].length}
                                <span style="margin-left:8px;font-size:12px;color:#a855f7;">${levelEmojis[currentLevel]} ${levelNames[currentLevel]}</span>
                            </div>
                            <div class="study-card">
                                <img
                                    src="${getFlagUrl(levels[currentLevel][studyIndex].code)}"
                                    alt="国旗"
                                    class="study-flag"
                                    onerror="this.style.display='none'"
                                />
                                <div class="study-country-name">${levels[currentLevel][studyIndex].name}</div>
                                <div class="study-country-ruby">${levels[currentLevel][studyIndex].ruby}</div>
                            </div>
                            <div class="study-nav">
                                <button class="study-nav-btn" id="study-prev" ${studyIndex === 0 ? 'disabled' : ''}>◀</button>
                                <button class="study-nav-btn" id="study-next" ${studyIndex === levels[currentLevel].length - 1 ? 'disabled' : ''}>▶</button>
                            </div>
                            <button class="study-end-btn" id="study-end">おわる</button>
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

            container.querySelectorAll('.level-study-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const level = parseInt(btn.dataset.level);
                    startStudyMode(level);
                });
            });

            container.querySelectorAll('.level-quiz-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const level = parseInt(btn.dataset.level);
                    selectLevel(level);
                });
            });

            container.querySelectorAll('.level-map-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const level = parseInt(btn.dataset.level);
                    startMapMode(level);
                });
            });

            container.querySelector('#study-prev')?.addEventListener('click', prevStudyCard);
            container.querySelector('#study-next')?.addEventListener('click', nextStudyCard);
            container.querySelector('#study-end')?.addEventListener('click', backToLevelSelect);

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

        return () => { cleanupGlobe(); };
    }
};
