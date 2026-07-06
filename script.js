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

// ==========================
// NPC 系统（追加到现有 script.js 末尾）
// ==========================

// ---------- NPC 数据 ----------
const npcs = {
    leon: {
        id: "leon",
        name: "Leon",
        abo: "Omega",
        gender: "Male",
        scent: "Mint",
        scentLevel: 3,
        personality: "温柔坚韧",
        department: "支援部",
        glandHealth: 100,
        fatigue: 0,
        bond: 0,
        match: null,          // 匹配度，点击测试后填入
        traits: ["温柔", "坚韧"]
    },
    iris: {
        id: "iris",
        name: "Iris",
        abo: "Beta",
        gender: "Female",
        scent: "Ocean",
        scentLevel: 4,
        personality: "理性冷静",
        department: "医疗部",
        careerAbility: 100,
        fatigue: 0,
        bond: 0,
        match: null,
        traits: ["理性", "冷静"]
    },
    raven: {
        id: "raven",
        name: "Raven",
        abo: "Alpha",
        gender: "Male",
        scent: "Coffee",
        scentLevel: 5,
        personality: "沉稳可靠",
        department: "战斗部",
        mentalStability: 100,
        fatigue: 0,
        bond: 0,
        match: null,
        traits: ["沉稳", "可靠"]
    }
};

// ---------- 玩家数据（用于匹配度计算） ----------
// 从 Page 2 创建时已有，这里做占位，实际从页面读取
let playerDataForMatch = {
    abo: "Alpha",      // 从 Page 2 获取
    gender: "Male",
    scent: "Coffee",
    scentLevel: 5
};

// ---------- 匹配度计算 ----------
function calcMatch(playerAbo, playerScentLevel, npc) {
    let base = 0;
    const npcAbo = npc.abo;

    // 基础分
    if ((playerAbo === "Alpha" && npcAbo === "Omega") ||
        (playerAbo === "Omega" && npcAbo === "Alpha")) {
        base = 70;
    } else if (playerAbo === npcAbo) {
        base = 40;
    } else {
        base = 30;
    }

    // 信息素等级差
    const diff = Math.abs(playerScentLevel - npc.scentLevel);
    let scentBonus = 0;
    if (diff <= 1) scentBonus = 10;
    else if (diff >= 3) scentBonus = -10;

    // 性格相合（简化：暂不匹配具体词，直接给固定值）
    // 这里你可以后期丰富
    const personalityBonus = 10;

    let match = base + scentBonus + personalityBonus;
    match = Math.max(0, Math.min(100, match));
    return match;
}

// ---------- 弹窗渲染 ----------
function openNpcModal(npcId) {
    const npc = npcs[npcId];
    if (!npc) return;

    // 构建弹窗
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "npcModal";

    // 获取玩家信息
    const playerAbo = document.querySelector('input[name="abo"]:checked');
    const playerScentSelect = document.getElementById("playerScent");
    const playerAboValue = playerAbo ? playerAbo.value : "Alpha";
    const playerScentValue = playerScentSelect ? playerScentSelect.value : "Coffee";
    const playerScentLevel = npcs.raven ? 5 : 3; // 简化，后续可完善

    // 如果还没测匹配度，计算并存储
    if (npc.match === null) {
        npc.match = calcMatch(playerAboValue, playerScentLevel, npc);
    }

    // 羁绊度称谓
    const bond = npc.bond || 0;
    let bondLabel = "点头之交";
    if (bond >= 80) bondLabel = "过命之交 / 比翼连枝";
    else if (bond >= 60) bondLabel = "信任的朋友";
    else if (bond >= 40) bondLabel = "熟悉的搭子";
    else if (bond >= 20) bondLabel = "同僚";

    overlay.innerHTML = `
        <div class="modal-box">
            <h2>${npc.name}</h2>
            <div class="modal-sub">${npc.abo} ｜ ${npc.gender} ｜ ${npc.department}</div>

            <div class="modal-row">
                <span class="modal-label">性格</span>
                <span class="modal-value">${npc.personality}</span>
            </div>
            <div class="modal-row">
                <span class="modal-label">职业</span>
                <span class="modal-value">${npc.department}</span>
            </div>
            <div class="modal-row">
                <span class="modal-label">匹配度</span>
                <span class="modal-value" id="matchDisplay-${npcId}">
                    ${npc.match !== null ? npc.match + '%' : '<span class="match-btn" id="testMatchBtn">点击测试</span>'}
                </span>
            </div>
            <div class="modal-row">
                <span class="modal-label">羁绊度</span>
                <span class="modal-value">${bond}% ｜ ${bondLabel}</span>
            </div>

            <button class="modal-close-btn" id="closeModalBtn">关闭</button>
        </div>
    `;

    document.body.appendChild(overlay);

    // 绑定测试按钮（如果存在）
    const testBtn = document.getElementById("testMatchBtn");
    if (testBtn) {
        testBtn.addEventListener("click", function() {
            // 重新计算并更新显示
            npc.match = calcMatch(playerAboValue, playerScentLevel, npc);
            const display = document.getElementById(`matchDisplay-${npcId}`);
            if (display) {
                display.textContent = npc.match + '%';
                display.className = 'modal-value'; // 去掉按钮样式
            }
        });
    }

    // 关闭弹窗
    const closeBtn = document.getElementById("closeModalBtn");
    closeBtn.addEventListener("click", function() {
        overlay.remove();
    });

    // 点击背景关闭
    overlay.addEventListener("click", function(e) {
        if (e.target === overlay) overlay.remove();
    });
}

// ---------- 绑定 NPC 卡片的 more 按钮 ----------
document.querySelectorAll('.more-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const npcId = this.dataset.npc;
        openNpcModal(npcId);
    });
});

// ---------- 从 Page 2 读取玩家数据（当跳转到 Page3 时更新） ----------
// 在 confirmBtn 的跳转逻辑里追加这段
// 你现有的 confirmBtn 代码中，在跳转前加入：
// playerDataForMatch.abo = abo.value;
// playerDataForMatch.scent = scent;
// playerDataForMatch.scentLevel = scentDatabase[scent] || 3;

// 如果你愿意，我也可以帮你把现有的 confirmBtn 逻辑合并这段进去
console.log("✅ NPC 系统已加载");