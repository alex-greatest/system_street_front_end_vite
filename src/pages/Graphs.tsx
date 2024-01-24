import {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {StoreService} from "../service/StoreService";
import {Box, Fab, Stack, Typography} from "@mui/material";
import {observer} from "mobx-react-lite";
import Button from "@mui/material/Button";
import {HelpDownloadFile} from "../service/file/HelpDownloadFile";
import {GraphPdf} from "../component/result/graph/GraphTemplatePdf";
import {OutputDetailOperation} from "../component/result/OutputDetailOperation";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {ToastContainer} from "react-toastify";
import {GraphEffortData} from "../component/result/graph/effort/GraphEffortData";
import {GraphMomentData} from "../component/result/graph/moment/GraphMomentData";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {ScrollTop} from "../component/main/ScrollToTop";

const helpDownloadFile = new HelpDownloadFile();

export const Graphs = observer(() => {
    const [searchParams,] = useSearchParams();
    const operationId = searchParams.get("operationId") ?? -1;
    const tempPart = StoreService.getData(`/graph_effort/${operationId}`)?.partName ?? "";
    const [partName, setPartName] = useState(tempPart);
    const date = StoreService.getData(`/graph_effort/${operationId}`)?.date ?? new Date();
    const modelDescription = StoreService.getData(`/graph_effort/${operationId}`)?.modelDescription ?? "";
    const status = StoreService.getData(`/graph_effort/${operationId}`)?.status ?? "";
    const idGraphEffort = "graphEffortLineChart";
    const idGraphMoment = "graphMomentLineChart";
    const idTableMoment = "graphMomentTable";

    useEffect(() => {
        const partNameFromLocalStorage = StoreService.getDataLocal(`/graph_effort/${operationId}`)?.partName ?? "" as string;
        if (partNameFromLocalStorage) {
            setPartName(partNameFromLocalStorage);
            StoreService.addData(`/graph_effort/${operationId}`, {
                partName: partNameFromLocalStorage,
                date: StoreService.getDataLocal(`/graph_effort/${operationId}`)?.date ?? new Date(),
                modelDescription: StoreService.getDataLocal(`/graph_effort/${operationId}`)?.modelDescription ?? "",
                status: StoreService.getDataLocal(`/graph_effort/${operationId}`)?.status ?? ""
            });
            StoreService.removeDataLocal(`/graph_effort/${operationId}`);
        }
    }, [operationId, partName]);

    const generatePdf = async () => {
        await helpDownloadFile.downloadPdf(
            (ulrToGraphEffort, urlToGraphMoment, urlToTableMoment) =>
                <GraphPdf
                    idHtmlGraphEffort={ulrToGraphEffort}
                    idHtmlTableMoment={urlToTableMoment}
                    idHtmlGraphMoment={urlToGraphMoment}
                    date={date}
                    modeDescription={modelDescription}
                    partName={partName}
                    status={status}/>,
            `${partName}-${date}.pdf`,
            idGraphEffort,
            idGraphMoment,
            idTableMoment);
    }

    return (
        <>
            <ToastContainer />
            <Stack alignItems={"center"} justifyContent={"center"} width={"100%"} height={"100%"} padding={2}>
                <Box id="back-to-top-anchor" sx={{display: "flex", width: "70%", alignItems: 'center'}}>
                    <OutputDetailOperation date={date} partName={partName} modelDescription={modelDescription} />
                    <Button
                        color="primary"
                        startIcon={<FileDownloadIcon />}
                        onClick={generatePdf}
                        variant="contained">
                        Экспорт графиков в pdf
                    </Button>
                </Box>
                <Box sx={{width: '70%'}}>
                    <Typography sx = {{fontSize: '30px', margin: '2em 0'}}>
                        График усилия
                    </Typography>
                </Box>
                <GraphEffortData operationId={operationId} idGraphEffort={idGraphEffort} />
                <Box sx={{width: '70%'}}>
                    <Typography sx = {{fontSize: '30px', margin: '2em 0'}}>
                        Данные параметров распределителя ГУР
                    </Typography>
                </Box>
                <GraphMomentData
                    operationId={operationId}
                    modelDescription={modelDescription}
                    idGraphMoment={idGraphMoment}
                    idTableMoment={idTableMoment} />
            </Stack>
            <ScrollTop>
                <Fab size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
        </>
    );
});