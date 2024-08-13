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

function renderGame(sentence, htmlElement) {
    htmlElement.innerHTML = wrapLettersInSpan(sentence)
    let letterNode = game.childNodes
    letterNode[count].classList.add("starting-letter-block")
}

async function main() {
    let redditPostsResponse = await fetchData();
    let sentence = newSentence(redditPostsResponse)

    let count = 0
    let total_words = sentence.split(' ').filter(word => word.length > 0).length

    let timeLeft = 5
    let timerEl = document.getElementById("timer")

    let game = document.getElementById("game")
    let states = {
        PAUSE: "PAUSE",
        INPROGRESS: "INPROGRESS",
    }
    let currentState = states.PAUSE

    setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            timerEl.textContent = "Done";
            currentState = states.PAUSE
        }
    }, 1000)
    game.innerHTML = wrapLettersInSpan(sentence)

    let letterNode = game.childNodes
    letterNode[count].classList.add("starting-letter-block")

    document.addEventListener('keydown', function (event) {
        let key = event.key
        if (timeLeft > 0 && currentState === states.PAUSE) {
            currentState = states.INPROGRESS
        }
        if (currentState === states.INPROGRESS) {
            // Regular expression to detect letters, numbers, punctuation, and special characters
            if (/^[a-zA-Z0-9!@#$%^&*()e_+\-=\[\]{};':"\\|,.<>\/?~` ]$/.test(key)) {
                if (letterNode[count].innerHTML === " " && key !== " ") {
                    letterNode[count].className = "letter-block-wrong"
                } else if (key === letterNode[count].innerHTML) {
                    letterNode[count].className = "letter-correct"
                } else {
                    letterNode[count].className = "letter-wrong"
                }
                count += 1
            }

            // detect backspace
            if (event.keyCode === 8) {
                if (count !== 0) {
                    count -= 1
                }
                letterNode[count].className = ""
                letterNode[count + 1].classList.remove("letter-block")
            }
            letterNode[count].classList.add("letter-block")
        }

        if (currentState === states.PAUSE && event.keyCode === 13) {
            timeLeft = 5
            sentence = newSentence(redditPostsResponse)
            renderGame(sentence, game)
        }
    });
}

main()
