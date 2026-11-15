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
                    <a class="${page === item[0] ? "active" : ""}" href="${item[3]}">
                        <span class="nav-icon">${item[1]}</span>
                        ${item[2]}
                    </a>
                `).join("")}
            </nav>
        </aside>

        <main class="main">
            <header class="topbar">
                <select id="instrument" aria-label="Choose instrument">
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
                    <button class="top-btn" id="search" type="button">⌕ Search</button>
                    <button class="top-btn" id="settings" type="button">⚙ Settings</button>
                    <button class="top-btn" id="profile" type="button">◉ Profile</button>
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

    $("#profile").addEventListener("click", () => {
        toast("Your profile: " + xp + " XP · " + completed.length + " lessons completed");
    });

    $("#settings").addEventListener("click", () => {
        toast("Settings will expand as Music Academy features are connected.");
    });

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
