import {PointGraphMoment} from "./PointGraphMoment.ts";
import {GraphBoolBar} from "./GraphBoolBar.ts";
import {PointGraphDeviation} from "./PointGraphDeviation.ts";
import {MomentTable} from "./MomentTable.ts";
import {RecipeGraph} from "../../../recipe/RecipeGraph.ts";

export interface GraphResultMomentResponse {
    pointsGraph: PointGraphMoment[];
    pointsGraphDeviation: PointGraphDeviation;
    boolBarsRight: GraphBoolBar[];
    boolBarsLeft: GraphBoolBar[];
    momentTable: MomentTable[];
    momentTemplate: RecipeGraph[];
    barTemplate: RecipeGraph[];
}
