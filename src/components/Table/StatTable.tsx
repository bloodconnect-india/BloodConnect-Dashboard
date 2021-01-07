/* eslint-disable react-hooks/exhaustive-deps */
import React, {ReactElement, useEffect, useState} from "react";
import {exportComponentAsPDF} from "react-component-export-image";
import {Loading} from "../../App";
import {CITIES_ARRAY} from "../../Constants";
import {getDateRange} from "../../Helplers";
import {Event, TableStatsType, Team} from "../../Types";
import "./Table.css";

interface Props {
  events: Event[] | undefined;
  av: Team[] | undefined;
  newHelplines: any | undefined;
}

export default function StatTable({
  events,
  av,
  newHelplines,
}: Props): ReactElement {
  const [data, setData] = useState<TableStatsType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(0);

  // you want to change this to automatic 
  const yearArray = [2021,2020, 2019];

  let totalCamps = 0,
    totalAwareness = 0,
    totalHelpline = 0,
    totalVolunteer = 0,
    totalDonation = 0,
    totalHelplineDonations = 0;
  const ref = React.createRef<any>();

  // filtering data 
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
      // camps and camp donations and awareness 
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
      // helplines part here
      if (newHelplines) {
        let jsonData = newHelplines;
        if (year !== 0) {
          if (jsonData[city]) {
            if (month !== 0) {
              if (jsonData[city].detail[year] && jsonData[city].detail[year][month - 1] && jsonData[city].detail[year][month - 1].helplines) {
                helplines = parseInt(jsonData[city].detail[year][month - 1].helplines);
                helplineDonations = parseInt(jsonData[city].detail[year][month - 1].donations);
              } else {
                helplines = 0;
                helplineDonations = 0;
              }
            } else {
              // displaying all months data
              if(jsonData[city].detail[year])
              jsonData[city].detail[year].map(h => {
                helplines += parseInt(h.helplines ? h.helplines : '0');
                helplineDonations += parseInt(h.donations ? h.donations : '0');
                return 0;
              })
            }
          }
        } else {
          // display all years data !! 
          let currTotal = 0;
          let currDonations = 0;
          if (jsonData[city]) {
            yearArray.map(y => {
              if (jsonData[city].detail[y]) {
                jsonData[city].detail[y].map(md => {
                  currTotal += parseInt(md.helplines ? md.helplines : '0');
                  currDonations += parseInt(md.donations ? md.donations : '0');
                  return 0;
                })
              }
              return 0;
            })
          }
          helplines = currTotal;
          helplineDonations = currDonations;

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
    }

    setData(tempData);
    setLoading(false);
  };



  useEffect(() => {
    setLoading(true);
    if (events && av) filterData();
  }, [month, year, events, av, newHelplines]);

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
                onChange={({target}) =>
                  setMonth(parseInt(target.value))
                }
              >
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
                onChange={({target}) =>
                  setYear(parseInt(target.value))
                }>
                <option value="0">All</option>
                {yearArray.map((y) => (
                  <option value={y}>{y}</option>
                ))}
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
                    totalHelplineDonations += parseInt(helplineDonations + '');
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

            <tr style={{backgroundColor: "#ececec"}}>
              <td className="lalign">Total</td>
              <td>{totalCamps}</td>
              <td>{totalAwareness}</td>
              <td>{totalHelpline}</td>
              <td>
                {totalDonation}+{totalHelplineDonations}
              </td>
              <td>{totalVolunteer}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
