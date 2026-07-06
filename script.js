// ==========================
// Federal Star Academy v0.2
// script.js
// ==========================

// Information Scent Database

const scentDatabase = {
    "Coffee": 5,
    "Cedar": 5,
    "Whiskey": 5,
    "Amber": 5,

    "Ocean": 4,
    "Rose": 4,
    "Jasmine": 4,
    "Black Tea": 4,
    "Pine": 4,
    "White Musk": 4,

    "Mint": 3,
    "Lemon": 3,
    "Green Tea": 3,
    "Apple": 3,
    "Bamboo": 3,
    "Cotton": 3,

    "Vanilla": 2,
    "Honey": 2,
    "Peach": 2,
    "Milk": 2
};

// ---------- Loading ----------

const loadingText = document.getElementById("loadingText");

const loadingList = [
    "Loading.",
    "Loading..",
    "Loading...",
    "Loading......",
    "Connection established."
];

let loadingIndex = 0;

const loadingTimer = setInterval(() => {

    loadingText.textContent = loadingList[loadingIndex];

    loadingIndex++;

    if (loadingIndex >= loadingList.length) {

        clearInterval(loadingTimer);

    }

},700);

// ---------- ENTER ----------

document.getElementById("enterBtn").onclick = function(){

    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";

};

// ---------- CONFIRM ----------

document.getElementById("confirmBtn").onclick = function(){

    const name =
        document.getElementById("playerName").value;

    const abo =
        document.querySelector('input[name="abo"]:checked');

    const gender =
        document.querySelector('input[name="gender"]:checked');

    const scent =
        document.getElementById("playerScent").value;

    if(
        name === "" ||
        abo === null ||
        gender === null ||
        scent === ""
    ){

        alert("Please complete all information.");

        return;

    }

    const stars = scentDatabase[scent];

    let starText = "";

    if(stars === 5){

        starText = "★★★★★";

    }

    if(stars === 4){

        starText = "★★★★☆";

    }

    if(stars === 3){

        starText = "★★★☆☆";

    }

    if(stars === 2){

        starText = "★★☆☆☆";

    }

    document.getElementById("profileName").textContent =
        name;

    document.getElementById("profileABO").textContent =
        abo.value;

    document.getElementById("profileGender").textContent =
        gender.value;

    document.getElementById("profileScent").textContent =
        scent;

    document.getElementById("profileLevel").textContent =
        starText;

    document.getElementById("page2").style.display = "none";

    document.getElementById("page3").style.display = "block";

};