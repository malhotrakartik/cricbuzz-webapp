const fs = require('fs');

let arr =[]
for(let i=0;i<3;i++){
    let obj = {"hello":1};
    
    arr.push(obj);
}
let arr2 = [{"issues":"xyz"}];
arr2.push({"issues":"xyz"});
arr[0]["noway"] = arr2; 
console.log(arr);
arr[0]["noway"][0]["Issues"] = 1;

fs.writeFileSync("practice.json",JSON.stringify(arr));


