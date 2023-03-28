require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// endpoints
app.use('/api/user', userRoute);

// port
const PORT = process.env.PORT || 7000;

// connect to db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // listening for request
    app.listen(PORT, () => {
      console.log(`connected to db and server running on port:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
