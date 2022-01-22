const fs = require("fs")
const path = require("path")
const {promisify} = require("util")

const readFileAsync = promisify(fs.readFile)
const readdirAsync = promisify(fs.readdir)

class Dictionary {

    constructor(words) {
        this.length = undefined;
        this.words = [];
        for (const w of words) {
            if (this.length === undefined) {
                this.length = w.length
            } else if (this.length !== w.length) {
                throw new Error("Inconsistent word lengths")
            }

            this.words.push(w.toUpperCase())
        }
        this.wordSet = new Set(this.words)
    }

    hasWord(word) {
        return this.wordSet.has(word.toUpperCase())
    }

    selectRandomWord() {
        const randomIndex = Math.floor(Math.random() * this.words.length)
        return this.words[randomIndex]
    }

    getWordLength() {
        return this.length
    }

}

const DICT_DIR = path.join(__dirname, "../dict/");

Dictionary.create = async (dictFileName) => {
    const contents = await readFileAsync(path.join(DICT_DIR, dictFileName), "utf8")
    return new Dictionary(contents
        .split("\n")
        .filter(w => w.length > 0))
}

Dictionary.getAllAvailableDictionaries = async () => {
    const files = await readdirAsync(DICT_DIR);

    const dictionaries = new Map();

    for (const f of files) {
        dictionaries.set(f, await Dictionary.create(f));
    }

    return dictionaries
}

module.exports = { Dictionary }
