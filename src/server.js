const fastify = require("fastify")({ logger: true })
const fastifyStatic = require("fastify-static")
const path = require("path")

const {Game} = require("./game")
const {Dictionary} = require("./dictionary")

let dictionary;

const gamesById = new Map();

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../assets/"),
})

fastify.get("/game/start", (req, res) => {
    const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)
    const game = new Game(dictionary)
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
        dictionary = await Dictionary.create("en-us-5")
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
