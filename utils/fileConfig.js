const path = require('path');
const baseFilePath = '../docs/';
module.exports = { // 待生成五种文件
  'docs': {filename:'docs.xlsx', path: path.join(__dirname,  baseFilePath)},
  'filters': {filename:'filters.xlsx', path: path.join(__dirname,  baseFilePath)},
  'groups': {filename:'groups.xlsx', path: path.join(__dirname,  baseFilePath)},
  'groups_pre': {filename:'groups_pre.xlsx', path: path.join(__dirname,  baseFilePath)},
  'recallGroup': {filename:'recallGroup.xlsx', path: path.join(__dirname,  baseFilePath)}
}