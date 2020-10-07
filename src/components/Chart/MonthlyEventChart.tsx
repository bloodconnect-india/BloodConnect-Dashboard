import React, { useEffect, useState, ReactElement } from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryGroup, VictoryLegend } from 'victory'
import './Chart.css'

interface Props {
    camp?: number[];
    awareness?: number[]
}
interface dataProps {
    month: number;
    donations: number;
    label: number;
    url: string
}

interface GraphData {
    month: number;
    count: number;
    label: number;
}

export default function MonthlyEventChart({ camp, awareness }: Props): ReactElement {
    const initial_data = [
        { month: 1, count: 0, label: 0 },
        { month: 2, count: 0, label: 0 },
        { month: 3, count: 0, label: 0 },
        { month: 4, count: 0, label: 0 },
        { month: 5, count: 0, label: 0 },
        { month: 6, count: 0, label: 0 },
        { month: 7, count: 0, label: 0 },
        { month: 8, count: 0, label: 0 },
        { month: 9, count: 0, label: 0 },
        { month: 10, count: 0, label: 0 },
        { month: 11, count: 0, label: 0 },
        { month: 12, count: 0, label: 0 },
    ];
    const initial_data1 = [
        { month: 1, count: 0, label: 0 },
        { month: 2, count: 0, label: 0 },
        { month: 3, count: 0, label: 0 },
        { month: 4, count: 0, label: 0 },
        { month: 5, count: 0, label: 0 },
        { month: 6, count: 0, label: 0 },
        { month: 7, count: 0, label: 0 },
        { month: 8, count: 0, label: 0 },
        { month: 9, count: 0, label: 0 },
        { month: 10, count: 0, label: 0 },
        { month: 11, count: 0, label: 0 },
        { month: 12, count: 0, label: 0 },
    ];

    const [campData, setCampData] = useState<GraphData[]>(initial_data)
    const [awarenessData, setAwarenessData] = useState<GraphData[]>(initial_data1)
    useEffect(() => {
        if (camp) {
            setCampData((d: GraphData[]) => {
                return d.map(da => {
                    da.count = camp[da.month - 1]
                    da.label = camp[da.month - 1]
                    return da
                })
            })
        }
    }, [camp])

    useEffect(() => {
        if (awareness) {
            setAwarenessData((d: GraphData[]) => {
                return d.map(da => {
                    da.count = awareness[da.month - 1]
                    da.label = awareness[da.month - 1]
                    return da
                })
            })
        }
    }, [awareness])
    return (
        <div className="container chart-container my-4">
            <VictoryChart
                theme={VictoryTheme.material}
                width={800}
                height={400}
                domainPadding={100}
            >

                <VictoryLabel text="Monthly Report" x={225} y={30} textAnchor="middle" />
                <VictoryLegend x={125} y={50}
                    title="Legend"
                    centerTitle
                    orientation="horizontal"
                    gutter={20}
                    style={{ border: { stroke: "black" }, title: { fontSize: 20 } }}
                    data={[
                        { name: "Camp", symbol: { fill: "blue", type:"rectangle" } },
                        { name: "Awareness", symbol: { fill: "cyan" } }
                    ]}
                />
                <VictoryAxis

                    tickValues={campData.map(f => f.month)}
                    tickFormat={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
                />
                <VictoryAxis
                    dependentAxis

                    tickFormat={x => x}
                />
                <VictoryGroup
                    offset={20}
                    colorScale={'qualitative'}
                    animate={{
                        duration: 2000,
                        onLoad: { duration: 1000 }
                    }}
                >
                    <VictoryBar
                        data={campData}
                        x="month"
                        y="count"
                        alignment='middle'
                        events={[{
                            target: "data",
                            eventHandlers: {
                                onClick: () => {
                                    return [{
                                        target: "data",
                                        mutation: (props) => {
                                            console.log(props.data[props.index].url)
                                            return true
                                        }
                                    }];
                                }
                            }
                        }]}
                    />
                    <VictoryBar
                        data={awarenessData}
                        x="month"
                        y="count"
                        alignment='middle'
                        events={[{
                            target: "data",
                            eventHandlers: {
                                onClick: () => {
                                    return [{
                                        target: "data",
                                        mutation: (props) => {
                                            console.log(props.data[props.index].url)
                                            return true
                                        }
                                    }];
                                }
                            }
                        }]}
                    />
                </VictoryGroup>
            </VictoryChart>
        </div>
    )
}