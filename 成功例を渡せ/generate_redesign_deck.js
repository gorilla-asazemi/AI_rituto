const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9'; // 10.0 x 5.625 inches
pptx.title = 'The Presentation Director - Editorial White Edition';

// ==========================================
// COLOR PALETTE (Clean Forest & Bronze Editorial)
// ==========================================
const BG_WHITE = 'FFFFFF';
const BG_LIGHT = 'F8FAFC';
const BG_CARD = 'FFFFFF';

const C_FOREST_DEEP = '0F2D1F';   // Deep Forest Green
const C_FOREST_MID = '1B382B';    // Forest Green
const C_SAGE = '2D5A43';          // Sage Accent
const C_PALE_GREEN = 'E8F2EC';    // Soft Green Tint

const C_BRONZE = 'C5A059';        // Antique Bronze Gold
const C_BRONZE_LIGHT = 'F9F5EB';  // Soft Gold Tint

const C_BLACK = '111827';         // Carbon Black
const C_SLATE_DARK = '1E293B';
const C_SLATE_MUTED = '475569';
const C_SLATE_LIGHT = '94A3B8';
const C_BORDER = 'E2E8F0';
const C_BORDER_ACCENT = 'CBD5E1';

const FONT_TITLE = 'Meiryo';
const FONT_BODY = 'Meiryo';

// Images Directory
const imgDir = path.join(__dirname, 'images');

function getImg(prefix) {
    const files = fs.readdirSync(imgDir);
    const match = files.find(f => f.startsWith(prefix) && f.endsWith('.jpg'));
    return match ? path.join(imgDir, match) : null;
}

const IMG_SPEAKER = getImg('speaker_clean_frame');
const IMG_GEARS = getImg('clean_gear_diagram');
const IMG_TROPHY = getImg('clean_gold_trophy');

// Helper: Common Editorial Header
function addEditorialHeader(slide, category, title, sub = null) {
    slide.background = { color: BG_LIGHT };

    // Category Tag (Minimalist Text & Line)
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.6, y: 0.35, w: 0.1, h: 0.22,
        fill: { color: C_FOREST_MID }
    });
    slide.addText(category.toUpperCase(), {
        x: 0.78, y: 0.35, w: 5.0, h: 0.22,
        fontSize: 9, fontFace: FONT_TITLE, color: C_FOREST_MID, bold: true
    });

    // Main Title
    slide.addText(title, {
        x: 0.6, y: 0.62, w: 8.8, h: 0.45,
        fontSize: 15.5, fontFace: FONT_TITLE, color: C_BLACK, bold: true
    });

    // Subtitle / Catchphrase
    if (sub) {
        slide.addText(sub, {
            x: 0.6, y: 1.05, w: 8.8, h: 0.28,
            fontSize: 10, fontFace: FONT_BODY, color: C_SAGE, bold: true
        });
    }

    // Top Border Line
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.6, y: 1.35, w: 8.8, h: 0.02,
        fill: { color: C_BORDER }
    });
}


// =============================================================
// SLIDE 01: 表紙 (Editorial Clean Luxury Cover)
// =============================================================
const s01 = pptx.addSlide();
s01.background = { color: BG_WHITE };

// Left Column (x: 0.6, w: 4.8)
// Category Label
s01.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 0.7, w: 2.5, h: 0.3,
    fill: { color: C_PALE_GREEN }, line: { color: C_FOREST_MID, width: 1 }
});
s01.addText('PRESENTATION DIRECTION', {
    x: 0.6, y: 0.7, w: 2.5, h: 0.3,
    fontSize: 8.5, fontFace: FONT_TITLE, color: C_FOREST_DEEP, bold: true, align: 'center'
});

// Main Title
s01.addText('話す前に、\n勝負を決める。', {
    x: 0.6, y: 1.25, w: 4.8, h: 1.3,
    fontSize: 28, fontFace: FONT_TITLE, color: C_BLACK, bold: true, lineSpacing: 34
});

// Subtitle with Bronze Highlight
s01.addText([
    { text: '伝わらない想いを\n「　', options: { color: C_SLATE_MUTED } },
    { text: '選ばれるシナリオ', options: { color: C_BRONZE, bold: true } },
    { text: '　」へ再生する。', options: { color: C_SLATE_MUTED } }
], {
    x: 0.6, y: 2.65, w: 4.8, h: 0.75,
    fontSize: 15, fontFace: FONT_TITLE, bold: true, lineSpacing: 20
});

// Accent Hairline
s01.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 3.55, w: 2.0, h: 0.03, fill: { color: C_FOREST_MID }
});

// Profile Card
s01.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 3.75, w: 4.8, h: 1.35,
    fill: { color: BG_LIGHT }, line: { color: C_BORDER, width: 1 }
});
s01.addText('プレゼン演出家 ／ 元シニア経営コンサルタント', {
    x: 0.8, y: 3.88, w: 4.4, h: 0.22,
    fontSize: 9, fontFace: FONT_BODY, color: C_SLATE_MUTED
});
s01.addText('西川 佳孝', {
    x: 0.8, y: 4.12, w: 4.4, h: 0.45,
    fontSize: 18, fontFace: FONT_TITLE, color: C_FOREST_DEEP, bold: true
});
s01.addText('累計契約コンサルフィー5億円超の実戦と、ストアカ★4.9が導く「選ばれる構造」', {
    x: 0.8, y: 4.58, w: 4.4, h: 0.4,
    fontSize: 8, fontFace: FONT_BODY, color: C_SLATE_MUTED
});

// Right Column: Speaker Image inside Frame (x: 5.4, y: 0.6, w: 4.0, h: 4.5)
if (IMG_SPEAKER) {
    s01.addImage({
        path: IMG_SPEAKER,
        x: 5.4, y: 0.6, w: 4.0, h: 4.5,
        rounding: true
    });
}


// =============================================================
// SLIDE 02: 課題提起 (Giant 3D-Number Cards Layout)
// =============================================================
const s02 = pptx.addSlide();
addEditorialHeader(
    s02,
    'PROBLEM STATEMENT',
    'なぜ、あなたの想いは届かないのか？',
    '伝わらない最大の原因は、話し方ではなく「　話す順番（シナリオ）　」'
);

const pitfalls = [
    {
        num: '01',
        title: '知識の押し売り',
        sub: '相手目線の欠落',
        desc: '専門性を伝えようとするあまり、相手が本当に知りたい結論やメリットが見えなくなってしまう。',
        color: C_FOREST_DEEP,
        bgTint: 'F0F7F4'
    },
    {
        num: '02',
        title: '座学の迷子',
        sub: '構成力の不足',
        desc: '実技や想いはあるのに、いざ説明になると「　何をどう構成すべきか　」分からなくなってしまう。',
        color: C_SAGE,
        bgTint: 'F4F8F6'
    },
    {
        num: '03',
        title: '自分ファースト',
        sub: '共感ツカミの不在',
        desc: '相手が興味のない自己紹介から入ってしまい、冒頭数分で相手の心が離れてしまう。',
        color: C_BRONZE,
        bgTint: C_BRONZE_LIGHT
    }
];

pitfalls.forEach((item, idx) => {
    const xPos = 0.6 + idx * 3.02;

    // Giant Background Number (Layer 1: Behind Card)
    s02.addText(item.num, {
        x: xPos + 0.1, y: 1.45, w: 2.2, h: 1.3,
        fontSize: 72, fontFace: FONT_TITLE, color: item.bgTint, bold: true
    });

    // Main Card (Layer 2: Foreground Card)
    s02.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: 2.15, w: 2.8, h: 2.95,
        fill: { color: BG_CARD }, line: { color: C_BORDER, width: 1 }
    });

    // Top Accent Border Line
    s02.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: 2.15, w: 2.8, h: 0.08, fill: { color: item.color }
    });

    // Small Number Tag
    s02.addShape(pptx.shapes.RECTANGLE, {
        x: xPos + 0.2, y: 2.35, w: 0.6, h: 0.26,
        fill: { color: item.bgTint }, line: { color: item.color, width: 1 }
    });
    s02.addText(item.num, {
        x: xPos + 0.2, y: 2.35, w: 0.6, h: 0.26,
        fontSize: 9, fontFace: FONT_TITLE, color: item.color, bold: true, align: 'center'
    });

    // Card Title
    s02.addText(item.title, {
        x: xPos + 0.2, y: 2.7, w: 2.4, h: 0.35,
        fontSize: 13, fontFace: FONT_TITLE, color: C_BLACK, bold: true
    });
    s02.addText(item.sub, {
        x: xPos + 0.2, y: 3.05, w: 2.4, h: 0.25,
        fontSize: 9, fontFace: FONT_BODY, color: item.color, bold: true
    });

    // Card Body Description
    s02.addText(item.desc, {
        x: xPos + 0.2, y: 3.4, w: 2.4, h: 1.55,
        fontSize: 9.5, fontFace: FONT_BODY, color: C_SLATE_MUTED, lineSpacing: 15
    });
});


// =============================================================
// SLIDE 03: 独自思想 (Editorial Diagram & Philosophy)
// =============================================================
const s03 = pptx.addSlide();
addEditorialHeader(
    s03,
    'THE CORE PHILOSOPHY',
    '中身を変えなくても「　伝える順番　」を整えるだけで、評価も成果も跳ね上がる。'
);

// Left Column: 2 Core Concept Cards (x: 0.6, w: 4.7)
// Card 1: シナリオ9割
s03.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 1.5, w: 4.7, h: 1.7,
    fill: { color: BG_CARD }, line: { color: C_FOREST_MID, width: 1.5 }
});
s03.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 1.5, w: 4.7, h: 0.38, fill: { color: C_FOREST_DEEP }
});
s03.addText('CORE 01 ｜ シナリオ9割', {
    x: 0.8, y: 1.5, w: 4.3, h: 0.38,
    fontSize: 11, fontFace: FONT_TITLE, color: BG_WHITE, bold: true
});
s03.addText([
    { text: 'アドリブトーク、派手なスライド装飾は枝葉。\n\n', options: { color: C_SLATE_MUTED } },
    { text: '成果を決めるのは\n「　', options: { color: C_BLACK } },
    { text: '何を、どの順番で話すか', options: { color: C_FOREST_MID, bold: true } },
    { text: '　」の緻密な設計図。', options: { color: C_BLACK } }
], {
    x: 0.8, y: 1.98, w: 4.3, h: 1.1,
    fontSize: 9.5, fontFace: FONT_BODY, lineSpacing: 14
});

// Card 2: 結論ファースト
s03.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 3.35, w: 4.7, h: 1.7,
    fill: { color: BG_CARD }, line: { color: C_BRONZE, width: 1.5 }
});
s03.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 3.35, w: 4.7, h: 0.38, fill: { color: C_BRONZE }
});
s03.addText('CORE 02 ｜ 結論ファースト', {
    x: 0.8, y: 3.35, w: 4.3, h: 0.38,
    fontSize: 11, fontFace: FONT_TITLE, color: BG_WHITE, bold: true
});
s03.addText([
    { text: '「　自分が言いたいこと　」ではなく、\n\n', options: { color: C_SLATE_MUTED } },
    { text: '「　', options: { color: C_BLACK } },
    { text: '聞き手が最も知りたい結論', options: { color: C_BRONZE, bold: true } },
    { text: '　」ファーストで設計する。', options: { color: C_BLACK } }
], {
    x: 0.8, y: 3.83, w: 4.3, h: 1.1,
    fontSize: 9.5, fontFace: FONT_BODY, lineSpacing: 14
});

// Right Column: Gears & Drop Diagram Graphic (x: 5.5, y: 1.5, w: 3.9, h: 3.55)
if (IMG_GEARS) {
    s03.addImage({
        path: IMG_GEARS,
        x: 5.5, y: 1.5, w: 3.9, h: 3.55,
        rounding: true
    });
}


// =============================================================
// SLIDE 04: 実績・権威性 (Trophy Graphic & Clean Stats)
// =============================================================
const s04 = pptx.addSlide();
addEditorialHeader(
    s04,
    'TRACK RECORD & PROOF',
    '5億円のビジネス実戦と、公開レビュー「　★4.9　」が証明する再現性。'
);

// Left Column: 3 Stat Rows (x: 0.6, w: 4.7)
const stats = [
    { num: '5億円+', label: '累計契約コンサルフィー', desc: '元シニア経営コンサルタント（在籍16年）。数百社の実戦。' },
    { num: '★ 4.90', label: 'ストアカ受講者満足度', desc: '国内最大級マーケットで「新人先生賞」受賞。公開絶賛。' },
    { num: '3倍', label: '受講者契約単価向上', desc: '全国紙執筆、全国講演ゲスト講師、テレビ・ラジオ等へ進出。' }
];

stats.forEach((item, idx) => {
    const yPos = 1.45 + idx * 0.88;

    s04.addShape(pptx.shapes.RECTANGLE, {
        x: 0.6, y: yPos, w: 4.7, h: 0.78,
        fill: { color: BG_CARD }, line: { color: C_BORDER, width: 1 }
    });

    s04.addText(item.num, {
        x: 0.75, y: yPos + 0.1, w: 1.6, h: 0.55,
        fontSize: 18, fontFace: FONT_TITLE, color: C_FOREST_DEEP, bold: true
    });
    s04.addText(item.label, {
        x: 2.35, y: yPos + 0.1, w: 2.8, h: 0.25,
        fontSize: 9.5, fontFace: FONT_TITLE, color: C_BLACK, bold: true
    });
    s04.addText(item.desc, {
        x: 2.35, y: yPos + 0.35, w: 2.8, h: 0.35,
        fontSize: 8, fontFace: FONT_BODY, color: C_SLATE_MUTED
    });
});

// Bottom Instructor Genre Box
s04.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 4.18, w: 4.7, h: 1.0,
    fill: { color: C_PALE_GREEN }, line: { color: 'CBD5E1', width: 1 }
});
s04.addText('【支援実績】 料理、美容、コンサル、英会話、接客、幼児教育、エクセル、マインドフルネス、ヨガ、心理学、お金、パン教室、ボイストレーナー、風水師、アロマ、薬膳、話し方、SNS集客などの現役講師陣', {
    x: 0.75, y: 4.25, w: 4.4, h: 0.85,
    fontSize: 7.5, fontFace: FONT_BODY, color: C_FOREST_DEEP, lineSpacing: 11
});

// Right Column: Clean Gold Trophy Image (x: 5.5, y: 1.45, w: 3.9, h: 3.7)
if (IMG_TROPHY) {
    s04.addImage({
        path: IMG_TROPHY,
        x: 5.5, y: 1.45, w: 3.9, h: 3.7,
        rounding: true
    });
}


// =============================================================
// SLIDE 05: 独自メソッド (3-Step Editorial Cards)
// =============================================================
const s05 = pptx.addSlide();
addEditorialHeader(
    s05,
    'THE METHOD : 劇的Reプレゼン®',
    '数千回の実践経験をベースにした「　論理と心理　」で仕掛けるエンタメ演出メソッド。'
);

const steps = [
    {
        num: 'STEP 01',
        title: '本音抽出 & 目的選別',
        sub: 'Deep Extraction',
        desc: '言葉の奥にある本音を抽出し、目的と手段で選別する。\n\n「何を一番伝えたいのか」「相手にどう動いてほしいのか」の核を掘り起こします。',
        color: C_FOREST_DEEP
    },
    {
        num: 'STEP 02',
        title: '共感ツカミ & 再構成',
        sub: 'Scenario Architecture',
        desc: '心をツカム言葉へ翻訳し、聞き手が前のめりになるシナリオへ組み替える。\n\n相手目線の共感フックから本質へと一気に引き込むストーリーラインを構築。',
        color: C_SAGE
    },
    {
        num: 'STEP 03',
        title: '1スライド & リハーサル',
        sub: 'Direction & Simulation',
        desc: '余計な情報を削ぎ落としたスライド化と、現場をリアルに想定したシミュレーション。\n\n当日の現場を想定し、不安を自信に変えて本番へ臨みます。',
        color: C_BRONZE
    }
];

steps.forEach((st, idx) => {
    const xPos = 0.6 + idx * 3.02;

    // Card Box
    s05.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: 1.5, w: 2.8, h: 3.6,
        fill: { color: BG_CARD }, line: { color: C_BORDER, width: 1 }
    });

    // Header Color Block
    s05.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: 1.5, w: 2.8, h: 0.5, fill: { color: st.color }
    });
    s05.addText(st.num, {
        x: xPos, y: 1.5, w: 2.8, h: 0.5,
        fontSize: 12, fontFace: FONT_TITLE, color: BG_WHITE, bold: true, align: 'center'
    });

    // Subtag
    s05.addText(st.sub.toUpperCase(), {
        x: xPos + 0.15, y: 2.1, w: 2.5, h: 0.22,
        fontSize: 8, fontFace: FONT_TITLE, color: st.color, bold: true, align: 'center'
    });

    // Title
    s05.addText(st.title, {
        x: xPos + 0.15, y: 2.35, w: 2.5, h: 0.35,
        fontSize: 12, fontFace: FONT_TITLE, color: C_BLACK, bold: true, align: 'center'
    });

    // Divider
    s05.addShape(pptx.shapes.RECTANGLE, {
        x: xPos + 0.4, y: 2.8, w: 2.0, h: 0.02, fill: { color: C_BORDER }
    });

    // Description
    s05.addText(st.desc, {
        x: xPos + 0.2, y: 2.95, w: 2.4, h: 2.0,
        fontSize: 9, fontFace: FONT_BODY, color: C_SLATE_MUTED, lineSpacing: 14
    });
});


// =============================================================
// FILE OUTPUT
// =============================================================
const outputFile = path.join(__dirname, '営業資料_西川佳孝_新世界観版.pptx');
const desktopFile = path.join(process.env.USERPROFILE, 'OneDrive', 'デスクトップ', '営業資料_西川佳孝_新世界観版.pptx');

pptx.writeFile({ fileName: outputFile }).then(() => {
    try {
        fs.copyFileSync(outputFile, desktopFile);
    } catch(e) {}
    console.log('SUCCESS: Redesigned Editorial Presentation generated successfully!');
}).catch(err => {
    console.error('ERROR:', err);
});
