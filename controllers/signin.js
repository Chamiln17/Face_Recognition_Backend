




const handleSignIn =(req, res, db,argon2) => {
    const { email, password } = req.body;
    if (!email || !password ){
      return res.status(400).json("incorrect form submission");
  }
    db.select("email", "hash").from("login")
    .where("email", "=", email)
    .then(async(data) =>{
      try {
        const isValid =await argon2.verify(data[0].hash, password);
        if (isValid) {
          return db.select("*").from("users")  // password match
          .where("email", "=", email)
          .then((user) => {res.json(user[0])})
          .catch((err) => res.status(400).json("unable to get user"));
        } else {
          res.status(400).json("wrong credentials");// password did not match
        }
      } catch (err) {
        res.status(400).json("failed to login");//  error
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
  }
  export {handleSignIn}