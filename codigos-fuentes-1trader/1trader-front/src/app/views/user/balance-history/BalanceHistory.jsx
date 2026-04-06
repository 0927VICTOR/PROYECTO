import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Card, CardActions, CardContent, Grid, Typography, styled } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getHistoryBalanceCustomer, getHistoryBalanceCustomerByDate } from 'app/slices/userSlice/historyBalance';
import { useEffect } from 'react';
import MaterialTable, { MTableToolbar } from "material-table";
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/es'
// import TableIcons from "../../utils/TableIcons"
import { formatPrice } from '../../../utils/utils'
import DataTable from 'app/components/DataTable/DataTable';
import DatapickerMui from 'app/components/DataPickerMui/DatapickerMui';

const BalanceHistory = () => {

    let newData = []
    let historyBalance = useSelector((state) => state.historyBalance.historyBalance);
    // newData[...historyBalance.historyBalance]
    newData = historyBalance.map(x => {
        return { ...x }
    })

    let dispatch = useDispatch();

    // Hooks
    const [dateSearch, setDateSearch] = useState(null);
    const { id } = useParams();

    const getData = async () => {
        try {
            dispatch(getHistoryBalanceCustomer())
        } catch (error) {
            console.log('Show error ', error);
        }
    }

    useEffect(async () => {
        getData()
    }, []);

    const columns = [
        {
            title: "Fecha",
            field: "date_",
            cellStyle: {
                fontSize: 13,
                textAlign: 'center'
            },
            headerStyle: {
                alignItems: 'center',
                alignItems: 'center',
                fontSize: 13,
                textAlign: 'center'
            },
            // render: (rowData) => formatoFecha(rowData.fecha)
        },
        {
            title: 'Activo',
            field: 'ecommerce',
            // render: (rowData) => formatoPrecio(rowData.ecommerce),
            cellStyle: {
                fontSize: 13,
                textAlign: 'center'
            },
            headerStyle: {
                alignItems: 'center',
                fontSize: 13,
                textAlign: 'center'
            }
        },
        {
            title: 'Tipo operación',
            field: 'operationType',
            // render: (rowData) => formatoPrecio(rowData.ecommerce),
            cellStyle: {
                fontSize: 13,
                textAlign: 'center'
            },
            headerStyle: {
                alignItems: 'center',
                fontSize: 13,
                textAlign: 'center'
            }
        },
        {
            title: 'Monto',
            field: 'investment',
            render: (rowData) => formatPrice(rowData.investment),
            cellStyle: {
                fontSize: 13,
                textAlign: 'center'

            },
            headerStyle: {
                fontSize: 13,
                textAlign: 'center'

            }
        },
    ]

    const handleChangeDataPicker = async (value) => {
        setDateSearch(value)
        try {
            dispatch(getHistoryBalanceCustomerByDate(dateSearch));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        < Grid className=' container' >
            <Grid md={6} sm={12} xs={12} className='mt-2'>
                <Grid className='datePickerBox mt-0'>
                    <DatapickerMui title='Fecha depósito' formaDate='YYYY/MM/DD' handleChangeDataPicker={handleChangeDataPicker} value={dateSearch} />
                </Grid>
            </Grid>
            <Grid className='mt-4' >
                <DataTable
                    title='Movimientos'
                    columns={columns}
                    newData={newData}
                    size={4}
                    mtToolbar={null}
                />
            </Grid>
        </Grid>
    )
}

export default BalanceHistory