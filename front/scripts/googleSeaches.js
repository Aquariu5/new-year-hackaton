const fs = require('fs');


const func = () => {
    //const path = '/home/operator3/Документы/hack-huyak/model';
    const path = '/home/operator3/Документы/example/profiles';
    let dir = fs.readdirSync(path);
    let k = 0;
    const droch = [];

    for (let human of dir) {
        const res = [];
        let data = JSON.parse(fs.readFileSync(path + '/' + human).toString());

        for (let dat of data) {
            res.push({url: dat.url, time: dat.time});
            //fs.appendFileSync(`./users/${human}.txt`, dat.url + '\n');
        }
        fs.writeFileSync(`./users/${human}`, JSON.stringify(res, null, 2));
    }
}



const processGoogle = async () => {

    let users = fs.readdirSync('./users');
    for (let user of users) {
        let urls = JSON.parse(fs.readFileSync('./users/' + user).toString());
        let res = [];
        for (let url of urls) {
            if (url.url.includes('google.com/search') || url.url.includes('youtube.com/results?search_query=')) {
                //fs.appendFileSync(`./google/${user}`, url + '\n');
                res.push({url: url.url, time: url.time})
            }
        }
        fs.writeFileSync(`./google/${user}`, JSON.stringify(res, null, 2));
    }
}


const encoder = () => {
    let users = fs.readdirSync('./google');

    for (let user of users) {
        let urls = JSON.parse(fs.readFileSync('./google/' + user).toString());
        let res;
        let itog = [];
        for (let url of urls) {
            let realUrl = url.url;
            let start;
            if (realUrl.includes('youtube')) {
                start = realUrl.indexOf('y=');
            }
            else if (realUrl.includes('google')) {
                start = realUrl.indexOf('q=');
            }
            
            start += 2;
            realUrl = realUrl.slice(start);
            let end = realUrl.indexOf('&');
            end = end == -1 ? realUrl.length : end;
            let sub = realUrl.substring(0, end);
            try {
                res = decodeURI(sub);
                while (res.includes('+')) {
                    res = res.replace('+', ' ');
                }
            }
            catch (e) {
                let sub = realUrl.substring(0, end - 2);
                res = decodeURI(sub);
                while (res.includes('+')) {
                    res = res.replace('+', ' ');
                }
                //console.log('res', res);
            }
            
            //fs.appendFileSync(`./googleItog/${user}`, res + '\n');
            itog.push({url: res, time: url.time});
        }
        fs.writeFileSync(`./googleItog/${user}`, JSON.stringify(itog, null, 2));
    }
    
    //console.log(res);
}

const deb = () => {
    let url = 'https://www.google.com/search?q=http://qip.ru/away/noencode/?to=http://darlubodar.ru/free?keyword=privileg+sensation+9215+%D0%B8%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F+%D0%BD%D0%B0+%D1%80%D1%83%D1%81%D1%81%D';
    let start = url.indexOf('q=');
    start += 2;
    url = url.slice(start);
    let end = url.indexOf('&');
    end = end == -1 ? url.length : end;

    console.log(start, end);
    let sub = url.substring(0, end);
    console.log('sub', sub);
    try {
        let res = decodeURI(sub);
        while (res.includes('+')) {
            res = res.replace('+', ' ');
        }
        console.log('res', res);
    }
    catch (e) {
        let sub = url.substring(0, end - 2);
        let res = decodeURI(sub);
        while (res.includes('+')) {
            res = res.replace('+', ' ');
        }
        console.log('res', res);
    }


}


//deb();
func();
processGoogle();
encoder();
//console.log(decodeURI('%D0%B2%D0%B5%D1%87%D0%B5%D1%80%D0%B0'));

