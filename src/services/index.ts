import { __IS_DEV__ } from "../Constants";
import {
    getDemoCampData,
    getDemoHelplineData, getDemoVolunteerData
} from "../Constants/DemoData";
import {
    CreatorResponse,

    Event,

    Helpline, Team
} from "../Types";

declare global {
    interface Window {
        ZOHO: any;
    }
}

const CREATOR = window.ZOHO.CREATOR;

export const get = () => {
    CREATOR.init()
        .then((d) => {
            let config = {
                reportName: "BloodConnect_Team_Report",
                page: "1",
                pageSize: "200",
            };

            //get all records API
            CREATOR.API.getAllRecords(config).then(function (response) {
                //callback block
            });
        })
        .catch((e) => {
            console.log(e);
        });
};

const getVolunteer = (
    page: number,
    city: string
): Promise<CreatorResponse<Team>> => {
    let criteria = '(Status=="Active")';
    if (city !== "All") {
        criteria = `(Status=="Active" && BloodConnect_City=="${city}")`;
    }
    console.log(__IS_DEV__)
    if (__IS_DEV__) {
        console.log("Heya")
        if (city !== "All") return getDemoVolunteerData(city);
        return getDemoVolunteerData();
    }

    let config = {
        reportName: "BloodConnect_Team_Report",
        criteria,
        page: page.toString(),
        pageSize: "200",
    };
    return CREATOR.API.getAllRecords(config);
};

const getEvent = (
    page: number,
    city: string
): Promise<CreatorResponse<Event>> => {
    let criteria = "";
    if (city !== "All") {
        criteria = `(BloodConnect_City=="${city}")`;
    }

    if (__IS_DEV__) {
        if (city !== "All") return getDemoCampData(city);
        return getDemoCampData();
    }
    let config = {
        reportName: "Camp_Awareness_Report",
        criteria,
        page: page.toString(),
        pageSize: "200",
    };
    return CREATOR.API.getAllRecords(config);
};


const getHelplines = (
    page: number,
    city: string
): Promise<CreatorResponse<Helpline>> => {
    let criteria = "";
    if (city !== "All" && city !== "Consulting") {
        criteria = `(City_Region==${city})`;
    }

    if (__IS_DEV__) {
        if (city !== "All") return getDemoHelplineData(city);
        return getDemoHelplineData();
    }

    let config = {
        reportName: "Helpline_Report",
        criteria,
        page: page.toString(),
        pageSize: "200",
    };
    return CREATOR.API.getAllRecords(config);
};

// fetching all data at once to make the api calls less
export const fetchAllData = async (): Promise<{
    events: Event[]| undefined;
    activeVolunteers: Team[] | undefined;
    helplines: Helpline[] | undefined;
}> => {
    if(!__IS_DEV__)
        await CREATOR.init()

    let events: Event[] | undefined = [];
    let activeVolunteers: Team[] | undefined = [];
    let helplines: Helpline[] | undefined = [];
    let len = 0;
    let page = 1;
    try {
        let { data } = await getEvent(page++, "All");
        events.push(...data);
        len = data.length;

        while (len === 200) {
            let { data: data1 } = await getEvent(page++, "All");
            events.push(...data1);
            len = data1.length;
        }
    } catch (e) {
        console.log("Error in event fetching",e);
    }
    // getting volunteer data
    page = 1;
    len = 0;
    try {
        let { data: av } = await getVolunteer(page++, "All");
        len = av.length;
        activeVolunteers.push(...av);
        while (len === 200) {
            let { data: av1 } = await getVolunteer(page++, "All");
            len = av1.length;
            activeVolunteers.push(...av1);
        }
    } catch (e) {
        console.log("Error in volunteer fetching");
    }
    // helplines
    page = 1;
    len = 0;
    try {
        let { data: hlp } = await getHelplines(page++, "All");
        len = hlp.length;
        helplines.push(...hlp);

        while (len === 200) {
            let { data: hlp1 } = await getHelplines(page++, "All");
            len = hlp1.length;
            helplines.push(...hlp1);
        }
    } catch (e) {
        console.log("Error in helpline fetching");
    }

    console.log("Helplines are ",helplines)
    return {
        events: events,
        activeVolunteers: activeVolunteers,
        helplines: helplines,
    };
};
