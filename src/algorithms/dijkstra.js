
export function dijkstra(grid, start, target) {
    // this holds all nodes in the order we visited them
    const visited = [];
    start.distance = 0;
    const unvisited = getAllNodes(grid);
    while (!!unvisited.length) {
        sortByDistance(unvisited); // prob should use min-heap
        const next = unvisited.shift();
        // handles walls
        if (next.isWall) continue;
        // cannot move anywhere, stop
        if (next.distance === Infinity) return visited;

        next.visited = true;
        visited.push(next);
        // reach target, stop
        if (next === target) return visited;
        updateNeighbors(next, grid);
    }
}

function getAllNodes(grid) {
    const nodes = [];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            nodes.push(grid[row][col]);
        }
    }
    return nodes;
}

function sortByDistance(nodes) {
    nodes.sort((a, b) => a.distance - b.distance);
}

function updateNeighbors(curr, grid) {
    const neighbors = getNeighbors(curr, grid);
    neighbors.forEach((n) => {
        n.distance = curr.distance + 1;
        n.previous = curr;
    });
}

// get all unvisited neighbors
function getNeighbors(curr, grid) {
    const neighbors = [];
    const {row, col} = curr;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.visited)
}

