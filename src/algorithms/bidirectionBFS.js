const START_NODE = 1;
const TARGET_NODE = 2;
const WALL_NODE = 3;
const VISITED_NODE = 4;

export const bidirectionBFS = (grid, start, target) => {
    const previous1 = new Map();
    const previous2 = new Map();
    const visited1 = new Map();
    const visited2 = new Map();
    const queue1 = [];
    const queue2 = [];
    const visited = []; // contains both front and back nodes we explore in order
    queue1.push({ node: start, dist: 0 });
    queue2.push({ node: target, dist: 0 });
    visited1.set(start, 0);
    visited2.set(target, 0);
    // visited.push(start);

    while (queue1.length > 0 || queue2.length > 0) {
        if (queue1.length > 0) {
            const { node, dist } = queue1.shift();
            node.type = VISITED_NODE;
            visited.push(node);
            if (visited2.has(node)) {
                const path1 = getPath(previous1, node);
                const path2 = getPath(previous2, node);
                const path = [];
                path1.forEach(e => path.unshift(e));
                path2.forEach(e => path.push(e));
                // make sure start and target nodes are at ends
                visited.shift();
                visited.shift();
                visited.unshift(start);
                visited.push(target);
                start.type = START_NODE;
                target.type = TARGET_NODE;
                return {visited, path}; 
            }
            const neighbors = getNeighbors(grid, node);
            for (let neighbor of neighbors) {
                if (!visited1.has(neighbor)) {
                    previous1.set(neighbor, node);
                    queue1.push( {node: neighbor, dist: dist + 1 });
                    visited1.set(neighbor, dist + 1);
                }
            }

        }

        if (queue2.length > 0) {
            const { node, dist } = queue2.shift();
            node.type = VISITED_NODE;
            visited.push(node);
            if (visited1.has(node)) {
                const path1 = getPath(previous1, node);
                const path2 = getPath(previous2, node);
                const path = [];
                path1.forEach(e => path.unshift(e));
                path2.forEach(e => path.push(e));
                visited.shift();
                visited.shift();
                visited.unshift(start);
                visited.push(target);
                start.type = START_NODE;
                target.type = TARGET_NODE;
                return {visited, path};
            }

            const neighbors = getNeighbors(grid, node, false);
            for (let neighbor of neighbors) {
                if (!visited2.has(neighbor)) {
                    previous2.set(neighbor, node);
                    queue2.push( {node: neighbor, dist: dist + 1 });
                    visited2.set(neighbor, dist + 1);
                }
            }
        }
    }

    const path = [];
    start.type = START_NODE;
    target.type = TARGET_NODE;
    return {visited, path};
}

function getNeighbors(grid, node, searchClockwise = true) {
    const neighbors = [];
    const row = node.row, col = node.col;
    if (searchClockwise) {
        if (row > 0 && grid[row - 1][col].type !== WALL_NODE) {
            neighbors.push(grid[row - 1][col]);
        }
        if (col > 0 && grid[row][col - 1].type !== WALL_NODE) {
            neighbors.push(grid[row][col - 1]);
        }
        if (row < grid.length - 1 && grid[row + 1][col].type !== WALL_NODE) {
            neighbors.push(grid[row + 1][col]);
        }
        if (col < grid[0].length - 1 && grid[row][col + 1].type !== WALL_NODE) {
            neighbors.push(grid[row][col + 1]);
        }
    } else {
        if (row < grid.length - 1 && grid[row + 1][col].type !== WALL_NODE) {
            neighbors.push(grid[row + 1][col]);
        }
        if (col < grid[0].length - 1 && grid[row][col + 1].type !== WALL_NODE) {
            neighbors.push(grid[row][col + 1]);
        }
        if (row > 0 && grid[row - 1][col].type !== WALL_NODE) {
            neighbors.push(grid[row - 1][col]);
        }
        if (col > 0 && grid[row][col - 1].type !== WALL_NODE) {
            neighbors.push(grid[row][col - 1]);
        }
    }
        
    return neighbors;
}

function getPath(previous, target) {
    const path = [];
    let node = target;
    path.push(node);
    console.log(previous.get(target));
    while (previous.get(node) != null) {
        console.log("123");
        node = previous.get(node);
        path.push(node);
    }
    return path;
}