import React, {useEffect, useState} from 'react';
import {
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";
import {observer} from "mobx-react-lite";
import {GraphResultEffortResponse} from "../../../../type/result/graph-result/effort/GraphResultEffortResponse.ts";

export const LineChartGraphEffort = observer((props:
                                         {
                                             data: GraphResultEffortResponse | undefined
                                             idGraphEffort: string,
                                             setLoadedFirstGraph?: React.Dispatch<React.SetStateAction<boolean>>,
                                         }) => {
    const [isLoadFirstLine, setIsLoadFirstLine] = useState(false);
    const [isLoadSecondLine, setIsLoadSecondLine] = useState(false);
    const {data, idGraphEffort, setLoadedFirstGraph} = props;

    useEffect(() => {
        if (isLoadFirstLine && isLoadSecondLine) {
            setLoadedFirstGraph && setLoadedFirstGraph(true);
            setIsLoadFirstLine(false);
            setIsLoadSecondLine(false);
        }
    }, [isLoadFirstLine, isLoadSecondLine, setLoadedFirstGraph]);

    return (
        <ResponsiveContainer key={"responsiveContainerGraphEffort"} id={idGraphEffort} width={"80%"} height={750}>
            <LineChart
                key={"lineChartGraphEffort"}
                width={500}
                height={300}
                margin={{
                    top: 5,
                    right: 25,
                    left: 20,
                    bottom: 25
                }}>
                <CartesianGrid horizontal={true} vertical={true} />
                <XAxis
                    type="number"
                    dataKey="x"
                    tickCount={25} interval={0}>
                    <Label style={{fill: 'blue', fontSize: '25px',}} offset={-100} dy={25} position="center" >
                        Ход рейки, мм
                    </Label>
                </XAxis>
                <YAxis type="number"
                       tickCount={30}
                       dataKey={"y"}>
                    <Label style={{fill: 'blue', fontSize: '25px',}} angle={-90} dx={-30} position="center" >
                        Усилие преремещения рейки, Н
                    </Label>
                </YAxis>
                <Legend verticalAlign="top"/>
                <Line
                    onAnimationEnd={() => {setIsLoadFirstLine(true)}}
                    name="Усилие слева"
                    data={data?.pointsGraphLeft}
                    type="monotone"
                    dataKey="y"
                    stroke="#0000FF"
                    dot={false}
                />
                <Line
                    onAnimationEnd={() => {setIsLoadSecondLine(true)}}
                    name="Усилие справа"
                    data={data?.pointsGraphRight}
                    type="monotone"
                    dataKey="y"
                    stroke="#FFA500"
                    dot={false}
                />
                <Line name="Среднее значение справа" dataKey="y" stroke="green" />
                <Line name="Среднее значение слева" strokeDasharray="1 3" dataKey="y" stroke="red" />
                <ReferenceLine strokeDasharray="15 3" name={"Среднее значение справа"} y={-(data?.cwAvg ?? 0)} stroke="green" />
                <ReferenceLine strokeDasharray="10 7" name={"Среднее значение слева"} y={data?.cwwAvg} stroke="red" />
            </LineChart>
        </ResponsiveContainer>
    );
});