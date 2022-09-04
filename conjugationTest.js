var json
fetch('./data.json').then(response => {
   return  response.json();
}).then(jsondata => json = (jsondata)).then(()=>updateWord())

var currVerb;
var currConj;
var expAns = ""
const checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']"))
const verbInfo = document.getElementById("verbname")
const tenseInfo = document.getElementById("verbtense")
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
        feedback.innerHTML = "<div class='answer'></div><br><br>"
        verbInfo.innerHTML = "<u>" + v + "</u>"
        tenseInfo.innerHTML = "<em>" + conj[0] +"</em>:"
        currVerb = v
        currConj = conj
        var i = Math.floor(Math.random()*conj[1].length)
        var aux = conj[1][i].split(/\'| /)
        person = aux.shift()
        expAns = aux.join(" ")
        inputLabel.innerHTML = person + ((person=="j")?"'":"");
        inputText.value = ""
    }
}

function check(){
    if (expAns !=""){
        if (expAns == inputText.value)
            feedback.innerHTML = '<div class="correct answer">Correct!</div>'
        else
            feedback.innerHTML = `<div class="wrong answer">Wrong!</div>The right answer is <u>${expAns}</u>`
    }

}


// 
//
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

document.querySelector("#verbConj").addEventListener("keyup",(event)=>{
    if(event.keyCode==38)
        updateWord()
})