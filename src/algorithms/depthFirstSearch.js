const WALL_NODE = 3;
const VISITED_NODE = 4;

export function dfs(grid, start, target) {
    const stack = [];
    const visited = [];
    stack.push(start);

    while (!!stack.length) {
        const next = stack.pop();

        if (next.type === WALL_NODE || next.type === VISITED_NODE) continue;

        next.type = VISITED_NODE;
        visited.push(next);

        if (next === target) {
            const path = [];
            getPath(target, path);
            return {visited, path};
        }

        const {row, col} = next;
        // go east first and clockwise
        if (row > 0 && grid[row - 1][col].type !== VISITED_NODE) {
            grid[row - 1][col].previous = next;
            stack.push(grid[row - 1][col]);
        }
        if (col > 0 && grid[row][col - 1].type !== VISITED_NODE) {
            grid[row][col - 1].previous = next;
            stack.push(grid[row][col - 1]);
        }
        if (row < grid.length - 1 && grid[row + 1][col].type !== VISITED_NODE) {
            grid[row + 1][col].previous = next;
            stack.push(grid[row + 1][col]);
        }
        if (col < grid[0].length - 1 && grid[row][col + 1].type !== VISITED_NODE) {
            grid[row][col + 1].previous = next;
            stack.push(grid[row][col + 1]);
        }
    }
}

function getPath(node, path) {
    path.unshift(node);
    if (node.previous !== null) {
        getPath(node.previous, path);
    }
}