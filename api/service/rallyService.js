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
            let revisionApiUrl=response["HierarchicalRequirement"]["RevisionHistory"]["_ref"]+"/Revisions";

            this.requestParams.url=revisionApiUrl;
            let revisionHistory=await this.getApiResult();
            let history=revisionHistory;
            if(history.QueryResult["Errors"].length>0){
               
                 workInfo["userStory"]={
                "userStoryId":this.userStory[0],
                "scheduleState":response.HierarchicalRequirement.ScheduleState,
                "acceptedDate":response.HierarchicalRequirement.AcceptedDate,
                "creationDate": response.HierarchicalRequirement.CreationDate,
                "planEstimate": response.HierarchicalRequirement.PlanEstimate,
                "flowStateChangedDate": response.HierarchicalRequirement.FlowStateChangedDate,
                "revisionHistory":{
                    "Description":"No Revision history available for given User story ID"
                }
            }
                console.log('work info model after updation',workInfo["userStory"]);
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
                    "flowStateChangedDate": response.HierarchicalRequirement.FlowStateChangedDate,
                    "revisionHistory":{
                        "totalRevisionCount":history.QueryResult.TotalResultCount,
                        "revisions":updatedRevisionHistory
                    }
                }
                console.log('finall>>> updation',JSON.stringify(workInfo["userStory"]));
                resolve(true);
            }
        
        });

    }
    getDefectDetails() {
        return new Promise(async (resolve, reject) => {
            this.requestParams.url=`https://rally1.rallydev.com/slm/webservice/v2.0/defect/${this.defect[0]}`;
            let defectResponse=await this.getApiResult();
            if(defectResponse.Defect["Errors"].length>0){
                console.log('No defects available for this Defect ID');
                resolve({"message":"No defects available for this Defect ID"})
            }else{
                let defectRevisionApiUrl=defectResponse["Defect"]["RevisionHistory"]["_ref"]+"/Revisions";
                this.requestParams.url=defectRevisionApiUrl;
                let defectRevisionResponse=await this.getApiResult();
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
                    "flowStateChangedDate": defectResponse.Defect.FlowStateChangedDate,
                    "revisionHistory":{
                        "totalRevisionCount":defectRevisionResponse.QueryResult.TotalResultCount,
                        "revisions":updatedRevisionHistory
                    }
                }
                console.log('finall>>> updation after defects',JSON.stringify(workInfo["defects"]));
                resolve(true);
                
            }
          

        });

    }
    getFeatureDetails() {
        return new Promise(async (resolve, reject) => {
            let USId = this.userStory[0]; //423904935864  
            let apiUrl = `https://rally1.rallydev.com/slm/webservice/v2.0/hierarchicalrequirement/${USId}`;
            let userDetails = await getApiResponse(apiUrl);
            if(!!userDetails) {
                if (userDetails.HierarchicalRequirement.Feature == null) {
                    resolve({
                        "Status" : "false",
                        "Description"  : "No feature Id is associated with this User story"
                    });
                }else {
                    this.requestParams.url=`https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/${this.feature[0]}`;
                    let featureResponse=await this.getApiResult();
                    console.log('feature response',featureResponse);
                    
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