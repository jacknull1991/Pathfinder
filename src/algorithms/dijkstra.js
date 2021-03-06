const START_NODE = 1;
const TARGET_NODE = 2;
const WALL_NODE = 3;
const VISITED_NODE = 4;

export const dijkstra = (grid, start, target) => {
    // this holds all nodes in the order we visited them
    const visited = [];
    start.distance = 0;
    const unvisited = getAllNodes(grid);
    while (!!unvisited.length) {
        sortByDistance(unvisited); // prob should use min-heap
        const next = unvisited.shift();
        // handles walls
        if (next.type === WALL_NODE) continue;
        // cannot move anywhere, stop
        if (next.distance === Infinity) {
            const path = [];
            start.type = START_NODE;
            return {visited, path};
        }

        next.type = VISITED_NODE;
        visited.push(next);
        // reach target, stop
        if (next === target) {
            const path = [];
            getShortestPath(target, path);
            start.type = START_NODE;
            target.type = TARGET_NODE;
            return {visited, path};
        }
        updateNeighbors(next, grid);
    }
    const path = [];
    start.type = START_NODE;
    return {visited, path};
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
    const neighbors = getUnvisitedNeighbors(curr, grid);
    neighbors.forEach((n) => {
        n.distance = curr.distance + 1 + n.weight;
        n.previous = curr;
    });
}

// get all unvisited neighbors
function getUnvisitedNeighbors(curr, grid) {
    const neighbors = [];
    const {row, col} = curr;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => neighbor.type !== VISITED_NODE)
}

function getShortestPath(node, path) {
    path.unshift(node);
    if (node.previous !== null) {
        getShortestPath(node.previous, path);
    }
}
