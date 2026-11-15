(() => {
    // Shared helpers and browser storage.
    const $ = (selector) => document.querySelector(selector);

    const get = (key, fallback) => {
        try {
            return JSON.parse(localStorage.getItem("ma_" + key)) ?? fallback;
        } catch {
            return fallback;
        }
    };

    const put = (key, value) => {
        localStorage.setItem("ma_" + key, JSON.stringify(value));
    };

    let xp = get("xp", 0);
    const completed = get("completed", []);
    const page = document.body.dataset.page || "home";

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

    const pageInfo = {
        home: [
            "Your musical journey",
            "Welcome back",
            "Pick up where you left off and keep making progress."
        ],
        challenges: [
            "Put your skills to work",
            "Challenges",
            "Small goals that keep your practice moving."
        ],
        leaderboard: [
            "Celebrate progress",
            "Leaderboards",
            "A local preview of the Music Academy points system."
        ],
        studio: [
            "Create something original",
            "Composition Studio",
            "Sketch a melody and save your musical ideas."
        ]
    };

    const heading = pageInfo[page] || pageInfo.home;

    // Build the shared application frame.
    document.body.innerHTML = `
        <aside class="sidebar">
            <div class="logo">Music Academy</div>
            <div class="nav-label">Workspace</div>
            <nav class="nav">
                ${pages.slice(0, 5).map((item) => `
                    <a class="nav-link ${page === item[0] ? "active" : ""}" href="${item[3]}">
                        <span class="nav-icon">${item[1]}</span>
                        ${item[2]}
                    </a>
                `).join("")}
            </nav>

            <div class="nav-label">Community &amp; Create</div>
            <nav class="nav">
                ${pages.slice(5).map((item) => `
                    <a class="nav-link ${page === item[0] ? "active" : ""}" href="${item[3]}">
                        <span class="nav-icon">${item[1]}</span>
                        ${item[2]}
                    </a>
                `).join("")}
            </nav>
        </aside>

        <main class="main">
            <header class="topbar">
                <label class="instrument-label" for="instrument">Instrument</label>
                <select class="instrument-select" id="instrument" aria-label="Choose instrument">
                    <option>Tenor Saxophone</option>
                    <option>Alto Saxophone</option>
                    <option>Soprano Saxophone</option>
                    <option>Baritone Saxophone</option>
                    <option>Clarinet</option>
                    <option>Flute</option>
                    <option>Trumpet</option>
                    <option>Trombone</option>
                    <option>Violin</option>
                    <option>Viola</option>
                    <option>Cello</option>
                    <option>Piano</option>
                    <option>Guitar</option>
                    <option>Bass Guitar</option>
                    <option>Voice</option>
                    <option>Other</option>
                </select>

                <div class="top-actions">
                    <button class="top-btn" id="search" type="button" title="Open My Library" aria-label="Open My Library">⌕</button>
                    <button class="top-btn" id="settings" type="button" title="Settings" aria-label="Settings">⚙</button>
                    <button class="top-btn" id="profile" type="button" title="Profile" aria-label="Profile"></button>
                </div>
            </header>

            <section class="content">
                <div class="page-head">
                    <div>
                        <div class="eyebrow">${heading[0]}</div>
                        <h1>${heading[1]}</h1>
                        <p class="muted">${heading[2]}</p>
                    </div>
                    <span class="pill">★ ${xp} XP</span>
                </div>

                <div id="view"></div>

                <p class="footer">
                    Music Academy prototype · Progress is stored locally in this browser.
                    Real accounts, cloud sync, subscriptions, and shared leaderboards
                    require a secure backend.
                </p>
            </section>
        </main>

        <div class="toast" id="toast" role="status" aria-live="polite"></div>
    `;

    const toast = (message) => {
        const element = $("#toast");
        element.textContent = message;
        element.classList.add("show");
        window.setTimeout(() => element.classList.remove("show"), 2200);
    };

    const award = (amount) => {
        xp += amount;
        put("xp", xp);
        toast("+" + amount + " XP earned!");
        const badge = document.querySelector(".page-head .pill");
        if (badge) badge.textContent = "★ " + xp + " XP";
    };

    const sectionHeading = (text) => (
        '<h2 style="margin: 24px 0 14px">' + text + "</h2>"
    );

    // Shared header controls.
    const instrument = $("#instrument");
    instrument.value = get("instrument", "Tenor Saxophone");
    instrument.addEventListener("change", (event) => {
        put("instrument", event.target.value);
    });

    $("#search").addEventListener("click", () => {
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
`;
        document.head.appendChild(settingsStyle);
    }


    // Music Academy settings. Preferences are saved locally in this browser for now.
    const openSettings = () => {
        const existing = document.getElementById("appSettingsOverlay");
        if (existing) { existing.classList.add("open"); return; }
        const currentInstrument = localStorage.getItem("ma_instrument") || "Tenor Saxophone";
        const instruments = Array.from(document.querySelectorAll("#instrument option"))
            .map(option => option.value || option.textContent.trim());
        const read = (key, fallback) => localStorage.getItem("ma_" + key) ?? fallback;
        const checked = key => read(key, "false") === "true";
        const overlay = document.createElement("div");
        overlay.id = "appSettingsOverlay";
        overlay.className = "ma-settings-overlay open";
        overlay.innerHTML = `
            <section class="ma-settings-panel" role="dialog" aria-modal="true" aria-labelledby="appSettingsTitle">
                <header class="ma-settings-header">
                    <div><div class="ma-settings-eyebrow">PERSONALIZE YOUR EXPERIENCE</div><h2 id="appSettingsTitle">Settings</h2></div>
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
                            <select id="appTheme"><option value="dark">Dark</option><option value="light">Light (coming soon)</option><option value="system">Use device setting (coming soon)</option></select>
                        </label>
                        <label class="ma-setting-field">Accent color
                            <select id="appAccent"><option value="blue">Academy blue</option><option value="purple">Purple</option><option value="green">Green</option></select>
                        </label>
                        <div class="ma-setting-toggle"><div><strong>Reduce motion</strong><span>Limit animations and visual movement.</span></div><input id="appReduceMotion" type="checkbox" ${checked("reduce_motion") ? "checked" : ""}></div>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Practice Preferences</h3>
                        <label class="ma-setting-field">Default instrument
                            <select id="appDefaultInstrument">${instruments.map(name => `<option ${name === currentInstrument ? "selected" : ""}>${name}</option>`).join("")}</select>
                            <span>Sets the instrument selected when you open Music Academy.</span>
                        </label>
                        <label class="ma-setting-field">Daily practice goal
                            <div class="ma-goal-input"><input id="appDailyGoal" type="number" min="5" max="240" step="5" value="${Number(read("daily_goal", "20"))}"><span>minutes per day</span></div>
                        </label>
                        <div class="ma-setting-toggle"><div><strong>Auto-pause practice timer</strong><span>Pause after 3 minutes without activity (where supported).</span></div><input id="appAutoPause" type="checkbox" ${checked("auto_pause") ? "checked" : ""}></div>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Sound &amp; Audio</h3>
                        <div class="ma-setting-toggle"><div><strong>Sound effects</strong><span>Allow interface sounds when supported.</span></div><input id="appSoundEffects" type="checkbox" ${read("sound_effects", "true") !== "false" ? "checked" : ""}></div>
                        <label class="ma-setting-field">Playback volume
                            <input id="appVolume" type="range" min="0" max="100" value="${read("playback_volume", "80")}">
                        </label>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Notifications</h3>
                        <div class="ma-setting-toggle"><div><strong>Practice reminders</strong><span>Remind me to work toward my daily goal.</span></div><input id="appPracticeReminders" type="checkbox" ${checked("notify_practice") ? "checked" : ""}></div>
                        <div class="ma-setting-toggle"><div><strong>Achievement updates</strong><span>Tell me when I earn an achievement.</span></div><input id="appAchievementAlerts" type="checkbox" ${checked("notify_achievements") ? "checked" : ""}></div>
                        <div class="ma-setting-toggle"><div><strong>Challenge updates</strong><span>Updates about challenges and competitions.</span></div><input id="appChallengeAlerts" type="checkbox" ${checked("notify_challenges") ? "checked" : ""}></div>
                        <p class="ma-settings-note">Notification delivery will be connected when account and notification services are added.</p>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Learning Preferences</h3>
                        <label class="ma-setting-field">Preferred difficulty
                            <select id="appDifficulty"><option>Beginner</option><option>Easy</option><option>Intermediate</option><option>Advanced</option><option>Expert</option></select>
                        </label>
                        <div class="ma-setting-toggle"><div><strong>Show note names</strong><span>Display note labels in learning activities when available.</span></div><input id="appNoteNames" type="checkbox" ${read("show_note_names", "true") !== "false" ? "checked" : ""}></div>
                        <div class="ma-setting-toggle"><div><strong>Show learning hints</strong><span>Display hints during lessons where supported.</span></div><input id="appHints" type="checkbox" ${read("learning_hints", "true") !== "false" ? "checked" : ""}></div>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Privacy &amp; Security</h3>
                        <div class="ma-setting-toggle"><div><strong>Private profile preference</strong><span>Save your preference for a private profile. Public profile controls require accounts.</span></div><input id="appPrivateProfile" type="checkbox" ${read("private_profile", "true") !== "false" ? "checked" : ""}></div>
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
                <footer class="ma-settings-footer"><span id="appSettingsStatus" role="status"></span><button type="button" class="ma-settings-save">Save settings</button></footer>
            </section>`;
        document.body.appendChild(overlay);
        const close = () => overlay.remove();
        overlay.querySelector(".ma-settings-close").addEventListener("click", close);
        overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
        document.addEventListener("keydown", function onEscape(event) {
            if (event.key === "Escape" && document.getElementById("appSettingsOverlay")) {
                close();
                document.removeEventListener("keydown", onEscape);
            }
        });
        document.getElementById("appTheme").value = read("theme", "dark");
        document.getElementById("appAccent").value = read("accent", "blue");
        document.getElementById("appDifficulty").value = read("difficulty", "Intermediate");
        overlay.querySelector(".ma-settings-save").addEventListener("click", () => {
            const value = id => document.getElementById("app" + id);
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
            const headerInstrument = document.getElementById("instrument");
            if (headerInstrument) headerInstrument.value = selected;
            document.documentElement.classList.toggle("ma-reduce-motion", value("ReduceMotion").checked);
            document.documentElement.dataset.maAccent = settings.accent;
            overlay.querySelector("#appSettingsStatus").textContent = "Saved on this device";
            overlay.querySelector(".ma-settings-save").textContent = "Saved";
            window.setTimeout(close, 700);
        });
    };
    document.getElementById("settings")?.addEventListener("click", openSettings);



    // Home dashboard.
    if (page === "home") {
        $("#view").innerHTML = `
            <div class="grid g4">
                <div class="card">
                    <div class="stat">${xp}</div>
                    <div class="small">Total XP</div>
                </div>
                <div class="card">
                    <div class="stat">${completed.length}</div>
                    <div class="small">Lessons completed</div>
                </div>
                <div class="card">
                    <div class="stat">${get("minutes", 0)}</div>
                    <div class="small">Practice minutes</div>
                </div>
                <div class="card">
                    <div class="stat">${get("streak", 1)}</div>
                    <div class="small">Day streak</div>
                </div>
            </div>

            ${sectionHeading("Continue your journey")}

            <div class="grid g2">
                <div class="card">
                    <h3>Learning Paths</h3>
                    <p class="muted">
                        Structured lessons for note reading, rhythm, ear training,
                        and technique.
                    </p>
                    <p style="margin-top: 16px">
                        <a class="btn" href="learning.html">Continue learning →</a>
                    </p>
                </div>

                <div class="card">
                    <h3>Practice Room</h3>
                    <p class="muted">
                        Use your metronome, track practice time, and review
                        performances.
                    </p>
                    <p style="margin-top: 16px">
                        <a class="btn" href="practice.html">Open Practice Room →</a>
                    </p>
                </div>
            </div>

            ${sectionHeading("Quick access")}

            <div class="grid g3">
                <a class="card" style="text-decoration: none; color: inherit" href="notes.html">
                    <div class="tile">♫</div>
                    <h3 style="margin-top: 14px">Note Learner</h3>
                    <p class="muted">Train note recognition.</p>
                </a>

                <a class="card" style="text-decoration: none; color: inherit" href="library.html">
                    <div class="tile">▧</div>
                    <h3 style="margin-top: 14px">My Library</h3>
                    <p class="muted">Organize your sheet music.</p>
                </a>

                <a class="card" style="text-decoration: none; color: inherit" href="studio.html">
                    <div class="tile">✎</div>
                    <h3 style="margin-top: 14px">Composition Studio</h3>
                    <p class="muted">Write a musical idea.</p>
                </a>
            </div>
        `;
    }

    // Challenges and their one-time local demo rewards.
    if (page === "challenges") {
        const challenges = [
            ["Note Reading Sprint", "Answer ten note-reading questions.", "10 questions", 20],
            ["Focused Practice", "Complete a 10-minute practice session.", "10 minutes", 30],
            ["Library Builder", "Add three pieces to your library.", "3 pieces", 25],
            ["Technique Week", "Complete three technique lessons.", "3 lessons", 40]
        ];

        $("#view").innerHTML = `
            <div class="grid g2">
                ${challenges.map((item, index) => `
                    <div class="card">
                        <div class="row">
                            <span class="pill">+${item[3]} XP</span>
                            <span class="small">${item[2]}</span>
                        </div>
                        <h3 style="margin-top: 16px">${item[0]}</h3>
                        <p class="muted">${item[1]}</p>
                        <button class="btn claim" data-index="${index}" type="button"
                            style="margin-top: 16px">Claim demo reward</button>
                    </div>
                `).join("")}
            </div>
            <p class="footer">
                These are prototype challenges. Automated daily resets and
                server-verified completion will be added with accounts.
            </p>
        `;

        document.querySelectorAll(".claim").forEach((button) => {
            const storageKey = "challenge_" + button.dataset.index;

            if (get(storageKey, false)) {
                button.textContent = "Claimed";
                button.disabled = true;
            }

            button.addEventListener("click", () => {
                if (get(storageKey, false)) {
                    toast("Reward already claimed.");
                    return;
                }

                put(storageKey, true);
                award(challenges[Number(button.dataset.index)][3]);
                button.textContent = "Claimed";
                button.disabled = true;
            });
        });
    }

    // A clearly labelled local-only leaderboard preview.
    if (page === "leaderboard") {
        const rankings = [
            ["You", xp],
            ["Bandmate (demo)", 420],
            ["Practice Partner (demo)", 360],
            ["Section Leader (demo)", 290]
        ].sort((first, second) => second[1] - first[1]);

        $("#view").innerHTML = `
            <div class="card">
                <div class="eyebrow">Local preview</div>
                <h2>XP leaderboard</h2>
                <div class="list">
                    ${rankings.map((person, index) => `
                        <div class="item">
                            <div class="tile">${index + 1}</div>
                            <div class="grow">
                                <strong>${person[0]}</strong>
                                <div class="small">
                                    ${person[0] === "You"
                                        ? "Your browser profile"
                                        : "Example entry · not a real user"}
                                </div>
                            </div>
                            <strong>${person[1]} XP</strong>
                        </div>
                    `).join("")}
                </div>
            </div>

            <p class="footer">
                The sample entries are placeholders. A real school or global
                leaderboard needs user accounts, a database, privacy controls,
                and moderation.
            </p>
        `;
    }

    // Simple local composition sketchpad.
    if (page === "studio") {
        const savedCompositions = get("compositions", []);
        let selectedCells = [];

        $("#view").innerHTML = `
            <div class="card">
                <div class="row">
                    <div>
                        <h3>Melody sketchpad</h3>
                        <p class="muted">
                            Tap grid cells to place notes. Save drafts in this browser.
                        </p>
                    </div>
                    <button class="btn" id="save" type="button">Save piece</button>
                </div>

                <label class="label" for="pieceTitle">Piece title</label>
                <input class="field" id="pieceTitle" value="My New Piece">

                <label class="label" for="tempo">Tempo (BPM)</label>
                <input class="field" id="tempo" type="number" min="40" max="240" value="100">

                <div class="composer" id="grid" style="margin-top: 18px">
                    ${Array.from({ length: 8 }, (_, row) =>
                        Array.from({ length: 16 }, (_, column) => `
                            <button class="cell" data-row="${row}" data-column="${column}"
                                type="button" aria-label="Row ${row + 1}, step ${column + 1}">
                            </button>
                        `).join("")
                    ).join("")}
                </div>

                <div class="rowwrap" style="margin-top: 16px">
                    <button class="secondary" id="clear" type="button">Clear grid</button>
                    <span class="small">8 pitch rows · 16 time steps</span>
                </div>

                <h3 style="margin-top: 24px">Saved drafts</h3>
                <div id="saved" class="list"></div>
            </div>

            <p class="footer">
                This is an initial composition grid, not yet engraved sheet music.
                Full notation, transposing parts, playback, MusicXML/PDF export,
                and collaboration are future milestones.
            </p>
        `;

        const renderSavedCompositions = () => {
            $("#saved").innerHTML = savedCompositions.length
                ? savedCompositions.map((piece) => `
                    <div class="item">
                        <div class="grow">
                            <strong>${piece.title}</strong>
                            <div class="small">
                                ${piece.tempo} BPM · ${piece.notes} note positions
                            </div>
                        </div>
                    </div>
                `).join("")
                : '<p class="muted">No saved drafts yet.</p>';
        };

        document.querySelectorAll(".cell").forEach((cell) => {
            cell.addEventListener("click", () => {
                cell.classList.toggle("on");

                const cellId = cell.dataset.row + "," + cell.dataset.column;
                selectedCells = selectedCells.includes(cellId)
                    ? selectedCells.filter((item) => item !== cellId)
                    : [...selectedCells, cellId];
            });
        });

        $("#clear").addEventListener("click", () => {
            selectedCells = [];
            document.querySelectorAll(".cell").forEach((cell) => {
                cell.classList.remove("on");
            });
        });

        $("#save").addEventListener("click", () => {
            const title = $("#pieceTitle").value.trim() || "Untitled Piece";
            const tempo = Math.max(40, Math.min(240, Number($("#tempo").value) || 100));

            savedCompositions.unshift({
                title,
                tempo,
                notes: selectedCells.length,
                grid: [...selectedCells]
            });

            put("compositions", savedCompositions);
            award(5);
            renderSavedCompositions();
            toast("Composition saved locally.");
        });

        renderSavedCompositions();
    }
})();
