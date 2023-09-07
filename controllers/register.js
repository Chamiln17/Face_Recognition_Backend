import argon2 from "argon2";


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


export const handleRegister = async (req, res ,db ) => {
    const { email, name, password } = req.body;
    if (!email || !password || !name){
        return res.status(400).json("incorrect form submission");
    }
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
  }