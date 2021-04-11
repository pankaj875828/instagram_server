const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const {MONGO_URI} = require('./key');

mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log('connected')
})

mongoose.connection.on('error',(err)=>{
    console.log('error',err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


app.listen(PORT,console.log('server running on port:'+PORT))
