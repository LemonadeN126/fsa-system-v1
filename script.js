// ==========================
// Federal Star Academy v0.2
// script.js
// ==========================

// ---------- 信息素数据库 ----------
const scentDatabase = {
    "Coffee": 5, "Cedar": 5, "Whiskey": 5, "Amber": 5,
    "Ocean": 4, "Rose": 4, "Jasmine": 4, "Black Tea": 4, "Pine": 4, "White Musk": 4,
    "Mint": 3, "Lemon": 3, "Green Tea": 3, "Apple": 3, "Bamboo": 3, "Cotton": 3,
    "Vanilla": 2, "Honey": 2, "Peach": 2, "Milk": 2
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

    let inhibitors = 2;
    if (abo.value === "Beta") inhibitors = 5;

    window.playerData = {
        name: name,
        abo: abo.value,
        gender: gender.value,
        scent: scent,
        scentLevel: stars,
        inhibitors: inhibitors,
        fatigue: 0,
        mentalStability: abo.value === "Alpha" ? 100 : undefined,
        glandHealth: abo.value === "Omega" ? 100 : undefined,
        careerAbility: abo.value === "Beta" ? 100 : undefined
    };

    document.getElementById("profileName").textContent = name;
    document.getElementById("profileABO").textContent = abo.value;
    document.getElementById("profileGender").textContent = gender.value;
    document.getElementById("profileScent").textContent = scent;
    document.getElementById("profileLevel").textContent = starText;

    document.getElementById("page2").style.display = "none";
    document.getElementById("page3").style.display = "block";

    startMonth1();
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
// NPC 数据
// ==========================

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

// ---------- 弹窗 ----------
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
            }
        });
    });
});

// ==========================
// 更新函数
// ==========================

function updatePlayerStats() {
    const p = window.playerData;
    if (!p) return;

    let fatigueDisplay = document.getElementById("playerFatigue");
    if (!fatigueDisplay) {
        const profileDiv = document.getElementById("playerProfile");
        const pTag = document.createElement("p");
        pTag.id = "playerFatigue";
        pTag.innerHTML = '疲惫值: <span id="fatigueValue">' + p.fatigue + '</span>';
        profileDiv.appendChild(pTag);
    } else {
        document.getElementById("fatigueValue").textContent = p.fatigue;
    }

    let inhibitorDisplay = document.getElementById("playerInhibitors");
    if (!inhibitorDisplay) {
        const profileDiv = document.getElementById("playerProfile");
        const pTag = document.createElement("p");
        pTag.id = "playerInhibitors";
        pTag.innerHTML = '抑制剂: <span id="inhibitorValue">' + p.inhibitors + '</span> 支';
        profileDiv.appendChild(pTag);
    } else {
        document.getElementById("inhibitorValue").textContent = p.inhibitors;
    }

    if (p.abo === "Alpha") {
        let el = document.getElementById("playerMental");
        if (!el) {
            const profileDiv = document.getElementById("playerProfile");
            const pTag = document.createElement("p");
            pTag.id = "playerMental";
            pTag.innerHTML = '精神稳定: <span id="mentalValue">' + p.mentalStability + '</span>';
            profileDiv.appendChild(pTag);
        } else {
            document.getElementById("mentalValue").textContent = p.mentalStability;
        }
    } else if (p.abo === "Omega") {
        let el = document.getElementById("playerGland");
        if (!el) {
            const profileDiv = document.getElementById("playerProfile");
            const pTag = document.createElement("p");
            pTag.id = "playerGland";
            pTag.innerHTML = '腺体健康: <span id="glandValue">' + p.glandHealth + '</span>';
            profileDiv.appendChild(pTag);
        } else {
            document.getElementById("glandValue").textContent = p.glandHealth;
        }
    } else if (p.abo === "Beta") {
        let el = document.getElementById("playerCareer");
        if (!el) {
            const profileDiv = document.getElementById("playerProfile");
            const pTag = document.createElement("p");
            pTag.id = "playerCareer";
            pTag.innerHTML = '职业能力: <span id="careerValue">' + p.careerAbility + '</span>';
            profileDiv.appendChild(pTag);
        } else {
            document.getElementById("careerValue").textContent = p.careerAbility;
        }
    }
}

function updateNPCStats() {
    const leonGland = document.getElementById("leon-gland");
    if (leonGland) leonGland.textContent = npcs.leon.glandHealth;
    const leonFatigue = document.getElementById("leon-fatigue");
    if (leonFatigue) leonFatigue.textContent = npcs.leon.fatigue;

    const irisCareer = document.getElementById("iris-career");
    if (irisCareer) irisCareer.textContent = npcs.iris.careerAbility;
    const irisFatigue = document.getElementById("iris-fatigue");
    if (irisFatigue) irisFatigue.textContent = npcs.iris.fatigue;

    const ravenMental = document.getElementById("raven-mental");
    if (ravenMental) ravenMental.textContent = npcs.raven.mentalStability;
    const ravenFatigue = document.getElementById("raven-fatigue");
    if (ravenFatigue) ravenFatigue.textContent = npcs.raven.fatigue;
}

function updateAllBondLabels() {
    const modal = document.getElementById("npcModal");
    if (modal) {
        modal.remove();
    }
}

// ==========================
// Month 1 事件
// ==========================

let month1Completed = false;
let month2Completed = false;

function showEventResult(message) {
    const content = document.getElementById("eventContent");
    if (content) {
        content.innerHTML = '<p style="color:#2c3e50;">' + message + '</p>';
    }
    const optionsDiv = document.getElementById("eventOptions");
    if (optionsDiv) {
        optionsDiv.style.display = "none";
    }
    month1Completed = true;
    updatePlayerStats();
    updateNPCStats();
    updateAllBondLabels();

if (month1Completed && !month2Completed) {
        setTimeout(startMonth2, 5000);
    }
}

function createOptionButton(label, callback) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "event-option-btn";
    btn.addEventListener("click", function() {
        if (month1Completed) return;
        callback();
    });
    return btn;
}

function startMonth1() {
    if (month1Completed) return;

    const p = window.playerData;
    if (!p) return;

    const content = document.getElementById("eventContent");
    let optionsDiv = document.getElementById("eventOptions");

    content.innerHTML = `
        <p style="font-weight:600; color:#2c3e50;">Month 1 —— 新生周</p>
        <p style="color:#444; margin-top:8px;">你在走廊上遇见 Leon，他脸色苍白，额角渗出汗珠。</p>
        <p style="color:#444;">他看见你，勉强挤出一个笑容："…没事，只是发情期提前了。"</p>
        <p style="color:#444; margin-top:8px;">你知道，如果不及时处理，他的腺体会受损。</p>
        <p style="color:#888; font-size:0.85rem; margin-top:6px;">抑制剂: ${p.inhibitors} 支</p>
    `;

    if (!optionsDiv) {
        const panel = document.getElementById("eventPanel");
        const div = document.createElement("div");
        div.id = "eventOptions";
        div.style.cssText = "display:flex; flex-direction:column; gap:10px; margin-top:16px;";
        panel.appendChild(div);
        optionsDiv = document.getElementById("eventOptions");
    }
    optionsDiv.innerHTML = "";
    optionsDiv.style.display = "flex";

    const buttons = [];

    if (p.abo === "Alpha") {
        const btn = createOptionButton(
            "用信息素安抚 Leon",
            function() {
                if (month1Completed) return;
                p.fatigue += 5;
                npcs.leon.glandHealth = Math.min(100, npcs.leon.glandHealth + 5);
                npcs.leon.bond += 15;
                showEventResult(
                    "你用自己的信息素安抚了 Leon。" +
                    "<br>疲惫值 +5" +
                    "<br>Leon 的腺体健康恢复 +5" +
                    "<br>羁绊度 +15"
                );
            }
        );
        buttons.push(btn);
    }

    const btn2 = createOptionButton(
        "帮 Leon 去医疗部拿抑制剂",
        function() {
            if (month1Completed) return;
            if (p.inhibitors <= 0) {
                alert("你手中没有抑制剂了！");
                return;
            }
            p.inhibitors -= 1;
            npcs.leon.glandHealth = Math.max(0, npcs.leon.glandHealth - 5);
            npcs.leon.bond += 5;
            showEventResult(
                "你帮 Leon 拿到了抑制剂。" +
                "<br>剩余抑制剂 -1" +
                "<br>Leon 的腺体健康 -5（抑制剂只能缓解，不能代替信息素）" +
                "<br>羁绊度 +5"
            );
        }
    );
    buttons.push(btn2);

    const btn3 = createOptionButton(
        "假装没看见，转身离开",
        function() {
            if (month1Completed) return;
            npcs.leon.glandHealth = Math.max(0, npcs.leon.glandHealth - 10);
            npcs.leon.bond = Math.max(0, npcs.leon.bond - 5);

            let penaltyMsg = "";
            if (p.abo === "Alpha") {
                p.mentalStability = Math.max(0, p.mentalStability - 5);
                penaltyMsg = "精神稳定 -5";
            } else if (p.abo === "Omega") {
                p.glandHealth = Math.max(0, p.glandHealth - 5);
                penaltyMsg = "腺体健康 -5";
            } else if (p.abo === "Beta") {
                p.careerAbility = Math.max(0, p.careerAbility - 5);
                penaltyMsg = "职业能力 -5";
            }

            showEventResult(
                "你选择了无视。" +
                "<br>Leon 的腺体健康 -10" +
                "<br>羁绊度 -5" +
                "<br>" + penaltyMsg
            );
        }
    );
    buttons.push(btn3);

    buttons.forEach(function(b) {
        optionsDiv.appendChild(b);
    });

    updatePlayerStats();
    updateNPCStats();
}

// ==========================
// Month 2 事件
// ==========================

function startMonth2() {
    if (month2Completed) return;
    if (!month1Completed) return;

    const p = window.playerData;
    if (!p) return;

    const content = document.getElementById("eventContent");
    let optionsDiv = document.getElementById("eventOptions");

    content.innerHTML = `
        <p style="font-weight:600; color:#2c3e50;">Month 2 —— 战术训练</p>
        <p style="color:#444; margin-top:8px;">今天的战术训练课上，Raven 被教官点名与你一组进行对抗演练。</p>
        <p style="color:#444;">他走到你身边，低声说："放轻松，按照平时练的来。"</p>
        <p style="color:#444; margin-top:8px;">演练结束后，教官评价说你们的配合"还有很大提升空间"。</p>
        <p style="color:#888; font-size:0.85rem; margin-top:6px;">抑制剂: ${p.inhibitors} 支</p>
    `;

    if (!optionsDiv) {
        const panel = document.getElementById("eventPanel");
        const div = document.createElement("div");
        div.id = "eventOptions";
        div.style.cssText = "display:flex; flex-direction:column; gap:10px; margin-top:16px;";
        panel.appendChild(div);
        optionsDiv = document.getElementById("eventOptions");
    }
    optionsDiv.innerHTML = "";
    optionsDiv.style.display = "flex";

    const btn1 = document.createElement("button");
    btn1.textContent = "主动约 Raven 加练";
    btn1.className = "event-option-btn";
    btn1.addEventListener("click", function() {
        if (month2Completed) return;
        p.fatigue += 5;
        npcs.raven.bond += 10;
        showMonth2Result(
            "你约 Raven 在课后加练了两个小时。他话不多，但每次你失误时都会及时纠正。",
            "疲惫值 +5",
            "Raven 羁绊度 +10"
        );
    });
    optionsDiv.appendChild(btn1);

    const btn2 = document.createElement("button");
    btn2.textContent = "请 Raven 喝咖啡，聊聊战术";
    btn2.className = "event-option-btn";
    btn2.addEventListener("click", function() {
        if (month2Completed) return;
        p.fatigue += 2;
        npcs.raven.bond += 5;
        showMonth2Result(
            "你们在军校咖啡厅聊了一个小时。Raven 分享了他对虫族战术的一些看法，你听得很认真。",
            "疲惫值 +2",
            "Raven 羁绊度 +5"
        );
    });
    optionsDiv.appendChild(btn2);

    const btn3 = document.createElement("button");
    btn3.textContent = "独自复盘，下次再说";
    btn3.className = "event-option-btn";
    btn3.addEventListener("click", function() {
        if (month2Completed) return;
        showMonth2Result(
            "你回到宿舍，把今天的演练录像看了三遍。下次一定会更好。",
            "无变化",
            "无变化"
        );
    });
    optionsDiv.appendChild(btn3);

    updatePlayerStats();
    updateNPCStats();
}

function showMonth2Result(storyText, playerChange, npcChange) {
    const content = document.getElementById("eventContent");
    if (content) {
        content.innerHTML = `
            <p style="font-weight:600; color:#2c3e50;">Month 2 —— 战术训练</p>
            <p style="color:#444; margin-top:8px;">${storyText}</p>
            <p style="color:#555; margin-top:10px; font-size:0.9rem;">${playerChange} ｜ ${npcChange}</p>
        `;
    }
    const optionsDiv = document.getElementById("eventOptions");
    if (optionsDiv) {
        optionsDiv.style.display = "none";
    }
    month2Completed = true;
    updatePlayerStats();
    updateNPCStats();
    updateAllBondLabels();
}