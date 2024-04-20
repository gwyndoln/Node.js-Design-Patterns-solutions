export default class TaskQueue {
  constructor(concurrency) {
    this.queue = [];
    this.running = 0;
    this.files = [];
    this.concurrency = concurrency || 4;
  }

  pushTask(task) {
    this.queue.push(task);
    process.nextTick(this.next.bind(this));
    return this;
  }

  next() {
    if (this.queue.length === 0 && this.running === 0) {
      return console.log(this.files);
    }

    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task((err) => {
        if (err) {
          console.log(err);
        }

        this.running--;
        process.nextTick(this.next.bind(this));
      });
      this.running++;
    }
  }
}
