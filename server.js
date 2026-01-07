const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/db");
const errorHandler = require("./Middlewares/errorMiddleware");
// const path = require("path");

const tripRoutes = require("./Routes/tripRoutes");
const userRoutes = require("./Routes/userRoutes");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

connectDB();
const app = express();

app.set("trust proxy", true);

// app.use(cors({
//   origin: "https://voyager-i63d.onrender.com",  // ✅ your frontend origin
//   credentials: true,                // ✅ allow credentials (cookies)
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://voyager-frontend-one.vercel.app"
];

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// ✅ CORS (MUST be before Clerk)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Explicit OPTIONS handler (VERY IMPORTANT)
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(ClerkExpressWithAuth());
// app.use(express.static(path.join(__dirname , "/public")));



app.use("/api/trip" , tripRoutes);
app.use("/api/user" , userRoutes);
app.use(errorHandler);


// app.use(express.static(path.join(__dirname , "../Frontend/dist")))
// app.get(/.*/ , (req,res)=>{
//   res.sendFile(path.join(__dirname , "../Frontend/dist/index.html"))
// })

// const port = process.env.PORT;
// app.listen(port , ()=> console.log(`Server started at port ${port}`));

const port = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// export default app;
module.exports = app;
