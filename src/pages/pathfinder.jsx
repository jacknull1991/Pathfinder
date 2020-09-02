import React from 'react'
import Node from '../components/node'
import Slider from '../components/slider'
import Button from '../components/button'
import Checkbox from '../components/checkbox'
import './pathfinder.css'
import { dijkstra } from '../algorithms/dijkstra'
import { depthFirstSearch } from '../algorithms/depthFirstSearch'
import { breadthFirstSearch } from '../algorithms/breadthFirstSearch'
import { bidirectionBFS } from '../algorithms/bidirectionBFS'
import { createMazeArray } from '../utils/mazeGen'

// default variables
const ROW_NUM = 20;
const COL_NUM = 50;

// default cell positions
const START_ROW = 4;
const START_COL = 14;
const TARGET_ROW = 14;
const TARGET_COL = 34;
const walls = new Set();

const EMPTY_NODE = 0;
const START_NODE = 1;
const TARGET_NODE = 2;
const WALL_NODE = 3;
const VISITED_NODE = 4;
const PATH_NODE = 5;
const WEIGHT_NODE = 6;

const ANIMATION_SPEED = 150;
const MAX_SPEED = 200;
const MIN_SPEED = 10;

export default class Pathfinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            start: [START_ROW, START_COL],
            target: [TARGET_ROW, TARGET_COL], 
            mouseIsPressed: false,
            isAnimationRunning: false,
            isMovingStart: false,
            isMovingTarget: false,
            isAddingWall: false,
            isAddingWeight: false,
            animation_speed: ANIMATION_SPEED,
        };
        this.refGrid = [];

        this.setAnimationSpeed = this.setAnimationSpeed.bind(this);
        this.toggleWall = this.toggleWall.bind(this);
        this.toggleWeight = this.toggleWeight.bind(this);
        
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    setAnimationSpeed(speed) {
        this.setState({animation_speed: speed});
    }

    createNode(row, col, node_t = EMPTY_NODE, weight = 0) { 
        return {
            row: row,
            col: col,
            type: node_t,
            distance: Infinity,
            weight: weight,
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

    presetMaze() {
        const maze = createMazeArray();
        const newGrid = [];
        let start_row, start_col, target_row, target_col;
        for (let row = 0; row < ROW_NUM; row++) {
            const currentRow = [];
            for (let col = 0; col < COL_NUM; col++) {
                const cell = maze[row * COL_NUM + col];
                const cell_type = cell === 0 ? EMPTY_NODE : cell === 1 ? WALL_NODE : cell === 2 ? START_NODE : TARGET_NODE;
                currentRow.push(this.createNode(row, col, cell_type));
                this.refGrid[row][col].current.updateNodeType(cell_type);
                if (cell === 2) {
                    start_row = row;
                    start_col = col;
                }
                else if (cell === 3) {
                    target_row = row;
                    target_col = col;
                }
            }
            newGrid.push(currentRow);
        }
        this.setState({grid: newGrid, start: [start_row, start_col], target: [target_row, target_col]});
    }

    // clear search results
    resetPath() {
        const grid = this.state.grid;
        const newGrid = [];
        for (let row = 0; row < ROW_NUM; row++) {
            const currentRow = [];
            for (let col = 0; col < COL_NUM; col++) {
                if (grid[row][col].type === VISITED_NODE || grid[row][col].type === PATH_NODE) {
                    currentRow.push(this.createNode(row, col, EMPTY_NODE));
                    this.refGrid[row][col].current.updateNodeType(EMPTY_NODE);
                }
                else {
                    currentRow.push(grid[row][col]);
                }
                    
            }
            newGrid.push(currentRow);
        }
        this.setState({grid: newGrid});
    }

    // clear all walls & visited cells and reset start/target position 
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
        else if (nextState.isAddingWall !== this.state.isAddingWall ||
            nextState.isAddingWeight !== this.state.isAddingWeight) {
            return false;
        }
        return true;
    }

    // update individual cell to {type}; everything else remains unchanged
    updateCellType(row, col, type) {
        const newGrid = [];
        const weight = type === WEIGHT_NODE ? 10 : 0;
        const grid = this.state.grid;
        for (let i = 0; i < grid.length; i++) {
            const currentRow = [];
            for (let j = 0; j < grid[0].length; j++) {
                if (i === row && j === col) {
                    currentRow.push(this.createNode(i, j, type, weight));
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

    toggleWall(isAddingWall) {
        if (this.state.isAddingWeight && isAddingWall) {
            document.getElementById('toggle-weight').checked = false;
            this.setState({isAddingWall: isAddingWall, isAddingWeight: false});
        } else {
            this.setState({isAddingWall: isAddingWall});
        }
    }

    toggleWeight(isAddingWeight) {
        if (this.state.isAddingWall && isAddingWeight) {
            document.getElementById('toggle-wall').checked = false;
            this.setState({isAddingWeight: isAddingWeight, isAddingWall: false});
        } else {
            this.setState({isAddingWeight: isAddingWeight});
        }
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
        if (this.state.grid[row][col].type !== START_NODE && this.state.grid[row][col].type !== TARGET_NODE) {
            // if neither button is pressed, return
            if (!this.state.isAddingWall && !this.state.isAddingWeight) return;
            if (walls.has(row * 50 + col)) {
                walls.delete(row * 50 + col);
                this.updateCellType(row, col, EMPTY_NODE);
                this.refGrid[row][col].current.updateNodeType(EMPTY_NODE);
            } else {
                const addType = this.state.isAddingWall ? WALL_NODE : WEIGHT_NODE;
                walls.add(row * 50 + col);
                this.updateCellType(row, col, addType);
                this.refGrid[row][col].current.updateNodeType(addType);
            }
        }
        // if click on start/target cell, move start/target cell with cursor
        else {
            if (this.state.grid[row][col].type === START_NODE)
                this.setState({isMovingStart: true});
            else
                this.setState({isMovingTarget: true});
        }
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;

        if (this.state.isMovingStart && this.state.grid[row][col].type !== TARGET_NODE) {
            // set previous start cell to empty; and update current cell to start cell
            const [pre_row, pre_col] = this.state.start;
            this.setState({start: [row, col]}, () => {
                this.moveCell(row, col, pre_row, pre_col, START_NODE);
                this.refGrid[pre_row][pre_col].current.updateNodeType(EMPTY_NODE);
                this.refGrid[row][col].current.updateNodeType(START_NODE);
            });
        }
        else if (this.state.isMovingTarget && this.state.grid[row][col].type !== START_NODE) {
            const [pre_row, pre_col] = this.state.target;
            this.setState({target: [row, col]}, () => {
                this.moveCell(row, col, pre_row, pre_col, TARGET_NODE);
                this.refGrid[pre_row][pre_col].current.updateNodeType(EMPTY_NODE);
                this.refGrid[row][col].current.updateNodeType(TARGET_NODE);
            });
        }

        else if (this.state.grid[row][col].type !== START_NODE && this.state.grid[row][col].type !== TARGET_NODE) {
            if (!this.state.isAddingWall && !this.state.isAddingWeight) return;
            if (walls.has(row * 50 + col)) {
                walls.delete(row * 50 + col);
                this.updateCellType(row, col, EMPTY_NODE);
                this.refGrid[row][col].current.updateNodeType(EMPTY_NODE);
            } else {
                const addType = this.state.isAddingWall ? WALL_NODE : WEIGHT_NODE;
                walls.add(row * 50 + col);
                this.updateCellType(row, col, addType);
                this.refGrid[row][col].current.updateNodeType(addType);
            }
        }
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false, isMovingStart: false, isMovingTarget: false}, () => {
            // this.printGrid();
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

    runAlgo = (algo) => {
        if (this.state.isAnimationRunning) return;

        this.setState({isAnimationRunning: true});
        const {grid, start, target} = this.state;
        const animation_speed = 1000 / this.state.animation_speed;
        let visited, path;
        switch (algo) {
            case 'dijkstra':
                ({visited, path} = dijkstra(grid, grid[start[0]][start[1]], grid[target[0]][target[1]]));
                break;
            case 'dfs':
                ({visited, path} = depthFirstSearch(grid, grid[start[0]][start[1]], grid[target[0]][target[1]]));
                break;
            case 'bfs':
                ({visited, path} = breadthFirstSearch(grid, grid[start[0]][start[1]], grid[target[0]][target[1]]));
                break;
            case 'bi-bfs':
                ({visited, path} = bidirectionBFS(grid, grid[start[0]][start[1]], grid[target[0]][target[1]]));
                break;
            default:
                this.setState({isAnimationRunning: false});
                return;
        }

        for (let i = 0; i < visited.length; i++) {
            setTimeout(() => {
                const node = visited[i];
                // TODO: change upper bound when path not found
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

    logout() {
        localStorage.clear();
        window.location = "/";
    }

    render() {
        const {grid, animation_speed} = this.state;
        console.log("Page rendered");
        return (
            <>
            {/* TODO: Extract this panel as a react component */}
            <div className="control-panel">
                <p>Pathfinder</p>
                <div className="button-wrapper">
                    <Button text="Depth-first Search" onClick={() => this.runAlgo('dfs')}></Button>
                    <Button text="Breadth-first Search" onClick={() => this.runAlgo('bfs')}></Button>
                    <Button text="Bidirectional Search" onClick={() => this.runAlgo('bi-bfs')}></Button>
                    <Button text="Dijkstra's Algorithm" onClick={() => this.runAlgo('dijkstra')}></Button>

                    <Button text="Add Maze!" onClick={() => this.presetMaze()}></Button>
                    <Button text="Reset Path" onClick={() => this.resetPath()}></Button>
                    <Button text="Reset Grid" onClick={() => this.resetGrid()}></Button>   
                    <Button text="Logout" onClick={() => this.logout()}></Button>   
                </div>
                <div className="slider-wrapper">   
                    <Slider text="Animation Speed" min={MIN_SPEED} max={MAX_SPEED} value={animation_speed} onChange={this.setAnimationSpeed}></Slider>
                </div>
            </div>
            <div className="display-panel">
                <p id="start-cell-square">Start Cell</p>
                <p id="target-cell-square">Target Cell</p>
                <p id="visited-cell-square">Visited Cell</p>
                <p id="path-cell-square">Path/Shortest Path</p>
                <Checkbox id="toggle-wall" text="Add Blocked Cell" onChange={this.toggleWall}></Checkbox>
                <Checkbox id="toggle-weight" text="Add Weighted Cell" onChange={this.toggleWeight}></Checkbox>
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
