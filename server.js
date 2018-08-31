const express= require('express');
const app= express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring'); 
const mysql = require('mysql');
const admin = require('firebase-admin');

var FCM = require('fcm-push');

var serverKey = 'AAAASgtMh-o:APA91bHlJlpKoH6Kk_hU4lWcMBOSYGwpg9fAQc1sT9KEZuTv6HeF6oaYGurT8yLzNqxAa30AP4NnLRWccYYshyU4OBFhpBx5USGMlKg0VYzzHXKnAwWAtMCddpMEWu0vAlVwgiaphzuOC3tBSXUAoGZduA6IMqIsug';
var fcm = new FCM(serverKey);

var pool = mysql.createPool({
    host: 'qrcodescanner.coqa2ghc5ipd.us-east-2.rds.amazonaws.com',
    user: 'qrcodescanner',
    password: 'qrcodescanner',
    database: '', 
    port: 3306,
    debug: true,
    connectTimeout: 30000,
    acquireTimeout: 30000
});
/*
exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    con.connect(function(err){
    
        if(!err) {
            callback(null, "abc");
            console.log("Database is connected ... nn");    
        } else {
            callback(err);
            console.log("Error connecting database ... nn"); 
            console.log(err);
        }
            con.end();
        });
};
*/
exports.handler =  (event, context, callback) => {
    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;
    var items = "select * from category_detail" ;

    con.query(items, function (err, result) {
        console.log("runnning");
        if (err) {
            console.log(err);
            res.end();
        }
        console.log(result);
        console.log(result[0].item_id);
        
        //res.send([{ "name": result[0].item_name, "image": result[0].itemname, "quantity": "1", "description": result[0].description, "price": result[0].updated_price, "measuring_unit": result[0].measuringunit }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }]);
        res.send(result);
        
    })
    
  };

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(PORT, function (err) {
    if (err) {
        console.log("error" + err);
    }
    else {
        console.log("listening");
    }
})

function handle_database(query,req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query(query,function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

app.get('/handle', function(req,res){
    var query = "select * from category_detail";
    handle_database(query, req, res);
});

/*
app.get('/noti', function (req, res) {
    var message = {
        "to": "cuknmgKE-lM:APA91bHM13WRcErBnjBSiMy3vNp3UFv0ofaF1YzH_iCe7WlGnibomjPFOrXT_eX3fXVpzFFcdzua3cMuSm_9Xf92VulhqQZUv6LTn1av_JHjjjjdsJD-C2XP8pVZYwL-OnjPaJZ-jQckBF6RDIp-hbcvGb-7MoQeWA",
        "notification": {
            "body": "Node js great match!",
            "title": "Node js Portugal vs. Denmark",
            "content_available": true,
            "priority": "high",
        },
        "data": {
            "body": "Node js great match!",
            "title": "Node js Portugal vs. Denmark",
            "content_available": true,
            "priority": "high",
        }
    }

    //callback style

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!" + err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });

    //promise style
    fcm.send(message)
        .then(function (response) {
            console.log("Successfully sent with response: ", response);
        })
        .catch(function (err) {
            console.log("Something has gone wrong!");
            console.error(err);
        })

})
//Admin Part Start
app.post('/AdminLogin', function (req, res) {
    var id = 243;
    var pass = 34567;
    var exec = 'select AdminPassword from Admin where Admin_Name="req.body.name" ';
    if (exec == pass) {
        res.send(0);
    } else {
        res.send(1);
    }
    var query = con.query(exec, function (err, result) {
        if (err) {
            console.log(err);
        } else {

        }

    });
    if (req.body.logInId & req.body.logInPassword) {
        if (pass = req.body.logInpassword) {
            res.send("valid");
        } else {
            res.send('Not Valid');
        }
        


    }
})
//To get data like categories and subCategories from database
app.get('/dataSpinner', function (req, res) {
    var one = "select  subCategory_name from subCategory where category=req.body.cat";
    res.send(one);

})
//previous menu get
app.get('/PreviousMenuPrice', function (req, res) {
    var ret = "select subCategory_name,subCategory_id,subCategory_price from SubCategory where Category_name=req.body.cat";
    req.send(ret);

})
//new update Menu posted
app.post('/UpdateMenu', function (req, res) {
    for (var i= 0; i < req.body.arr.length();i++){


    var update = "Update SubCategories set SubCategory_price=req.body.arr[i].price  where (subCategor_namey=req.body.arr[i].subCat)";
}
    
});
//Menu ITEM DELETED
app.post('/deleteItem', function (req, res) {
    var del = " DELETE FROM SubCategories WHERE subCategory_name=req.body.subCat";
})






*/


//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//user side start
//checking number in database  First Step


app.get('/checkPhone', function (req, res) {
    console.log(req.query.phoneNo);
    var number = "03045192218";

    if (req.query.phoneNo  == number) {
        res.send("1");
    }
    else {

    
        res.send("4");
    }
    

    })
    

   /* var check = "select * from userinfo where phoneno=" + mysql.escape(req.query.phone) ;
    con.query(check, req.body.phone, function (err, result) {
        //console.log(con.query);
        if (err) throw err;
        if (result.length > 0) {
            console.log(result.length);
            res.send("1");
        }
        
        res.send("2");
    })*/
    
    



//send user_data to app step 2
/*
app.get('/SendUserData', function (req, res) {
    console.log("yes");
    var sendData = "select  name,phoneno,location from userinfo where phoneno=?" + req.body.phone;
    con.query(sendData, function (err, result) {
        if (err)  res.send(err);
        res.send(result);
    })
})*/

//send menu items to user step 3
app.get('/Items', function (req, res) {
    
    res.send([{ "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }]);
   var items = "select * from category_detail" ;
    con.query(items, function (err, result) {
        
        if (err) 
            console.log("error" + err);;
        res.send(err);
        console.log(result);
        console.log(result[0].item_id);
        
        //res.send([{ "name": result[0].item_name, "image": result[0].itemname, "quantity": "1", "description": result[0].description, "price": result[0].updated_price, "measuring_unit": result[0].measuringunit }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }]);
        res.send(result);
        
    })
    /* var items = "select * from subcat" ;

    con.query(items, function (err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    })*/
})

//send menu items to user step 3
app.get('/Item', function (req, res) {
    console.log("runnning");
    var items = "select * from category_detail" ;

    con.query(items, function (err, result) {
        console.log("runnning");
        if (err) {
            console.log(err);
            res.end();
        }
        console.log(result);
        console.log(result[0].item_id);
        
        //res.send([{ "name": result[0].item_name, "image": result[0].itemname, "quantity": "1", "description": result[0].description, "price": result[0].updated_price, "measuring_unit": result[0].measuringunit }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }]);
        res.send(result);
        
    })
    
    
   /* */
})

//check out step 4
app.post('/checkOut', function (req, res) {
    var order_Insert = "Insert into order set values ?";
})
//  Get Status Code for order
app.get('/OrderStatus', function (req, res) {
    res.send("2");
})
//user side end

/*

app.post('/notified', function (req, res) {
    if (req.body.signUpId) {



        var id = req.body.signUpId;
        console.log(id);
        res.send("yes");
    }
    else {
        res.send("no");
    }

    
       
    

    
    
    

})

const con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'kashif',
    password: 'tgbyhnujm',
    database: 'mydb'
});

var obj = {
    name: "kashif",
    id: 123
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/abd', function (req, res) {
    res.send("yes");
})
app.post('/insertCategory', function (req, res) {
    var value = {


        catid :req.body.cat_id,
        catName : req.body.cat_name,
        _adminid : req.body.admin,
        earliestdelivery : req.body.deliver
    };
    console.log(value.catName);

   // var query1 = con.query('Insert into admin()')
    
    var query = con.query('INSERT INTO category SET ?', value, function (err, result) {
        if (err) console.log(err);
        else {
            console.log(result);
        }
        // Neat!
    });
})
app.listen(PORT, function (err) {
    if (err) {
        console.log("error" + err);
    };
})
/*
app.get('/driverDelivery', function (req, res) {
   
})
app.get('/order'), function (req, res) {
    var city = "";
    
    var exec = "";
    con.query(exec, (err, result){
        if (err) console.log(err);
        else {
            id = result.order_id;
            res.send(id);
            

        }
    
    })
})

app.get('/menuUpdate', function (req, res) {
    var check = Checked();

    
    if (check == 0) {
        res.send(0);

    }
    else {
        res.send(1);
    }
    
    
    console.log("Received");
    
   
})
function Checked() {



    con.connect((err) => {
        if (err) {
            console.log('Error connecting to Db');
            return 0;
        }
        console.log('Connection established');
        return 1;

    });


}
app.get('/menuUpdate/check'), function (req, res) {
    var App_length = 9;
    var db_length = 10;
    Updated(App_length);


});



/*app.get('/insertItems', function (req, res) {
    
    var Category_id = req.query.Cat_id;
    var SubCategory_name = req.query.Sub_name;
    var SubCategory_id = req.query.Sub_id;
    var SubCategory_image=req.query.image;
    var SubCategory_size=req.query.size;
    var SubCategory_price=req.query.price;
    var SubCategory_descroption = req.query.description;



    var exec = "insert into user(Name, userName, id) values('data.message', 'data.user2', 23)";
    con.query(sql, (err, result){
        if (err) {
            res.send(0);
        }

    });



})
app.get('/getMenu', function (req, res) {
    var category = req.query.cat;
    
    var exec = "Select SubCategory_name,SubCategory_price,SubCategory_id from SubCategory where Category_id='category'";

})
app.get('/updateMenu', function (req, res) {
    var subCat_id = req.query.sub;
    var subCat_price = req.query.price;
    var exec = "Insert into SubCategory(subCategory_price) values('subCat_price') where subCategory_id='subCat_id'";

})
app.get('/insertNew', function (req, res) {
    var subCat_id = req.query.sub;
    var subCat_price = req.query.price;
    var subCat_name = req.query.name;
    var subCat_image = req.query.image;
    var subCat_size = req.query.size;
    var subCat_desc = req.query.desc;
    var Category_id = req.query.cat;
    var exec="Insert into SubCategory(subCategory_id,subCategory_name,subCategory_image,subCategory_size,subCategory_price,subCategory_description) values("
})
app.get('/notification', function (req, res) {


    
    console.log("Received2");
    res.send("ok");
})



function Updated(App_length) {
    var applength = App_length;
    var dbLength = "Select Count(id) from user;";
    con.query(sql, (err, result) => {
        if (err) throw err;

        console.log('Data sent');

    });
    if (dblength > appLength) {
        res.send(0);

         }
    else {
        res.send(1);

    }
}
app.get(function (req, res) {


});
function sendOrderDetails(detail) {
   


}
*/
