console.log("Bienvenue sur le site dédié aux Kurdes, à leur histoire et à leurs langues !");

// Quiz interactif Kurmanji & Zazaki
const quizData = {
    kurmanji: [
        {
            question: "Comment dit-on 'Bonjour' en kurmanji ?",
            answers: ["Slav", "Rojbaş", "Merheba", "Selam"],
            correct: 0
        },
        {
            question: "Comment dit-on 'Merci' en kurmanji ?",
            answers: ["Spas", "Supas", "Mamnoon", "Danke"],
            correct: 0
        },
        {
            question: "Comment dit-on 'Comment ça va ?' en kurmanji ?",
            answers: ["Tu çawa yî?", "Tu başî?", "Tu nasî?", "Tu kî yî?"],
            correct: 0
        }
    ],
    zazaki: [
        {
            question: "Comment dit-on 'Bonjour' en zazaki ?",
            answers: ["Rojbaş", "Slav", "Merheba", "Selam"],
            correct: 0
        },
        {
            question: "Comment dit-on 'Merci' en zazaki ?",
            answers: ["Supas", "Spas", "Mamnoon", "Danke"],
            correct: 0
        },
        {
            question: "Comment dit-on 'Comment ça va ?' en zazaki ?",
            answers: ["Tu çawa yî?", "Tu başî?", "Tu nasî?", "Tu kî yî?"],
            correct: 0
        }
    ]
};

let currentQuiz = [];
let currentQuestion = 0;
let score = 0;

const langueSelect = document.getElementById('langue-select');
const startBtn = document.getElementById('start-quiz');
const questionDiv = document.getElementById('quiz-question');
const answersDiv = document.getElementById('quiz-answers');
const resultDiv = document.getElementById('quiz-result');

if (startBtn) {
    startBtn.addEventListener('click', () => {
        const langue = langueSelect.value;
        currentQuiz = quizData[langue];
        currentQuestion = 0;
        score = 0;
        resultDiv.textContent = '';
        showQuestion();
    });
}

function showQuestion() {
    if (currentQuestion >= currentQuiz.length) {
        questionDiv.textContent = '';
        answersDiv.innerHTML = '';
        resultDiv.textContent = `Quiz terminé ! Votre score : ${score} / ${currentQuiz.length}`;
        return;
    }
    const q = currentQuiz[currentQuestion];
    questionDiv.textContent = q.question;
    answersDiv.innerHTML = '';
    q.answers.forEach((ans, idx) => {
        const btn = document.createElement('button');
        btn.textContent = ans;
        btn.onclick = () => {
            if (idx === q.correct) {
                score++;
            }
            currentQuestion++;
            showQuestion();
        };
        answersDiv.appendChild(btn);
    });
} 