require("chromedriver") ;

let wd= require("selenium-webdriver");
let browser = new wd.Builder().forBrowser('chrome').build();         //to open chrome and store that in browser

let matchId = "30880"

let batsmenColumns = ["playerName","out","runs","ballsPlayed","fours","sixes","sr"];
let innings1Batsman = [];
let innings = "2";

async function main(){
    await(browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`));
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await  browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    await browser.wait(wd.until.elementLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
    let tables = await  browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));

    let innings1BatsmanRow = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i=0;i<(innings1BatsmanRow.length - 3);i++){
        
        let columns = await innings1BatsmanRow[i].findElements(wd.By.css("div"));
        let data = {};
        for(j in columns){
            if(j!=1){
                data[batsmenColumns[j]] = await columns[j].getAttribute("innerText");
                
            }
        }
        innings1Batsman.push(data);
       
       
}
console.log(innings1Batsman);

    

}

main();