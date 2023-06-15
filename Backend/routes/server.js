const express = require('express');
const app = express();
const connectDB = require('./config/config');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
connectDB();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT;

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})
// app.use(require("cors"));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/users', require("./routes/userRoutes"));
app.use('/api/pizzas', require("./routes/pizzaRoute"));
app.use("/api/orders",require("./routes/orderRoute"));
app.get('/home', (req, res) => {
    res.send("<h1>Hello, world!</h1>");
});


// Create a post request for /create-checkout-session
app.post("/api/stripe", async (req, res) => {
  try {
    const params = {
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      shipping_address_collection: {allowed_countries: ['IN']},
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {amount: 50*100, currency: 'inr'},
            display_name: 'Delivery Free',

          },
        },
      ],
    
      line_items: req.body.map((item) => {
        const img = item.image

        return {
          price_data: { 
            currency: 'inr',
            product_data: { 
              name: item.name,
            
            },
            unit_amount: item.prices[0][item.varient] * 100,
          },
          adjustable_quantity: {
            enabled:true,
            minimum: 1,
          },
          quantity: item.quantity
        }
      }),
      success_url: process.env.CLIENT_URL+"order",
      cancel_url: process.env.CLIENT_URL+"cart",
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create(params);

    res.status(200).json(session);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
})

app.post("/api/payment/create", async (req, res) => {
  const total = req.body.amount;
  console.log("Payment Request recieved for this ruppess", total);

  const payment = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "inr",
  });

  res.status(201).send({
    clientSecret: payment.client_secret,
  });
});
