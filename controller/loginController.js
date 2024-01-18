const People = require("../modals/People");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getLogin = (req, res, next) => {
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.redirect("/inbox");
    } catch (err) {
      res.render("index");
    }
  } else {
    res.render("index");
  }
};

const login = async (req, res, next) => {
  try {
    const user = await People.findOne({
      $or: [
        {
          email: req.body.username,
        },
        {
          mobile: req.body.username,
        },
      ],
    });

    if (user && user._id) {
      const passwordIsValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (passwordIsValid) {
        const userObject = {
          userId: user._id,
          username: user.name,
          mobile: user.mobile,
          email: user.email,
          avatar: user.avatar || null,
          role: user.role || "user",
        };

        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.EXPIRE_IN,
        });

        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.EXPIRE_IN,
          httpOnly: true,
          signed: true,
        });

        res.locals.loggedInUser = userObject;
        res.redirect("/inbox");
      } else {
        res.locals.data = req.body;
        res.locals.errors = {
          common: {
            msg: "Authentication failed",
          },
        };
        res.render("index");
      }
    } else {
      res.locals.data = req.body;
      res.locals.errors = {
        common: {
          msg: "Authentication failed",
        },
      };
      res.render("index");
    }
  } catch (err) {
    res.locals.data = req.body;
    res.locals.errors = {
      common: {
        msg: "Authentication failed",
      },
    };
    res.render("index");
  }
};

const logout = (req, res, next) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("Logged Out");
};
module.exports = {
  logout,
  login,
  getLogin,
};
