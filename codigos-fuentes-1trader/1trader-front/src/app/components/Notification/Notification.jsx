import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
export const Message = (type, title, message) => {
    let template = <div>{title}<br />{message}</div>
    switch (type) {
        case 'success':
            return toast.success(template, { autoClose: 3000 })
        case 'info':
            return toast.info(template, message, { autoClose: 3000 })
        case 'warning':
            return toast.warning(template, message, { autoClose: 3000 })
        case 'error':
            return toast.error(template, message, { autoClose: 3000 })
        default:
            break;
    }
}
