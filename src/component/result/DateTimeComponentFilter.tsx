import React from 'react';
import {Box, IconButton} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {observer} from "mobx-react-lite";
import {Clear} from "@mui/icons-material";

export const DataTimeComponentFilter = observer((props: {
    startTime: dayjs.Dayjs|null,
    endTime: dayjs.Dayjs|null,
    setStartTime: React.Dispatch<React.SetStateAction<dayjs.Dayjs|null>>,
    setEndTime: React.Dispatch<React.SetStateAction<dayjs.Dayjs|null>>
}) => {
    const {
        startTime,
        endTime,
        setStartTime,
        setEndTime} = props;

    const updateStartTime = (value: dayjs.Dayjs|null) => {
        setStartTime(value);
    }

    const updateEndTime = (value: dayjs.Dayjs|null) => {
        setEndTime(value);
    }

    return (
        <Box sx={{display: 'flex', gap: "5px", marginTop: '1em'}}>
            <DateTimePicker
                sx={{width: '215px'}}
                onAccept={updateStartTime}
                key={"dateTimePickerEndStart"}
                value={startTime ? dayjs(startTime) : null}
                defaultValue={null} ampm={false} label="Начало"
                slotProps={{
                    actionBar: {
                        actions: ['accept', 'today']
                    },
                }}/>
            <DateTimePicker
                onAccept={updateEndTime}
                sx={{width: '215px'}}
                key={"dateTimePickerEndTime"}
                value={endTime ? dayjs(endTime) : null}
                defaultValue={null} ampm={false} label="Конец"
                slotProps={{
                    actionBar: {
                        actions: ['accept', 'today']
                    },
                }}/>
            <IconButton onClick={() => {
                setStartTime(null);
                setEndTime(null);
            }}
                        edge="end">
                <Clear />
            </IconButton>
        </Box>
    );
});