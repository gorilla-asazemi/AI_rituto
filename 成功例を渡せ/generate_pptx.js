const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new pptxgen();

// Standard LAYOUT_16x9 in pptxgenjs is 10.0 x 5.625 inches
pptx.layout = 'LAYOUT_16x9'; 
pptx.title = '新入社員向け 報連相再定義講座';

// Color Palette
const NAVY = '0F172A';
const SLATE = '1E293B';
const LIGHT_BG = 'F8FAFC';
const WHITE = 'FFFFFF';
const BLUE = '2563EB';
const AMBER = 'D97706';
const GREEN = '059669';
const GRAY_TEXT = '475569';
const DARK_TEXT = '0F172A';
const BORDER_COLOR = 'CBD5E1';
const RED_BG = 'FEF2F2';
const RED_TEXT = '991B1B';
const GREEN_BG = 'F0FDF4';
const GREEN_TEXT = '166534';

const FONT_MAIN = 'Meiryo';

// Helper for Slide Header (Canvas Width = 10.0, Height = 5.625)
function addSlideHeader(slide, titleText, categoryText, subText = null) {
    // Category Tag
    slide.addText(categoryText.toUpperCase(), {
        x: 0.5, y: 0.25, w: 4.0, h: 0.2,
        fontSize: 9.5, fontFace: FONT_MAIN, color: BLUE, bold: true
    });

    // Main Title
    slide.addText(titleText, {
        x: 0.5, y: 0.45, w: 9.0, h: 0.4,
        fontSize: 16, fontFace: FONT_MAIN, color: DARK_TEXT, bold: true
    });

    // Sub Title (Optional)
    if (subText) {
        slide.addText(subText, {
            x: 0.5, y: 0.85, w: 9.0, h: 0.3,
            fontSize: 10.5, fontFace: FONT_MAIN, color: BLUE, bold: true
        });
    }
}

// -------------------------------------------------------------
// SLIDE 1: Title Slide (Dark Theme)
// -------------------------------------------------------------
const slide1 = pptx.addSlide();
slide1.background = { color: NAVY };

// Category Tag
slide1.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 1.0, w: 3.0, h: 0.35,
    fill: { color: '1E293B' },
    line: { color: BLUE, width: 1.5 }
});
slide1.addText('新入社員向け コミュニケーション研修', {
    x: 0.6, y: 1.0, w: 3.0, h: 0.35,
    fontSize: 10, fontFace: FONT_MAIN, color: '60A5FA', bold: true, align: 'center'
});

// Title
slide1.addText('「報連相」再定義講座', {
    x: 0.6, y: 1.5, w: 8.8, h: 0.9,
    fontSize: 30, fontFace: FONT_MAIN, color: WHITE, bold: true
});

// Subtitle
slide1.addText('なぜあなたの報連相は伝わらないのか？\n【時間軸】で解き明かすビジネスコミュニケーションの基本', {
    x: 0.6, y: 2.5, w: 8.8, h: 0.8,
    fontSize: 14, fontFace: FONT_MAIN, color: '94A3B8', lineSpacing: 20
});

// Accent Line
slide1.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 3.6, w: 1.5, h: 0.04, fill: { color: BLUE }
});

// Speaker / Footer
slide1.addText('プレゼン演出・ビジネスコミュニケーション指導', {
    x: 0.6, y: 4.4, w: 8.8, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: '64748B'
});


// -------------------------------------------------------------
// SLIDE 2: Problem Statement
// -------------------------------------------------------------
const slide2 = pptx.addSlide();
slide2.background = { color: LIGHT_BG };
addSlideHeader(slide2, 'なぜ「報連相」はこんなにも難しいのか？', 'PROBLEM STATEMENT');

// Banner
slide2.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 9.0, h: 0.55,
    fill: { color: 'FEF3C7' },
    line: { color: AMBER, width: 1 }
});
slide2.addText('最大の問題は、報連相の従来の定義が「抽象的すぎて誰も理解できていないこと」', {
    x: 0.6, y: 0.95, w: 8.8, h: 0.55,
    fontSize: 12, fontFace: FONT_MAIN, color: '92400E', bold: true, align: 'center'
});

// Left Card (Width = 4.35, x = 0.5)
slide2.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.65, w: 4.35, h: 3.5,
    fill: { color: WHITE }, line: { color: BORDER_COLOR, width: 1 }
});
slide2.addText('抽象的で曖昧な従来の教えられ方', {
    x: 0.7, y: 1.8, w: 3.95, h: 0.3,
    fontSize: 12, fontFace: FONT_MAIN, color: SLATE, bold: true
});
const textLeft = [
    { text: '・「とにかくこまめに報告しなさい」\n' },
    { text: '・「状況が変わったらすぐ連絡しろ」\n' },
    { text: '・「自分で抱え込まず相談しなさい」\n\n' },
    { text: '➔ 基準が人によってバラバラで、結局どうすればいいのか分からない！', options: { color: RED_TEXT, bold: true } }
];
slide2.addText(textLeft, {
    x: 0.7, y: 2.2, w: 3.95, h: 2.8,
    fontSize: 10, fontFace: FONT_MAIN, color: GRAY_TEXT, lineSpacing: 16
});

// Right Card (Width = 4.35, x = 5.15 -> 5.15 + 4.35 = 9.5)
slide2.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15, y: 1.65, w: 4.35, h: 3.5,
    fill: { color: WHITE }, line: { color: BORDER_COLOR, width: 1 }
});
slide2.addText('現場で多発するコミュニケーション不全', {
    x: 5.35, y: 1.8, w: 3.95, h: 0.3,
    fontSize: 12, fontFace: FONT_MAIN, color: SLATE, bold: true
});
const textRight = [
    { text: '・上司：「で、結局何が言いたいの？」とイライラ\n' },
    { text: '・若手：「どこまで話せばいいのか分からない」\n' },
    { text: '・「指示待ち」と言われるか「勝手に動くな」と言われる\n\n' },
    { text: '➔ 努力の方向性がズレていて、お互いにストレス！', options: { color: RED_TEXT, bold: true } }
];
slide2.addText(textRight, {
    x: 5.35, y: 2.2, w: 3.95, h: 2.8,
    fontSize: 10, fontFace: FONT_MAIN, color: GRAY_TEXT, lineSpacing: 16
});


// -------------------------------------------------------------
// SLIDE 3: The Solution (Core Concept - 3 Columns inside 10.0 in)
// -------------------------------------------------------------
const slide3 = pptx.addSlide();
slide3.background = { color: LIGHT_BG };
addSlideHeader(
    slide3,
    '解決の鍵：報連相は「時間軸」で分ければ9割解決する！',
    'SOLUTION CONCEPT',
    '情報に「過去・現在・未来」のラベルを貼るだけで、ミスマッチは消滅する'
);

// Card Width = 2.85, Total = 0.5 + 2.85 + 0.22 + 2.85 + 0.22 + 2.85 = 9.49 (Fits within 9.5)
// Card 1: 報告 (過去)
slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.25, w: 2.85, h: 3.9,
    fill: { color: WHITE }, line: { color: BLUE, width: 1.5 }
});
slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.25, w: 2.85, h: 0.55, fill: { color: BLUE }
});
slide3.addText('報告 ＝ 【過去】', {
    x: 0.5, y: 1.25, w: 2.85, h: 0.55,
    fontSize: 14, fontFace: FONT_MAIN, color: WHITE, bold: true, align: 'center'
});
slide3.addText('「起きた事実」の共有', {
    x: 0.6, y: 1.9, w: 2.65, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: DARK_TEXT, bold: true, align: 'center'
});
slide3.addText('・すでに完了したこと\n・確定した実績や数値\n・発生した出来事\n\n★感情や主観を入れず、ありのままの「過去の事実」を正確に切り取って伝える。', {
    x: 0.65, y: 2.25, w: 2.55, h: 2.8,
    fontSize: 9.5, fontFace: FONT_MAIN, color: GRAY_TEXT, lineSpacing: 15
});

// Card 2: 連絡 (現在)
slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 3.57, y: 1.25, w: 2.85, h: 3.9,
    fill: { color: WHITE }, line: { color: AMBER, width: 1.5 }
});
slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 3.57, y: 1.25, w: 2.85, h: 0.55, fill: { color: AMBER }
});
slide3.addText('連絡 ＝ 【現在】', {
    x: 3.57, y: 1.25, w: 2.85, h: 0.55,
    fontSize: 14, fontFace: FONT_MAIN, color: WHITE, bold: true, align: 'center'
});
slide3.addText('「現在の状況」の共有', {
    x: 3.67, y: 1.9, w: 2.65, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: DARK_TEXT, bold: true, align: 'center'
});
slide3.addText('・今進行しているステータス\n・スケジュールの変更点\n・現在の状況・予定\n\n★関係する全員の認識を「今」に揃えるため、フラットかつ迅速に発信する。', {
    x: 3.72, y: 2.25, w: 2.55, h: 2.8,
    fontSize: 9.5, fontFace: FONT_MAIN, color: GRAY_TEXT, lineSpacing: 15
});

// Card 3: 相談 (未来)
slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 6.65, y: 1.25, w: 2.85, h: 3.9,
    fill: { color: WHITE }, line: { color: GREEN, width: 1.5 }
});
slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 6.65, y: 1.25, w: 2.85, h: 0.55, fill: { color: GREEN }
});
slide3.addText('相談 ＝ 【未来】', {
    x: 6.65, y: 1.25, w: 2.85, h: 0.55,
    fontSize: 14, fontFace: FONT_MAIN, color: WHITE, bold: true, align: 'center'
});
slide3.addText('「これからの行動」の共創', {
    x: 6.75, y: 1.9, w: 2.65, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: DARK_TEXT, bold: true, align: 'center'
});
slide3.addText('・これからどう動くべきか\n・判断に迷う課題やリスク\n・自分の考え・方針案\n\n★未来の失敗を防ぐため、自分の仮説・意見を持ってアドバイスを求める。', {
    x: 6.8, y: 2.25, w: 2.55, h: 2.8,
    fontSize: 9.5, fontFace: FONT_MAIN, color: GRAY_TEXT, lineSpacing: 15
});


// -------------------------------------------------------------
// SLIDE 4: Detail - 報告 (Past)
// -------------------------------------------------------------
const slide4 = pptx.addSlide();
slide4.background = { color: LIGHT_BG };
addSlideHeader(slide4, '【報告 ＝ 過去】「事実」と「感情・推測」を分離する', 'DEEP DIVE: HOKOKU');

// Definition Box
slide4.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 9.0, h: 0.75,
    fill: { color: WHITE }, line: { color: BLUE, width: 1 }
});
slide4.addText('報告の本質：過去に確定した「事実・結果」のみを客観的に切り取る', {
    x: 0.7, y: 1.02, w: 8.6, h: 0.3,
    fontSize: 11.5, fontFace: FONT_MAIN, color: BLUE, bold: true
});
slide4.addText('上司が知りたいのは「あなたの感想」ではなく「何が起きたか」という客観的事実です。推測や感情を混ぜると判断を誤ります。', {
    x: 0.7, y: 1.32, w: 8.6, h: 0.35,
    fontSize: 9.5, fontFace: FONT_MAIN, color: GRAY_TEXT
});

// BAD Box (x = 0.5, w = 4.35)
slide4.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.8, w: 4.35, h: 3.35,
    fill: { color: RED_BG }, line: { color: 'FCA5A5', width: 1 }
});
slide4.addText('❌ 誤った報告（事実と推測が混ざっている）', {
    x: 0.7, y: 1.95, w: 3.95, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: RED_TEXT, bold: true
});
slide4.addText('「A社の件、打ち合わせはいい雰囲気だったので、たぶん契約できると思います」\n\n【何が問題？】\n・「いい雰囲気」は主観・感情\n・「契約できると思う」は未来の推測\n・上司は結局「今どうなったか」が分からない', {
    x: 0.7, y: 2.3, w: 3.95, h: 2.7,
    fontSize: 9.5, fontFace: FONT_MAIN, color: '7F1D1D', lineSpacing: 15
});

// GOOD Box (x = 5.15, w = 4.35 -> 5.15 + 4.35 = 9.5)
slide4.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15, y: 1.8, w: 4.35, h: 3.35,
    fill: { color: GREEN_BG }, line: { color: '86EFAC', width: 1 }
});
slide4.addText('⭕ 正しい報告（事実と所感を分けている）', {
    x: 5.35, y: 1.95, w: 3.95, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: GREEN_TEXT, bold: true
});
slide4.addText('「A社の件、本日14時に見積書の提出が完了しました（事実）。手応えとしては感触が良く、契約の可能性が高いと考えています（所感）」\n\n【ここがポイント！】\n・最初に「完了した事実」を言う\n・自分の見解は「所感です」と明確に区別する', {
    x: 5.35, y: 2.3, w: 3.95, h: 2.7,
    fontSize: 9.5, fontFace: FONT_MAIN, color: '14532D', lineSpacing: 15
});


// -------------------------------------------------------------
// SLIDE 5: Detail - 連絡 (Present)
// -------------------------------------------------------------
const slide5 = pptx.addSlide();
slide5.background = { color: LIGHT_BG };
addSlideHeader(slide5, '【連絡 ＝ 現在】「今の状況」をフラットに関係者へ届ける', 'DEEP DIVE: RENRAKU');

// Definition Box
slide5.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 9.0, h: 0.75,
    fill: { color: WHITE }, line: { color: AMBER, width: 1 }
});
slide5.addText('連絡の本質：進行中の「現在地」を関係全員にタイムリーに共有する', {
    x: 0.7, y: 1.02, w: 8.6, h: 0.3,
    fontSize: 11.5, fontFace: FONT_MAIN, color: AMBER, bold: true
});
slide5.addText('連絡に自分の評価や意見は不要です。「今どうなっているか」「何が変わったか」の状況を漏れなくスピーディに回覧します。', {
    x: 0.7, y: 1.32, w: 8.6, h: 0.35,
    fontSize: 9.5, fontFace: FONT_MAIN, color: GRAY_TEXT
});

// 3 Rules of Renraku
const rules = [
    { title: '1. 関係者「全員」に共有', desc: '特定の人だけに伝えて他が知らない状態（情報の孤立）を防ぐ。宛先漏れをなくす。' },
    { title: '2. 第一報は「スピード重視」', desc: '状況が確定していなくても「現在〇〇の状況です」と第一報を入れることで周囲が動ける。' },
    { title: '3. 変更・異変を隠さない', desc: 'スケジュール遅延やトラブルの予兆こそ「現在の連絡」として即座に発信する。' }
];

rules.forEach((r, idx) => {
    const yPos = 1.8 + (idx * 1.1);
    slide5.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: yPos, w: 9.0, h: 0.95,
        fill: { color: WHITE }, line: { color: BORDER_COLOR, width: 1 }
    });
    slide5.addText(r.title, {
        x: 0.7, y: yPos + 0.12, w: 4.0, h: 0.3,
        fontSize: 11, fontFace: FONT_MAIN, color: SLATE, bold: true
    });
    slide5.addText(r.desc, {
        x: 0.7, y: yPos + 0.45, w: 8.6, h: 0.4,
        fontSize: 9.5, fontFace: FONT_MAIN, color: GRAY_TEXT
    });
});


// -------------------------------------------------------------
// SLIDE 6: Detail - 相談 (Future) - Perfect 9.5 in Width Control!
// -------------------------------------------------------------
const slide6 = pptx.addSlide();
slide6.background = { color: LIGHT_BG };
addSlideHeader(slide6, '【相談 ＝ 未来】自分の意見を持って「これからの行動」を決める', 'DEEP DIVE: SODAN');

// Definition Box
slide6.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 9.0, h: 0.75,
    fill: { color: WHITE }, line: { color: GREEN, width: 1 }
});
slide6.addText('相談の本質：未来の失敗を防ぎ、最適解を選ぶためにアドバイスを求める', {
    x: 0.7, y: 1.02, w: 8.6, h: 0.3,
    fontSize: 11.5, fontFace: FONT_MAIN, color: GREEN, bold: true
});
slide6.addText('ただ「指示を仰ぐ」のではなく、自分の「仮説（未来の案）」を持って臨むことで、上司の知恵を100%引き出せます。', {
    x: 0.7, y: 1.32, w: 8.6, h: 0.35,
    fontSize: 9.5, fontFace: FONT_MAIN, color: GRAY_TEXT
});

// BAD Box (x = 0.5, w = 4.35)
slide6.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.8, w: 4.35, h: 3.35,
    fill: { color: WHITE }, line: { color: BORDER_COLOR, width: 1 }
});
slide6.addText('❌ 丸投げの相談（NG）', {
    x: 0.7, y: 1.95, w: 3.95, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: RED_TEXT, bold: true
});
slide6.addText('「〇〇のトラブルが起きました。どうすればいいですか？」\n\n【なぜダメ？】\n・自分の考えがゼロ（思考放棄）\n・上司に一から問題を丸投げしている\n・「指示待ち人間」の評価につながる', {
    x: 0.7, y: 2.3, w: 3.95, h: 2.7,
    fontSize: 9.5, fontFace: FONT_MAIN, color: GRAY_TEXT, lineSpacing: 15
});

// GOOD Box (x = 5.15, w = 4.35 -> Total Right Edge = 9.5 in -> PERFECT!)
slide6.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15, y: 1.8, w: 4.35, h: 3.35,
    fill: { color: WHITE }, line: { color: GREEN, width: 1.5 }
});
slide6.addText('⭕ 仮説提案型の相談（GOOD）', {
    x: 5.35, y: 1.95, w: 3.95, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: GREEN, bold: true
});
slide6.addText('「〇〇の件で課題が生じました。私はA案が有効と考えますが、B案のリスクも懸念しています。ご意見をいただけますか？」\n\n【ここが素晴らしい！】\n・自分なりの未来の解決策（仮説）がある\n・上司は「YES/NO」や修正指示だけで判断できる', {
    x: 5.35, y: 2.3, w: 3.95, h: 2.7,
    fontSize: 9.5, fontFace: FONT_MAIN, color: DARK_TEXT, lineSpacing: 15
});


// -------------------------------------------------------------
// SLIDE 7: Summary & Action Plan (Dark Theme)
// -------------------------------------------------------------
const slide7 = pptx.addSlide();
slide7.background = { color: NAVY };

// Title
slide7.addText('SUMMARY', {
    x: 0.5, y: 0.25, w: 4.0, h: 0.2,
    fontSize: 9.5, fontFace: FONT_MAIN, color: '60A5FA', bold: true
});
slide7.addText('まとめ｜明日から使える報連相マスターの3ステップ', {
    x: 0.5, y: 0.45, w: 9.0, h: 0.4,
    fontSize: 16, fontFace: FONT_MAIN, color: WHITE, bold: true
});

// Step 1
slide7.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.05, w: 9.0, h: 1.0,
    fill: { color: SLATE }, line: { color: BLUE, width: 1 }
});
slide7.addText('Step 1', {
    x: 0.7, y: 1.2, w: 1.2, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: '60A5FA', bold: true
});
slide7.addText('口を開く前に「これは過去・現在・未来のどれ？」と1秒考える', {
    x: 1.9, y: 1.2, w: 7.4, h: 0.6,
    fontSize: 11.5, fontFace: FONT_MAIN, color: WHITE, bold: true
});

// Step 2
slide7.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 2.2, w: 9.0, h: 1.0,
    fill: { color: SLATE }, line: { color: AMBER, width: 1 }
});
slide7.addText('Step 2', {
    x: 0.7, y: 2.35, w: 1.2, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: 'FBBF24', bold: true
});
slide7.addText('時間に合わせた形式で伝える（過去＝事実のみ / 現在＝即共有 / 未来＝意見付き）', {
    x: 1.9, y: 2.35, w: 7.4, h: 0.6,
    fontSize: 11.5, fontFace: FONT_MAIN, color: WHITE, bold: true
});

// Step 3
slide7.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 3.35, w: 9.0, h: 1.0,
    fill: { color: SLATE }, line: { color: '34D399', width: 1 }
});
slide7.addText('Step 3', {
    x: 0.7, y: 3.5, w: 1.2, h: 0.3,
    fontSize: 11, fontFace: FONT_MAIN, color: '34D399', bold: true
});
slide7.addText('上司との認識ズレがゼロになり、仕事のスピードと信頼が爆発的に向上する！', {
    x: 1.9, y: 3.5, w: 7.4, h: 0.6,
    fontSize: 11.5, fontFace: FONT_MAIN, color: WHITE, bold: true
});

// Final Message
slide7.addText('時間軸を意識するだけで、あなたの報連相は今日から劇的に変わります。', {
    x: 0.5, y: 4.7, w: 9.0, h: 0.4,
    fontSize: 11, fontFace: FONT_MAIN, color: '94A3B8', align: 'center', italic: true
});

// Output path
const fileFixed = path.join(__dirname, '報連相講座_新入社員向け_完成版.pptx');
const desktopFixed = path.join(process.env.USERPROFILE, 'OneDrive', 'デスクトップ', '報連相講座_新入社員向け_完成版.pptx');

pptx.writeFile({ fileName: fileFixed }).then(() => {
    try {
        fs.copyFileSync(fileFixed, desktopFixed);
    } catch(e) {}
    console.log(`Successfully generated perfect layout presentation.`);
}).catch(err => {
    console.error(`Error generating presentation: ${err}`);
});
