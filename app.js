var express = require('express');
var querystring = require('querystring');
var FormData=require('form-data');
var app =express();
var bodyParser = require('body-parser');
var fs=require("fs");
var fs1=require("fs");
var multer=require('multer');
var http=require('http');   
var ticket="";




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

//app.use(express.static('public'));
//app.use(multer({ dest: './uploads/'}))

//var upload = multer({dest: 'uploads' });
app.get('/fileupload.html',function(req,res){
      res.sendFile(__dirname+"/"+"fileupload.html");
});


app.get('/list_page',function(req,res){
      console.log("Got GET request from /list_page");
      res.send('Hello World');
});

app.get('/login',function(req,res){
      res.sendFile(__dirname+"/"+"login.html" );
});
app.post('/LoginAction',function(req,res1){
                 
       var userid  =req.body.userid;
       var password=req.body.password;

var post_data = '{ username : '+userid+', password: '+password+'}';

var options = {

     host : '52.41.208.249',
     port : '8080',
     path  : '/alfresco/service/api/login',
     method : 'POST',
};
            var reqGet = http.request(options, function(alres){

            alres.setEncoding('utf8');
               
                 if(alres.statusCode==200){
//Get token from alfresco and set cookie
                          alres.setEncoding('utf8');
	                 alres.on('data', function(d) {
                             var json=JSON.parse(d);
                             ticket=json.data.ticket;
                          }); 
     		          res1.sendFile(__dirname+"/"+"fileupload.html");
                 }
                 else{
                     reqGet.end();
                     res1.send("Invalid user");
                 } 
                /* alres.on('data', function (chunk) {
                       console.log('Post operation'+alres.statusCode);
                       console.log('Response: ' + chunk);
                       res1.send("LoginAction1");
                }); */
                                 

            });
            
            reqGet.write(post_data);
            reqGet.end();
            reqGet.on('error', function(e){
               console.error("This is error");
               console.error(e);
            });



});

app.post('/file_upload', multer({ dest: './uploads'}).single('nfile'),function(req,res){


console.log(req.file.originalname);

orgfilename=req.file.originalname;
var file="/tmp/"+req.file.originalFilename;

var form= new FormData();


        
        fs.readFile(req.file.path, function(err,data){
          fs.writeFile(file, data, function (err) {
              if(err){
                  console.log(err);
              }else{
                    response = {
                       message:'File uploaded successfully',filename:req.file.name
                    };

              }

	   form.append('siteid','hazle');
   	   form.append('containerId','documentLibrary');
  	   form.append('filename',orgfilename);
  	   form.append('uploadDirectory','/test');
   	   form.append('filedata',fs.createReadStream(file));

             form.submit({
     			host : '52.41.208.249',
     			port : '8080',
     			path  : '/alfresco/service/api/upload?alf_ticket='+ticket,
     			method : 'POST',
             }, function(err,res){
                        console.log(res.statusCode);
             });
             
             
              console.log("TICKET"+ticket);
//              res.end (JSON.stringify(response ));

          });
          });

       
    res.status(204).end();
});
app.listen(3000, function(){
       console.log('Example app');
});
