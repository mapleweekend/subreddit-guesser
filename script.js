const posts = document.getElementById("posts")
const submit = document.getElementById('submit')
const guess = document.getElementById('guess')
const logs = document.getElementById('guessLogs')
const skip = document.getElementById('skip')
const mode = document.getElementById('mode')
const reveal = document.getElementById('reveal')
const score = document.getElementById('score')

var playerscore = localStorage.getItem('score')

async function load() {
    posts.innerHTML = "LOADING NEW POSTS..."
    guess.value = ""
    const response = await fetch('/data/q?mode='+mode.innerText.toLowerCase())
    const data = await response.json()

    posts.innerHTML = ""
    for (let i=0;i<data.data.length;i++) {
        let maxHeight = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        posts.innerHTML += "<img src='"+data.data[i]+"' style='max-height:"+maxHeight+"px;'>"
    }

    localStorage.setItem('sub', data.subreddit)
    logs.innerHTML = ""

    if (playerscore == null) {
        playerscore = 0
        localStorage.setItem('score', 0)
    }
    score.innerHTML = playerscore

}



submit.onclick = function() {
    let value = guess.value.toLowerCase()
    let hint = ""

    if (value == localStorage.getItem('sub').toLowerCase()) {
        logs.innerHTML = "YOU ARE CORRECT!"
        localStorage.setItem('score', parseInt(localStorage.getItem('score')) + 1)
        playerscore++
    } else {
        let guessIndex = localStorage.getItem('sub').toLowerCase().indexOf(value)
        if (guessIndex > -1) {
            hint = ""
            for (let i=0;i<localStorage.getItem('sub').toLowerCase().length-1;i++) {
                if (i < guessIndex) {
                    hint += "?"
                } else if (i == guessIndex) {
                    hint += value
                    i += value.length
                }
                if (i >= guessIndex + value.length-1) {
                    hint += "?"
                }
            }
        }


        if (hint == "") {
            hint = "You guessed <span style='font-style:italic'>"+value+"</span>, Keep trying..."
            logs.innerHTML = hint + "<br>"
        } else {
            logs.innerHTML += "You guessed <span style='font-style:italic'>"+value+"</span>, you were close! - <span style='font-weight:700;'>"+hint + "</span><br>"
        }
        

    }
    
}

skip.onclick = function() {
    load()
}

mode.onclick = function() {
    if (mode.innerText == "Clean") {
        mode.innerText = "NSFW"
        mode.style.backgroundColor = "RED"
        mode.style.color = "black"
    } else if (mode.innerText == "NSFW") {
        mode.innerText = "Clean"
        mode.style.backgroundColor = "BLUE"
        mode.style.color = "White"
    }
}

reveal.onclick = function() {
    window.open("https://www.reddit.com/r/"+localStorage.getItem('sub')+"/top")
    load()
}

guess.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault()
        submit.click()
    }
})
load()

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}