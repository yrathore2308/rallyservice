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
            console.log('updated params',this.requestParams);
            let response=await this.getApiResult();
            console.log('user hierrachy response',response);
            let revisionApiUrl=response["HierarchicalRequirement"]["RevisionHistory"]["_ref"]+"/Revisions";
            console.log('revision history url',revisionApiUrl);

            this.requestParams.url=revisionApiUrl;
            console.log('updated params>>>>',this.requestParams);
            
            let revisionHistory=await this.getApiResult();
            console.log('revision history',JSON.stringify(revisionHistory.QueryResult.Results));
            let history=revisionHistory;
            if(history.QueryResult["Errors"].length>0){
               
                 workInfo["userStory"]={
                "userstoryid":this.userStory[0],
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
                        "CreationDate":revisionHistoryList[index].CreationDate,
                        "RevisionNumber":revisionHistoryList[index].RevisionNumber,
                        "Description":revisionHistoryList[index].Description,
                        "RevisionTriggeredBy":revisionHistoryList[index].User._refObjectName
                    });
                    
                }
               
                workInfo["userStory"]={
                    "userstoryid":this.userStory[0],
                    "scheduleState":response.HierarchicalRequirement.ScheduleState,
                    "acceptedDate":response.HierarchicalRequirement.AcceptedDate,
                    "creationDate": response.HierarchicalRequirement.CreationDate,
                    "planEstimate": response.HierarchicalRequirement.PlanEstimate,
                    "flowStateChangedDate": response.HierarchicalRequirement.FlowStateChangedDate,
                    "revisionHistory":{
                        "TotalRevisionCount":history.QueryResult.TotalResultCount,
                        "Revisions":updatedRevisionHistory
                    }
                }
                console.log('finall>>> updation',JSON.stringify(workInfo["userStory"]));

            }
        
        });

    }
    getDefectDetails() {
        return new Promise(async (resolve, reject) => {

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