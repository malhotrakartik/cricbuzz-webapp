require("chromedriver") ;
const fs =require('fs');
const { stringify } = require("querystring");

let wd= require("selenium-webdriver");
const { Platform } = require("selenium-webdriver/lib/capabilities");
let chrome = require(("selenium-webdriver/chrome"));
let browser = new wd.Builder().forBrowser('chrome').build();         //to open chrome and store that in browser

let finalData = [];
let topicsUrls = [];


async function main(){
    await browser.get("https://github.com/topics");
    let boxes = await browser.findElements(wd.By.css(".col-12.col-sm-6.col-md-4.mb-4"));
   console.log(boxes.length);
    for(let i in boxes){
        let topic = {};
        let topicNamePara = await boxes[i].findElements(wd.By.css("div a"))
        let url = await topicNamePara[0].findElements(wd.By.css("p"));


        let topicUrl = await topicNamePara[0].getAttribute("href");
        let topicName = await url[0].getAttribute("innerText");
        
        
        finalData.push({"topicName" : topicName});
        
       
       

       
       
        
        topicsUrls.push(topicUrl);
    }
    let projectUrls = [];
    for(i in topicsUrls){
      await  browser.get(topicsUrls[i]);
      
      let projects = [];
      await browser.wait(wd.until.elementLocated(wd.By.css(".f3.color-text-secondary.text-normal.lh-condensed")));
      let nameTables = await browser.findElements(wd.By.css(".f3.color-text-secondary.text-normal.lh-condensed"));
      console.log(nameTables.length)
      
      for(j in nameTables){
          let issues = {};
          let projectName = await nameTables[j].findElements(wd.By.css("a"));
          
          let name = await projectName[1].getAttribute("innerText");
          let projectUrl = await projectName[1].getAttribute("href");
        //   projects.push({"ProjectName" : name});
        projectUrls.push(projectUrl);
          projects.push({});
          projects[j]["ProjectName"] = name;
          projects[j]["ProjectUrl"] = projectUrl ;


       
      }
 
    finalData[i]["Projects"] = projects;
   
}


for(let i =0;i<6;i++){
    await browser.get(projectUrls[i]);
    let navBar = await browser.findElements(wd.By.css(".UnderlineNav-body.list-style-none li"))
    await navBar[1].click();
    await browser.wait(wd.until.elementLocated(wd.By.css(".flex-auto.min-width-0.p-2.pr-3.pr-md-2")));
    let issueName = await browser.findElements(wd.By.css(".flex-auto.min-width-0.p-2.pr-3.pr-md-2"));
    console.log(issueName.length);
    let name = await issueName[0].findElements(wd.By.css("a"));
    let name1 = await name[0].getAttribute("innerText");
    let issueUrl = await name[0].getAttribute("href");
    let obj = {};
    obj["heading"] = name1;
    obj["url"] = issueUrl;
    finalData[0]["Projects"][i]["Issues"] = obj;
    // console.log(obj);
}
fs.writeFileSync("gitScrapper.json",JSON.stringify(finalData));
    


    
   
    
  


}

main();
