const express = require('express');
const app = express();

app.use(express.static('./dist'));

const port = 2333;
app.listen(port,() => {
    console.log(`该应用运行于：${port} 端口`)
})