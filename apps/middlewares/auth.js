const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let token =
      req.headers["x-access-token"] ||
      req.headers["authorization"] ||
      req.cookies.token ||
      null;
      // Express headers are auto converted to lowercase
      if (token) {
        if (token.startsWith("Bearer ")) {
          token = token.slice(7, token.length);
          jwt.verify(token, config.get("site.secret"), (error, data) => {
            if (error) {
              reject({
                msg: "Authentication failed! Please check the request",
                success: false,
                stt: 1,
              });
            }
            resolve(data);
          });
        }
      } else {
        reject({
          msg: "Authentication Emtry! Please check the request",
          success: false,
          stt: 2,
        });
      }
    } catch (err) {
      reject({
        msg: err.message,
        success: false,
        stt: 3,
      });
      console.log(err.message);
    }
  });
};
