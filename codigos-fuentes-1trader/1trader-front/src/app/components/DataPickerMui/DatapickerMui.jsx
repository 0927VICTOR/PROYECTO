import React, { useState, useEffect } from 'react'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import { Form, FormGroup, Label } from 'reactstrap';
import { Grid } from '@mui/material';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/es'

const DatapickerMui = ({ title, inpuVarian, formaDate, value, handleChangeDataPicker, datePickerW100, id }) => {

    // Hooks
    const [dateSearch, setDateSearch] = useState(null);

    useEffect(() => {
        setDateSearch(value)
    }, [value])

    return (

        <MuiPickersUtilsProvider locale={moment.locale('es')} utils={MomentUtils}>
            <KeyboardDatePicker
                name={id}
                className={datePickerW100}
                error={false}
                helperText={''}
                id={id}
                inputVariant={inpuVarian}
                format={formaDate}
                placeholder="dd/mm/yyyy"
                value={dateSearch}
                onChange={val => {
                    console.log("___", val);
                    handleChangeDataPicker(moment(val).format('YYYY/MM/DD'));
                }}
                KeyboardButtonProps={{
                    "aria-label": "change date"
                }}
            />
        </MuiPickersUtilsProvider>

    )
}

export default DatapickerMui