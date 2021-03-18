require("chromedriver") ;

let wd= require("selenium-webdriver");
let chrome = require(("selenium-webdriver/chrome"));
let browser = new wd.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();         //to open chrome and store that in browser

let matchId = "30880"

let batsmenColumns = ["playerName","out","runs","ballsPlayed","fours","sixes","sr"];
let bowlerColumns = ["palyerName","over","maiden","run","wicket","noball","wides","economy"];
let innings1Batsman = [];
let innings1Bowler = [];
let innings = "2";

async function main(){
    await(browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`));
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await  browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    await browser.wait(wd.until.elementLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
    let tables = await  browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));

    let innings1BatsmanRow = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i=0;i<(innings1BatsmanRow.length);i++){
        
        let columns = await innings1BatsmanRow[i].findElements(wd.By.css("div"));
        if(columns.length == 7){
            let data = {};
            for(j in columns){
                if(j!=1){
                    data[batsmenColumns[j]] = await columns[j].getAttribute("innerText");
                    
                }
            }
            
            innings1Batsman.push(data);
        }
        
       
       
}

let innings1BowlerRow = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
for(let i=0;i<(innings1BowlerRow.length);i++){
    
    let columns = await innings1BowlerRow[i].findElements(wd.By.css("div"));
    if(columns.length == 8){
        let data = {};
        for(j in columns){
            if(j!=1){
                data[bowlerColumns[j]] = await columns[j].getAttribute("innerText");
                
            }
        }
        innings1Bowler.push(data);
    }
    
   
   
}
console.log(innings1Batsman);
console.log(innings1Bowler);

    

}

main();