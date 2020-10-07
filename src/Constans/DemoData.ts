import { CITIES_ARRAY } from ".";
import { TableStatsType } from "../Types";

export const TABLESTATSDEMO:TableStatsType[] = []

for(let i in CITIES_ARRAY) {
        TABLESTATSDEMO.push({
                city:CITIES_ARRAY[i],
                camps: Math.floor(Math.random()*10 ),
                awareness: Math.floor(Math.random()*5),
                helpline: Math.floor(Math.random()*20),
                donations:Math.floor(Math.random()*25),
                activeVolunteer:Math.floor(Math.random()*150)
        })
}