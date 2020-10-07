import React, { ReactElement, useEffect, useState } from "react";
import { Loading } from "../../App";
import { getTableStat } from "../../services";
import { TableStatsType } from "../../Types";
import "./Table.css";
import { exportComponentAsPDF } from 'react-component-export-image'

interface Props {}

export default function StatTable({}: Props): ReactElement {
  const [data, setData] = useState<TableStatsType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  let totalCamps = 0,totalAwareness = 0, totalHelpline = 0,totalVolunteer = 0, totalDonation = 0;
  const ref = React.createRef<any>();

  const fetchData = async () => {
    const d = await getTableStat();

    if (d) {
      setData(d);
      setLoading(false);
      console.log(d);
    }
  };

  useEffect(() => {
    console.log("called functin");
    fetchData();
  }, []);

  return (
    <div className="container p-4" ref={ref}>
      <div id="wrapper" className="d-flex flex-column">
        <div className="d-flex flex-row justify-content-between py-4 px-3">
          <></>
          <h4>Report Table</h4>
          <button onClick={() => exportComponentAsPDF(ref)}>Download</button>
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
            {!data ? (
              <Loading loading={loading} />
            ) : (
              data.map(
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
                  totalVolunteer += activeVolunteer
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

            <tr style={{ backgroundColor: '#ececec'}}>
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
