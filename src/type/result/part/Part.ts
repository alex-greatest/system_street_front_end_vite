import {StatusOperation} from "../StatusOperation";
import {ReferenceForRecipe} from "../../reference/ReferenceForRecipe";
import {PartTickets} from "./PartTickets.ts";

export interface Part {
    id: number;
    partName: string,
    changeTime: Date;
    reference: ReferenceForRecipe,
    status: StatusOperation;
    pathShibao: string;
    partTickets: PartTickets;
}