var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init); 
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

var groundY = 22;
var KecepatanY = 0;
var tinggilompat = 900;
var gravitasi = 2500;

var angsaPosX = 42;
var angsaPosY = groundY; 

var groundX = 0;
var KecepatanTahap = 1280/3;
var KecepatanGame = 1;
var score = 0;
var score2 = 0;

var berhenti = false;
var melompat = false;

var WaktuSampaiRintangan = 1;
var WaktuRintanganMin = 0.7;
var WaktuRintanganMaks = 1.8;
var RintanganPosY = 16;
var Rintangan = [];

var CuacaHinggaAwan = 0.5;
var CuacaAwanMin = 0.7;
var CuacaAwanMaks = 2.7;
var AwanMaxY = 270;
var AwanMinY = 100;
var Awan = [];
var KecepatanAwan = 0.5;

var container;
var angsa;
var textoScore;
var textoScore2;
var ground;
var gameOver;
var gamePause;
// var audio5 = new Audio("hehe.wav").autoplay;
var audio = new Audio("Click.wav");
var audio4 = new Audio("dugumdugum.wav");

document.onclick=function(){
    audio.play();
}

//data dari css
function Start() {
    gameOver = document.querySelector(".game-over");
    gamePause = document.querySelector(".game-pause");
    Homeg = document.querySelector(".home_display");
    Highs = document.querySelector(".High_display");
    gamep = document.querySelector(".game_display");
    ground = document.querySelector(".ground");
    container = document.querySelector(".container");
    textoScore = document.querySelector(".score");
    textoScore2 = document.querySelector(".score2");
    angsa = document.querySelector(".angsa");
    document.addEventListener("keydown", HandleKeyDown);
}

//memperbarui data game
function Update() {
    if(berhenti) return;

    MoveAngsa();
    Moveground();
    Kaktus();
    BentukAwan();
    RintanganBergerak();
    AwanBergerak();
    DeteksiTabrakan();

    KecepatanY -= gravitasi * deltaTime;
}

//sistem pause game
function pause(){
    berhenti = true;
    gamePause.style.display = "block";
    audio4.pause();
    audio4.currentTime = 0;
}

//esc pause game
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        pause(); 
    }
}

//icon X pause game
function mulai(){
    berhenti = false;
    gamePause.style.display = "none";
    audio4.play();
    audio4.loop=true;
}

//ini yang buat localstorage blom kelar
function homepage(){
    Homeg.style.display = "block";
    gamep.style.display = "none";
    Highs.style.display = "none";
    berhenti = true;
}
function highscorepage(){
    Highs.style.display = "block";
    gamep.style.display = "none";
    Homeg.style.display = "none";
}
function gamepage(){
    berhenti = false;
    audio4.play();
    audio4.loop=true;
    gamep.style.display = "block";
    Highs.style.display = "none";
    Homeg.style.display = "none";
    gamePause.style.display = "none";
    gameOver.style.display = "none";
}

//spasi lompat game
function HandleKeyDown(ev){
    var audio2 = new Audio("jump.wav");
    audio2.play();
    if(ev.keyCode == 32){
        if(angsaPosY === groundY){
            melompat = true;
            KecepatanY = tinggilompat;
            angsa.classList.remove("angsa-berlari");
        }
    }
}

function MoveAngsa() {
    angsaPosY += KecepatanY * deltaTime;
    if(angsaPosY< groundY){
        angsaPosY = groundY;
        KecepatanY = 0;
        if(melompat){
            angsa.classList.add("angsa-berlari");
        }
        melompat = false;
    }
    angsa.style.bottom = angsaPosY+"px";
}

function HitungPerpindahan() {
    return KecepatanTahap * deltaTime * KecepatanGame;
}

function Moveground() {
    groundX += HitungPerpindahan();
    ground.style.left = -(groundX % container.clientWidth) + "px";
}

//berubah gambar bebek dan game berhenti
function bebekgameover() {
    berhenti = true;
    audio4.pause();
    audio4.currentTime = 0;
    var audio3 = new Audio("gover.wav");
    audio3.play();
    angsa.classList.remove("angsa-berlari");
    angsa.classList.add("angsa-mati");
}

function Kaktus() {
    WaktuSampaiRintangan -= deltaTime;
    if(WaktuSampaiRintangan <= 0) {
        var obstaculo = document.createElement("div");
        container.appendChild(obstaculo);
        obstaculo.classList.add("cactus");
        if(Math.random() > 0.5) obstaculo.classList.add("cactus2");
        obstaculo.posX = container.clientWidth;
        obstaculo.style.left = container.clientWidth+"px";
        Rintangan.push(obstaculo);
        WaktuSampaiRintangan = WaktuRintanganMin + Math.random() * (WaktuRintanganMaks-WaktuRintanganMin) / KecepatanGame;
    }
}

function BentukAwan(){
    CuacaHinggaAwan -= deltaTime;
    if(CuacaHinggaAwan <= 0) {
        var nube = document.createElement("div");
        container.appendChild(nube);
        nube.classList.add("nube");
        nube.posX = container.clientWidth;
        nube.style.left = container.clientWidth+"px";
        nube.style.bottom = AwanMinY + Math.random() * (AwanMaxY-AwanMinY)+"px";
        Awan.push(nube);
        CuacaHinggaAwan = CuacaAwanMin + Math.random() * (CuacaAwanMaks-CuacaAwanMin) / KecepatanGame;
    }
}

//pengambilan score pergerakan kaktus
function RintanganBergerak() {
    for (var i = Rintangan.length - 1; i >= 0; i--) {
        if(Rintangan[i].posX < -Rintangan[i].clientWidth) {
            Rintangan[i].parentNode.removeChild(Rintangan[i]);
            Rintangan.splice(i, 1);
            Poin();
        }else{
            Rintangan[i].posX -= HitungPerpindahan();
            Rintangan[i].style.left = Rintangan[i].posX+"px";
        }
    }
}
//pergerakan awan
function AwanBergerak() {
    for (var i = Awan.length - 1; i >= 0; i--) {
        if(Awan[i].posX < -Awan[i].clientWidth) {
            Awan[i].parentNode.removeChild(Awan[i]);
            Awan.splice(i, 1);
        }else{
            Awan[i].posX -= HitungPerpindahan() * KecepatanAwan;
            Awan[i].style.left = Awan[i].posX+"px";
        }
    }
}
//pengambilan score
function Poin() {
    score++;
    textoScore.innerText = score;
    score2++;
    textoScore2.innerText = score2;
    if(score == 5){
        KecepatanGame = 1.25;
        container.classList.add("sore");
    }else if(score == 10) {
        KecepatanGame = 1.5;
        container.classList.add("malam");
    } else if(score == 20) {
        KecepatanGame = 1.75;
        container.classList.add("pagi");
    } else if(score == 40) {
        KecepatanGame = 2;
        container.classList.add("sore");
    } else if(score == 60) {
        KecepatanGame = 2.25;
        container.classList.add("malam");
    } else if(score == 80) {
        KecepatanGame = 2.5;
        container.classList.add("pagi");
    }
    ground.style.animationDuration = (3/KecepatanGame)+"s";
}
//hasil jika bebek mengenai kaktus
function DeteksiTabrakan() {
    for (var i = 0; i < Rintangan.length; i++) {
        if(Rintangan[i].posX > angsaPosX + angsa.clientWidth) {
            break; 
        }else{
            if(Tabrakan(angsa, Rintangan[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}
function Tabrakan(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}
//game over
function GameOver() {
    bebekgameover();
    gameOver.style.display = "block";
}




function reloadpage(){
    location.reload()
}

//localstorage
const CACHE_KEY = "score_history";
 
function checkForStorage() {
   return typeof(Storage) !== "undefined";
}
 
function putHistory(data) {
   if (checkForStorage()) {
       let historyData = null;
       if (localStorage.getItem(CACHE_KEY) === null) {
           historyData = [];
       } else {
           historyData = JSON.parse(localStorage.getItem(CACHE_KEY));
       }
 
       historyData.unshift(data);
 
       if (historyData.length > 5) {
           historyData.pop();
       }
 
       localStorage.setItem(CACHE_KEY, JSON.stringify(historyData));
   }
}

//history score
function showHistory() {
   if (checkForStorage) {
       return JSON.parse(localStorage.getItem("rank")) || [];
   } else {
       return [];
   }
}

//menampilkan data score urut sesuai rank
function renderHistory() {
    const historyData = showHistory();
    let historyList = document.querySelector("#historyList");
    historyList.innerHTML = "";
    var i=0;
    historyData.sort(function(a, b) {
        return b.score - a.score;
    });
    for (let history of historyData) {
        let row = document.createElement('tr');
        row.innerHTML = "<td>" + (i+1) + "</td>";
        row.innerHTML += "<td>" + history.name + "</td>";
        row.innerHTML += "<td>" + history.score + "</td>";
        i++;
        historyList.appendChild(row);
    }
}
//menampilkan data score pada highscore home urut sesuai rank
function renderHistory2() {
    const historyData = showHistory();
    let historyList2 = document.querySelector("#historyList2");
    historyList2.innerHTML = "";
    var i=0;
    historyData.sort(function(a, b) {
        return b.score - a.score;
    });
    for (let history of historyData) {
        let row = document.createElement('tr');
        row.innerHTML = "<td>" + (i+1) + "</td>";
        row.innerHTML += "<td>" + history.name + "</td>";
        row.innerHTML += "<td>" + history.score + "</td>";
        i++;
        historyList2.appendChild(row);
    }
}


//  simpan score dengan nama pengguna
function getScore(){
    let playerName = document.getElementById("player-name")
    if(playerName.value == ""){
        alert("name is missing")
        return false
    }
    let playerData = {
        name: playerName.value,
        score: score
    }

    if(localStorage.getItem("rank") == null){
        localStorage.setItem("rank",JSON.stringify([playerData]))
    }else{
        let currentRank = JSON.parse(localStorage.getItem("rank"))
        currentRank.push(playerData)
        localStorage.setItem("rank",JSON.stringify(currentRank))
        console.log(localStorage.getItem("rank"))
    }
    //document.location.reload(true)
    renderHistory();
    renderHistory2();
}
 renderHistory();
 renderHistory2();