const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/db");
const errorHandler = require("./Middlewares/errorMiddleware");
const path = require("path");

const tripRoutes = require("./Routes/tripRoutes");
const userRoutes = require("./Routes/userRoutes");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

connectDB();
const app = express();

app.use(cors({
  origin: "https://voyager-i63d.onrender.com",  // ✅ your frontend origin
  credentials: true,                // ✅ allow credentials (cookies)
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(ClerkExpressWithAuth());
app.use(express.static(path.join(__dirname , "/public")));



app.use("/api/trip" , tripRoutes);
app.use("/api/user" , userRoutes);
app.use(errorHandler);


app.use(express.static(path.join(__dirname , "../Frontend/dist")))
app.get(/.*/ , (req,res)=>{
  res.sendFile(path.join(__dirname , "../Frontend/dist/index.html"))
})

const port = process.env.PORT;
app.listen(port , ()=> console.log(`Server started at port ${port}`));