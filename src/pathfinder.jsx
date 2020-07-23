import React from 'react'
import Node from './node'
import './pathfinder.css'
import * as dijkstra from './algorithms/dijkstra'

const START_ROW = 10;
const START_COL = 5;
const TARGET_ROW = 10;
const TARGET_COL = 20;
const walls = new Set();

const EMPTY_NODE = 0;
const START_NODE = 1;
const TARGET_NODE = 2;
const WALL_NODE = 3;
const VISITED_NODE = 4;
const PATH_NODE = 5;

export default class Pathfinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
        this.refGrid = [];
    }

    // createNode(row, col) {
    //     return {
    //         row,
    //         col,
    //         isStart: row === START_ROW && col === START_COL,
    //         isTarget: row === TARGET_ROW && col === TARGET_COL,
    //         distance: Infinity,
    //         visited: false,
    //         isWall: false,
    //         previous: null,
    //     };
    // }

    createNode(row, col) {
        const node_t = (row === START_ROW && col === START_COL) ? START_NODE : 
                    (row === TARGET_ROW && col === TARGET_COL) ? TARGET_NODE :
                    EMPTY_NODE;
        return {
            row: row,
            col: col,
            type: node_t,
            distance: Infinity,
            previous: null,
        };
    }

    initGrid() {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            const refList = [];
            for (let col = 0; col < 50; col++) {
                currentRow.push(this.createNode(row, col));
                refList.push(React.createRef());
            }
            grid.push(currentRow);
            this.refGrid.push(refList);
        }
        return grid;
    }

    resetGrid() {
        this.setState({grid: this.initGrid()});
    }

    getNewGridWithWallToggled(grid, row, col) {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;
        return newGrid;
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

    // handleMouseDown(row, col) {
    //     this.refGrid[row][col].current.updateNodeType(WALL_NODE);
    // }

    // use a set to keep track of all mouseovered nodes
    // and change state at mouseup
    handleMouseDown(row, col) {
        this.setState({mouseIsPressed: true});
        if ((row === START_ROW && col === START_COL) || (row === TARGET_ROW && col === TARGET_COL)) {
            return;
        }
        const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
        //this.setState({grid: newGrid, mouseIsPressed: true});
        this.state.grid = newGrid;

        if (walls.has(row * 50 + col)) {
            walls.delete(row * 50 + col);
            document.getElementById(`node-${row}-${col}`).classList.remove('node-mouseover');
        } else {
            walls.add(row * 50 + col);
            document.getElementById(`node-${row}-${col}`).className = 'node node-mouseover';
        }
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        if ((row === START_ROW && col === START_COL) || (row === TARGET_ROW && col === TARGET_COL)) {
            return;
        }
        
        // const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
        this.state.grid[row][col].isWall = !this.state.grid[row][col].isWall;
        // document.getElementById(`node-${row}-${col}`).className = 'node node-mouseover';
        if (walls.has(row * 50 + col)) {
            walls.delete(row * 50 + col);
            document.getElementById(`node-${row}-${col}`).classList.remove('node-mouseover');
        } else {
            walls.add(row * 50 + col);
            document.getElementById(`node-${row}-${col}`).className = 'node node-mouseover';
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
                    // document.getElementById(`node-${node.row}-${node.col}`).classList.remove('node-mouseover');
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                }
                // show shortest path
                if (i === visited.length - 1) {
                    setTimeout(() => {
                        for (let j = 1; j < path.length - 1; j++) {
                            const pathnode = path[j];
                            setTimeout(() => {
                                document.getElementById(`node-${pathnode.row}-${pathnode.col}`).className = 'node node-path';
                            }, j * 50)
                            
                        }
                    }, 500);
                    
                }
            }, i * 10);
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
                                const {row, col, isStart, isTarget, isWall} = node;
                                return (
                                    <Node 
                                        key={nodeIndex}
                                        row = {row}
                                        col = {col}
                                        isStart={isStart} 
                                        isTarget={isTarget} 
                                        isWall={isWall}
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
