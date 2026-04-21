const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwvGI5vHDLcWI2AI32b6qcOOJbb96juLs-H_G6AogrbAOoCxjwZ_NYH4baOO84BsH29/exec";

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const userNameInput = document.getElementById("userName");
const startBtn = document.getElementById("startBtn");

const progressText = document.getElementById("progressText");
const userLabel = document.getElementById("userLabel");
const questionImage = document.getElementById("questionImage");
const questionTextJa = document.getElementById("questionTextJa");
const questionTextEn = document.getElementById("questionTextEn");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

const resultName = document.getElementById("resultName");
const scoreText = document.getElementById("scoreText");
const passStatus = document.getElementById("passStatus");
const resultDetail = document.getElementById("resultDetail");
const submitStatus = document.getElementById("submitStatus");
const restartBtn = document.getElementById("restartBtn");

let allQuestions = [];
let selectedQuestions = [];
let currentIndex = 0;
let score = 0;
let userName = "";
let userAnswers = [];

async function loadQuestions() {
  const response = await fetch("./data/questions.json");
  if (!response.ok) {
    throw new Error("Failed to load questions.json");
  }
  return await response.json();
}

function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function startQuiz() {
  userName = userNameInput.value.trim();

  if (!userName) {
    alert("Please enter your name first.");
    return;
  }

  if (allQuestions.length < 30) {
    alert("The question database must contain at least 30 questions.");
    return;
  }

  selectedQuestions = shuffleArray(allQuestions).slice(0, 30);
  currentIndex = 0;
  score = 0;
  userAnswers = [];

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  renderQuestion();
}

function renderQuestion() {
  const q = selectedQuestions[currentIndex];

  progressText.textContent = `Question ${currentIndex + 1} / ${selectedQuestions.length}`;
  userLabel.textContent = `Name: ${userName}`;
  questionImage.src = q.image;
  questionTextJa.textContent = q.question_ja;
  questionTextEn.textContent = q.question_en; 
}

function handleAnswer(userAnswer) {
  const currentQuestion = selectedQuestions[currentIndex];
  const isCorrect = userAnswer === currentQuestion.answer;

  if (isCorrect) score++;

    userAnswers.push({
        questionId: currentQuestion.id,
        questionJa: currentQuestion.question_ja,
        questionEn: currentQuestion.question_en,
        image: currentQuestion.image,
        correctAnswer: currentQuestion.answer,
        correctExplanationJa: currentQuestion.correct_explanation_ja,
        correctExplanationEn: currentQuestion.correct_explanation_en,
        userAnswer: userAnswer,
        isCorrect: isCorrect
        });

  currentIndex++;

  if (currentIndex < selectedQuestions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

async function sendResultToGoogleSheet() {
  const wrongAnswersOnly = userAnswers.filter(item => !item.isCorrect);

  const payload = {
    name: userName,
    score: score,
    total: selectedQuestions.length,
    answers: wrongAnswersOnly
  };

  try {
    submitStatus.textContent = "Saving result...";
    submitStatus.className = "text-center text-sm mb-4 text-slate-500";

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      submitStatus.textContent = "Result saved successfully to Google Sheet.";
      submitStatus.className = "text-center text-sm mb-4 text-green-600";
    } else {
      submitStatus.textContent = "Failed to save result: " + result.message;
      submitStatus.className = "text-center text-sm mb-4 text-red-600";
    }
  } catch (error) {
    submitStatus.textContent = "An error occurred while sending the result.";
    submitStatus.className = "text-center text-sm mb-4 text-red-600";
    console.error(error);
  }
}

function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  resultName.textContent = `Name: ${userName}`;
  scoreText.textContent = `${score} / ${selectedQuestions.length}`;

  if (score >= 25) {
    passStatus.textContent = "合格 (Passed)";
    passStatus.className = "text-center text-2xl font-bold mb-6 text-green-600";
  } else {
    passStatus.textContent = "不合格 (Failed)";
    passStatus.className = "text-center text-2xl font-bold mb-6 text-red-600";
  }

  resultDetail.innerHTML = userAnswers.map((item, index) => {
    return `
        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">
        <p class="font-semibold text-slate-800 mb-3">Question ${index + 1}</p>

        <img
            src="${item.image}"
            alt="Traffic Sign ${index + 1}"
            class="w-full max-h-56 object-contain bg-white rounded-xl border border-slate-200 mb-4"
        />

        <p class="text-slate-800 font-medium mb-1">${item.questionJa}</p>
        <p class="text-slate-600 mb-3">${item.questionEn}</p>

        <p class="${item.isCorrect ? 'text-green-600' : 'text-red-600'} font-medium mb-1">
            Your answer: ${item.userAnswer ? "True" : "False"}
        </p>

        <p class="text-slate-700 font-medium mb-3">
            Correct answer: ${item.correctAnswer ? "True" : "False"}
        </p>

        <div class="bg-white border border-slate-200 rounded-xl p-3">
            <p class="text-slate-800 font-medium mb-1">${item.correctExplanationJa || ""}</p>
            <p class="text-slate-600 text-sm">${item.correctExplanationEn || ""}</p>
        </div>
        </div>
    `;
    }).join(""); 

  sendResultToGoogleSheet();
}

startBtn.addEventListener("click", startQuiz);
trueBtn.addEventListener("click", () => handleAnswer(true));
falseBtn.addEventListener("click", () => handleAnswer(false));

restartBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  userNameInput.value = "";
  submitStatus.textContent = "";
  passStatus.textContent = "";
});

(async function init() {
  try {
    allQuestions = await loadQuestions();
  } catch (error) {
    alert("Failed to load question data.");
    console.error(error);
  }
})();