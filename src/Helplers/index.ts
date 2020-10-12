import { MONTH_END } from "../Constants";

export const sleep = (ms:number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// inputs 
// Jan - Dec - [1 - 12] 0 - All Months
// year = 0 means all years
export const getDateRange = (month:number,year: number):number []=> {

    // start and end date for filter 
    let startDate: Array<string> = [],
        endDate: Array<string> = [];
    startDate[0] = "01";

    // selecting all years
    if (year === 0) {
        startDate[2] = "2000";
        endDate[2] = "2099";
    }else {
      startDate[2] = year.toString();
      endDate[2] = year.toString();
    }
    // selecting all month
    if (month === 0) {
        startDate[1] = "01";
        endDate[1] = "12";
        endDate[0] = "31"
    } else {
      let mon = month > 9 ? month.toString() : "0"+month.toString()
      startDate[1] = mon
      endDate[1] = mon
      endDate[0] = MONTH_END[month-1].toString();
    }
    let sdTimestamp = new Date(startDate.reverse().join("-")).getTime()
    let edTimestamp = new Date(endDate.reverse().join("-")).getTime()
    return [sdTimestamp,edTimestamp]
}