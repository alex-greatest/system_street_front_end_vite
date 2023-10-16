import {PointGraphEffort} from "./PointGraphEffort.ts";

export interface GraphResultEffortResponse {
    pointsGraphRight: PointGraphEffort[],
    pointsGraphLeft: PointGraphEffort[],
    cwAvg: number,
    cwwAvg: number
}