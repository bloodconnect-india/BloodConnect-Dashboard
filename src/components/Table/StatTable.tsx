/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, useEffect, useState } from "react";
import { exportComponentAsPDF } from "react-component-export-image";
import { Loading } from "../../App";
import { CITIES_ARRAY, CITY_HELPLINE_CITIES } from "../../Constants";
import { getDateRange } from "../../Helplers";
import { Event, Helpline, TableStatsType, Team } from "../../Types";
import "./Table.css";

interface Props {
    events: Event[] | undefined;
    av: Team[] | undefined;
    allHelplines: Helpline[] | undefined;
}

export default function StatTable({
    events,
    av,
    allHelplines,
}: Props): ReactElement {
    const [data, setData] = useState<TableStatsType[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [month, setMonth] = useState<number>(0);
    const [year, setYear] = useState<number>(0);
    const yearArray = [2020,2019];

    let totalCamps = 0,
        totalAwareness = 0,
        totalHelpline = 0,
        totalVolunteer = 0,
        totalDonation = 0,
        totalHelplineDonations = 0;
    const ref = React.createRef<any>();

    const filterData = () => {
        const tempData: TableStatsType[] = [];
        const [startDate, endDate] = getDateRange(month, year);
        if (!events) return;
        for (let i in CITIES_ARRAY) {
            let city = CITIES_ARRAY[i];
            let camps = 0,
                donations = 0,
                awareness = 0,
                helplines = 0,
                helplineDonations = 0;
            events.map((e) => {
                let campDate = new Date(
                    e.Date_field.split("-").reverse().join("-")
                ).getTime();
                if (
                    e.BloodConnect_City === city &&
                    campDate >= startDate &&
                    campDate <= endDate
                ) {
                    let d = e["Post_Camp_ID.Number_of_Donation"];
                    if (e.TypeOfEvent === "Awareness") {
                        awareness++;
                    } else {
                        camps++;
                        donations += d && d.length > 0 ? parseInt(d) : 0;
                    }
                }
                return 0;
            });
            if (allHelplines)
                if (city === "Consulting") {
                    allHelplines.map((h) => {
                        let date = new Date(
                            h.Added_Time.split(" ")[0]
                                .split("-")
                                .reverse()
                                .join("-")
                        ).getTime();
                        let currCity = h.City_Region.display_value;
                        let currDonors = h["Helpline_Handler.Donor_Count"];
                        if (
                            CITY_HELPLINE_CITIES["Delhi NCR"].includes(
                                currCity
                            ) ||
                            CITY_HELPLINE_CITIES.Odisha.includes(currCity)
                        )
                            return 0;
                        else if (
                            !CITIES_ARRAY.filter((c) => c !== city).includes(
                                currCity
                            ) &&
                            date >= startDate &&
                            date <= endDate
                        ) {
                            helplines += 1;
                            helplineDonations +=
                                currDonors && currDonors.length > 0
                                    ? parseInt(currDonors)
                                    : 0;
                        }
                    return 0;
                    });
                } else {
                    allHelplines.map((h) => {
                        let date = new Date(
                            h.Added_Time.split(" ")[0]
                                .split("-")
                                .reverse()
                                .join("-")
                        ).getTime();
                        let currDonors = h["Helpline_Handler.Donor_Count"];
                        if (
                            CITY_HELPLINE_CITIES[city].includes(
                                h.City_Region.display_value
                            ) &&
                            date >= startDate &&
                            date <= endDate
                        ) {
                            helplines += 1;
                            helplineDonations +=
                                currDonors && currDonors.length > 0
                                    ? parseInt(currDonors)
                                    : 0;
                        }
                        return 0;
                    });
                }
            tempData.push({
                city: city,
                activeVolunteer: av
                    ? av.filter((v) => v.BloodConnect_City === city).length
                    : 0,
                camps,
                awareness,
                donations,
                helpline: helplines,
                helplineDonations: helplineDonations,
            });
        }

        console.log(tempData);
        setData(tempData);
        setLoading(false);
    };

    useEffect(() => {
        console.log("called functin");
        setLoading(true);
        if (events && av) filterData();
    }, [month, year, events, av]);

    return (
        <div className="container py-4 mx-0 px-0" ref={ref}>
            <div id="wrapper" className="d-flex flex-column">
                <div className="d-flex flex-row justify-content-between py-4 px-3">
                    <h4>Report Table</h4>
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column max-2">
                            <label htmlFor="month">Month</label>
                            <select
                                id="month"
                                onChange={({ target }) =>
                                    setMonth(parseInt(target.value))
                                }>
                                <option value="0">All</option>
                                <option value="1">January</option>
                                <option value="2">Febraury</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">Decenmber</option>
                            </select>
                        </div>

                        {/* Year filter */}

                        <div className="d-flex flex-column mx-2">
                            <label htmlFor="month">Year</label>
                            <select
                                id="month"
                                onChange={({ target }) =>
                                    setYear(parseInt(target.value))
                                }>
                                <option value="0">All</option>
                                {
                                   yearArray.map((y) => (
                                       <option value={y} >{y}</option>
                                   ))
                                }
                            </select>
                        </div>
                        <div className="d-flex flex-column mx-2">
                            <p className="mb-1">Download Table</p>
                            <button onClick={() => exportComponentAsPDF(ref)}>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
                <table id="keywords" cellSpacing="0" cellPadding="0">
                    <thead>
                        <tr>
                            <th>
                                <span>City</span>
                            </th>
                            <th>
                                <span>Camps</span>
                            </th>
                            <th>
                                <span>Awareness</span>
                            </th>
                            <th>
                                <span>Helpline</span>
                            </th>
                            <th>
                                <span>Donations(Camp+Helpline)</span>
                            </th>
                            <th>
                                <span>Active Volunteer</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <div className="container-fluid d-flex justiify-content-center align-items-center">
                                <Loading loading={loading} />
                            </div>
                        ) : (
                            data!.map(
                                (
                                    {
                                        city,
                                        camps,
                                        awareness,
                                        helpline,
                                        donations,
                                        helplineDonations,
                                        activeVolunteer,
                                    },
                                    index
                                ) => {
                                    totalCamps += camps;
                                    totalAwareness += awareness;
                                    totalDonation += donations;
                                    totalHelpline += helpline;
                                    totalVolunteer += activeVolunteer;
                                    totalHelplineDonations += helplineDonations;
                                    return (
                                        <tr key={index}>
                                            <td className="lalign">{city}</td>
                                            <td>{camps}</td>
                                            <td>{awareness}</td>
                                            <td>{helpline}</td>
                                            <td>
                                                {donations}+{helplineDonations}
                                            </td>
                                            <td>{activeVolunteer}</td>
                                        </tr>
                                    );
                                }
                            )
                        )}

                        <tr style={{ backgroundColor: "#ececec" }}>
                            <td className="lalign">Total</td>
                            <td>{totalCamps}</td>
                            <td>{totalAwareness}</td>
                            <td>{totalHelpline}</td>
                            <td>{totalDonation}+{totalHelplineDonations}</td>
                            <td>{totalVolunteer}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
