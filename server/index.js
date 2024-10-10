const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const GRID_SIZE = 20;

function isValid(x, y) {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}


function getNeighbors(x, y) {
  return [
    { x: x - 1, y }, 
    { x: x + 1, y }, 
    { x, y: y - 1 }, 
    { x, y: y + 1 } 
  ].filter(({ x, y }) => isValid(x, y));
}

function dfs(start, end, visited) {
  const stack = [start];
  const cameFrom = {};

  while (stack.length > 0) {
    const { x, y } = stack.pop();

    //get path after findinf end point
    if (x === end.x && y === end.y) {
      const path = [];
      let curr = end;

      while (curr) {
        path.push(curr);
        curr = cameFrom[`${curr.x},${curr.y}`];
      }

      return path.reverse();
    }

    visited[x][y] = true;

    for (const neighbor of getNeighbors(x, y)) {
    //will traverse through neighbor 
      if (!visited[neighbor.x][neighbor.y]) {
        stack.push(neighbor);
        cameFrom[`${neighbor.x},${neighbor.y}`] = { x, y };
      }
    }
  }

  return [];
}

app.post('/shortest-path', (req, res) => {
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).send('Start and end coordinates are required');
  }

  const visited = Array(GRID_SIZE)
    .fill(false)
    .map(() => Array(GRID_SIZE).fill(false));

  const path = dfs(start, end, visited);

  if (path.length === 0) {
    return res.status(404).send('No path found');
  }

  res.json(path);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
