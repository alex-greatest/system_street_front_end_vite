import React, {useMemo} from "react";
import {MRT_ColumnDef} from "material-react-table";
import {Operation} from "../../../type/result/operation/Operation";
import {useCreateStatusColumn} from "../useCreateStatusColumn";
import {StyleColumnResult} from "../../../component/template/column/StyleColumnResult";
import {DataTimeComponentFilter} from "../../../component/result/DateTimeComponentFilter";
import dayjs from "dayjs";

export const useCreateColumnOperations = (statusOperationsListName: string[]|undefined,
                                          startTime: dayjs.Dayjs|null,
                                          endTime: dayjs.Dayjs|null,
                                          setStartTime: React.Dispatch<React.SetStateAction<dayjs.Dayjs|null>>,
                                          setEndTime: React.Dispatch<React.SetStateAction<dayjs.Dayjs|null>>,
                                          ) => {
    const dataForStatus =
        useCreateStatusColumn<Operation>(
            statusOperationsListName,
            (cell) => <StyleColumnResult cell={cell} />,
            "Результат");
    const dataForStatusMemo = useMemo(() => dataForStatus, [dataForStatus]);
    return useMemo<MRT_ColumnDef<Operation>[]>(
        () => [
            {
                accessorKey: 'changeTime',
                header: 'Дата изменения',
                Filter: () => (
                    <DataTimeComponentFilter startTime={startTime} endTime={endTime} setEndTime={setEndTime} setStartTime={setStartTime}/>
                ),
            },
            {
                accessorKey: 'status.statusName',
                ...dataForStatusMemo
            },
            {
                accessorKey: 'user.name',
                header: 'Оператор',
                enableColumnFilter: false
            },
        ],
        [dataForStatusMemo, endTime, setEndTime, setStartTime, startTime],
    );
};
