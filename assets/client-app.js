const parseQueryString = () => {
    const queryString = window.location.search;
    const query = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
};

const queryStringParams = parseQueryString();

const isDarkModePreferred = () => {
    for (const cookie of document.cookie.split("; ")) {
        const [name, value] = cookie.split("=");
        if (name === "darkMode" && value === "true") {
            return true;
        }
    }

    return false;
};

const app = new Vue({
    el: "#app",

    data: {
        allowedLetters: new Set("QWERTYUIOPASDFGHJKLZXCVBNM"),
        keyboard: [
            [..."QWERTYUIOP"],
            [..."ASDFGHJKL"],
            ["ENTER", ..."ZXCVBNM", "⌫ "],
        ],

        gameState: undefined,
        error: undefined,
        darkMode: false
    },

    methods: {

        startGame: async function() {
            const response = await fetch("/game/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dictName: queryStringParams.dictName
                })
            });
            const newGameData = await response.json();
            const {id, totalAttempts, wordLength} = newGameData;
            this.gameState = {
                id,
                totalAttempts,
                wordLength,
                currentAttempt: 0,
                board: [],
                wrongKeys: new Set(),
                rightKeys: new Set(),
                finished: false,
                won: false,
                revealedWord: undefined
            }

            for (let i = 0; i < totalAttempts; i++) {
                const row = [];
                this.gameState.board.push(row);
                for (let j = 0; j < wordLength; j++) {
                    row.push({
                        letter: undefined,
                        result: undefined
                    });
                }
            }

            console.log(this.gameState)
        },

        handleNewLetter: async function(key) {
            if (key === "ENTER" && this.gameState.finished) {
                this.startGame();
            }

            if (!this.gameState || this.gameState.finished) {
                return;
            }

            if (key === "ENTER") {
                await this.submitWord();
            } else if (key === "⌫ " || key === "BACKSPACE") {
                this.deleteLetter();
            } else {
                this.addLetter(key);
            }
        },

        addLetter: function(letter) {
            letter = (letter || "").toUpperCase();
            if (!this.allowedLetters.has(letter)) {
                return;
            }

            const {board, currentAttempt} = this.gameState;
            const row = board[currentAttempt];
            for (const tile of row) {
                if (tile.letter === undefined) {
                    tile.letter = letter;
                    break;
                }
            }
        },

        deleteLetter: function() {
            const {board, currentAttempt} = this.gameState;
            const row = board[currentAttempt];
            let lastTile;
            for (const tile of row) {
                if (tile.letter !== undefined) {
                    lastTile = tile;
                } else {
                    break;
                }
            }
            if (lastTile) {
                lastTile.letter = undefined;
            }
        },

        submitWord: async function() {
            const {id, board, currentAttempt} = this.gameState;
            const row = board[currentAttempt];
            let guess = "";
            for (const tile of row) {
                if (tile.letter) {
                    guess += tile.letter;
                } else {
                    return;
                }
            }

            const response = await fetch("/game/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: this.gameState.id,
                    guess,
                })
            });

            const data = await response.json();

            if (data.error) {
                console.warn(data.error);
                this.error = data.error;
                window.setTimeout(() => {
                    this.error = undefined;
                }, 1000);
                return;
            }

            const {result} = data;

            if (result) {
                for (let i = 0; i < row.length; i++) {
                    const tile = row[i];
                    const tileResult = result[i];

                    if (tileResult === "2") {
                        tile.result = "correct";
                        this.gameState.rightKeys.add(tile.letter);
                    } else if (tileResult === "1") {
                        tile.result = "present";
                        this.gameState.rightKeys.add(tile.letter);
                    } else {
                        this.gameState.wrongKeys.add(tile.letter);
                    }
                }
            }

            if (data.won) {
                this.gameState.finished = true;
                this.gameState.won = true;
                return;
            }

            if (data.finished) {
                this.gameState.revealedWord = data.word;
                this.gameState.finished = true;
                return;
            }

            this.gameState.currentAttempt++;
            const rowDom = document.getElementById(`board-row-${this.gameState.currentAttempt}`);
            if (rowDom) {
                // In case of many attemps, if there's a scrollbar
                // make sure the current row is visible.
                if (rowDom.scrollIntoViewIfNeeded) {
                    rowDom.scrollIntoViewIfNeeded();
                } else {
                    rowDom.scrollIntoView();
                }
            }
        },

        classForKey: function(key) {
            return {
                btn: true,
                key: true,
                right: this.gameState && this.gameState.rightKeys.has(key),
                wrong: this.gameState && this.gameState.wrongKeys.has(key),
            };
        },

        toggleDarkMode: function() {
            this.darkMode = !this.darkMode;
            const body = document.querySelector("body");
            if (this.darkMode) {
                body.classList.add("dark");
            } else {
                body.classList.remove("dark");
            }
            document.cookie = `darkMode=${this.darkMode}`;
        }

    },

    mounted: function() {
        this.startGame();

        document.addEventListener("keyup", async (e) => {
            if (e.ctrlKey || e.altKey || e.metaKey) {
                return
            }
            await this.handleNewLetter(e.key.toUpperCase());
        });

        if (isDarkModePreferred()) {
            this.toggleDarkMode();
        }
    },
})
