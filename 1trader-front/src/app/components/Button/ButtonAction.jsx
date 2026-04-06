import React from 'react'
import { Button } from 'reactstrap';

const ButtonAction = ({ title, size, handle, fontIcon, classNameButon, disabled }) => {
    // className={`${classNameButon ? classNameButon : 'button-maim'} button-maim`}
    return (
        <Button className={`${classNameButon !== undefined ? classNameButon : false}`} size={size && size} onClick={handle} disabled={disabled}>
            {fontIcon && fontIcon}
            {title}
        </Button>
    )
}

export default ButtonAction