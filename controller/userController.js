const bcrypt = require("bcrypt");
const People = require("../modals/People");
const fs = require("fs");

const getUser = async (req, res, next) => {
  try {
    const users = await People.find();
    res.render("users", {
      users,
    });
  } catch (err) {
    next(err);
  }
};

const removeUser = async (req, res, next) => {
  try {
    const user = await People.findByIdAndDelete({
      _id: req.params.id,
    });

    if (user.avatar) {
      fs.unlink(
        `${__dirname}/../public/uploads/avatars/${user.avatar}`,
        (err) => {
          if (err) {
            if (err) {
              console.log(err);
            }
          }
        }
      );
    }

    res.status(200).json({
      message: "User was deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user",
        },
      },
    });
  }
};

const addUser = async (req, res, next) => {
  const hashPassword = await bcrypt.hash(req.body.password, 10);

  const user = new People({
    ...req.body,
    avatar: req.files[0]?.filename,
    password: hashPassword,
  });

  try {
    const result = await user.save();
    res.status(200).json({
      message: "User was added successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured",
        },
      },
    });
  }
};

module.exports = {
  addUser,
  getUser,
  removeUser,
};
