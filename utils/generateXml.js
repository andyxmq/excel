const fs = require('fs');
const xlsx = require('node-xlsx').default;
const path = require('path');

var fileConfig = { // 待生成五种文件
  'docs': {filename:'docs.xlsx', path: path.join(__dirname,'../docs/')},
  'filters': {filename:'filters.xlsx', path: path.join(__dirname,'../docs/')},
  'groups': {filename:'groups.xlsx', path: path.join(__dirname,'../docs/')},
  'groups_pre': {filename:'groups_pre.xlsx', path: path.join(__dirname,'../docs/')},
  'recallGroup': {filename:'recallGroup.xlsx', path: path.join(__dirname,'../docs/')}
}

function writeExcel(data,pathname){
  var buffer = xlsx.build([{name: 'mySheetName', data: data}],option);
  fs.writeFileSync(pathname,buffer,{'flag':'w'})
}
/**生成excel文件 */
module.exports = function({data,type}){
  if(!fileConfig[type]) throw Error('type不能为空!');
  const fileInfo = fileConfig[type];
  var filePath = `${fileInfo['path']}${fileInfo['filename']}`
  writeExcel(data,filePath)
}