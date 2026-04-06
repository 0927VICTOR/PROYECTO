import React, { useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const Loading = () => {
    const [open, setOpen] = useState(true);

    return (
        <Grid className="flex justify-self-center">
            <Modal style={{ width: '36%', opacity: '8' }} isOpen={open}>
                <ModalBody className='m-body-loading'>
                    <Grid sm={12} md={12}>
                        <Grid className='div-loading-children' >
                            <FontAwesomeIcon textLength={'center'} size='2xl' icon={faRotate} spin />
                        </Grid>
                    </Grid>
                    <Grid sm={12} md={12} xs={12}>
                        <Grid >
                            <Typography className='mt-5' textAlign={'center'} variant='h6'>Cargando...</Typography>
                        </Grid>
                    </Grid>
                </ModalBody>
            </Modal>
        </Grid >
    )
}

export default Loading