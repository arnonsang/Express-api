const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const saltRounds = parseInt(process.env.SALT_ROUND);

const { User } = require("../../models/ICKURL/User");

const token = (payload) => jwt.sign(payload, SECRET, {expiresIn:'10d'});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.status(200).json({ status: "ok", message: "User Route" });
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body)
    try {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        res.json({ status: "err", message: "User Already Exists" });
        return;
      }
      //Password must include at least 1 uppercase, 1 lowercase, 1 number, and 8 characters
      const passwordREGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      const passwordInFormat = passwordREGEX.test(password);
      console.log(password, passwordInFormat)
      if (!passwordInFormat) {
        res.json({
          status: "err",
          message:
            "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 8 characters",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        username,
        password: hashedPassword,
      });

      await newUser.save();
      console.log(`${username} : has registered!`);
      res.json({ status: "ok", message: "User Registered" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "err", message: "An error occurred" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "err", message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.json({ status: "err", message: "User Not Exists" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const mytoken = token({data:username});
      req.session.user = user; // Store user data in the session if you're using Express sessions
      req.session.token = mytoken;
      console.log(req.session);
      console.log(`${username} : has logged in!`);
      res.json({ status: "ok", message: "Logged In", token:mytoken});
    } else {
      res.json({ status: "err", message: "Wrong Password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post('/auth', (req, res) => {
  const {username, token} = req.body;
  //check if there has an session
  if(req.session.user) return res.json({status:'ok', message:'Session found!'});
  jwt.verify(token, SECRET, function(err, decoded) {
    if(err) return res.json({status:'err', message:`TOKEN Can't verify or Expired!`})
    req.session.user = {username : decoded.data};
    console.log(`Session restore : ${decoded.data} : `, req.session)
    res.json({status:'ok', message:'TOKEN verified!', data:decoded})
  });

})

router.all("/logout", (req, res) => {
  const session = req.session.user;
  try{
    if(session){
      req.session.destroy();
      console.log(`${session.username} : has logged out!`);
      res.json({ status: "ok", message:`${session.username} : has logged out!`});
    }else{
      res.json({status:'ok', message:'User is not logged in!'})
    }

    }catch(err){
    console.error(err);
    res.status(500).json({ status: "err", message: "Internal User Server Error" });
  }
});

module.exports = router;
