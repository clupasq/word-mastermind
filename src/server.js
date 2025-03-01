const fastify = require("fastify")({ logger: true })
const fastifyStatic = require("@fastify/static")
const path = require("path")

const {Game} = require("./game")
const {Dictionary} = require("./dictionary")

let dictionaries;
let defaultDictionary;

const gameOptions = {
    totalAttempts: Number(process.env.TOTAL_ATTEMPTS) || 7
};

const gamesById = new Map();

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../assets/"),
})

fastify.post("/game/start", (req, res) => {
    const {dictName} = req.body
    const dictionary = dictionaries.get(dictName) || defaultDictionary;
    const game = new Game(dictionary, gameOptions)
    const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)
    gamesById.set(id, game)
    return {
        id,
        ...game.start()
    }
})

fastify.post("/game/submit", (req, res) => {
    const {id, guess} = req.body
    const game = gamesById.get(String(id))
    if (game === undefined) {
        res.callNotFound()
    }

    const result = game.submitGuess(guess)
    if (result.won) {
        // cleanup
        gamesById.delete(id)
    }

    return result
})


const start = async () => {
    try {
        dictionaries = await Dictionary.getAllAvailableDictionaries()
        defaultDictionary = dictionaries.get("en-us-5")
        console.log("Current dictionaries: " + [...dictionaries.keys()])

        const port = process.env.PORT || 3333
        const address = process.env.LISTEN_ADDRESS || ""

        await fastify.listen({ port: port, host: address })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
