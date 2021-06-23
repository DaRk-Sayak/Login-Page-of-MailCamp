const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const path=require("path");
const https=require("https");
const app=express();

//api key=a529ff524da5c7c3bffa135dd51bd173-us6
//Uqi id=7557dab1c4.
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/signup.html")
});

app.post("/",(req,res)=>{
   const fName=String(req.body.fName);
   const lName=String(req.body.lName);
   const email=String(req.body.email);
   const phone=Number(req.body.number);
   const url="https://us6.api.mailchimp.com/3.0/lists/7557dab1c4";
   const options={
       method:"POST",
       auth:"Sayak:a529ff524da5c7c3bffa135dd51bd173-us6"
   }

   let data={
       members:[
           {
               email_address: email,
               status:"subscribed",
               merge_fields:{
                    FNAME:fName,
                    LNAME:lName,
                    PHONE:phone
               }
           }
       ]
   };

   const jsonData= JSON.stringify(data);

   const request=https.request(url,options,(response)=>{
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
           
        }else{
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })
   });
   request.write(jsonData);
   request.end();
});

app.post("/success",(req,res)=>{
    res.redirect("/");
});

app.post("/failure",(req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, ()=> {
    console.log("Server Started at port 3000");
});