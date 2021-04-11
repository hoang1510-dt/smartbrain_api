const express = require('express');

const port = 3000;
const app = express();

app.get('/', (req, res) =>{
    console.log(res)
    res.send('tjis is work king')
} )

app.listen(port,()=>{
    console.log("app is running on port",port)
});

