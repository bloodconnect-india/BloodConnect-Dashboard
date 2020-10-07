declare global {
  interface Window {
    ZOHO: any;
  }
}

interface overall {
  city: string;
  donations: number;
}
interface API<Data> {
  code: number;
  data: Data[];
}
interface PostCamp {
  Number_of_Donation: any;
  Camp_Awareness: {
    display_value: string;
  };
}

interface MonthData {
    city: string;
    date: string;
    donations: number;
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
        console.log(response);
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

const getVolunteer = (page: number, city: string) => {
  let criteria = '(Status=="Active")';
  if (city !== "All") {
    criteria = `(Status=="Active" && BloodConnect_City=="${city}")`;
  }

  let config = {
    reportName: "BloodConnect_Team_Report",
    criteria,
    page: page.toString(),
    pageSize: "200",
  };
  return CREATOR.API.getAllRecords(config);
};

const getEvent = (page: number, city: string) => {
  let criteria = "";
  if (city !== "All") {
    criteria = `(BloodConnect_City=="${city}")`;
  }

  let config = {
    reportName: "Camp_Awareness_Report",
    criteria,
    page: page.toString(),
    pageSize: "200",
  };
  return CREATOR.API.getAllRecords(config);
};

const getCity = (city: string) => {
  let config = {
    reportName: "Vlookup_Report",
    criteria: `City=="${city}"`,
    page: 1,
    pageSize: "1",
  };
  return CREATOR.API.getAllRecords(config);
};

const getHelplines = (page: number, city: string) => {
  let criteria = "";
  if (city !== "All") {
    criteria = `(City_Region==${city})`;
  }

  let config = {
    reportName: "Helpline_Report",
    criteria,
    page: page.toString(),
    pageSize: "200",
  };
  return CREATOR.API.getAllRecords(config);
};

const getPostCamp = (page: number, city: string): Promise<API<PostCamp>> => {
  let criteria = "";
  if (city !== "All") {
    criteria = `(BloodConnect_City=="${city}")`;
  }
  let config = {
    reportName: "Post_Camp_Form_Report",
    criteria: criteria,
    page: page.toString(),
    pageSize: "200",
  };
  return CREATOR.API.getAllRecords(config);
  // return new Promise((resolve, reject) => {
  //     let response = CREATOR.API.getAllRecords(config)
  //     if (response)
  //         resolve(response)
  //     else
  //         reject({ code: 500, data: []})
  // })
};
export const fetchVolunteer = async (city: string) => {
  await CREATOR.init();
  let page = 1;
  let { data } = await getVolunteer(page++, city);
  let l = data.length;
  let total = l;
  while (l === 200) {
    let { data } = await getVolunteer(page++, city);
    l = data.length;
    total = total + l;
  }
  return total;
};

export const fetchCamps = async (city: string) => {
  await CREATOR.init()
  let monthCampData = Array(12).fill(0);
  let monthAwarnessData = Array(12).fill(0);
  let monthDonation = Array(12).fill(0);
  let monthDetail = Array(12)
    .fill(0)
    .map((x) => [{}]);
  let donations = 0;
  let page = 1;
  let { data } = await getEvent(page++, city);
  let l = data.length;
  let camps = data.filter((d) => d.TypeOfEvent === "Camp");
  let awareness = data.filter((d) => d.TypeOfEvent !== "Camp");
  let totalCamps = 0;
  let totalAwareness = 0;
  camps.forEach((c) => {
    let date = c.Date_field;
    let [_, mon, year] = date.split("-");
    if (parseInt(year) === new Date().getFullYear()) {
      monthCampData[parseInt(mon) - 1] = monthCampData[parseInt(mon) - 1] + 1;
      if (c["Post_Camp_ID.Number_of_Donation"]) {
        monthDonation[parseInt(mon) - 1] =
          monthDonation[parseInt(mon) - 1] +
          parseInt(c["Post_Camp_ID.Number_of_Donation"]);
        donations = donations + parseInt(c["Post_Camp_ID.Number_of_Donation"]);
      }
      monthDetail[parseInt(mon) - 1].push({
        city: c.BloodConnect_City,
        date,
        donations: c["Post_Camp_ID.Number_of_Donation"]
          ? c["Post_Camp_ID.Number_of_Donation"]
          : 0,
      });
      totalCamps++;
    }
  });
  awareness.forEach((c) => {
    let date = c.Date_field;
    let [_, mon, year] = date.split("-");
    if (parseInt(year) === new Date().getFullYear()) {
      monthAwarnessData[parseInt(mon) - 1] =
        monthAwarnessData[parseInt(mon) - 1] + 1;
      totalAwareness++;
    }
  });

  console.log(totalCamps, totalAwareness);
  return {
    camps: totalCamps,
    awareness: totalAwareness,
    monthCampData,
    monthAwarnessData,
    monthDonation,
    monthDetail,
    donations,
  };
};

export const fetchPostCamp = async (city: string) => {
  let monthData = Array(12).fill(0);
  let donation = 0;
  let d = await getPostCamp(0, city).then(
    (res) => {
      res.data.forEach((postCamp) => {
        let date = postCamp.Camp_Awareness.display_value.split("_").pop();
        if (!date) return;
        let [_, mon, year] = date.split("-");
        if (parseInt(year) === new Date().getFullYear()) {
          monthData[parseInt(mon) - 1] =
            monthData[parseInt(mon) - 1] +
            parseInt(postCamp.Number_of_Donation);
          donation = donation + parseInt(postCamp.Number_of_Donation);
        }
      });
    },
    (error) => {
      console.log("error", error, city);
      donation = 0;
    }
  );

  return { totalDonation: donation, monthData };
};

export const fecthHelplines = async (city: string) => {
  await CREATOR.init();
  if (city !== "All") {
    let res = await getCity(city);
    city = res.data[0].ID;
  }
  let page = 1;
  let returnData = {
    open: 0,
    closed: 0,
  };
  let { data }: { data: any[] } = await getHelplines(page++, city);
  console.log(data);
  let l = data.length;
  returnData.open += data.filter((d) => d.Status === "Open").length;
  returnData.closed += data.filter((d) => d.Status === "Closed").length;
  let total = l;
  while (l === 200) {
    let { data } = await getHelplines(page++, city);
    returnData.open += data.filter((d) => d.Status === "Open").length;
    returnData.closed += data.filter((d) => d.Status === "Closed").length;
    l = data.length;
    total += l;
  }
  return {
    ...returnData,
    total: total,
  };
};
