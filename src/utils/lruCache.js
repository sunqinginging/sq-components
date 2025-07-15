export default class LRUCache {
  constructor(length) {
    this.length = length;
    this.data = {};
    this.dataLength = 0;
    this.listHead = null; // 沉水
    this.listTail = null; // fresh
    if (length < 1) {
      throw new Error(`invaild length`);
    }
  }

  moveToTail(curNode) {
    const tail = this.listTail;
    if (tail == curNode) {
      return;
    }
    const prevNode = curNode.prev;
    const nextNode = curNode.next;
    if (prevNode) {
      if (nextNode) {
        prevNode.next = nextNode;
      } else {
        delete prevNode.next;
      }
    }
    if (nextNode) {
      if (prevNode) {
        nextNode.prev = prevNode;
      } else {
        delete nextNode.prev;
      }
      if (this.listHead == curNode) {
        this.listHead = nextNode;
      }
    }

    delete curNode.next;
    delete curNode.prev;
    // 在链表末尾 重新建立 curNode的新关系
    if (tail) {
      tail.next = curNode;
      curNode.prev = tail;
    }
    this.listTail = curNode;
  }

  tryClean() {
    while (this.dataLength > this.length) {
      const head = this.listHead;
      if (head == null) {
        throw new Error("head is null");
      }
      const headNext = head.next;
      delete headNext.prev;
      delete head.next;

      this.listHead = headNext;

      delete this.data[head.key];
      this.dataLength = this.dataLength - 1;
    }
  }

  get(key) {
    const data = this.data;
    const curNode = data[key];
    if (!curNode) {
      return null;
    }
    if (curNode == this.listTail) {
      return curNode;
    }

    // curNode 移动到末尾
    this.moveToTail(curNode);

    return curNode.value;
  }

  set(key, value) {
    const data = this.data;
    const curNode = data[key];
    if (curNode == null) {
      // 新增数据
      const newNode = {
        key: key,
        value: value,
        // prev: null,
        // next: null,
      };
      this.moveToTail(newNode);
      data[key] = newNode;
      this.dataLength++;
      if (this.dataLength == 1) {
        // 如果是第一个元素 需要将其设置为head
        this.listHead = curNode;
      }
    } else {
      // 修改现有数据
      curNode.value = value;
      // 移动到末尾
      this.moveToTail(curNode);
    }

    // 清除超过的长度
    this.tryClean();
  }
}
