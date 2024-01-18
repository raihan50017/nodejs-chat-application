const uploader = require("../../utilities/singleUploader");

const avatarUpload = (req, res, next) => {
  const upload = uploader(
    "avatars",
    ["image/jpeg", "image/jpg", "image/png"],
    10000000,
    "Only .jpg, .jpeg, .png format allowed"
  );

  upload.any()(req, res, (err) => {
    console.log(req.body);
    if (err) {
      console.log(err)
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
};

module.exports = avatarUpload;
