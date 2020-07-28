import React from 'react'
import './checkbox.css'

export default function Checkbox(props) {
    const { id, text } = props;
    return (
        <>
        <div id={`${id}-wrapper`} className="checkbox-wrapper">
            <label>
                <input id={id} type="checkbox" className="checkbox" onChange={(e) => handleChange(e, props)}/><span>{text}</span>
            </label>
        </div>
        </>
    );
}

const handleChange = (e, props) => {
    if (props.onChange) {
        props.onChange(e.target.checked);
    }
}