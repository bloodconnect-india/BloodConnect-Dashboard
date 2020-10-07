import React, { ReactElement, useEffect, useState } from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryTooltip,
} from "victory";
import "./Chart.css";
import { fetchCamps } from "../../services";
import { FiArrowLeft } from "react-icons/fi";
import { exportComponentAsPDF } from 'react-component-export-image'

interface Props {
  selectedCity: string;
}

interface dataProps {
  month: number;
  donations: number;
  label: string;
}

interface MonthData {
  city: string;
  date: string;
  donations: number;
}

const DonationCharts = ({ selectedCity }: Props) => {
  // for year data  like jan, feb, mar
  const initial_data = [
    { month: 1, donations: 0, label: "0" },
    { month: 2, donations: 0, label: "0" },
    { month: 3, donations: 0, label: "0" },
    { month: 4, donations: 0, label: "0" },
    { month: 5, donations: 0, label: "0" },
    { month: 6, donations: 0, label: "0" },
    { month: 7, donations: 0, label: "0" },
    { month: 8, donations: 0, label: "0" },
    { month: 9, donations: 0, label: "0" },
    { month: 10, donations: 0, label: "0" },
    { month: 11, donations: 0, label: "0" },
    { month: 12, donations: 0, label: "0" },
  ];


  const [chartData, setData] = useState<dataProps[]>(initial_data);
  const [city, setCity] = useState<string>(selectedCity);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthStatShown, showMonthStat] = useState<boolean>(false);

  // month details
  const [monthStat, setMonthStat] = useState<any>();
  const [currMonthStat, setCurrMonthStat] = useState<MonthData[]>();

  let ref = React.createRef<any>()

  const downloadChart = () => {
    
    exportComponentAsPDF(ref)
  };

  const fetchYearData = async () => {
    const { monthDonation, monthDetail } = await fetchCamps(city);
    setData((data) => {
      const newData = Array.from(data);
      return newData.map((d) => {
        d.donations = monthDonation[d.month - 1];
        d.label = monthDonation[d.month - 1] + " ";
        return d;
      });
    });
    console.log(monthDetail)
    setMonthStat(monthDetail);
  };

  const handleClick = (i: number) => {
    if (monthStat && monthStat[i]) setCurrMonthStat(monthStat[i]);
    showMonthStat(true)
    console.log('current month stat is ',i,currMonthStat)
  };

  useEffect(() => {
    if (selectedCity !== city) setCity(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    setLoading(true);
    fetchYearData();
  }, [city]);

  return (
    <>
      {!monthStatShown ? (
        <div id="chart" ref={ref} className="container chart-container my-4" >
          <button className="mx-2" onClick={() => downloadChart()}>
            Download Chart
          </button>
          <VictoryChart
            theme={VictoryTheme.material}
            width={800}
            height={400}
            domainPadding={100}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
          >
            <VictoryLabel
              text="Monthly Report"
              x={225}
              y={30}
              textAnchor="middle"
            />
            <VictoryAxis
              tickValues={chartData.map((f) => f.month)}
              tickFormat={[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "June",
                "July",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ]}
            />
            <VictoryAxis dependentAxis tickFormat={(x) => x} />
            <VictoryBar
              data={chartData}
              x="month"
              y="donations"
              alignment="middle"
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onClick: () => {
                      return [
                        {
                          target: "data",
                          mutation: (props) => {
                            console.log(props.index);
                            handleClick(props.data[props.index].month - 1);
                            return true;
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </VictoryChart>
        </div>
      ) : (
        <CampDonationChart
          back={() => {
              console.log("back pressed")
            showMonthStat(false);
          }}
          data={currMonthStat}
        />
      )}
    </>
  );
};

const CampDonationChart = ({ back, data }): ReactElement => {
  const initial_data: Array<MonthData & { x: string; label: string }> = [
    { city: "Agra", date: "10-07-2020", x: "12", donations: 20, label: "20" },
    { city: "Agra", date: "11-07-2020", x: "22", donations: 20, label: "20" },
    { city: "Agra", date: "12-07-2020", x: "34", donations: 20, label: "20" },
  ];
  const [chartData, setData] = useState<
    Array<MonthData & { x: string; label: string }>
  >(initial_data);
useEffect(() => {
  if (data) {
    let d2 = data.filter((d) => d.date != null && d.date.length > 0);
    console.log("after update", d2);
    let d = d2.map((da) => {
      return {
        city: da.city,
        date: da.date.split("-")[0],
        donations: parseInt(da.donations.toString()),
        label: da.donations + ` donations on ${da.date} `,
        x: da.date.split("-")[0] + `(${da.city})`,
      };
    });
    console.log(d);
    let sorted = d.sort((a, b) => parseInt(a.date) - parseInt(b.date));
    console.log("sorted data", sorted);
    setData(d);
  }
},[data])

  return (
    <div className="container chart-container my-4">
      <FiArrowLeft size={24} onClick={back} />
      <VictoryChart
        theme={VictoryTheme.material}
        width={800}
        height={400}
        domainPadding={100}
      >
        <VictoryLabel
          text="Monthly Donations"
          x={225}
          y={30}
          textAnchor="middle"
        />

        <VictoryAxis
          tickValues={chartData.map((f) => f.x)}
          //tickFormat={['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']}
        />
        <VictoryAxis dependentAxis tickFormat={(x) => x} />
        <VictoryBar
          data={chartData}
          labelComponent={<VictoryTooltip />}
          x="x"
          y="donations"
          alignment="middle"
          barWidth={24}
          events={[
            {
              target: "data",
              eventHandlers: {
                onClick: () => {
                  return [
                    {
                      target: "data",
                      mutation: (props) => {
                        console.log(props.data[props.index].url);
                        return true;
                      },
                    },
                  ];
                },
              },
            },
          ]}
        />
      </VictoryChart>
    </div>
  );
};
export default DonationCharts;
