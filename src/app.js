require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const db = require("./db/conn");
const Register = require("./models/registers")
const hbs = require("hbs"); /* changes to be made */
const bcrypt = require("bcrypt");

const Razorpay = require('razorpay');


const static_path = path.join(__dirname, "../public");
const view_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", view_path);
hbs.registerPartials(partials_path);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    res.render("login");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.get("/register", (req, res) => {
    res.render("register");
})
app.get("/index", (req, res) => {
    res.render("index");
})
app.get("/about", (req, res) => {
    res.render("about");
})
app.get("/contact", (req, res) => {
    res.render("contact");
})
app.get("/chatbot", (req, res) => {
    res.sendFile(path.join(__dirname,"..","public","chatbot.html"));
})



app.get("/breed/german", (req, res) => {
    res.render("breed/german");
})
app.get("/breed/labrador", (req, res) => {
    res.render("breed/labrador");
})
app.get("/breed/golden", (req, res) => {
    res.render("breed/golden");
})
app.get("/breed/bulldog", (req, res) => {
    res.render("breed/bulldog");
})
app.get("/breed/rottweiler", (req, res) => {
    res.render("breed/rottweiler");
})
app.get("/breed/beagle", (req, res) => {
    res.render("breed/beagle");
})
app.get("/breed/husky", (req, res) => {
    res.render("breed/husky");
})
app.get("/breed/pug", (req, res) => {
    res.render("breed/pug");
})
app.get("/breed/indianspitz", (req, res) => {
    res.render("breed/indianspitz");
})




app.get("/organisation/posh", (req, res) => {
    res.render("organisation/posh");
})
app.get("/organisation/apolo", (req, res) => {
    res.render("organisation/apolo");
})
app.get("/organisation/karma", (req, res) => {
    res.render("organisation/karma");
})
app.get("/organisation/jeevashram", (req, res) => {
    res.render("organisation/jeevashram");
})
app.get("/organisation/paws", (req, res) => {
    res.render("organisation/paws");
})
app.get("/organisation/redpaws", (req, res) => {
    res.render("organisation/redpaws");
})
app.get("/organisation/sayjaygandhi", (req, res) => {
    res.render("organisation/sayjaygandhi");
})
app.get("/organisation/friend", (req, res) => {
    res.render("organisation/friend");
})



app.post("/register", async (req, res) => {
    try {
        const registerUser = new Register({
            username: req.body.username,
            phone: req.body.number,
            email: req.body.email,
            password: req.body.password
        })

        const registered = await registerUser.save();

        res.status(201).render("login");


    } catch (error) {
        res.render('404page', {
            errorMsg: "Opps! Data entered not valid, go back to try again..."
        })
    }
})


app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const loginemail = await Register.findOne({ email: email });
        const loginpass = await bcrypt.compare(password, loginemail.password);

        if (loginpass) {
            res.status(201).render("index");
        }
        else {
            res.send("Invalid details Entered");
        }

    } catch (err) {
        res.render('404page', {
            errorMsg: "Opps! Login Credentials mismatched, go back to try again..."
        })
    }
})


app.get("*", (req, res) => {
    res.render('404page', {
        errorMsg: "Opps! page not found, Click Here to go back"
    })
})





//razorpay

const razorpayInstance = new Razorpay({
    key_id:'rzp_test_TGr6TblEdcfhCA',
    key_secret:'Pa51LspiROAfGiIb8J1oUohX',
  });
  
  app.post('/create/orderId', (req, res) => {
    console.log('Create orderId request', req.body);
    const options = {
      amount: req.body.amount,
      currency: 'INR',
      receipt: 'rcp1',
    };
    razorpayInstance.orders.create(options, (err, order) => {
      console.log(order);
      res.send({ orderId: order.id });
    });
  });
  
  app.post('/api/payment/verify', (req, res) => {
    const body = req.body.response.razorpay_order_id + '|' + req.body.response.razorpay_payment_id;
    const crypto = require('crypto');
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body.toString())
      .digest('hex');
    console.log('Signature received:', req.body.response.razorpay_signature);
    console.log('Signature generated:', expectedSignature);
  
    const response = { signatureIsValid: 'false' };
    if (expectedSignature === req.body.response.razorpay_signature) {
      response.signatureIsValid = 'true';
    }
    res.send(response);
  });

  app.listen(port, () => {
    console.log(`listening on port ${port}`)
})