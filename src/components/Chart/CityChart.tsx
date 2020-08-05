import React from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryZoomContainer } from 'victory'
import './Chart.css'

interface DataItem {
    city: string,
    donations: number,
    label: number
}
interface Props {
    data: DataItem[],
    setSearch: (c: string) => void
}

const CityChart = ({ data, setSearch }: Props) => {
    

    return (
        <div className="container chart-container my-4">
            <VictoryChart
                domainPadding={50}
                theme={VictoryTheme.material}
                width={800}
                height={400}
                containerComponent={ <VictoryZoomContainer allowZoom={false} />}
            >
                <VictoryLabel text="City Report" x={225} y={30} textAnchor="middle" />
                <VictoryAxis

                    tickValues={data.map(f => f.city)}
                    tickFormat={x => x}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={x => x}
                />
                <VictoryBar
                    data={data}
                    x="city"
                    y="donations"
                    events={[{
                        target: "data",
                        eventHandlers: {
                            onClick: () => {
                                return [{
                                    target: "data",
                                    mutation: (props) => {
                                        console.log(props.data[props.index].city)
                                        setSearch(props.data[props.index].city)
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

export default CityChart
