document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const openingPage = document.getElementById('opening-page');
    const questionPage = document.getElementById('question-page');
    const resultPage1 = document.getElementById('result-page-1');
    const resultPage3 = document.getElementById('result-page-3');

    const startButton = document.getElementById('start-button');
    const questionText = document.getElementById('question-text');
    const answerOptionsDiv = document.getElementById('answer-options');
    const progressText = document.getElementById('progress-text');
    const backButton = document.getElementById('back-button');

    const recommendedMenuTitle = document.getElementById('recommended-menu-title');
    const recommendedMenuDescription = document.getElementById('recommended-menu-description');
    const recommendedMenuImage = document.getElementById('recommended-menu-image');
    const reserveButton = document.getElementById('reserve-button');
    const restartButton = document.getElementById('restart-button');
    const nextToOptionsButton = document.getElementById('next-to-options-button');
    const backToResult1From3Button = document.getElementById('back-to-result1-from3-button');

    const recommendedOptionsList = document.getElementById('recommended-options');

    // --- State Variables ---
    let currentQuestionIndex = 0;
    let userAnswers = []; // Stores scores for each question
    let totalScore = 0;

    // --- Data Definitions ---
    const questions = [
        {
            id: 'q1',
            text: '肌の悩みで最も気になるものは何ですか？',
            options: [
                { text: '乾燥・カサつき', score: 10 },
                { text: 'たるみ・しわ', score: 20 },
                { text: 'くすみ・シミ', score: 15 },
                { text: '毛穴・キメ', score: 12 },
                { text: 'ニキビ・肌荒れ', score: 5 }
            ]
        },
        {
            id: 'q_expect',
            text: 'どのような効果を最も期待しますか？',
            options: [
                { text: 'リラックスしたい', score: 0 },
                { text: 'すぐに効果を実感したい', score: 0 },
                { text: '肌質を根本から改善したい', score: 0 },
                { text: '特別な日のためのケアがしたい', score: 0 }
            ]
        },
        {
            id: 'q2',
            text: '普段の運動習慣について教えてください。',
            options: [
                { text: '週3回以上', score: 5 },
                { text: '週1〜2回', score: 10 },
                { text: 'ほとんどしない', score: 15 }
            ]
        },
        {
            id: 'q3',
            text: '平均的な睡眠時間はどのくらいですか？',
            options: [
                { text: '8時間以上', score: 5 },
                { text: '6〜7時間', score: 10 },
                { text: '5時間以下', score: 15 }
            ]
        },
        {
            id: 'q4',
            text: '食生活で意識していることはありますか？',
            options: [
                { text: 'バランスの取れた食事', score: 5 },
                { text: '野菜を多めに摂る', score: 10 },
                { text: '特に意識していない', score: 15 }
            ]
        },
        {
            id: 'q5',
            text: 'ストレスを感じることは多いですか？',
            options: [
                { text: 'ほとんどない', score: 5 },
                { text: 'たまにある', score: 10 },
                { text: 'よくある', score: 15 }
            ]
        },
        {
            id: 'q6',
            text: '年齢をお聞かせください。',
            options: [
                { text: '～34歳', score: 2 },
                { text: '35–39歳', score: 5 },
                { text: '40–44歳', score: 10 },
                { text: '45–49歳', score: 15 },
                { text: '50–54歳', score: 20 },
                { text: '55–59歳', score: 25 },
                { text: '60–64歳', score: 30 },
                { text: '65歳以上', score: 35 }
            ]
        }
    ];

    const menus = [
        {
            id: 'm1',
            name: '超音波エステコース',
            description: '超音波の振動で肌の深層までアプローチし、リフトアップとハリを実感できます。乾燥やたるみが気になる方におすすめです。',
            minScore: 0,
            maxScore: 30,
            image: 'ultrasonic.jpg' // Placeholder image
        },
        {
            id: 'm2',
            name: 'ハイパーナイフコース',
            description: '高周波で脂肪を温め、燃焼を促進します。むくみやくすみが気になる方、スッキリとしたフェイスラインを目指したい方におすすめです。',
            minScore: 31,
            maxScore: 60,
            image: 'hyperknife.jpg' // Placeholder image
        },
        {
            id: 'm3',
            name: '水素吸引コース',
            description: '高濃度の水素を吸引することで、体内の活性酸素を除去し、肌のトーンアップとデトックス効果が期待できます。肌荒れやストレスが気になる方におすすめです。',
            minScore: 61,
            maxScore: 100,
            image: 'hydrogen.jpg' // Placeholder image
        }
    ];

    const options = [
        { id: 'opt1', name: '保湿パック', description: '肌に潤いを与え、乾燥を防ぎます。' },
        { id: 'opt2', name: 'リンパマッサージ', description: '血行を促進し、老廃物の排出を助けます。' },
        { id: 'opt3', name: 'ビタミンCトリートメント', description: '肌のトーンを明るくし、シミやくすみにアプローチします。' }
    ];

    // --- Functions ---
    function showPage(pageToShow) {
        const pages = [openingPage, questionPage, resultPage1, resultPage3];
        pages.forEach(page => {
            if (page === pageToShow) {
                page.style.display = 'block';
            } else {
                page.style.display = 'none';
            }
        });
    }

    function startCounseling() {
        currentQuestionIndex = 0;
        userAnswers = [];
        totalScore = 0;
        displayQuestion();
        showPage(questionPage);
    }

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionText.innerHTML = question.text; // Use innerHTML to render <br>
            answerOptionsDiv.innerHTML = ''; // Clear previous options

            question.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option.text;
                button.dataset.score = option.score;
                button.addEventListener('click', () => handleAnswer(option.score));
                answerOptionsDiv.appendChild(button);
            });

            progressText.textContent = `${currentQuestionIndex + 1}/${questions.length}ページ`;
            backButton.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
        } else {
            calculateResult();
            displayResult();
        }
    }

    function handleAnswer(score) {
        userAnswers[currentQuestionIndex] = score; // Store score for current question
        totalScore += score; // Accumulate total score
        currentQuestionIndex++;
        displayQuestion(); // Move to next question or results
    }

    function goBack() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            totalScore -= userAnswers[currentQuestionIndex]; // Remove score of previous question
            userAnswers.pop(); // Remove last answer
            displayQuestion();
        }
    }

    function calculateResult() {
        let recommendedMenu = null;
        for (const menu of menus) {
            if (totalScore >= menu.minScore && totalScore <= menu.maxScore) {
                recommendedMenu = menu;
                break;
            }
        }
        return recommendedMenu;
    }

    function displayResult() {
        const recommendedMenu = calculateResult();

        // Result Page 1
        if (recommendedMenu) {
            recommendedMenuTitle.textContent = recommendedMenu.name;
            recommendedMenuDescription.textContent = recommendedMenu.description;
            if (recommendedMenu.image) {
                recommendedMenuImage.src = `./images/${recommendedMenu.image}`;
                recommendedMenuImage.alt = recommendedMenu.name;
                recommendedMenuImage.style.display = 'block'; // Ensure image is visible
            } else {
                recommendedMenuImage.style.display = 'none'; // Hide if no image
            }
        } else {
            recommendedMenuTitle.textContent = 'おすすめのメニューが見つかりませんでした。';
            recommendedMenuDescription.textContent = '恐れ入りますが、もう一度お試しください。';
            recommendedMenuImage.style.display = 'none'; // Hide image if no recommendation
        }
        showPage(resultPage1);

        // Result Page 3 (Recommended Options)
        recommendedOptionsList.innerHTML = '';
        options.forEach(opt => {
            const li = document.createElement('li');
            li.textContent = `${opt.name}: ${opt.description}`;
            recommendedOptionsList.appendChild(li);
        });
    }

    function restartCounseling() {
        showPage(openingPage);
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startCounseling);
    backButton.addEventListener('click', goBack);
    restartButton.addEventListener('click', restartCounseling);
    reserveButton.addEventListener('click', () => alert('申し込みページへ遷移します。')); // Placeholder for reservation

    nextToOptionsButton.addEventListener('click', () => showPage(resultPage3));
    backToResult1From3Button.addEventListener('click', () => showPage(resultPage1));

    // Initial display
    showPage(openingPage);
});