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
* [Romanian (6 letter words)](https://word-mastermind.glitch.me/?dictName=ro-ro-6)
* [Swedish](https://word-mastermind.glitch.me/?dictName=sv-se-5)
* [Dutch](https://word-mastermind.glitch.me/?dictName=nl-nl-5)

## How to Play

The goal of the game is to guess a target word.

To do so, you enter guesses and the game will provide feedback for each letter of your guess:

* a letter that is placed in the correct spot will be marked green
* a letter that is present in the target word, but incorrectly placed will be marked yellow
* the unmarked letters are simply not present in the target word

All submitted guesses have to be valid words.

To make it easy, the keyboard at the bottom of the screen will highlight the statuses of each letter: present (green), not present (dark gray), unknown (light gray).

## Running the program

Clone this repo:

```
git clone https://github.com/clupasq/word-mastermind.git
cd word-mastermind
```

There are two options for runnning the program: with Node.JS or in Docker.


### Running with Docker

The easiest option is to use Docker.
You can either pull the latest docker image from the Github Repository, or build it yourself.

To pull the image:

```
docker pull ghcr.io/clupasq/word-mastermind:latest
```

To build the image:

```
cd word-mastermind
docker build -t word-mastermind .
cd ..
```

Once the image is available, you can start a container:

```
docker run --rm -p "3333:80" word-mastermind
```

Then, go to http://localhost:3333.


### Running with node

Make sure you have Node.JS 16 and yarn installed.

In the `word-mastermind` directory, install the dependencies using `yarn install`.

Run the server: `yarn start`.

Go to http://localhost:3333.
