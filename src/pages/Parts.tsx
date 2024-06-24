import {useEffect, useState} from 'react';
import {MaterialReactTable} from 'material-react-table';
import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {StoreService} from "../service/StoreService";
import {DataTimeComponent} from "../component/result/DateTimeComponent";
import {useCreateColumnPart} from "../hook/result/part/useCreateColumnPart";
import {useGetParts} from "../utils/api/part";
import {useCreateSelectStatusList} from "../hook/result/useCreateSelectStatusList";
import {useCreatePartVar} from "../hook/result/part/useCreatePartVar";
import {useCreateSelectModelDescription} from "../hook/result/part/useCreateSelectModelDescription";
import {useNavigate} from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {HelpDownloadFileCsv} from "../service/file/HelpDownloadFileCsv";
import Button from "@mui/material/Button";
import {observer} from "mobx-react-lite";
import {ToastContainer} from "react-toastify";
import {useTemplateDataGrid} from "../hook/useTemplateDataGrid";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const helpDownloadFileCsv = new HelpDownloadFileCsv();

export const Parts = observer(() => {
    const {columnFilters, setColumnFilters, sorting,
        setSorting, pagination, setPagination}
        = useTemplateDataGrid("/parts");
    const {
        startTime,
        endTime,
        setStartTime,
        setEndTime,
        paramRequest} = useCreatePartVar(columnFilters, pagination)
    const statusOperationsListName = useCreateSelectStatusList();
    const modelDescriptionList = useCreateSelectModelDescription();
    const navigate = useNavigate();
    const [disableDownLoadCsvOperation, setDisableDownLoadCsvOperation] =
        useState(false);
    const [disableDownLoadCsvPart, setdisableDownLoadCsvPart] =
        useState(false);
    const [disablePhotoShibao, setDisablePhotoShibao] =
        useState(false);

    const { data,
        totalElements,
        isError: isErrorGetList,
        isFetching,
        isLoading,
        refetch } = useGetParts(paramRequest, true);

    useEffect(() => {
        if(statusOperationsListName && modelDescriptionList) {
            StoreService.addData("/parts", {
                columnFilters,
                sorting,
                pagination,
            });
        }
    }, [columnFilters, modelDescriptionList, pagination, sorting, statusOperationsListName]);

    const onSubmitDownloadCsvOperation = async (partId: number) => {
        await helpDownloadFileCsv.downloadFileCsvOperationFromPart(partId,
            setDisableDownLoadCsvOperation,
            "toastDownLoadCsvOperations");
    }

    const onSubmitDownloadCsvParts = async () => {
        await helpDownloadFileCsv.downloadFileCsvParts(paramRequest,
            setdisableDownLoadCsvPart,
            "toastDownLoadCsvPartsList");
    }

    const onSubmitDownloadPhotoShibao = async (partId: number) => {
        await helpDownloadFileCsv.downloadPhotoShibao(partId,
            setDisablePhotoShibao,
            "toastDownLoadPhotoShibao");
    }

    return (
        <>
            <ToastContainer />
            <DataTimeComponent
                startTime={startTime}
                endTime={endTime}
                setEndTime={setEndTime}
                setStartTime={setStartTime}/>
            <MaterialReactTable
                key={"operationsMaterialReactTable"}
                columns={useCreateColumnPart(statusOperationsListName, modelDescriptionList)}
                data={data ?? []}
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
                                disabled={disableDownLoadCsvPart}
                                onClick={() => onSubmitDownloadCsvParts()}
                                variant="contained">
                                Экспорт списка деталей
                            </Button>}
                    </Box>
                )}
                renderRowActions={({ row }) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', width: '100%' }}>
                        <Tooltip arrow placement="right" title="Просмотр результатов">
                            <IconButton
                                disabled={disablePhotoShibao || disableDownLoadCsvOperation || disableDownLoadCsvPart}
                                key={`ResultOperationsShow${row.original.id}`}
                                color="secondary"
                                onClick={() => {
                                    navigate(
                                        '/operations',
                                        { state: {
                                                    partNameParams: row?.original?.partName ?? "",
                                                    partTicketsParams: row?.original?.partTickets?.partTicket ?? "код не привязан",
                                                    modelDescriptionParams: row?.original?.reference?.modelDescription ?? ""
                                                }})
                                }}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Экспорт результатов">
                            <IconButton
                                disabled={disablePhotoShibao || disableDownLoadCsvOperation || disableDownLoadCsvPart}
                                key={`ResultOperationsExportCsv${row.original.id}`}
                                color="secondary"
                                onClick={() => {
                                    onSubmitDownloadCsvOperation(row?.original?.id ?? 0).then()
                                }}>
                                <FileDownloadIcon />
                            </IconButton>
                        </Tooltip>
                        {row?.original?.pathShibao != null ? <Tooltip arrow placement="right" title="Экспорт SHIBAO">
                            <IconButton
                                disabled={disablePhotoShibao || disableDownLoadCsvOperation || disableDownLoadCsvPart}
                                key={`PhotoShibaoExport${row.original.id}`}
                                color="secondary"
                                onClick={() => {
                                    onSubmitDownloadPhotoShibao(row?.original?.id ?? 0).then()
                                }}>
                                <PhotoCameraIcon />
                            </IconButton>
                        </Tooltip> : null}
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
                rowCount={totalElements ?? 1}
                state={{
                    columnFilters,
                    isLoading,
                    pagination,
                    showAlertBanner: isErrorGetList,
                    showProgressBars: isFetching,
                    sorting}}
            />
        </>
    );
});