# "HIGHLY SOPHISTICATED" Algo-Trader based on AI Analysis of Twitter Data

## Credit

This bot was created by following a Fireship tutorial on Youtube and adding some of my own tweaks. Credit: https://www.youtube.com/c/Fireship

## Project Description

This project is a server-side implementation of an automated trading algorithm. This algorithm uses AI to analyse data from Twitter and execute trades based on the insights it gathers. The application leverages the Google Firebase Functions platform for serverless deployment, OpenAI's GPT model for language understanding, Puppeteer for web scraping, and Alpaca's trading API to execute trades.

## Features

1. Scrapes the latest tweets from a specified Twitter page.
2. Uses OpenAI to analyze the content of the tweets.
3. Uses the analysis to decide on trades.
4. Executes the trade orders through Alpaca.

## Requirements

1. Node.js
2. Firebase CLI
3. OpenAI API Key
4. Alpaca API Key

## Dependencies

- firebase-functions
- openai
- @alpacahq/alpaca-trade-api
- puppeteer

You can install these dependencies using npm:

```shell
npm install firebase-functions openai @alpacahq/alpaca-trade-api puppeteer
```

## Setup

To use this function, you need to first install the Firebase CLI and initialize Firebase Functions in your project.

1. Install the Firebase CLI by following the instructions at: https://firebase.google.com/docs/cli#install-cli-mac-linux
2. Initialize Firebase Functions in your project by following the instructions at: https://firebase.google.com/docs/functions/get-started

For OpenAI and Alpaca APIs, you will need to acquire respective API keys.

- OpenAI: Sign up and get your API key from https://beta.openai.com/signup/
- Alpaca: Sign up and get your API key from https://alpaca.markets/

The API keys are passed to the program via environment variables. Please set them up as follows:

```shell
export OPENAI_ORG_ID=your_openai_org_id
export OPENAI_SECRET_KEY=your_openai_secret_key
export ALPACA_API_KEY_ID=your_alpaca_api_key_id
export ALPACA_SECRET_KEY=your_alpaca_secret_key
```

## How to Use

This is a serverless function that will run on the Firebase Functions platform. You can deploy it to your Firebase project using the `firebase deploy` command.

The function `getRichQuick` is set to run on a schedule. It will run every weekday at 10am Eastern Time. It starts by scraping tweets from Jim Cramer's Twitter page, then uses OpenAI to analyze those tweets, and finally, makes trade decisions based on the analysis.

## Contributing

If you'd like to contribute, I'm not sure why you would but, please fork the repository and make changes as you'd like. Pull requests are always welcome.

## Disclaimer

This bot should not be used as a sole source for investment decisions. Please perform your own due diligence before making any investment.

## License

This project is open source and available under the [MIT License](http://opensource.org/licenses/MIT).
