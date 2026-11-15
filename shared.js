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

    document.getElementById("sharedSettings")?.addEventListener("click", () => {
        window.alert("Music Academy settings will be available here.");
    });

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
