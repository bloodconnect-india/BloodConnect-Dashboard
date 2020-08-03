import React from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory'
import './Chart.css'

interface Props {

}

const CityChart = (props: Props) => {
    const data = [
        { quarter: 1, earnings: 130, label: 'heya', url: 'https://anish-yadav.github.io' },
        { quarter: 2, earnings: 165, label: 'heya', url: 'https://anish-yadav.github.ioio' },
        { quarter: 3, earnings: 142, label: 'heya', url: 'https://anish-yadav.github.io' },
        { quarter: 4, earnings: 190, label: 'heya', url: 'https://anish-yadav.github.io' },
        { quarter: 5, earnings: 190, label: 'heya', url: 'https://anish-yadav.github.io' },
        { quarter: 6, earnings: 190, label: 'heya', url: 'https://anish-yadav.github.io' },
        { quarter: 7, earnings: 190, label: 'heya', url: 'https://anish-yadav.github.io' },
        { quarter: 8, earnings: 190, label: 'heya', url: 'https://anish-yadav.github.io' },
        { quarter: 9, earnings: 190, label: 'heya', url: 'https://anish-yadav.github.io' },
        { quarter: 10, earnings: 190, label: 'heya', url: 'https://anish-yadav.github.io' }
    ];
    return (
        <div className="container chart-container my-4">
            <VictoryChart
                domainPadding={20}
                theme={VictoryTheme.material}
                width={800}
                height={400}
            >
                <VictoryLabel text="New Aspect Ratio" x={225} y={30} textAnchor="middle"/>
                <VictoryAxis

                    tickValues={data.map(f => f.quarter)}
                    tickFormat={x => `${x} day`}
                />
                <VictoryAxis
                    dependentAxis

                    tickFormat={x => `$${x / 1000}k`}
                />
                <VictoryBar
                    data={data}
                    x="quarter"
                    y="earnings"
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

export default CityChart
