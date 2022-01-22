const {Game} = require("./game")
const {Dictionary} = require("./dictionary")

DICT = new Dictionary([
    "super",
    "robot",
    "blood",
    "zebra"
])

describe("Game", () => {

    describe("creation", () => {

        test("can create a game with default options", () => {
            const g = new Game(DICT)
            expect(DICT.hasWord(g.word)).toBe(true)
        })

        test("can specify a word", () => {
            const g = new Game(DICT, {
                word: "zebra"
            })
            expect(g.word).toBe("ZEBRA")
        })

        test("if specified word is not in dictionary, fail", () => {
            expect(() =>
                new Game(DICT, {
                    word: "noope"
                })).toThrow("Word not in dictionary: 'noope'")
        })

    })

    describe("start", () => {

        test("returns correct parameters", () => {
            const g = new Game(DICT)

            expect(g.start()).toEqual({
                totalAttempts: 5,
                wordLength: 5,
            })
        })

    })

    describe("gameplay", () => {

        describe("guessing", () => {
            const g = new Game(DICT, { word: "zebra" })
            const result = g.submitGuess("zebra");

            test("guess", () => {
                expect(result).toEqual({
                    finished: true,
                    won: true,
                    result: "22222"
                })
            })

            test("no further submits allowed after winning", () => {
                expect(() => g.submitGuess("robot"))
                    .toThrow("Game finished")
            })
        })

        describe("incorrect guesses", () => {
            const g = new Game(DICT, { word: "robot" })

            test("invalid word rejected", () => {
                expect(g.submitGuess("aaaaa")).toEqual({
                    error: "Not in dictionary"
                })
            })

            test("valid words - correct signals", () => {
                expect(g.submitGuess("zebra")).toEqual({
                    result: "00210",
                    currentGuess: 1,
                })
                expect(g.submitGuess("blood")).toEqual({
                    result: "10120",
                    currentGuess: 2,
                })
            })


        })

        test("finish in exactly 5 attempts", () => {
            const g = new Game(DICT, { word: "robot" })

            for (let i = 0; i < 4; i++) {
                const result = g.submitGuess("zebra");
                expect(result.word).toBeUndefined();
                expect(result.finished).toBeUndefined();
            }

            const finalResult = g.submitGuess("robot");
            // When the game is over, reveal guess
            expect(finalResult.won).toBe(true);
            expect(finalResult.finished).toBe(true);

            // Subsequent calls get an error
            expect(() => g.submitGuess("robot")).toThrow("")
        })

        test("after 5 attempts, the game ends", () => {
            const g = new Game(DICT, { word: "robot" })

            for (let i = 0; i < 4; i++) {
                const result = g.submitGuess("zebra");
                expect(result.word).toBeUndefined();
                expect(result.finished).toBeUndefined();
            }

            const finalResult = g.submitGuess("zebra");
            // When the game is over, reveal guess
            expect(finalResult.word).toEqual("ROBOT");
            expect(finalResult.finished).toBe(true);

            // Subsequent calls get an error
            expect(() => g.submitGuess("robot")).toThrow("")
        })


    })

})
