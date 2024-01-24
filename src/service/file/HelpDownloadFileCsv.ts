import {AxiosError, AxiosResponse} from "axios";
import {NotificationDisplayService} from "../NotificationDisplayService";
import {
    downloadCsvFileParts,
    downloadCsvFileFilterOperation,
    downloadCsvPartsFile,
    downloadCsvGraphPoint
} from "../../utils/api/csv";
import React from "react";
import {HelpDownloadFile} from "./HelpDownloadFile";
import {PartRequest} from "../../type/result/part/PartRequest";

type setBoolean = React.Dispatch<React.SetStateAction<boolean>>

export class HelpDownloadFileCsv extends HelpDownloadFile {
    public async downloadFileCsvOperationFromPart(partId: number, setDisable: setBoolean, idToast: string, status?: string) {
        return this.requestDownloadFileCsv(setDisable, idToast, () => downloadCsvFileParts(partId, status));
    }

    public async downloadFileCsvOperation(partName: string,
                                          setDisable: setBoolean,
                                          idToast: string,
                                          status?: string,
                                          startTime?: string,
                                          endTime?: string) {
        return this.requestDownloadFileCsv(setDisable, idToast, () =>
            downloadCsvFileFilterOperation(
                partName,
                status,
                startTime,
                endTime));
    }

    public async downloadFileCsvParts(paramRequest: PartRequest, setDisable: setBoolean, idToast: string) {
        return this.requestDownloadFileCsv(setDisable, idToast, () => downloadCsvPartsFile(paramRequest));
    }

    public async downloadFileCsvGraphPoint(paramRequest: {operationId: number, referenceName: string},
                                           setDisablePointsGraphDownload: setBoolean,
                                           setdisablePdfExportEffort: setBoolean,
                                           idToast: string) {
        try {
            NotificationDisplayService.showLoading(idToast);
            setDisablePointsGraphDownload(true);
            setdisablePdfExportEffort(true);
            const response = await downloadCsvGraphPoint(paramRequest);
            this.downloadFileCsv(response);
        } catch (e) {
            NotificationDisplayService.showMessageQuery(e as AxiosError);
        } finally {
            NotificationDisplayService.hideLoading(idToast);
            setDisablePointsGraphDownload(false);
            setdisablePdfExportEffort(false);
        }
    }

    private async requestDownloadFileCsv(setDisable: setBoolean,
                                         idToast: string,
                                         downloadCsv: () => Promise<AxiosResponse<unknown, any>>) {
        try {
            NotificationDisplayService.showLoading(idToast);
            setDisable(true);
            const response = await downloadCsv();
            this.downloadFileCsv(response);
        } catch (e) {
            NotificationDisplayService.showMessageQuery(e as AxiosError);
        } finally {
            NotificationDisplayService.hideLoading(idToast);
            setDisable(false);
        }
    }
}