import fs from 'fs';
import express from 'express';
import path from 'path';

import serverRenderer from './js/boot-server';

// 重要：切換是否要啟用 server-rendering
const $UNIVERSAL = true;

var app = express();
app.use('/build', express.static(path.join(__dirname, 'build')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

if( $UNIVERSAL ){
    serverRenderer(app);
}else{
    const index = fs.readFileSync('assets/index.html', {encoding: 'utf-8'});
    // 如果要關掉 server rendering 時，手法如下：
    // 手法就是同樣在 server 上模擬一個空白的字串返還，讓 client 端有東西可解開就好
    const str = index.replace('${markup}', '').replace('${state}', null);
    app.get('*', (req, res) => {
      // 將組合好的 html 字串返還，request 處理至此完成
      res.send(str);
    });
}

// 示範可以正確在 server 上處理 404 頁面
app.get('*', function(req, res) {
    res.send('Server.js > 404 - Page Not Found');
})

// Catch server error，注意要四個參數
app.use((err, req, res, next) => {
  console.error("Error on request %s %s", req.method, req.url);
  console.error(err.stack);
  res.status(500).send("Server error");
});

process.on('uncaughtException', evt => {
  console.log( 'uncaughtException 抓到了' );
})

app.listen(3000, function(){
    console.log('Listening on port 3000');
});
