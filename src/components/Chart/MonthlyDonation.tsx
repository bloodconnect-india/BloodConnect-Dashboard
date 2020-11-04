/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, useEffect, useState } from "react";
import { exportComponentAsPDF } from "react-component-export-image";
import { FiArrowLeft } from "react-icons/fi";
import {
    VictoryAxis, VictoryBar,
    VictoryChart,


    VictoryLabel, VictoryTheme,

    VictoryTooltip
} from "victory";
import { Event } from "../../Types";
import "./Chart.css";

interface Props {
    selectedCity: string;
    camps: Event[] | undefined;
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

const DonationCharts = ({ selectedCity, camps }: Props) => {
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
    const [monthStatShown, showMonthStat] = useState<boolean>(false);
    const [allCamps, setCamps] = useState<Event[]>();
    // month details
    const [monthStat, setMonthStat] = useState<any>();
    const [currMonthStat, setCurrMonthStat] = useState<MonthData[]>();

    let ref = React.createRef<any>();

    const downloadChart = () => {
        exportComponentAsPDF(ref);
    };

   ;

    const filterData = () => {
        let monthData = Array(12) // camps and their donation details each month
            .fill(0)
            .map(() => [{}]);
        if (!allCamps) return;
        let tempCamps = Array.from(allCamps);
        
        let monthDonation:number[]  = Array(12).fill(0)
        if (city !== "All") {
            tempCamps = tempCamps.filter((c) => c.BloodConnect_City === city);
        }
        tempCamps.map((e) => {
            let [, mon, year] = e.Date_field.split("-");
            let currDonation = e["Post_Camp_ID.Number_of_Donation"];
            if (parseInt(year) === new Date().getFullYear()) {
                monthData[parseInt(mon) - 1].push({
                    donations:
                        currDonation && currDonation.length > 0
                            ? parseInt(currDonation)
                            : 0,
                    label: e.ID,
                    month: parseInt(mon) - 1,
                    date: e.Date_field,
                    city: e.BloodConnect_City
                });
                if (currDonation && currDonation.length > 0)
                    monthDonation[parseInt(mon)- 1] += parseInt(currDonation)
            }
            return 0;
        });

        
        

        // setting data for first chart
        setData((data) => {
            const newData = Array.from(data);
            return newData.map((d) => {
                d.donations = monthDonation[d.month - 1];
                d.label = monthDonation[d.month - 1] + "";
                return d;
            });
        });
        setMonthStat(monthData);
    };

    const handleClick = (i: number) => {
        if (monthStat && monthStat[i]) {
            setCurrMonthStat(c => monthStat[i]);
        }
        showMonthStat(true);
    };

    useEffect(() => {
        if (selectedCity !== city) setCity(selectedCity);
    }, [selectedCity]);

    // i neeed to filter data in year  based and with city filter

    useEffect(() => {
        if (!camps) return;
        filterData();
        //fetchYearData();
    }, [city, camps]);

    useEffect(() => {
        if (camps) setCamps(camps);
    }, [camps]);

    return (
        <>
            {!monthStatShown ? (
                <div
                    id="chart"
                    ref={ref}
                    className="container chart-container my-4">
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
                        }}>
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
                                                        console.log(
                                                            props.index
                                                        );
                                                        handleClick(
                                                            props.data[
                                                                props.index
                                                            ].month - 1
                                                        );
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
                        console.log("back pressed");
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
        {
            city: "Agra",
            date: "10-07-2020",
            x: "12",
            donations: 20,
            label: "20",
        },
        {
            city: "Agra",
            date: "11-07-2020",
            x: "22",
            donations: 20,
            label: "20",
        },
        {
            city: "Agra",
            date: "12-07-2020",
            x: "34",
            donations: 20,
            label: "20",
        },
    ];
    const [chartData, setData] = useState<
        Array<MonthData & { x: string; label: string }>
    >(initial_data);
    useEffect(() => {
        if (data) {
            let d2 = data.filter((d) => d.date != null && d.date.length > 0);
            let d = d2.map((da) => {
                return {
                    city: da.city,
                    date: da.date.split("-")[0],
                    donations: parseInt(da.donations.toString()),
                    label: da.donations + ` donations on ${da.date} `,
                    x: da.date.split("-")[0] + `(${da.city})`,
                };
            });
            setData(d);
        }
    }, [data]);

    return (
        <div className="container chart-container my-4">
            <FiArrowLeft size={24} onClick={back} />
            <VictoryChart
                theme={VictoryTheme.material}
                width={800}
                height={400}
                domainPadding={100}>
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
                                                console.log(
                                                    props.data[props.index].url
                                                );
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
