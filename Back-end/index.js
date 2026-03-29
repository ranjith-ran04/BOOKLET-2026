const express = require("express");
const cors = require("cors");
const cookieparser=require("cookie-parser")

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true 
}));

app.use(cookieparser())
app.use(express.json());



const main_routes=require('./main_app/routes.js')



app.use('/api',main_routes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
