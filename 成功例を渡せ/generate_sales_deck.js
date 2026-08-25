const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9'; // 10.0 x 5.625 inches
pptx.title = 'The Presentation Director - 営業資料 (Visual Edition)';

// ==========================================
// DESIGN SYSTEM & PALETTE
// ==========================================
const C_DARK_BG = '0B1120';    // Deep Midnight Navy
const C_SLATE_BG = '1E293B';   // Card on Dark
const C_LIGHT_BG = 'F8FAFC';   // Clean Off-White
const C_WHITE = 'FFFFFF';
const C_CARD_BG = 'FFFFFF';
const C_CARD_BORDER = 'E2E8F0';

const C_PRIMARY = '3B82F6';    // Royal Cobalt
const C_PRIMARY_DARK = '1D4ED8';
const C_ACCENT_AMBER = 'F59E0B';// Warm Amber
const C_ACCENT_GOLD = 'D97706';
const C_ACCENT_EMERALD = '10B981';
const C_ACCENT_ROSE = 'F43F5E';

const C_TEXT_MAIN = '0F172A';  // Slate 900
const C_TEXT_MUTED = '475569'; // Slate 600
const C_TEXT_LIGHT = '94A3B8'; // Slate 400
const C_TEXT_WHITE = 'FFFFFF';

const FONT_TITLE = 'Meiryo';
const FONT_BODY = 'Meiryo';

// Images Directory
const imgDir = path.join(__dirname, 'images');

// Helper to get image path by partial prefix
function getImg(prefix) {
    const files = fs.readdirSync(imgDir);
    const match = files.find(f => f.startsWith(prefix) && f.endsWith('.jpg'));
    return match ? path.join(imgDir, match) : null;
}

const IMG_COVER = getImg('deck_cover_art');
const IMG_BLUEPRINT = getImg('scenario_architecture');
const IMG_GOLD = getImg('track_record_gold');
const IMG_3STEPS = getImg('three_steps_method');
const IMG_EXPANSION = getImg('national_expansion');
const IMG_DIAMOND = getImg('craftsmanship_diamond');
const IMG_UNTANGLE = getImg('untangle_complexity');
const IMG_OVATION = getImg('emotional_standing_ovation');
const IMG_GATEWAY = getImg('future_light_gateway');

// Helper: Slide Header for Light Slides
function addLightHeader(slide, category, title, sub = null) {
    slide.background = { color: C_LIGHT_BG };
    
    // Category Badge
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 0.3, w: 2.2, h: 0.26,
        fill: { color: 'EFF6FF' },
        line: { color: C_PRIMARY, width: 1 }
    });
    slide.addText(category.toUpperCase(), {
        x: 0.5, y: 0.3, w: 2.2, h: 0.26,
        fontSize: 8.5, fontFace: FONT_TITLE, color: C_PRIMARY_DARK, bold: true, align: 'center'
    });

    // Main Title
    slide.addText(title, {
        x: 0.5, y: 0.6, w: 9.0, h: 0.42,
        fontSize: 15, fontFace: FONT_TITLE, color: C_TEXT_MAIN, bold: true
    });

    // Subtitle
    if (sub) {
        slide.addText(sub, {
            x: 0.5, y: 1.02, w: 9.0, h: 0.26,
            fontSize: 9.5, fontFace: FONT_BODY, color: C_PRIMARY, bold: true
        });
    }
}

// Helper: Slide Header for Dark Slides
function addDarkHeader(slide, category, title, sub = null) {
    slide.background = { color: C_DARK_BG };

    // Category Badge
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 0.3, w: 2.2, h: 0.26,
        fill: { color: '1E293B' },
        line: { color: C_PRIMARY, width: 1 }
    });
    slide.addText(category.toUpperCase(), {
        x: 0.5, y: 0.3, w: 2.2, h: 0.26,
        fontSize: 8.5, fontFace: FONT_TITLE, color: '60A5FA', bold: true, align: 'center'
    });

    // Main Title
    slide.addText(title, {
        x: 0.5, y: 0.6, w: 9.0, h: 0.42,
        fontSize: 15, fontFace: FONT_TITLE, color: C_TEXT_WHITE, bold: true
    });

    // Subtitle
    if (sub) {
        slide.addText(sub, {
            x: 0.5, y: 1.02, w: 9.0, h: 0.26,
            fontSize: 9.5, fontFace: FONT_BODY, color: C_ACCENT_AMBER, bold: true
        });
    }
}


// =============================================================
// SLIDE 01: 表紙 (Executive Dark Cover with Visual)
// =============================================================
const s01 = pptx.addSlide();
s01.background = { color: C_DARK_BG };

// Left Column: Typography (x: 0.5, w: 4.8)
s01.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 0.65, w: 2.8, h: 0.3,
    fill: { color: C_SLATE_BG }, line: { color: C_PRIMARY, width: 1 }
});
s01.addText('PRESENTATION DIRECTION', {
    x: 0.5, y: 0.65, w: 2.8, h: 0.3,
    fontSize: 9, fontFace: FONT_TITLE, color: '93C5FD', bold: true, align: 'center'
});

s01.addText('話す前に、勝負を決める。', {
    x: 0.5, y: 1.15, w: 4.7, h: 0.65,
    fontSize: 23, fontFace: FONT_TITLE, color: C_TEXT_WHITE, bold: true
});

s01.addText([
    { text: '伝わらない想いを\n「　', options: { color: '94A3B8' } },
    { text: '選ばれるシナリオ', options: { color: C_ACCENT_AMBER, bold: true } },
    { text: '　」へ再生する。', options: { color: '94A3B8' } }
], {
    x: 0.5, y: 1.85, w: 4.7, h: 0.8,
    fontSize: 16, fontFace: FONT_TITLE, bold: true, lineSpacing: 22
});

s01.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 2.9, w: 1.5, h: 0.04, fill: { color: C_PRIMARY }
});

// Profile Box
s01.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 3.2, w: 4.5, h: 1.85,
    fill: { color: '0F172A' }, line: { color: '334155', width: 1 }
});
s01.addText('プレゼン演出家 ／ 元シニア経営コンサルタント', {
    x: 0.7, y: 3.35, w: 4.1, h: 0.25,
    fontSize: 9.5, fontFace: FONT_BODY, color: '94A3B8'
});
s01.addText('西川 佳孝', {
    x: 0.7, y: 3.65, w: 4.1, h: 0.5,
    fontSize: 20, fontFace: FONT_TITLE, color: C_TEXT_WHITE, bold: true
});
s01.addText('累計契約コンサルフィー5億円超の実戦と、ストアカ★4.9が導き出す「選ばれる構造」', {
    x: 0.7, y: 4.25, w: 4.1, h: 0.65,
    fontSize: 9, fontFace: FONT_BODY, color: '64748B', lineSpacing: 13
});

// Right Column: Artwork (x: 5.2, y: 0.65, w: 4.3, h: 4.4)
if (IMG_COVER) {
    s01.addImage({
        path: IMG_COVER,
        x: 5.2, y: 0.65, w: 4.3, h: 4.4,
        rounding: true
    });
}


// =============================================================
// SLIDE 02: 課題提起 (Why Your Message Fails - Visual Untangle)
// =============================================================
const s02 = pptx.addSlide();
addLightHeader(
    s02,
    'PROBLEM STATEMENT',
    'なぜ、あなたの想いは届かないのか？',
    '伝わらない最大の原因は、話し方ではなく「　話す順番（シナリオ）　」'
);

// Top Visual Banner (Untangle Complexity)
if (IMG_UNTANGLE) {
    s02.addImage({
        path: IMG_UNTANGLE,
        x: 0.5, y: 1.35, w: 9.0, h: 1.5,
        rounding: true
    });
}

// 3 Pitfall Cards at Bottom
const pitfalls = [
    {
        num: '01',
        title: '知識の押し売り',
        desc: '専門性を伝えようとするあまり、相手が求めているものが見えなくなる。',
        color: 'EF4444'
    },
    {
        num: '02',
        title: '座学の迷子',
        desc: '実技や想いはあるのに、いざ説明になると「　何をどう構成すべきか　」分からなくなる。',
        color: C_ACCENT_GOLD
    },
    {
        num: '03',
        title: '自分ファースト',
        desc: '相手の興味がない自己紹介から入り、相手の心が離れてしまう。',
        color: '8B5CF6'
    }
];

pitfalls.forEach((item, idx) => {
    const xPos = 0.5 + idx * 3.08;
    s02.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: 3.0, w: 2.84, h: 2.15,
        fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
    });

    s02.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: 3.0, w: 2.84, h: 0.06, fill: { color: item.color }
    });

    s02.addText(item.num + ' ｜ ' + item.title, {
        x: xPos + 0.15, y: 3.15, w: 2.54, h: 0.3,
        fontSize: 11, fontFace: FONT_TITLE, color: C_TEXT_MAIN, bold: true
    });

    s02.addText(item.desc, {
        x: xPos + 0.15, y: 3.5, w: 2.54, h: 1.5,
        fontSize: 9, fontFace: FONT_BODY, color: C_TEXT_MUTED, lineSpacing: 14
    });
});


// =============================================================
// SLIDE 03: 独自思想 (Core Philosophy - Blueprint Visual)
// =============================================================
const s03 = pptx.addSlide();
addDarkHeader(
    s03,
    'THE CORE PHILOSOPHY',
    '中身を変えなくても「　伝える順番　」を整えるだけで、評価も成果も跳ね上がる。'
);

// Left: 2 Pillars Cards (x: 0.5, w: 4.8)
// Card 1: シナリオ9割
s03.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.4, w: 4.8, h: 1.7,
    fill: { color: C_SLATE_BG }, line: { color: C_PRIMARY, width: 1.5 }
});
s03.addText('CORE 01 ｜ シナリオ9割', {
    x: 0.7, y: 1.5, w: 4.4, h: 0.3,
    fontSize: 11.5, fontFace: FONT_TITLE, color: '60A5FA', bold: true
});
s03.addText('アドリブトーク、派手なスライド装飾は枝葉。\n成果を決めるのは「　何を、どの順番で話すか　」の緻密な設計図。', {
    x: 0.7, y: 1.85, w: 4.4, h: 1.1,
    fontSize: 9.5, fontFace: FONT_BODY, color: 'CBD5E1', lineSpacing: 14
});

// Card 2: 結論ファースト
s03.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 3.25, w: 4.8, h: 1.7,
    fill: { color: C_SLATE_BG }, line: { color: C_ACCENT_AMBER, width: 1.5 }
});
s03.addText('CORE 02 ｜ 結論ファースト', {
    x: 0.7, y: 3.35, w: 4.4, h: 0.3,
    fontSize: 11.5, fontFace: FONT_TITLE, color: C_ACCENT_AMBER, bold: true
});
s03.addText('「　自分が言いたいこと　」ではなく、\n「　聞き手が最も知りたい結論　」ファーストで設計する。', {
    x: 0.7, y: 3.7, w: 4.4, h: 1.1,
    fontSize: 9.5, fontFace: FONT_BODY, color: 'CBD5E1', lineSpacing: 14
});

// Right: Blueprint Graphic (x: 5.5, y: 1.4, w: 4.0, h: 3.55)
if (IMG_BLUEPRINT) {
    s03.addImage({
        path: IMG_BLUEPRINT,
        x: 5.5, y: 1.4, w: 4.0, h: 3.55,
        rounding: true
    });
}


// =============================================================
// SLIDE 04: 実績・権威性 (Track Record & Proof - Gold Visual)
// =============================================================
const s04 = pptx.addSlide();
addLightHeader(
    s04,
    'TRACK RECORD & PROOF',
    '5億円のビジネス実戦と、公開レビュー「　★4.9　」が証明する再現性。'
);

// Left 3 Stat Badges (x: 0.5, w: 4.6)
const stats = [
    { num: '5億円+', label: '累計契約コンサルフィー', desc: '元シニア経営コンサルタント（在籍16年）。数百社の実戦経験。' },
    { num: '★ 4.90', label: 'ストアカ受講者満足度', desc: '国内最大級マーケットで「新人先生賞」受賞。公開レビュー絶賛。' },
    { num: '3倍', label: '受講者契約単価向上', desc: '全国紙執筆、全国講演ゲスト講師、テレビ・ラジオ等へ進出。' }
];

stats.forEach((item, idx) => {
    const yPos = 1.35 + idx * 0.85;
    s04.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: yPos, w: 4.7, h: 0.75,
        fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
    });
    s04.addText(item.num, {
        x: 0.65, y: yPos + 0.1, w: 1.5, h: 0.55,
        fontSize: 18, fontFace: FONT_TITLE, color: C_PRIMARY_DARK, bold: true
    });
    s04.addText(item.label, {
        x: 2.2, y: yPos + 0.1, w: 2.8, h: 0.25,
        fontSize: 9.5, fontFace: FONT_TITLE, color: C_TEXT_MAIN, bold: true
    });
    s04.addText(item.desc, {
        x: 2.2, y: yPos + 0.35, w: 2.8, h: 0.35,
        fontSize: 8, fontFace: FONT_BODY, color: C_TEXT_MUTED
    });
});

// Bottom of Left: Broad Instructor List
s04.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 4.0, w: 4.7, h: 1.15,
    fill: { color: 'F1F5F9' }, line: { color: 'CBD5E1', width: 1 }
});
s04.addText('【支援実績】 料理、美容、コンサル、英会話、接客、幼児教育、エクセル、マインドフルネス、ヨガ、心理学、お金、パン教室、ボイストレーナー、風水師、アロマ、薬膳、話し方、SNS集客などの現役講師陣', {
    x: 0.65, y: 4.08, w: 4.4, h: 1.0,
    fontSize: 7.5, fontFace: FONT_BODY, color: C_TEXT_MUTED, lineSpacing: 11
});

// Right: Gold Financial Graphic (x: 5.4, y: 1.35, w: 4.1, h: 3.8)
if (IMG_GOLD) {
    s04.addImage({
        path: IMG_GOLD,
        x: 5.4, y: 1.35, w: 4.1, h: 3.8,
        rounding: true
    });
}


// =============================================================
// SLIDE 05: 独自メソッド (Method - 3 Steps Visual)
// =============================================================
const s05 = pptx.addSlide();
addLightHeader(
    s05,
    'THE METHOD : 劇的Reプレゼン®',
    '数千回の実践経験をベースにした「　論理と心理　」で仕掛けるエンタメ演出メソッド。'
);

// Left: 3 Steps Podiums Image (x: 0.5, y: 1.35, w: 3.8, h: 3.75)
if (IMG_3STEPS) {
    s05.addImage({
        path: IMG_3STEPS,
        x: 0.5, y: 1.35, w: 3.8, h: 3.75,
        rounding: true
    });
}

// Right: 3 Step Cards (x: 4.55, w: 4.95)
const steps = [
    {
        num: 'STEP 01',
        title: '言葉の奥にある本音を抽出し、目的と手段で選別する',
        desc: '「何を一番伝えたいのか」「相手にどう動いてほしいのか」を峻別。',
        color: C_PRIMARY
    },
    {
        num: 'STEP 02',
        title: '共感ツカミ & シナリオ再構成',
        desc: '心をツカム言葉へ翻訳し、聞き手が前のめりになるシナリオへ組み替える。',
        color: C_ACCENT_GOLD
    },
    {
        num: 'STEP 03',
        title: '1スライド1メッセージ & 脳内リハーサル',
        desc: '余計な情報を削ぎ落としたスライド化と、現場をリアルに想定したシミュレーション。',
        color: C_ACCENT_EMERALD
    }
];

steps.forEach((st, idx) => {
    const yPos = 1.35 + idx * 1.28;
    s05.addShape(pptx.shapes.RECTANGLE, {
        x: 4.55, y: yPos, w: 4.95, h: 1.18,
        fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
    });

    s05.addShape(pptx.shapes.RECTANGLE, {
        x: 4.55, y: yPos, w: 0.08, h: 1.18, fill: { color: st.color }
    });

    s05.addText(st.num + ' ｜ ' + st.title, {
        x: 4.75, y: yPos + 0.1, w: 4.6, h: 0.35,
        fontSize: 10, fontFace: FONT_TITLE, color: C_TEXT_MAIN, bold: true
    });

    s05.addText(st.desc, {
        x: 4.75, y: yPos + 0.45, w: 4.6, h: 0.65,
        fontSize: 9, fontFace: FONT_BODY, color: C_TEXT_MUTED, lineSpacing: 13
    });
});


// =============================================================
// SLIDE 06: 事例① (Case Study 01 - Expansion Visual)
// =============================================================
const s06 = pptx.addSlide();
addLightHeader(
    s06,
    'CASE STUDY 01',
    'ポジショニングとシナリオで、活動の舞台が「　全国　」へ広がる。'
);

// Left: 2 Cases (x: 0.5, w: 4.8)
// Case A: 社労士
s06.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.35, w: 4.8, h: 1.8,
    fill: { color: C_CARD_BG }, line: { color: C_PRIMARY, width: 1 }
});
s06.addText('CASE 01 ｜ 社会保険労務士（士業）', {
    x: 0.7, y: 1.45, w: 4.4, h: 0.25,
    fontSize: 10.5, fontFace: FONT_TITLE, color: C_PRIMARY_DARK, bold: true
});
s06.addText('【Before】 地域での活動・一般的な社労士業務にとどまり単価アップに苦戦\n【After】 「　業界特化×講演ができる社労士　」というポジショニングにより、全国紙・全国協会誌執筆、全国講演依頼殺到、契約単価は2〜3倍へ向上！', {
    x: 0.7, y: 1.75, w: 4.4, h: 1.3,
    fontSize: 8.5, fontFace: FONT_BODY, color: C_TEXT_MUTED, lineSpacing: 13
});

// Case B: 料理講師
s06.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 3.28, w: 4.8, h: 1.8,
    fill: { color: C_CARD_BG }, line: { color: C_ACCENT_GOLD, width: 1 }
});
s06.addText('CASE 02 ｜ 料理講師（専門家）', {
    x: 0.7, y: 3.38, w: 4.4, h: 0.25,
    fontSize: 10.5, fontFace: FONT_TITLE, color: '92400E', bold: true
});
s06.addText('【Before】 料理日本一の実績があるが、座学講座の構成・シナリオがまとまらず迷子\n【After】 パワポ添削とシナリオ再構築により、ラジオ出演トークがリピートに直結。その後テレビ出演・地元誌ライティングへメディア進出が連鎖！', {
    x: 0.7, y: 3.68, w: 4.4, h: 1.3,
    fontSize: 8.5, fontFace: FONT_BODY, color: C_TEXT_MUTED, lineSpacing: 13
});

// Right: National Expansion Graphic (x: 5.5, y: 1.35, w: 4.0, h: 3.75)
if (IMG_EXPANSION) {
    s06.addImage({
        path: IMG_EXPANSION,
        x: 5.5, y: 1.35, w: 4.0, h: 3.75,
        rounding: true
    });
}


// =============================================================
// SLIDE 07: 事例② (Case Study 02 - Ovation Stage Visual)
// =============================================================
const s07 = pptx.addSlide();
addLightHeader(
    s07,
    'CASE STUDY 02',
    '構成が変わるだけで、「　感動　」を生むコンテンツへ化ける。'
);

// Left: 2 Cases (x: 0.5, w: 4.8)
// Case C: 税理士スライド
s07.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.35, w: 4.8, h: 1.8,
    fill: { color: C_CARD_BG }, line: { color: C_PRIMARY, width: 1 }
});
s07.addText('CASE 03 ｜ 税理士の講座スライド添削', {
    x: 0.7, y: 1.45, w: 4.4, h: 0.25,
    fontSize: 10.5, fontFace: FONT_TITLE, color: C_PRIMARY_DARK, bold: true
});
s07.addText('【変化】 専門分野の中身は一切変えず「　シナリオ（伝える順番）　」だけを劇的再構成。\n【成果】 受講生から「ストーリー性があって心が動かされた」「知識と温かさが詰まった素晴らしい講座」と絶賛の嵐。', {
    x: 0.7, y: 1.75, w: 4.4, h: 1.3,
    fontSize: 8.5, fontFace: FONT_BODY, color: C_TEXT_MUTED, lineSpacing: 13
});

// Case D: 結婚式スピーチ
s07.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 3.28, w: 4.8, h: 1.8,
    fill: { color: C_CARD_BG }, line: { color: 'EC4899', width: 1 }
});
s07.addText('CASE 04 ｜ 親友の結婚式・乾杯の挨拶', {
    x: 0.7, y: 3.38, w: 4.4, h: 0.25,
    fontSize: 10.5, fontFace: FONT_TITLE, color: 'BE185D', bold: true
});
s07.addText('【変化】 新郎新婦双方の友人という難しい立場に対し、「　誰に向けて話すか　」という本質から原稿を演出。\n【成果】 会場全体を温かい感動で包み込み、新郎新婦から心からの感謝を獲得。', {
    x: 0.7, y: 3.68, w: 4.4, h: 1.3,
    fontSize: 8.5, fontFace: FONT_BODY, color: C_TEXT_MUTED, lineSpacing: 13
});

// Right: Ovation Stage Graphic (x: 5.5, y: 1.35, w: 4.0, h: 3.75)
if (IMG_OVATION) {
    s07.addImage({
        path: IMG_OVATION,
        x: 5.5, y: 1.35, w: 4.0, h: 3.75,
        rounding: true
    });
}


// =============================================================
// SLIDE 08: クライアントの声 (Client Voices - Dark Cards)
// =============================================================
const s08 = pptx.addSlide();
addDarkHeader(
    s08,
    'CLIENT VOICES',
    '「　同じ内容なのに、構成が変わるだけで講座の価値が一段上がった。　」'
);

const reviews = [
    {
        title: '講座の価値が一段上がった',
        quote: '「私の専門分野の中身は一切さわっていないのに、構成が変わるだけで『知識が増えてよかった』から『感動した！』へと講座の価値が一段上がりました。」',
        author: '専門講師'
    },
    {
        title: '安心して次の行動に移れる',
        quote: '「聞いてほしいというよりも言ってほしい、言い切ってほしいという想いをゴリラさんに託している。相談すると安心して次の行動に移ることができます。」',
        author: '個人事業主'
    },
    {
        title: '共感フックで心が動く',
        quote: '「『小学生にもわかる言葉で伝えること』『最初に共感のフックをかけること』など、自分一人では気づけなかった具体的なアドバイスでした。」',
        author: '40代女性'
    },
    {
        title: '根本原因とプレゼン観が変わった',
        quote: '「座学での悩みの根本原因や、プレゼンに対する考え方そのものが大きく変わりました。パワポ添削のビフォーアフターで劇的な変化を体感できました。」',
        author: 'ワークショップ主催者'
    }
];

reviews.forEach((rv, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const xPos = 0.5 + col * 4.65;
    const yPos = 1.4 + row * 1.85;

    s08.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: yPos, w: 4.35, h: 1.7,
        fill: { color: C_SLATE_BG }, line: { color: '334155', width: 1 }
    });

    s08.addText('★ ' + rv.title, {
        x: xPos + 0.15, y: yPos + 0.1, w: 4.05, h: 0.25,
        fontSize: 10, fontFace: FONT_TITLE, color: C_ACCENT_AMBER, bold: true
    });

    s08.addText(rv.quote, {
        x: xPos + 0.15, y: yPos + 0.38, w: 4.05, h: 0.95,
        fontSize: 8.5, fontFace: FONT_BODY, color: 'E2E8F0', lineSpacing: 13
    });

    s08.addText('— ' + rv.author, {
        x: xPos + 0.15, y: yPos + 1.35, w: 4.05, h: 0.25,
        fontSize: 8.5, fontFace: FONT_BODY, color: '94A3B8', align: 'right'
    });
});


// =============================================================
// SLIDE 09: サービスメニュー (Service Menu)
// =============================================================
const s09 = pptx.addSlide();
addLightHeader(s09, 'SERVICE MENU', '目的とフェーズに合わせた3つのプロデュース。');

const services = [
    {
        num: 'MENU 01',
        title: 'エグゼクティブ・プレゼン演出',
        target: '対象：経営者・営業・士業・講師',
        desc: 'ビジネス商談・講演・プレゼンのシナリオ策定からスライド制作まで完全伴走プロデュース。勝負どころで確実に結果を出すためのマンツーマン支援。',
        tag: '個別伴走',
        color: C_PRIMARY
    },
    {
        num: 'MENU 02',
        title: '「　伝わる力　」実装プログラム',
        target: '対象：企業・チーム・組織',
        desc: '結論ファースト研修 ／ 話し方・プレゼンテーション研修 ／ 商談シナリオ作成ワークショップ。組織全体のコミュニケーション力と商談成約率を底上げ。',
        tag: '企業研修',
        color: C_ACCENT_GOLD
    },
    {
        num: 'MENU 03',
        title: '劇的Reプレゼン 集中クリニック',
        target: '対象：スライドや原稿をお持ちの方',
        desc: 'PowerPoint（プレゼン）資料・スピーチ原稿を最短で「　勝負プレゼン　」へ甦らせるカスタマイズ添削。内容を保ったまま劇的ビフォーアフターを実現。',
        tag: '単発・集中添削',
        color: C_ACCENT_EMERALD
    }
];

services.forEach((sv, idx) => {
    const xPos = 0.5 + idx * 3.08;

    s09.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: 1.4, w: 2.84, h: 3.7,
        fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
    });

    s09.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: 1.4, w: 2.84, h: 0.45, fill: { color: sv.color }
    });
    s09.addText(sv.num + ' ｜ ' + sv.tag, {
        x: xPos, y: 1.4, w: 2.84, h: 0.45,
        fontSize: 10, fontFace: FONT_TITLE, color: C_TEXT_WHITE, bold: true, align: 'center'
    });

    s09.addText(sv.title, {
        x: xPos + 0.15, y: 2.0, w: 2.54, h: 0.5,
        fontSize: 11.5, fontFace: FONT_TITLE, color: C_TEXT_MAIN, bold: true, align: 'center'
    });

    s09.addText(sv.target, {
        x: xPos + 0.15, y: 2.55, w: 2.54, h: 0.25,
        fontSize: 8.5, fontFace: FONT_TITLE, color: C_PRIMARY_DARK, bold: true, align: 'center'
    });

    s09.addText(sv.desc, {
        x: xPos + 0.15, y: 2.85, w: 2.54, h: 2.1,
        fontSize: 9, fontFace: FONT_BODY, color: C_TEXT_MUTED, lineSpacing: 15
    });
});


// =============================================================
// SLIDE 10: 独自診断チェック (Diagnostic)
// =============================================================
const s10 = pptx.addSlide();
addLightHeader(
    s10,
    'DIAGNOSTIC : 伝わらないプレゼン度チェック',
    'あなたのプレゼン・資料は、この症状に当てはまっていませんか？'
);

const checkItems = [
    '冒頭3分以内に「　相手が一番知りたい結論　」を言えていない',
    '専門家として丁寧に説明しているのに、相手の反応が薄い',
    '言いたいことがたくさんあって、スライドの情報が整理整頓できない',
    '自分の強みや想いを、自分自身が納得できる言葉に落とし込めていない',
    'この内容で大丈夫だろうか、と話し始めるまでいつも不安でドキドキしている'
];

checkItems.forEach((text, idx) => {
    const yPos = 1.35 + idx * 0.55;

    s10.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: yPos, w: 9.0, h: 0.46,
        fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
    });

    s10.addShape(pptx.shapes.RECTANGLE, {
        x: 0.7, y: yPos + 0.11, w: 0.24, h: 0.24,
        fill: { color: 'EFF6FF' }, line: { color: C_PRIMARY, width: 1.5 }
    });

    s10.addText(text, {
        x: 1.05, y: yPos + 0.08, w: 8.3, h: 0.3,
        fontSize: 9.5, fontFace: FONT_BODY, color: C_TEXT_MAIN, bold: true
    });
});

// Diagnostic Conclusion Box
s10.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 4.3, w: 9.0, h: 0.8,
    fill: { color: 'FEF3C7' }, line: { color: C_ACCENT_AMBER, width: 1.5 }
});
s10.addText('【診断結果】 1つでも該当する場合、内容ではなく「　シナリオの順番　」を見直すだけで劇的に改善します。', {
    x: 0.7, y: 4.4, w: 8.6, h: 0.6,
    fontSize: 10.5, fontFace: FONT_TITLE, color: '92400E', bold: true, align: 'center'
});


// =============================================================
// SLIDE 11: プロとしてのスタンス (Integrity - Diamond Visual)
// =============================================================
const s11 = pptx.addSlide();
addDarkHeader(
    s11,
    'OUR STANCE & INTEGRITY',
    '裏技や魔法はありません。あるのは「　誠実な心と技　」の積み重ねだけです。'
);

// Left: Diamond Craftsmanship Graphic (x: 0.5, y: 1.35, w: 3.8, h: 3.75)
if (IMG_DIAMOND) {
    s11.addImage({
        path: IMG_DIAMOND,
        x: 0.5, y: 1.35, w: 3.8, h: 3.75,
        rounding: true
    });
}

// Right: 3 Promises Cards (x: 4.55, w: 4.95)
const promises = [
    {
        num: 'PROMISE 01',
        title: '耳触りの良いお世辞は言わない',
        desc: 'あなたの成果のために、改善点をプロとして率直にお伝えします。'
    },
    {
        num: 'PROMISE 02',
        title: 'プロとして言い切る・めちゃ応援する',
        desc: '迷いや不安を断ち切り、次の行動へ踏み出せる判断軸を示し、全力で応援します。'
    },
    {
        num: 'PROMISE 03',
        title: '純度100%の想いを届ける',
        desc: '他の誰でもない、あなただけの本音と強みを最高峰のシナリオへ昇華させます。'
    }
];

promises.forEach((p, idx) => {
    const yPos = 1.35 + idx * 1.28;

    s11.addShape(pptx.shapes.RECTANGLE, {
        x: 4.55, y: yPos, w: 4.95, h: 1.18,
        fill: { color: C_SLATE_BG }, line: { color: C_PRIMARY, width: 1 }
    });

    s11.addText(p.num + ' ｜ ' + p.title, {
        x: 4.75, y: yPos + 0.12, w: 4.6, h: 0.35,
        fontSize: 10, fontFace: FONT_TITLE, color: '60A5FA', bold: true
    });
    s11.addText(p.desc, {
        x: 4.75, y: yPos + 0.45, w: 4.6, h: 0.65,
        fontSize: 9, fontFace: FONT_BODY, color: 'CBD5E1', lineSpacing: 13
    });
});


// =============================================================
// SLIDE 12: 次のアクション (Next Step / CTA - Gateway Visual)
// =============================================================
const s12 = pptx.addSlide();
s12.background = { color: C_DARK_BG };

// Left: Content & CTA (x: 0.5, w: 4.8)
s12.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 0.5, w: 2.2, h: 0.26,
    fill: { color: C_SLATE_BG }, line: { color: C_PRIMARY, width: 1 }
});
s12.addText('NEXT STEP', {
    x: 0.5, y: 0.5, w: 2.2, h: 0.26,
    fontSize: 8.5, fontFace: FONT_TITLE, color: '60A5FA', bold: true, align: 'center'
});

s12.addText('まずは、一度「　診断セッション　」しましょう。', {
    x: 0.5, y: 0.85, w: 4.7, h: 0.6,
    fontSize: 16, fontFace: FONT_TITLE, color: C_TEXT_WHITE, bold: true
});

// Offer Box
s12.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 4.7, h: 1.8,
    fill: { color: C_SLATE_BG }, line: { color: C_ACCENT_AMBER, width: 1.5 }
});
s12.addText('【初回限定】 プレゼン & 資料 30分オンライン壁打ち診断', {
    x: 0.7, y: 1.7, w: 4.3, h: 0.3,
    fontSize: 11, fontFace: FONT_TITLE, color: C_ACCENT_AMBER, bold: true
});
s12.addText('現在のプレゼン資料（メモ、原稿、資料、思い）を拝見し、どこをどう組み替えれば劇的に化けるかをその場で具体的にお伝えします。', {
    x: 0.7, y: 2.05, w: 4.3, h: 1.1,
    fontSize: 9.5, fontFace: FONT_BODY, color: 'E2E8F0', lineSpacing: 15
});

// Contact Box
s12.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 3.5, w: 4.7, h: 1.6,
    fill: { color: '0F172A' }, line: { color: '334155', width: 1 }
});
s12.addText('お問い合わせ・ご相談窓口', {
    x: 0.7, y: 3.65, w: 4.3, h: 0.25,
    fontSize: 9.5, fontFace: FONT_TITLE, color: '94A3B8', bold: true
});
s12.addText('プレゼン演出家 西川佳孝 公式窓口\nEmail: contact@example.com\nWeb: https://example.com', {
    x: 0.7, y: 3.95, w: 4.3, h: 0.95,
    fontSize: 10, fontFace: FONT_BODY, color: C_TEXT_WHITE, lineSpacing: 15
});

// Right: Gateway Graphic (x: 5.4, y: 0.5, w: 4.1, h: 4.6)
if (IMG_GATEWAY) {
    s12.addImage({
        path: IMG_GATEWAY,
        x: 5.4, y: 0.5, w: 4.1, h: 4.6,
        rounding: true
    });
}


// =============================================================
// FILE OUTPUT
// =============================================================
const outputFile = path.join(__dirname, '営業資料_西川佳孝_完成版.pptx');
const desktopFile = path.join(process.env.USERPROFILE, 'OneDrive', 'デスクトップ', '営業資料_西川佳孝_完成版.pptx');

pptx.writeFile({ fileName: outputFile }).then(() => {
    try {
        fs.copyFileSync(outputFile, desktopFile);
    } catch(e) {}
    console.log('SUCCESS: Visual Sales Deck generated successfully!');
}).catch(err => {
    console.error('ERROR:', err);
});
