// 遊戲參數
const symbols = ["🍒", "🍋", "⭐", "🔔", "💎"];
const payouts = { "🍒": 5, "🍋": 5, "⭐": 2, "🔔": 2, "💎": 50 };
let balance = 100000;
let jackpotPool = 0;
let reelIntervals = []; // 儲存轉輪的 interval ID

// 更新顯示
function updateDisplay() {
    document.getElementById("balance").textContent = balance;
    document.getElementById("jackpot").textContent = jackpotPool;
}

// 檢查中獎條件
function checkWin(reelValues) {
    if (reelValues[0] === reelValues[1] && reelValues[1] === reelValues[2]) {
        return payouts[reelValues[0]] || 0; // 返回倍數
    }
    return 0; // 沒有中獎
}

// 啟動轉輪動畫
function startReelAnimation(reel) {
    return setInterval(() => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = randomSymbol;
    }, 100); // 每100毫秒切換一次符號
}

// 停止轉輪動畫
function stopReelAnimation(intervalId, reel) {
    clearInterval(intervalId); // 停止動畫
    const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    reel.textContent = finalSymbol; // 顯示最終符號
    return finalSymbol;
}

// 開始旋轉
function startSpinning() {
    const betAmount = parseInt(document.getElementById("betAmount").value);

    // 驗證下注金額
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        document.getElementById("message").textContent = "無效的下注金額！";
        return;
    }

    // 扣除下注金額並增加累積獎金池
    balance -= betAmount;
    jackpotPool += Math.floor(betAmount * 0.1);
    updateDisplay();

    // 啟動旋轉動畫
    for (let i = 1; i <= 3; i++) {
        const reel = document.getElementById(`reel${i}`);
        if (reelIntervals[i - 1]) {
            clearInterval(reelIntervals[i - 1]);
        }
        const intervalId = startReelAnimation(reel);
        reelIntervals[i - 1] = intervalId;
    }

    document.getElementById("message").textContent = "轉輪旋轉中...";
}

// 停止旋轉
function stopSpinning() {
    const reelValues = [];
    for (let i = 0; i < 3; i++) {
        const reel = document.getElementById(`reel${i + 1}`);
        if (reelIntervals[i]) {
            const value = stopReelAnimation(reelIntervals[i], reel);
            reelValues.push(value);
            reelIntervals[i] = null;
        }
    }

    // 檢查中獎結果
    const betAmount = parseInt(document.getElementById("betAmount").value);
    const payoutMultiplier = checkWin(reelValues);
    let message = "";
    if (payoutMultiplier > 0) {
        const winnings = betAmount * payoutMultiplier;
        balance += winnings;
        message = `🎉 恭喜中獎！獲得 ${winnings} 金額！`;

        // 如果符號是 💎，獲得累積獎金池
        if (reelValues[0] === "💎") {
            message += ` 累積獎金池額外獲得 ${jackpotPool}！`;
            balance += jackpotPool;
            jackpotPool = 0; // 重置累積獎金池
        }
    } else {
        message = "很遺憾，未中獎，請再接再厲！";
    }

    document.getElementById("message").textContent = message;
    updateDisplay();
}

// 綁定按鈕事件
document.getElementById("startBtn").addEventListener("click", startSpinning);
document.getElementById("stopBtn").addEventListener("click", stopSpinning);