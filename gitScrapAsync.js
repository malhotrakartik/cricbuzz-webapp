require("chromedriver") ;
const { fail } = require("assert");
const fs =require('fs');
const { stringify } = require("querystring");

let wd= require("selenium-webdriver");

let chrome = require(("selenium-webdriver/chrome"));
let browser = new wd.Builder().forBrowser('chrome').build(); 
let finalData = [];
let projectsCovered = 0;
let totalProjects = 0;

async function getIssues(url,i,j){
    let browser = new wd.Builder().forBrowser('chrome').build(); 
    await browser.get(url + '/issues');
    finalData[i].Projects[j]["issues"] = [];
    let currUrl = await browser.getCurrentUrl();
    if(currUrl != url + '/issues'){
        browser.close();
        return;
    }
    // let navBar = await browser.findElements(wd.By.css(".UnderlineNav-body.list-style-none li"))
    // await navBar[1].click();
    await browser.wait(wd.until.elementLocated(wd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title")));
    let issueBoxes = await browser.findElements(wd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title"));
    
    for(let k in issueBoxes){
        if(k == 3){
            break;
        }
        finalData[i].Projects[j].issues.push({"issueHeading" : await issueBoxes[k].getAttribute("innerText"),"issueUrl" : await issueBoxes[k].getAttribute("href")});
       
    }

    browser.close();
}

async function getProjectUrl(url,i){
    let browser = new wd.Builder().forBrowser('chrome').build(); 
    await browser.get(url);
    await browser.wait(wd.until.elementLocated(wd.By.css("a.text-bold")));
    let projectBoxes = await browser.findElements(wd.By.css("a.text-bold"));
    if(projectBoxes.length < 3){
        totalProjects += 3;
    }else{
        totalProjects += projectBoxes.length;
    }
  
    
    
    finalData[i]["Projects"] = [];
    for(let j in projectBoxes){
        if(j==3){
            break;
        }
       
        finalData[i].Projects.push({projectUrl : await projectBoxes[j].getAttribute("href")});
    }
        projectsCovered += 1;
   
        let projects = await finalData[i].Projects;
        for(let j in projects){
             getIssues(projects[i].projectUrl,i,j);
        }

        if(projectsCovered == totalProjects){
            fs.writeFileSync("gitFinal.json",JSON.stringify(finalData));

        }
    

   browser.close();

}

async function main(){
  
       await browser.get("https://github.com/topics");
       await browser.wait(wd.until.elementLocated(wd.By.css(".no-underline.d-flex.flex-column.flex-justify-center")));
       let topicBoxes = await browser.findElements(wd.By.css(".no-underline.d-flex.flex-column.flex-justify-center"));
      
       for(let box of topicBoxes){
      
          await finalData.push({topicUrl : await box.getAttribute("href")});
        }

       for(let i in finalData){
           getProjectUrl(finalData[i].topicUrl , i);
       }

      
    browser.close();
              
      
       


}
main()