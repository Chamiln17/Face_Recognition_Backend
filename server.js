import express from "express";
import cors from "cors";
import argon2 from "argon2";
import knex from "knex";
import {handleRegister} from "./controllers/register.js"
import {handleSignIn} from "./controllers/signin.js"
import {handleProfileGet} from "./controllers/profile.js"
import { handleImage , handleImgUrl } from "./controllers/image.js";


const db = knex({
  client: 'pg',
  connection: {
    host: 'postgresql-chamel-nadir-bouacha.alwaysdata.net',
    port: 5432,
    database: 'chamel-nadir-bouacha_brain_db',
    user: 'chamel-nadir-bouacha',
    password: 'FTL5x.nh4nPvm3r'
  }
});



const app = express();
app.use(express.json());


app.get("/", (req, res) => {
res.send("succes")});

app.post("/signin", (req,res)=>{handleSignIn(req,res,db,argon2)} );


app.post("/register", (req, res)=>{handleRegister(req,res,db)});

app.get("/profile/:id", (req, res) => {handleProfileGet(req,res,db)});

app.put("/image", (req,res)=>{handleImage(req,res,db)} );

app.post("/imageurl", (req,res)=>{handleImgUrl(req,res)});

const PORT = process.env.PORT || 5000;
app
  .listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} is already in use`);
      // Find the process ID of the process running on port 5000
      const cmd = `lsof -i :${PORT}`;
      require("child_process").exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        // Extract the PID from the output
        const pid = stdout.split("\n")[1].split(/\s+/)[1];
        // Kill the process using the PID
        const cmd = `kill -9 ${pid}`;
        require("child_process").exec(cmd, (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`Process ${pid} killed`);
          // Restart the server
          app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
          });
        });
      });
    } else {
      console.error(err);
    }
  });

/* 
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/
