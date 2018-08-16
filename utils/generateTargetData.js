/**originData: {} */
function jsonArrayToArray(data,key){ // key: null 不插入
  return data.map(item=>{
    let itemArray = key ? [key] : [];

    item['factors'] = JSON.stringify(item['factors']);
    item['position'] = JSON.stringify(item['position']);
    item['topics'] = JSON.stringify(item['topics']);

    [].push.apply(itemArray,Object.values(item))
    return itemArray;
  })
}
module.exports = function(originData){
  /**excel 表头 */
  var _header = ['docid','title','source','url','score','compare','vectorScore','scalaScore','factors','position','topics'];
  var result = [_header];
  if(!Array.isArray(originData)){
    _header.unshift("type");
    result = [_header];
    for(let key in originData){
      let eachItem = originData[key];
      [].push.apply(result, jsonArrayToArray(eachItem,key));
    }
  }else {
    [].push.apply(result,jsonArrayToArray(originData))
  }
  return result;
}