import {PointGraphMoment} from "./PointGraphMoment.ts";

export interface PointGraphDeviation {
    leftMinAssistance: PointGraphMoment[];
    leftMaxAssistance: PointGraphMoment[];
    rightMinAssistance: PointGraphMoment[];
    rightMaxAssistance: PointGraphMoment[];
}
