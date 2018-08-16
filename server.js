var express = require('express');
var nodeExcel = require('excel-export');
var path = require('path');
var axios = require('axios');
var app = express();
var fs = require('fs');
var archiver = require('archiver');
var generateXml = require('./utils/generateXml');
var generateTargetData = require('./utils/generateTargetData');
const fileDisplay = require('./utils/fileDisplay');

const getDownLoadContext = ()=>{
  return new Promise( (resolve,reject) => {
    axios.get('http://10.126.40.17:6009/user/analysis?userid=574202884&top=1000&docType=doc&recall=true&group=true')
    .then(response => {
      resolve(response.data)
    })
    .catch(reject)
  })
}

app.get('/generateExample', function(req,res){
  getDownLoadContext().then(data => {
    // 生成docs
    // var docsData = data['result']['docs'];
    // generateXml({data: generateTargetData(docsData), type: 'docs'})

    // var recallGroupData = data['result']['filters'];
    // generateXml({data: generateTargetData(filtersData), type: 'filters'})

    // var groupsData = data['result']['Group']["groups"];
    // generateXml({data: generateTargetData(groupsData), type: 'groups'})

    var groups_preData = data['result']['groups_pre'];
    generateXml({data: generateTargetData(groups_preData), type: 'groups_pre'})

    var recallGroupData = data['result']['recallGroup'];
    generateXml({data: generateTargetData(recallGroupData), type: 'recallGroup'})

    res.send('ss');
  });
})

app.get('/downZip', function(req,res){
  var archive = archiver('zip');

  archive.on('error', function(err) {
    res.status(500).send({error: err.message});
  });

  //on stream closed we can end the request
  archive.on('end', function() {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  //set the archive name
  res.attachment('评测数据.zip');

  //this is the streaming magic
  
  archive.pipe(res);
  var files = fileDisplay(path.join(__dirname,'docs'));
  console.log(files, 'files')
  for(var i in files) {
    archive.file(files[i], { name: path.basename(files[i]) });
  }
  archive.finalize();
})
// app.get('/Excel', function(req, res){
//   getDownLoadContext().then(data => {
//     var conf ={};
// 	  conf.stylesXmlFile = path.join(__dirname,'docs.xml');
//     conf.name = "mysheet";
//     var currentData = data['result']['docs'];
//     var colsName = Object.keys(currentData[0]);

//     conf.cols = [];
//     colsName.forEach(item=>{
//       let tempConfig = {
//         caption: item,
//         type: 'string',
//         width: 350
//       };
//       let set = new Set(['factors','position','topics'])
//       if(set.has(item)){
//         tempConfig.type = 'object'
//         tempConfig.beforeCellWrite = function(row, cellData){
//           return `${cellData};`
//         }
//       }
//       conf.cols.push(tempConfig)
//     });

//     conf.rows = [];
//     currentData.forEach(item=>{
//       var temp = [];
//       for(var key in item){
//         temp.push(item[key].toString())
//       }
//       conf.rows.push(temp)
//     });
   
//     var result = nodeExcel.execute(conf);
//     var result1 = nodeExcel.execute(conf);
//   	res.setHeader('Content-Type', 'application/vnd.openxmlformats');
//   	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
//   	res.end(result, 'binary');
//   }) 
// });

app.get('/downZip1', function(req,res){
  var archive = archiver('zip');

  archive.on('error', function(err) {
    res.status(500).send({error: err.message});
  });

  //on stream closed we can end the request
  archive.on('end', function() {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  //set the archive name
  res.attachment('archive-name.zip');

  //this is the streaming magic
  archive.pipe(res);

  var files = [__dirname + '/docs/1.xlsx', __dirname + '/docs/file2.txt'];

  for(var i in files) {
    archive.file(files[i], { name: path.basename(files[i]) });
  }



  archive.finalize();
})

app.get('/generateXml', function(req, res){
  const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
  const range = {s: {c: 0, r:0 }, e: {c:0, r:3}}; // A1:A4
  const option = {'!merges': [ range ]};
  var buffer = xlsx.build([{name: "aaa", data: data}], option); 
  fs.writeFileSync('1.xlsx',buffer,{'flag':'w'});
  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
  res.end(buffer, 'binary');
})

app.get("/getZip",function(req, res){
  var file = fs.readFileSync(__dirname + '/example.zip', 'binary');

  res.setHeader('Content-Length', file.length);
  res.write(file, 'binary');
  res.end();
})

app.get('/test', function(req, res) {

  var archive = archiver('zip');

  archive.on('error', function(err) {
    res.status(500).send({error: err.message});
  });

  //on stream closed we can end the request
  archive.on('end', function() {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  //set the archive name
  res.attachment('archive-name.zip');

  //this is the streaming magic
  archive.pipe(res);

  var files = [__dirname + '/docs/1.xlsx', __dirname + '/docs/file2.txt'];

  for(var i in files) {
    archive.file(files[i], { name: path.basename(files[i]) });
  }



  archive.finalize();

});

// 574202884
app.listen(3000);
console.log('Listening on port 3000');