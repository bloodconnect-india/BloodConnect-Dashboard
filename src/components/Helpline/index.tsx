/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import Lottie from "react-lottie";
import { CITIES_ARRAY } from "../../Constants";

interface Props {
    searchedCity: string;
    newHelplines: any | undefined;
}

const HelplineComponent = ({ searchedCity , newHelplines }: Props) => {
    const [city, setCity] = useState<string>("All");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [totalHelpline, setTotal] = useState(0);
    const [openHelpline, setOpen] = useState(0);
    const [closedHelpline, setClosed] = useState(0);
    const [helplineDonations, setDonations] = useState(0);

    const filterData = () => {
        if(!newHelplines) return;
        let total = 0,
            open = 0,
            closed = 0,
            donations = 0;

        if(city !== "All") {
            open = newHelplines[city].open;
            closed = newHelplines[city].closed;
            total = newHelplines[city].total;
            for(let year in newHelplines[city].detail) {
                // eslint-disable-next-line no-loop-func
                newHelplines[city].detail[year].map((h:any) => {
                    if(h.donations) {
                        donations += parseInt(h.donations)
                    }
                    return 0;
                })
            }
        } else {
            for(let i in CITIES_ARRAY) {
                let currCity = CITIES_ARRAY[i];
                
                open += parseInt(newHelplines[currCity].open);
                closed += parseInt(newHelplines[currCity].closed);
                total += parseInt(newHelplines[currCity].total); 
                for(let year in newHelplines[currCity].detail) {
                // eslint-disable-next-line no-loop-func
                newHelplines[currCity].detail[year].map((h:any) => {
                    if(h.donations) {
                        donations += parseInt(h.donations)
                    }
                    return 0;
                })
            }
            }
        }


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
        if (newHelplines) filterData();
        // fetchData();
    }, [city, newHelplines]);

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
