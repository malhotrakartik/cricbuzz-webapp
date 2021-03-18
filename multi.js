require("chromedriver") ;

let wd= require("selenium-webdriver");
const { Platform } = require("selenium-webdriver/lib/capabilities");
let chrome = require(("selenium-webdriver/chrome"));
let browser = new wd.Builder().forBrowser('chrome').build();         //to open chrome and store that in browser

let matchId = "30880"
let fs = require('fs');

let battingCareer = ["matches","innings","notOut","runs","highestScore","average","ballsFaced","strikeRate","100s","200s","50","4s","6s"];
let bowlingCareer = ["matches","innings","balls","runs","wickets","bbi","bbm","economy","average","strikeRate","5wicket","10wicket"];

let batsmenColumns = ["playerName","out","runs","ballsPlayed","fours","sixes","sr"];
let bowlerColumns = ["palyerName","over","maiden","run","wicket","noball","wides","economy"];
let innings1Batsman = [];
let innings1Bowler = [];
let careerData = [];
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
            
            let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
            let palyerName = await columns[0].getAttribute("innerText");
            careerData.push({"palyerName" : palyerName});
            innings1Batsman.push(url);
        }
        
       
       
}

let innings1BowlerRow = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
for(let i=0;i<(innings1BowlerRow.length);i++){
    
    let columns = await innings1BowlerRow[i].findElements(wd.By.css("div"));
    if(columns.length == 8){
        let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
        let palyerName = await columns[0].getAttribute("innerText");
            careerData.push({"palyerName" : palyerName});
        innings1Bowler.push(url);
    }
    
   
   
}

let finalUrls = innings1Batsman.concat(innings1Bowler);
for(i in finalUrls){
    await browser.get(finalUrls[i]);
    await browser.wait(wd.until.elementLocated(wd.By.css(".table.cb-col-100.cb-plyr-thead")));
    let tables = await browser.findElements(wd.By.css(".table.cb-col-100.cb-plyr-thead"));
   
   
    for(j in tables){
        let tableRows = await tables[j].findElements(wd.By.css("tbody tr"));
        let data = {};
        for(row of tableRows){
            let tempData = {};
            let columns = await row.findElements(wd.By.css("td"));
            let matchType = await columns[0].getAttribute("innerText");
            let keyArr = batsmenColumns;
            if(j == 1){
                keyArr = bowlerColumns;

            }
            for(let k=1;k<columns.length;k++){
                tempData[keyArr[k-1]] = await columns[k].getAttribute("innerText");
            }
            console.log(tempData);
            

            data[matchType] = tempData;

        }
        if(j == 0){
            careerData[i]["battingCareer"] = data;
        }else{
            careerData[i]["bowlingCareer"] = data;
        }

    }
    

}
console.log(careerData);
fs.writeFileSync("career.json",JSON.stringify(careerData));


    

}

main();