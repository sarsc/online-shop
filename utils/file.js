const fs = require('fs');

const deleteFile = (filePath) => {
  // const filePath = file[0] === '/' ? file.substring(1) : file;
  fs.unlink(filePath.substring(1), (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
