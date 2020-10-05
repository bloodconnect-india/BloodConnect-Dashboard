export  interface OverallStat {
    city: string;
    stat : { 
        camps: number;
        awareness: number;
        donations: number;
        monthwiseData: number[];
        activeVolunteer: number
    }
}