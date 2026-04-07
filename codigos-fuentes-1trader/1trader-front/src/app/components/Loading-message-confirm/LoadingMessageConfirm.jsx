import React, { useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { IMGEN_VISA } from 'app/utils/constant'

const LoadingConfirm = ({ isVisibilityChargin, msg }) => {
    const [open, setOpen] = useState(true);
    // const [visibilityConent, setVisibilitiContent] = useState(isVisibilityChargin);
    return (
        <Grid className="flex justify-self-center loading-comfirm">
            <Modal style={{ minWidth: '70%', opacity: '8' }} isOpen={open}>
                <ModalBody className='m-body-loading-comfirm'>
                    {isVisibilityChargin &&
                        <Grid sm={12} md={12} >
                            <Typography textAlign={'center'} variant='h6'>Procesando Transacción...</Typography>
                            {isVisibilityChargin &&
                                <Grid className='div-loading-children-confirm' style={{ marginTop: '-5px' }}>
                                    <FontAwesomeIcon style={{}} textLength={'center'} size='2xl' icon={faRotate} spin />

                                </Grid>
                            }
                        </Grid>}
                    {msg && <Grid sm={12} md={12} xs={12}>
                        {msg && <Grid display={'flex'} justifyContent={'center'}>
                            <img className='styleImageVisa' src={IMGEN_VISA} alt="" />
                        </Grid>}
                    </Grid>}
                    <Grid sm={12} md={12} xs={12} style={{ marginTop: '70px' }}>
                        <Grid >
                            {msg && <Typography textAlign={'center'} variant='subtitle1'>{msg}</Typography>}
                            {msg && <a href="https://www.visa.com.co/" target="_blank"  >Conoce mas a cerca de VISA</a>}
                        </Grid>
                    </Grid>
                </ModalBody>
            </Modal>
        </Grid >
    )
}

export default LoadingConfirm