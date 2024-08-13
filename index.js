function wrapLettersInSpan(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        if (str[i] === " ") {
            result += `<span class="space">${str[i]}</span>`;
        } else {
            result += `<span class="letter">${str[i]}</span>`;
        }
    }
    return result;
}

async function foo() {
    return fetch("redditpost.json")
        .then(response => response.json());
}

async function main() {
    let redditPostsResponse = await foo();
    let randomInt = Math.floor(Math.random() * redditPostsResponse.length);

    let sentence = redditPostsResponse[randomInt].text

    let count = 0
    let total_words = sentence.split(' ').filter(word => word.length > 0).length

    let timeLeft = 5
    let timerEl = document.getElementById("timer")
    setInterval(() => {
        // Decrement the time left
        timeLeft--;

        // Update the countdown display
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            timerEl.textContent = "Done";
        }
    }, 1000)

    let game = document.getElementById("game")
    game.innerHTML = wrapLettersInSpan(sentence)

    let letterNode = game.childNodes
    letterNode[count].classList.add("starting-letter-block")

    document.addEventListener('keydown', function (event) {
        let key = event.key
        console.log(count)
        // Regular expression to detect letters, numbers, punctuation, and special characters
        if (/^[a-zA-Z0-9!@#$%^&*()e_+\-=\[\]{};':"\\|,.<>\/?~` ]$/.test(key)) {

            if (letterNode[count].innerHTML === " " && key !== " ") {
                // letterNode[count].className = "letter-correct"
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
    });
}

main()
