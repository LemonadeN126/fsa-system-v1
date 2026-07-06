// ==========================
// Federal Star Academy v0.2
// script.js
// ==========================

// ---------- 信息素数据库 ----------
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
        const enterBtn = document.getElementById("enterBtn");
        if (enterBtn) {
            enterBtn.style.opacity = "1";
            enterBtn.style.pointerEvents = "auto";
        }
    }
}, 700);

// ---------- ENTER ----------
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

    if (!name || !abo || !gender || !scent) {
        alert("Please complete all information.");
        return;
    }

    const stars = scentDatabase[scent] || 0;
    const starMap = { 5: "★★★★★", 4: "★★★★☆", 3: "★★★☆☆", 2: "★★☆☆☆" };
    const starText = starMap[stars] || "☆☆☆☆☆";

    // 保存玩家数据（供匹配度使用）
    window.playerData = {
        name: name,
        abo: abo.value,
        gender: gender.value,
        scent: scent,
        scentLevel: stars
    };

    document.getElementById("profileName").textContent = name;
    document.getElementById("profileABO").textContent = abo.value;
    document.getElementById("profileGender").textContent = gender.value;
    document.getElementById("profileScent").textContent = scent;
    document.getElementById("profileLevel").textContent = starText;

    document.getElementById("page2").style.display = "none";
    document.getElementById("page3").style.display = "block";
});

// ---------- 初始化：默认隐藏ENTER ----------
document.addEventListener("DOMContentLoaded", function() {
    const enterBtn = document.getElementById("enterBtn");
    if (enterBtn) {
        enterBtn.style.opacity = "0";
        enterBtn.style.pointerEvents = "none";
    }
});

// ==========================
// NPC 系统
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
        match: null,
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

// ---------- 匹配度计算 ----------
function calcMatch(playerAbo, playerScentLevel, npc) {
    let base = 0;
    const npcAbo = npc.abo;

    if ((playerAbo === "Alpha" && npcAbo === "Omega") ||
        (playerAbo === "Omega" && npcAbo === "Alpha")) {
        base = 70;
    } else if (playerAbo === npcAbo) {
        base = 40;
    } else {
        base = 30;
    }

    const diff = Math.abs(playerScentLevel - npc.scentLevel);
    let scentBonus = 0;
    if (diff <= 1) scentBonus = 10;
    else if (diff >= 3) scentBonus = -10;

    const personalityBonus = 10;

    let match = base + scentBonus + personalityBonus;
    match = Math.max(0, Math.min(100, match));
    return match;
}

// ---------- 羁绊度称谓 ----------
function getBondLabel(bond) {
    if (bond >= 80) return "过命之交 / 比翼连枝";
    if (bond >= 60) return "信任的朋友";
    if (bond >= 40) return "熟悉的搭子";
    if (bond >= 20) return "同僚";
    return "点头之交";
}

// ---------- 弹窗渲染 ----------
function openNpcModal(npcId) {
    const npc = npcs[npcId];
    if (!npc) return;

    const player = window.playerData || { abo: "Alpha", scentLevel: 5 };

    if (npc.match === null) {
        npc.match = calcMatch(player.abo, player.scentLevel, npc);
    }

    const bond = npc.bond || 0;
    const bondLabel = getBondLabel(bond);

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "npcModal";

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

    const testBtn = document.getElementById("testMatchBtn");
    if (testBtn) {
        testBtn.addEventListener("click", function() {
            npc.match = calcMatch(player.abo, player.scentLevel, npc);
            const display = document.getElementById(`matchDisplay-${npcId}`);
            if (display) {
                display.textContent = npc.match + '%';
                display.className = 'modal-value';
            }
        });
    }

    const closeBtn = document.getElementById("closeModalBtn");
    closeBtn.addEventListener("click", function() {
        overlay.remove();
    });

    overlay.addEventListener("click", function(e) {
        if (e.target === overlay) overlay.remove();
    });
}

// ---------- 绑定 more 按钮 ----------
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.more-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const npcId = this.dataset.npc;
            if (npcId && npcs[npcId]) {
                openNpcModal(npcId);
            } else {
                console.warn("NPC not found:", npcId);
            }
        });
    });
    console.log("✅ NPC 系统已加载");
});