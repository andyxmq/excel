const fs = require('fs');
const path = require('path');
/**
 * @description: 所有压缩文件 
 * @param (String) filePath: 文件路径
 * @return (Array ) ：User/docs/filename.xml 
 */
module.exports = function(filePath){
  //根据文件路径读取文件，返回文件列表
  var result = fs.readdirSync(filePath);
  return result.map(item=>{
    return `${filePath}/${item}`
  });
}