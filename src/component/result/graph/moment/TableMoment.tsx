import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {observer} from "mobx-react-lite";
import {RecipeGraph} from "../../../../type/recipe/RecipeGraph.ts";
import {GraphBoolBar} from "../../../../type/result/graph-result/moment/GraphBoolBar.ts";
import {MomentTable} from "../../../../type/result/graph-result/moment/MomentTable.ts";

export const TableMoment = observer(
    (props:
         {
             idTableMoment: string
             momentTemplate?: RecipeGraph[],
             barTemplate?: RecipeGraph[],
             boolBarsRight?: GraphBoolBar[],
             boolBarsLeft?: GraphBoolBar[],
             momentTable?: MomentTable[],
         }) => {
    const {
        barTemplate,
        momentTemplate,
        momentTable,
        boolBarsRight,
        boolBarsLeft,
        idTableMoment} = props;
    const isBuildTable = barTemplate && momentTemplate && momentTable && boolBarsRight && boolBarsLeft &&
        momentTemplate.length > 0 && barTemplate.length == momentTemplate.length &&
        momentTemplate.length === boolBarsRight.length &&
        boolBarsRight.length === boolBarsLeft.length && boolBarsLeft.length === momentTable.length;
    const borderSettings = '1px solid rgba(224, 224, 224, 1)';
    const borderColor = (status: boolean|undefined) => {
        return status ? "green" : "red";
    }

    return (
        <TableContainer id = {idTableMoment} sx={{width: '50%', height: "700px", border: borderSettings}} component={Paper}>
            <Table sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: '1px' }} aria-label="spanning table">
                <TableHead>
                    <TableRow sx={{borderTop: borderSettings}}>
                        <TableCell rowSpan={2} align="center">
                            Давление
                        </TableCell>
                        <TableCell colSpan={3} align="center" sx={{borderLeft: borderSettings}}>
                            Кривая момента, N/m
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{borderLeft: borderSettings}} align="center">Факт. лев.</TableCell>
                        <TableCell align="center">Заданный</TableCell>
                        <TableCell align="center">Факт. прав.</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        isBuildTable ? barTemplate.map((_, index) => (
                            <TableRow key={`TableRowCommonCell${index}${barTemplate?.at(index)?.value}`}>
                                <TableCell>
                                    {barTemplate[index].value}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        borderColor: borderColor(boolBarsLeft?.at(index)?.value),
                                        borderBottom: borderColor(boolBarsLeft?.at(index)?.value),
                                        borderStyle: "solid"
                                    }}
                                    colSpan={1}
                                    align="center"
                                    key={`TableCellLeft${index}${barTemplate?.at(index)?.value}`}>
                                    {momentTable?.at(index)?.leftTable?.toFixed(2) ?? 0}
                                </TableCell>
                                <TableCell colSpan={1} align="center" key={`TableCellNormalize${index}${barTemplate?.at(index)?.value}`}>
                                    {momentTemplate?.at(index)?.value?.toFixed(2) ?? 0}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        borderColor: borderColor(boolBarsRight?.at(index)?.value),
                                        borderBottom: borderColor(boolBarsRight?.at(index)?.value),
                                        borderStyle: "solid"}}
                                    colSpan={1}
                                    align="center"
                                    key={`TableCellRight${index}${barTemplate?.at(index)?.value}`}>
                                    {momentTable?.at(index)?.rightTable?.toFixed(2) ?? 0}
                                </TableCell>
                            </TableRow>
                        )) : null
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
});