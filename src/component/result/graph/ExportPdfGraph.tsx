import React, {useEffect, useMemo, useState} from 'react';
import {useGetGraphResultEffort, useGetGraphResultMoment} from "../../../utils/api/graph-result";
import {NotificationDisplayService} from "../../../service/NotificationDisplayService";
import {HelpDownloadFile} from "../../../service/file/HelpDownloadFile";
import {GraphPdf} from "./GraphTemplatePdf";
import dayjs from "dayjs";
import {LineChartGraphEffort} from "./effort/LineChartGraphEffort";
import {LineChartGraphMoment} from "./moment/LineChartGraphMoment";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {ManagerTimer} from "../../../service/ManagerTimer.ts";

dayjs.extend(customParseFormat)

const helpDownloadFile = new HelpDownloadFile();

export const ExportPdfGraph = (props: {
    operationId: number,
    setOperationId: React.Dispatch<React.SetStateAction<number>>,
    partName: string,
    modelDescription: string,
    date: Date,
    status: string,
    partTickets?: string
}) => {
    const [isRunDownLoad, setIsRunDownLoad] = useState(false);
    const [isLoadedFirstGraph, setIsLoadedFirstGraph] = useState(false);
    const [isLoadedSecondGraph, setIsLoadedSecondGraph] = useState(false);
    const [isNotLoad, setIsNotLoad] = useState(false);
    const {
        operationId,
        setOperationId,
        partName,
        modelDescription,
        date,
        status,
        partTickets} = props;
    const {
        data: graphEffortData,
        isError: isErrorGraphEffortData,
        isSuccess: isSuccessGraphEffortData
    } = useGetGraphResultEffort(isNaN(+operationId) ? -1 : +operationId);
    const {
        data: graphMomentData,
        isError: isErrorGraphMoment,
        isSuccess: isSuccessGraphMoment} = useGetGraphResultMoment(modelDescription, isNaN(+operationId) ? -1 : +operationId);
    const graphEffortDataMemo = useMemo(() => graphEffortData, [graphEffortData]);
    const graphMomentDataMemo = useMemo(() => graphMomentData, [graphMomentData]);
    const isErrorEffort = isErrorGraphEffortData ||
        (isSuccessGraphEffortData && (!graphEffortData || graphEffortData?.pointsGraphLeft?.length === 0));
    const isErrorMoment = isErrorGraphMoment ||
        (isSuccessGraphMoment && (!graphMomentData || graphMomentData?.pointsGraph?.length === 0));
    const idGraphEffort = "idGraphEffortExportPdf";
    const idGraphMoment = "idGraphMomentExportPdf";
    const idTableMoment = "idTableMomentExportPdf";

    useEffect(() => {
        ManagerTimer.startTimer(() => {
            if (!(isLoadedFirstGraph && isLoadedSecondGraph) && operationId !== -1) {
                setIsNotLoad(true);
            }
        }, 15000);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (isErrorEffort || isErrorMoment || isNotLoad) {
            setOperationId(-1);
            ManagerTimer.resetTimer();
            setIsNotLoad(false);
            setIsRunDownLoad(false);
            setIsLoadedFirstGraph(false);
            setIsLoadedSecondGraph(false);
            NotificationDisplayService.showMessageError("Не удалось загрузить даннные",
                "errorMessageDownloadGraphEffortData");
        }
    }, [isErrorEffort, isErrorMoment, isNotLoad, setOperationId]);

    useEffect(() => {
        if (!(isErrorEffort || isErrorMoment) && !isRunDownLoad && isLoadedFirstGraph && isLoadedSecondGraph) {
            ManagerTimer.resetTimer();
            setIsRunDownLoad(true);
            helpDownloadFile.downloadPdf(
                (ulrToGraphEffort, urlToGraphMoment, urlToTableMoment) =>
                    <GraphPdf
                        idHtmlGraphEffort={ulrToGraphEffort}
                        idHtmlTableMoment={urlToGraphMoment}
                        idHtmlGraphMoment={urlToTableMoment}
                        date={date}
                        modeDescription={modelDescription}
                        partName={partName}
                        status={status}
                    partTickets={partTickets}/>,
                `${partName}-${date.toString()}.pdf`,
                idGraphEffort,
                idGraphMoment,
                idTableMoment).then(() => {})
                .catch(() => NotificationDisplayService.showMessageError("Не удалось загрузить графики",
                "errorMessageDownloadGraphEffort"))
                .finally(() => {
                    setOperationId(-1);
                    setIsNotLoad(false);
                    setIsRunDownLoad(false);
                    setIsLoadedFirstGraph(false);
                    setIsLoadedSecondGraph(false);
            });
        }
    }, [date, isErrorEffort, isErrorMoment, isLoadedFirstGraph, isLoadedSecondGraph, isRunDownLoad, modelDescription, partName, partTickets, setOperationId, status]);

    return (
        <div style={{ opacity: "0" }}>
            <LineChartGraphEffort
                data={graphEffortDataMemo}
                idGraphEffort={idGraphEffort}
                setLoadedFirstGraph={setIsLoadedFirstGraph}
            />
            <LineChartGraphMoment
                data={graphMomentDataMemo}
                idGraphMoment={idGraphMoment}
                idTableMoment={idTableMoment}
                setLoadedSecondGraph={setIsLoadedSecondGraph}
            />
        </div>
    );
};