import {Stack, Typography} from "@mui/material";
import {observer} from "mobx-react-lite";

export const OutputDetailOperation = observer((
    props:
        {
            partName: string,
            modelDescription: string,
            date: Date,
            id?: string,
            partTickets?: string
        }) => {
    const {partName, modelDescription, date, id, partTickets} = props;

    return (
        <Stack id={id} sx={{width: '80%', marginTop: '2em'}}>
            {partName &&
                <Typography sx={{margin: 'auto 0 1em 1em'}} variant="h4" component="div">
                    Код механизма: {partName}
                </Typography>
            }
            {partName &&
                <Typography sx={{margin: 'auto 0 1em 1em'}} variant="h4" component="div">
                    Код финальной этикетки: {partTickets || "Код не привязан"}
                </Typography>
            }
            {modelDescription &&
                <Typography sx={{margin: 'auto 0 1em 1em'}} variant="h4" component="div">
                    Модель: {modelDescription}
                </Typography>
            }
            {date &&
                <Typography sx={{margin: 'auto 0 1em 1em'}} variant="h4" component="div">
                    Время: {date.toString()}
                </Typography>
            }
        </Stack>
    );
});