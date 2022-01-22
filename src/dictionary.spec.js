const {Dictionary} = require("./dictionary")

describe("Dictionary", () => {

    describe("Creation", () => {

        describe("can create with a Set<string>", () => {
            const dictionary = new Dictionary(new Set([
                "robot",
                "super",
                "woods"
            ]))

            test("it recognizes words", () => {
                expect(dictionary.hasWord("robot")).toBe(true)
                expect(dictionary.hasWord("super")).toBe(true)
                expect(dictionary.hasWord("woods")).toBe(true)
            })

            test("it recognizes words regardless of capitalization", () => {
                expect(dictionary.hasWord("rOBot")).toBe(true)
                expect(dictionary.hasWord("SUPER")).toBe(true)
                expect(dictionary.hasWord("WoOdS")).toBe(true)
            })

            test("it rejects unknown words", () => {
                expect(dictionary.hasWord("sword")).toBe(false)
            })

            test("can select a word at random", () => {
                const selected = new Set();
                for (let i = 0; i < 20; i++) {
                    selected.add(dictionary.selectRandomWord());
                }
                expect(selected.size > 1).toBe(true)
            })

            test("fails for inconsistent word lengths", () => {
                expect(() => new Dictionary(["abc", "abcd"])).toThrow("Inconsistent word lengths")
            })

        })

        test("can create using a dictionary file", async () => {
            const dictionary = await Dictionary.create("en-us-5")
            expect(dictionary.hasWord("Zebra")).toBe(true)
            expect(dictionary.hasWord("yummy")).toBe(true)
            expect(dictionary.hasWord("zxzxz")).toBe(false)
        })
    })

    test("can get all available dictionaries", async () => {
        const dicts = await Dictionary.getAllAvailableDictionaries();
        expect(dicts.has("en-us-5")).toBe(true)
        expect(dicts.get("en-us-5").hasWord("robot")).toBe(true)
    });
})
