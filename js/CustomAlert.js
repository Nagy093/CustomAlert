// ============================================================================
// 📁 CustomAlert.js — 중앙형 Custom Alert / Confirm (v3.2 Final)
// ----------------------------------------------------------------------------
// ✅ 주요 특징
// 1. alert() → 2초 후 자동 fade-out (배경 고정)
// 2. confirm() → ESC, 배경 클릭, 버튼 클릭으로 닫힘
// 3. fade-out은 alert 박스에만 적용 (자연스러운 UX)
// 4. 중복 콜백 완벽 방지 (ESC & 클릭 동시 시 1회만 호출)
// 5. main.js / admin.js 어디서든 사용 가능
// ============================================================================

window.ui = window.ui || {};

// ✅ 단순 알림 (자동 닫힘)
ui.alert = function (message, type = "info") {
  document.querySelector(".ca-backdrop")?.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "ca-backdrop";

  const box = document.createElement("div");
  box.className = `ca-box ca-${type}`;

  const icons = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };
  const icon = icons[type] || "ℹ️";

  box.innerHTML = `
    <div class="ca-icon">${icon}</div>
    <div class="ca-message">${message}</div>
  `;

  backdrop.appendChild(box);
  document.body.appendChild(backdrop);

  const closeModal = () => {
    box.classList.add("fade-out");
    setTimeout(() => backdrop.remove(), 400);
  };

  const handleEsc = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleEsc);
    }
  };
  document.addEventListener("keydown", handleEsc);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  setTimeout(closeModal, 2000);
};

// ✅ 확인창 (ESC / 배경 / 버튼 닫기)
ui.confirm = function (message, callback, type = "warning") {
  document.querySelector(".ca-backdrop")?.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "ca-backdrop";

  const box = document.createElement("div");
  box.className = `ca-box ca-${type}`;

  const icons = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };
  const icon = icons[type] || "⚠️";

  box.innerHTML = `
    <div class="ca-icon">${icon}</div>
    <div class="ca-message">${message}</div>
    <div class="ca-buttons">
      <button class="ca-btn ca-ok">확인</button>
      <button class="ca-btn ca-cancel">취소</button>
    </div>
  `;

  let closed = false;
  const closeModal = (isOk = false) => {
    if (closed) return;
    closed = true;
    document.removeEventListener("keydown", handleEsc);

    box.classList.add("fade-out");
    setTimeout(() => {
      backdrop.remove();
      if (typeof callback === "function") callback(isOk);
    }, 400);
  };

  const handleEsc = (e) => {
    if (e.key === "Escape") closeModal(false);
  };
  document.addEventListener("keydown", handleEsc, { once: true });

  box.querySelector(".ca-ok").onclick = () => closeModal(true);
  box.querySelector(".ca-cancel").onclick = () => closeModal(false);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal(false);
  });

  backdrop.appendChild(box);
  document.body.appendChild(backdrop);
};
