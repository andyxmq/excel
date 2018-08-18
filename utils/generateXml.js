const fs = require('fs');
const xlsx = require('node-xlsx').default;
const fileConfig = require('./fileConfig');
function writeExcel(data,pathname){
  var buffer = xlsx.build([{name: 'mySheetName', data: data}]);
  fs.writeFileSync(pathname,buffer,{'flag':'w'})
}
/**生成excel文件 */
module.exports = function({data,type}){
  if(!fileConfig[type]) throw Error('type不能为空!');
  const fileInfo = fileConfig[type];
  var filePath = `${fileInfo['path']}${fileInfo['filename']}`
  writeExcel(data,filePath)
}