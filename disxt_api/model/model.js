const mongoose =  require('mongoose');
const process = require("process");
mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
{useNewUrlParser: true,useUnifiedTopology:true })
.then(()=>{
    console.log("Successfully connect to Mongodb");
     seedData();
})
.catch((err =>{
    console.error("connection error",err);
    process.exit();
}))

// Schema = mongoose.Schema;
//const userSchema = new Schema({
const Users = mongoose.model('User', new mongoose.Schema({
    username : {type:String, unique: true,lowercase:true, required: 'invalid username'},
    password : {type:String,required: 'invalid password'},
    name : {type:String, required: 'invalid name'},
    lastname : {type:String, required: 'invalid lastname'},
    age : {type:Number, required: 'invalid age'},
    role : {type:String, default:'client'}
}));

const Products= mongoose.model('Product', new mongoose.Schema({
    name : {type:String, required: 'invalid product name'},
    price : {type:Number, required: 'invalid price'},
    description : {type:String},
    created_by : {type:String, required: 'invalid created_by'}
    
}));


const TokenRepos= mongoose.model('TokenRepos', new mongoose.Schema({
    username : {type:String},
    tokenkey : {type:String}
}));



        
        
function seedData ()
{
    
    Users.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
          new Users({
            username: "admin",
            password:"$2a$10$m6Mim4p.U8ftPB.IUlgfpe.x1wicUtoqwvMnYLQNZR.9/FeJqcdLK",
            name:"System Administrator",
            lastname:"admin",
            age:29,
            role:"admin"
          }).save(err => {
            if (err) {
              console.log("error", err);
            }
            
            console.log("added 'user'");
          })
        }
        
    });

}

module.exports={Users,Products,TokenRepos}