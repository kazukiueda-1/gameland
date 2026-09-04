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
        const jukugoData1 = [
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
        // 1d. 二字熟語データ (2年生) / 1・2年生の漢字のみで構成 / 全80語
        // ---------------------------------------------------------
        const jukugoData2 = [
            // レベル1: じかん
            {j:"今日", r:"きょう", m:"いま すごしている この ひ"},
            {j:"明日", r:"あした", m:"きょうの つぎの ひ"},
            {j:"毎日", r:"まいにち", m:"どの ひも いつも"},
            {j:"毎朝", r:"まいあさ", m:"どの あさも いつも"},
            {j:"午前", r:"ごぜん", m:"よるの12じから ひるの12じまで"},
            {j:"午後", r:"ごご", m:"ひるの12じから よるの12じまで"},
            {j:"時間", r:"じかん", m:"とけいで はかる ながさ"},
            {j:"曜日", r:"ようび", m:"げつ・か・すい…などの ひの なまえ"},
            {j:"今週", r:"こんしゅう", m:"いま すごしている しゅう"},
            {j:"来週", r:"らいしゅう", m:"こんしゅうの つぎの しゅう"},
            // レベル2: しぜん・てんき
            {j:"星空", r:"ほしぞら", m:"ほしが たくさん みえる そら"},
            {j:"夜空", r:"よぞら", m:"よるの そら"},
            {j:"雨雲", r:"あまぐも", m:"あめを ふらせる くろい くも"},
            {j:"大雪", r:"おおゆき", m:"たくさん ふる ゆき"},
            {j:"台風", r:"たいふう", m:"つよい かぜと あめを つれてくるもの"},
            {j:"北風", r:"きたかぜ", m:"きたから ふく つめたい かぜ"},
            {j:"春風", r:"はるかぜ", m:"はるに ふく あたたかい かぜ"},
            {j:"野原", r:"のはら", m:"くさが はえた ひろい ところ"},
            {j:"山道", r:"やまみち", m:"やまの なかの みち"},
            {j:"日光", r:"にっこう", m:"おひさまの ひかり"},
            // レベル3: ばしょ・ほうがく
            {j:"東西", r:"とうざい", m:"ひがしと にし"},
            {j:"南北", r:"なんぼく", m:"みなみと きた"},
            {j:"東京", r:"とうきょう", m:"にほんの しゅと おおきな まち"},
            {j:"方角", r:"ほうがく", m:"ひがし・にし・みなみ・きた の むき"},
            {j:"近道", r:"ちかみち", m:"はやく つく ちかい みち"},
            {j:"遠足", r:"えんそく", m:"がっこうから みんなで でかける ぎょうじ"},
            {j:"公園", r:"こうえん", m:"みんなで あそべる ひろい ところ"},
            {j:"会社", r:"かいしゃ", m:"おとなが はたらく ところ"},
            {j:"市場", r:"いちば", m:"やさいや さかなを うる ところ"},
            {j:"歩道", r:"ほどう", m:"ひとが あるく ための みち"},
            // レベル4: かぞく・ひと
            {j:"親子", r:"おやこ", m:"おやと こども"},
            {j:"兄弟", r:"きょうだい", m:"おにいさんと おとうと"},
            {j:"姉妹", r:"しまい", m:"おねえさんと いもうと"},
            {j:"親友", r:"しんゆう", m:"とても なかの よい ともだち"},
            {j:"父親", r:"ちちおや", m:"おとうさん"},
            {j:"母親", r:"ははおや", m:"おかあさん"},
            {j:"少年", r:"しょうねん", m:"おとこの こども"},
            {j:"少女", r:"しょうじょ", m:"おんなの こども"},
            {j:"自分", r:"じぶん", m:"わたし じぶん じしん"},
            {j:"一家", r:"いっか", m:"ひとつの かぞく みんな"},
            // レベル5: からだ・きもち
            {j:"元気", r:"げんき", m:"からだも こころも つよく あかるいこと"},
            {j:"体力", r:"たいりょく", m:"からだの つよさ ちから"},
            {j:"手首", r:"てくび", m:"てと うでの あいだの ほそいところ"},
            {j:"大声", r:"おおごえ", m:"おおきな こえ"},
            {j:"小声", r:"こごえ", m:"ちいさな こえ"},
            {j:"音楽", r:"おんがく", m:"うたや がっきの おと"},
            {j:"気分", r:"きぶん", m:"そのときの こころの ようす"},
            {j:"先頭", r:"せんとう", m:"いちばん まえ"},
            {j:"顔色", r:"かおいろ", m:"かおの いろ げんきかどうか わかる"},
            {j:"中心", r:"ちゅうしん", m:"まんなかの ところ"},
            // レベル6: がっこう・べんきょう
            {j:"教室", r:"きょうしつ", m:"べんきょうを する へや"},
            {j:"国語", r:"こくご", m:"ことばや ぶんしょうの べんきょう"},
            {j:"算数", r:"さんすう", m:"かずや けいさんの べんきょう"},
            {j:"理科", r:"りか", m:"しぜんや いきものの べんきょう"},
            {j:"図工", r:"ずこう", m:"えを かいたり ものを つくる べんきょう"},
            {j:"生活", r:"せいかつ", m:"まいにちの くらし"},
            {j:"読書", r:"どくしょ", m:"ほんを よむこと"},
            {j:"作文", r:"さくぶん", m:"じぶんで ぶんしょうを かくこと"},
            {j:"日記", r:"にっき", m:"そのひの できごとを かくもの"},
            {j:"計算", r:"けいさん", m:"たしざんや ひきざんを すること"},
            // レベル7: たべもの・どうぶつ
            {j:"牛肉", r:"ぎゅうにく", m:"うしの おにく"},
            {j:"麦茶", r:"むぎちゃ", m:"むぎで つくった おちゃ"},
            {j:"白米", r:"はくまい", m:"しろく した おこめ ごはん"},
            {j:"朝食", r:"ちょうしょく", m:"あさごはん"},
            {j:"昼食", r:"ちゅうしょく", m:"ひるごはん"},
            {j:"夕食", r:"ゆうしょく", m:"ばんごはん"},
            {j:"金魚", r:"きんぎょ", m:"あかくて きれいな かいやすい さかな"},
            {j:"小鳥", r:"ことり", m:"ちいさな とり"},
            {j:"白鳥", r:"はくちょう", m:"しろくて おおきな とり"},
            {j:"子馬", r:"こうま", m:"うまの こども"},
            // レベル8: のりもの・どうぐ・そのほか
            {j:"電車", r:"でんしゃ", m:"せんろを はしる のりもの"},
            {j:"汽車", r:"きしゃ", m:"けむりを だして はしる むかしの でんしゃ"},
            {j:"電話", r:"でんわ", m:"とおくの ひとと はなす どうぐ"},
            {j:"風船", r:"ふうせん", m:"くうきを いれて ふくらます おもちゃ"},
            {j:"新聞", r:"しんぶん", m:"まいにちの ニュースが のっている かみ"},
            {j:"絵本", r:"えほん", m:"えが たくさん ある ほん"},
            {j:"工作", r:"こうさく", m:"かみや きで ものを つくること"},
            {j:"交通", r:"こうつう", m:"くるまや でんしゃの ゆきき"},
            {j:"売店", r:"ばいてん", m:"おかしなどを うる ちいさな おみせ"},
            {j:"半分", r:"はんぶん", m:"ふたつに わけた かたほう"}
        ];

        // ---------------------------------------------------------
        // 1c. 小学2年生の漢字 160字
        // ---------------------------------------------------------
        const kanjiData2 = [
            // レベル1: 方角・よく使う言葉
            {k:"東", r:"ひがし"}, {k:"西", r:"にし"}, {k:"南", r:"みなみ"}, {k:"北", r:"きた"},
            {k:"今", r:"いま"}, {k:"来", r:"く", o:"る"}, {k:"明", r:"あか", o:"るい"}, {k:"毎", r:"まい"},
            {k:"何", r:"なに"}, {k:"曜", r:"よう"},
            // レベル2: 時間・季節
            {k:"朝", r:"あさ"}, {k:"昼", r:"ひる"}, {k:"夜", r:"よる"}, {k:"春", r:"はる"},
            {k:"夏", r:"なつ"}, {k:"秋", r:"あき"}, {k:"冬", r:"ふゆ"}, {k:"週", r:"しゅう"},
            {k:"午", r:"ご"}, {k:"後", r:"あと"},
            // レベル3: かぞく・ひと
            {k:"父", r:"ちち"}, {k:"母", r:"はは"}, {k:"兄", r:"あに"}, {k:"姉", r:"あね"},
            {k:"弟", r:"おとうと"}, {k:"妹", r:"いもうと"}, {k:"友", r:"とも"}, {k:"親", r:"おや"},
            {k:"家", r:"いえ"}, {k:"話", r:"はな", o:"す"},
            // レベル4: がっこう・べんきょう
            {k:"教", r:"おし", o:"える"}, {k:"室", r:"しつ"}, {k:"書", r:"か", o:"く"}, {k:"読", r:"よ", o:"む"},
            {k:"語", r:"ご"}, {k:"言", r:"い", o:"う"}, {k:"答", r:"こた", o:"える"}, {k:"算", r:"さん"},
            {k:"数", r:"かず"}, {k:"図", r:"ず"},
            // レベル5: しぜん
            {k:"海", r:"うみ"}, {k:"池", r:"いけ"}, {k:"雲", r:"くも"}, {k:"雪", r:"ゆき"},
            {k:"星", r:"ほし"}, {k:"風", r:"かぜ"}, {k:"岩", r:"いわ"}, {k:"原", r:"はら"},
            {k:"野", r:"の"}, {k:"里", r:"さと"},
            // レベル6: どうぶつ・いきもの
            {k:"馬", r:"うま"}, {k:"牛", r:"うし"}, {k:"鳥", r:"とり"}, {k:"魚", r:"さかな"},
            {k:"羽", r:"はね"}, {k:"毛", r:"け"}, {k:"鳴", r:"な", o:"く"}, {k:"声", r:"こえ"},
            {k:"走", r:"はし", o:"る"}, {k:"歩", r:"ある", o:"く"},
            // レベル7: 食・買い物
            {k:"肉", r:"にく"}, {k:"米", r:"こめ"}, {k:"麦", r:"むぎ"}, {k:"茶", r:"ちゃ"},
            {k:"食", r:"た", o:"べる"}, {k:"買", r:"か", o:"う"}, {k:"売", r:"う", o:"る"}, {k:"店", r:"みせ"},
            {k:"会", r:"かい"}, {k:"合", r:"あ", o:"う"},
            // レベル8: 様子・形容詞
            {k:"高", r:"たか", o:"い"}, {k:"広", r:"ひろ", o:"い"}, {k:"強", r:"つよ", o:"い"}, {k:"弱", r:"よわ", o:"い"},
            {k:"長", r:"なが", o:"い"}, {k:"細", r:"ほそ", o:"い"}, {k:"太", r:"ふと", o:"い"}, {k:"丸", r:"まる", o:"い"},
            {k:"多", r:"おお", o:"い"}, {k:"少", r:"すく", o:"ない"},
            // レベル9: 場所・方向
            {k:"国", r:"くに"}, {k:"地", r:"ち"}, {k:"場", r:"ば"}, {k:"道", r:"みち"},
            {k:"近", r:"ちか", o:"い"}, {k:"遠", r:"とお", o:"い"}, {k:"社", r:"しゃ"}, {k:"寺", r:"てら"},
            {k:"園", r:"えん"}, {k:"谷", r:"たに"},
            // レベル10: 色・形・様子
            {k:"色", r:"いろ"}, {k:"形", r:"かたち"}, {k:"黄", r:"き"}, {k:"黒", r:"くろ"},
            {k:"絵", r:"え"}, {k:"画", r:"が"}, {k:"新", r:"あたら", o:"しい"}, {k:"古", r:"ふる", o:"い"},
            {k:"元", r:"もと"}, {k:"直", r:"なお", o:"す"},
            // レベル11: 行動1
            {k:"帰", r:"かえ", o:"る"}, {k:"通", r:"とお", o:"る"}, {k:"止", r:"と", o:"まる"}, {k:"切", r:"き", o:"る"},
            {k:"引", r:"ひ", o:"く"}, {k:"活", r:"かつ"}, {k:"用", r:"よう"}, {k:"回", r:"まわ", o:"る"},
            {k:"考", r:"かんが", o:"える"}, {k:"思", r:"おも", o:"う"},
            // レベル12: 行動2
            {k:"知", r:"し", o:"る"}, {k:"聞", r:"き", o:"く"}, {k:"記", r:"き"}, {k:"行", r:"い", o:"く"},
            {k:"公", r:"こう"}, {k:"光", r:"ひかり"}, {k:"交", r:"まじ", o:"わる"}, {k:"計", r:"はか", o:"る"},
            {k:"作", r:"つく", o:"る"}, {k:"組", r:"く", o:"む"},
            // レベル13: 乗り物・道具
            {k:"船", r:"ふね"}, {k:"線", r:"せん"}, {k:"電", r:"でん"}, {k:"汽", r:"きしゃ"},
            {k:"刀", r:"かたな"}, {k:"弓", r:"ゆみ"}, {k:"矢", r:"や"}, {k:"工", r:"こうさく"},
            {k:"台", r:"だい"}, {k:"門", r:"もん"},
            // レベル14: 体・気持ち
            {k:"体", r:"からだ"}, {k:"頭", r:"あたま"}, {k:"顔", r:"かお"}, {k:"首", r:"くび"},
            {k:"心", r:"こころ"}, {k:"楽", r:"たの", o:"しい"}, {k:"晴", r:"は", o:"れる"}, {k:"同", r:"おな", o:"じ"},
            {k:"当", r:"あ", o:"たる"}, {k:"理", r:"り"},
            // レベル15: 数・量・位置
            {k:"万", r:"まん"}, {k:"半", r:"はん"}, {k:"番", r:"ばん"}, {k:"分", r:"ふん"},
            {k:"才", r:"さい"}, {k:"方", r:"かた"}, {k:"点", r:"てん"}, {k:"前", r:"まえ"},
            {k:"内", r:"うち"}, {k:"外", r:"そと"},
            // レベル16: そのほか
            {k:"科", r:"か"}, {k:"歌", r:"うた"}, {k:"角", r:"かど"}, {k:"間", r:"あいだ"},
            {k:"京", r:"きょう"}, {k:"戸", r:"と"}, {k:"市", r:"し"}, {k:"紙", r:"かみ"},
            {k:"自", r:"じ"}, {k:"時", r:"とき"},
        ];

        // ---------------------------------------------------------
        // 2. 状態管理
        // ---------------------------------------------------------
        const QUESTIONS_PER_LEVEL = 10;

        const getKanjiData = () => grade === '1' ? kanjiData : kanjiData2;
        const getJukugoData = () => grade === '1' ? jukugoData1 : jukugoData2;
        const getNumLevels = () => Math.ceil(getKanjiData().length / QUESTIONS_PER_LEVEL);
        const getNumJukugoLevels = () => Math.ceil(getJukugoData().length / QUESTIONS_PER_LEVEL);

        let currentLevel = 0;
        let grade = '1'; // '1' or '2'
        let category = 'kanji'; // 'kanji' | 'jukugo' | 'write'
        let quizMode = 'reading'; // 'reading' | 'kanji' | 'jukugo' | 'trace' | 'write'
        let jukugoInputMode = 'choice'; // 'choice'(せんたくしあり) | 'input'(せんたくしなし)
        let quizQuestions = [];
        let quizIndex = 0;
        let score = 0;
        let hasMistaken = false;

        // かきとり用の状態
        let strokeLib = null;    // 筆順データ (遅延読み込み)
        let writeQuestions = []; // かきとりの出題リスト
        let writeIndex = 0;
        let padStrokes = [];     // 書いた線 (0〜1 に正規化した座標)
        let padRelayout = null;  // { el, fn } 画面リサイズ時にキャンバスを描き直す

        // 画面サイズが変わったらキャンバスを作り直す
        const onResize = () => {
            if (padRelayout && container.contains(padRelayout.el)) padRelayout.fn();
            else padRelayout = null;
        };
        window.addEventListener('resize', onResize);

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
            const pool = getKanjiData();
            const hasOku = !!q.o;
            const usedReadings = new Set([q.r]);
            const distractors = [];

            if (hasOku) {
                let cands = shuffle(pool.filter(k => k.o === q.o && k.r !== q.r));
                for (const c of cands) {
                    if (!usedReadings.has(c.r)) {
                        distractors.push({...c});
                        usedReadings.add(c.r);
                        if (distractors.length >= 3) break;
                    }
                }
                if (distractors.length < 3) {
                    cands = shuffle(pool.filter(k => k.k !== q.k && !usedReadings.has(k.r)));
                    for (const c of cands) {
                        if (!usedReadings.has(c.r)) {
                            distractors.push({...c, o: q.o});
                            usedReadings.add(c.r);
                            if (distractors.length >= 3) break;
                        }
                    }
                }
            } else {
                let cands = shuffle(pool.filter(k => !k.o && k.r !== q.r));
                for (const c of cands) {
                    if (!usedReadings.has(c.r)) {
                        distractors.push({...c});
                        usedReadings.add(c.r);
                        if (distractors.length >= 3) break;
                    }
                }
                if (distractors.length < 3) {
                    cands = shuffle(pool.filter(k => k.o && !usedReadings.has(k.r)));
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
            const pool = getKanjiData();
            const hasOku = !!q.o;
            const usedKanji = new Set([q.k]);
            const distractors = [];

            if (hasOku) {
                let cands = shuffle(pool.filter(k => k.o === q.o && k.k !== q.k));
                for (const c of cands) {
                    if (!usedKanji.has(c.k)) {
                        distractors.push({...c});
                        usedKanji.add(c.k);
                        if (distractors.length >= 3) break;
                    }
                }
                if (distractors.length < 3) {
                    cands = shuffle(pool.filter(k => !usedKanji.has(k.k)));
                    for (const c of cands) {
                        if (!usedKanji.has(c.k)) {
                            distractors.push({...c, o: q.o});
                            usedKanji.add(c.k);
                            if (distractors.length >= 3) break;
                        }
                    }
                }
            } else {
                let cands = shuffle(pool.filter(k => !k.o && k.k !== q.k));
                for (const c of cands) {
                    if (!usedKanji.has(c.k)) {
                        distractors.push({...c});
                        usedKanji.add(c.k);
                        if (distractors.length >= 3) break;
                    }
                }
                if (distractors.length < 3) {
                    cands = shuffle(pool.filter(k => k.o && !usedKanji.has(k.k)));
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
            const cands = shuffle(getJukugoData().filter(j => j.r !== q.r));
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
            padRelayout = null;
            const isJukugo = category === 'jukugo';
            const isWrite = category === 'write';
            const numLevels = isJukugo ? getNumJukugoLevels() : getNumLevels();
            const btnColor = isJukugo ? 'bg-pink-400 hover:bg-pink-500'
                : isWrite ? 'bg-teal-400 hover:bg-teal-500'
                : (grade === '2' ? 'bg-blue-400 hover:bg-blue-500' : 'bg-orange-400 hover:bg-orange-500');
            const activeGradeCls = isJukugo ? 'bg-pink-400' : isWrite ? 'bg-teal-400' : 'bg-orange-400';

            let buttonsHtml = '';
            for (let i = 0; i < numLevels; i++) {
                buttonsHtml += `
                    <button class="level-btn ${btnColor} text-white font-bold py-2 md:py-3 rounded-xl shadow-md active:scale-95 transition text-base md:text-lg" data-level="${i}">
                        レベル ${i + 1}
                    </button>
                `;
            }

            const gradeCls = (g) => grade === g ? `${activeGradeCls} text-white shadow` : 'bg-gray-200 text-gray-400';
            const catCls = (c, color) => category === c ? `${color} text-white shadow` : 'bg-gray-200 text-gray-400';

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-3">
                    <button id="btn-quit-app" class="absolute top-2 left-2 bg-gray-100 text-gray-500 font-bold py-1 px-2 rounded-full text-xs">✕ やめる</button>

                    <h2 class="text-xl md:text-2xl font-black text-blue-500 mb-1 text-center">かんじマスター</h2>

                    <div class="flex gap-2 mb-2">
                        <button class="cat-tab px-4 py-1.5 rounded-full font-bold text-sm transition ${catCls('kanji', 'bg-orange-400')}" data-cat="kanji">
                            かんじ
                        </button>
                        <button class="cat-tab px-4 py-1.5 rounded-full font-bold text-sm transition ${catCls('jukugo', 'bg-pink-400')}" data-cat="jukugo">
                            じゅくご
                        </button>
                        <button class="cat-tab px-4 py-1.5 rounded-full font-bold text-sm transition ${catCls('write', 'bg-teal-400')}" data-cat="write">
                            かきとり
                        </button>
                    </div>

                    <div class="flex gap-2 mb-2">
                        <button class="grade-tab px-3 py-1 rounded-full font-bold text-sm transition ${gradeCls('1')}" data-grade="1">
                            1ねんせい
                        </button>
                        <button class="grade-tab px-3 py-1 rounded-full font-bold text-sm transition ${gradeCls('2')}" data-grade="2">
                            2ねんせい
                        </button>
                    </div>

                    <p class="text-gray-500 font-bold mb-3 text-xs">どの レベル に チャレンジ する？</p>

                    <div class="w-full max-w-2xl overflow-y-auto min-h-0">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pb-2">
                            ${buttonsHtml}
                        </div>
                    </div>
                </div>
            `;

            container.querySelector('#btn-quit-app').onclick = () => system.goHome();
            container.querySelectorAll('.cat-tab').forEach(btn => {
                btn.onclick = () => {
                    category = btn.dataset.cat;
                    currentLevel = 0;
                    renderLevelSelect();
                };
            });
            container.querySelectorAll('.grade-tab').forEach(btn => {
                btn.onclick = () => {
                    grade = btn.dataset.grade;
                    currentLevel = 0;
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
            padRelayout = null;
            const isJukugo = category === 'jukugo';
            const isWrite = category === 'write';
            const titleColor = isJukugo ? 'text-pink-400' : isWrite ? 'text-teal-500' : 'text-orange-400';

            const jmodeCls = (m) => jukugoInputMode === m
                ? 'bg-pink-400 text-white shadow'
                : 'bg-white text-gray-400 border border-gray-200';

            const buttonsHtml = isJukugo ? `
                <button id="btn-study" class="bg-green-400 hover:bg-green-500 text-white text-lg md:text-xl font-bold py-3 md:py-4 px-5 rounded-xl shadow-lg active:scale-95 transition">
                    📖 べんきょう
                </button>
                <div class="bg-pink-50 border-2 border-pink-200 rounded-xl p-2.5">
                    <p class="text-center text-xs font-bold text-gray-500 mb-1.5">こたえかた を えらぶ</p>
                    <div class="flex gap-2 justify-center mb-2">
                        <button class="jmode-tab px-3 py-1.5 rounded-full font-bold text-sm transition ${jmodeCls('choice')}" data-jmode="choice">
                            せんたくし あり
                        </button>
                        <button class="jmode-tab px-3 py-1.5 rounded-full font-bold text-sm transition ${jmodeCls('input')}" data-jmode="input">
                            せんたくし なし
                        </button>
                    </div>
                    <button id="btn-jukugo-quiz" class="w-full bg-pink-400 hover:bg-pink-500 text-white text-lg md:text-xl font-bold py-3 rounded-xl shadow-lg active:scale-95 transition">
                        📚 じゅくごクイズ
                    </button>
                    <p class="text-center text-xs text-gray-400 font-bold mt-1.5">
                        ${jukugoInputMode === 'choice' ? '4つ の なかから えらぶよ' : 'ひらがなキーボード で よみ を うつよ'}
                    </p>
                </div>
            ` : isWrite ? `
                <button id="btn-trace" class="bg-teal-400 hover:bg-teal-500 text-white text-lg md:text-xl font-bold py-3 md:py-4 px-5 rounded-xl shadow-lg active:scale-95 transition">
                    📖 なぞりれんしゅう
                </button>
                <button id="btn-write-quiz" class="bg-amber-400 hover:bg-amber-500 text-white text-lg md:text-xl font-bold py-3 md:py-4 px-5 rounded-xl shadow-lg active:scale-95 transition">
                    ✏️ かきとりクイズ
                </button>
                <p class="text-center text-xs text-gray-400 font-bold">ゆび か タッチペン で かこう</p>
                <p class="text-center text-xs text-gray-300">ひつじゅんデータ: KanjiVG (CC BY-SA 3.0)</p>
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
                    <h2 class="text-xl md:text-2xl font-black ${titleColor} mb-1">${grade}ねんせい レベル ${currentLevel + 1}</h2>
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
                container.querySelectorAll('.jmode-tab').forEach(btn => {
                    btn.onclick = () => {
                        jukugoInputMode = btn.dataset.jmode;
                        renderModeSelect();
                    };
                });
                container.querySelector('#btn-jukugo-quiz').onclick = () => { quizMode = 'jukugo'; startJukugoQuiz(); };
            } else if (isWrite) {
                container.querySelector('#btn-trace').onclick = () => startTrace();
                container.querySelector('#btn-write-quiz').onclick = () => startWriteQuiz();
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
            const targetKanji = getKanjiData().slice(start, end);

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
            const end = Math.min(start + QUESTIONS_PER_LEVEL, getJukugoData().length);
            const targetJukugo = getJukugoData().slice(start, end);

            const cardsHtml = targetJukugo.map(item => `
                <div class="bg-white border-4 border-pink-200 rounded-3xl p-3 flex flex-col items-center justify-center aspect-square shadow-sm">
                    <div class="text-5xl md:text-6xl font-black text-gray-800 mb-1 tracking-wider">${item.j}</div>
                    <div class="inline-block bg-pink-100 text-pink-700 border border-pink-200 px-2 py-0.5 rounded-lg font-bold mb-1 whitespace-nowrap ${item.r.length >= 6 ? 'text-sm md:text-base' : item.r.length >= 5 ? 'text-base md:text-lg' : 'text-lg md:text-xl'}">
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

        // =========================================================
        //  かきとり (なぞりれんしゅう / かきとりクイズ)
        //  筆順データ: KanjiVG (CC BY-SA 3.0)
        // =========================================================

        // 筆順データの遅延読み込み (170KB あるので かきとり を開いたときだけ読む)
        const loadStrokes = async () => {
            if (!strokeLib) strokeLib = await import('./kanji_strokes.js');
            return strokeLib;
        };

        const loadingHtml = `
            <div class="h-full flex flex-col items-center justify-center gap-2 text-gray-400 font-bold">
                <div class="text-5xl animate-bounce">✏️</div>
                <div>じゅんび ちゅう...</div>
            </div>`;

        // --- お手本(筆順データ)を1画ずつ線で描く ---
        const drawGuide = (ctx, char, size, opt = {}) => {
            const data = strokeLib && strokeLib.STROKES[char];
            if (!data) {
                // 筆順データが無い場合はフォントで代用
                ctx.save();
                ctx.fillStyle = opt.color || '#d4d4d8';
                ctx.font = `${Math.round(size * 0.85)}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(char, size / 2, size * 0.54);
                ctx.restore();
                return false;
            }
            const s = size / strokeLib.VIEW;
            ctx.save();
            ctx.scale(s, s);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = opt.color || '#d4d4d8';
            ctx.lineWidth = (opt.width || size * 0.075) / s;
            if (opt.alpha != null) ctx.globalAlpha = opt.alpha;
            data.d.forEach(d => ctx.stroke(new Path2D(d)));
            ctx.restore();

            if (opt.numbers) {
                ctx.save();
                ctx.font = `bold ${Math.round(size * 0.09)}px sans-serif`;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.lineWidth = Math.max(2, size * 0.022);
                ctx.lineJoin = 'round';
                ctx.strokeStyle = '#ffffff';
                ctx.fillStyle = opt.numberColor || '#0ea5e9';
                data.n.forEach((p, i) => {
                    const x = p[0] * s, y = p[1] * s;
                    ctx.strokeText(String(i + 1), x, y);
                    ctx.fillText(String(i + 1), x, y);
                });
                ctx.restore();
            }
            return true;
        };

        // --- 田の字の補助線 ---
        const drawGrid = (ctx, size) => {
            ctx.save();
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([size * 0.035, size * 0.035]);
            ctx.beginPath();
            ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size);
            ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2);
            ctx.stroke();
            ctx.restore();
        };

        // --- 子どもが書いた線を描く (座標は 0〜1 に正規化して保持) ---
        const drawUserStrokes = (ctx, strokes, size, width, color) => {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            strokes.forEach(st => {
                if (!st.length) return;
                ctx.beginPath();
                ctx.moveTo(st[0].x * size, st[0].y * size);
                if (st.length === 1) ctx.lineTo(st[0].x * size + 0.1, st[0].y * size);
                else for (let i = 1; i < st.length; i++) ctx.lineTo(st[i].x * size, st[i].y * size);
                ctx.stroke();
            });
            ctx.restore();
        };

        // --- なぞりの採点 ---
        //   なぞれた率 : お手本の線のうち、なぞれた割合
        //   はみだし率 : 書いた線のうち、お手本から外れた割合
        const scoreTrace = (char) => {
            if (!padStrokes.length) return 0;
            const S = 180;
            const mask = (drawFn) => {
                const c = document.createElement('canvas');
                c.width = c.height = S;
                const x = c.getContext('2d');
                drawFn(x);
                return x.getImageData(0, 0, S, S).data;
            };
            const core = mask(x => drawGuide(x, char, S, { color: '#000', width: S * 0.075 }));
            const tol  = mask(x => drawGuide(x, char, S, { color: '#000', width: S * 0.24 }));
            const ink  = mask(x => drawUserStrokes(x, padStrokes, S, S * 0.075, '#000'));
            const fat  = mask(x => drawUserStrokes(x, padStrokes, S, S * 0.24, '#000'));

            let coreN = 0, coreHit = 0, inkN = 0, inkOut = 0;
            for (let i = 3; i < core.length; i += 4) {
                if (core[i] > 100) { coreN++; if (fat[i] > 100) coreHit++; }
                if (ink[i]  > 100) { inkN++;  if (tol[i] <= 100) inkOut++; }
            }
            if (!coreN || !inkN) return 0;
            const coverage = coreHit / coreN;
            const overflow = inkOut / inkN;
            return Math.max(0, Math.min(100, Math.round(coverage * 100 - overflow * 60)));
        };

        // --- キャンバスと枠を、使える場所いっぱいの正方形にして描き直す ---
        //   area   : 場所を決める外側の箱 (flex で中央ぞろえ)
        //   box    : わく (border) を持つ箱
        //   canvas : 実際に描くところ
        //   reserve: area の中で キャンバス以外に使う高さ (よみの表示など)
        const mountCanvas = (area, box, canvas, draw, reserve = 0) => {
            const apply = () => {
                const avail = Math.min(area.clientWidth, area.clientHeight - reserve);
                const size = Math.max(110, Math.floor(avail) - 10);
                box.style.width = (size + 8) + 'px';
                box.style.height = (size + 8) + 'px';
                canvas.style.width = size + 'px';
                canvas.style.height = size + 'px';
                const dpr = window.devicePixelRatio || 1;
                canvas.width = Math.round(size * dpr);
                canvas.height = Math.round(size * dpr);
                const ctx = canvas.getContext('2d');
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                ctx.clearRect(0, 0, size, size);
                draw(ctx, size);
            };
            apply();                       // まず今すぐ描く
            requestAnimationFrame(apply);  // レイアウト確定後にもう一度
            return apply;
        };

        // --- 指/ペンで書けるようにする ---
        const setupPad = (canvas, redraw) => {
            canvas.style.touchAction = 'none';
            let cur = null;
            const clamp = v => Math.max(0, Math.min(1, v));
            const pos = (e) => {
                const r = canvas.getBoundingClientRect();
                return { x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) };
            };
            canvas.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
                cur = [pos(e)];
                padStrokes.push(cur);
                redraw();
            });
            canvas.addEventListener('pointermove', (e) => {
                if (!cur) return;
                e.preventDefault();
                cur.push(pos(e));
                redraw();
            });
            const end = () => { cur = null; };
            canvas.addEventListener('pointerup', end);
            canvas.addEventListener('pointercancel', end);
        };

        // ★ なぞりれんしゅう 開始
        const startTrace = async () => {
            container.innerHTML = loadingHtml;
            await loadStrokes();
            const start = currentLevel * QUESTIONS_PER_LEVEL;
            writeQuestions = getKanjiData().slice(start, start + QUESTIONS_PER_LEVEL);
            writeIndex = 0;
            score = 0;
            quizMode = 'trace';
            renderTraceStep();
        };

        // ★ なぞりれんしゅう 1文字ぶん
        const renderTraceStep = () => {
            if (writeIndex >= writeQuestions.length) { renderResult(); return; }
            const item = writeQuestions[writeIndex];
            padStrokes = [];

            container.innerHTML = `
                <div class="h-full flex flex-col p-2 md:p-3">
                    <div class="flex justify-between items-center mb-1">
                        <button id="btn-quit-write" class="bg-gray-100 text-gray-400 font-bold py-1.5 px-3 rounded-full text-sm">やめる</button>
                        <div class="bg-teal-100 text-teal-600 px-3 py-1 rounded-full font-bold text-sm">
                            ${writeIndex + 1} / ${writeQuestions.length}
                        </div>
                        <div class="font-bold text-orange-400 text-sm">てんすう: ${score}</div>
                    </div>

                    <div class="flex-1 flex gap-2 min-h-0 relative">
                        <!-- おてほん -->
                        <div class="w-[30%] max-w-[200px] flex flex-col min-h-0">
                            <div class="text-center text-xs font-bold text-gray-400 mb-1">おてほん</div>
                            <div id="model-area" class="flex-1 flex items-center justify-center min-h-0">
                                <div class="flex flex-col items-center gap-1">
                                    <div id="model-box" class="bg-white border-4 border-teal-200 rounded-2xl overflow-hidden">
                                        <canvas id="model-canvas" class="block"></canvas>
                                    </div>
                                    <div class="text-center flex items-baseline justify-center gap-0.5 flex-wrap">
                                        ${readingHtml(item,
                                            'inline-block bg-sky-100 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded font-bold text-sm',
                                            'inline-block bg-orange-100 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded font-bold text-sm',
                                            'text-sm font-bold text-gray-500'
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- なぞりマス -->
                        <div class="flex-1 flex flex-col min-w-0 min-h-0">
                            <div class="text-center text-xs font-bold text-gray-400 mb-1">ばんごうの じゅんに なぞろう</div>
                            <div id="pad-area" class="flex-1 flex items-center justify-center min-h-0">
                                <div id="pad-box" class="bg-white border-4 border-orange-200 rounded-2xl overflow-hidden">
                                    <canvas id="pad-canvas" class="block"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- けっか オーバーレイ -->
                        <div id="trace-overlay" class="absolute inset-0 bg-white/95 rounded-2xl z-50 hidden flex-col items-center justify-center animate-pop">
                            <div id="tr-mark" class="text-8xl font-black"></div>
                            <div id="tr-text" class="text-lg font-bold text-gray-600 mb-3"></div>
                            <div class="flex gap-2">
                                <button id="tr-retry" class="bg-gray-200 text-gray-600 font-bold py-2 px-5 rounded-full text-sm">もういちど</button>
                                <button id="tr-next" class="bg-teal-400 text-white font-bold py-2 px-6 rounded-full text-sm">つぎへ ▶</button>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-2 mt-2">
                        <button id="btn-clear" class="bg-gray-200 text-gray-600 font-bold py-3 px-5 rounded-xl text-base">けす</button>
                        <button id="btn-done" class="flex-1 bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 rounded-xl text-lg shadow-md active:scale-95 transition">できた！</button>
                    </div>
                </div>
            `;

            const modelCanvas = container.querySelector('#model-canvas');
            mountCanvas(container.querySelector('#model-area'), container.querySelector('#model-box'), modelCanvas, (ctx, size) => {
                drawGrid(ctx, size);
                drawGuide(ctx, item.k, size, { color: '#334155', width: size * 0.08, numbers: true });
            }, 32);

            const padCanvas = container.querySelector('#pad-canvas');
            const drawPad = (ctx, size) => {
                ctx.clearRect(0, 0, size, size);
                drawGrid(ctx, size);
                drawGuide(ctx, item.k, size, { color: '#e5e7eb', width: size * 0.085, numbers: true, numberColor: '#93c5fd' });
                drawUserStrokes(ctx, padStrokes, size, size * 0.075, '#1f2937');
            };
            const relayout = mountCanvas(container.querySelector('#pad-area'), container.querySelector('#pad-box'), padCanvas, drawPad);
            padRelayout = { el: padCanvas, fn: relayout };
            setupPad(padCanvas, () => {
                drawPad(padCanvas.getContext('2d'), parseFloat(padCanvas.style.width));
            });

            container.querySelector('#btn-quit-write').onclick = renderModeSelect;
            container.querySelector('#btn-clear').onclick = () => {
                padStrokes = [];
                drawPad(padCanvas.getContext('2d'), parseFloat(padCanvas.style.width));
            };
            container.querySelector('#btn-done').onclick = () => judgeTrace(item);
        };

        // ★ なぞりの答え合わせ
        const judgeTrace = (item) => {
            const overlay = container.querySelector('#trace-overlay');
            if (!overlay || overlay.style.display === 'flex') return;

            const s = scoreTrace(item.k);
            const mark = container.querySelector('#tr-mark');
            const text = container.querySelector('#tr-text');
            const btnRetry = container.querySelector('#tr-retry');
            const btnNext = container.querySelector('#tr-next');
            overlay.style.display = 'flex';

            let gained = 0;
            if (s >= 70) {
                mark.textContent = '◎';
                mark.className = 'text-8xl font-black text-red-500';
                text.textContent = `はなまる！  ${s}てん`;
                gained = 10;
                system.playSound('correct');
            } else if (s >= 45) {
                mark.textContent = '○';
                mark.className = 'text-8xl font-black text-orange-400';
                text.textContent = `いいかんじ！  ${s}てん`;
                gained = 5;
                system.playSound('correct');
            } else {
                mark.textContent = '△';
                mark.className = 'text-8xl font-black text-blue-400';
                text.textContent = `うすい じ を なぞってみよう  ${s}てん`;
                system.playSound('wrong');
            }
            score += gained;

            if (system.logQuizResult) {
                system.logQuizResult('かんじマスター', item.k, s >= 70, {
                    reading: fullR(item), level: currentLevel + 1, mode: 'trace', traceScore: s
                });
            }

            btnRetry.onclick = () => { renderTraceStep(); };
            btnNext.onclick = () => { writeIndex++; renderTraceStep(); };
            if (s >= 45) setTimeout(() => { if (container.contains(btnNext)) btnNext.click(); }, 1300);
        };

        // ★ かきとりクイズ 開始
        const startWriteQuiz = async () => {
            container.innerHTML = loadingHtml;
            await loadStrokes();
            const start = currentLevel * QUESTIONS_PER_LEVEL;
            writeQuestions = shuffle(getKanjiData().slice(start, start + QUESTIONS_PER_LEVEL));
            writeIndex = 0;
            score = 0;
            quizMode = 'write';
            renderWriteQuizStep();
        };

        // ★ かきとりクイズ (よみだけ見て、なにも見ずに書く)
        const renderWriteQuizStep = () => {
            if (writeIndex >= writeQuestions.length) { renderResult(); return; }
            const item = writeQuestions[writeIndex];
            padStrokes = [];

            container.innerHTML = `
                <div class="h-full flex flex-col p-2 md:p-3">
                    <div class="flex justify-between items-center mb-1">
                        <button id="btn-quit-write" class="bg-gray-100 text-gray-400 font-bold py-1.5 px-3 rounded-full text-sm">やめる</button>
                        <div class="bg-amber-100 text-amber-600 px-3 py-1 rounded-full font-bold text-sm">
                            あと ${writeQuestions.length - writeIndex} もん
                        </div>
                        <div class="font-bold text-orange-400 text-sm">てんすう: ${score}</div>
                    </div>

                    <div class="bg-amber-50 border-4 border-amber-200 rounded-2xl px-3 py-2 text-center mb-2">
                        <p class="text-gray-500 font-bold text-xs">この よみかた の かんじ を かこう</p>
                        <div class="mt-1 flex items-baseline justify-center gap-1 flex-wrap">
                            ${readingHtml(item,
                                'inline-block bg-sky-100 text-sky-700 border border-sky-300 px-3 py-0.5 rounded-xl font-black text-3xl md:text-4xl',
                                'inline-block bg-orange-100 text-orange-600 border border-orange-300 px-2 py-0.5 rounded-xl font-bold text-xl md:text-2xl',
                                'text-4xl md:text-5xl font-black text-gray-800'
                            )}
                        </div>
                    </div>

                    <div id="pad-area" class="flex-1 flex items-center justify-center min-h-0">
                        <div id="pad-box" class="bg-white border-4 border-amber-200 rounded-2xl overflow-hidden">
                            <canvas id="pad-canvas" class="block"></canvas>
                        </div>
                    </div>

                    <div class="flex gap-2 mt-2">
                        <button id="btn-clear" class="bg-gray-200 text-gray-600 font-bold py-3 px-5 rounded-xl text-base">けす</button>
                        <button id="btn-done" class="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 rounded-xl text-lg shadow-md active:scale-95 transition">かけた！</button>
                    </div>
                </div>
            `;

            const padCanvas = container.querySelector('#pad-canvas');
            const drawPad = (ctx, size) => {
                ctx.clearRect(0, 0, size, size);
                drawGrid(ctx, size);
                drawUserStrokes(ctx, padStrokes, size, size * 0.075, '#1f2937');
            };
            const relayout = mountCanvas(container.querySelector('#pad-area'), container.querySelector('#pad-box'), padCanvas, drawPad);
            padRelayout = { el: padCanvas, fn: relayout };
            setupPad(padCanvas, () => drawPad(padCanvas.getContext('2d'), parseFloat(padCanvas.style.width)));

            container.querySelector('#btn-quit-write').onclick = renderModeSelect;
            container.querySelector('#btn-clear').onclick = () => {
                padStrokes = [];
                drawPad(padCanvas.getContext('2d'), parseFloat(padCanvas.style.width));
            };
            container.querySelector('#btn-done').onclick = () => renderWriteCompare(item);
        };

        // ★ かきとりクイズ 見くらべ & じぶんで まるつけ
        const renderWriteCompare = (item) => {
            let view = 'both'; // 'mine' | 'model' | 'both'
            const myStrokes = padStrokes;

            container.innerHTML = `
                <div class="h-full flex flex-col p-2 md:p-3">
                    <div class="flex justify-between items-center mb-1">
                        <div class="bg-amber-100 text-amber-600 px-3 py-1 rounded-full font-bold text-sm">みくらべよう</div>
                        <div class="font-bold text-orange-400 text-sm">てんすう: ${score}</div>
                    </div>

                    <div class="text-center mb-1">
                        <span class="text-gray-400 font-bold text-xs">こたえ</span>
                        <span class="text-3xl font-black text-gray-800 mx-1">${item.k}</span>
                        <span class="inline-flex items-baseline gap-0.5">
                            ${readingHtml(item,
                                'inline-block bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-bold text-base',
                                'inline-block bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold text-sm',
                                'text-base font-bold text-gray-500'
                            )}
                        </span>
                    </div>

                    <div class="flex justify-center gap-1.5 mb-1">
                        <button class="view-btn" data-view="mine">じぶんの じ</button>
                        <button class="view-btn" data-view="model">おてほん</button>
                        <button class="view-btn" data-view="both">かさねる</button>
                    </div>

                    <div id="cmp-area" class="flex-1 flex items-center justify-center min-h-0">
                        <div id="cmp-box" class="bg-white border-4 border-amber-200 rounded-2xl overflow-hidden">
                            <canvas id="cmp-canvas" class="block"></canvas>
                        </div>
                    </div>

                    <p class="text-center text-gray-400 font-bold text-xs mt-2">じぶんで まるつけ しよう！</p>
                    <div class="flex gap-2 mt-1">
                        <button class="mark-btn flex-1 bg-red-400 hover:bg-red-500 text-white font-black py-3 rounded-xl text-base shadow-md active:scale-95 transition" data-pt="10">◎ かけた</button>
                        <button class="mark-btn flex-1 bg-orange-300 hover:bg-orange-400 text-white font-black py-3 rounded-xl text-base shadow-md active:scale-95 transition" data-pt="5">△ おしい</button>
                        <button class="mark-btn flex-1 bg-blue-300 hover:bg-blue-400 text-white font-black py-3 rounded-xl text-base shadow-md active:scale-95 transition" data-pt="0">× まだまだ</button>
                    </div>
                </div>
            `;

            const canvas = container.querySelector('#cmp-canvas');
            const draw = (ctx, size) => {
                ctx.clearRect(0, 0, size, size);
                drawGrid(ctx, size);
                if (view === 'model') {
                    drawGuide(ctx, item.k, size, { color: '#0d9488', width: size * 0.08, numbers: true });
                } else if (view === 'mine') {
                    drawUserStrokes(ctx, myStrokes, size, size * 0.075, '#1f2937');
                } else {
                    drawGuide(ctx, item.k, size, { color: '#fb923c', width: size * 0.09, alpha: 0.55 });
                    drawUserStrokes(ctx, myStrokes, size, size * 0.07, '#1f2937');
                }
            };
            const relayout = mountCanvas(container.querySelector('#cmp-area'), container.querySelector('#cmp-box'), canvas, draw);
            padRelayout = { el: canvas, fn: relayout };

            const paintTabs = () => {
                container.querySelectorAll('.view-btn').forEach(b => {
                    b.className = 'view-btn px-3 py-1 rounded-full font-bold text-xs transition ' +
                        (b.dataset.view === view ? 'bg-amber-400 text-white shadow' : 'bg-gray-200 text-gray-400');
                });
            };
            paintTabs();
            container.querySelectorAll('.view-btn').forEach(b => {
                b.onclick = () => {
                    view = b.dataset.view;
                    paintTabs();
                    draw(canvas.getContext('2d'), parseFloat(canvas.style.width));
                };
            });

            container.querySelectorAll('.mark-btn').forEach(b => {
                b.onclick = () => {
                    const pt = parseInt(b.dataset.pt);
                    score += pt;
                    system.playSound(pt >= 5 ? 'correct' : 'wrong');
                    if (system.logQuizResult) {
                        system.logQuizResult('かんじマスター', item.k, pt === 10, {
                            reading: fullR(item), level: currentLevel + 1, mode: 'write', selfMark: pt
                        });
                    }
                    writeIndex++;
                    renderWriteQuizStep();
                };
            });
        };

        // =========================================================
        //  じゅくごクイズ (せんたくし なし / ひらがな キーボード入力)
        // =========================================================
        const KANA_ROWS = [
            ['あ','か','さ','た','な','は','ま','や','ら','わ'],
            ['い','き','し','ち','に','ひ','み','',  'り','を'],
            ['う','く','す','つ','ぬ','ふ','む','ゆ','る','ん'],
            ['え','け','せ','て','ね','へ','め','',  'れ','ー'],
            ['お','こ','そ','と','の','ほ','も','よ','ろ','']
        ];
        const DAKUTEN = {か:'が',き:'ぎ',く:'ぐ',け:'げ',こ:'ご',さ:'ざ',し:'じ',す:'ず',せ:'ぜ',そ:'ぞ',
                         た:'だ',ち:'ぢ',つ:'づ',て:'で',と:'ど',は:'ば',ひ:'び',ふ:'ぶ',へ:'べ',ほ:'ぼ'};
        const HANDAKUTEN = {は:'ぱ',ひ:'ぴ',ふ:'ぷ',へ:'ぺ',ほ:'ぽ'};

        let kanaInput = '';

        // ★ じゅくごクイズ (入力式)
        const renderJukugoInputQuiz = () => {
            if (quizIndex >= quizQuestions.length) { renderResult(); return; }

            hasMistaken = false;
            kanaInput = '';
            const q = quizQuestions[quizIndex];

            const keyCls = 'kana-key bg-white border-b-2 border-gray-200 rounded-lg font-bold text-gray-700 text-base md:text-xl py-1.5 active:bg-pink-50 active:border-b-0 active:translate-y-0.5 transition-all';
            const subCls = 'bg-pink-100 border-b-2 border-pink-200 rounded-lg font-black text-pink-500 text-2xl md:text-3xl leading-none py-1 active:border-b-0 active:translate-y-0.5 transition-all';
            const rowsHtml = KANA_ROWS.map(row => row.map(k => k
                ? `<button class="${keyCls}" data-kana="${k}">${k}</button>`
                : `<div></div>`
            ).join('')).join('');

            container.innerHTML = `
                <div class="h-full flex flex-col p-2 md:p-3 relative">
                    <div class="flex justify-between items-center mb-1">
                        <button id="btn-quit-quiz" class="bg-gray-100 text-gray-400 font-bold py-1.5 px-3 rounded-full text-sm">やめる</button>
                        <div class="bg-pink-100 text-pink-500 px-3 py-1 rounded-full font-bold text-sm">
                            あと ${quizQuestions.length - quizIndex} もん
                        </div>
                        <div class="font-bold text-orange-400 text-sm">てんすう: ${score}</div>
                    </div>

                    <!-- もんだい -->
                    <div class="bg-pink-50 border-4 border-pink-200 rounded-2xl py-2 px-3 text-center mb-1.5">
                        <p class="font-bold text-xs text-gray-500">この じゅくご の よみかた を うとう</p>
                        <div class="text-5xl md:text-6xl font-black text-gray-800 tracking-wider">${q.j}</div>
                    </div>

                    <!-- にゅうりょくらん -->
                    <div class="bg-white border-4 border-sky-200 rounded-2xl h-14 md:h-16 flex items-center justify-center mb-1.5 px-2">
                        <span id="kana-display" class="text-3xl md:text-4xl font-black text-sky-700 tracking-widest">&nbsp;</span>
                    </div>

                    <!-- キーボード -->
                    <div class="grid grid-cols-10 gap-1 mb-1">
                        ${rowsHtml}
                    </div>
                    <div class="grid grid-cols-10 gap-1 mb-1.5">
                        <button class="${subCls}" data-sub="daku">゛</button>
                        <button class="${subCls}" data-sub="handaku">゜</button>
                        <button class="${keyCls}" data-kana="っ">っ</button>
                        <button class="${keyCls}" data-kana="ゃ">ゃ</button>
                        <button class="${keyCls}" data-kana="ゅ">ゅ</button>
                        <button class="${keyCls}" data-kana="ょ">ょ</button>
                        <button id="btn-back-key" class="col-span-2 bg-gray-200 border-b-2 border-gray-300 rounded-lg font-bold text-gray-600 text-sm py-1.5 active:border-b-0 active:translate-y-0.5">← けす</button>
                        <button id="btn-giveup" class="col-span-2 bg-gray-100 border-b-2 border-gray-200 rounded-lg font-bold text-gray-400 text-xs py-1.5 active:border-b-0 active:translate-y-0.5">わからない</button>
                    </div>

                    <button id="btn-check" class="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-xl text-lg shadow-md active:scale-95 transition">
                        こたえあわせ
                    </button>

                    <!-- オーバーレイ -->
                    <div id="feedback-overlay" class="absolute inset-0 bg-white/95 rounded-2xl z-50 hidden flex-col items-center justify-center animate-pop">
                        <div id="fb-mark" class="text-8xl font-black mb-2"></div>
                        <div id="fb-text" class="text-xl font-bold text-gray-700 text-center px-4"></div>
                    </div>
                </div>
            `;

            const display = container.querySelector('#kana-display');
            const paint = () => { display.textContent = kanaInput || ' '; };

            container.querySelectorAll('[data-kana]').forEach(b => {
                b.onclick = () => { if (kanaInput.length < 12) { kanaInput += b.dataset.kana; paint(); } };
            });
            container.querySelectorAll('[data-sub]').forEach(b => {
                b.onclick = () => {
                    const last = kanaInput.slice(-1);
                    const map = b.dataset.sub === 'daku' ? DAKUTEN : HANDAKUTEN;
                    if (map[last]) { kanaInput = kanaInput.slice(0, -1) + map[last]; paint(); }
                };
            });
            container.querySelector('#btn-back-key').onclick = () => { kanaInput = kanaInput.slice(0, -1); paint(); };
            container.querySelector('#btn-quit-quiz').onclick = renderModeSelect;
            container.querySelector('#btn-check').onclick = () => checkJukugoInput(q);
            container.querySelector('#btn-giveup').onclick = () => {
                hasMistaken = true;
                if (system.logQuizResult) {
                    system.logQuizResult('かんじマスター', q.j, false, {
                        reading: q.r, selected: '(わからない)', level: currentLevel + 1, mode: 'jukugo_input'
                    });
                }
                showJukugoAnswer(q);
            };
        };

        // ★ 入力式じゅくごクイズの答え合わせ
        const checkJukugoInput = (q) => {
            const overlay = container.querySelector('#feedback-overlay');
            if (!overlay || overlay.style.display === 'flex') return;
            if (!kanaInput) return;

            const fbMark = container.querySelector('#fb-mark');
            const fbText = container.querySelector('#fb-text');
            const isCorrect = kanaInput === q.r;
            overlay.style.display = 'flex';

            if (system.logQuizResult) {
                system.logQuizResult('かんじマスター', q.j, isCorrect, {
                    reading: q.r, selected: kanaInput, level: currentLevel + 1, mode: 'jukugo_input'
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
                fbText.innerHTML = `ちがうよ<br><span class="text-sm text-gray-400">${q.r.length}もじ だよ</span>`;
                system.playSound('wrong');
                setTimeout(() => {
                    if (!container.contains(overlay)) return;
                    overlay.style.display = 'none';
                    kanaInput = '';
                    const d = container.querySelector('#kana-display');
                    if (d) d.textContent = ' ';
                }, 1800);
            }
        };

        // ★ こたえを見せて つぎの もんだいへ
        const showJukugoAnswer = (q) => {
            const overlay = container.querySelector('#feedback-overlay');
            if (!overlay) return;
            overlay.style.display = 'flex';
            const fbMark = container.querySelector('#fb-mark');
            const fbText = container.querySelector('#fb-text');
            fbMark.textContent = '💡';
            fbMark.className = 'text-7xl font-black mb-2';
            fbText.innerHTML = `<span class="text-4xl font-black text-pink-500">${q.j}</span> は<br>
                <span class="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-lg font-bold text-2xl mt-1">${q.r}</span> だよ`;
            system.playSound('wrong');
            setTimeout(() => { quizIndex++; renderQuizQuestion(); }, 2600);
        };

        // ★ クイズ開始処理
        const startQuiz = () => {
            const start = currentLevel * QUESTIONS_PER_LEVEL;
            const end = start + QUESTIONS_PER_LEVEL;
            const targetKanji = getKanjiData().slice(start, end);

            quizQuestions = shuffle([...targetKanji]);
            quizIndex = 0;
            score = 0;
            renderQuizQuestion();
        };

        // ★ じゅくごクイズ開始処理
        const startJukugoQuiz = () => {
            const start = currentLevel * QUESTIONS_PER_LEVEL;
            const end = Math.min(start + QUESTIONS_PER_LEVEL, getJukugoData().length);
            const targetJukugo = getJukugoData().slice(start, end);

            quizQuestions = shuffle([...targetJukugo]);
            quizIndex = 0;
            score = 0;
            renderQuizQuestion();
        };

        // ★ クイズ出題ディスパッチ
        const renderQuizQuestion = () => {
            if (quizMode === 'reading') renderReadingQuiz();
            else if (quizMode === 'kanji') renderKanjiQuiz();
            else if (jukugoInputMode === 'input') renderJukugoInputQuiz();
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
                const selItem = getKanjiData().find(k => k.k === selectedKanji);
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
                const selItem = getKanjiData().find(k => k.k === selectedKanji);
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
            padRelayout = null;
            const isJukugo = quizMode === 'jukugo';
            const isKakitori = quizMode === 'trace' || quizMode === 'write';
            let comment = "";
            let emoji = "";
            if (score === 100) {
                comment = isJukugo ? "パーフェクト！<br>じゅくごは バッチリだね！"
                    : isKakitori ? "パーフェクト！<br>かきとりは バッチリだね！"
                    : "パーフェクト！<br>かんじは バッチリだね！";
                emoji = "🏆";
            } else if (score >= 80) {
                comment = "すごい！<br>そのちょうし！";
                emoji = "🥈";
            } else {
                comment = isKakitori
                    ? "がんばったね！<br>なぞりれんしゅうで<br>ふくしゅう しよう！"
                    : "がんばったね！<br>べんきょうモードで<br>ふくしゅう しよう！";
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

            const retryFn = quizMode === 'jukugo' ? startJukugoQuiz
                : quizMode === 'trace' ? startTrace
                : quizMode === 'write' ? startWriteQuiz
                : startQuiz;
            container.querySelector('#btn-retry').onclick = () => retryFn();
            container.querySelector('#btn-home').onclick = () => {
                system.addScore(score);
                renderLevelSelect();
            };
        };

        // ---------------------------------------------------------
        // 6. アプリ起動
        // ---------------------------------------------------------
        renderLevelSelect();

        return () => {
            window.removeEventListener('resize', onResize);
            padRelayout = null;
        };
    }
};
