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
                    <a href="${href}" class="${currentPage === key ? "active" : ""}"
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
                <button class="top-btn" id="sharedSearch" type="button" title="Open My Library">⌕</button>
                <button class="top-btn" id="sharedSettings" type="button" title="Settings">⚙</button>
                <button class="top-btn" id="sharedProfile" type="button" title="Profile">◉</button>
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
