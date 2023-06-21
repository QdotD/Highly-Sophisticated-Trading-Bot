const puppeteer = require('puppeteer');

async function scrape() {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"], headless: true, });
    const page = await browser.newPage();

    await page.goto('https://www.instagram.com/_annkkk_/', { // wait for page to load
        waitUntil: 'networkidle2',
    });

    // await page.waitForTimeout(3000); // deprecated
    new Promise(r => setTimeout(r, 3000));  // wait an extra 3 seconds after page loads just to be safe

    await page.screenshot({ path: 'example.png' }); // takes screenshot of page to verify we're in the right place

    const tweets = await page.evaluate(async () => { // to interact with the actual content on the page - we have access to the document inside this function, therefore we can grab elements from the DOM (like being in the browser console)
        return document.body.innerText; // this can be imporved by filtering for tweets that only mention actual stock names or tickers
    });

    await browser.close();

    console.log(tweets);
    return tweets;
}

scrape();