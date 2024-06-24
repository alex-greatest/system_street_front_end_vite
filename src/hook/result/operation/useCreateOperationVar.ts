import  {useMemo, useState} from "react";
import {StoreService} from "../../../service/StoreService";
import {useLocation} from "react-router-dom";
import {OperationHook} from "../../../type/template-data-grid/hook/OperationHook";
import {DataGridOperationService} from "../../../service/datagrid/DataGridOperationService";
import {MRT_ColumnFiltersState, MRT_PaginationState} from "material-react-table";
import dayjs from "dayjs";

const helperReference = new DataGridOperationService();

export const useCreateOperationVar = (columnFilters: MRT_ColumnFiltersState, pagination: MRT_PaginationState):
    OperationHook => {
    const storageOperation = StoreService.getData("/operations");
    const partNameStorage = storageOperation?.partNameStorage;
    const partTicketsStorage = storageOperation?.partTicketsStorage;
    const startTime = storageOperation?.startFilter ?? null;
    const endTime = storageOperation?.endFilter ?? null;
    const partNameParams = useLocation().state?.partNameParams;
    const partTicketsParams = useLocation().state?.partTicketsParams;
    const [partName, setPartName] = useState(partNameParams || partNameStorage || "");
    const partTickets = partTicketsParams || partTicketsStorage || ""
    const memoryPartName = useMemo(() => partName, [partName]);
    const memoryPartTickets = useMemo(() => partTickets, [partTickets]);
    const memorySetPartName = useMemo(() => setPartName, [setPartName]);
    const statusFiler = columnFilters?.find(item => item.id === 'status.statusName');
    const [startTimeFilter, setStartTimeFilter] = useState<dayjs.Dayjs|null>(startTime);
    const [endTimeFilter, setEndTimeFilter] = useState<dayjs.Dayjs|null>(endTime);
    const memoStartFilter = useMemo(() => startTimeFilter, [startTimeFilter]);
    const memoEndFilter = useMemo(() => endTimeFilter, [endTimeFilter]);
    const memoSetStartFilter = useMemo(() => setStartTimeFilter, [setStartTimeFilter]);
    const memoSetEndFilter = useMemo(() => setEndTimeFilter, [setEndTimeFilter]);
    const paramsRequest = helperReference.createParams(
        memoStartFilter ? dayjs(memoStartFilter).toISOString() : "",
        memoEndFilter ? dayjs(memoEndFilter).toISOString() : "",
        memoryPartName,
        statusFiler,
        pagination);

    return {
        partName: memoryPartName,
        setPartName: memorySetPartName,
        paramRequest: paramsRequest,
        startFilter: memoStartFilter,
        endFilter: memoEndFilter,
        setStartFilter: memoSetStartFilter,
        setEndFilter: memoSetEndFilter,
        partTickets: memoryPartTickets
    }
};
