const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const PORT = 5000;
const users = []; 
const jwt = require("jsonwebtoken");
const SECRET_KEY = "my_secret_key";


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
  }));
    
app.use(bodyParser.json());

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("TEST");
  });

  app.post("/signup", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    const newUser = { username, password };
    users.push(newUser);
  
    res.status(201).json({ message: "User registered successfully" });
  });


  app.post("/signin", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
    
      const user = users.find(user => user.username === username && user.password === password);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
    
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ message: "Login successful" });
    });


    const authenticateToken = (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
          return res.status(401).json({ message: "Access Denied: No Token Provided" });
        }
      
        try {
          const verified = jwt.verify(token, SECRET_KEY);
          req.user = verified; 
          next(); 
        } catch (err) {
          res.status(403).json({ message: "Invalid Token" }); 
        }
      };

      app.get("/profile", authenticateToken, (req, res) => {
        res.status(200).json({ message: `Welcome ${req.user.username}!`, user: req.user });
      });
      
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
