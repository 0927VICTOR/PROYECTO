import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Select from "react-select";


const SelectComponent2 = ({ optionsValues, valueOp, onChange, onBlurFn, placeHolder, name, calssNameSelect, styless, theme, loading }) => {

    const [options, setOptions] = useState(optionsValues)
    const [value, setValue] = useState(valueOp)
    console.log(value, theme);
    useEffect(() => {
        setOptions(optionsValues)
    }, [optionsValues])

    useEffect(() => {
        setValue(value)
    }, [valueOp])

    return (
        // <Select
        //     placeholder={placeHolder}
        //     className={`size ${calssNameSelect}`}
        //     name={name}
        //     autoFocus={true}
        //     styles={styless && styless}
        //     theme={theme && theme}
        //     key={value}
        //     noOptionsMessage={() => 'No se encontraron datos'}
        //     isLoading={loading}
        //     options={options}
        //     value={
        //         options.length > 0
        //             ? value
        //                 ? options.find(
        //                     (option) =>
        //                         option.value ==
        //                         value
        //                 )
        //                 : ""
        //             : ""
        //     }
        //     onChange={onChange}
        //     onBlur={e => {
        //         return onBlurFn(e)
        //     }}
        // />
        <div>
            <Select
                defaultValue={value}
                onChange={onChange}
                options={options}
            />
        </div>
    )
}


export default SelectComponent2