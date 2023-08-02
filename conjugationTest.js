const verb_data = {
    "french": null,
    "dutch": null,
    "german": null
}

var currLanguage = "french"
var currVerb;
var currConj;
var expAns = ""
var checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']"))
const verbInfo = document.getElementById("verbname")
const tenseInfo = document.getElementById("verbtense")
const inputText = document.getElementById("verbConj")
const inputLabel = document.getElementById("verbLabel")
const feedback = document.getElementById("feedback")



function getCheckboxHtml(i, tense){
    return `<div class="tense">
        <label id="labelt${i}" for="t${i}">${tense}</label>
        <input class="form-check-input" type="checkbox" ${(i==0 )? 'checked="True"' : ""} name="${tense}" id="t${i}"><br>
    </div>`
}



for (const language in verb_data) {
    if (currLanguage == language) {
        fetch(`./${language}.json`).then(response => {
            return response.json();
        }).then(jsondata => verb_data[language] = (jsondata)).then(() => setLanguage(currLanguage)).then(x => updateWord())
    }
    else {
        fetch(`./${language}.json`).then(response => {
            return response.json();
        }).then(jsondata => verb_data[language] = (jsondata))
    }
}


function setLanguage(language) {
    currLanguage = language
    const random_verb = getRandomVerb(language)
    var idx = 0
    var checkboxes_html = []
    for (const tense in verb_data[language][random_verb]) {
        checkboxes_html.push(getCheckboxHtml(idx, tense))
        idx += 1
    }
    document.querySelector(".card").innerHTML = checkboxes_html.join('\n')
    checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']"))

}

function getRandomVerb(language) {
    k = Object.keys(verb_data[language])
    var i = Math.floor(Math.random() * k.length)
    return k[i]
}

function getConjugation(language, v) {
    const conjs = verb_data[language][v]
    const k = Object.keys(conjs)
    const time = k[Math.floor(Math.random() * k.length)]
    return [time, conjs[time]]
}

function updateWord() {
    if (checkboxes.some(x => x.checked)) {
        const v = getRandomVerb(currLanguage)
        var conj
        do {
            [time, conj] = getConjugation(currLanguage, v)
        } while (!checkboxes.some(x => x.checked && x.name == time));
        feedback.innerHTML = "<div class='answer'></div>"
        verbInfo.innerHTML = "<u>" + v + "</u>"
        tenseInfo.innerHTML = "<em>" + time + "</em>:"
        currVerb = v
        currConj = conj
        pronouns = Object.keys(conj)
        var i = Math.floor(Math.random() * pronouns.length)
        var person = pronouns[i]

        expAns = conj[person]
        inputLabel.innerHTML = person + "  ";
        inputText.value = ""
        if (expAns == "-")
            updateWord()
    }
}

function updateLanguage() {
    setLanguage(document.getElementById("languageDropdown").value)
    updateWord()
}

function check() {
    if (expAns != "") {
        var text = inputText.value.split(" ").filter(x => x.length > 0).join(" ")
        if (expAns == text)
            feedback.innerHTML = '<div class="correct answer">Correct!</div>'
        else
            feedback.innerHTML = `<div class="wrong answer">Wrong!</div>The right answer is <u>${expAns}</u>`
    }

}


document.querySelector("#verbConj").addEventListener("keyup", (event) => {
    if (event.keyCode == 38)
        updateWord()
})

$('#collapseTenses').on('shown.bs.collapse', function () {
    this.scrollIntoView();
});


