/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CITIES_ARRAY, MONTH } from "../../Constants";

interface Props {
    newHelplines: any | undefined;
    selectedCity: string;
}

interface ChartData {
    helplines: number;
    donations: number;
    month?: string;
}

am4core.useTheme(am4themes_animated);
export default function HelplineChart({
    selectedCity,
    newHelplines,
}: Props): ReactElement {
    const chart = useRef<am4charts.XYChart | null>(null);
    const [city, setCity] = useState<string>(selectedCity);

    // structuring helpline data for chart
    const filterData = () => {
        if (!chart.current || !newHelplines) return;
        let data: ChartData[] = [];
        for (let i in MONTH) {
            data.push({
                month: MONTH[i],
                donations: 0,
                helplines: 0,
            });
        }

        let year = new Date().getFullYear();
        if (city !== "All") {
            if (!newHelplines[city]) return;
            newHelplines[city].detail[year].map((h, i) => {
                data[i].donations = h.donations ? h.donations : 0;
                data[i].helplines = h.helplines ? h.helplines : 0;
                return 0;
            });
        } else {
            for (let i in CITIES_ARRAY) {
                let currCity = CITIES_ARRAY[i];
                if (!newHelplines[currCity] || !newHelplines[currCity].detail[year]) continue;
                newHelplines[currCity].detail[year].map((h, i) => {
                    data[i].donations += h.donations
                        ? parseInt(h.donations)
                        : 0;
                    data[i].helplines += h.helplines
                        ? parseInt(h.helplines)
                        : 0;
                    return 0;
                });
            }
        }

        chart.current.data = data;
    };

    useEffect(() => {
        if (selectedCity && selectedCity !== city) setCity(selectedCity);
    }, [selectedCity]);

    /* for charts , for data change above */
    useLayoutEffect(() => {
        if (city && newHelplines) {
            filterData();
        }
    }, [city, newHelplines]);

    useLayoutEffect(() => {
        let x = am4core.create("chartdiv", am4charts.XYChart);

        x.paddingRight = 20;

        x.data = [
            {
                month: "January",
                donations: 5,
                helplines: 52,
            },
            {
                month: "February",
                donations: 5,
                helplines: 52,
            },
            {
                month: "March",
                donations: 5,
                helplines: 52,
            },
            {
                month: "April",
                donations: 5,
                helplines: 52,
            },
            {
                month: "May",
                donations: 5,
                helplines: 52,
            },
        ];

        let xAxis = x.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = "month";
        xAxis.title.text = "Months";
        xAxis.renderer.minGridDistance = 20;

        xAxis.renderer.cellStartLocation = 0.2;
        xAxis.renderer.cellEndLocation = 0.6;

        let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Total Requests";

        let donationAxis = x.yAxes.push(new am4charts.ValueAxis());
        donationAxis.title.text = "Donations";
        donationAxis.renderer.opposite = true;

        let series = x.series.push(new am4charts.ColumnSeries());
        series.name = "Requests";
        series.yAxis = valueAxis;
        series.columns.template.fill = am4core.color("#104547"); // fill
        series.columns.template.width = am4core.percent(80);
        series.dataFields.valueY = "helplines";
        series.dataFields.categoryX = "month";
        series.tooltipText = "{valueY}";

        let series2 = x.series.push(new am4charts.ColumnSeries());
        series2.name = "Donations";
        series2.yAxis = donationAxis;
        series2.columns.template.fill = am4core.color("#CDA2AB");
        series2.columns.template.width = am4core.percent(80);
        series2.dataFields.valueY = "donations";
        series2.dataFields.categoryX = "month";
        series2.tooltipText = "{valueY} donations";

        let scrollbarX = new am4charts.XYChartScrollbar();
        x.cursor = new am4charts.XYCursor();
        scrollbarX.series.push(series);

        x.legend = new am4charts.Legend();
        chart.current = x;

        return () => {
            x.dispose();
        };
    }, []);

    return (
        <div
            className="container mx-0 px-0"
            style={{ backgroundColor: "#ffffff" }}>
            <h6 className="px-4 pt-4">Monthly Helpline Data </h6>
            <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
        </div>
    );
}
