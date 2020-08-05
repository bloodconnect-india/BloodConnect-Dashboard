import { gql } from '@apollo/client'
export const STATS_QUERY = gql`
query getStats($city:String) {
    stats(city:$city){
        camps,
        awareness,
        activeVolunteer,
        donations,
        monthwiseDonation
    }
}

`

export const ALL_STAT = gql`
    query getStat {
        overallStat{
            city,
            stat{
                camps,
                awareness,
                activeVolunteer,
                donations,
                monthwiseDonation,
                monthAwarnessData,
                monthCampData
            }
        }
    }
`