import { CITIES_ARRAY } from ".";
import { sleep } from "../Helplers";
import { TableStatsType } from "../Types";
import CAMPDATA from "./CAMP.json";
import HELPLINEDATA from "./HELPLINE.json";
import TEAMDATA from "./TEAM.json";

export const TABLESTATSDEMO: TableStatsType[] = [];

for (let i in CITIES_ARRAY) {
    TABLESTATSDEMO.push({
        city: CITIES_ARRAY[i],
        camps: Math.floor(Math.random() * 10),
        awareness: Math.floor(Math.random() * 5),
        helpline: Math.floor(Math.random() * 20),
        donations: Math.floor(Math.random() * 25),
        activeVolunteer: Math.floor(Math.random() * 150),
    });
}

export const CAMP_DATA_DEMO = CAMPDATA;

export const getDemoVolunteerData = async (city?: string) => {
    if (!city) return TEAMDATA;
    // await sleep(300);
    return {
        code: 3000,
        data: TEAMDATA.data.filter((t) => t.BloodConnect_City === city),
    };
};

export const getDemoCampData = async (city?: string) => {
    if (!city) return CAMPDATA;
    // await sleep(300);
    return {
        code: 3000,
        data: CAMPDATA.data.filter((c) => c.BloodConnect_City === city),
    };
};

export const getDemoHelplineData = async (city?: string):Promise<any> => {
    await sleep(300);
    if (!city) return HELPLINEDATA;
    return {
        code: 3000,
        data: HELPLINEDATA.data.filter(
                //@ts-ignore
            (h) =>city !== "Consulting" ?  h.City_Region.display_value === city : !CITIES_ARRAY.includes(h.City_Region.display_value))
    };
};
