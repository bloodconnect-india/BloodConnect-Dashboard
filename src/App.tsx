import React, { useState, useEffect } from "react";
import { FiUser, FiCalendar, FiUsers } from "react-icons/fi";
import "./App.css";
import Search from "./components/Search/Search";
//import { useQuery } from '@apollo/client';
//import { STATS_QUERY, ALL_STAT } from './query';
import { fetchVolunteer, fetchCamps, fecthHelplines } from "./services/index";
import Lottie from "react-lottie";
import MonthlyChart from "./components/Chart/MonthlyChart";
// import { OverallStat } from './components/schema';
import MonthlyEventChart from "./components/Chart/MonthlyEventChart";
import CampDonationChart from "./components/Chart/CampDonationChart";
import HelplineComponent from "./components/Helpline";

interface Citystat {
  [key: string]: number;
}
interface MonthStat {
  city: string;
  donations: number;
  label: string;
  date: string;
}
const App = () => {
  let BASE_URL =
    "https://app.zohocreator.in/deepak64/bloodconnect-india-donor-system";
  if (
    window.location.ancestorOrigins &&
    !window.location.ancestorOrigins[0].includes("localhost")
  ) {
    console.log('origin url is',window.location.ancestorOrigins);
    if(window.location.ancestorOrigins[0].includes("bloodconnect"))
      BASE_URL = window.location.ancestorOrigins[0];
  }

  const [city, setCity] = useState("All");
  const [isLoading, setLoading] = useState(true);
  const [isMonthStat, showMonthStat] = useState(false);
  const [monthStat, setMonthStat] = useState<MonthStat[]>([]);
  const [aV, setAV] = useState(-1);
  const [camps, setCamps] = useState(-1);
  const [awareness, setAwareness] = useState(-1);
  const [donations, setDonations] = useState(-1);

  // Monthly Datas
  // Donations data
  const [monthlyData, setmonthlyData] = useState(Array(12).fill(0));
  // Camp data
  const [monthlyCampData, setmonthlyCampData] = useState(Array(12).fill(0));
  const [monthCampDetail, setMonthCampDetail] = useState<any>();
  // Awareness data
  const [monthlyAwarenessData, setmonthlyAwarenessData] = useState(
    Array(12).fill(0)
  );
  const [aVUrl, setaVUrl] = useState(
    `${BASE_URL}/#Report:BloodConnect_Team_Report?Status=Active`
  );
  const [campUrl, setcampUrl] = useState(
    `${BASE_URL}/#Report:Camp_Awareness_Report?TypeOfEvent=Camp&Date_field_op=52`
  );
  const [awarenessUrl, setawarenessUrl] = useState(
    `${BASE_URL}/#Report:Camp_Awareness_Report?TypeOfEvent=Awareness&Date_field_op=52`
  );

  const loadAV = async () => {
    const av = await fetchVolunteer(city);
    setAV(av);
  };
  const loadCamps = async () => {
    const {
      camps,
      awareness,
      monthCampData,
      monthAwarnessData,
      donations,
      monthDetail,
      monthDonation,
    } = await fetchCamps(city);

    setMonthCampDetail(monthDetail);
    setCamps(camps);
    setAwareness(awareness);
    setDonations(donations);
    setmonthlyCampData(monthCampData);
    setmonthlyAwarenessData(monthAwarnessData);
    setmonthlyData(monthDonation);
    
  };

  const loadAllData = () => {
    loadAV().then(() => {
      loadCamps().then(() => {
        setLoading(false);
      });
    });
  };
  useEffect(() => {
    loadAllData();
  }, [city]);

  // useEffect(() => {
  //     loadCityStat()
  // }, [])
  const setSearch = (c: string): void => {
    if (c !== city) {
      setLoading(true);
      setCity(c);
    }
  };

  const setMonth = (i: number): void => {
    if (monthCampDetail && monthCampDetail[i]) setMonthStat(monthCampDetail[i]);
    else
      setMonthCampDetail([{ city: "null", date: "12-07-2012", donations: 20 }]);
    showMonthStat(true);
  };

  const hideMonthStat = (): void => {
    showMonthStat(false);
  };
  useEffect(() => {
    if (city !== "All") {
      setaVUrl(
        `${BASE_URL}/#Report:BloodConnect_Team_Report?Status=Active&BloodConnect_City=${city}`
      );
      setcampUrl(
        `${BASE_URL}/#Report:Camp_Awareness_Report?TypeOfEvent=Camp&BloodConnect_City=${city}&Date_field_op=52`
      );
      setawarenessUrl(
        `${BASE_URL}/#Report:Camp_Awareness_Report?TypeOfEvent=Awareness&BloodConnect_City=${city}&Date_field_op=52`
      );
    }
  }, [BASE_URL, city]);

  const Loading = () => {
    return (
      <div>
        <Lottie
          options={{
            animationData: require("./assets/animation/dot.json"),
            loop: true,
            autoplay: true,
          }}
          height={100}
          width={100}
          isStopped={!isLoading}
        />
      </div>
    );
  };
  return (
    <div className="container">
      <div className="row justify-content-between ">
        <h4 className="stat col-lg-4 col-sm-12  mt-2 d-flex align-items-center justify-content-center">
          {city === "All" ? "BloodConnect" : city}
        </h4>
        <Search handleChange={setSearch} />
      </div>
      <div className="row">
        <div className="col-lg-3">
          <div
            className="stat-card "
            onClick={() => {
              window.open(aVUrl, "_blank");
            }}
          >
            {!isLoading ? (
              <div>
                <p className="card-heading"> Active Volunteer</p>
                <p className="display-4">{aV}</p>
              </div>
            ) : (
              <Loading />
            )}
            <div className="stat-icon-container">
              <FiUser size={34} />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div
            className="stat-card "
            onClick={() => {
              window.open(campUrl, "_blank");
            }}
          >
            {!isLoading ? (
              <div>
                <p className="card-heading"> Camps</p>
                <p className="display-4">{camps}</p>
              </div>
            ) : (
              <Loading />
            )}
            <div className="stat-icon-container">
              <FiCalendar size={34} />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div
            className="stat-card "
            onClick={() => {
              window.open(awarenessUrl, "_blank");
            }}
          >
            {!isLoading ? (
              <div>
                <p className="card-heading"> Awareness</p>
                <p className="display-4">{awareness}</p>
              </div>
            ) : (
              <Loading />
            )}
            <div className="stat-icon-container">
              <FiCalendar size={34} />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="stat-card ">
            {!isLoading ? (
              <div>
                <p className="card-heading"> Toatal Donation </p>
                <p className="display-4">{donations}</p>
              </div>
            ) : (
              <Loading />
            )}
            <div className="stat-icon-container">
              <FiUsers size={34} />
            </div>
          </div>
        </div>
      </div>

      <HelplineComponent searchedCity={city} />
      {isMonthStat ? (
        <CampDonationChart
          data={monthStat}
          loading={isMonthStat}
          back={hideMonthStat}
        />
      ) : (
        <MonthlyChart
          data={monthlyData}
          loading={isLoading}
          handleClick={setMonth}
        />
      )}
      <MonthlyEventChart
        camp={monthlyCampData}
        awareness={monthlyAwarenessData}
      />
    </div>
  );
};

export default App;
