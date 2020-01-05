/**
 * 利用二叉堆实现最小优先队列
 * 
 * 二叉堆是一个数组，它可以被看成一个近似的完全二叉树，树的根节点是 A[0]
 * 给定一个节点的下标 i，我们可以很容易计算得到它父节点、左孩子和右孩子的下标：
 * PARENT(i) return Math.floor((i - 1) / 2)
 * LEFT(i)   return 2i + 1
 * RIGHT(i)  return 2i + 2
 * 通过位运算优化
 * PARENT(i) return (i - 1) >> 1
 * LEFT(i)   return (i << 1) + 1
 * RIGHT(i)  return (i << 1) + 2
 * 
 * 堆性质：
 * 最大二叉堆：除了根节点以外的所有节点 i 都要满足：A[PARENT(i)] >= A[i]
 * 最小二叉堆：除了根节点以外的所有节点 i 都要满足：A[PARENT(i)] <= A[i]
 */

class BinaryHeap {
  constructor(comparer) {
    this._array = [];
    this._comparer = comparer || this._defaultComparer;
  }

  get length() {
    return this._array.length;
  }

  push(element) {
    this._array.push(element);
    this._sinkDown(this._array.length - 1);
  }

  pop() {
    if (this._array.length <= 0) {
      throw new Error("heap underflow");
    }
    let ret = this._array[0];
    this._array[0] = this._array[this._array.length - 1];
    this._array.pop();
    this._bubbleUp(0);
    return ret;
  }

  _parent(i) { return (i - 1) >> 1; }
  
  _left(i)   { return (i << 1) + 1; }
  
  _right(i)  { return (i << 1) + 2; }

  _sinkDown(i) {
    if (i <= 0) return;
    let p = this._parent(i);
    if (this._comparer(this._array[i], this._array[p]) < 0) {
      [this._array[p], this._array[i]] = [this._array[i], this._array[p]];
      this._sinkDown(p);
    }
  }

  _bubbleUp(i) {
    let l = this._left(i)
    let r = this._right(i)
    let mini = i
    if (l < this._array.length && this._comparer(this._array[l], this._array[mini]) < 0) {
      mini = l
    }
    if (r < this._array.length && this._comparer(this._array[r], this._array[mini]) < 0) {
      mini = r
    }
    if (mini !== i) {
      [this._array[mini], this._array[i]] = [this._array[i], this._array[mini]]
      this._bubbleUp(mini)
    }
  }

  _defaultComparer(a, b) {
    if (a < b)  { return -1; }
    return 1;
  }
}

/**
 * 地图节点
 */
class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.reset();
  }

  reset() {
    this.g = 0;
    this.h = 0;
    this.f = this.g + this.h;
    this.parent = null;
    this.inopenset = false;
    this.incloseset = false;
  }
}

class AStar {
  constructor(mapData) {
    this._mapData = mapData;
    this._mapNodes = [];
    this._dirtyNodes = [];
    this._createMapNodes();
  }

  findPath(startX, startY, endX, endY) {
    this._resetMapNodes();
    let openSet = new BinaryHeap((a, b) => a.f < b.f ? -1 : 1);
    let startNode = this._getNode(startX, startY);
    let endNode = this._getNode(endX, endY);
    if (!startNode || !endNode) {
      throw new Error("invalid position.");
    }

    openSet.push(startNode);

    while (openSet.length > 0) {
      let currentNode = openSet.pop();
      currentNode.incloseset = true;

      // 找到终点，结束
      if (currentNode === endNode) {
        return this._pathTo(currentNode);
      }

      let neighbors = this._getNeighbors(currentNode);
      for (let neighbor of neighbors) {
        if (neighbor.incloseset) {
          continue;
        }

        let gValue = this._getG(neighbor, currentNode);
        let hValue = this._getH(neighbor, endNode);

        if (neighbor.inopenset) {
          if (gValue + hValue < neighbor.f) {
              neighbor.g = gValue;
              neighbor.h = hValue;
              neighbor.parent = currentNode;
          }
        } else {
          neighbor.g = gValue;
          neighbor.h = hValue;
          neighbor.parent = currentNode;
          openSet.push(neighbor);
          neighbor.inopenset = true;
          this._dirtyNodes.push(neighbor);
        }
      }
    }
  }

  _createMapNodes() {
    for (let i = 0; i < this._mapData.length; i++) {
      let nodes = [];
      for (let j = 0, row = this._mapData[i]; j < row.length; j++) {
        nodes[j] = new Node(i, j);
      }
      this._mapNodes[i] = nodes;
    }
  }

  _resetMapNodes() {
    for (let node of this._dirtyNodes) {
      node.reset();
    }
    this._dirtyNodes = [];
  }

  _getNode(x, y) {
    if (this._mapData[x] && this._mapData[x][y] === 0) {
      return this._mapNodes[x][y];
    }
  }

  _getNeighbors(node) {
    let ret = [];
    let x = node.x;
    let y = node.y;

    let n1 = this._getNode(x - 1, y - 1);
    let n2 = this._getNode(x - 1, y + 1);
    let n3 = this._getNode(x + 1, y + 1);
    let n4 = this._getNode(x + 1, y - 1);
    let n5 = this._getNode(x, y - 1);
    let n6 = this._getNode(x, y + 1);
    let n7 = this._getNode(x - 1, y);
    let n8 = this._getNode(x + 1, y);

    n1 && ret.push(n1);
    n2 && ret.push(n2);
    n3 && ret.push(n3);
    n4 && ret.push(n4);
    n5 && ret.push(n5);
    n6 && ret.push(n6);
    n7 && ret.push(n7);
    n8 && ret.push(n8);

    return ret;
  }

  _getG(node, curr) {
    if (curr.x !== node.x && curr.y !== node.y) {
        return curr.g + 1.4;
    }
    return curr.g + 1;
  }

  _getH(node, end) {
      return Math.abs(end.x - node.x) + Math.abs(end.y - node.y);
  }

  _pathTo(node) {
    let path = [];
    let curr = node;
    while (curr.parent) {
      path.unshift({x: curr.x, y: curr.y});
      curr = curr.parent;
    }
    return path;
  }
}

module.exports = AStar;