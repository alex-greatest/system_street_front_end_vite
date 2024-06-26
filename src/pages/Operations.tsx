import {useEffect, useMemo, useState} from 'react';
import {MaterialReactTable} from 'material-react-table';
import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {StoreService} from "../service/StoreService";
import {useGetOperations} from "../utils/api/operation";
import {InputPartName} from "../component/result/InputPartName";
import {useCreateOperationVar} from "../hook/result/operation/useCreateOperationVar";
import {useCreateSelectStatusList} from "../hook/result/useCreateSelectStatusList";
import {useCreateColumnOperations} from "../hook/result/operation/useCreateColumnOperations";
import Button from "@mui/material/Button";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {HelpDownloadFileCsv} from "../service/file/HelpDownloadFileCsv";
import {ExportPdfGraph} from "../component/result/graph/ExportPdfGraph";
import {NotificationDisplayService} from "../service/NotificationDisplayService";
import {observer} from "mobx-react-lite";
import {Operation} from "../type/result/operation/Operation";
import {ToastContainer} from "react-toastify";
import {useReferenceByPartName} from "../utils/api/reference";
import {useTemplateDataGrid} from "../hook/useTemplateDataGrid";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import TableRowsIcon from '@mui/icons-material/TableRows';
import DownloadIcon from '@mui/icons-material/Download';

const helpDownloadFileCsv = new HelpDownloadFileCsv();

export const Operations = observer(() => {
    const {columnFilters, setColumnFilters, sorting,
        setSorting, pagination, setPagination}
        = useTemplateDataGrid("/operations");
    const operationDefault: Operation = useMemo(() => ({
        id: -1,
        status: { id: -1, statusName: "" },
        user: { id: -1, name: "" },
        changeTime: new Date(),
    }), []);
    const {
        partName,
        setPartName,
        paramRequest,
        startFilter,
        endFilter,
        setStartFilter,
        setEndFilter,
        partTickets} = useCreateOperationVar(columnFilters, pagination)
    const statusOperationsListName = useCreateSelectStatusList();
    const [disableCsvOperationFilter, setDisableCsvOperationFilter] =
        useState(false);
    const [disablePdfExportEffort, setdisablePdfExportEffort] = useState(false);
    const [disablePointsGraphDownload, setDisablePointsGraphDownload] = useState(false);
    const [operationIdPdf, setOperationIdPdf] = useState(-1);
    const [actualOperation, setActualOperation] = useState(operationDefault);

    const { data,
        totalElements,
        isError: isErrorGetList,
        isFetching,
        isLoading,
        refetch } = useGetOperations(paramRequest);

    const {data: reference} = useReferenceByPartName(partName);

    useEffect(() => {
        if(statusOperationsListName) {
            StoreService.addData(`/operations`, {
                columnFilters,
                sorting,
                pagination,
                startFilter: startFilter,
                endFilter: endFilter,
                partNameStorage: partName,
                partTicketsStorage: partTickets
            });
        }
    }, [columnFilters, sorting, pagination, partName, statusOperationsListName, startFilter, endFilter, partTickets]);

    useEffect(() => {
        if (operationIdPdf !== -1) {
            NotificationDisplayService.showLoading("DownLoadPdfExportEffort");
            setdisablePdfExportEffort(true);
            return;
        }
        NotificationDisplayService.hideLoading("DownLoadPdfExportEffort");
        setdisablePdfExportEffort(false);
        setActualOperation(operationDefault);
    }, [operationDefault, operationIdPdf]);

    const onSubmitDownloadCsvOperationFilter = async () => {
        await helpDownloadFileCsv.downloadFileCsvOperation(partName,
            setDisableCsvOperationFilter,
            "toastDownLoadCsvOperationsWithFilter",
            paramRequest.status,
            paramRequest.startTime,
            paramRequest.endTime);
    }

    const onSubmitDownloadPointsGraph = async (operationId: number) => {
        await helpDownloadFileCsv.downloadFileCsvGraphPoint(
            {
                operationId: operationId,
                referenceName: reference?.modelDescription ?? ""
            },
            setDisablePointsGraphDownload,
            setdisablePdfExportEffort,
            "toastDownLoadCsvPointsGraph");
    }

    return (
        <Box sx={{paddingBottom: '5em'}}>
            <ToastContainer />
            <InputPartName partName={partName}
                           setPartName={setPartName}
                           modelDescription={partName ? reference?.modelDescription ?? "" : ""}
                           partTickets={partTickets}
            />
            <MaterialReactTable
                key={"operationsMaterialReactTable"}
                columns={useCreateColumnOperations(statusOperationsListName, startFilter, endFilter, setStartFilter, setEndFilter)}
                data={data && partName ? data : []}
                initialState={{ showColumnFilters: true, density: 'compact' }}
                manualPagination
                manualFiltering
                enableRowActions
                positionActionsColumn="last"
                localization={MRT_Localization_RU}
                muiToolbarAlertBannerProps={
                    isErrorGetList
                        ? {
                            color: 'error',
                            children: 'Ошибка зарузки данных',
                        }
                        : undefined
                }
                muiTablePaginationProps={{
                    rowsPerPageOptions: [10, 15, 20]
                }}
                onColumnFiltersChange={setColumnFilters}
                onSortingChange={setSorting}
                onPaginationChange={setPagination}
                renderRowActions={({ row }) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', width: '100%' }}>
                        <Tooltip arrow placement="right" title="Просмотр результатов цикла">
                            <IconButton
                                key={`ShowResultsOperations${row.original.id}`}
                                disabled={disablePdfExportEffort || disablePointsGraphDownload}
                                color="secondary"
                                onClick={() => {
                                    const operationId = row?.original?.id;
                                    StoreService.addDataLocal(`/operation_results/${operationId}`, {
                                        partName: partName,
                                        partTickets: partTickets,
                                        date: row?.original?.changeTime ?? new Date(),
                                        modelDescription: reference?.modelDescription
                                    });
                                    window.open(`/operations_results?operationId=${operationId}`, '_blank',
                                        'noopener, noreferrer');
                                }}>
                                <TableRowsIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Просмотр графиков">
                            <IconButton
                                key={`GraphResultRealAll${row.original.id}`}
                                disabled={disablePdfExportEffort || disablePointsGraphDownload}
                                color="secondary"
                                onClick={() => {
                                    const operationId = row?.original?.id;
                                    StoreService.addDataLocal(`/graph_effort/${operationId}`, {
                                        partName: partName,
                                        partTickets: partTickets,
                                        date: row?.original?.changeTime ?? new Date(),
                                        modelDescription: reference?.modelDescription ?? "",
                                        status: row?.original?.status?.statusName ?? ""
                                    });
                                    window.open(`/graph_effort?operationId=${operationId}`, '_blank',
                                        'noopener, noreferrer');
                                }}>
                                <SignalCellularAltIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Экспорт графиков">
                            <IconButton
                                key={`ExportGraphsAll${row.original.id}`}
                                disabled={disablePdfExportEffort || disablePointsGraphDownload}
                                color="secondary"
                                onClick={() => {
                                    setOperationIdPdf(row?.original?.id ?? -1)
                                    setActualOperation(row?.original ?? operationDefault);
                                }}>
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Экспорт точек графиков">
                            <IconButton
                                key={`ExportGraphPoints${row.original.id}`}
                                disabled={disablePdfExportEffort || disablePointsGraphDownload}
                                color="primary"
                                onClick={() => {
                                    onSubmitDownloadPointsGraph(row?.original?.id ?? 0).then()
                                }}>
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                muiLinearProgressProps={() => ({
                    color: 'secondary',
                    variant: 'indeterminate', //if you want to show exact progress value
                    sx: {
                        "& .MuiLinearProgress-bar": {
                            animationDelay: "2s",
                            animationDuration: "20s",
                        },
                    }
                })}
                renderTopToolbarCustomActions={() => (
                    <Box sx={{display: 'flex', columnGap: '1em'}}>
                        <Tooltip arrow title="Обновить данные">
                            <IconButton onClick={() => refetch()}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        {(data?.length ?? 0) > 0 &&
                            <Button
                                color="primary"
                                startIcon={<FileDownloadIcon />}
                                disabled={disableCsvOperationFilter}
                                onClick={() => onSubmitDownloadCsvOperationFilter()}
                                variant="contained">
                                    Экспорт результатов
                            </Button>}
                    </Box>
                )}
                rowCount={totalElements && partName ? totalElements : 1}
                state={{
                    columnFilters,
                    isLoading,
                    pagination,
                    showAlertBanner: isErrorGetList,
                    showProgressBars: isFetching,
                    sorting}}
            />
            {operationIdPdf !== -1 &&
                <ExportPdfGraph
                    operationId={operationIdPdf}
                    setOperationId={setOperationIdPdf}
                    date={actualOperation.changeTime ?? new Date()}
                    modelDescription={partName ? reference?.modelDescription ?? "" : ""}
                    status={actualOperation.status.statusName ?? ""}
                    partName={partName}
                    partTickets={partTickets}/>
            }
        </Box>
    );
});