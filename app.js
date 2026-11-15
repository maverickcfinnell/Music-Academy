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
                    <option value="Tenor Saxophone">🎷 Tenor Saxophone</option>
                    <option value="Alto Saxophone">🎷 Alto Saxophone</option>
                    <option value="Soprano Saxophone">🎷 Soprano Saxophone</option>
                    <option value="Baritone Saxophone">🎷 Baritone Saxophone</option>
                    <option value="Clarinet">🎵 Clarinet</option>
                    <option value="Flute">🪈 Flute</option>
                    <option value="Trumpet">🎺 Trumpet</option>
                    <option value="Trombone">🎺 Trombone</option>
                    <option value="French Horn">📯 French Horn</option>
                    <option value="Tuba">🎺 Tuba</option>
                    <option value="Violin">🎻 Violin</option>
                    <option value="Viola">🎻 Viola</option>
                    <option value="Cello">🎻 Cello</option>
                    <option value="Double Bass">🎻 Double Bass</option>
                    <option value="Piano">🎹 Piano</option>
                    <option value="Guitar">🎸 Guitar</option>
                    <option value="Bass Guitar">🎸 Bass Guitar</option>
                    <option value="Voice">🎤 Voice</option>
                </select>

                <div class="top-actions">
                    <button class="top-btn" id="search" type="button" title="Search Music Academy" aria-label="Search Music Academy">🔍</button>
                    <button class="top-btn" id="settings" type="button" title="Settings" aria-label="Settings">⚙️</button>
                    <a class="top-btn" id="profile" href="profile.html" title="Profile" aria-label="Profile" style="text-decoration:none"><svg class="profile-avatar-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9" r="3.1" fill="currentColor"/><path d="M5.8 18.1c.9-2.7 3.1-4.2 6.2-4.2s5.3 1.5 6.2 4.2" fill="currentColor"/></svg></a>
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
    
    // Music Academy global search: find features and jump directly to their page.
    const maSearchItems = [
        {title:"Home",detail:"Dashboard and your music activity",url:"home.html",keywords:"dashboard overview progress xp welcome"},
        {title:"Learning Paths",detail:"Lessons, courses, skills, and learning progress",url:"learning.html",keywords:"learn lesson course path beginner intermediate advanced scales theory technique"},
        {title:"Note Learner",detail:"Practice identifying notes and reading music",url:"notes.html",keywords:"notes note reading treble bass clef pitch identify flashcards"},
        {title:"Practice Room",detail:"Practice tools, timer, metronome, and tuner",url:"practice.html",keywords:"practice session timer metronome tuner tempo routine"},
        {title:"My Library",detail:"Your saved music, sheet music, and pieces",url:"library.html",keywords:"library music sheet music saved pieces browse favorites imported scanned"},
        {title:"Search music: Take Five",detail:"Find this piece in My Library",url:"library.html?search=Take%20Five",keywords:"take five jazz paul desmond"},
        {title:"Search music: Concert Piece",detail:"Find this piece in My Library",url:"library.html?search=Concert%20Piece",keywords:"concert piece classical"},
        {title:"Search music: Warm Up Exercise",detail:"Find this piece in My Library",url:"library.html?search=Warm%20Up%20Exercise",keywords:"warm up exercise scales"},
        {title:"Challenges",detail:"Practice challenges and goals",url:"challenges.html",keywords:"challenge goals tasks daily weekly"},
        {title:"Leaderboards",detail:"Rankings and musician standings",url:"leaderboard.html",keywords:"leaderboard rankings scores xp competition"},
        {title:"Composition Studio",detail:"Create and save your own compositions",url:"studio.html",keywords:"compose composition create write music melody notes grid"},
        {title:"My Profile",detail:"Your instruments, statistics, and achievements",url:"profile.html",keywords:"profile account musician instruments statistics achievements bio"},
        {title:"Edit Profile",detail:"Change your name, bio, and instruments",url:"edit-profile.html",keywords:"edit profile name bio instrument"},
        {title:"Settings",detail:"Appearance, accent color, and practice preferences",url:"#settings",keywords:"settings theme appearance color accent orange purple green blue preferences sound notifications"}
    ];
    const maSearchStyle = document.createElement("style");
    maSearchStyle.id = "ma-global-search-style";
    maSearchStyle.textContent = `
        .ma-global-search-overlay{position:fixed;inset:0;z-index:12000;display:none;align-items:flex-start;justify-content:center;padding:12vh 18px 24px;background:rgba(2,7,17,.78);backdrop-filter:blur(6px)}
        .ma-global-search-overlay.open{display:flex}
        .ma-global-search-panel{width:min(620px,100%);max-height:76vh;overflow:hidden;background:var(--panel,#101c30);color:#edf3fc;border:1px solid var(--line,#263957);border-radius:16px;box-shadow:0 25px 80px rgba(0,0,0,.5);font-family:Arial,Helvetica,sans-serif}
        .ma-global-search-input-wrap{display:flex;align-items:center;gap:12px;padding:17px 19px;border-bottom:1px solid var(--line,#263957)}
        .ma-global-search-input-wrap span{font-size:20px}
        .ma-global-search-input{flex:1;min-width:0;border:0!important;outline:0!important;background:transparent!important;color:inherit!important;font:16px Arial,sans-serif!important;padding:7px 0!important;box-shadow:none!important}
        .ma-global-search-hint{font-size:11px;color:#8493aa;white-space:nowrap}
        .ma-global-search-results{padding:9px;max-height:calc(76vh - 75px);overflow:auto}
        .ma-global-search-result{display:flex;width:100%;flex-direction:column;gap:4px;padding:12px 13px;text-align:left;border:1px solid transparent;border-radius:9px;background:transparent;color:inherit;cursor:pointer}
        .ma-global-search-result:hover,.ma-global-search-result:focus{outline:0;background:var(--ma-accent-soft,var(--blue2,#16233b));border-color:var(--line,#263957)}
        .ma-global-search-result strong{font-size:14px}
        .ma-global-search-result small{font-size:12px;color:#91a0b7}
        .ma-global-search-empty{padding:24px 15px;text-align:center;color:#91a0b7;font-size:13px}
        @media(max-width:520px){.ma-global-search-overlay{padding:8vh 10px 16px}.ma-global-search-hint{display:none}}
    `;
    document.head.appendChild(maSearchStyle);
    const maSearchOverlay = document.createElement("div");
    maSearchOverlay.className = "ma-global-search-overlay";
    maSearchOverlay.innerHTML = '<section class="ma-global-search-panel" role="dialog" aria-modal="true" aria-label="Search Music Academy"><div class="ma-global-search-input-wrap"><span aria-hidden="true">🔍</span><input class="ma-global-search-input" type="search" placeholder="Search anywhere in Music Academy..." autocomplete="off" aria-label="Search anywhere in Music Academy"><span class="ma-global-search-hint">ESC to close</span></div><div class="ma-global-search-results" role="listbox"></div></section>';
    document.body.appendChild(maSearchOverlay);
    const maSearchInput = maSearchOverlay.querySelector(".ma-global-search-input");
    const maSearchResults = maSearchOverlay.querySelector(".ma-global-search-results");
    const renderMaSearchResults = () => {
        const query = maSearchInput.value.trim().toLowerCase();
        const matches = maSearchItems.filter(item => !query || (item.title+" "+item.detail+" "+item.keywords).toLowerCase().includes(query)).slice(0,10);
        maSearchResults.innerHTML = "";
        if (!matches.length) {
            const empty = document.createElement("div");
            empty.className = "ma-global-search-empty";
            empty.textContent = "No matches found. Try another search.";
            maSearchResults.appendChild(empty);
            return;
        }
        matches.forEach(item => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "ma-global-search-result";
            button.setAttribute("role","option");
            const title = document.createElement("strong");
            title.textContent = item.title;
            const detail = document.createElement("small");
            detail.textContent = item.detail;
            button.append(title,detail);
            button.addEventListener("click", () => {
                if (item.url === "#settings") {
                    maSearchOverlay.classList.remove("open");
                    document.querySelector(".ma-settings-overlay")?.classList.add("open");
                } else {
                    window.location.href = item.url;
                }
            });
            maSearchResults.appendChild(button);
        });
    };
    const openMaGlobalSearch = () => {
        maSearchOverlay.classList.add("open");
        maSearchInput.value = "";
        renderMaSearchResults();
        window.setTimeout(() => maSearchInput.focus(), 0);
    };
    maSearchInput.addEventListener("input", renderMaSearchResults);
    maSearchInput.addEventListener("keydown", event => {
        if (event.key === "Escape") maSearchOverlay.classList.remove("open");
        if (event.key === "Enter") maSearchResults.querySelector(".ma-global-search-result")?.click();
    });
    maSearchOverlay.addEventListener("click", event => {
        if (event.target === maSearchOverlay) maSearchOverlay.classList.remove("open");
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") maSearchOverlay.classList.remove("open");
    });

    const instrument = $("#instrument");
    const savedPrimaryInstrument = localStorage.getItem("ma_instrument") || "Tenor Saxophone";
    let savedProfileInstruments = [];
    try { savedProfileInstruments = JSON.parse(localStorage.getItem("ma_profile_instruments") || "[]") || []; } catch (error) {}
    const selectedProfileInstruments = Array.from(new Set([savedPrimaryInstrument, ...savedProfileInstruments].filter(Boolean)));
    const instrumentCatalog = Array.from(instrument.options).map(option => ({ value: option.value, label: option.textContent }));
    instrument.innerHTML = instrumentCatalog.filter(option => selectedProfileInstruments.includes(option.value))
        .map(option => `<option value="${option.value}">${option.label}</option>`).join("");
    instrument.value = selectedProfileInstruments.includes(savedPrimaryInstrument) ? savedPrimaryInstrument : selectedProfileInstruments[0];
    instrument.style.display = "inline-flex";
    document.querySelector(".instrument-label").style.display = "inline-flex";
    instrument.value = get("instrument", "Tenor Saxophone");
    instrument.addEventListener("change", (event) => {
        put("instrument", event.target.value);
    });

    $("#search").addEventListener("click", openMaGlobalSearch);




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
    const applyAccent = (accent) => {
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
            /* Accent colors must never override the shared navigation layout. */
            .sidebar {
                display:block!important; position:fixed!important; inset:0 auto 0 0!important;
                width:245px!important; min-height:100vh!important; overflow-y:auto!important;
                z-index:20!important; padding:22px 14px!important;
                background:var(--side)!important; border-right:1px solid var(--line)!important;
            }
            .sidebar .logo { color:var(--blue)!important; }
            .sidebar .nav { display:grid!important; grid-template-columns:1fr!important; gap:5px!important; }
            .sidebar .nav a,.sidebar .nav-link { display:flex!important; }
            .sidebar .nav a.active,.sidebar .nav a:hover { background:var(--blue2)!important; }
            .main { display:block!important; margin-left:245px!important; min-width:0!important; }
            .topbar {
                display:flex!important; position:relative!important; visibility:visible!important;
                height:70px!important; min-height:70px!important; align-items:center!important;
                background:var(--ma-topbar)!important; border-bottom:1px solid var(--line)!important;
            }
            @media (max-width:900px) {
                .sidebar { width:205px!important; }
                .main { margin-left:205px!important; }
            }
            @media (max-width:650px) {
                .sidebar { position:static!important; width:100%!important; min-height:0!important; }
                .main { margin-left:0!important; }
                .topbar { display:flex!important; }
            }
            .card { background:var(--panel)!important; border-color:var(--line)!important; }
            .item { background:var(--bg)!important; border-color:var(--line)!important; }
            .tile,.pill { background:var(--blue2)!important; }
            .progress { background:var(--blue2)!important; }
            .cell { background:var(--panel2)!important; border-color:var(--line)!important; }
            .topbar select,.top-btn,.secondary,.field { background:var(--panel2)!important; border-color:var(--line)!important; }
            .topbar #sharedProfile,.topbar #profile { background:var(--panel2)!important; border-color:var(--line)!important; }
            .topbar #sharedProfile:hover,.topbar #profile:hover { background:var(--ma-accent-soft)!important; border-color:var(--blue)!important; }
            .btn,.progress span,.cell.on { background:var(--blue)!important; }
            .eyebrow,.field:focus { color:var(--blue)!important; }
            .tabs .tab.active { border-color:var(--blue)!important; }
            .ma-settings-panel { background:var(--panel)!important; border-color:var(--line)!important; }

            /* Legacy page components: map their old hard-coded colors to the active palette. */
            body[data-page="learning"] .path,
            body[data-page="learning"] .skill-list,
            body[data-page="notes"] .mode,
            body[data-page="notes"] .practice,
            body[data-page="notes"] .progress-box,
            body[data-page="library"] .filter-panel,
            body[data-page="library"] .piece,
            body[data-page="library"] .modal,
            body[data-page="practice"] .timer-card,
            body[data-page="practice"] .session-stat,
            body[data-page="practice"] .player,
            body[data-page="practice"] .week-card,
            body[data-page="practice"] .modal {
                background:var(--panel)!important;
                border-color:var(--line)!important;
            }
            body[data-page="learning"] .progress,
            body[data-page="notes"] .progress-bar,
            body[data-page="library"] .piece-meta span,
            body[data-page="library"] .play-button,
            body[data-page="practice"] .progress-track,
            body[data-page="practice"] .judge-stat,
            body[data-page="practice"] .bar,
            body[data-page="practice"] .tool {
                background:var(--panel2)!important;
                border-color:var(--line)!important;
            }
            body[data-page="learning"] .recommended,
            body[data-page="practice"] .selected-piece,
            body[data-page="practice"] .judge-card {
                background:var(--ma-accent-soft)!important;
                border-color:var(--line)!important;
            }
            body[data-page="learning"] .instrument,
            body[data-page="learning"] .top-actions button,
            body[data-page="notes"] .instrument,
            body[data-page="notes"] .top-btn,
            body[data-page="notes"] select,
            body[data-page="notes"] .choice,
            body[data-page="library"] .instrument,
            body[data-page="library"] .search-box input,
            body[data-page="library"] .filter-button,
            body[data-page="library"] .filter-group select,
            body[data-page="library"] .form-group input,
            body[data-page="library"] .form-group select,
            body[data-page="practice"] .instrument,
            body[data-page="practice"] .top-btn,
            body[data-page="practice"] .change-piece,
            body[data-page="practice"] .secondary,
            body[data-page="practice"] .modal-row input,
            body[data-page="practice"] .modal-row select {
                background:var(--panel2)!important;
                border-color:var(--line)!important;
                color:inherit;
            }
            body[data-page="learning"] .nav a.active,
            body[data-page="learning"] .nav a:hover,
            body[data-page="notes"] .nav a.active,
            body[data-page="notes"] .nav a:hover,
            body[data-page="library"] .nav-link.active,
            body[data-page="library"] .nav-link:hover {
                background:var(--blue2)!important;
            }
            body[data-page="learning"] .start-btn,
            body[data-page="learning"] .progress-bar,
            body[data-page="notes"] .next,
            body[data-page="notes"] .progress-fill,
            body[data-page="library"] .add-button,
            body[data-page="library"] .practice-button,
            body[data-page="library"] .submit-create,
            body[data-page="practice"] .primary,
            body[data-page="practice"] .play-main,
            body[data-page="practice"] .playhead,
            body[data-page="practice"] .progress-fill,
            body[data-page="practice"] .judge-start,
            body[data-page="practice"] .fill {
                background:var(--blue)!important;
                border-color:var(--blue)!important;
                color:#fff!important;
            }
            body[data-page="learning"] .start-btn:hover,
            body[data-page="library"] .add-button:hover,
            body[data-page="library"] .practice-button:hover,
            body[data-page="library"] .submit-create:hover {
                filter:brightness(1.08);
            }
            body[data-page="learning"] .skill-number,
            body[data-page="notes"] .mode.active,
            body[data-page="notes"] .choice:hover,
            body[data-page="library"] .piece-meta span,
            body[data-page="library"] .modal-option,
            body[data-page="practice"] .piece-icon,
            body[data-page="practice"] .tool:hover,
            body[data-page="practice"] .judge-icon {
                background:var(--blue2)!important;
                border-color:var(--line)!important;
            }
            body[data-page="learning"] .progress-bar,
            body[data-page="notes"] .progress-fill,
            body[data-page="practice"] .progress-fill,
            body[data-page="practice"] .fill { background:var(--blue)!important; }
            body[data-page="library"] .topbar { background:var(--ma-topbar)!important; border-color:var(--line)!important; }
            body[data-page="library"] .modal-option:hover,
            body[data-page="library"] .filter-button:hover { background:var(--blue2)!important; }
            body[data-page="notes"] .note-area { background:var(--bg)!important; border-color:var(--line)!important; }

            /* Catch remaining legacy blue accents and gradient panels. */
            body[data-page="learning"] .recommended,
            body[data-page="practice"] .selected-piece {
                background:linear-gradient(135deg,var(--ma-accent-soft),var(--panel))!important;
                border-color:var(--line)!important;
            }
            body[data-page="learning"] .recommended-label,
            body[data-page="learning"] .logo,
            body[data-page="notes"] .logo,
            body[data-page="library"] .logo,
            body[data-page="practice"] .logo,
            body[data-page="practice"] .piece-label {
                color:var(--blue)!important;
            }
            body[data-page="learning"] .nav a.active,
            body[data-page="notes"] .nav a.active,
            body[data-page="practice"] .nav a.active {
                background:var(--blue2)!important;
            }
            body[data-page="notes"] .mode.active,
            body[data-page="notes"] .choice:hover {
                background:var(--ma-accent-soft)!important;
                border-color:var(--blue)!important;
            }
            body[data-page="library"] .tab.active { border-bottom-color:var(--blue)!important; }
            body[data-page="library"] .search-box input:focus,
            body[data-page="library"] .form-group input:focus,
            body[data-page="library"] .form-group select:focus { border-color:var(--blue)!important; }
            /* Practice Room also sets some button colors directly from JavaScript. */
            body[data-page="practice"] [style*="#6d8cff"],
            body[data-page="practice"] [style*="#16233b"] {
                background:var(--ma-accent-soft)!important;
                border-color:var(--blue)!important;
            }
            body[data-page="practice"] .playhead,
            body[data-page="practice"] .progress-fill,
            body[data-page="practice"] .fill { background:var(--blue)!important; }


            /* Consistent accent coverage for every page-specific component. */
            body[data-page] .logo,
            body[data-page] .recommended-label,
            body[data-page] .piece-label,
            body[data-page] .section-accent,
            body[data-page] .accent-text { color:var(--blue)!important; }
            body[data-page] .primary,
            body[data-page] .start-btn,
            body[data-page] .next,
            body[data-page] .add-button,
            body[data-page] .practice-button,
            body[data-page] .submit-create,
            body[data-page] .play-main,
            body[data-page] .judge-start,
            body[data-page] .progress-bar,
            body[data-page] .progress-fill,
            body[data-page] .playhead,
            body[data-page] .fill,
            body[data-page] .skill-number,
            body[data-page] .piece-icon,
            body[data-page] .judge-icon {
                background:var(--blue)!important;
                border-color:var(--blue)!important;
                color:#fff!important;
            }
            body[data-page] .recommended,
            body[data-page] .selected-piece,
            body[data-page] .judge-card,
            body[data-page] .mode.active,
            body[data-page] .choice.active,
            body[data-page] .choice:hover,
            body[data-page] .filter-button.active,
            body[data-page] .tool.active {
                background:var(--ma-accent-soft)!important;
                border-color:var(--blue)!important;
            }
            body[data-page] .path,
            body[data-page] .skill-list,
            body[data-page] .filter-panel,
            body[data-page] .piece,
            body[data-page] .timer-card,
            body[data-page] .session-stat,
            body[data-page] .player,
            body[data-page] .week-card,
            body[data-page] .progress-box,
            body[data-page] .mode,
            body[data-page] .practice,
            body[data-page] .judge-stat,
            body[data-page] .stat-card,
            body[data-page] .challenge-card,
            body[data-page] .leaderboard-card,
            body[data-page] .studio-card {
                background:var(--panel)!important;
                border-color:var(--line)!important;
            }
            body[data-page] .progress,
            body[data-page] .progress-track,
            body[data-page] .tool,
            body[data-page] .piece-meta span,
            body[data-page] .modal-option,
            body[data-page] .filter-button,
            body[data-page] .secondary,
            body[data-page] .top-btn,
            body[data-page] .instrument,
            body[data-page] input,
            body[data-page] select,
            body[data-page] textarea {
                border-color:var(--line)!important;
            }
            body[data-page] .tab.active,
            body[data-page] .tabs .tab.active { border-color:var(--blue)!important; }
            body[data-page] .nav a.active,
            body[data-page] .nav-link.active,
            body[data-page] .nav a:hover,
            body[data-page] .nav-link:hover { background:var(--blue2)!important; }

        `;
    };
    applyAccent(localStorage.getItem("ma_accent") || "blue");

    // Music Academy settings. Preferences are saved locally in this browser for now.
    const openSettings = () => {
        const existing = document.getElementById("appSettingsOverlay");
        if (existing) { existing.classList.add("open"); return; }
        const currentInstrument = localStorage.getItem("ma_instrument") || "Tenor Saxophone";
        const instrumentIcons = {"Tenor Saxophone":"🎷","Alto Saxophone":"🎷","Soprano Saxophone":"🎷","Baritone Saxophone":"🎷","Clarinet":"🎵","Flute":"🪈","Trumpet":"🎺","Trombone":"🎺","French Horn":"📯","Tuba":"🎺","Violin":"🎻","Viola":"🎻","Cello":"🎻","Double Bass":"🎻","Piano":"🎹","Guitar":"🎸","Bass Guitar":"🎸","Voice":"🎤"};
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
                            <select id="appAccent"><option value="blue">🔵 Academy blue</option><option value="purple">🟣 Purple</option><option value="green">🟢 Green</option><option value="orange">🟠 Orange</option></select>
                        </label>
                        <div class="ma-setting-toggle"><div><strong>Reduce motion</strong><span>Limit animations and visual movement.</span></div><input id="appReduceMotion" type="checkbox" ${checked("reduce_motion") ? "checked" : ""}></div>
                    </section>
                    <section class="ma-settings-group">
                        <h3>Practice Preferences</h3>
                        <label class="ma-setting-field">Default instrument
                            <select id="appDefaultInstrument">${instruments.map(name => `<option value="${name}" ${name === currentInstrument ? "selected" : ""}>${instrumentIcons[name] || "🎵"} ${name}</option>`).join("")}</select>
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
            applyAccent(settings.accent);
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

    // Multi-instrument conductor score editor.
    if (page === "studio") {
        const catalog=["Tenor Saxophone","Alto Saxophone","Soprano Saxophone","Baritone Saxophone","Clarinet","Flute","Trumpet","Trombone","French Horn","Tuba","Violin","Viola","Cello","Double Bass","Piano","Guitar","Bass Guitar","Voice"];
        const icons={"Tenor Saxophone":"🎷","Alto Saxophone":"🎷","Soprano Saxophone":"🎷","Baritone Saxophone":"🎷","Clarinet":"🎵","Flute":"🪈","Trumpet":"🎺","Trombone":"🎺","French Horn":"📯","Tuba":"🎺","Violin":"🎻","Viola":"🎻","Cello":"🎻","Double Bass":"🎻","Piano":"🎹","Guitar":"🎸","Bass Guitar":"🎸","Voice":"🎤"};
        let prof=[];try{prof=JSON.parse(localStorage.getItem("ma_profile_instruments")||"[]")||[]}catch{}
        const picked=[...new Set([localStorage.getItem("ma_instrument")||"Tenor Saxophone",...prof])].filter(n=>catalog.includes(n));
        const makePart=n=>({name:n,clef:["Trombone","Tuba","Cello","Double Bass"].includes(n)?"bass":n==="Viola"?"alto":"treble",bars:Array.from({length:4},()=>[])});
        const fresh=()=>({id:"score-"+Date.now(),title:"Untitled Composition",composer:localStorage.getItem("ma_profile_name")||"",tempo:100,time:"4/4",key:"C",count:4,parts:picked.map(makePart)});
        let scores=get("compositions",[]),score=fresh(),tool="note",dur=4,acc="",dyn="mf",audio=null,playTimer=null;
        const esc=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
        const slots=()=>{const a=score.time.split("/").map(Number);return a[0]*16/a[1]};
        const say=s=>$("#scoreStatus").textContent=s;
        const css=document.createElement("style");
        css.textContent=".score-app{display:grid;gap:14px}.score-panel{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}.score-panel input,.score-panel select{background:var(--panel2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:9px}.score-tools,.score-actions{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin:10px 0}.score-tools button,.score-actions button,.score-saved button{border:1px solid var(--line);background:var(--panel2);color:var(--text);border-radius:8px;padding:8px 10px;cursor:pointer}.score-tools button.active{background:var(--ma-accent-soft,var(--blue2));border-color:var(--ma-accent,var(--blue))}.score-head{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end}.score-scroll{overflow-x:auto;overflow-y:auto;max-height:68vh;min-height:360px;overscroll-behavior:contain;background:white;color:#172235;border:1px solid #cbd3df;border-radius:10px;scrollbar-gutter:stable}.score-paper{width:max-content;min-width:100%;padding:26px 24px}.score-part{display:grid;grid-template-columns:170px max-content;min-height:190px;border-bottom:1px solid #d9dfeb}.score-name{position:sticky;left:0;background:white;z-index:2;display:flex;flex-direction:column;justify-content:center;gap:8px;padding:12px;color:#172235;font:600 13px Arial}.score-name small{font-weight:400;color:#647188}.score-name button{font-size:11px;padding:4px;border:1px solid #cbd3df;border-radius:5px;background:#f5f7fa;color:#25334b}.score-bars{display:grid;grid-template-columns:repeat(var(--bars),minmax(310px,360px))}.score-bar{border-left:1px solid #26364c;min-height:170px;cursor:crosshair}.score-svg{width:100%;height:170px;display:block}.score-svg .staff{stroke:#3d4a5e;stroke-width:.8}.score-svg .head{fill:#172235;stroke:#172235}.score-svg .stem{stroke:#172235;stroke-width:1.5}.score-muted,.score-status{font-size:12px;color:var(--muted)}.score-saved{display:grid;gap:8px}.score-saved-row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;background:var(--panel2);border:1px solid var(--line);border-radius:9px}@media(max-width:700px){.score-head{grid-template-columns:1fr}.score-part{grid-template-columns:110px minmax(700px,1fr)}}@media print{.sidebar,.topbar,.page-head,.score-tools,.score-actions,.score-saved-panel,.footer{display:none!important}.main{margin:0!important}.content{padding:0!important}.score-panel{border:0!important;background:white!important}}";
        document.head.appendChild(css);

        css.textContent += `

          /* Spacious score paper with independent two-axis scrolling */
          .studio-editor-canvas .studio-score-area{min-width:0;overflow:hidden}
          .studio-editor-canvas .score-scroll{width:100%;max-height:68vh;min-height:360px;overflow-x:auto;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-x pan-y}
          .studio-editor-canvas .score-paper{width:max-content;min-width:100%;padding:28px 24px}
          .studio-editor-canvas .score-part{grid-template-columns:170px max-content;min-height:190px}
          .studio-editor-canvas .score-bars{grid-template-columns:repeat(var(--bars),minmax(310px,360px))}
          .studio-editor-canvas .score-bar{min-height:170px}
          .studio-editor-canvas .score-svg{height:170px}
          @media(max-width:760px){.studio-editor-canvas .studio-workspace{grid-template-columns:1fr}.studio-editor-canvas .studio-parts-panel{border-right:0!important;border-bottom:1px solid #e3e8ef!important}.studio-editor-canvas .score-scroll{max-height:62vh;min-height:300px}}
          /* Unified notation workspace: one continuous white editor surface */
          .studio-editor-canvas{background:#fff;color:#172235;border:1px solid #d5dce6;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,.16);display:grid;gap:0}
          .studio-editor-canvas .studio-documentbar,.studio-editor-canvas .studio-settings,.studio-editor-canvas .studio-ribbon,.studio-editor-canvas .studio-parts-panel,.studio-editor-canvas .studio-score-area{background:#fff!important;color:#172235!important;border:0!important;border-radius:0!important;box-shadow:none!important}
          .studio-editor-canvas .studio-documentbar{padding:18px 22px;border-bottom:1px solid #e3e8ef!important}
          .studio-editor-canvas .studio-doc-title small,.studio-editor-canvas .studio-settings label,.studio-editor-canvas .ribbon-group>span,.studio-editor-canvas .ribbon-dynamic{color:#64748b!important}
          .studio-editor-canvas .studio-settings{padding:17px 22px;border-bottom:1px solid #e3e8ef!important}
          .studio-editor-canvas .studio-settings input,.studio-editor-canvas .studio-settings select,.studio-editor-canvas .ribbon-dynamic select{background:#f8fafc!important;color:#172235!important;border:1px solid #cbd5e1!important}
          .studio-editor-canvas .studio-ribbon{padding:14px 20px;border-bottom:1px solid #e3e8ef!important}
          .studio-editor-canvas .ribbon-group{border-color:#e2e8f0}
          .studio-editor-canvas .ribbon-buttons button{background:#f8fafc!important;color:#253449!important;border:1px solid #cbd5e1!important}
          .studio-editor-canvas .ribbon-buttons button.active{background:#e8efff!important;color:#244b9b!important;border-color:#8aa8e8!important}
          .studio-editor-canvas .studio-workspace{grid-template-columns:205px minmax(0,1fr);gap:0}
          .studio-editor-canvas .studio-parts-panel{border-right:1px solid #e3e8ef!important;padding:18px 14px}
          .studio-editor-canvas .parts-panel-head{border-color:#e3e8ef}
          .studio-editor-canvas .parts-panel-head button,.studio-editor-canvas .studio-part-item{background:#f8fafc!important;color:#253449!important;border:1px solid #d8e0ea!important}
          .studio-editor-canvas .studio-part-item strong{color:#253449}
          .studio-editor-canvas .parts-panel-foot{border-color:#e3e8ef;color:#64748b}
          .studio-editor-canvas .studio-score-area{padding:18px 20px}
          .studio-editor-canvas .score-area-head{color:#172235}
          .studio-editor-canvas .score-area-head span{color:#64748b}
          .studio-editor-canvas .score-area-footer{color:#64748b}
          .studio-editor-canvas .score-status{color:#64748b}
          .studio-editor-canvas .studio-doc-actions button{background:#f8fafc!important;color:#26364b!important;border-color:#cbd5e1!important}
          .studio-editor-canvas .studio-doc-actions button:hover{background:#e8efff!important;border-color:#8aa8e8!important}
          .studio-editor-canvas .add-measure-btn{background:#edf3ff!important;color:#244b9b!important;border-color:#b7c9ed!important}
          .studio-editor-canvas .score-scroll{border:1px solid #d7dee8!important;max-height:calc(100vh - 410px)}
          .studio-editor-canvas .score-paper{background:#fff!important}
          .studio-editor-canvas .score-app{color:#172235}
          .studio-app .studio-editor-canvas{margin-bottom:2px}
          .score-app:fullscreen .studio-editor-canvas{min-height:calc(100vh - 100px)}
          .score-app:fullscreen .studio-editor-canvas .score-scroll{max-height:calc(100vh - 430px)}
          @media(max-width:760px){.studio-editor-canvas .studio-workspace{grid-template-columns:1fr}.studio-editor-canvas .studio-parts-panel{border-right:0!important;border-bottom:1px solid #e3e8ef!important}.studio-editor-canvas .studio-settings{grid-template-columns:repeat(2,minmax(0,1fr))}}

          .score-app{gap:16px;max-width:1600px;margin:0 auto}
          .studio-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:4px 0 10px}
          .studio-heading h1{font-size:30px;letter-spacing:-.7px;margin:0 0 5px}
          .studio-heading-actions,.studio-doc-actions{display:flex;gap:9px;align-items:center;flex-wrap:wrap}
          .studio-heading-actions button,.studio-doc-actions button{border:1px solid var(--line);background:var(--panel2);color:var(--text);border-radius:9px;padding:10px 14px;font-weight:600}
          .studio-heading-actions .btn{background:var(--blue);border-color:var(--blue)}
          .studio-documentbar{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:13px 17px;background:#0b1525;border:1px solid var(--line);border-radius:13px}
          .studio-doc-title{display:flex;align-items:center;gap:12px}.studio-doc-title>div{display:grid;gap:3px}.studio-doc-title small{font-size:11px;color:var(--muted)}
          .studio-doc-icon{width:38px;height:38px;border-radius:10px;background:var(--blue2);display:grid;place-items:center;font-size:23px;color:#fff}
          .studio-doc-actions button{padding:8px 11px;font-size:12px}
          .studio-settings{display:grid;grid-template-columns:1.5fr 1.1fr .65fr .8fr .75fr;gap:12px;padding:15px 17px;background:var(--panel);border:1px solid var(--line);border-radius:13px}
          .studio-settings label{display:grid;gap:7px;color:#9eabc0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.55px;min-width:0}
          .studio-settings input,.studio-settings select,.ribbon-dynamic select{width:100%;height:38px;background:#0a1424;color:#f4f7fb;border:1px solid #2a3a54;border-radius:8px;padding:0 10px;font-size:13px;min-width:0}
          .unit-field{display:flex;align-items:center;gap:6px}.unit-field input{width:75px}.unit-field small{font-size:11px;color:var(--muted)}
          .studio-ribbon{display:flex;align-items:stretch;gap:0;overflow-x:auto;padding:12px 14px;background:var(--panel);border:1px solid var(--line);border-radius:13px}
          .ribbon-group{display:grid;gap:8px;padding:0 14px;border-right:1px solid var(--line);flex:0 0 auto}.ribbon-group:first-child{padding-left:2px}
          .ribbon-group>span{font-size:9px;font-weight:800;letter-spacing:1px;color:#7f8da5}
          .ribbon-buttons{display:flex;gap:5px;align-items:center}.ribbon-buttons button{height:34px;min-width:34px;padding:0 9px;border:1px solid #293b58;background:#101d30;color:#dce5f5;border-radius:7px;font-size:12px;white-space:nowrap}
          .ribbon-buttons button:hover,.studio-doc-actions button:hover{border-color:var(--blue);background:var(--blue2)}
          .ribbon-buttons button.active{background:var(--blue2);border-color:var(--blue);color:#fff}
          .ribbon-dynamic{display:grid;gap:6px;align-content:center;padding:0 4px 0 14px;color:#8996aa;font-size:10px;font-weight:700;letter-spacing:.7px;min-width:86px}
          .ribbon-dynamic select{height:34px}
          .studio-workspace{display:grid;grid-template-columns:215px minmax(0,1fr);gap:14px;align-items:start;min-width:0}
          .studio-parts-panel{background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:15px;position:sticky;top:12px}
          .parts-panel-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:13px;border-bottom:1px solid var(--line)}
          .parts-panel-head>div{display:grid;gap:4px}.parts-panel-head small{font-size:11px;color:var(--muted)}
          .parts-panel-head button{width:32px;height:32px;border:1px solid var(--line);border-radius:8px;background:var(--panel2);color:white;font-size:19px}
          .studio-part-list{display:grid;gap:7px;padding:12px 0}
          .studio-part-item{display:flex;align-items:center;gap:9px;padding:9px 8px;background:#0a1424;border:1px solid #1d2c43;border-radius:8px;font-size:12px}
          .studio-part-item span:first-child{font-size:17px}.studio-part-item strong{font-size:11px;font-weight:600}
          .parts-panel-foot{border-top:1px solid var(--line);padding-top:12px;color:var(--muted);font-size:10px;display:flex;align-items:center;gap:7px}
          .parts-dot{width:7px;height:7px;border-radius:50%;background:#54c995}
          .studio-score-area{min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:14px}
          .score-area-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:1px 2px 13px}
          .score-area-head>div{display:flex;align-items:center;gap:11px}.score-area-head strong{font-size:14px}.score-area-head span{font-size:11px;color:var(--muted)}
          .add-measure-btn{border:1px solid #34496a;background:#152642;color:#e9efff;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;white-space:nowrap}
          .score-scroll{border-radius:7px;border:1px solid #cbd3df;background:#fff;max-height:calc(100vh - 390px);min-height:350px;overflow:auto}
          .score-paper{min-width:max-content;padding:26px 20px 30px;background:#fff;color:#172235}
          .score-part{grid-template-columns:155px max-content;min-height:172px;border-bottom:1px solid #e4e8ef}
          .score-name{width:155px;min-height:172px;padding:12px 13px;background:#fff;border-right:1px solid #e3e8ef;font-size:12px}
          .score-name small{font-size:10px;color:#7b8798}
          .score-name button{padding:4px 7px;margin-right:3px;font-size:10px}
          .score-bars{grid-template-columns:repeat(var(--bars),260px);gap:0}
          .score-bar{width:260px;min-height:172px;border-left:1px solid #b9c3d1}
          .score-svg{width:260px;height:172px;display:block}
          .score-svg .staff{stroke:#344155;stroke-width:1}
          .score-svg .head{stroke:#172235;stroke-width:1.2}
          .score-area-footer{display:flex;justify-content:space-between;gap:10px;padding:10px 2px 0;color:var(--muted);font-size:10px}
          .score-status{font-size:11px;color:var(--muted)}
          .score-saved-panel{padding:16px 18px}.saved-head p{margin:4px 0 12px}
          .score-saved-row{padding:12px 14px}.score-saved-row button{border:1px solid var(--line);background:var(--panel2);color:var(--text);border-radius:7px;padding:7px 10px}
          .studio-playbar{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:13px 16px;background:#0b1525;border:1px solid var(--line);border-radius:12px}
          .studio-playbar>div:first-child{display:grid;gap:4px}.studio-playbar span{font-size:11px;color:var(--muted)}
          .studio-playbar button{margin-left:6px;padding:9px 13px}
          .score-app:fullscreen{padding:24px;overflow:auto}.score-app:fullscreen .score-scroll{max-height:calc(100vh - 360px);min-height:420px}
          @media(max-width:1100px){.studio-settings{grid-template-columns:repeat(3,minmax(0,1fr))}.studio-workspace{grid-template-columns:180px minmax(0,1fr)}.score-scroll{max-height:60vh}}
          @media(max-width:760px){.studio-heading{align-items:flex-start;flex-direction:column}.studio-documentbar{align-items:flex-start;flex-direction:column}.studio-settings{grid-template-columns:repeat(2,minmax(0,1fr))}.studio-workspace{grid-template-columns:1fr}.studio-parts-panel{position:static}.score-scroll{max-height:55vh;min-height:280px}.studio-playbar{align-items:flex-start;flex-direction:column}}
          @media print{.studio-heading,.studio-documentbar,.studio-settings,.studio-ribbon,.studio-parts-panel,.score-area-head,.score-area-footer,.score-saved-panel,.studio-playbar{display:none!important}.studio-workspace{display:block}.studio-score-area{padding:0!important;border:0!important}.score-scroll{max-height:none!important;overflow:visible!important}.score-paper{padding:0!important}.score-part{break-inside:avoid}}
        `;

        const fullscreenCss=document.createElement("style");
        fullscreenCss.textContent=".score-app:fullscreen{position:fixed;inset:0;z-index:99999;overflow:auto;background:var(--bg,#080f20);padding:22px;box-sizing:border-box}.score-app:fullscreen .score-scroll{max-height:calc(100vh - 360px);overflow:auto}.score-app:fullscreen .score-paper{min-width:1100px;padding:28px}.score-app:fullscreen .score-part{min-height:165px}.score-app:fullscreen .score-svg{height:150px}.score-app:fullscreen .score-bar{min-height:150px}.score-fullscreen-btn{white-space:nowrap}";
        document.head.appendChild(fullscreenCss);
        $("#view").innerHTML = `
          <div class="score-app">
            <header class="studio-heading">
              <div><div class="eyebrow">COMPOSITION WORKSPACE</div><h1>Composition Studio</h1><p class="score-muted">Write, arrange, and shape music for your ensemble.</p></div>
              <div class="studio-heading-actions"><button class="secondary" id="scoreNew">＋ New score</button><button class="btn" id="scoreSave">Save composition</button></div>
            </header>
            <div class="studio-editor-canvas">
            <section class="studio-documentbar"><div class="studio-doc-title"><span class="studio-doc-icon">♫</span><div><strong id="studioDocLabel">Untitled Composition</strong><small>Conductor score</small></div></div><div class="studio-doc-actions"><button id="scoreFullscreen" class="score-fullscreen-btn">⛶ Full screen</button><button id="scorePrint">Print</button><button id="scoreXml">Export MusicXML</button></div></section>
            <section class="studio-settings">
              <label>Title<input id="scoreTitle" value="\${esc(score.title)}" maxlength="90"></label>
              <label>Composer<input id="scoreComposer" value="\${esc(score.composer)}"></label>
              <label>Tempo <span class="unit-field"><input id="scoreTempo" type="number" min="30" max="240" value="100"><small>BPM</small></span></label>
              <label>Time signature<select id="scoreTime"><option>4/4</option><option>3/4</option><option>2/4</option><option>6/8</option><option>5/4</option><option>7/8</option></select></label>
              <label>Key signature<select id="scoreKey">\${["C","G","D","A","E","B","F#","F","Bb","Eb","Ab","Db"].map(x=>'<option>'+x+'</option>').join("")}</select></label>
            </section>
            <div class="studio-ribbon">
              <div class="ribbon-group"><span>ENTRY</span><div class="ribbon-buttons">\${["note","rest"].map(t=>'<button data-tool="'+t+'" class="'+(t==="note"?"active":"")+'">'+(t==="note"?"♪ Note":"𝄽 Rest")+'</button>').join("")}</div></div>
              <div class="ribbon-group"><span>DURATION</span><div class="ribbon-buttons">\${[[16,"𝅝","Whole"],[8,"𝅗𝅥","Half"],[4,"♩","Quarter"],[2,"♪","Eighth"],[1,"𝅘𝅥𝅯","16th"]].map(a=>'<button data-dur="'+a[0]+'" title="'+a[2]+'" class="'+(a[0]===4?"active":"")+'">'+a[1]+'</button>').join("")}</div></div>
              <div class="ribbon-group"><span>ACCIDENTALS</span><div class="ribbon-buttons"><button data-acc="">♮</button><button data-acc="sharp">♯</button><button data-acc="flat">♭</button></div></div>
              <div class="ribbon-group"><span>ARTICULATION &amp; EXPRESSION</span><div class="ribbon-buttons">\${["dynamic","accent","staccato","tenuto","tie","slur","crescendo","diminuendo"].map(t=>'<button data-tool="'+t+'">'+({dynamic:"Dynamics",accent:"Accent",staccato:"Staccato",tenuto:"Tenuto",tie:"Tie",slur:"Slur",crescendo:"Cresc.",diminuendo:"Dim."})[t]+'</button>').join("")}</div></div>
              <label class="ribbon-dynamic">Dynamic<select id="scoreDyn">\${["pp","p","mp","mf","f","ff","sfz"].map(x=>'<option>'+x+'</option>').join("")}</select></label>
            </div>
            <div class="studio-workspace">
              <aside class="studio-parts-panel"><div class="parts-panel-head"><div><strong>Instruments</strong><small>Score parts</small></div><button id="scoreAddPart" title="Add instrument">＋</button></div><div id="scorePartList" class="studio-part-list"></div><div class="parts-panel-foot"><span class="parts-dot"></span> All parts synchronized</div></aside>
              <section class="studio-score-area"><div class="score-area-head"><div><strong>Full score</strong><span id="scoreMeasureCount">4 measures</span></div><button class="add-measure-btn" id="scoreAddBar">＋ Add measure</button></div><div class="score-scroll"><div id="scorePaper" class="score-paper"></div></div><div class="score-area-footer"><span id="scoreStatus" class="score-status">Ready. Select a note tool, then click a staff.</span><span>Tip: scroll horizontally to see more measures</span></div></section>
            </div>
            </div>
            <section class="score-panel score-saved-panel"><div class="saved-head"><strong>Saved compositions</strong><p class="score-muted">Stored on this device</p></div><div id="scoreSaved" class="score-saved"></div></section>
            <div class="studio-playbar"><div><strong>Playback</strong><span>Hear all instrument parts together</span></div><div><button id="scorePlay" class="btn">▶ Play score</button><button id="scoreStop" class="secondary">■ Stop</button></div></div>
          </div>`;
        $("#scoreTime").value=score.time;$("#scoreKey").value=score.key;
        const paper=$("#scorePaper");
        const ensure=()=>score.parts.forEach(p=>{while(p.bars.length<score.count)p.bars.push([]);p.bars=p.bars.slice(0,score.count)});
        const yPitch=p=>{const m=(p||"C4").match(/^([A-G])(\d)$/);return m?110-((+m[2]-4)*7+({C:0,D:1,E:2,F:3,G:4,A:5,B:6}[m[1]])-2)*7:110};
        const fromY=y=>["E4","F4","G4","A4","B4","C5","D5","E5","F5","G5","A5","B5","C6"][Math.max(0,Math.min(12,Math.round((110-y)/7)))];
        const noteSvg=n=>{const x=24+n.slot*650/slots(),y=yPitch(n.pitch),a=n.acc==="sharp"?"♯":n.acc==="flat"?"♭":n.acc==="natural"?"♮":"",art=n.art==="accent"?">":n.art==="staccato"?"·":n.art==="tenuto"?"—":"";if(n.pitch==="REST")return '<text x="'+x+'" y="'+(y+5)+'" font-size="22" fill="#172235">𝄽</text>';return (a?'<text x="'+(x-15)+'" y="'+(y+4)+'" fill="#172235">'+a+'</text>':'')+'<ellipse class="head" cx="'+x+'" cy="'+y+'" rx="6" ry="4" transform="rotate(-18 '+x+' '+y+')" '+(n.dur<=4?'':"fill='white'")+' />'+(n.dur===16?'':'<line class="stem" x1="'+(x+5)+'" y1="'+y+'" x2="'+(x+5)+'" y2="'+(y-29)+'"/>')+(art?'<text x="'+(x-4)+'" y="'+(y-12)+'" fill="#172235">'+art+'</text>':'')+(n.tie?'<path d="M'+(x+7)+' '+(y+8)+'q20 15 40 0" fill="none" stroke="#172235"/>':'')+(n.slur?'<path d="M'+(x+7)+' '+(y-14)+'q20 -18 40 0" fill="none" stroke="#172235"/>':'')};
        const render=()=>{ensure();paper.style.setProperty("--bars",score.count);$("#scoreMeasureCount").textContent=score.count+" measures";$("#studioDocLabel").textContent=$("#scoreTitle").value.trim()||"Untitled Composition";$("#scorePartList").innerHTML=score.parts.map(p=>"<div class=\"studio-part-item\"><span>"+(icons[p.name]||"🎼")+"</span><strong>"+esc(p.name)+"</strong></div>").join("");paper.innerHTML=score.parts.map((p,pi)=>'<div class="score-part"><div class="score-name">'+(icons[p.name]||"🎼")+' '+esc(p.name)+'<small>'+p.clef+' clef · '+p.bars.reduce((n,m)=>n+m.length,0)+' entries</small><div>'+(pi?'<button data-up="'+pi+'">↑</button>':'')+(pi<score.parts.length-1?'<button data-down="'+pi+'">↓</button>':'')+'<button data-remove="'+pi+'">Remove</button></div></div><div class="score-bars" style="--bars:'+score.count+'">'+p.bars.map((m,mi)=>'<div class="score-bar" data-p="'+pi+'" data-m="'+mi+'"><svg class="score-svg" viewBox="0 0 700 170" preserveAspectRatio="none">'+[54,68,82,96,110].map(y=>'<line class="staff" x1="0" y1="'+y+'" x2="700" y2="'+y+'"/>').join("")+'<line x1="699" y1="38" x2="699" y2="78" stroke="#26364c"/>'+(mi===0?'<text x="5" y="75" font-size="46" fill="#26364c">'+(p.clef==="bass"?"𝄢":p.clef==="alto"?"𝄡":"𝄞")+'</text><text x="67" y="82" font-size="27" font-family="serif" font-weight="600" text-anchor="middle" fill="#26364c">'+esc(score.time.split("/")[0])+'</text><text x="67" y="111" font-size="27" font-family="serif" font-weight="600" text-anchor="middle" fill="#26364c">'+esc(score.time.split("/")[1])+'</text>':'')+m.map(n=>n.kind==="dynamic"?'<text x="'+(24+n.slot*650/slots())+'" y="112" font-size="15" font-style="italic" font-weight="bold" fill="#172235">'+esc(n.text)+'</text>':n.kind==="expression"?'<text x="'+(24+n.slot*650/slots())+'" y="18" font-size="13" font-style="italic" fill="#172235">'+esc(n.text)+'</text>':noteSvg(n)).join("")+'</svg></div>').join("")+'</div></div>').join("")};
        const save=()=>{score.title=$("#scoreTitle").value.trim()||"Untitled Composition";score.composer=$("#scoreComposer").value;score.tempo=+$("#scoreTempo").value||100;score.time=$("#scoreTime").value;score.key=$("#scoreKey").value;const i=scores.findIndex(s=>s.id===score.id),copy=JSON.parse(JSON.stringify(score));if(i>=0)scores[i]=copy;else scores.unshift(copy);put("compositions",scores);showSaved();toast("Composition saved locally.")};
        const showSaved=()=>{$("#scoreSaved").innerHTML=scores.length?scores.map(s=>'<div class="score-saved-row"><div><strong>'+esc(s.title)+'</strong><div class="score-muted">'+s.parts.length+' parts · '+s.count+' measures · '+s.tempo+' BPM</div></div><div><button data-open="'+esc(s.id)+'">Open</button> <button data-del="'+esc(s.id)+'">Delete</button></div></div>').join(""):'<p class="score-muted">No saved scores yet.</p>'};
        const enter=(pi,mi,slot,pitch)=>{const m=score.parts[pi].bars[mi],prior=m.filter(n=>n.kind==="note"&&n.slot<=slot).sort((a,b)=>b.slot-a.slot)[0];if(["accent","staccato","tenuto","tie","slur"].includes(tool)){if(!prior){say("Add a note first.");return}if(tool==="tie"||tool==="slur")prior[tool]=!prior[tool];else prior.art=tool;render();return}if(["dynamic","crescendo","diminuendo"].includes(tool)){m.push({kind:tool==="dynamic"?"dynamic":"expression",slot,text:tool==="dynamic"?dyn:tool==="crescendo"?"cresc.":"dim."});render();return}const n={kind:"note",slot,pitch:tool==="rest"?"REST":pitch,dur,acc};const i=m.findIndex(x=>x.kind==="note"&&x.slot===slot);if(slot+dur>slots()){say("That duration does not fit in this measure. Choose a shorter note or another measure.");return}const overlaps=m.some((x,j)=>x.kind==="note"&&j!==i&&slot<(x.slot+(x.dur||4))&&x.slot<(slot+dur));if(overlaps){say("That note overlaps another note. Choose an open rhythmic position.");return}if(i>=0)m.splice(i,1,n);else m.push(n);m.sort((a,b)=>a.slot-b.slot);render()};
        paper.addEventListener("click",e=>{const up=e.target.closest("[data-up]"),down=e.target.closest("[data-down]"),rm=e.target.closest("[data-remove]");if(up){const i=+up.dataset.up;[score.parts[i-1],score.parts[i]]=[score.parts[i],score.parts[i-1]];render();return}if(down){const i=+down.dataset.down;[score.parts[i+1],score.parts[i]]=[score.parts[i],score.parts[i+1]];render();return}if(rm){if(score.parts.length===1){say("Keep at least one instrument.");return}score.parts.splice(+rm.dataset.remove,1);render();return}const cell=e.target.closest(".score-bar");if(!cell)return;const r=cell.querySelector("svg").getBoundingClientRect(),x=(e.clientX-r.left)/r.width*700,y=(e.clientY-r.top)/r.height*170,slot=Math.max(0,Math.min(slots()-1,Math.floor((x-24)/(650/slots()))));enter(+cell.dataset.p,+cell.dataset.m,slot,fromY(y))});
        document.querySelectorAll("[data-tool]").forEach(b=>b.addEventListener("click",()=>{tool=b.dataset.tool;document.querySelectorAll("[data-tool]").forEach(x=>x.classList.toggle("active",x===b));say("Selected "+tool)}));
        document.querySelectorAll("[data-dur]").forEach(b=>b.addEventListener("click",()=>{dur=+b.dataset.dur;document.querySelectorAll("[data-dur]").forEach(x=>x.classList.toggle("active",x===b))}));
        document.querySelectorAll("[data-acc]").forEach(b=>b.addEventListener("click",()=>acc=b.dataset.acc));
        $("#scoreDyn").addEventListener("change",e=>dyn=e.target.value);
        $("#scoreAddBar").addEventListener("click",()=>{score.count++;score.parts.forEach(p=>p.bars.push([]));render();say("Added a measure across all instruments.")});
        $("#scoreAddPart").addEventListener("click",()=>{const avail=catalog.filter(n=>!score.parts.some(p=>p.name===n)),ans=prompt("Type an instrument to add:\n"+avail.join(", "));if(!ans)return;const name=avail.find(n=>n.toLowerCase()===ans.trim().toLowerCase());if(!name){say("Instrument not found.");return}const p=makePart(name);p.bars=Array.from({length:score.count},()=>[]);score.parts.push(p);render()});
        const fullBtn=$("#scoreFullscreen"),studioRoot=document.querySelector(".score-app");
        const syncFullscreen=()=>{fullBtn.textContent=document.fullscreenElement===studioRoot?"⤢ Exit full screen":"⛶ Full screen";};
        fullBtn.addEventListener("click",async()=>{try{if(document.fullscreenElement===studioRoot)await document.exitFullscreen();else await studioRoot.requestFullscreen();}catch(error){say("Full screen is unavailable in this browser window.");}});
        document.addEventListener("fullscreenchange",syncFullscreen);
        $("#scoreTitle").addEventListener("input",()=>$("#studioDocLabel").textContent=$("#scoreTitle").value.trim()||"Untitled Composition");
        $("#scoreSave").addEventListener("click",save);
        $("#scoreNew").addEventListener("click",()=>{if(!confirm("Start a new score? Save this one first if needed."))return;score=fresh();$("#scoreTitle").value=score.title;$("#studioDocLabel").textContent=score.title;$("#scoreComposer").value=score.composer;$("#scoreTempo").value=100;$("#scoreTime").value="4/4";$("#scoreKey").value="C";render()});
        $("#scoreSaved").addEventListener("click",e=>{const o=e.target.closest("[data-open]"),d=e.target.closest("[data-del]");if(o){score=JSON.parse(JSON.stringify(scores.find(s=>s.id===o.dataset.open)));$("#scoreTitle").value=score.title;$("#scoreComposer").value=score.composer||"";$("#scoreTempo").value=score.tempo||100;$("#scoreTime").value=score.time||"4/4";$("#scoreKey").value=score.key||"C";render();say("Opened "+score.title)}if(d){scores=scores.filter(s=>s.id!==d.dataset.del);put("compositions",scores);showSaved()}});
        $("#scorePlay").addEventListener("click",async()=>{if(audio)audio.close().catch(()=>{});const AC=window.AudioContext||window.webkitAudioContext;if(!AC){say("Audio playback unavailable.");return}audio=new AC();await audio.resume();const beat=60/(+$("#scoreTempo").value||100),events=[];score.parts.forEach(p=>p.bars.forEach((m,mi)=>m.forEach(n=>{if(n.kind!=="note"||n.pitch==="REST")return;const a=n.pitch.match(/^([A-G])(\d)$/);if(!a)return;const semi={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[a[1]];events.push({f:440*Math.pow(2,((+a[2]*12+semi)-69)/12),t:(mi*(+score.time.split("/")[0]*4/+score.time.split("/")[1])+n.slot/4)*beat,l:(n.dur||4)/4*beat})})));events.forEach(n=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+.06+n.t;o.type="sine";o.frequency.value=n.f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.07,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(.07,n.l*.9));o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+Math.max(.1,n.l))});say("Playing all parts together.");playTimer=setTimeout(()=>{if(audio){audio.close().catch(()=>{});audio=null}say("Playback finished.")},score.count*(+score.time.split("/")[0]*4/+score.time.split("/")[1])*beat*1000+250)});
        $("#scoreStop").addEventListener("click",()=>{if(playTimer)clearTimeout(playTimer);if(audio){audio.close().catch(()=>{});audio=null}say("Playback stopped.")});
        $("#scoreXml").addEventListener("click",()=>{ 
            let xml='<?xml version="1.0" encoding="UTF-8"?><score-partwise version="4.0"><work><work-title>'+esc(score.title)+'</work-title></work><identification><creator type="composer">'+esc(score.composer)+'</creator></identification><part-list>';
            score.parts.forEach((p,i)=>xml+='<score-part id="P'+(i+1)+'"><part-name>'+esc(p.name)+'</part-name></score-part>');
            xml+='</part-list>';
            score.parts.forEach((p,i)=>{xml+='<part id="P'+(i+1)+'">';p.bars.forEach((m,mi)=>{xml+='<measure number="'+(mi+1)+'">';if(mi===0){const t=score.time.split("/");xml+='<attributes><divisions>4</divisions><time><beats>'+t[0]+'</beats><beat-type>'+t[1]+'</beat-type></time><clef><sign>'+(p.clef==="bass"?"F":p.clef==="alto"?"C":"G")+'</sign><line>'+(p.clef==="bass"?4:p.clef==="alto"?3:2)+'</line></clef></attributes><direction><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>'+score.tempo+'</per-minute></metronome></direction-type><sound tempo="'+score.tempo+'"/></direction>';}
                m.slice().sort((a,b)=>a.slot-b.slot).forEach(n=>{if(n.kind==="dynamic"){xml+='<direction><direction-type><dynamics><'+n.text+'/></dynamics></direction-type></direction>';return;}if(n.kind==="expression"){xml+='<direction><direction-type><words>'+esc(n.text)+'</words></direction-type></direction>';return;}xml+='<note>';if(n.pitch==="REST")xml+='<rest/>';else{const q=n.pitch.match(/^([A-G])(\d)$/);if(q)xml+='<pitch><step>'+q[1]+'</step><octave>'+q[2]+'</octave></pitch>';}xml+='<duration>'+(n.dur||4)+'</duration><type>'+({16:"whole",8:"half",4:"quarter",2:"eighth",1:"16th"}[n.dur||4])+'</type>';if(n.art||n.tie||n.slur)xml+='<notations>'+(n.art?'<articulations><'+n.art+'/></articulations>':'')+(n.tie?'<tied type="start"/>':'')+(n.slur?'<slur type="start" number="1"/>':'')+'</notations>';xml+='</note>';});xml+='</measure>';});xml+='</part>';});xml+='</score-partwise>';
            const blob=new Blob([xml],{type:"application/vnd.recordare.musicxml+xml"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=(score.title||"composition").replace(/[^a-z0-9_-]/gi,"-")+".musicxml";a.click();URL.revokeObjectURL(url);say("MusicXML exported.");
        });
        $("#scorePrint").addEventListener("click",()=>window.print());
        $("#scoreTime").addEventListener("change",e=>{const previous=score.time;score.time=e.target.value;const invalid=score.parts.some(p=>p.bars.some(m=>m.some(n=>n.kind==="note"&&n.slot+(n.dur||4)>slots())));if(invalid){score.time=previous;e.target.value=previous;say("Some notes do not fit that time signature. Move or shorten them first.");return}render()});$("#scoreKey").addEventListener("change",e=>score.key=e.target.value);
        render();showSaved();
    }
})();
