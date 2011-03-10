var t=require('fs').readFileSync("gitRepoInfo.txt");
var obj=JSON.parse(t.toString());
console.log(obj);