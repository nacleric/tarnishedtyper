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

fetch("redditpost.json")
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })


let count = 0
let sentence = "The jars collect bodies (and souls probably) to dump at the roots of the trees to feed the trees"
let total_words = sentence.split(' ').filter(word => word.length > 0).length

let game = document.getElementById("game")
game.innerHTML = wrapLettersInSpan(sentence)

let letterNode = game.childNodes
letterNode[count].classList.add("letter-block")

document.addEventListener('keydown', function (event) {
    let key = event.key


    // Regular expression to detect letters, numbers, punctuation, and special characters
    if (/^[a-zA-Z0-9!@#$%^&*()e_+\-=\[\]{};':"\\|,.<>\/?~` ]$/.test(key)) {
        if (key === letterNode[count].innerHTML) {
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
        letterNode[count+1].classList.remove("letter-block")
    }

    letterNode[count].classList.add("letter-block")

});