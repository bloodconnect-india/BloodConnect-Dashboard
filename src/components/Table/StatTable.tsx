import React, { ReactElement, useEffect, useState } from "react";
import { Loading } from "../../App";
import { getTableStat } from "../../services";
import { TableStatsType } from "../../Types";
import "./Table.css";
import { exportComponentAsPDF } from "react-component-export-image";

interface Props {}

export default function StatTable({}: Props): ReactElement {
  const [data, setData] = useState<TableStatsType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [month,setMonth] = useState<number>(0);
  const [year,setYear] = useState<number>(0);


  let totalCamps = 0,
    totalAwareness = 0,
    totalHelpline = 0,
    totalVolunteer = 0,
    totalDonation = 0;
  const ref = React.createRef<any>();

  const fetchData = async () => {
    const d = await getTableStat(month,year);

    if (d) {
      setData(d);
      setLoading(false);
      console.log(d);
    }
  };

  useEffect(() => {
    console.log("called functin");
    setLoading(true)
    fetchData();
  }, [month,year]);


  return (
    <div className="container p-4" ref={ref}>
      <div id="wrapper" className="d-flex flex-column">
        <div className="d-flex flex-row justify-content-between py-4 px-3">
          <h4>Report Table</h4>
          <div className="d-flex flex-row">
            <div className="d-flex flex-column max-2">
              <label htmlFor="month">Month</label>
              <select id="month" onChange={({ target }) => setMonth(parseInt(target.value))}>
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
              <select id="month" onChange={({ target }) => setYear(parseInt(target.value))}>
                <option value="0">All</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
              </select>
            </div>
            <div className="d-flex flex-column mx-2">
              <p className="mb-1">Download Table</p>
            <button onClick={() => exportComponentAsPDF(ref)}>Download</button>
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
                <span>Donations</span>
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
                    activeVolunteer,
                  },
                  index
                ) => {
                  totalCamps += camps;
                  totalAwareness += awareness;
                  totalDonation += donations;
                  totalHelpline += helpline;
                  totalVolunteer += activeVolunteer;
                  return (
                    <tr key={index}>
                      <td className="lalign">{city}</td>
                      <td>{camps}</td>
                      <td>{awareness}</td>
                      <td>{helpline}</td>
                      <td>{donations}</td>
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
              <td>{totalDonation}</td>
              <td>{totalVolunteer}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
