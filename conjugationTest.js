var json
fetch('./data.json').then(response => {
   return  response.json();
}).then(jsondata => json = (jsondata)).then(()=>updateWord())

var currVerb;
var currConj;
var expAns = ""
const checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']"))
const verbInfo = document.getElementById("verbname")
const inputText = document.getElementById("verbConj")
const inputLabel = document.getElementById("verbLabel")
const feedback = document.getElementById("feedback")



function getRandomVerb(){
    k = Object.keys(json)
    var i = Math.floor(Math.random()*k.length)   
    return k[i]
}

function getConjugation(v){
    const conjs = json[v]
    const k = Object.keys(conjs)
    const time = k[Math.floor(Math.random()*k.length)]
    return [time, conjs[time]]
}

function updateWord(){
    if (checkboxes.some(x=>x.checked))
    {
        const v = getRandomVerb()
        var conj
        do {   
            conj = getConjugation(v)
            
        } while (!checkboxes.some(x => x.checked && x.name==conj[0]));
        feedback.innerHTML = ""
        verbInfo.innerHTML = "Conjugate <u>" + v + "</u> in the <em>" + conj[0] +"</em>:"
        currVerb = v
        currConj = conj
        var i = Math.floor(Math.random()*conj[1].length)
        var aux = conj[1][i].split(/\'| /)
        person = aux.shift()
        expAns = aux.join(" ")
        inputLabel.innerHTML = person
        inputText.value = ""
    }
}

function check(){
    if (expAns !=""){
        if (expAns == inputText.value)
            feedback.innerHTML = '<span class="correct">Correct!</span>'
        else
            feedback.innerHTML = `<span class="wrong">Wrong!</span><br>The right answer is <u>${expAns}</u>`
    }

}

