import React, { useEffect, useState } from "react";
import { FiUser, FiCalendar, FiUsers } from "react-icons/fi";
import Lottie from "react-lottie";
import { fecthHelplines } from "../../services";

interface Props {
  searchedCity: string;
}

const HelplineComponent = ({ searchedCity }: Props) => {
  const [city, setCity] = useState<string>("All");
  const [isLoading, setLoading] = useState<boolean>(true);
  const [helpline, setHelpline] = useState(0);
  const [openHelpline, setOpen] = useState(0);
  const [closedHelpline, setClosed] = useState(0);

  // function to fecth helpline stats
  const fetchData = async () => {
    const { total, open, closed } = await fecthHelplines(city);
    console.log("Fetched helpline data");
    setHelpline((s) => total);
    setClosed((s) => closed);
    setOpen((s) => open);
    setLoading(false);
    console.log(total, open, closed);
  };

  // changing city only if new city is selected
  useEffect(() => {
    console.log("City changed", searchedCity);
    if (searchedCity !== city) setCity(searchedCity);
  }, [searchedCity]);

  useEffect(() => {
    setLoading(true)
    fetchData();
  }, [city]);

 

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
            {!isLoading || helpline > 0 ? (
              <div>
                <p className="card-heading"> Total Requests</p>
                <p className="display-4">{helpline}</p>
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
            {!isLoading || closedHelpline > 0 ? (
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
                <p className="card-heading"> Toatal Donation </p>
                <p className="display-4">1245</p>
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
