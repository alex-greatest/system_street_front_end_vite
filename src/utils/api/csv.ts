import {apiRoutes} from "../routes";
import {axiosApi} from "../axios-api";
import {globalConfig} from "../config";

export const downloadCsvFileParts = async (partId: number, status?: string) => {
    return requestDownloadCsvFile({partId: partId, status: status ?? ""})
}

export const downloadCsvFileFilterOperation = async (
    partName: string,
    status?: string,
    startTime?: string,
    endTime?: string) => {
    return requestDownloadCsvFile({
        partName: partName,
        status: status ?? "",
        startTime: startTime ?? "",
        endTime: endTime ?? ""})
}

const requestDownloadCsvFile = async (params: object) => {
    return axiosApi.get(`${globalConfig.config.apiUrl}${apiRoutes.downloadOperationsCsv}`, {params: {...params},
        responseType: 'blob'
    });
}

export const downloadCsvPartsFile = async (params: object) => {
    return axiosApi.get(`${globalConfig.config.apiUrl}${apiRoutes.downloadPartsCsv}`, {params: {...params},
        responseType: 'blob'
    });
}

export const downloadPhotoShibao = async (partId: number) => {
    return axiosApi.get(`${globalConfig.config.apiUrl}${apiRoutes.downloadPhotoShibao}`, {params: {partId: partId},
        responseType: 'blob'
    });
}

export const downloadCsvGraphPoint = async (params: object) => {
    return axiosApi.get(`${globalConfig.config.apiUrl}${apiRoutes.downloadCsvGraphPoint}`, {params: {...params},
        responseType: 'blob'
    });
}