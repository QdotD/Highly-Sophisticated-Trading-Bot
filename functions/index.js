const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// SDK Config //

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_SECRET_KEY,
});

const openai = new OpenAIApi(configuration);


// alpaca - algo trader

const Alpaca = require('@alpacahq/alpaca-trade-api');
const alpaca = new Alpaca({
    keyId: process.env.ALPACA_API_KEY_ID,
    secretKey: process.env.ALPACA_SECRET_KEY,
    paper: true,
})

// exports.helloWorld = functions.https.onRequest(async (request, response) => { // http function - allows us to test it in the browser

//     // test logic here

//     response.send('test');


//     // send response object back as the response from the function
//     // response.send(gptCompletion.data);
//     // run "npm run serve" to run the functions locally
// });

// puppeteer - headless browser that lets you scrape data from the internet (ex. twatter) for better openai context //

const puppeteer = require('puppeteer');

async function scrape() {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"], headless: true, });
    const page = await browser.newPage();

    await page.goto('https://twitter.com/jimcramer', { // wait for page to load
        waitUntil: 'networkidle2',
    });

    // await page.waitForTimeout(3000); // deprecated
    new Promise(r => setTimeout(r, 3000));  // wait an extra 3 seconds after page loads just to be safe

    // await page.screenshot({ path: 'example.png' }); // takes screenshot of page to verify we're in the right place

    const tweets = await page.evaluate(async () => { // to interact with the actual content on the page - we have access to the document inside this function, therefore we can grab elements from the DOM (like being in the browser console)
        return document.body.innerText; // this can be imporved by filtering for tweets that only mention actual stock names or tickers
    });

    await browser.close();

    return tweets;
}

// cron job - a schedule for doing work in the background on the server
// firebase pub sub function (cron job)
exports.getRichQuick = functions
    .runWith({ memory: '4GB' }) // 4gb because puppeteer uses a lot of memory
    .pubsub.schedule('45 9 * * 1-5') // parsed with crontab guru - "At 10am everyday from M to F"
    .timeZone('America/New_York')
    .onRun(async (ctx) => {
        console.log('This will run at 10am Eastern M-F');

        // function logic here
        const tweets = await scrape();
        console.log("tweets: ", tweets);

        // make a call to openai to get a response object
        const gptCompletion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${tweets}. Jim Cramer recommends buying the following stock tickers: `,
            temperature: 0.7,
            max_tokens: 32,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        // var that holds the tickers returned from gtp
        const stocksToBuy = gptCompletion.data.choices[0].text.match(/\b[A-Z]+\b/g);

        // ALPACA TRADES //
        // close all positions
        const cancel = await alpaca.cancelAllOrders();
        const liquidate = await alpaca.closeAllPositions();

        // get alpaca account
        const account = await alpaca.getAccount();
        console.log(`buying power: ${account.buying_power}`);

        // place an order on alpaca
        const order = await alpaca.createOrder({
            symbol: stocksToBuy[0],
            qty: 1,
            // notional: account.buying_power * .05, // fractional shares - buys a specific dollar amount
            side: 'buy',
            type: 'market',
            time_in_force: 'day',
        })

        console.log(`You just bought ${order.qty} share(s) of ${order.symbol} at ${order.created_at}`);

        return null;
    });