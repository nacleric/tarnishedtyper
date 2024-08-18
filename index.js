let TIMER = 30

let states = {
    START: "START",
    INPROGRESS: "INPROGRESS",
}

let GAMESTATE = {
    count: 0,
    timeLeft: TIMER,
    keyFired: false,
    currentState: states.START
}

function wrapLettersInSpan(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === " ") {
            result += `<span class="space">${str[i]}</span>`;
        } else {
            result += `<span class="letter">${str[i]}</span>`;
        }
    }
    return result;
}

async function fetchData() {
    return fetch("redditpost.json")
        .then(response => response.json());
}

function newSentence(redditPosts) {
    let randomInt = Math.floor(Math.random() * redditPosts.length);
    return redditPosts[randomInt].text
}

function restartGame(sentence, gameEl) {
    gameEl.innerHTML = wrapLettersInSpan(sentence)
    GAMESTATE.timeLeft = TIMER
    GAMESTATE.keyFired = false
    GAMESTATE.count = 0
    GAMESTATE.currentState = states.START
    let letterNode = gameEl.childNodes
    letterNode[0].classList.add("starting-letter-block")
}

async function main() {
    let redditPosts = await fetchData();
    let sentence = newSentence(redditPosts)

    // let total_words = sentence.split(' ').filter(word => word.length > 0).length

    let timerInterval;
    let timerEl = document.getElementById("timer")

    let game = document.getElementById("game")

    game.innerHTML = wrapLettersInSpan(sentence)

    let letterNode = game.childNodes
    letterNode[GAMESTATE.count].classList.add("starting-letter-block")

    document.addEventListener("keydown", function (event) {
        let key = event.key

        // Start timer
        if (GAMESTATE.currentState !== states.INPROGRESS && GAMESTATE.keyFired === false && event.keyCode !== 9) {
            GAMESTATE.keyFired = true
            GAMESTATE.currentState = states.INPROGRESS

            timerInterval = setInterval(() => {
                GAMESTATE.timeLeft--;
                timerEl.textContent = GAMESTATE.timeLeft;
                if (GAMESTATE.timeLeft <= 0) {
                    clearInterval(timerInterval) // stops timer
                    timerEl.textContent = "Done";
                    GAMESTATE.currentState = states.START
                }
            }, 1000)
        }

        if (GAMESTATE.currentState === states.INPROGRESS) {
            // Regular expression to detect letters, numbers, punctuation, and special characters
            if (/^[a-zA-Z0-9!@#$%^&*()e_+\-=\[\]{};':"\\|,.<>\/?~` ]$/.test(key)) {
                if (letterNode[GAMESTATE.count].innerHTML === " " && key !== " ") {
                    letterNode[GAMESTATE.count].className = "letter-block-wrong"
                } else if (key === letterNode[GAMESTATE.count].innerHTML) {
                    letterNode[GAMESTATE.count].className = "letter-correct"
                } else {
                    letterNode[GAMESTATE.count].className = "letter-wrong"
                }
                GAMESTATE.count += 1
            }

            // detect backspace
            if (event.keyCode === 8) {
                if (GAMESTATE.count !== 0) {
                    GAMESTATE.count -= 1
                }
                letterNode[GAMESTATE.count].className = ""
                letterNode[GAMESTATE.count + 1].classList.remove("letter-block")
            }
            letterNode[GAMESTATE.count].classList.add("letter-block")
        }


        // Stops space from scrolling
        if (event.keyCode === 32 && event.target === document.body) {
            event.preventDefault();
        }

        // Stops tab from selecting off screen
        if (event.keyCode === 9 && event.target === document.body) {
            event.preventDefault();
            sentence = newSentence(redditPosts)
            restartGame(sentence, game)
            timerEl.textContent = TIMER;

            // Clear any existing interval
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        }
    });
}

main()
