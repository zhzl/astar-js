let AStar = require("./astar")

let map = [
  [0,0,0,0,0,1,0,0,0,0],
  [0,1,1,0,0,1,0,0,0,0],
  [0,1,1,0,0,1,0,0,0,0],
  [0,1,0,0,0,1,0,0,0,0],
  [0,1,0,1,1,1,0,0,1,0],
  [0,1,0,1,0,0,0,0,1,0],
  [0,1,0,1,0,1,1,1,1,0],
  [0,1,0,1,0,1,0,0,0,0],
  [0,1,0,1,0,1,0,0,0,0],
  [0,1,0,0,0,1,0,0,0,0],
]

let astar = new AStar(map);
let path = astar.findPath(9, 0, 9, 9);

for (let p of path) {
    map[p.x][p.y] = '.'
}

for (let line of map) {
    console.log(line.toString().replace(/,/g, ' '))
}
