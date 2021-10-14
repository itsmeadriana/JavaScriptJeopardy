const header = document.querySelector("header");
const timerContainer = document.querySelector("#timer");
const startContainer = document.getElementById("start-container");
const questionContainer = document.getElementById("question-container");
const endOfQuiz = document.getElementById("endOfQuizContainer");
const leaderboardContainer = document.getElementById("leaderboard-container");
const leaderboardButton = document.getElementById("leaderboard-btn");

const startButton = document.querySelector("#start-btn");
const reloadButton = document.querySelector("#reload-btn");

const leaderboard = document.querySelector("#leaderboard");

const question = document.querySelector("#question");
const answers = document.querySelector("#answers");

const leaderboardList = document.querySelector("#leaderboard-list");

let timerContinue = true;
let timeLeft = 60;
let currentQuestionIndex = 0;
let score = 0;
let leaderboardStorage = [];
let questions = [
    {
        question: "Who invented JavaScript?",
        answers: [
            "Douglas Crockford",
            "Sheryl Sandberg",
            "Brendan Eich",
            "Terrence Kisch"
        ],
        answer: "Brendan Eich"
    },
    {
        question: "When is the scope of 'var' used globally?",
        answers: [
            "When a var variable is declared outside a function.",
            "When a var variable is re-declared.",
            "When a var variable is declared inside a function.",
            "Var variables are always globally scoped."
        ],
        answer: "When a var variable is declared outside a function."
    },
    {
        question: "Which one of the following is a JavaScript package manager?",
        answers: [
            "Node.js",
            "JSON",
            "TypeScript",
            "npm",
        ],
        answer: "npm"
    },
    {
        question: "What is hoisting?",
        answers: [
            "Hoisting lifts a declaration variable to the top of its scope before executing code.",
            "Hoisting lifts a function or declaration variable to the top of its scope before executing code.",
            "Hoisting lifts a function variable to the top of its scope after executing code.",
            "Hoisting lifts a function or declaration variable to the top of its scope after executing code."
        ],
        answer: "Hoisting lifts a function or declaration variable to the top of its scope before executing code."
    },
    {
        question: "Which tool can you use to ensure code quality?",
        answers: [
            "Require JS",
            "Angular",
            "Eslint",
            "jQuery",
        ],
        answer: "Eslint"
    },
    {
        question: "What is the purpose of a 'for' loop?",
        answers: [
            "A 'for' loop executes a block of code four times exactly.",
            "A 'for' loop executes a block of code a number of specified times.",
            "A 'for' loop creates new arrays.",
            "A 'for' loop substitutes one variable for another.",
        ],
        answer: "A 'for' loop executes a block of code a number of specified times."
    },
];

// Create a function to generate the questions 
const generateQuestion = function () {
    if (!timeExpired() && quizInProgress()) {
        question.textContent = questions[currentQuestionIndex].question;
        let answersForCurrentQuestion = questions[currentQuestionIndex].answers;
        answersForCurrentQuestion.forEach(answer => {
            const answerAsButton = document.createElement("button");
            const choiceList = document.createElement("li");

            answerAsButton.className = "btn";
            answerAsButton.textContent = answer;
            choiceList.appendChild(answerAsButton);
            answers.appendChild(choiceList);
        });
        currentQuestionIndex++;
    }
    else {
        question.textContent = "";
    }
}

//checks answers and increases score based on correct answers + time left; decreases time Left for every wrong answer
const checkAnswer = function (event) {
    const messages = document.querySelector("#messages");
    if (event === undefined) {
        questionContainer.className = "hidden";
        timeLeft = 0;
        timer.textContent = "Time Left: " + timeLeft;
        endOfQuiz.className = "container";
        messages.textContent = "You're out of time!";
    } else {
        if (event.target.textContent === questions[currentQuestionIndex - 1].answer) {
            score = score + 10;
            messages.textContent = "That's correct!";
        }
        else if (timeLeft > 10) {
            timeLeft = timeLeft - 10;
            timer.textContent = "Time Left: " + timeLeft;
            messages.textContent = "Sorry, wrong answer.";
        }
        else {
            endGame();
        }
    }
    // transition check message 
    const clearMessages = setTimeout(function () {
        messages.textContent = "";
    }, 800);
}

const countdown = function () {
    const timer = setInterval(function () {

        if (timeLeft > 0 && timerContinue) {
            document.getElementById("timer").innerHTML = "Time remaining: " + timeLeft;
            timeLeft--;
        }

        else if (!timerContinue) {
            document.getElementById("timer").innerHTML = "Time's up!";
            checkAnswer();
            endGame();
            clearInterval(timer);
        }
        else {
            document.getElementById("timer").innerHTML = "Time: 00:00";
            timeLeft = 0;
            question.className = "hidden";
            endOfQuiz.className = "container";

            clearInterval(timer);
            checkAnswer();
            endGame();
        }
    }, 1000);
};

const timeExpired = function () {
    return timeLeft <= 0;
}

const quizInProgress = function () {
    return currentQuestionIndex < questions.length
}

const generateNextQuestion = function (event) {
    if (!timeExpired() && quizInProgress()) {
        checkAnswer(event);
        answers.textContent = "";
        generateQuestion();
    } else {
        checkAnswer(event);
        endGame();
    }
}

const enterInitials = function (event) {
    event.preventDefault();

    const playerInitials = document.querySelector("input[name='initials").value;

    if (playerInitials === "") {
        alert("Hey champ! Save your score by entering your initials in the form below.");
    } else {
        let scoreResult = {
            initials: playerInitials,
            score: score
        };

        addNewScoreToLeaderBoard(scoreResult)
        showLeaderboard();
        endOfQuiz.className = "hidden";
        header.className = "hidden";
        leaderboardContainer.className = "container"
    }
}

const addNewScoreToLeaderBoard = function (scoreAsJSON) {
    let leaderboard = localStorage.getItem("leaderboard");
    let leaderboardAsJSON = JSON.parse(leaderboard);

    if (leaderboardAsJSON === null) {
        leaderboardAsJSON = []
    }
    leaderboardAsJSON.push(scoreAsJSON);


    let leaderboardAsString = JSON.stringify(leaderboardAsJSON);
    localStorage.setItem("leaderboard", leaderboardAsString);
}

const endGame = function () {
    answers.textContent = "";
    timerContinue = false;
    score = timeLeft + score;
    question.className = "hidden";
    endOfQuiz.className = "container";

    const results = document.querySelector("#result");
    results.textContent = "Final Score: " + score;
}

var showLeaderboard = function () {
    leaderboardList.textContent = "";

    let leaderboardObject = localStorage.getItem("leaderboard");

    if (leaderboardObject.length === 0) {
        return false;
    }

    let savedScoreResults = JSON.parse(leaderboardObject);

    savedScoreResults.sort(function (a, b) {
        if (a.score < b.score) return 1;
        if (b.score < a.score) return -1;
        return 0;
    })

    savedScoreResults.forEach(function (results) {
        const leaderboardEntry = document.createElement("li");

        let initials = results.initials
        let score = results.score
        leaderboardEntry.textContent = `${initials} - ${score}`;
        leaderboardList.appendChild(leaderboardEntry);
    })
}

const viewLeaderboardOnClick = function () {
    timerContinue = false;

    leaderboardContainer.className = "container";
    startContainer.className = "hidden";
    questionContainer.className = "hidden";
    header.className = "hidden";

    showLeaderboard();
}

const startQuiz = function () {
    startContainer.className = "hidden";

    countdown();
    questionContainer.className = "container";
    generateQuestion();
}

leaderboardButton.addEventListener("click", viewLeaderboardOnClick)

startButton.addEventListener("click", startQuiz);
answers.addEventListener("click", generateNextQuestion);

endOfQuiz.addEventListener("submit", enterInitials);

reloadButton.addEventListener("click", function () {
    window.location.reload();
});



// timer.textContent = "TIMER"