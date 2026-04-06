import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Select from "react-select";


const SelectComponent = ({ optionsValues, valueOp, handle, onBlurFn, placeHolder, name, calssNameSelect, styles, theme, loading, disabled = false }) => {

    const [options, setOptions] = useState(optionsValues)
    const [value, setValue] = useState(valueOp)

    useEffect(() => {
        setOptions(optionsValues)
    }, [optionsValues])

    useEffect(() => {
        setValue(valueOp)
    }, [valueOp])

    return (
        <Select
            // maxMenuHeight={150}
            classNamePrefix="select"
            placeholder={placeHolder}
            className={`size ${calssNameSelect}`}
            name={`${name} basic-single`}
            autoFocus={true}
            styles={styles}
            theme={theme}
            key={value}
            noOptionsMessage={() => 'No se encontraron datos'}
            isLoading={loading}
            isDisabled={disabled}
            value={
                options.length > 0
                    ? value
                        ? options.find(
                            (option) =>
                                option.value ==
                                value
                        )
                        : ""
                    : ""
            }
            onBlur={e => {
                if (onBlurFn !== null) { return onBlurFn(e) }

            }}
            options={options}
            onChange={(e) => handle(e.value)}
        />
    )
}


export default SelectComponent