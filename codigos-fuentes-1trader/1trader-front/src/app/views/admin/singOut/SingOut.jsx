import React from 'react'
import { useEffect } from 'react'

const SingUp = () => {
    useEffect(() => {
        return window.location.assign("/session/signin")
    })

    return (
        <div></div>
    )
}

export default SingUp