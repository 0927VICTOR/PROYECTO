import React from 'react'
import MaterialTable, { MTableToolbar } from "material-table";
import { Grid } from '@mui/material';
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";
import PaidIcon from '@mui/icons-material/Paid';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

const DataTable = ({ title, newData, columns, size, actionsFunctions, toolbarComponent, actions, mtToolbar, search }) => {

    return (
        <Grid className='mt-4' >
            <MaterialTable
                style={{ maxWidth: "100%" }}
                responsive={true}
                columns={columns}
                data={newData}
                title={title}
                actions={
                    actions
                }
                components={{
                    Toolbar: props => mtToolbar !== null ? mtToolbar(props) : <MTableToolbar {...props} />
                }}
                options={{
                    paging: true,
                    pageSize: size,
                    pageSizeOptions: [10, 20, 30],
                    // tableLayout: "fixed",
                    columnResizable: true,
                    search: search,
                    sorting: true,
                    actionsColumnIndex: -1,
                    headerStyle: {
                        textAlign: 'center',
                        backgroundColor: "rgba(13, 18, 20, 1)",
                        color: 'rgb(236, 171, 15)',
                        // color: "black",
                        fontSize: 14,
                        paddingLeft: 0,
                        paddingRight: 20,
                        padding: '4px',
                    },
                    maxBodyHeight: 400,
                    maxBodyHeight: 400,
                    // actionsCellStyle: { border: '1px solid black', display: 'row'} 
                }}
                localization={{
                    header: {
                        actions: "Acciones",
                    },
                    toolbar: {
                        searchPlaceholder: "Buscar",
                        searchTooltip: "Buscar",
                    },
                    pagination: {
                        labelDisplayedRows: '{from}-{to} de {count}',
                        labelRowsSelect: 'filas',
                        labelRowsSelect: "Registros",
                        firstTooltip: "Ir al inicio",
                        lastTooltip: "Ir al final",
                        nextTooltip: "Página siguiente",
                        previousTooltip: "Página anterior",
                        emptyDataSourceMessage: "No hay datos para mostrar",
                    },
                    body: {
                        editRow: {
                            saveTooltip: "Guardar",
                            cancelTooltip: "Cancelar",
                            deleteText: "¿Desea eliminar el registro?",
                        },
                        emptyDataSourceMessage: "No hay datos para mostrar",
                        deleteTooltip: "Eliminar",
                        editTooltip: "Editar",
                    },
                }}
            />
        </Grid>
    )
}

export default DataTable