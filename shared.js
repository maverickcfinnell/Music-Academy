/* Music Academy shared navigation and preferences. */
(() => {
    const pages = [
        ["home", "🏠", "Home", "home.html"],
        ["learning", "📚", "Learning Paths", "learning.html"],
        ["notes", "🎵", "Note Learner", "notes.html"],
        ["practice", "🎷", "Practice Room", "practice.html"],
        ["library", "🎼", "My Library", "library.html"],
        ["challenges", "⚡", "Challenges", "challenges.html"],
        ["leaderboard", "🏆", "Leaderboards", "leaderboard.html"],
        ["studio", "🎹", "Composition Studio", "studio.html"]
    ];

    const filename = window.location.pathname.split("/").pop() || "home.html";
    const currentPage = {
        "home.html": "home",
        "learning.html": "learning",
        "notes.html": "notes",
        "practice.html": "practice",
        "library.html": "library",
        "challenges.html": "challenges",
        "leaderboard.html": "leaderboard",
        "studio.html": "studio"
    }[filename] || "home";

    // Keep the legacy pages' sidebar identical to the newer app.css layout.
    if (!document.getElementById("ma-shared-sidebar-styles")) {
        const style = document.createElement("style");
        style.id = "ma-shared-sidebar-styles";
        style.textContent = `
            .sidebar { width:245px !important; min-width:245px !important; padding:22px 14px !important; background:#050b16 !important; border-right:1px solid #1d2b42 !important; box-sizing:border-box !important; flex-shrink:0 !important; }
            body[data-page="library"] .main { margin-left:245px !important; }
            body[data-page="library"] .topbar { left:245px !important; }
            .sidebar .logo { height:60px !important; min-height:60px !important; display:flex !important; align-items:center !important; margin:0 !important; padding:0 12px 0 !important; font-family:Arial,Helvetica,sans-serif !important; font-size:23px !important; font-style:normal !important; line-height:1 !important; font-weight:700 !important; letter-spacing:0 !important; text-transform:none !important; color:#6d8cff !important; white-space:nowrap !important; box-sizing:border-box !important; }
            .sidebar .nav-label { display:block !important; padding:14px 12px 8px !important; margin:0 !important; color:#65718a !important; font-size:10px !important; line-height:normal !important; letter-spacing:1.5px !important; text-transform:uppercase !important; }
            .sidebar .nav { display:grid !important; grid-template-columns:1fr !important; row-gap:5px !important; column-gap:0 !important; margin:0 0 14px !important; padding:0 !important; }
            .sidebar .nav a, .sidebar .nav-link { display:flex !important; width:100% !important; min-height:42px !important; max-height:42px !important; align-items:center !important; gap:13px !important; margin:0 !important; padding:12px !important; height:42px !important; border:0 !important; border-radius:9px !important; background:transparent !important; color:#aeb8cc !important; font:15px Arial,sans-serif !important; line-height:18px !important; text-align:left !important; text-decoration:none !important; box-sizing:border-box !important; }
            .sidebar .nav a:hover, .sidebar .nav a.active, .sidebar .nav-link:hover, .sidebar .nav-link.active { background:#16233b !important; color:#fff !important; }
            .sidebar .nav-icon { display:inline-block !important; flex:0 0 22px !important; width:22px !important; margin:0 !important; padding:0 !important; text-align:center !important; font-size:17px !important; line-height:18px !important; }
            .topbar { height:70px !important; min-height:70px !important; display:flex !important; flex-wrap:nowrap !important; align-items:center !important; justify-content:flex-start !important; gap:12px !important; padding:0 30px !important; background:#080f1c !important; border-bottom:1px solid #1d2b42 !important; box-sizing:border-box !important; }
            .instrument-label { display:inline-flex !important; flex:0 0 auto !important; align-items:center !important; margin:0 !important; color:#8996aa !important; font:12px/1 Arial,Helvetica,sans-serif !important; white-space:nowrap !important; }
            .instrument-select { display:inline-flex !important; flex:0 0 210px !important; width:210px !important; min-width:210px !important; height:40px !important; margin:0 !important; padding:0 13px !important; color:#f4f7fb !important; background:#111c2e !important; border:1px solid #293b58 !important; border-radius:9px !important; font:14px Arial,Helvetica,sans-serif !important; box-sizing:border-box !important; }
            .topbar .top-actions { display:flex !important; flex:0 0 auto !important; align-items:center !important; gap:9px !important; margin:0 0 0 auto !important; }
            .topbar .top-btn { display:inline-flex !important; flex:0 0 40px !important; width:40px !important; min-width:40px !important; height:40px !important; align-items:center !important; justify-content:center !important; margin:0 !important; padding:0 !important; color:#dbe3f0 !important; background:#111c2e !important; border:1px solid #293b58 !important; border-radius:9px !important; font:16px/1 Arial,Helvetica,sans-serif !important; box-sizing:border-box !important; cursor:pointer !important; }
            @media (max-width:650px) {
                .topbar { gap:8px !important; padding:0 15px !important; }
                .instrument-label { font-size:11px !important; }
                .instrument-select { flex-basis:165px !important; width:165px !important; min-width:165px !important; }
                .topbar .top-actions { gap:6px !important; }
                .topbar .top-btn { flex-basis:36px !important; width:36px !important; min-width:36px !important; height:36px !important; }
                body[data-page="library"] .topbar { left:0 !important; right:0 !important; position:static !important; }
            }
        `;
        document.head.appendChild(style);
    }

    const sidebar = document.querySelector(".sidebar");

    if (sidebar) {
        sidebar.innerHTML = `
            <div class="logo">Music Academy</div>

            <div class="nav-label">Workspace</div>
            <nav class="nav" aria-label="Main navigation">
                ${pages.slice(0, 5).map(([key, icon, label, href]) => `
                    <a href="${href}" class="nav-link ${currentPage === key ? "active" : ""}"
                       ${currentPage === key ? 'aria-current="page"' : ""}>
                        <span class="nav-icon" aria-hidden="true">${icon}</span>
                        <span>${label}</span>
                    </a>
                `).join("")}
            </nav>

            <div class="nav-label">Community &amp; Create</div>
            <nav class="nav" aria-label="Community and creation">
                ${pages.slice(5).map(([key, icon, label, href]) => `
                    <a href="${href}" class="nav-link ${currentPage === key ? "active" : ""}"
                       ${currentPage === key ? 'aria-current="page"' : ""}>
                        <span class="nav-icon" aria-hidden="true">${icon}</span>
                        <span>${label}</span>
                    </a>
                `).join("")}
            </nav>
        `;
    }

    const topbar = document.querySelector(".topbar");

    if (topbar) {
        topbar.innerHTML = `
            <label class="instrument-label" for="sharedInstrument">Instrument</label>
            <select class="instrument-select" id="sharedInstrument" aria-label="Choose instrument">
                <option>Tenor Saxophone</option>
                <option>Alto Saxophone</option>
                <option>Soprano Saxophone</option>
                <option>Baritone Saxophone</option>
                <option>Clarinet</option>
                <option>Flute</option>
                <option>Trumpet</option>
                <option>Trombone</option>
                <option>French Horn</option>
                <option>Tuba</option>
                <option>Violin</option>
                <option>Viola</option>
                <option>Cello</option>
                <option>Double Bass</option>
                <option>Piano</option>
                <option>Guitar</option>
                <option>Bass Guitar</option>
                <option>Voice</option>
                <option>Other</option>
            </select>

            <div class="top-actions">
                <button class="top-btn" id="sharedSearch" type="button" title="Open My Library" aria-label="Open My Library">⌕</button>
                <button class="top-btn" id="sharedSettings" type="button" title="Settings" aria-label="Settings">⚙</button>
                <button class="top-btn" id="sharedProfile" type="button" title="Profile" aria-label="Profile">◉</button>
            </div>
        `;
    }

    const instrumentSelect = document.getElementById("sharedInstrument");

    if (instrumentSelect) {
        instrumentSelect.value = localStorage.getItem("ma_instrument") || "Tenor Saxophone";
        instrumentSelect.addEventListener("change", () => {
            localStorage.setItem("ma_instrument", instrumentSelect.value);
        });
    }

    document.getElementById("sharedSearch")?.addEventListener("click", () => {
        window.location.href = "library.html";
    });


    if (!document.getElementById("ma-settings-styles")) {
        const settingsStyle = document.createElement("style");
        settingsStyle.id = "ma-settings-styles";
        settingsStyle.textContent = `
            .ma-settings-overlay{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(1,6,15,.76);backdrop-filter:blur(5px)}
            .ma-settings-overlay.open{display:flex}
            .ma-settings-panel{width:min(520px,100%);max-height:90vh;overflow:auto;background:#0b1424;color:#e8eef8;border:1px solid #263852;border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.48);font-family:Arial,Helvetica,sans-serif}
            .ma-settings-header{display:flex;justify-content:space-between;align-items:flex-start;padding:25px 26px 20px;border-bottom:1px solid #20304a}
            .ma-settings-header h2{font-size:25px;margin:5px 0 0}
            .ma-settings-eyebrow{font-size:10px;letter-spacing:1.5px;color:#8da4c4;font-weight:700}
            .ma-settings-close{border:0;background:#17243a;color:#dce6f5;border-radius:8px;width:34px;height:34px;font-size:23px;cursor:pointer}
            .ma-settings-content{padding:8px 26px}
            .ma-setting-field{display:block;padding:17px 0;font-size:14px;font-weight:700;border-bottom:1px solid #1d2b41}
            .ma-setting-field select,.ma-goal-input input{display:block;width:100%;height:42px;margin-top:9px;padding:0 12px;background:#101e32;color:#edf3fc;border:1px solid #30445f;border-radius:8px;font:14px Arial}
            .ma-setting-field span,.ma-setting-toggle span{display:block;margin-top:6px;color:#91a2ba;font-size:12px;font-weight:400}
            .ma-goal-input{display:flex;align-items:center;gap:10px}.ma-goal-input input{width:105px}.ma-goal-input span{margin:0}
            .ma-setting-toggle{display:flex;justify-content:space-between;align-items:center;padding:17px 0;border-bottom:1px solid #1d2b41;font-size:14px}
            .ma-setting-toggle input{width:18px;height:18px;accent-color:#6598e8}
            .ma-settings-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 26px 24px}
            .ma-settings-footer span{font-size:12px;color:#91c6a4}
            .ma-settings-save{border:0;border-radius:8px;padding:11px 18px;background:#3978d4;color:white;font-weight:700;cursor:pointer}
            .ma-reduce-motion *{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
        `;
        document.head.appendChild(settingsStyle);
    }

    // Functional settings shared across Music Academy pages.
    const openSettings = () => {
        if (document.getElementById("sharedSettingsOverlay")) {
            document.getElementById("sharedSettingsOverlay").classList.add("open");
            return;
        }
        const currentInstrument = localStorage.getItem("ma_instrument") || "Tenor Saxophone";
        const instruments = Array.from(document.querySelectorAll("#sharedInstrument option"))
            .map(option => option.value || option.textContent.trim());
        const goal = Number(localStorage.getItem("ma_daily_goal") || 20);
        const sound = localStorage.getItem("ma_sound_effects") !== "false";
        const reduced = localStorage.getItem("ma_reduce_motion") === "true";
        const overlay = document.createElement("div");
        overlay.id = "sharedSettingsOverlay";
        overlay.className = "ma-settings-overlay open";
        overlay.innerHTML = `
            <section class="ma-settings-panel" role="dialog" aria-modal="true" aria-labelledby="sharedSettingsTitle">
                <header class="ma-settings-header">
                    <div><div class="ma-settings-eyebrow">PERSONALIZE YOUR EXPERIENCE</div><h2 id="sharedSettingsTitle">Settings</h2></div>
                    <button type="button" class="ma-settings-close" aria-label="Close settings">×</button>
                </header>
                <div class="ma-settings-content">
                    <label class="ma-setting-field">Default instrument
                        <select id="sharedDefaultInstrument">${instruments.map(name => `<option ${name === currentInstrument ? "selected" : ""}>${name}</option>`).join("")}</select>
                        <span>Used as your selected instrument throughout Music Academy.</span>
                    </label>
                    <label class="ma-setting-field">Daily practice goal
                        <div class="ma-goal-input"><input id="sharedDailyGoal" type="number" min="5" max="240" step="5" value="${goal}"><span>minutes per day</span></div>
                        <span>Choose a realistic goal you want to work toward.</span>
                    </label>
                    <div class="ma-setting-toggle"><div><strong>Sound effects</strong><span>Allow interface sounds when supported.</span></div><input id="sharedSoundEffects" type="checkbox" ${sound ? "checked" : ""}></div>
                    <div class="ma-setting-toggle"><div><strong>Reduce motion</strong><span>Limit animations and visual movement.</span></div><input id="sharedReduceMotion" type="checkbox" ${reduced ? "checked" : ""}></div>
                </div>
                <footer class="ma-settings-footer"><span id="sharedSettingsStatus" role="status"></span><button type="button" class="ma-settings-save">Save settings</button></footer>
            </section>`;
        document.body.appendChild(overlay);
        const close = () => overlay.remove();
        overlay.querySelector(".ma-settings-close").addEventListener("click", close);
        overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
        document.addEventListener("keydown", function onEscape(event) {
            if (event.key === "Escape" && document.getElementById("sharedSettingsOverlay")) {
                close();
                document.removeEventListener("keydown", onEscape);
            }
        });
        overlay.querySelector(".ma-settings-save").addEventListener("click", () => {
            const selected = document.getElementById("sharedDefaultInstrument").value;
            const dailyGoal = Math.max(5, Math.min(240, Number(document.getElementById("sharedDailyGoal").value) || 20));
            localStorage.setItem("ma_instrument", selected);
            localStorage.setItem("ma_daily_goal", String(dailyGoal));
            localStorage.setItem("ma_sound_effects", String(document.getElementById("sharedSoundEffects").checked));
            localStorage.setItem("ma_reduce_motion", String(document.getElementById("sharedReduceMotion").checked));
            const headerInstrument = document.getElementById("sharedInstrument");
            if (headerInstrument) headerInstrument.value = selected;
            document.documentElement.classList.toggle("ma-reduce-motion", document.getElementById("sharedReduceMotion").checked);
            overlay.querySelector("#sharedSettingsStatus").textContent = "Saved on this device";
            overlay.querySelector(".ma-settings-save").textContent = "Saved";
            window.setTimeout(close, 650);
        });
    };
    document.getElementById("sharedSettings")?.addEventListener("click", openSettings);


    document.getElementById("sharedProfile")?.addEventListener("click", () => {
        const points = Number(localStorage.getItem("ma_xp") || 0);
        window.alert("Music Academy profile\n" + points + " XP earned on this device.");
    });

    // Preserve the selected instrument when opening Practice Room from My Library.
    if (currentPage === "practice") {
        const selectedPiece = localStorage.getItem("maPracticePiece");
        const pieceName = document.getElementById("pieceName");

        if (selectedPiece && pieceName && pieceName.textContent.trim() === "No Piece Selected") {
            pieceName.textContent = selectedPiece;
        }
    }
})();
