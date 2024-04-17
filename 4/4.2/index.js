import { readdir } from "fs";
import { join } from "path";

function finish(err, filesList) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(filesList);
}

function listNestedFiles(dir, filesList, cb) {
  readdir(dir, (err, files) => {
    if (err && err.code === "ENOTDIR") {
      filesList.push({ path: dir, type: "file" });
      return process.nextTick(() => cb(null, filesList));
    }

    if (err) {
      return cb(err);
    }

    filesList.push({ path: dir, type: "dir" });

    if (files.length === 0) {
      return process.nextTick(() => cb(null, filesList));
    }

    let completed = 0;
    let hasErrors = false;

    function done(err) {
      if (err) {
        hasErrors = true;
        return cb(err);
      }

      if (++completed === files.length && !hasErrors) {
        return cb(null, filesList);
      }
    }

    files.forEach((file) => {
      file = join(dir, file);
      listNestedFiles(file, filesList, done);
    });
  });
}

listNestedFiles(process.argv[2], [], finish);
