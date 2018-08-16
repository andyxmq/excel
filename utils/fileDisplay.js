const fs = require('fs');
const path = require('path');
module.exports = function(filePath){
  //根据文件路径读取文件，返回文件列表
  var result = fs.readdirSync(filePath);
  return result.map(item=>{
    return `${filePath}/${item}`
  });
}