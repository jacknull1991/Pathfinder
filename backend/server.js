const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import Routes
const authRoute = require('./routes/auth');

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

app.use('/api/user', authRoute);

// database connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connection established successfully');
});



app.listen(port, () => console.log(`Server is running on port: ${port}`));