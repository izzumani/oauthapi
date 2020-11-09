'use strict';
const usermodel = require('../model/userModel');
const userrepo = require('../repo/userRepo');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const process = require("process");
const moment = require("moment");

exports.tokenValidation = (req,res,next)=>{
    // check if the request headers for authorization value
    if (!req.headers.authorization){
           // if its missing return 401 error
        return res.status(401).send({error: 'No Token key supplied'})
    }
    // get the details from the request header authorization field 
    let _token = req.headers.authorization;
    
    let _tokenDetails = null;

    try {
            // decode the key
        _tokenDetails = jwt.decode(_token,process.env.SECRET_KEY)
    } catch (err) {
        return res.status(401).send({error:"Invalid Token Details"});
    }
    if (_tokenDetails.exp <=moment().unix()){
        // check the key for its expiry
        return res.status(401).send({error:"Token has expired"});
    }
        
    if (userrepo.user_token_expiry.filter(userToken => userToken.token ==_tokenDetails.token).length <=0)  {
        // check if the token key is still valid from the databasse
        return res.status(401).send({error:"Token does not exist"});
    }
        
    req.body.isCurrentUserAdmin=_tokenDetails.isAdmin;
    // call the next function
    next();
}

// login function
exports.login =(req,res) =>{
    // pass the username and password from the body for validation and tokenkey generation
    let tokenKey = GenerateJWTTokeKey(req.body.username,req.body.password);
    
    if(tokenKey){
       // return token key 
        res.status(200).send({"status":true,"token":tokenKey});
        

    }else{
        // invalid credentials
        res.status(401).send({"status":false,"token":null});
    }
        

}


// logout function
exports.logout =(req,res) =>{

    userrepo.user_token_expiry.forEach((element,index)=>{
        if (element.username==username) userrepo.user_token_expiry.splice(index, 1);
    });
    res.status(200).send({"status":true,"message":"Successfully Logged out"});
        

}


exports.get_user_list = (req,res)=>{
    // get list of all user. Admin only
    if (!req.body.isCurrentUserAdmin)  return res.status(401).send({error:"Access denied. cannot view users list"});    
    res.send(userrepo.list_of_users);
    
}

exports.get_user = (req,res)=>{
    if (!req.body.isCurrentUserAdmin)  return res.status(401).send({error:"Access denied. cannot view user details"});    
    // get user details. Admin only
    res.send(userrepo.list_of_users.filter(user => user.username ==req.query.username));
// 
}
// add new users
exports.add_new_user = (req,res)=>{
    // Add new users. Admin only
    if (!req.body.isCurrentUserAdmin)  return res.status(401).send({error:"Access denied. cannot assign users"});
    const users = {
        name:req.body.name==undefined ? null :req.body.name,
        username:req.body.username==undefined ? null :req.body.username,
        password:req.body.password==undefined ? null :bcrypt.hashSync(req.body.password, 8),
        lastname:req.body.lastname==undefined ? null :req.body.lastname,
        age:req.body.age==undefined ? false :req.body.age,
        role:req.body.role==undefined ? null :req.body.role,
    }
    
// validate registration details and send error message if invaliid
    if (users.name==null) res.status(400).send({"status":false,"message":"name is Invalid"});
    if (users.username==null) res.status(400).send({"status":false,"message":"Username is Invalid"});
    if (users.password==null) res.status(400).send({"status":false,"message":"Password is Invalid"});
    if (users.lastname==null) res.status(400).send({"status":false,"message":"lastname is Invalid"});
    if (users.age==null) res.status(400).send({"status":false,"message":"age is Invalid"});
    if (users.role==null) res.status(400).send({"status":false,"message":"role is Invalid"});
    
    


    if (userrepo.list_of_users.filter(user => user.username ==users.username).length <=0)
    {
        userrepo.list_of_users.push(users);
        
        res.status(200).send({"status":true,"message":"Successfully Addded"});
    }else{
        res.status(200).send({"status":false,"message":"Users already exist"});
    }
}

// get product list
exports.get_product_list = (req,res)=>{
    // get list of all products. Everyone can view
    let list_of_products = userrepo.list_of_products.map((element)=>{
        
        if (req.body.isCurrentUserAdmin ==false)
        {
            //return field created_by as null if the current user is a client
            element.created_by =null;

        }  
        return element;
        
    });
    res.send(list_of_products);
    
}
// get product details
exports.get_product_details = (req,res)=>{
    // if (!req.body.isCurrentUserAdmin)  return res.status(401).send({error:"Access denied. cannot view user details"});    
    // get product details. Everyone can view
     let product_details = userrepo.list_of_products.filter(product => product.name ==req.query.name);
     // if the current user is admin mark created_by field as null
     if (req.body.isCurrentUserAdmin ==false) 
        product_details[0].created_by =null;

        // return only the first product
    res.send(product_details.length>0 ? product_details[0]: null);

}

exports.add_new_product = (req,res)=>{
    // Add new Products. Admin only
    if (!req.body.isCurrentUserAdmin)  return res.status(401).send({error:"Access denied. cannot add products"});
    const products = {
        name:req.body.name==undefined ? null :req.body.name,
        price:req.body.price==undefined ? null :req.body.price,
        description:req.body.description==undefined ? null :req.body.description,
        created_by:req.body.created_by==undefined ? null :req.body.created_by
    }
    
// validate product details details and send error message if invaliid
    if (products.name==null) res.status(400).send({"status":false,"message":"product name is Invalid"});
    if (products.price==null) res.status(400).send({"status":false,"message":"price is Invalid"});
    if (products.description==null) res.status(400).send({"status":false,"message":"description is Invalid"});
    if (products.created_by==null) res.status(400).send({"status":false,"message":"created_by is Invalid"});
    
    if (userrepo.list_of_products.filter(user => user.name ==products.name).length <=0)
    {
        userrepo.list_of_products.push(products);
        
        res.status(200).send({"status":true,"message":"Successfully Added new Product"});
    }else{
        res.status(200).send({"status":false,"message":"Product already exist"});
    }
}



exports.update_product = (req,res)=>{
    // Add new Products. Admin only
    if (!req.body.isCurrentUserAdmin)  return res.status(401).send({error:"Access denied. cannot add products"});
    const products = {
        name:req.body.name==undefined ? null :req.body.name,
        price:req.body.price==undefined ? null :req.body.price,
        description:req.body.description==undefined ? null :req.body.description,
        created_by:req.body.created_by==undefined ? null :req.body.created_by
    }
    
// validate product details details and send error message if invaliid
    if (products.name==null) res.status(400).send({"status":false,"message":"product name is Invalid"});
    if (products.price==null) res.status(400).send({"status":false,"message":"price is Invalid"});
    if (products.description==null) res.status(400).send({"status":false,"message":"description is Invalid"});
    if (products.created_by==null) res.status(400).send({"status":false,"message":"created_by is Invalid"});

    userrepo.list_of_products.forEach((element)=>{
        if (element.name==products.name) 
        {
            userrepo.list_of_products.name = products.name;
            userrepo.list_of_products.price = products.price;
            userrepo.list_of_products.description = products.description;
        return res.status(200).send({"status":true,"message":"Successfully updated new Product"});        
        }
        
    });

    return res.status(200).send({"status":true,"message":"No product updated"});        
    

    

}



exports.delete_product = (req,res)=>{
    // Add new Products. Admin only
    if (!req.body.isCurrentUserAdmin)  return res.status(401).send({error:"Access denied. cannot add products"});
    const products = {
        name:req.body.name==undefined ? null :req.body.name,
        price:req.body.price==undefined ? null :req.body.price,
        description:req.body.description==undefined ? null :req.body.description,
        created_by:req.body.created_by==undefined ? null :req.body.created_by
    }
    
// validate product details details and send error message if invaliid
    if (products.name==null) res.status(400).send({"status":false,"message":"product name is Invalid"});
    if (products.price==null) res.status(400).send({"status":false,"message":"price is Invalid"});
    if (products.description==null) res.status(400).send({"status":false,"message":"description is Invalid"});
    if (products.created_by==null) res.status(400).send({"status":false,"message":"created_by is Invalid"});

    userrepo.list_of_products.forEach((element)=>{
        if (element.name==products.name) 
        {
            userrepo.list_of_products.splice(index, 1);       
             return res.status(200).send({"status":true,"message":"Successfully delete Product"});        
        }
        
    });

    return res.status(200).send({"status":true,"message":"No product Deleted"});        
    

    

}


// PRIVATE FUNCTIONS ONLY WITH NO EXPORT

const isUserAdmin = (username)=>{
    // check if the user is an admin
    if (userrepo.list_of_users.filter(user => user.username ==username && user.role==="admin").length >0)
        return true;
    else
        return false;
    }



const GenerateJWTTokeKey = (username,password) =>{
    // check if the current user is registered
    let userList = userrepo.list_of_users.filter(user => user.username ==username);
    
    // if exists get the password
    var loginPassword =  userList !=null && userList.length>0 ? userList[0].password : null;

    
    // if does not exist return null value
    if (loginPassword==null)
        return null;

        
    // compare the password and does not exist return null vcalue
if  (bcrypt.compareSync(password,loginPassword)===false)
{
    
    return null;
}


// get the token expiry from the environment
//combine username + random 8 characters
let autogeneratekey = username + Math.floor(Math.random() * (1000000 - 9999999) + 1000000);
let value =  process.env.TOKEN_EXPIRY


const token_key = jwt.sign({ username:username, token: autogeneratekey, isAdmin:isUserAdmin(username), exp: Math.floor(Date.now() / 1000) + (60 * value ) }, process.env.SECRET_KEY);


// remove existing key 
userrepo.user_token_expiry.forEach((element,index)=>{
    if (element.username==username) userrepo.user_token_expiry.splice(index, 1);
});

// save the token to the database
userrepo.user_token_expiry.push({username:username,token:autogeneratekey});

// return the token key
 return token_key

}

