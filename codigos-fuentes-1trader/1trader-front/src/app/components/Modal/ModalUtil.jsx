import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import React, { useState, toggle, useEffect } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import ButtonAction from '../Button/ButtonAction'
import { Grid } from '@mui/material'

export const ModalUtils = ({ title, open, children, toggle, handleChange, spinner, visivilityModalFooter, w100Modal, w150Modal, mtop, size, disabled }) => {

    // Hooks
    const [spinn, setSpinner] = useState(false);

    useEffect(() => {
        setSpinner(spinner)
    }, [spinner])

    const handleChangeEvent = () => {
        handleChange()
    }

    return (
        <Modal className={`${w100Modal && w100Modal}  ${w150Modal && w150Modal}`} isOpen={open} style={{ marginTop: mtop, minWidth: `${size && size}` }}>
            <ModalHeader>
                {title}
            </ModalHeader>
            <ModalBody>
                <Grid item container sm={12} md={12} xs={12} >
                    {children}
                </Grid>
            </ModalBody>
            {visivilityModalFooter && <ModalFooter>
                <ButtonAction
                    title='Cerrar'
                    size={'sm'}
                    handle={toggle}
                />
                <ButtonAction
                    title='Aceptar'
                    disabled={disabled}
                    size={'sm'}
                    handle={handleChangeEvent}
                    fontIcon={spinn && <FontAwesomeIcon icon={faRotate} spin />}
                    classNameButon={'button-maim'}
                    Aceptar />
            </ModalFooter>}
        </Modal>
    )
}
