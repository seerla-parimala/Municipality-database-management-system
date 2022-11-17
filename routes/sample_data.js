var express = require('express');
const nodemailer = require("nodemailer");
const bodyparser = require("body-parser");
const app=express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
var router = express.Router();
var database  = require('../database');
const { response } = require('express');

router.get("/login", function(request, response, next){

	response.render("login");

});
router.get("/register",function(request,response,next){
    response.render("register");
});
router.get("/email",function(request,response,next){
    response.render("email");
});
router.get("/logout", function(request, response, next){
    response.redirect("/sample_data");
});

router.post("/userreg",function(request, response, next){
    var User_Id = request.body.User_Id;
    var password = request.body.password;
    var Full_name = request.body.Full_name;
    var Address = request.body.Address;
    var aadhar_card_no = request.body.aadhar_card_number;
    var Phone_no = request.body.Phone_no;
    var Email_Id = request.body.Email_Id;
    var query =`Insert into user(User_Id,Password_,Full_name,Address,aadhar_card_number,Phone_no,Email_Id) values('${User_Id}','${password}','${Full_name}',
    '${Address}','${aadhar_card_no}','${Phone_no}','${Email_Id}')`;
    database.query(query,function(error,results,fields){
        if(error) throw error;
        response.redirect("/sample_data/login");
    })
})
router.post("/adminlogin",function(req,res){ 
    var username = req.body.username;
    var password = req.body.password;
    database.query("select * from admin where username = ? and password = ? ",[username,password],function(error,results,fields){
        if(results.length > 0){
            res.render("admin")

        }else{ 
            res.render("login");
        } 
        res.end();
    });
 });
 router.get("/admin",function(req,res){
    res.render("admin");
});
router.get("/updwat",function(req,res){
    res.render("updwat");
});
router.get("/updelec",function(req,res){
    res.render("updelec");
});
router.get("/updprop",function(req,res){
    res.render("updprop");
});
router.post("/add", function(req,res){
    var User_Id = req.body.User_Id;
    var category = req.body.category;
    var area = req.body.area;
    var complaint = req.body.complaint;
    var sql = "insert into complaint(User_Id,category,area,complaint,complaint_status) values ('"+User_Id+"','"+category+"','"+area+"','"+complaint+"','pending')";
    database.query(sql,function(error,results){
        if(error) throw error;
    });
    var query = "update waste_details set con=con+1,pen=pen+1 where S_No=1";
    database.query(query, function(error,data){
        if(error) throw error;
    });
    res.redirect("/sample_data");
});
router.post("/updatebill",function(req,res){
    var User_Id = req.body.User_Id;
    var Water_Bill_No = req.body.Water_Bill_No;
    var Amount = req.body.Amount;
    var due_date = req.body.due_date;
    var query = "update water_bill set view_status='not viewed',delay=0,Payment_status='unpaid' where User_Id=?";
    database.query(query,[User_Id],function(err,results,fields){
        if (err) throw err; 
    });
    var sql = "update water_bill set Amount=?,due_date=? where User_Id=?";
    database.query(sql,[Amount,due_date,User_Id],function(err,results,fields){
        if(err) throw err;
        res.render("admin");
    });
});
router.post("/updateelecbill",function(req,res){
    var User_Id = req.body.User_Id;
    var Electricity_Bill_No = req.body.Elecricity_Bill_No;
    var Amount = req.body.Amount;
    var due_date = req.body.due_date;
    var query = "update electricity_bill set view_status='not viewed',delay=0,Payment_status='unpaid' where User_Id=?";
    database.query(query,[User_Id],function(err,results,fields){
        if (err) throw err; 
    });
    var sql = "update electricity_bill set Amount=?,due_date=? where User_Id=?";
    database.query(sql,[Amount,due_date,User_Id],function(err,results,fields){
        if(err) throw err;
        res.render("admin");
    });
});
router.post("/updateprop",function(req,res){
    var Property_Id = req.body.Property_Id;
    var Amount = req.body.Amount;
    var due_date = req.body.due_date;
    var query = "update property_tax set view_status='not viewed',Payment_status='unpaid' where Property_Id=?";
    database.query(query,[Property_Id],function(err,results,fields){
        if (err) throw err; 
    });
    var sql = "update property_tax set Amount=?,due_date=? where Property_Id=?";
    database.query(sql,[Amount,due_date,Property_Id],function(err,results,fields){
        if(err) throw err;
        res.render("admin");
    });
});
router.get("/",function(request,response,next){
    var query = "Select * from waste_details";
    database.query(query, function(error,data){
        if(error){
            throw  error;
        }
        else{
            response.render('main',{action : 'list',sampleData : data});
        }
    });
});
router.post("/compile",function(request,response,next){
  var category = request.body.category;
  var area = request.body.area;
  var complaint = request.body.complaint;
  var query = "Select * from complaint where category=? and area=? and complaint=?";
  database.query(query,[category,area,complaint],function(error,results,fields){
    if(results.length > 0){
        var sql = "update waste_details set don=don+1,pen=pen-1 where S_No=1";
        database.query(sql,function(error,data){
            if(error) throw error;
        });
        var sqli = "update complaint set complaint_status='compiled' where category=? and area=? and complaint=?";
        database.query(sqli,[category,area,complaint],function(error,data){
            if(error) throw error;
        });
    }
    response.redirect("/sample_data");
  });
});
router.post("/status",function(request,response,next){
    var User_Id=request.body.User_Id;
    var password=request.body.password;
    database.query("select * from user inner join water_bill on user.User_Id =  water_bill.User_Id where user.User_Id=? and user.Password_=?",[User_Id,password],function(error,results,fields){
        if(results.length > 0){
            var sql="update water_bill set view_status='viewed' where User_Id=?";
            database.query(sql,[User_Id],function(error,data){
                if(error) throw error;
            });
            response.render("wstatus",{sampleData : results});
        }
        else{
            response.redirect("/sample_data");
        }
    })
});
router.post("/pstatus",function(request,response,next){
    var User_Id=request.body.Property_Id;
    var password=request.body.password;
    
    database.query("select * from user inner join property_tax on user.Property_Id =  property_tax.Property_Id where user.Property_Id=? and user.Password_=?",[User_Id,password],function(error,results,fields){
        if(results.length > 0){
            response.render("pstatus",{sampleData : results});
        }
        else{
            response.redirect("/sample_data");
        }
    })
});
router.get("/office",function(request,response,next){
    var Address = request.params.Address;
    let transporter=nodemailer.createTransport({
        service:'gmail',
        port:465,
        sever:true,
        auth: {
            user: "parimalaseerla239@gmail.com",
            pass: "woxryhoywmdxgtdh"
        }
    });
    context : {
        address : Address
    }
    message = {
        from: "indoremc@gmail.com",
        to: "services@gmail.com",
        subject:"Tax not paid",
        text:"Cut service to address"
    }
    transporter.sendMail(message,function(err,info){
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
    response.redirect("/sample_data/checke");
});
router.get("/gmail/:Email_Id",function(request,response,next){
    var Email_Id = request.params.Email_Id;
    let transporter=nodemailer.createTransport({
        service:'gmail',
        port:465,
        sever:true,
        auth: {
            user: "parimalaseerla239@gmail.com",
            pass: "woxryhoywmdxgtdh"
        }
    });
    message = {
        from: "indoremc@gmail.com",
        to: Email_Id,
        subject:"Remainder regarding tax payment",
        text: "Please pay your tax as soon as possible"
    }
    transporter.sendMail(message,function(err,info){
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
    
    response.redirect("/sample_data/checkw");
});
router.get("/send",function(request,response,next){
    let transporter=nodemailer.createTransport({
        service:'gmail',
        port:465,
        sever:true,
        auth: {
            user: "parimalaseerla239@gmail.com",
            pass: "woxryhoywmdxgtdh"
        }
    });
    message = {
        from: "indoremc@gmail.com",
        to: "sreyabollavaram02@gmail.com,hemalathabomma001@gmail.com,streddy999@gmail.com,maratidivyateja@gmail.com",
        subject:"Remainder regarding tax payment",
        text: "Please pay your tax as soon as possible"
    }
    transporter.sendMail(message,function(err,info){
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
    response.redirect("/sample_data/checkw");
});
router.get("/egmail/:Email_Id",function(request,response,next){
    var Email_Id = request.params.Email_Id;
    let transporter=nodemailer.createTransport({
        service:'gmail',
        port:465,
        sever:true,
        auth: {
            user: "parimalaseerla239@gmail.com",
            pass: "woxryhoywmdxgtdh"
        }
    });
    message = {
        from: "indoremc@gmail.com",
        to: Email_Id,
        subject:"Remainder regarding tax payment",
        text: "Please pay your tax as soon as possible"
    }
    transporter.sendMail(message,function(err,info){
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
    response.redirect("/sample_data/checke");
});
router.get("/esend",function(request,response,next){
    let transporter=nodemailer.createTransport({
        service:'gmail',
        port:465,
        sever:true,
        auth: {
            user: "parimalaseerla239@gmail.com",
            pass: "woxryhoywmdxgtdh"
        }
    });
    message = {
        from: "indoremc@gmail.com",
        to: "sreyabollavaram02@gmail.com,hemalathabomma001@gmail.com,streddy999@gmail.com,maratidivyateja@gmail.com",
        subject:"Remainder regarding tax payment",
        text: "Please pay your tax as soon as possible"
    }
    transporter.sendMail(message,function(err,info){
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
    response.redirect("/sample_data/checke");
});

router.post("/estatus",function(request,response,next){
    var User_Id=request.body.User_Id;
    var password=request.body.password;
    
    database.query("select * from user inner join electricity_bill on user.User_Id =  electricity_bill.User_Id where user.User_Id=? and user.Password_=?",[User_Id,password],function(error,results,fields){
        if(results.length > 0){
            var sql="update electricity_bill set view_status='viewed' where User_Id=?";
            database.query(sql,[User_Id],function(error,data){
                if(error) throw error;
            });
            response.render("estatus",{sampleData : results});
        }
        else{
            response.redirect("/sample_data");
        }
    })
});
router.get("/checkw",function(request,response,next){
    var sql = "select * from water_bill inner join user on user.User_Id=water_bill.User_Id";
    database.query(sql,function(error,data){
       if(error) throw error;
       response.render("wdetails",{sampleData:data});
    });
});
router.get("/checkp",function(request,response,next){
    var sql = "select * from property_tax inner join user on user.User_Id=property_tax.User_Id";
    database.query(sql,function(error,data){
       if(error) throw error;
       response.render("pdetails",{sampleData:data});
    });
});
router.get("/checke",function(request,response,next){
    var sql = "select * from electricity_bill inner join user on user.User_Id=electricity_bill.User_Id";
    database.query(sql,function(error,data){
       if(error) throw error;
       response.render("edetails",{sampleData:data});
    });
});
router.get("/payment",function(requset,response,next){
    response.render("pay");
});
router.get("/epayment",function(requset,response,next){
    response.render("epay");
});
router.get("/ppayment",function(requset,response,next){
    response.render("ppay");
});
router.post("/verify",function(request,response,next){
    var User_Id = request.body.User_Id;
    var Wallet_key=request.body.Wallet_key;
    var Amount=request.body.Amount;
    var equery = "select * from wallet where User_Id=? and Wallet_key=?";
    database.query(equery,[User_Id,Wallet_key],function(error,results,fields){
      if(results.length>0){
         if(results[0].Amount==0){
            response.render("nomon");
         }
         else{
            var sqle = "update wallet set Amount=Amount-?";
            database.query(sqle,[Amount],function(error,data){
             if(error) throw error;
            });
            var query="update water_bill set Amount=0,Payment_status='paid',overdue=0,delay=0 where User_Id=?";
            database.query(query,[User_Id],function(error,data){
              if(error) throw error;
            });
            var quer="update coun set con=(select count(id) from wpayment)";
            database.query(quer,function(error,data){
              if(error) throw error;
            });
            var sql="select con from coun";
            database.query(sql,function(error,results,fields){
              if(error) throw error;
              var dat=results[0].con;
              var sqli=`Insert into wpayment(id,User_Id,Amount) values("${dat+1}", "${User_Id}", "${Amount}")`;
              database.query(sqli,function(error,data){
                if(error) throw error;
                var sqla = "select * from wpayment inner join user on user.User_Id=wpayment.User_Id where wpayment.id=?";
            database.query(sqla,[dat+1],function(error,data){
                if(error) throw error;
                response.render("success",{sampleData:data});
            });
              });
            });
            
         }
      }
      else{
        response.render("amount");
      }
    });
});
router.post("/everify",function(request,response,next){
    var User_Id = request.body.User_Id;
    var Wallet_key=request.body.Wallet_key;
    var Amount=request.body.Amount;
    var equery = "select * from wallet where User_Id=? and Wallet_key=?";
    database.query(equery,[User_Id,Wallet_key],function(error,results,fields){
      if(results.length>0){
         if(results[0].Amount==0){
            response.render("nomon");
         }
         else{
            var sqle = "update wallet set Amount=Amount-?";
            database.query(sqle,[Amount],function(error,data){
             if(error) throw error;
            });
            var query="update electricity_bill set Amount=0,Payment_status='paid',overdue=0,delay=0 where User_Id=?";
            database.query(query,[User_Id],function(error,data){
              if(error) throw error;
            });
            var quer="update ecoun set con=(select count(id) from epayment)";
            database.query(quer,function(error,data){
              if(error) throw error;
            });
            var sql="select con from ecoun";
            database.query(sql,function(error,results,fields){
              if(error) throw error;
              var dat=results[0].con;
              var sqli=`Insert into epayment(id,User_Id,Amount) values("${dat+1}", "${User_Id}", "${Amount}")`;
              database.query(sqli,function(error,data){
                if(error) throw error;
                var sqla = "select * from epayment inner join user on user.User_Id=epayment.User_Id where epayment.id=?";
            database.query(sqla,[dat+1],function(error,data){
                if(error) throw error;
                response.render("success",{sampleData:data});
            });
              });
            });
            
         }
      }
      else{
        response.render("eamount");
      }
    });
});

router.post("/pverify",function(request,response,next){
    var Property_Id = request.body.Property_Id;
    var Wallet_key=request.body.Wallet_key;
    var Amount=request.body.Amount;
    var equery = "select * from wallet where Property_Id=? and Wallet_key=?";
    database.query(equery,[Property_Id,Wallet_key],function(error,results,fields){
      if(results.length>0){
         if(results[0].Amount==0){
            response.render("nomon");
         }
         else{
            var sqle = "update wallet set Amount=Amount-?";
            database.query(sqle,[Amount],function(error,data){
             if(error) throw error;
            });
            var query="update property_tax set Amount=0,Payment_status='paid',penalty=0 where Property_Id=?";
            database.query(query,[Property_Id],function(error,data){
              if(error) throw error;
            });
            var quer="update pcoun set con=(select count(id) from ppayment)";
            database.query(quer,function(error,data){
              if(error) throw error;
            });
            var sql="select con from pcoun";
            database.query(sql,function(error,results,fields){
              if(error) throw error;
              var dat=results[0].con;
              var sqli=`Insert into ppayment(id,Property_Id,Amount) values("${dat+1}", "${Property_Id}", "${Amount}")`;
              database.query(sqli,function(error,data){
                if(error) throw error;
                var sqla = "select * from ppayment inner join user on user.Property_Id=ppayment.Property_Id where ppayment.id=?";
            database.query(sqla,[dat+1],function(error,data){
                if(error) throw error;
                response.render("success",{sampleData:data});
            });
              });
            });
            
         }
      }
      else{
        response.render("pamount");
      }
    });
});

router.get("/session",function(request,response,next){
    response.render("waste");
});
router.get("/upwas",function(request, response,next){
    response.render("upwas");
})
router.post("/updwas",function(request, response, next){
    var Area = request.body.Area;
    var Quantity = request.body.Quantity;
    var query = "update waste_details set Quantity=? where Area=?";
    database.query(query,[Quantity,Area],function(error,data){
        if(error) throw error;
        response.redirect("/sample_data");
    });
});
//router.post("/add_sample_data", function(request, response, next){

	
	//database.query(query, function(error, data){

		//if(error)
		//{
		//	throw error;
		//}	
		//else
		//{
		//	response.redirect("/sample_data");
		//}

	//});


module.exports = router;