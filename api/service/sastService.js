const fs = require("fs");
const axios=require('axios');
const RallyService=require('./rallyService');


class SastService {
  constructor() {
    
    
  }

  getApiResult(){
      return new Promise(async (resolve,reject)=>{
          console.log('inside get api result...',this.requestParams);
        axios(this.requestParams)
        .then(res=>{
            console.log('user story response',res);
            resolve(res.data);
           }).
           catch(err=>{
               console.log("err",err);
           })
      })

  }

  main(filename) {
    return new Promise(async (resolve, reject) => {
      fs.readFile("./uploads/" + filename, "utf8", (err, data) => {
        if (err) {
          throw err;
        } else {
            let fileData=JSON.parse(data);
            console.log('filedata>>',fileData);
          console.log("rels :: ", fileData["Releaseby"],fileData["UserStory"],fileData["Defect"],fileData["Feature"]);
         const rallyService=new RallyService(fileData["Releaseby"],fileData["UserStory"],fileData["Defect"],fileData["Feature"]);
         let response= rallyService.main();
            resolve(response)

        }
      });
    
    });
  }
}

module.exports = SastService;
