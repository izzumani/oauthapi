// console.log("Disxt API for Products.");
// what is  express
const express =require('express');

// what is the purpose for body-parser
const bodyParser = require('body-parser');

// why use the code below instead of adding router
const app = express();

const userRoutes = require('./routes/userRoutes')

// app.get('/',function(req,res){
// res.send("Welcome to disx APIS");
// next();
// });

app.use('/',userRoutes);

app.use('/users',userRoutes);

app.listen(3000,()=> console.log(`listening on port 3000`));
