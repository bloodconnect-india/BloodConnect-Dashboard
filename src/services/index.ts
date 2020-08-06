declare global {
    interface Window {
        ZOHO: any
    }
}
export const get = ()  => {
    const CREATOR = window.ZOHO.CREATOR

    CREATOR.init().then((d) => {
        let config = {
            reportName : "BloodConnect_Team_Report",
            page : "1",
            pageSize : "200"
        }
        
        //get all records API
        CREATOR.API.getAllRecords(config).then(function(response){
            //callback block
            console.log(response)
        });
    }).catch(e => {
        console.log(e)
    })
}