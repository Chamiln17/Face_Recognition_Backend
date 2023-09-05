import express from "express";
import argon2 from "argon2";
import cors from "cors";
import knex from "knex";
import e from "express";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "nano",
    database: "brain-db",
  },
});

async function hashPassword(password) {
  try {
    const hash = await argon2.hash(password, {
      timeCost: 16,
      memoryCost: 102400,
      parallelism: 8,
      type: argon2.argon2id,
    });
    return hash;
  } catch (err) {
    console.error(err);
  }
}

const app = express();
app.use(express.json());
app.use(cors());

/* const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
}; */

app.get("/", (req, res) => {
res.send});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  db.select("email", "hash").from("login")
  .where("email", "=", email)
  .then(async(data) =>{
    try {
      if (await argon2.verify(data[0].hash, password)) {
        // password match
      } else {
        // password did not match
      }
    } catch (err) {
      // internal failure
    }
  });
});


app.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  const hash = await hashPassword(password) ;
  db.transaction((trx) => {
      trx.insert({
        email: email,
        hash: hash
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
          trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => res.json(user[0]));
        })
        .then(trx.commit)
        .catch(trx.rollback);
        
  })
  .catch((err) => res.status(400).json("unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json("user not found");
      }
    })
    .catch((err) => res.status(404).json("error getting users"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("error getting entries"));
});

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
