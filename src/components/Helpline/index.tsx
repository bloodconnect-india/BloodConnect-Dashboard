import React, { useEffect, useState } from "react";
import { FiCalendar, FiUser, FiUsers } from "react-icons/fi";
import Lottie from "react-lottie";
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
    const [handlingHelpline, setHandling] = useState(0);

    const filterData = () => {
        if (!helplines) return;
        let total = 0,
            open = 0,
            closed = 0,
            handling = 0;
        helplines.map((e) => {
            if (city === "All" || e.City_Region.display_value === city) {
                if (e.Status === "Open") open += 1;
                else if (e.Status === "Closed") closed += 1;
                else if (e.Status === "Handling") handling += 1;
                total += 1;
            }
        });

        setOpen(open);
        setClosed(closed);
        setHandling(handling);
        setTotal(total);
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
        <div className="container">
            <div className="row">
                <div className="col-lg-3">
                    <div className="stat-card ">
                        {!isLoading ? (
                            <div>
                                <p className="card-heading"> Total Requests</p>
                                <p className="display-4">{totalHelpline}</p>
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
                    <div className="stat-card ">
                        {!isLoading ? (
                            <div>
                                <p className="card-heading"> Open</p>
                                <p className="display-4">{openHelpline}</p>
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
                                <p className="card-heading"> Closed</p>
                                <p className="display-4">{closedHelpline}</p>
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
                        {true ? (
                            <div>
                                <p className="card-heading"> Handling </p>
                                <p className="display-4">{handlingHelpline}</p>
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
        </div>
    );
};

export default HelplineComponent;
