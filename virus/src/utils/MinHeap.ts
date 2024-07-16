import { Pessoa } from "../types/GraphTypes";

class MinHeap {
  private heap: { node: Pessoa; val: number }[];

  constructor() {
    this.heap = [];
  }

  insert(node: Pessoa, val: number): void {
    this.heap.push({ node, val });
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): Pessoa | null {
    if (this.heap.length === 0) {
      return null;
    }
    const minNode = this.heap[0].node;
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

  decreaseKey(node: Pessoa, newDistance: number): void {
    const index = this.heap.findIndex((n) => n.node.id === node.id);
    if (index !== -1) {
      this.heap[index].val = newDistance;
      this.bubbleUp(index);
    }
  }

  find(node: Pessoa): Pessoa | null {
    return this.heap.find((n) => n.node.id === node.id)?.node || null;
  }

  private bubbleUp(index: number): void {
    let element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element.val >= parent.val) break;
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    let element = this.heap[index];
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild !== undefined && leftChild.val < element.val) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild?.val < element.val) ||
          (swap !== null && rightChild !== undefined && leftChild !== undefined && rightChild.val < leftChild.val)
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
