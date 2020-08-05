import React, { useEffect, useState } from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory'
import './Chart.css'

interface Props {
    data?:number[];
    loading?:boolean
}

interface dataProps {
    month: number;
    donations: number;
    label: String;
    url: String
}

const MonthlyChart = ({ data, loading }: Props) => {
    const initial_data = [
        { month: 1, donations: 0, label: 'heya', url: 'https://anish-yadav.github.io' },
        { month: 2, donations: 0, label: 'heya', url: 'https://anish-yadav.github.ioio' },
        { month: 3, donations: 0, label: 'heya', url: 'https://anish-yadav.github.io' },
        { month: 4, donations: 0, label: 'heya', url: 'https://anish-yadav.github.io' },
        { month: 5, donations: 0, label: 'heya', url: 'https://anish-yadav.github.io' },
        { month: 6, donations: 0, label: 'heya', url: 'https://anish-yadav.github.io' },
        { month: 7, donations: 0, label: 'heya', url: 'https://anish-yadav.github.io' },
        { month: 8, donations: 0, label: 'heya', url: 'https://anish-yadav.github.io' },
        { month: 9, donations: 0, label: 'heya', url: 'https://anish-yadav.github.io' },
        { month: 10, donations: 0, label: 'heya', url: 'https://anish-yadav.github.io' },
        { month: 11, donations: 0, label: 'heya', url: 'https://anish-yadav.github.io' },
        { month: 12, donations: 0, label: 'heya', url: 'https://anish-yadav.github.ioio' },
    ];

    const [chartData, setData] = useState<dataProps[]>(initial_data)

    useEffect(() => {
        if(!loading && data) {
            setData((d:dataProps[]) => {
                return d.map(da => {
                    da.donations = data[da.month -1]
                    da.label = data[da.month -1 ]+ ''
                    return da
                })
            })
        }
    },[loading, data])

    return (
        <div className="container chart-container my-4">
            <VictoryChart
                theme={VictoryTheme.material}
                width={800}
                height={400}
                domainPadding={100}
                animate={{
                    duration: 2000,
                    onLoad:{ duration: 1000 }
                }}
            >
                <VictoryLabel text="Monthly Report" x={225} y={30} textAnchor="middle"/>
                <VictoryAxis

                    tickValues={chartData.map(f => f.month)}
                    tickFormat={['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']}
                />
                <VictoryAxis
                    dependentAxis

                    tickFormat={x => x}
                />
                <VictoryBar
                    data={chartData}
                    x="month"
                    y="donations"
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
            </VictoryChart>
        </div>
    )
}

export default MonthlyChart
