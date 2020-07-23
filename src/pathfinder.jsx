import React from 'react'
import Node from './node'
import './pathfinder.css'
import * as dijkstra from './algorithms/dijkstra'

const START_ROW = 1;
const START_COL = 1;
const TARGET_ROW = 15;
const TARGET_COL = 20;
const walls = new Set();

const EMPTY_NODE = 0;
const START_NODE = 1;
const TARGET_NODE = 2;
const WALL_NODE = 3;
const VISITED_NODE = 4;
const PATH_NODE = 5;

const ANIMATION_MAX_SPEED = 105;
let ANIMATION_SPEED = 10;

export default class Pathfinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
        this.refGrid = [];
    }

    setAnimationSpeed(event) {
        let speed = event.target.value;
        ANIMATION_SPEED = ANIMATION_MAX_SPEED - speed;
    }

    createNode(row, col, node_t = EMPTY_NODE) { 
        return {
            row: row,
            col: col,
            type: node_t,
            distance: Infinity,
            previous: null,
        };
    }

    // clear all walls & visited cells
    // also create refs to cells
    initGrid() {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            const refList = [];
            for (let col = 0; col < 50; col++) {
                const type = (row === START_ROW && col === START_COL) ? START_NODE : 
                            (row === TARGET_ROW && col === TARGET_COL) ? TARGET_NODE :
                            EMPTY_NODE;
                currentRow.push(this.createNode(row, col, type));
                refList.push(React.createRef());
            }
            grid.push(currentRow);
            this.refGrid.push(refList);
        }
        return grid;
    }

    // clear all walls & visited cells
    resetGrid() {
        const grid = [];
        walls.clear();
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                const type = (row === START_ROW && col === START_COL) ? START_NODE : 
                            (row === TARGET_ROW && col === TARGET_COL) ? TARGET_NODE :
                            EMPTY_NODE;
                currentRow.push(this.createNode(row, col, type));
                this.refGrid[row][col].current.updateNodeType(type);
            }
            grid.push(currentRow);
        }
        this.setState({grid: grid});
    }

    componentDidMount() {
        this.setState({grid: this.initGrid()});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.mouseIsPressed) {
            return false;
        }
        return true;
    }

    updateCellType(row, col, type) {
        const newGrid = [];
        const grid = this.state.grid;
        for (let i = 0; i < grid.length; i++) {
            const currentRow = [];
            for (let j = 0; j < grid[0].length; j++) {
                if (i === row && j === col) {
                    currentRow.push(this.createNode(row, col, type));
                } else {
                    currentRow.push(grid[i][j]);
                }
            }
            newGrid.push(currentRow);
        }
        this.setState({grid: newGrid});
    }

    // use a set to keep track of all mouseovered nodes
    // and change state at mouseup
    handleMouseDown(row, col) {
        this.setState({mouseIsPressed: true});
        if ((row === START_ROW && col === START_COL) || (row === TARGET_ROW && col === TARGET_COL)) {
            return;
        }

        if (walls.has(row * 50 + col)) {
            walls.delete(row * 50 + col);
            //this.state.grid[row][col].type = EMPTY_NODE;
            this.updateCellType(row, col, EMPTY_NODE);
            this.refGrid[row][col].current.updateNodeType(EMPTY_NODE);
        } else {
            walls.add(row * 50 + col);
            //this.state.grid[row][col].type = WALL_NODE;
            this.updateCellType(row, col, WALL_NODE);
            this.refGrid[row][col].current.updateNodeType(WALL_NODE);
        }
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        if ((row === START_ROW && col === START_COL) || (row === TARGET_ROW && col === TARGET_COL)) {
            return;
        }
        
        if (walls.has(row * 50 + col)) {
            walls.delete(row * 50 + col);
            //this.state.grid[row][col].type = EMPTY_NODE;
            this.updateCellType(row, col, EMPTY_NODE);
            this.refGrid[row][col].current.updateNodeType(EMPTY_NODE);
        } else {
            walls.add(row * 50 + col);
            //this.state.grid[row][col].type = WALL_NODE;
            this.updateCellType(row, col, WALL_NODE);
            this.refGrid[row][col].current.updateNodeType(WALL_NODE);
        }
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    runDijkstra() {
        const grid = this.state.grid;
        const start = grid[START_ROW][START_COL];
        const target = grid[TARGET_ROW][TARGET_COL];
        const {visited, path} = dijkstra.dijkstra(grid, start, target);
        for (let i = 0; i < visited.length; i++) {
            setTimeout(() => {
                const node = visited[i];
                if (i > 0 && i < visited.length - 1) {
                    this.refGrid[node.row][node.col].current.updateNodeType(VISITED_NODE);
                }
                // show shortest path
                if (i === visited.length - 1) {
                    setTimeout(() => {
                        for (let j = 1; j < path.length - 1; j++) {
                            const pathnode = path[j];
                            setTimeout(() => {
                                this.refGrid[pathnode.row][pathnode.col].current.updateNodeType(PATH_NODE);
                            }, j * ANIMATION_SPEED * 5)
                            
                        }
                    }, 500);
                    
                }
            }, i * ANIMATION_SPEED);
        }
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
            <div className="control-panel">
                <p>Pathfinder</p>
                <button onClick={() => this.runDijkstra()}>Dijkstra's Algorithm</button>
                <button onClick={() => this.runDijkstra()}>Breadth First Search</button>
                <button onClick={() => this.runDijkstra()}>Depth First Search</button>
                <button onClick={() => this.runDijkstra()}>Bidirectional BFS</button>
                <button onClick={() => this.resetGrid()}>Reset Grid</button>
                <input type="range" min="70" max="100" className="slider" defaultValue="95" onChange={(e) => this.setAnimationSpeed(e)}></input>
            </div>
            <div className="display-panel">
                <p>Start Cell</p>
                <p>Target Cell</p>
                <p>Block Cell (Click and Drag)</p>
                <p>Shortest Path</p>
            </div>
            <div className="grid-container">
                {grid.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="grid-row">
                            {row.map((node, nodeIndex) => {
                                const {row, col, type} = node;
                                return (
                                    <Node 
                                        key={nodeIndex}
                                        row = {row}
                                        col = {col}
                                        type={type}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                        onMouseUp={() => this.handleMouseUp()}
                                        ref={this.refGrid[row][col]}></Node>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            
            </>
        );
    }
}
