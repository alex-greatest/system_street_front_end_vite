import React from "react";
import {OperationRequest} from "../../result/operation/OperationRequest";
import dayjs from "dayjs";

export interface OperationHook {
    partName: string,
    setPartName: React.Dispatch<React.SetStateAction<string>>,
    paramRequest: OperationRequest,
    startFilter: dayjs.Dayjs|null,
    endFilter: dayjs.Dayjs|null,
    setStartFilter: React.Dispatch<React.SetStateAction<dayjs.Dayjs|null>>,
    setEndFilter: React.Dispatch<React.SetStateAction<dayjs.Dayjs|null>>,
}