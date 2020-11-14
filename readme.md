# Project Description
The API is basically developed using NodeJS, MongoDB and Docker.
## dockerfile
This file has two sections for multi-stage  which include production and development.
Production is derived from node-alpine image which install package targeted for production only.
Development is derived from production and install all package.json.
# POST MAN
## login with the link below and credentials
**POST Method**
http://HOST_NAME:PORT_NUMBER/login
```{
       "username":"USER_NAME_FROM_EMAIL.",
        "password":"PASSWORD_PROVIDED_FROM_EMAIL"
```}


## Add new users - ADMIN Role ONLY
**POST Method**
http://HOST_NAME:PORT_NUMBER/addnewusers
 ```{
                "username":string,
               "password":string,
               "name":string,
               "lastname":string,
               "age":number,
               "role":string admin|client
```    }

> **HEADERS**
> **KEY: Authorization**
> **VALUE: "TOKEN KEY PROVIDED DURING LOGIN**

## Get list of users - ADMIN Role ONLY
**GET Method**
http://HOST_NAME:PORT_NUMBER/userslist/
> **HEADERS**
> **KEY: Authorization**
> **VALUE: "TOKEN KEY PROVIDED DURING LOGIN**

## Get users details - ADMIN Role ONLY
**Get Method**
http://localhost:3000/userdetails/?username=USER_NAME--> query prametrer
> **HEADERS**
> **KEY: Authorization**
> **VALUE: "TOKEN KEY PROVIDED DURING LOGIN**

## Add new users - ADMIN Role ONLY
**POST Method**
http://HOST_NAME:PORT_NUMBER/addnewproducts/
 ```{
        "name":string,
        "price":Number,
        "description":String,
        "created_by":string
        
 ```   }

> **HEADERS**
> **KEY: Authorization**
> **VALUE: "TOKEN KEY PROVIDED DURING LOGIN**

## Get list of products - EVERYONE
**Get Method**
http://HOST_NAME:PORT_NUMBER/getproductlist/
> **HEADERS**
> **KEY: Authorization**
> **VALUE: "TOKEN KEY PROVIDED DURING LOGIN**

## Get product details - EVERYONE
**Get Method**
http://HOST_NAME:PORT_NUMBER/getproductdetails/?name=PARAM --- get query param
> **HEADERS**
> **KEY: Authorization**
> **VALUE: "TOKEN KEY PROVIDED DURING LOGIN**

## Update product details - ADMIN Role ONLY
**POST Method**
http://HOST_NAME:PORT_NUMBER/updateproducts/
 ```{
        "name":string,
        "price":Number,
        "description":String,
      
        
 ```   }

> **HEADERS**
> **KEY: Authorization**
> **VALUE: "TOKEN KEY PROVIDED DURING LOGIN**#


## Delete product details - ADMIN ONLY
**Get Method**
http://HOST_NAME:PORT_NUMBER/deleteproducts/?name=PARAM --- get query param
> **HEADERS**
> **KEY: Authorization**
> **VALUE: "TOKEN KEY PROVIDED DURING LOGIN**
