const axios=require('axios');
const workInfo=require('../model/workInfo');
class RallyService {
    constructor(releaseby,userStory,defect,feature) {
        this.releaseby=releaseby;
        this.userStory=userStory;
        this.defect=defect;
        this.feature=feature;
        this.requestParams= {
            method:"GET",
            url:'',
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Basic YmhhcmF0YUBkZWxvaXR0ZS5jb206TG9naW5AMTIzJA=="
            },
           async:true,
           crossDomain:true
    
        }
    }
    getApiResult(){
        return new Promise(async (resolve,reject)=>{
          axios(this.requestParams)
          .then(res=>{
              resolve(res.data);
             }).
             catch(err=>{
                 console.log("err",err);
             })
        })
  
    }
    getUserStoryDetails() {
        return new Promise(async (resolve, reject) => {
            this.requestParams.url=`https://rally1.rallydev.com/slm/webservice/v2.0/hierarchicalrequirement/${this.userStory[0]}`;
            let response=await this.getApiResult();
            if("OperationResult" in response){
                console.log("inside if error userstory>>>>",response["OperationResult"]["Errors"]);
                resolve({"message":"No userstory available for this userstory ID","errors":response["OperationResult"]["Errors"]});
            }
            else{
                let revisionApiUrl=response["HierarchicalRequirement"]["RevisionHistory"]["_ref"]+"/Revisions";
            this.requestParams.url=revisionApiUrl;
            let revisionHistory=await this.getApiResult();
            let history=revisionHistory;
            if("OperationResult" in history){
                console.log("inside if error userstory>>>>",history["OperationResult"]["Errors"]);
                resolve({"message":"No Revision history  available for this userstory ID","errors":history["OperationResult"]["Errors"]});
            }
            else{
                let revisionHistoryList=history.QueryResult.Results;
                let updatedRevisionHistory=[];
                for (let index = 0; index < revisionHistoryList.length; index++) {
                    updatedRevisionHistory.push({
                        "creationDate":revisionHistoryList[index].CreationDate,
                        "revisionNumber":revisionHistoryList[index].RevisionNumber,
                        "description":revisionHistoryList[index].Description,
                        "revisionTriggeredBy":revisionHistoryList[index].User._refObjectName
                    });
                    
                }
               
                workInfo["userStory"]={
                    "userStoryId":this.userStory[0],
                    "scheduleState":response.HierarchicalRequirement.ScheduleState,
                    "acceptedDate":response.HierarchicalRequirement.AcceptedDate,
                    "creationDate": response.HierarchicalRequirement.CreationDate,
                    "planEstimate": response.HierarchicalRequirement.PlanEstimate,
                    "release": response.HierarchicalRequirement.Release,
                    "flowStateChangedDate": response.HierarchicalRequirement.FlowStateChangedDate,
                    "revisionHistory":{
                        "totalRevisionCount":history.QueryResult.TotalResultCount,
                        "revisions":updatedRevisionHistory
                    }
                }
                console.log('finall>>> updation',JSON.stringify(workInfo["userStory"]));
                resolve(true);

            }

            }

        });

    }
    getDefectDetails() {
        return new Promise(async (resolve, reject) => {
            this.requestParams.url=`https://rally1.rallydev.com/slm/webservice/v2.0/defect/${this.defect[0]}`;
            let defectResponse=await this.getApiResult();
            if("OperationResult" in defectResponse){
                console.log("inside if error defect>>>>",defectResponse["OperationResult"]["Errors"]);
                resolve({"message":"No Defect available for this Defect ID","errors":defectResponse["OperationResult"]["Errors"]});
            }else{
                let defectRevisionApiUrl=defectResponse["Defect"]["RevisionHistory"]["_ref"]+"/Revisions";
                this.requestParams.url=defectRevisionApiUrl;
                let defectRevisionResponse=await this.getApiResult();
                if ("OperationResult" in defectRevisionResponse) {
                    console.log("inside if error defect>>>>",defectRevisionResponse["OperationResult"]["Errors"]);
                resolve({"message":"No Revision history available for this Defect ID","errors":defectRevisionResponse["OperationResult"]["Errors"]});
                } else {
                    let revisionHistoryList=defectRevisionResponse.QueryResult.Results;
                    let updatedRevisionHistory=[];
                    for (let index = 0; index < revisionHistoryList.length; index++) {
                        updatedRevisionHistory.push({
                            "creationDate":revisionHistoryList[index].CreationDate,
                            "revisionNumber":revisionHistoryList[index].RevisionNumber,
                            "description":revisionHistoryList[index].Description,
                            "revisionTriggeredBy":revisionHistoryList[index].User._refObjectName
                        });
                        
                    }
                    workInfo["defects"]={
                        "defectId":this.defect[0],
                        "scheduleState":defectResponse.Defect.ScheduleState,
                        "acceptedDate":defectResponse.Defect.AcceptedDate,
                        "creationDate": defectResponse.Defect.CreationDate,
                        "planEstimate": defectResponse.Defect.PlanEstimate,
                        "release": defectResponse.Defect.Release,
                        "flowStateChangedDate": defectResponse.Defect.FlowStateChangedDate,
                        "revisionHistory":{
                            "totalRevisionCount":defectRevisionResponse.QueryResult.TotalResultCount,
                            "revisions":updatedRevisionHistory
                        }
                    }
                    console.log('finall>>> updation after defects',JSON.stringify(workInfo["defects"]));
                    resolve(true);
                }
                
            }
          

        });

    }
    getFeatureDetails() {
        return new Promise(async (resolve, reject) => {
    
            this.requestParams.url=`https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/${this.feature[0]}`;
            let featureResponse=await this.getApiResult();
            if("OperationResult" in featureResponse){
                console.log("inside if error feature>>>>",featureResponse["OperationResult"]["Errors"]);
                resolve({"message":"No Feature available for this Feature ID","errors":featureResponse["OperationResult"]["Errors"]});
            }
            else{
                let featureRevisionApiUrl=featureResponse["Feature"]["RevisionHistory"]["_ref"]+"/Revisions";
                this.requestParams.url=featureRevisionApiUrl;
                let featureRevisionResponse=await this.getApiResult();
                if ("OperationResult" in featureRevisionResponse) {
                    console.log("inside if>>>>",featureRevisionResponse["OperationResult"]["Errors"]);
                    resolve({"message":"No Revision history available for this Feature ID","errors":featureRevisionResponse["OperationResult"]["Errors"]});
                } else {
                    let revisionHistoryList=featureRevisionResponse.QueryResult.Results;
                let updatedRevisionHistory=[];
                for (let index = 0; index < revisionHistoryList.length; index++) {
                    updatedRevisionHistory.push({
                        "creationDate":revisionHistoryList[index].CreationDate,
                        "revisionNumber":revisionHistoryList[index].RevisionNumber,
                        "description":revisionHistoryList[index].Description,
                        "revisionTriggeredBy":revisionHistoryList[index].User._refObjectName
                    });
                    
                }
                workInfo["feature"]={
                    "featureId":this.feature[0],
                    "state":featureResponse.Feature["State"]["_refObjectName"],
                    "creationDate": featureResponse.Feature.CreationDate,
                    "percentDoneByStoryCount": featureResponse.Feature.PercentDoneByStoryCount,
                    "percentDoneByStoryPlanEstimate": featureResponse.Feature.PercentDoneByStoryPlanEstimate,
                    "release": featureResponse.Feature.Release,
                    "revisionHistory":{
                        "totalRevisionCount":featureRevisionResponse.QueryResult.TotalResultCount,
                        "revisions":updatedRevisionHistory
                    }
                }
                console.log('finall>>> updation after Feature',JSON.stringify(workInfo["feature"]));
                resolve(true);
                    
                }
                
            }
          
               
          
        });
    }

    main() {
        return new Promise(async (resolve, reject) => {
          
            let rels = this.releaseby.split("/");
            console.log('list of rels',rels);
            if(rels.indexOf("All") > -1 || rels.indexOf("ALL") > -1 || rels.indexOf("all") > -1) {
                let listOfApis = [
                    this.getUserStoryDetails(),
                    this.getDefectDetails(),
                    this.getFeatureDetails()
                ];
                let promiseAll = await Promise.all(listOfApis);
            }
            else 
            {
                for(let each of rels) {
                   if(each == "UserStory") {
                    await this.getUserStoryDetails();
                   }else if (each == "Defect") {
                    await this.getDefectDetails();

                   }else if (each == "Feature") {
                    await this.getFeatureDetails();
                   }
                }
                
            }
        })
    }
}

module.exports=RallyService;