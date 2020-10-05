import React, { useEffect, useState } from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import './Chart.css'

interface Props {
    data?:number[];
    loading?:boolean;
    handleClick: (i: number) => void
}

interface dataProps {
    month: number;
    donations: number;
    label: String;
}

const MonthlyChart = ({ data, loading, handleClick }: Props) => {
    const initial_data = [
        { month: 1, donations: 0, label: '0' },
        { month: 2, donations: 0, label: '0' },
        { month: 3, donations: 0, label: '0' },
        { month: 4, donations: 0, label: '0' },
        { month: 5, donations: 0, label: '0' },
        { month: 6, donations: 0, label: '0' },
        { month: 7, donations: 0, label: '0' },
        { month: 8, donations: 0, label: '0' },
        { month: 9, donations: 0, label: '0' },
        { month: 10, donations: 0, label: '0' },
        { month: 11, donations: 0, label: '0' },
        { month: 12, donations: 0, label: '0' },
    ];

    const [chartData, setData] = useState<dataProps[]>(initial_data)

    const downloadChart = () => {
        const input = document.getElementById('chart');
        
        
    html2canvas(input!)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData,'JPEG',0,0,100,200);
        // pdf.output('dataurlnewwindow');
        pdf.save("download.pdf");
      })
    ;
    }

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
        <div id="chart" className="container chart-container my-4">
            <button className="mx-2" onClick={() => downloadChart()}>Download Chart</button>
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
                                        handleClick(props.data[props.index].month - 1)
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
