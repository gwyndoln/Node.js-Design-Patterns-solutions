import { readFile, readdir } from "fs";
import { join } from "path";
import TaskQueue from "./TaskQueue.js";

function findKeyword(file, keyword, queue, cb) {
  readFile(file, (err, data) => {
    if (err) {
      return cb(err);
    }

    const match = data.toString().match(keyword);

    if (match) {
      queue.files.push(file);
    }

    return cb();
  });
}

function recursiveFindTask(dir, keyword, queue, cb) {
  readdir(dir, (err, files) => {
    if (err && err.code === "ENOTDIR") {
      return findKeyword(dir, keyword, queue, cb);
    }

    if (err) {
      return cb(err);
    }

    files.forEach((file) => {
      recursiveFind(join(dir, file), keyword, queue);
    });

    cb();
  });
}

function recursiveFind(dir, keyword, queue) {
  queue.pushTask((done) => recursiveFindTask(dir, keyword, queue, done));
}

const dir = process.argv[2];
const regex = new RegExp(process.argv[3], "gm");
const queue = new TaskQueue();

recursiveFind(dir, regex, queue);
