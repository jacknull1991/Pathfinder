import React from 'react'
import './slider.css'

const MAX_SPEED = 200;
const MIN_SPEED = 10;

export default class Slider extends React.Component {

    handleChange = e => {
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    }

    render() {
        const value = this.props.value;
        return (
            <>
            <div className="slider-container">
            <p className="slider-text">{this.props.text}</p>
            <input type="range" min={MIN_SPEED} max={MAX_SPEED} className="slider" 
                defaultValue={value} onChange={this.handleChange}>
            </input>
            </div>
            </>
        );
    }
}