// scrambled word text
const scrambledWordE1 = document.querySelector(".scrambled-word h2");

// Inputs Container
const inputsContainer = document.getElementById("inputs");

// Tries & mistakes
const triesE1 = document.querySelector(".n-tries");
const dots = document.querySelectorAll(".dot");
const mistakesE1 = document.getElementById("mistakes");

// Buttons
const randomBtn = document.querySelector(".btn-primary");
const resetBtn = document.querySelector(".btn-secondary");

// game state
let currentWord = "";
let scrambledWord = "";
let tries = 0;
let mistakes = new Set();

const MAX_TRIES = 5;

// word list
const words = ["flower", "phone", "tabla", "silver", "puzzle", "tree", "eyes"];

function getRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
}

// scramble the word
function scramble(word) {
    return word
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
}

// create inputs dynamically
function createInputs(length) {
    inputsContainer.innerHTML = "";

    for (let i = 0; i < length; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.classList.add("input-box");

        input.addEventListener("input", () => {
            input.value = input.value.slice(0, 1).toLowerCase();

            if (input.value && i < length - 1) {
                inputsContainer.children[i + 1].focus();
            }

            // If last input is filled, check word
            if (i === length - 1 && input.value) {
                checkWord();
            }
        });

        // handle backspace
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && i > 0) {
                inputsContainer.children[i - 1].focus();
            }
        });

        inputsContainer.appendChild(input);
    }

    inputsContainer.children[0].focus();
}

// update dots
function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index < tries);
    });
}

// reset tries & mistakes
function resetStats() {
    tries = 0;
    mistakes.clear();

    triesE1.textContent = tries;
    mistakesE1.textContent = "";
}

// start a new game (random word)
function startGame() {
    resetStats();

    currentWord = getRandomWord();
    scrambledWord = scramble(currentWord);

    scrambledWordE1.textContent = scrambledWord;

    updateDots();
    createInputs(currentWord.length);
}

// reset current game (same word)
function resetGame() {
    resetStats();
    updateDots();
    createInputs(currentWord.length);
}

// check each character
function checkInput(value, index) {
    if (value && value !== currentWord[index]) {
        mistakes.add(value);
    }
}

// read user input and check word
function checkWord() {
    const inputs = document.querySelectorAll(".input-box");
    let userWord = "";

    inputs.forEach((input, index) => {
        const value = input.value.toLowerCase();
        userWord += value;
        checkInput(value, index);
    });

    mistakesE1.textContent =
        Array.from(mistakes).join(", ");

    if (userWord === currentWord) {
        alert("🎉 Success");
        startGame();
        return;
    }

    tries++;
    triesE1.textContent = tries;
    updateDots();

    if (tries === MAX_TRIES) {
        resetGame();
    }
}

// event listeners
randomBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

// init
startGame();
