import React, { ReactElement, useEffect, useState } from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryTooltip } from 'victory'
import { FiArrowLeft } from 'react-icons/fi'
import './Chart.css'

interface DataProps {
    city: string;
    donations: number;
    label?: string;
    date: string;
    x?: string
}
interface Props {
    data: DataProps[];
    loading?: boolean;
    back: () => void
}


function CampDonationChart({ data, loading, back }: Props): ReactElement {
    const initial_data: DataProps[] = [
        { city: 'Agra', date: '10-07-2020', x: '12', donations: 20, label: '20' },
        { city: 'Agra', date: '11-07-2020', x: '22', donations: 20, label: '20' },
        { city: 'Agra', date: '12-07-2020', x: '34', donations: 20, label: '20' },
    ];
    const [ chartData, setData ] = useState<DataProps[]>(initial_data)
    

    useEffect(() => {
        if(loading && data){ 
            console.log('Data from month stat',data)
            let d2 = data.filter(d => d.date != null && d.date.length > 0)
            console.log('after update', d2);
            let d = d2.map( da => {
                return {
                    city: da.city,
                    date: da.date.split('-')[0],
                    donations: parseInt(da.donations.toString()),
                    label: da.donations+ ` donations on ${da.date} `,
                    x: da.date.split('-')[0] + `(${da.city})`
                }
            })
            console.log(d)
            let sorted = d.sort((a,b) =>  parseInt(a.date) - parseInt(b.date)); 
            console.log('sorted data', sorted)
            setData(d)
        }
    },[data, loading])
    return (
        <div className="container chart-container my-4">
            <FiArrowLeft size={24} onClick={back}  />
        <VictoryChart
            theme={VictoryTheme.material}
            width={800}
            height={400}
            domainPadding={100}
        >
            <VictoryLabel text="Monthly Report" x={225} y={30} textAnchor="middle"/>
            
            <VictoryAxis

                tickValues={chartData.map(f => f.x)}
                //tickFormat={['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']}
            />
            <VictoryAxis
                dependentAxis

                tickFormat={x => x}
            />
            <VictoryBar
                data={chartData}
                labelComponent={<VictoryTooltip />}
                x="x"
                y="donations"
                alignment='middle'
                barWidth={24}
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

export default CampDonationChart
