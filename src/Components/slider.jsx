import React from 'react'
import './slider.css'

export default function Slider(props) {

    const {min, max, value} = props;
    return (
        <>
        <div className="slider-container">
        <span className="slider-text">{props.text}</span>
        <input type="range" min={min} max={max} className="slider" 
            defaultValue={value} onChange={(e) => handleChange(e, props)}>
        </input>
        </div>
        </>
    );
}

const handleChange = (e, props) => {
    if (props.onChange) {
        props.onChange(e.target.value);
    }
}