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

    // 根据 ABO 初始化抑制剂
    let inhibitors = 2;
    if (abo.value === "Beta") inhibitors = 5;

    // 保存玩家数据
    window.playerData = {
        name: name,
        abo: abo.value,
        gender: gender.value,
        scent: scent,
        scentLevel: stars,
        inhibitors: inhibitors,
        fatigue: 0,
        // ABO 专属属性
        mentalStability: abo.value === "Alpha" ? 100 : undefined,
        glandHealth: abo.value === "Omega" ? 100 : undefined,
        careerAbility: abo.value === "Beta" ? 100 : undefined
    };

    // 填充第三页 Profile
    document.getElementById("profileName").textContent = name;
    document.getElementById("profileABO").textContent = abo.value;
    document.getElementById("profileGender").textContent = gender.value;
    document.getElementById("profileScent").textContent = scent;
    document.getElementById("profileLevel").textContent = starText;

    // 跳转
    document.getElementById("page2").style.display = "none";
    document.getElementById("page3").style.display = "block";

    // 触发 Month 1 事件
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

// ==========================
// Month 1 事件系统
// ==========================

let month1Completed = false;

// ---------- 更新玩家 Profile 显示 ----------
function updatePlayerStats() {
    const p = window.playerData;
    if (!p) return;

    // 更新疲惫值（在 Profile 下方加一行显示）
    let fatigueDisplay = document.getElementById("playerFatigue");
    if (!fatigueDisplay) {
        // 如果不存在就创建一个
        const profileDiv = document.getElementById("playerProfile");
        const pTag = document.createElement("p");
        pTag.id = "playerFatigue";
        pTag.innerHTML = `疲惫值: <span id="fatigueValue">${p.fatigue}</span>`;
        profileDiv.appendChild(pTag);
    } else {
        document.getElementById("fatigueValue").textContent = p.fatigue;
    }

    // 更新 ABO 专属属性
    if (p.abo === "Alpha") {
        let el = document.getElementById("playerMental");
        if (!el) {
            const profileDiv = document.getElementById("playerProfile");
            const pTag = document.createElement("p");
            pTag.id = "playerMental";
            pTag.innerHTML = `精神稳定: <span id="mentalValue">${p.mentalStability}</span>`;
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
            pTag.innerHTML = `腺体健康: <span id="glandValue">${p.glandHealth}</span>`;
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
            pTag.innerHTML = `职业能力: <span id="careerValue">${p.careerAbility}</span>`;
            profileDiv.appendChild(pTag);
        } else {
            document.getElementById("careerValue").textContent = p.careerAbility;
        }
    }

    // 更新抑制剂显示
    let inhibitorDisplay = document.getElementById("playerInhibitors");
    if (!inhibitorDisplay) {
        const profileDiv = document.getElementById("playerProfile");
        const pTag = document.createElement("p");
        pTag.id = "playerInhibitors";
        pTag.innerHTML = `抑制剂: <span id="inhibitorValue">${p.inhibitors}</span>`;
        profileDiv.appendChild(pTag);
    } else {
        document.getElementById("inhibitorValue").textContent = p.inhibitors;
    }
}

// ---------- 更新 NPC 卡牌数值 ----------
function updateNPCStats() {
    // Leon
    const leonGland = document.getElementById("leon-gland");
    if (leonGland) leonGland.textContent = npcs.leon.glandHealth;
    const leonFatigue = document.getElementById("leon-fatigue");
    if (leonFatigue) leonFatigue.textContent = npcs.leon.fatigue;

    // Iris
    const irisCareer = document.getElementById("iris-career");
    if (irisCareer) irisCareer.textContent = npcs.iris.careerAbility;
    const irisFatigue = document.getElementById("iris-fatigue");
    if (irisFatigue) irisFatigue.textContent = npcs.iris.fatigue;

    // Raven
    const ravenMental = document.getElementById("raven-mental");
    if (ravenMental) ravenMental.textContent = npcs.raven.mentalStability;
    const ravenFatigue = document.getElementById("raven-fatigue");
    if (ravenFatigue) ravenFatigue.textContent = npcs.raven.fatigue;
}

// ---------- 显示事件结果 ----------
function showEventResult(message) {
    const content = document.getElementById("eventContent");
    if (content) {
        content.innerHTML = `<p style="color:#2c3e50;">${message}</p>`;
    }
    // 隐藏选项按钮
    const optionsDiv = document.getElementById("eventOptions");
    if (optionsDiv) {
        optionsDiv.style.display = "none";
    }
    // 标记完成
    month1Completed = true;
    // 更新显示
    updatePlayerStats();
    updateNPCStats();
}

// ---------- Month 1 事件 ----------
function startMonth1() {
    if (month1Completed) return;

    const p = window.playerData;
    if (!p) return;

    const content = document.getElementById("eventContent");
    const optionsDiv = document.getElementById("eventOptions");

    // 显示事件文案
    content.innerHTML = `
        <p style="font-weight:600; color:#2c3e50;">Month 1 —— 新生周</p>
        <p style="color:#444; margin-top:8px;">你在走廊上遇见 Leon，他脸色苍白，额角渗出汗珠。</p>
        <p style="color:#444;">他看见你，勉强挤出一个笑容：<em>"…没事，只是发情期提前了。"</em></p>
        <p style="color:#444; margin-top:8px;">你知道，如果不及时处理，他的腺体会受损。</p>
        <p style="color:#888; font-size:0.85rem; margin-top:6px;">当前抑制剂: ${p.inhibitors} 支</p>
    `;

    // 清空并重新生成选项按钮
    optionsDiv.innerHTML = "";
    optionsDiv.style.display = "flex";

    // 根据玩家 ABO 显示不同选项
    if (p.abo === "Alpha") {
        // Alpha 玩家：三个选项
        const btn1 = createOptionButton(
            "用信息素安抚 Leon",
            "你释放出信息素，轻轻包裹住 Leon。他微微颤抖，随后渐渐平静下来。发情期被压下去了。",
            function() {
                p.fatigue += 5;
                npcs.leon.glandHealth = Math.min(100, npcs.leon.glandHealth + 5);
                npcs.leon.bond += 15;
                showEventResult(
                    "你用自己的信息素安抚了 Leon。\n" +
                    "你的疲惫值 +5\n" +
                    "Leon 的腺体健康恢复 +5\n" +
                    "羁绊度 +15"
                );
            }
        );
        optionsDiv.appendChild(btn1);
    }

    // 抑制剂选项（所有玩家可见）
    const btn2 = createOptionButton(
        "帮 Leon 去医疗部拿抑制剂",
        "你快步跑向医疗部，取回抑制剂递给 Leon。他注射后，脸色好了许多。",
        function() {
            if (p.inhibitors <= 0) {
                alert("你手中没有抑制剂了！");
                return;
            }
            p.inhibitors -= 1;
            npcs.leon.glandHealth = Math.max(0, npcs.leon.glandHealth - 5);
            npcs.leon.bond += 5;
            showEventResult(
                "你帮 Leon 拿到了抑制剂。\n" +
                "剩余抑制剂 -1\n" +
                "Leon 的腺体健康 -5（抑制剂只能缓解，不能代替信息素）\n" +
                "羁绊度 +5"
            );
        }
    );
    optionsDiv.appendChild(btn2);

    // 无视选项（所有玩家可见）
    const btn3 = createOptionButton(
        "假装没看见，转身离开",
        "你移开视线，快步走过。背后传来 Leon 压抑的喘息声…",
        function() {
            npcs.leon.glandHealth = Math.max(0, npcs.leon.glandHealth - 10);
            npcs.leon.bond = Math.max(0, npcs.leon.bond - 5);

            // 根据玩家 ABO 扣除对应属性
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
                "你选择了无视。\n" +
                "Leon 的腺体健康 -10\n" +
                "羁绊度 -5\n" +
                penaltyMsg
            );
        }
    );
    optionsDiv.appendChild(btn3);

    // 追加到 eventPanel
    const panel = document.getElementById("eventPanel");
    if (!document.getElementById("eventOptions")) {
        const wrapper = document.createElement("div");
        wrapper.id = "eventOptions";
        wrapper.style.cssText = "display:flex; flex-direction:column; gap:10px; margin-top:16px;";
        panel.appendChild(wrapper);
    }
    // 重新挂载
    const existingWrapper = document.getElementById("eventOptions");
    existingWrapper.innerHTML = "";
    existingWrapper.style.display = "flex";
    [btn1, btn2, btn3].forEach(b => {
        if (b) existingWrapper.appendChild(b);
    });
    // 调整 btn1 是否存在
    // 因为上面 btn1 只在 Alpha 时创建，但这里 append 会报错，我们用更稳健的方式：
    // 重新整理：直接用上面的逻辑重建
}

// ---------- 辅助：创建选项按钮 ----------
function createOptionButton(label, resultMessage, callback) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "event-option-btn";
    btn.addEventListener("click", function() {
        if (month1Completed) return;
        // 执行回调（会调用 showEventResult）
        callback();
    });
    return btn;
}

// 修正 startMonth1 里的按钮挂载逻辑，重写如下：

// 重新声明 startMonth1（覆盖上面的版本）
startMonth1 = function() {
    if (month1Completed) return;

    const p = window.playerData;
    if (!p) return;

    const content = document.getElementById("eventContent");
    let optionsDiv = document.getElementById("eventOptions");

    // 显示事件文案
    content.innerHTML = `
        <p style="font-weight:600; color:#2c3e50;">Month 1 —— 新生周</p>
        <p style="color:#444; margin-top:8px;">你在走廊上遇见 Leon，他脸色苍白，额角渗出汗珠。</p>
        <p style="color:#444;">他看见你，勉强挤出一个笑容：<em>"…没事，只是发情期提前了。"</em></p>
        <p style="color:#444; margin-top:8px;">你知道，如果不及时处理，他的腺体会受损。</p>
        <p style="color:#888; font-size:0.85rem; margin-top:6px;">当前抑制剂: ${p.inhibitors} 支</p>
    `;

    // 如果 optionsDiv 不存在则创建
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

    // 根据 ABO 创建选项
    const buttons = [];

    if (p.abo === "Alpha") {
        const btn = createOptionButton(
            "用信息素安抚 Leon",
            "",
            function() {
                if (month1Completed) return;
                p.fatigue += 5;
                npcs.leon.glandHealth = Math.min(100, npcs.leon.glandHealth + 5);
                npcs.leon.bond += 15;
                showEventResult(
                    "你用自己的信息素安抚了 Leon。\n" +
                    "你的疲惫值 +5\n" +
                    "Leon 的腺体健康恢复 +5\n" +
                    "羁绊度 +15"
                );
            }
        );
        buttons.push(btn);
    }

    const btn2 = createOptionButton(
        "帮 Leon 去医疗部拿抑制剂",
        "",
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
                "你帮 Leon 拿到了抑制剂。\n" +
                "剩余抑制剂 -1\n" +
                "Leon 的腺体健康 -5（抑制剂只能缓解，不能代替信息素）\n" +
                "羁绊度 +5"
            );
        }
    );
    buttons.push(btn2);

    const btn3 = createOptionButton(
        "假装没看见，转身离开",
        "",
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
                "你选择了无视。\n" +
                "Leon 的腺体健康 -10\n" +
                "羁绊度 -5\n" +
                penaltyMsg
            );
        }
    );
    buttons.push(btn3);

    buttons.forEach(b => optionsDiv.appendChild(b));

    // 更新数值显示
    updatePlayerStats();
    updateNPCStats();
};