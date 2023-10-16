import React, {useEffect, useState} from 'react';
import {
    CartesianGrid,
    Label, LabelList,
    Legend,
    Line,
    LineChart, ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import {observer} from "mobx-react-lite";
import {CustomDot} from "../CustomDot";
import {Box} from "@mui/material";
import {TableMoment} from "./TableMoment.tsx";
import {GraphResultMomentResponse} from "../../../../type/result/graph-result/moment/GraphResultMomentResponse.ts";

export const LineChartGraphMoment = observer((props:
                                         {
                                             data: GraphResultMomentResponse | undefined
                                             idGraphMoment: string,
                                             idTableMoment: string,
                                             setLoadedSecondGraph?: React.Dispatch<React.SetStateAction<boolean>>
                                         }) => {
    const {
        data,
        idGraphMoment,
        idTableMoment,
        setLoadedSecondGraph} = props;
    const [isLoadFirstLine, setIsLoadFirstLine] = useState(false);
    const [isLoadSecondLine, setIsLoadSecondLine] = useState(false);
    const [isLoadThirdLine, setIsLoadThirdLine] = useState(false);
    const [isLoadFourthLine, setIsLoadFourthLine] = useState(false);
    const [isLoadFifthLine, setIsLoadFifthLine] = useState(false);

    useEffect(() => {
        const isReady = isLoadFirstLine && isLoadSecondLine && isLoadThirdLine && isLoadFourthLine && isLoadFifthLine;
        if (isReady) {
            setLoadedSecondGraph && setLoadedSecondGraph(true);
            setIsLoadFirstLine(false);
            setIsLoadSecondLine(false);
            setIsLoadThirdLine(false);
            setIsLoadFourthLine(false);
            setIsLoadFifthLine(false);
        }
    }, [isLoadFirstLine, isLoadFifthLine, isLoadFourthLine, isLoadSecondLine, isLoadThirdLine, setLoadedSecondGraph]);

    return (
        <Box sx={{width: '100%', display: 'flex', gap: '2em', padding: "0 1em"}}>
            <ResponsiveContainer key={"responsiveContainerGraphMoment"} id={idGraphMoment} width={"50%"} height={900}>
                <LineChart
                    key={"lineChartGraphMoment"}
                    width={500}
                    height={300}
                    margin={{
                        top: 5,
                        right: 25,
                        left: 20,
                        bottom: 25
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Legend verticalAlign="top"/>
                    <XAxis allowDecimals={true} tickCount={15} interval={0} dataKey="moment" type="number" allowDuplicatedCategory={false}>
                        <Label style={{fill: 'blue', fontSize: '25px',}} offset={-100} dy={25} position="center" >
                            Момент
                        </Label>
                    </XAxis>
                    <YAxis dataKey="bar"
                           type="number"
                           allowDecimals={true}
                           allowDuplicatedCategory={false}
                           strokeWidth={0}
                           label={{
                               style: { textAnchor: "middle" },
                               angle: -90,
                               position: "left",
                               offset: 0}}>
                        <Label style={{fill: 'blue', fontSize: '25px',}} angle={-90} dx={-20} position="center" >
                            Давление
                        </Label>
                    </YAxis>
                    <Line
                        data={data?.pointsGraph}
                        onAnimationEnd={() => {setIsLoadFirstLine(true)}}
                        type="linear"
                        dataKey="bar"
                        stroke="green"
                        activeDot={{ r: 8 }}
                        legendType={'none'}
                        dot={false}
                        name="Разница давлений">
                        <LabelList content={<CustomDot />} />
                    </Line>
                    <Line
                        data={data?.pointsGraphDeviation?.rightMinAssistance}
                        onAnimationEnd={() => {setIsLoadSecondLine(true)}}
                        type="linear"
                        dataKey="bar"
                        stroke="green"
                        legendType={'none'}
                        activeDot={{ r: 8 }}
                        dot={true}
                        strokeDasharray={"3, 3"}
                        name="Минимум" />
                    <Line
                        data={data?.pointsGraphDeviation?.rightMaxAssistance}
                        onAnimationEnd={() => {setIsLoadThirdLine(true)}}
                        dataKey="bar"
                        stroke="green"
                        activeDot={{ r: 8 }}
                        legendType={'none'}
                        strokeDasharray={"3, 3"}
                        name="Максимум" />
                    <Line
                        data={data?.pointsGraphDeviation?.leftMinAssistance}
                        onAnimationEnd={() => {setIsLoadFourthLine(true)}}
                        type="linear"
                        dataKey="bar"
                        stroke="green"
                        activeDot={{ r: 8 }}
                        legendType={'none'}
                        dot={true}
                        strokeDasharray={"3, 3"}
                        name="Минимум" />
                    <Line
                        data={data?.pointsGraphDeviation?.leftMaxAssistance}
                        onAnimationEnd={() => {setIsLoadFifthLine(true)}}
                        type="linear"
                        dataKey="bar"
                        stroke="green"
                        legendType={'none'}
                        activeDot={{ r: 8 }}
                        strokeDasharray={"3, 3"}
                        name="Максимум" />
                    <ReferenceLine
                        x={0}
                        stroke="gray"
                        strokeWidth={1.5}
                        strokeOpacity={0.65}
                    />
                </LineChart>
            </ResponsiveContainer>
            <TableMoment
                momentTemplate={data?.momentTemplate}
                barTemplate={data?.barTemplate}
                boolBarsRight={data?.boolBarsRight}
                boolBarsLeft={data?.boolBarsLeft}
                momentTable={data?.momentTable}
                idTableMoment={idTableMoment} />
        </Box>
    );
});