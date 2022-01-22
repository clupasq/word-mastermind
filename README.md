# Word Mastermind

This game is a clone of [Wordle](https://www.powerlanguage.co.uk/wordle/).
It's like the [MasterMind game](https://en.wikipedia.org/wiki/Mastermind_(board_game)), but instead of colors you have to guess words.

## Why?

* The original game only allows one word per day. This one can be played endlessly.
* Can work with custom dictionary files

## Demo

You can try it out on Glitch:

* [English](https://word-mastermind.glitch.me/)
* [Romanian](https://word-mastermind.glitch.me/?dictName=ro-ro-5)

## Running the program

Clone this repo:

```
git clone https://github.com/clupasq/word-mastermind.git
cd word-mastermind
```

There are two options for runnning the program.

### Running directly

Make sure you have Node.JS 16 installed.

In the `word-mastermind` directory, install the dependencies using `yarn install` or `npm install`.

Run the server: `npm start`.

Go to http://localhost:3333.

### Running with Docker

In the `word-mastermind` directory, issue the following command to prepare the Docker image:

```
docker build -t word-mastermind .
```

Then run the image:

```
docker run --rm -p "3333:80" word-mastermind
```

Go to http://localhost:3333.
