const game = document.querySelector('.game');
const icon = document.querySelector('.icon');
const title = document.querySelector('.title');
const content = document.querySelector('.content');
const result = document.querySelector('.result');
const resultText = document.querySelector('.resultText');
const restartBtn = document.querySelector('.restartBtn');
const saveBtn = document.querySelector('.saveBtn');
const recordPanel = document.querySelector('.recordPanel');

let step = 0;
let clickTimer = {};
let flashTimer = {};
let startTime = 0;
let recordTime = 0;
let record = [];
let ranking = [];
let isSaved = false;

flashTimer = setInterval(() => {
    icon.classList.toggle('flash');
}, 1000);

restartBtn.addEventListener('click', reset);

saveBtn.addEventListener('click', saveData);

game.addEventListener('click', () => {
    switch (step) {
        case 0:
            prepare();
            break;
        case 1:
            fastClick();
            break;
        case 2:
            resultClick();
            break;
        case 3:
            prepare();
            break;
    }

});


function prepare() {
    step = 1;
    icon.src = './img/three dot.png';
    game.classList.add('red');
    title.innerHTML = '기다리세요';
    content.classList.add('hidden');

    clickTimer = setTimeout(waitClick, 2000 + (Math.random() * 4000));
    clearInterval(flashTimer);
    icon.classList.remove('flash');

}

function waitClick() {
    step = 2;
    game.classList.remove('red');
    game.classList.add('green');
    title.innerHTML = '클릭!';
    const now = new Date()
    startTime = now.getTime();
}

function resultClick() {
    const now = new Date();
    step = 3;
    recordTime = now.getTime();
    record.push(recordTime - startTime);
    if (record.length == 5) {
        printResult();
        return;
    }
    game.classList.remove('green');
    icon.src = './img/clock.png';
    title.innerHTML = `${recordTime - startTime}ms`;
    content.innerHTML = '클릭하면 다시!'
    content.classList.remove('hidden');





}

function fastClick() {
    step = 3;
    game.classList.remove('red');
    icon.src = './img/warning.png';
    title.innerHTML = "초록색이 되면 클릭하세요!";
    content.innerHTML = '클릭하면 다시!'
    content.classList.remove('hidden');
    clearTimeout(clickTimer);
}

function reset() {
    step = 0;
    icon.src = './img/thunder.png';
    title.innerHTML = "반응속도 테스트";
    content.innerHTML = '화면이 초록색이 되면 빠르게 클릭하세요'
    game.classList.remove('green');
    game.classList.remove('red');
    game.classList.remove('hidden');
    result.classList.add('hidden');

    record = [];

    flashTimer = setInterval(() => {
        icon.classList.toggle('flash');
    }, 1000);


}

function printResult() {
    game.classList.add('hidden');
    result.classList.remove('hidden');
    console.log(record);
    resultText.innerHTML = `${record.reduce((a, b) => { return a + b }) / 5}ms`;
    isSaved=false;
}

function saveData() {
    if(!isSaved){
        isSaved=true;
        ranking.push(record.reduce((a, b) => { return a + b }) / 5)
        ranking.sort((a,b)=>{return a-b});
        window.localStorage.setItem("ranking",JSON.stringify(ranking));
        renewalRecord();
    }
}

function renewalRecord() {
    const data = window.localStorage.getItem("ranking");
    if(data){
        ranking = JSON.parse(data);
    }

    recordPanel.innerHTML = "";
    let h3 = document.createElement('h3');
    h3.innerHTML = "기록";
    recordPanel.appendChild(h3);

    for (let i = 0; i < ranking.length; i++) {
        let p = document.createElement('p');
        p.innerHTML = `${i+1}. ${ranking[i]} ms`;
        recordPanel.appendChild(p); 
    }

}

renewalRecord();
