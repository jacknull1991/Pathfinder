import React from 'react'
import './node.css'

export default class Node extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {row, col, isStart, isTarget, isWall, onMouseDown, onMouseEnter, onMouseUp} = this.props;
        const extraClassName = isStart ? 'node-start' : isTarget ? 'node-target' : isWall ? 'node-wall' : '';

        return <div id={`node-${row}-${col}`} 
            className={`node ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}>
            </div>
    }
}