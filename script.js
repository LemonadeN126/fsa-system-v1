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
    if (loadingText) {
        loadingText.textContent = loadingList[loadingIndex];
    }
    loadingIndex++;

    if (loadingIndex >= loadingList.length) {
        clearInterval(loadingTimer);
        // 关键修复：Loading完成后显示ENTER按钮
        const enterBtn = document.getElementById("enterBtn");
        if (enterBtn) {
            enterBtn.style.opacity = "1";
            enterBtn.style.pointerEvents = "auto";
        }
    }
}, 700);

// ---------- ENTER ----------
// 改用 addEventListener，更稳定
document.getElementById("enterBtn").addEventListener("click", function() {
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
});

// ---------- CONFIRM ----------
document.getElementById("confirmBtn").addEventListener("click", function() {
    const name = document.getElementById("playerName").value.trim();
    const abo = document.querySelector('input[name="abo"]:checked');
    const gender = document.querySelector('input[name="gender"]:checked');
    const scent = document.getElementById("playerScent").value;

    if (name === "" || abo === null || gender === null || scent === "") {
        alert("Please complete all information.");
        return;
    }

    const stars = scentDatabase[scent];
    let starText = "";

    if (stars === 5) starText = "★★★★★";
    else if (stars === 4) starText = "★★★★☆";
    else if (stars === 3) starText = "★★★☆☆";
    else if (stars === 2) starText = "★★☆☆☆";
    else starText = "☆☆☆☆☆";

    document.getElementById("profileName").textContent = name;
    document.getElementById("profileABO").textContent = abo.value;
    document.getElementById("profileGender").textContent = gender.value;
    document.getElementById("profileScent").textContent = scent;
    document.getElementById("profileLevel").textContent = starText;

    document.getElementById("page2").style.display = "none";
    document.getElementById("page3").style.display = "block";
});

// 额外修复：如果页面加载时按钮没隐藏，补一个初始状态
document.addEventListener("DOMContentLoaded", function() {
    const enterBtn = document.getElementById("enterBtn");
    if (enterBtn) {
        enterBtn.style.opacity = "0";
        enterBtn.style.pointerEvents = "none";
    }
});