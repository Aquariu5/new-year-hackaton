//import fs from 'fs';
//import axios from 'axios';
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const func = async () => {
    let urls = fs.readFileSync('domain_top.csv').toString().split('\n');
    urls = urls.map(el => el.trim());
    urls = urls.map(el => el.split(',')[1])
    urls.splice(0,1);
    urls = urls.filter(el => el != undefined);
    
    urls = urls.map(el => {
        if (el.includes('http') == false) {
            el = 'http://' + el;
        }
        return el;
    })
    const browser = await puppeteer.launch();
    let titles = [];
    
    for (let url of urls) {
        const page = await browser.newPage();
        try {
            await page.goto(url);
            await page.waitForSelector('title');
            const title = await page.$eval('title', el => el.innerText);
            console.log('title', title);
            if (title.length == 0) {
                titles.push('null')
                fs.appendFileSync('titles.txt', 'null' + '\n');
            }
            else {
                titles.push(title);
                fs.appendFileSync('titles.txt', title + '\n');
            }
                
        }
        catch(e) {
            console.log('bad url');
            titles.push('null');
            fs.appendFileSync('titles.txt', 'null' + '\n');
        }
        
    }
    
    
    // let res = (await axios.get('https://twitch.tv')).data;
    // console.log('res', res);
}

func();