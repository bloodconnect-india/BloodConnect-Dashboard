import React, { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import Lottie from "react-lottie";
import "./App.css";
import HelplineChart from "./components/Chart/HelplineChart";
import DonationCharts from "./components/Chart/MonthlyDonation";
import MonthlyEventChart from "./components/Chart/MonthlyEventChart";
import HelplineComponent from "./components/Helpline";
import Search from "./components/Search/Search";
import StatTable from "./components/Table/StatTable";
import { fetchAllData } from "./services/index";
import { Event, Helpline, Team } from "./Types";

const App = () => {
    let BASE_URL =
        "https://app.zohocreator.in/deepak64/bloodconnect-india-donor-system";
    if (
        window.location.ancestorOrigins &&
        window.location.ancestorOrigins[0] &&
        !window.location.ancestorOrigins[0].includes("localhost")
    ) {
        if (window.location.ancestorOrigins[0].includes("bloodconnect"))
            BASE_URL = window.location.ancestorOrigins[0];
    }

    const [allEvents, setEvents] = useState<Event[] | undefined>();
    const [allHelplines, setHelplines] = useState<Helpline[] | undefined>();
    const [allVolunteer, setVolunteer] = useState<Team[] | undefined>();

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
        `${BASE_URL}/#Report:Camp_Awareness_Report?TypeOfEvent=Camp`
    );
    const [awarenessUrl, setawarenessUrl] = useState(
        `${BASE_URL}/#Report:Camp_Awareness_Report?TypeOfEvent=Awareness`
    );

    const filterData = () => {
        console.log("Filtering data", allEvents, allVolunteer);
        setLoading(true);
        let camps = 0,
            awareness = 0,
            donations = 0,
            volunteer = 0;
        let monthCamp = Array(12).fill(0);
        let monthAwareness = Array(12).fill(0);
        if (allEvents) {
            if (city === "All") {
                camps = allEvents.filter((e) => e.TypeOfEvent === "Camp")
                    .length;
                awareness = allEvents.filter(
                    (e) => e.TypeOfEvent === "Awareness"
                ).length;

                allEvents.map((e) => {
                    let mon = parseInt(e.Date_field.split("-")[1]);
                    let year = parseInt(e.Date_field.split("-")[2]);
                    if (year === new Date().getFullYear()) {
                        if (e.TypeOfEvent === "Camp") monthCamp[mon - 1] += 1;
                        else monthAwareness[mon - 1] += 1;
                    }
                    if(e.TypeOfEvent === "Camp")
                    donations +=
                        e["Post_Camp_ID.Number_of_Donation"] != null &&
                        e["Post_Camp_ID.Number_of_Donation"].length > 0
                            ? parseInt(e["Post_Camp_ID.Number_of_Donation"])
                            : 0;
                    return 0;
                });
            } else {
                let myCamps = allEvents.filter(
                    (e) =>
                        e.TypeOfEvent === "Camp" && e.BloodConnect_City === city
                );
                camps = myCamps.length;
                let myAwareness = allEvents.filter(
                    (e) =>
                        e.TypeOfEvent === "Awareness" &&
                        e.BloodConnect_City === city
                );
                awareness = myAwareness.length;

                // calcuating camp and awarness per month
                myCamps.map((e) => {
                    let mon = parseInt(e.Date_field.split("-")[1]);
                    let year = parseInt(e.Date_field.split("-")[2]);
                    donations +=
                        e["Post_Camp_ID.Number_of_Donation"] != null &&
                        e["Post_Camp_ID.Number_of_Donation"].length > 0
                            ? parseInt(e["Post_Camp_ID.Number_of_Donation"])
                            : 0;
                    if (year === new Date().getFullYear()) {
                        monthCamp[mon - 1] += 1;
                    }
                    return 0;
                });
                myAwareness.map((e) => {
                    let mon = parseInt(e.Date_field.split("-")[1]);
                    let year = parseInt(e.Date_field.split("-")[2]);
                    if (year === new Date().getFullYear()) {
                        monthAwareness[mon - 1] += 1;
                    }
                    return 0;
                });
            }
        }

        if (allVolunteer) {
            if (city === "All") volunteer = allVolunteer.length;
            else
                volunteer = allVolunteer.filter(
                    (v) => v.BloodConnect_City === city
                ).length;
            console.log("volunteer filter complete", volunteer);
        }

        setCamps(camps);
        setAV(volunteer);
        setDonations(donations);
        setAwareness(awareness);
        setmonthlyAwarenessData(monthAwareness);
        setmonthlyCampData(monthCamp);
        setLoading(false);
        return;
    };
    const loadData = async () => {
        const { events, helplines, activeVolunteers } = await fetchAllData();
        setEvents((e) => events);
        setHelplines((e) => helplines);
        setVolunteer((e) => activeVolunteers);
    };

    useEffect(() => {
        //loadAllData();
        if (!!allEvents && !!allVolunteer) filterData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city, allEvents, allVolunteer]);

    // only once
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                `${BASE_URL}/#Report:Camp_Awareness_Report?TypeOfEvent=Camp&BloodConnect_City=${city}`
            );
            setawarenessUrl(
                `${BASE_URL}/#Report:Camp_Awareness_Report?TypeOfEvent=Awareness&BloodConnect_City=${city}`
            );
        }
    }, [BASE_URL, city]);

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
                        className="stat-card"
                        onClick={() => {
                            window.open(aVUrl, "_blank");
                        }}>
                        
                        <div className="stat-icon-container">
                            <FiArrowUp size={34} color="#D20003" />
                        </div>
                        {!isLoading ? (
                            <div>
                                <p className="card-heading">
                                    Active Volunteer
                                </p>
                                <p className="stat">{aV}</p>
                            </div>
                        ) : (
                            <Loading loading={isLoading} />
                        )}
                    </div>
                </div>

                <div className="col-lg-3">
                    <div
                        className="stat-card "
                        onClick={() => {
                            window.open(campUrl, "_blank");
                        }}>
                        <div className="stat-icon-container">
                            <FiArrowUp size={34} color="#D20003" />
                        </div>
                        {!isLoading ? (
                            <div>
                                <p className="card-heading">
                                    Camps
                                </p>
                                <p className="stat">{camps}</p>
                            </div>
                        ) : (
                            <Loading loading={isLoading} />
                        )}
                    </div>
                </div>

                <div className="col-lg-3">
                    <div
                        className="stat-card "
                        onClick={() => {
                            window.open(awarenessUrl, "_blank");
                        }}>
                        <div className="stat-icon-container">
                            <FiArrowUp size={34} color="#D20003" />
                        </div>
                        {!isLoading ? (
                            <div>
                                <p className="card-heading">
                                    Awareness
                                </p>
                                <p className="stat">{awareness}</p>
                            </div>
                        ) : (
                            <Loading loading={isLoading} />
                        )}
                    </div>
                </div>

                <div className="col-lg-3">
                    <div className="stat-card ">
                        <div className="stat-icon-container">
                            <FiArrowUp size={34} color="#D20003" />
                        </div>
                        {!isLoading ? (
                            <div>
                                <p className="card-heading">
                                    Donations
                                </p>
                                <p className="stat">{donations}</p>
                            </div>
                        ) : (
                            <Loading loading={isLoading} />
                        )}
                    </div>
                </div>
            </div>

             <HelplineComponent helplines={allHelplines} searchedCity={city} /> 
            <StatTable events={allEvents} allHelplines={allHelplines} av={allVolunteer} />
            <DonationCharts
                camps={allEvents?.filter((e) => e.TypeOfEvent === "Camp")}
                selectedCity={city}
            />
            <HelplineChart helplines={allHelplines} selectedCity={city} />
            <MonthlyEventChart
                camp={monthlyCampData}
                awareness={monthlyAwarenessData}
            />
            
        </div>
    );
};

export const Loading = ({ loading }) => {
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
                isStopped={!loading}
            />
        </div>
    );
};
export default App;
