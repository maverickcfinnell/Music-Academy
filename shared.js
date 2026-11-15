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
                <button class="top-btn" id="sharedSearch" type="button" title="Open My Library" aria-label="Open My Library">🔍</button>
                <button class="top-btn" id="sharedSettings" type="button" title="Settings" aria-label="Settings">⚙️</button>
                <button class="top-btn" id="sharedProfile" type="button" title="Profile" aria-label="Profile"><svg class="profile-avatar-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true" style="color:#dbe3f0!important"><circle cx="12" cy="12" r="10" stroke="#dbe3f0" stroke-width="1.6"/><circle cx="12" cy="9" r="3.1" fill="#dbe3f0"/><path d="M5.8 18.1c.9-2.7 3.1-4.2 6.2-4.2s5.3 1.5 6.2 4.2" fill="#dbe3f0"/></svg></button>
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
        
            .ma-settings-group{padding:17px 0;border-bottom:1px solid #1d2b41}
            .ma-settings-group h3{margin:0 0 8px;font-size:15px;color:#eaf1fb}
            .ma-settings-group .ma-setting-field:first-of-type{padding-top:8px}
            .ma-settings-note{margin:6px 0 2px;color:#91a2ba;font-size:12px;line-height:1.55}
            .ma-setting-field input[type=range]{display:block;width:100%;margin-top:13px;accent-color:#6598e8}
            .ma-settings-content{padding:8px 26px}
            @media(max-width:520px){.ma-settings-overlay{padding:8px}.ma-settings-panel{max-height:96vh}.ma-settings-header{padding:19px}.ma-settings-content{padding:8px 19px}.ma-settings-footer{padding:16px 19px}}

            :root[data-ma-accent] .sidebar .logo{color:var(--blue)!important}
            :root[data-ma-accent] .sidebar .nav a.active,:root[data-ma-accent] .sidebar .nav a:hover{background:var(--blue2)!important}
            :root[data-ma-accent] .btn,:root[data-ma-accent] .ma-settings-save{background:var(--blue)!important}
            :root[data-ma-accent] .eyebrow{color:var(--blue)!important}
            :root[data-ma-accent] .progress span{background:var(--blue)!important}
            :root[data-ma-accent] .tabs .tab.active{border-color:var(--blue)!important}
            :root[data-ma-accent] .cell.on{background:var(--blue)!important}
            :root[data-ma-accent] .ma-setting-toggle input,:root[data-ma-accent] .ma-setting-field input[type=range]{accent-color:var(--blue)!important}
`;
        document.head.appendChild(settingsStyle);
    }



    // Apply the saved accent throughout the interface.
    const palettes = {
            blue:   {accent:"#6d8cff", soft:"#16233b", bg:"#080f20", side:"#060c18", panel:"#101c30", panel2:"#14233a", line:"#263957", top:"#0b1425"},
            purple: {accent:"#b18cff", soft:"#302044", bg:"#120d1d", side:"#0b0814", panel:"#1b1428", panel2:"#241a35", line:"#3a2b50", top:"#160f22"},
            green:  {accent:"#54c995", soft:"#153b32", bg:"#081711", side:"#050e0a", panel:"#10241b", panel2:"#173126", line:"#244536", top:"#0b1c13"},
            orange: {accent:"#ff9b52", soft:"#472b1b", bg:"#190f09", side:"#0d0805", panel:"#25170f", panel2:"#332014", line:"#4a3020", top:"#1e120b"}
        };
        const colors = palettes[accent] || palettes.blue;
        const root = document.documentElement;
        root.dataset.maAccent = accent || "blue";
        root.style.setProperty("--blue", colors.accent);
        root.style.setProperty("--blue2", colors.soft);
        root.style.setProperty("--ma-accent", colors.accent);
        root.style.setProperty("--ma-accent-soft", colors.soft);
        root.style.setProperty("--bg", colors.bg);
        root.style.setProperty("--side", colors.side);
        root.style.setProperty("--panel", colors.panel);
        root.style.setProperty("--panel2", colors.panel2);
        root.style.setProperty("--line", colors.line);
        root.style.setProperty("--ma-topbar", colors.top);
        let themeStyle = document.getElementById("maAccentTheme");
        if (!themeStyle) {
            themeStyle = document.createElement("style");
            themeStyle.id = "maAccentTheme";
            document.head.appendChild(themeStyle);
        }
        themeStyle.textContent = `
            body { background:var(--bg)!important; }
            .sidebar { background:var(--side)!important; border-color:var(--line)!important; }
            .sidebar .logo { color:var(--blue)!important; }
            .sidebar .nav a.active,.sidebar .nav a:hover { background:var(--blue2)!important; }
            .topbar { background:var(--ma-topbar)!important; border-color:var(--line)!important; }
            .card { background:var(--panel)!important; border-color:var(--line)!important; }
            .item { background:var(--bg)!important; border-color:var(--line)!important; }
            .tile,.pill { background:var(--blue2)!important; }
            .progress { background:var(--blue2)!important; }
            .cell { background:var(--panel2)!important; border-color:var(--line)!important; }
            .topbar select,.top-btn,.secondary,.field { background:var(--panel2)!important; border-color:var(--line)!important; }
            .btn,.progress span,.cell.on { background:var(--blue)!important; }
            .eyebrow,.field:focus { color:var(--blue)!important; }
            .tabs .tab.active { border-color:var(--blue)!important; }
            .ma-settings-panel { background:var(--panel)!important; border-color:var(--line)!important; }
        `;
    };
    applyAccent(localStorage.getItem("ma_accent") || "blue");

    // Music Academy settings. Preferences are saved locally in this browser for now.
    const openSettings = () => {
        const existing = document.getElementById("sharedSettingsOverlay");
        if (existing) { existing.classList.add("open"); return; }
        const currentInstrument = localStorage.getItem("ma_instrument") || "Tenor Saxophone";
        const instruments = Array.from(document.querySelectorAll("#sharedInstrument option"))
            .map(option => option.value || option.textContent.trim());
        const read = (key, fallback) => localStorage.getItem("ma_" + key) ?? fallback;
        const checked = key => read(key, "false") === "true";
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
                    <section class="ma-settings-group">
                        <h3>Account</h3>
                        <p class="ma-settings-note">Account email, password, and account deletion will be available when Music Academy accounts are connected.</p>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Appearance</h3>
                        <label class="ma-setting-field">Theme
                            <select id="sharedTheme"><option value="dark">Dark</option><option value="light">Light (coming soon)</option><option value="system">Use device setting (coming soon)</option></select>
                        </label>
                        <label class="ma-setting-field">Accent color
                            <select id="sharedAccent"><option value="blue">🔵 Academy blue</option><option value="purple">🟣 Purple</option><option value="green">🟢 Green</option><option value="orange">🟠 Orange</option></select>
                        </label>
                        <div class="ma-setting-toggle"><div><strong>Reduce motion</strong><span>Limit animations and visual movement.</span></div><input id="sharedReduceMotion" type="checkbox" ${checked("reduce_motion") ? "checked" : ""}></div>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Practice Preferences</h3>
                        <label class="ma-setting-field">Default instrument
                            <select id="sharedDefaultInstrument">${instruments.map(name => `<option ${name === currentInstrument ? "selected" : ""}>${name}</option>`).join("")}</select>
                            <span>Sets the instrument selected when you open Music Academy.</span>
                        </label>
                        <label class="ma-setting-field">Daily practice goal
                            <div class="ma-goal-input"><input id="sharedDailyGoal" type="number" min="5" max="240" step="5" value="${Number(read("daily_goal", "20"))}"><span>minutes per day</span></div>
                        </label>
                        <div class="ma-setting-toggle"><div><strong>Auto-pause practice timer</strong><span>Pause after 3 minutes without activity (where supported).</span></div><input id="sharedAutoPause" type="checkbox" ${checked("auto_pause") ? "checked" : ""}></div>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Sound &amp; Audio</h3>
                        <div class="ma-setting-toggle"><div><strong>Sound effects</strong><span>Allow interface sounds when supported.</span></div><input id="sharedSoundEffects" type="checkbox" ${read("sound_effects", "true") !== "false" ? "checked" : ""}></div>
                        <label class="ma-setting-field">Playback volume
                            <input id="sharedVolume" type="range" min="0" max="100" value="${read("playback_volume", "80")}">
                        </label>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Notifications</h3>
                        <div class="ma-setting-toggle"><div><strong>Practice reminders</strong><span>Remind me to work toward my daily goal.</span></div><input id="sharedPracticeReminders" type="checkbox" ${checked("notify_practice") ? "checked" : ""}></div>
                        <div class="ma-setting-toggle"><div><strong>Achievement updates</strong><span>Tell me when I earn an achievement.</span></div><input id="sharedAchievementAlerts" type="checkbox" ${checked("notify_achievements") ? "checked" : ""}></div>
                        <div class="ma-setting-toggle"><div><strong>Challenge updates</strong><span>Updates about challenges and competitions.</span></div><input id="sharedChallengeAlerts" type="checkbox" ${checked("notify_challenges") ? "checked" : ""}></div>
                        <p class="ma-settings-note">Notification delivery will be connected when account and notification services are added.</p>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Learning Preferences</h3>
                        <label class="ma-setting-field">Preferred difficulty
                            <select id="sharedDifficulty"><option>Beginner</option><option>Easy</option><option>Intermediate</option><option>Advanced</option><option>Expert</option></select>
                        </label>
                        <div class="ma-setting-toggle"><div><strong>Show note names</strong><span>Display note labels in learning activities when available.</span></div><input id="sharedNoteNames" type="checkbox" ${read("show_note_names", "true") !== "false" ? "checked" : ""}></div>
                        <div class="ma-setting-toggle"><div><strong>Show learning hints</strong><span>Display hints during lessons where supported.</span></div><input id="sharedHints" type="checkbox" ${read("learning_hints", "true") !== "false" ? "checked" : ""}></div>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Privacy &amp; Security</h3>
                        <div class="ma-setting-toggle"><div><strong>Private profile preference</strong><span>Save your preference for a private profile. Public profile controls require accounts.</span></div><input id="sharedPrivateProfile" type="checkbox" ${read("private_profile", "true") !== "false" ? "checked" : ""}></div>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Subscription</h3>
                        <p class="ma-settings-note">Premium membership, billing, and redeeming school codes will be added after secure accounts and payments are set up.</p>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Help &amp; About</h3>
                        <p class="ma-settings-note">Music Academy prototype. For now, send feedback through the project owner. Help center and legal pages are coming later.</p>
                    </section>
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
        document.getElementById("sharedTheme").value = read("theme", "dark");
        document.getElementById("sharedAccent").value = read("accent", "blue");
        document.getElementById("sharedDifficulty").value = read("difficulty", "Intermediate");
        overlay.querySelector(".ma-settings-save").addEventListener("click", () => {
            const value = id => document.getElementById("shared" + id);
            const selected = value("DefaultInstrument").value;
            const dailyGoal = Math.max(5, Math.min(240, Number(value("DailyGoal").value) || 20));
            const settings = {
                instrument:selected, daily_goal:String(dailyGoal),
                sound_effects:String(value("SoundEffects").checked),
                reduce_motion:String(value("ReduceMotion").checked),
                auto_pause:String(value("AutoPause").checked),
                playback_volume:value("Volume").value,
                notify_practice:String(value("PracticeReminders").checked),
                notify_achievements:String(value("AchievementAlerts").checked),
                notify_challenges:String(value("ChallengeAlerts").checked),
                show_note_names:String(value("NoteNames").checked),
                learning_hints:String(value("Hints").checked),
                private_profile:String(value("PrivateProfile").checked),
                theme:value("Theme").value, accent:value("Accent").value,
                difficulty:value("Difficulty").value
            };
            Object.entries(settings).forEach(([key, setting]) => localStorage.setItem("ma_" + key, setting));
            const headerInstrument = document.getElementById("sharedInstrument");
            if (headerInstrument) headerInstrument.value = selected;
            document.documentElement.classList.toggle("ma-reduce-motion", value("ReduceMotion").checked);
            applyAccent(settings.accent);
            overlay.querySelector("#sharedSettingsStatus").textContent = "Saved on this device";
            overlay.querySelector(".ma-settings-save").textContent = "Saved";
            window.setTimeout(close, 700);
        });
    };
    document.getElementById("sharedSettings")?.addEventListener("click", openSettings);



    // Preserve the selected instrument when opening Practice Room from My Library.
    if (currentPage === "practice") {
        const selectedPiece = localStorage.getItem("maPracticePiece");
        const pieceName = document.getElementById("pieceName");

        if (selectedPiece && pieceName && pieceName.textContent.trim() === "No Piece Selected") {
            pieceName.textContent = selectedPiece;
        }
    }
})();
