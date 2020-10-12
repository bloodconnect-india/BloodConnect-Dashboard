/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import Lottie from "react-lottie";
import { CITIES_ARRAY, CITY_HELPLINE_CITIES } from "../../Constants";
import { Helpline } from "../../Types";

interface Props {
    searchedCity: string;
    helplines: Helpline[] | undefined;
}

const HelplineComponent = ({ searchedCity, helplines }: Props) => {
    const [city, setCity] = useState<string>("All");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [totalHelpline, setTotal] = useState(0);
    const [openHelpline, setOpen] = useState(0);
    const [closedHelpline, setClosed] = useState(0);
    const [helplineDonations, setDonations] = useState(0);

    const filterData = () => {
        if (!helplines) return;
        let total = 0,
            open = 0,
            closed = 0,
            donations = 0;
        helplines.map((e) => {
            let currCity = e.City_Region.display_value;
            if(city === "Consulting") {
                if(!CITY_HELPLINE_CITIES["Delhi NCR"].includes(currCity) && !CITY_HELPLINE_CITIES.Odisha.includes(currCity) && !CITIES_ARRAY.includes(currCity)){
                if (e.Status === "Open") open += 1;
                else if (e.Status === "Closed"){
                     closed += 1;
                     if(e["Helpline_Handler.Donor_Count"]  && e["Helpline_Handler.Donor_Count"].length > 0)
                     donations += parseInt(e["Helpline_Handler.Donor_Count"])
                }
                total += 1;
            }
            }
            else if (city === "All" || CITY_HELPLINE_CITIES[city].includes(currCity)) {
                if (e.Status === "Open") open += 1;
                else if (e.Status === "Closed"){
                     closed += 1;
                     if(e["Helpline_Handler.Donor_Count"]  && e["Helpline_Handler.Donor_Count"].length > 0)
                     donations += parseInt(e["Helpline_Handler.Donor_Count"])
                }
                total += 1;
                
            }
            return 0;
        });

        setOpen(open);
        setClosed(closed);
        setTotal(total);
        setDonations(donations)
        setLoading(false);
    };

    // function to fecth helpline stats
    useEffect(() => {
        console.log("City changed", searchedCity);
        if (searchedCity !== city) setCity(searchedCity);
    }, [searchedCity]);

    useEffect(() => {
        setLoading(true);
        if (helplines) filterData();
        // fetchData();
    }, [city, helplines]);

    const Loading = () => {
        return (
            <div>
                <Lottie
                    options={{
                        animationData: require("../../assets/animation/dot.json"),
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
        <div className="container mx-0 px-0">
            <div className="row ">
                <div className="col-lg-3">
                    <div className="stat-card ">
                        <div className="stat-icon-container">
                            <FiArrowUp size={34} color="#D20003" />
                        </div>
                        {!isLoading ? (
                            <div>
                                <p className="card-heading">
                                   Total Requests
                                </p>
                                <p className="stat">{totalHelpline}</p>
                            </div>
                        ) : (
                            <Loading />
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
                                   Open
                                </p>
                                <p className="stat">{openHelpline}</p>
                            </div>
                        ) : (
                            <Loading />
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
                                   Closed
                                </p>
                                <p className="stat">{closedHelpline}</p>
                            </div>
                        ) : (
                            <Loading />
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
                                <p className="stat">{helplineDonations}</p>
                            </div>
                        ) : (
                            <Loading />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelplineComponent;
