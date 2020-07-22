import React from 'react'
import Node from './node'
import './pathfinder.css'
import * as dijkstra from './algorithms/dijkstra'

const START_ROW = 10;
const START_COL = 5;
const TARGET_ROW = 10;
const TARGET_COL = 40;


export default class Pathfinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    createNode(row, col) {
        return {
            row,
            col,
            isStart: row === START_ROW && col === START_COL,
            isTarget: row === TARGET_ROW && col === TARGET_COL,
            distance: Infinity,
            visited: false,
            isWall: false,
            previous: null,
        };
    }

    initGrid() {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                currentRow.push(this.createNode(row, col));
            }
            grid.push(currentRow);
        }
        return grid;
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

    handleMouseDown(row, col) {
        const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    runDijkstra() {
        const grid = this.state.grid;
        const start = grid[START_ROW][START_COL];
        const target = grid[TARGET_ROW][TARGET_COL];
        const visited = dijkstra.dijkstra(grid, start, target);
        for (let i = 0; i < visited.length; i++) {
            setTimeout(() => {
                const node = visited[i];
                if (i > 0 && i < visited.length - 1) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                }
            }, i * 10);
        }
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
            <div className="control-panel">Control Bar</div>
                <button onClick={() => this.runDijkstra()}>Dijkstra</button>
            <div className="display-panel">Display Bar</div>
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
                                        onMouseUp={() => this.handleMouseUp()}></Node>
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
