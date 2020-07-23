import React, { cloneElement } from 'react'
import './node.css'

const EMPTY_NODE = 0;
const START_NODE = 1;
const TARGET_NODE = 2;
const WALL_NODE = 3;
const VISITED_NODE = 4;
const PATH_NODE = 5;

export default class Node extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: EMPTY_NODE,
        };
    }

    updateNodeType = type => {
        this.setState({type: type});
    }

    render() {
        const {row, col, isStart, isTarget, isWall, onMouseDown, onMouseEnter, onMouseUp} = this.props;
        const extraClassName = isStart ? 'node-start' : isTarget ? 'node-target' : isWall ? 'node-wall' : '';
        const firstRowClassName = row === 0 ? 'first-row' : '';
        const firstColClassName = col === 0 ? 'first-col' : '';
        const updateWall = this.state.type === WALL_NODE ? 'node-wall' : '';

        return <div id={`node-${row}-${col}`} 
            className={`node ${extraClassName} ${firstRowClassName} ${firstColClassName} ${updateWall}`}
            onMouseDown={(e) => {e.preventDefault(); onMouseDown(row, col);}}
            onMouseEnter={(e) => {e.preventDefault(); onMouseEnter(row, col)}}
            onMouseUp={(e) => {e.preventDefault(); onMouseUp()}}>
            </div>
    }
}