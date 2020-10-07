import React, { useEffect, useState } from "react";
import { FiCalendar, FiUser, FiUsers } from "react-icons/fi";
import Lottie from "react-lottie";
import "./App.css";
import DonationCharts from "./components/Chart/MonthlyDonation";
import MonthlyEventChart from "./components/Chart/MonthlyEventChart";
import HelplineComponent from "./components/Helpline";
import Search from "./components/Search/Search";
import { fetchCamps, fetchVolunteer } from "./services/index";

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
  const [aV, setAV] = useState(-1);
  const [camps, setCamps] = useState(-1);
  const [awareness, setAwareness] = useState(-1);
  const [donations, setDonations] = useState(-1);

  // Monthly Datas
  // Donations data
  // Camp data
  const [monthlyCampData, setmonthlyCampData] = useState(Array(12).fill(0));
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
    } = await fetchCamps(city);

    setCamps(camps);
    setAwareness(awareness);
    setDonations(donations);
    setmonthlyCampData(monthCampData);
    setmonthlyAwarenessData(monthAwarnessData);
    
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
      <DonationCharts selectedCity={city} />
      <MonthlyEventChart
        camp={monthlyCampData}
        awareness={monthlyAwarenessData}
      />
    </div>
  );
};

export default App;
