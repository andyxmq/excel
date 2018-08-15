var express = require('express');
var nodeExcel = require('excel-export');
var path = require('path');
var axios = require('axios');
var app = express();
var fs = require('fs');
var archiver = require('archiver');

const getDownLoadContext = ()=>{
  return new Promise( (resolve,reject) => {
    axios.get('http://10.126.40.17:6009/user/analysis?userid=574202884&top=1000&docType=doc')
    .then(response => {
      resolve(response.data)
    })
    .catch(reject)
  })
}
app.get('/Excel', function(req, res){
  getDownLoadContext().then(data => {
    var conf ={};
	  conf.stylesXmlFile = path.join(__dirname,'docs.xml');
    conf.name = "mysheet";
    var currentData = data['result']['docs'];
    var colsName = Object.keys(currentData[0]);

    conf.cols = [];
    colsName.forEach(item=>{
      let tempConfig = {
        caption: item,
        type: 'string',
        width: 350
      };
      let set = new Set(['factors','position','topics'])
      if(set.has(item)){
        tempConfig.type = 'object'
        tempConfig.beforeCellWrite = function(row, cellData){
          return `${cellData};`
        }
      }
      conf.cols.push(tempConfig)
    });

    conf.rows = [];
    currentData.forEach(item=>{
      var temp = [];
      for(var key in item){
        temp.push(item[key].toString())
      }
      conf.rows.push(temp)
    });
   
    var result = nodeExcel.execute(conf);
    var result1 = nodeExcel.execute(conf);
  	res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
  	res.end(result, 'binary');
  }) 
});

app.get('/downZip', function(req,res){
  // create a file to stream archive data to.
  var output = fs.createWriteStream(__dirname + '/example.zip');
  var archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });
  
  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', function() {
    console.log('Data has been drained');
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', function(err) {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(output);

  // append a file from stream
  var file1 = __dirname + '/docs/Report (1).xlsx';
  archive.append(fs.createReadStream(file1), { name: 'Report (1).xlsx' });

  // append a file from string
  archive.append('string cheese!', { name: 'file2.txt' });

  archive.finalize();
})


// 574202884
app.listen(3000);
console.log('Listening on port 3000');