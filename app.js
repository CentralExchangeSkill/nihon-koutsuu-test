const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxMrrYcHl1g3qUoK8_0FDMhnjDbeuHc4NZZ-PgTzSSzp4bVgibjEzsVt8PP1QwspUVv/exec";

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
const questionTextNe = document.getElementById("questionTextNe");
const questionTextHi = document.getElementById("questionTextHi");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

const resultName = document.getElementById("resultName");
const scoreText = document.getElementById("scoreText");
const passStatus = document.getElementById("passStatus");
const resultDetail = document.getElementById("resultDetail");
const submitStatus = document.getElementById("submitStatus");
const restartBtn = document.getElementById("restartBtn");

const testModeButtons = document.querySelectorAll(".test-mode-btn");
const testModeError = document.getElementById("testModeError");

const trueFalseArea = document.getElementById("trueFalseArea");
const extraQuestionArea = document.getElementById("extraQuestionArea");
const extraChoices = document.getElementById("extraChoices");
const submitExtraBtn = document.getElementById("submitExtraBtn");

let selectedTestMode = "";
let currentQuestionSource = [];
let allQuestions = [];
let selectedQuestions = [];
let currentIndex = 0;
let score = 0;
let userName = "";
let userAnswers = [];

let extraQuestions = [];
let currentExtraIndex = 0;
let isExtraStage = false;
let totalPoints = 0;
let extraAnswers = [];

async function loadJsonFile(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return await response.json();
}

function getTestConfig(mode) {
  const configs = {
    random10: {
      file: "./data/allquestion.json",
      questionCount: 10,
      passingScore: 9,
      random: true,
      label: "Random 10 Questions"
    },
    random50: {
      file: "./data/allquestion.json",
      questionCount: 50,
      passingScore: 45,
      random: true,
      label: "Random 50 Questions"
    },
    test1: {
      file: "./data/50q_1.json",
      questionCount: 50,
      passingScore: 45,
      random: false,
      label: "50 Questions Test 1"
    },
    test2: {
      file: "./data/50q_2.json",
      questionCount: 50,
      passingScore: 45,
      random: false,
      label: "50 Questions Test 2"
    },
    test3: {
      file: "./data/50q_3.json",
      questionCount: 50,
      passingScore: 45,
      random: false,
      label: "50 Questions Test 3"
    },
    test4: {
      file: "./data/50q_4.json",
      questionCount: 50,
      passingScore: 45,
      random: false,
      label: "50 Questions Test 4"
    },
    test5: {
      file: "./data/50q_5.json",
      questionCount: 50,
      passingScore: 45,
      random: false,
      label: "50 Questions Test 5"
    },
    karimenFinal1: {
      file: "./data/95q_1_1.json",
      extraFile: "./data/95q_1_2.json",
      questionCount: 90,
      extraQuestionCount: 5,
      passingScore: 95,
      random: false,
      label: "Karimen Final Test 1",
      specialScoring: true
    }
  };

  return configs[mode] || null;
}

function scrollToTopSmooth() {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, 50);
}

function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

async function startQuiz() {
  userName = userNameInput.value.trim();

  if (!userName) {
    alert("Please enter your name first.");
    return;
  }

  if (!selectedTestMode) {
    testModeError.classList.remove("hidden");
    return;
  }

  try {
    const config = getTestConfig(selectedTestMode);

    if (!config) {
      alert("Invalid test mode selected.");
      return;
    }

    currentQuestionSource = await loadJsonFile(config.file);

    if (currentQuestionSource.length < config.questionCount) {
      alert(`The database must contain at least ${config.questionCount} questions.`);
      return;
    }

    selectedQuestions = shuffleArray(currentQuestionSource).slice(0, config.questionCount);

    if (config.extraFile) {
      extraQuestions = await loadJsonFile(config.extraFile);
    } else {
      extraQuestions = [];
    }

    currentIndex = 0;
    currentExtraIndex = 0;
    score = 0;
    totalPoints = 0;
    userAnswers = [];
    extraAnswers = [];
    isExtraStage = false;

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    scrollToTopSmooth();
    renderQuestion();
  } catch (error) {
    alert("Failed to load test data.");
    console.error(error);
  }
}

function renderQuestion() {
  scrollToTopSmooth();
  const q = selectedQuestions[currentIndex];

  progressText.textContent = `Question ${currentIndex + 1} / ${selectedQuestions.length}`;
  userLabel.textContent = `Name: ${userName}`;

  if (q.image && q.image !== "assets/signs/nopict.png") {
    questionImage.src = q.image;
    questionImage.classList.remove("hidden");
  } else {
    questionImage.classList.add("hidden");
  }
  
  questionTextJa.textContent = q.question_ja || "";
  questionTextEn.textContent = q.question_en || "";
  questionTextNe.textContent = q.question_ne || "";
  questionTextHi.textContent = q.question_hi || "";
}

function renderExtraQuestion() {
  scrollToTopSmooth();
  const q = extraQuestions[currentExtraIndex];

  progressText.textContent = `Extra Question ${currentExtraIndex + 1} / ${extraQuestions.length}`;
  userLabel.textContent = `Name: ${userName}`;

  if (q.image && q.image !== "assets/signs/nopict.png") {
    questionImage.src = q.image;
    questionImage.classList.remove("hidden");
  } else {
    questionImage.classList.add("hidden");
  }

  questionTextJa.textContent = q.question_ja || "";
  questionTextEn.textContent = q.question_en || "";
  questionTextNe.textContent = q.question_ne || "";
  questionTextHi.textContent = q.question_hi || "";

  trueFalseArea.classList.add("hidden");
  extraQuestionArea.classList.remove("hidden");

  extraChoices.innerHTML = q.choices.map(choice => `
    <label class="block border border-slate-300 rounded-xl p-3 bg-white cursor-pointer">
      <div class="flex items-start gap-3">
        <input
          type="checkbox"
          class="extra-choice-checkbox mt-1"
          value="${choice.id}"
        />
        <div class="space-y-1">
          <p class="font-medium text-slate-800">${choice.text_ja || ""}</p>
          <p class="text-slate-600">${choice.text_en || ""}</p>
          <p class="text-slate-700 devanagari-font">${choice.text_ne || ""}</p>
          <p class="text-slate-700 devanagari-font">${choice.text_hi || ""}</p>
        </div>
      </div>
    </label>
  `).join("");
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((value, index) => value === sortedB[index]);
}

function handleExtraAnswer() {
  const q = extraQuestions[currentExtraIndex];
  const checked = Array.from(document.querySelectorAll(".extra-choice-checkbox:checked"))
    .map(input => Number(input.value));

  const isCorrect = arraysEqual(checked, q.correct_answers);
  const earnedPoints = isCorrect ? 2 : 0;

  totalPoints += earnedPoints;

  extraAnswers.push({
    questionId: q.id,
    questionJa: q.question_ja,
    questionEn: q.question_en,
    questionNe: q.question_ne,
    questionHi: q.question_hi,
    image: q.image,
    userAnswer: checked,
    correctAnswers: q.correct_answers,
    isCorrect: isCorrect,
    points: earnedPoints,
    correctExplanationJa: q.correct_explanation_ja,
    correctExplanationEn: q.correct_explanation_en,
    correctExplanationNe: q.correct_explanation_ne,
    correctExplanationHi: q.correct_explanation_hi,
    choices: q.choices
  });

  currentExtraIndex++;

  if (currentExtraIndex < extraQuestions.length) {
    renderExtraQuestion();
  } else {
    showResult();
  }
}

function handleAnswer(userAnswer) {
  const currentQuestion = selectedQuestions[currentIndex];
  const isCorrect = userAnswer === currentQuestion.answer;

  if (isCorrect) {
    score++;
    totalPoints++;
  }

  userAnswers.push({
    questionId: currentQuestion.id,
    questionJa: currentQuestion.question_ja,
    questionEn: currentQuestion.question_en,
    questionNe: currentQuestion.question_ne,
    questionHi: currentQuestion.question_hi,
    image: currentQuestion.image,
    correctAnswer: currentQuestion.answer,
    correctExplanationJa: currentQuestion.correct_explanation_ja,
    correctExplanationEn: currentQuestion.correct_explanation_en,
    correctExplanationNe: currentQuestion.correct_explanation_ne,
    correctExplanationHi: currentQuestion.correct_explanation_hi,
    userAnswer: userAnswer,
    isCorrect: isCorrect,
    points: isCorrect ? 1 : 0
  });

  currentIndex++;

  if (currentIndex < selectedQuestions.length) {
    renderQuestion();
  } else {
    const config = getTestConfig(selectedTestMode);

    if (config && config.extraFile && extraQuestions.length > 0) {
      isExtraStage = true;
      renderExtraQuestion();
    } else {
      showResult();
    }
  }
}

async function sendResultToGoogleSheet() {
  const currentConfig = getTestConfig(selectedTestMode);

  const regularPoints = score;
  const extraPoints = extraAnswers.reduce((sum, item) => sum + (item.points ?? 0), 0);
  const totalPointsFinal = currentConfig && currentConfig.specialScoring
    ? totalPoints
    : regularPoints;

  const passingScore = currentConfig ? currentConfig.passingScore : 0;
  const passOrFailure = totalPointsFinal >= passingScore ? "Passed" : "Failed";

  const wrongAnswersOnlyJa = userAnswers
    .filter(item => !item.isCorrect)
    .map(item => ({
      questionJa: item.questionJa || "",
      correctAnswer: item.correctAnswer,
      userAnswer: item.userAnswer,
      correctExplanationJa: item.correctExplanationJa || "",
      points: item.points ?? 0
    }));

  const extraAnswersForSheet = extraAnswers.map(item => ({
    questionJa: item.questionJa || "",
    userAnswer: item.userAnswer || [],
    correctAnswers: item.correctAnswers || [],
    points: item.points ?? 0,
    correctExplanationJa: item.correctExplanationJa || ""
  }));

  const payload = {
    name: userName,
    testMode: currentConfig ? currentConfig.label : selectedTestMode,
    regularPoints: regularPoints,
    extraPoints: extraPoints,
    totalPoints: totalPointsFinal,
    passOrFailure: passOrFailure,
    wrongAnswers: wrongAnswersOnlyJa,
    extraAnswers: extraAnswersForSheet
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
  scrollToTopSmooth();

  const currentConfig = getTestConfig(selectedTestMode);
  const finalScore = currentConfig && currentConfig.specialScoring ? totalPoints : score;
  const finalTotal = currentConfig && currentConfig.specialScoring ? 100 : selectedQuestions.length;
  const passingScore = currentConfig ? currentConfig.passingScore : 0;

  resultName.textContent = `Name: ${userName}`;
  scoreText.textContent = `${finalScore} / ${finalTotal}`;

  if (finalScore >= passingScore) {
    passStatus.textContent = `合格 (Passed) - ${currentConfig.label} - Passing score: ${passingScore}/${finalTotal}`;
    passStatus.className = "text-center text-2xl font-bold mb-6 text-green-600";
  } else {
    passStatus.textContent = `不合格 (Failed) - ${currentConfig.label} - Passing score: ${passingScore}/${finalTotal}`;
    passStatus.className = "text-center text-2xl font-bold mb-6 text-red-600";
  }

  const regularResultsHtml = userAnswers.map((item, index) => {
    return `
      <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">
        <p class="font-semibold text-slate-800 mb-3">Question ${index + 1}</p>

        ${item.image && item.image !== "assets/signs/nopict.png" ? `
          <img
            src="${item.image}"
            alt="Traffic Sign ${index + 1}"
            class="w-full max-h-56 object-contain bg-white rounded-xl border border-slate-200 mb-4"
          />
        ` : ""}

        <div class="space-y-2 mb-3">
          <p class="text-slate-800 font-semibold">${item.questionJa || ""}</p>
          <p class="text-slate-600">${item.questionEn || ""}</p>
          <p class="text-slate-700 devanagari-font">${item.questionNe || ""}</p>
          <p class="text-slate-700 devanagari-font">${item.questionHi || ""}</p>
        </div>

        <p class="${item.isCorrect ? 'text-green-600' : 'text-red-600'} font-medium mb-1">
          Your answer: ${item.userAnswer ? "True" : "False"}
        </p>

        <p class="text-slate-700 font-medium mb-3">
          Correct answer: ${item.correctAnswer ? "True" : "False"}
        </p>

        <p class="text-sm font-medium text-blue-700 mb-3">
          Points: ${item.points ?? (item.isCorrect ? 1 : 0)}
        </p>

        <div class="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
          <p class="text-slate-800 font-medium">${item.correctExplanationJa || ""}</p>
          <p class="text-slate-600 text-sm">${item.correctExplanationEn || ""}</p>
          <p class="text-slate-700 text-sm devanagari-font">${item.correctExplanationNe || ""}</p>
          <p class="text-slate-700 text-sm devanagari-font">${item.correctExplanationHi || ""}</p>
        </div>
      </div>
    `;
  }).join("");

  const extraResultsHtml = extraAnswers.map((item, index) => {
    const userAnswerNumbers = (item.userAnswer || []).join(" & ");
    const correctAnswerNumbers = (item.correctAnswers || []).join(" & ");

    const choicesHtml = (item.choices || []).map(choice => `
      <div class="border border-slate-200 rounded-lg p-3 bg-white">
        <p class="text-slate-800 font-medium">${choice.id}. ${choice.text_ja || ""}</p>
        <p class="text-slate-600">${choice.text_en || ""}</p>
        <p class="text-slate-700 devanagari-font">${choice.text_ne || ""}</p>
        <p class="text-slate-700 devanagari-font">${choice.text_hi || ""}</p>
      </div>
    `).join("");

    return `
      <div class="border border-blue-200 rounded-xl p-4 bg-blue-50">
        <p class="font-semibold text-slate-800 mb-3">Extra Question ${index + 1}</p>

        ${item.image && item.image !== "assets/signs/nopict.png" ? `
          <img
            src="${item.image}"
            alt="Extra Question ${index + 1}"
            class="w-full max-h-72 object-contain bg-white rounded-xl border border-slate-200 mb-4"
          />
        ` : ""}

        <div class="space-y-2 mb-4">
          <p class="text-slate-800 font-semibold">${item.questionJa || ""}</p>
          <p class="text-slate-600">${item.questionEn || ""}</p>
          <p class="text-slate-700 devanagari-font">${item.questionNe || ""}</p>
          <p class="text-slate-700 devanagari-font">${item.questionHi || ""}</p>
        </div>

        <div class="space-y-3 mb-4">
          ${choicesHtml}
        </div>

        <p class="${item.isCorrect ? 'text-green-600' : 'text-red-600'} font-medium mb-1">
          Your answer: ${userAnswerNumbers || "-"}
        </p>

        <p class="text-slate-700 font-medium mb-1">
          Correct answer: ${correctAnswerNumbers || "-"}
        </p>

        <p class="text-sm font-medium text-blue-700 mb-3">
          Points: ${item.points ?? 0}
        </p>

        <div class="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
          <p class="text-slate-800 font-medium">${item.correctExplanationJa || ""}</p>
          <p class="text-slate-600 text-sm">${item.correctExplanationEn || ""}</p>
          <p class="text-slate-700 text-sm devanagari-font">${item.correctExplanationNe || ""}</p>
          <p class="text-slate-700 text-sm devanagari-font">${item.correctExplanationHi || ""}</p>
        </div>
      </div>
    `;
  }).join("");

  resultDetail.innerHTML = `
    <div class="space-y-6">
      <div>
        <h3 class="text-xl font-bold text-slate-800 mb-3">Regular Questions</h3>
        <div class="space-y-3">
          ${regularResultsHtml}
        </div>
      </div>

      ${extraAnswers.length > 0 ? `
        <div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">Extra Questions</h3>
          <div class="space-y-3">
            ${extraResultsHtml}
          </div>
        </div>
      ` : ""}
    </div>
  `;

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
  selectedTestMode = "";
  testModeError.classList.add("hidden");
  testModeButtons.forEach(btn => btn.classList.remove("active"));
  scrollToTopSmooth();
});

(function init() {
  console.log("App initialized.");
})();

testModeButtons.forEach(button => {
  button.addEventListener("click", () => {
    testModeButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    selectedTestMode = button.dataset.mode;
    testModeError.classList.add("hidden");
  });
});

function getPassingScoreByMode(mode) {
  const config = getTestConfig(mode);
  return config ? config.passingScore : 0;
}

submitExtraBtn.addEventListener("click", handleExtraAnswer);