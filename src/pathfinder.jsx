import React from 'react'
import Node from './node'
import Slider from './Components/slider'
import Button from './Components/button'
import './pathfinder.css'
import * as dijkstra from './algorithms/dijkstra'
import * as depthFirstSearch from './algorithms/depthFirstSearch'
import * as breadthFirstSearch from './algorithms/breadthFirstSearch'

// default variables
const ROW_NUM = 20;
const COL_NUM = 50;

const START_ROW = 1;
const START_COL = 1;
const TARGET_ROW = 10;
const TARGET_COL = 25;
const walls = new Set();

const EMPTY_NODE = 0;
const START_NODE = 1;
const TARGET_NODE = 2;
const WALL_NODE = 3;
const VISITED_NODE = 4;
const PATH_NODE = 5;

const ANIMATION_SPEED = 100;

export default class Pathfinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            start: [START_ROW, START_COL],
            target: [TARGET_ROW, TARGET_COL], 
            mouseIsPressed: false,
            isAnimationRunning: false,
            isMovingCell: false,
            animation_speed: ANIMATION_SPEED,
        };
        this.refGrid = [];

        this.setAnimationSpeed = this.setAnimationSpeed.bind(this);
        this.runDFS = this.runDFS.bind(this);
        this.runBFS = this.runBFS.bind(this);
        this.runDijkstra = this.runDijkstra.bind(this);
        this.resetGrid = this.resetGrid.bind(this);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    setAnimationSpeed(speed) {
        this.setState({animation_speed: 1000/speed});
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
        const {start, target} = this.state;
        for (let row = 0; row < ROW_NUM; row++) {
            const currentRow = [];
            const refList = [];
            for (let col = 0; col < COL_NUM; col++) {
                const type = (row === start[0] && col === start[1]) ? START_NODE : 
                            (row === target[0] && col === target[1]) ? TARGET_NODE :
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
        for (let row = 0; row < ROW_NUM; row++) {
            const currentRow = [];
            for (let col = 0; col < COL_NUM; col++) {
                const type = (row === START_ROW && col === START_COL) ? START_NODE : 
                            (row === TARGET_ROW && col === TARGET_COL) ? TARGET_NODE :
                            EMPTY_NODE;
                currentRow.push(this.createNode(row, col, type));
                this.refGrid[row][col].current.updateNodeType(type);
            }
            grid.push(currentRow);
        }
        this.setState({grid: grid, start: [START_ROW, START_COL], target: [TARGET_ROW, TARGET_COL]});
    }

    componentDidMount() {
        this.setState({grid: this.initGrid()});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.mouseIsPressed) {
            return false;
        }
        else if (nextState.animation_speed !== this.state.animation_speed) {
            return false;
        }
        return true;
    }

    // update individual cell to {type}; everything else remains unchanged
    updateCellType(row, col, type) {
        const newGrid = [];
        const grid = this.state.grid;
        for (let i = 0; i < grid.length; i++) {
            const currentRow = [];
            for (let j = 0; j < grid[0].length; j++) {
                if (i === row && j === col) {
                    currentRow.push(this.createNode(i, j, type));
                } else {
                    currentRow.push(grid[i][j]);
                }
            }
            newGrid.push(currentRow);
        }
        this.setState({grid: newGrid}, () => {
            // this.printGrid();
        });
    }
    
    // set previous cell to EMPTY and set current cell to {type}
    moveCell(row, col, pre_row, pre_col, type) {
        const newGrid = [];
        const grid = this.state.grid;
        for (let i = 0; i < grid.length; i++) {
            const currentRow = [];
            for (let j = 0; j < grid[0].length; j++) {
                if (i === row && j === col) {
                    currentRow.push(this.createNode(i, j, type));
                } else if (i === pre_row && j === pre_col) {
                    currentRow.push(this.createNode(i, j, EMPTY_NODE));
                } else {
                    currentRow.push(grid[i][j]);
                }
            }
            newGrid.push(currentRow);
        }
        this.setState({grid: newGrid}, () => {
            // this.printGrid();
        });
    }

    // use a set to keep track of all mouseovered nodes
    // and change state at mouseup
    handleMouseDown(row, col) {
        // disable mouse function when animation is running
        if (this.state.isAnimationRunning) {
            return;
        }

        this.setState({mouseIsPressed: true});
        // if click on empty/wall cell, generate wall cell
        if (this.state.grid[row][col].type !== START_ROW && this.state.grid[row][col].type !== TARGET_NODE) {
            
            if (walls.has(row * 50 + col)) {
                walls.delete(row * 50 + col);
                this.updateCellType(row, col, EMPTY_NODE);
                this.refGrid[row][col].current.updateNodeType(EMPTY_NODE);
            } else {
                walls.add(row * 50 + col);
                this.updateCellType(row, col, WALL_NODE);
                this.refGrid[row][col].current.updateNodeType(WALL_NODE);
            }
        }
        // if click on start/target cell, move start/target cell with cursor
        else {
            this.setState({isMovingCell: true});
        }
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;

        if (this.state.isMovingCell) {
            // set previous start cell to empty; and update current cell to start cell
            // TODO: should optimize this
            const [pre_row, pre_col] = this.state.start;
            this.setState({start: [row, col]}, () => {
                this.moveCell(row, col, pre_row, pre_col, START_NODE);
                this.refGrid[pre_row][pre_col].current.updateNodeType(EMPTY_NODE);
                this.refGrid[row][col].current.updateNodeType(START_NODE);
            });
        }

        else if (this.state.grid[row][col].type !== START_NODE && this.state.grid[row][col].type !== TARGET_NODE) {
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
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false, isMovingCell: false}, () => {
            this.printGrid();
        });
    }

    printGrid() {
        const grid = this.state.grid;
        for (let row = 0; row < grid.length; row++) {
            let cur = '';
            for (let col = 0; col < grid[0].length; col++) {
                let type = grid[row][col].type;
                cur += type + ' ';
            }
            console.log(cur);
        }
    }

    runDFS() {
        if (this.state.isAnimationRunning) {
            return;
        }
        this.setState({isAnimationRunning: true});
        const {grid, start, target, animation_speed} = this.state;
        const {visited, path} = depthFirstSearch.dfs(grid, grid[start[0]][start[1]], grid[target[0]][target[1]]);
        console.log(visited.length);
        for (let i = 0; i < visited.length; i++) {
            setTimeout(() => {
                const node = visited[i];
                if (i > 0 && i < visited.length - 1) {
                    this.refGrid[node.row][node.col].current.updateNodeType(VISITED_NODE);
                }
                // show shortest path
                if (i === visited.length - 1) {
                    setTimeout(() => {
                        if (path.length === 0) {
                            // no path available, just stop
                            this.setState({isAnimationRunning: false});
                        } else {
                            // pop path cells
                            for (let j = 1; j < path.length - 1; j++) {
                                const pathnode = path[j];
                                setTimeout(() => {
                                    this.refGrid[pathnode.row][pathnode.col].current.updateNodeType(PATH_NODE);
                                    if (j === path.length - 2) {
                                        this.setState({isAnimationRunning: false});
                                    }
                                }, j * animation_speed * 5)
                            }
                        }
                    }, 500);
                }
            }, i * animation_speed);
        }
    }

    runBFS() {
        if (this.state.isAnimationRunning) {
            return;
        }
        this.setState({isAnimationRunning: true});
        const {grid, start, target, animation_speed} = this.state;
        const {visited, path} = breadthFirstSearch.bfs(grid, grid[start[0]][start[1]], grid[target[0]][target[1]]);
        console.log(visited.length);
        for (let i = 0; i < visited.length; i++) {
            setTimeout(() => {
                const node = visited[i];
                if (i > 0 && i < visited.length - 1) {
                    this.refGrid[node.row][node.col].current.updateNodeType(VISITED_NODE);
                }
                // show shortest path
                if (i === visited.length - 1) {
                    setTimeout(() => {
                        if (path.length === 0) {
                            // no path available, just stop
                            this.setState({isAnimationRunning: false});
                        } else {
                            // pop path cells
                            for (let j = 1; j < path.length - 1; j++) {
                                const pathnode = path[j];
                                setTimeout(() => {
                                    this.refGrid[pathnode.row][pathnode.col].current.updateNodeType(PATH_NODE);
                                    if (j === path.length - 2) {
                                        this.setState({isAnimationRunning: false});
                                    }
                                }, j * animation_speed * 5)
                            }
                        }
                    }, 500);
                }
            }, i * animation_speed);
        }
    }

    runDijkstra() {
        if (this.state.isAnimationRunning) {
            return;
        }
        this.setState({isAnimationRunning: true});
        const {grid, start, target, animation_speed} = this.state;
        const {visited, path} = dijkstra.dijkstra(grid, grid[start[0]][start[1]], grid[target[0]][target[1]]);
        for (let i = 0; i < visited.length; i++) {
            setTimeout(() => {
                const node = visited[i];
                if (i > 0 && i < visited.length - 1) {
                    this.refGrid[node.row][node.col].current.updateNodeType(VISITED_NODE);
                }
                // show shortest path
                if (i === visited.length - 1) {
                    setTimeout(() => {
                        if (path.length === 0) {
                            // no path available, just stop
                            this.setState({isAnimationRunning: false});
                        } else {
                            // pop path cells
                            for (let j = 1; j < path.length - 1; j++) {
                                const pathnode = path[j];
                                setTimeout(() => {
                                    this.refGrid[pathnode.row][pathnode.col].current.updateNodeType(PATH_NODE);
                                    if (j === path.length - 2) {
                                        this.setState({isAnimationRunning: false});
                                    }
                                }, j * animation_speed * 5)
                            }
                        }
                    }, 500);
                }
            }, i * animation_speed);
        }
    }

    render() {
        const {grid, animation_speed} = this.state;
        console.log("Page rendered");
        return (
            <>
            <div className="control-panel">
                <p>Pathfinder</p>
                {/* <button onClick={() => this.runDijkstra()}>Dijkstra's Algorithm</button>
                <button onClick={() => this.runDijkstra()}>Breadth First Search</button>
                <button onClick={() => this.runDijkstra()}>Depth First Search</button>
                <button onClick={() => this.runDijkstra()}>Bidirectional BFS</button> */}
                {/* <button onClick={() => this.resetGrid()}>Reset Grid</button> */}
                <Button text="Depth-first Search" onClick={this.runDFS}></Button>
                <Button text="Breadth-first Search" onClick={this.runBFS}></Button>
                <Button text="Dijkstra's Algorithm" onClick={this.runDijkstra}></Button>
                <Button text="Reset Grid" onClick={this.resetGrid}></Button>
                <Slider text="Animation Speed" value={animation_speed} onChange={this.setAnimationSpeed}></Slider>
                {/* <input type="range" min="70" max="100" className="slider" defaultValue="95" onChange={(e) => this.setAnimationSpeed(e)}></input> */}
            </div>
            <div className="display-panel">
                <p>Start Cell</p>
                <p>Target Cell</p>
                <p>Block Cell (Click&Drag)</p>
                <p>Path/Shortest Path</p>
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
                                        onMouseDown={this.handleMouseDown}
                                        onMouseEnter={this.handleMouseEnter}
                                        onMouseUp={this.handleMouseUp}
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
