interface Node {
  id: number;
  distance: number;
}

class MinHeap {
  private heap: Node[];

  constructor() {
    this.heap = [];
  }

  insert(node: Node, distance: number): void {
    this.heap.push({ id: node.id, distance });
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): Node | null {
    if (this.heap.length === 0) {
      return null;
    }
    const minNode = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end) {
      this.heap[0] = end;
      this.bubbleDown(0);
    }
    return minNode;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  decreaseKey(node: Node, newDistance: number): void {
    const index = this.heap.findIndex((n) => n.id === node.id);
    if (index !== -1) {
      this.heap[index].distance = newDistance;
      this.bubbleUp(index);
    }
  }

  private bubbleUp(index: number): void {
    let element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element.distance >= parent.distance) break;
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    let element = this.heap[index];
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let leftChild: Node | undefined, rightChild: Node | undefined;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild !== undefined && leftChild.distance < element.distance) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild?.distance < element.distance) ||
          (swap !== null && rightChild !== undefined && leftChild !== undefined && rightChild.distance < leftChild.distance)
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }
}

export default MinHeap;