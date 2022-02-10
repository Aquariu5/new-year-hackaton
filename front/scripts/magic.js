const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

const enter = async (inputurl) => {

    if (inputurl.includes('http') == false) {
        inputurl = 'http://' + inputurl;
    }
    const mainURL= 'https://just-magic.org/serv/demo_temakl.php';
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(mainURL);
    const divs = (await page.$$('button'));
    divs[0].click();

    await page.waitForSelector('input[name=mail]')
    await page.waitForSelector('input[name=pass]')

    await page.$eval('input[name=mail]', el => el.value = 'golini6587@ritumusic.com');
    await page.$eval('input[name=pass]', el => el.value = 'irNezn3o6V3CDt3eyLlH');

    await page.$eval('button', el => el.click());
    //var inputurl = 'rt.pornhub.com';
    await page.waitForSelector('input[name=key]');
    
    await page.$eval('input[name=key]', (el, url) => el.value = url, inputurl);
    await page.$eval('input[type=submit]', el => el.click());
    await page.waitForSelector('td');
    const text = await page.$eval('td', el => el.innerText);
    console.log('text', text);
}
enter('rt.pornhub.com');