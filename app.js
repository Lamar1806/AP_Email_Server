var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')
var _ = require('lodash')
var exphbs  = require('express-handlebars');
var nodemailer = require('nodemailer');
var path = require('path');

var app = express();

//View Engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set up a whitelist and check against it:
var whitelist = ['http://localhost:3000', 'http://example2.com', 'https://advancedpoolsandbackyards.firebaseapp.com']
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }
app.use(cors(corsOptionsDelegate));


// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{   
// async..await is not allowed in global scope, must use a wrapper    
  res.redirect('http://advancedpoolsandbackyards.com') 
})

app.post('/', async (req, res)=>{  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "apbllc.net",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        user: 'digivvaa', // generated ethereal user
        pass: 'Vayne1806' // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });
    try{
        let reqObj = _.isEmpty(req.query) ? req.body : req.query; 
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Advanced Backyard and Pools" <pools@apbllc.net>', // sender address
            to: reqObj.recipients, // list of receivers
            subject: reqObj.subject, // Subject line
            html: `
                <b>Email:</b> ${reqObj.email} <br /><br />
                <b>Customer Consern:</b> <br /><br />
                ${reqObj.message}
            ` 
        });    
        console.log(reqObj);
        res.send(true)
    }catch(e){
        console.log(e)
        res.send(false)
    }
})

// app.listen(3001, ()=> console.log('Server Started'));
app.listen();