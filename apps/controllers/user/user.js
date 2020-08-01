var jwt = require("jsonwebtoken");
var md5 = require("md5");
const config = require("config");
const User = require("../../../sequelizes").User;
const Auth = require("../../middlewares/auth");
const { validationResult } = require("express-validator");

const login = async (req, res) => {
  try {
    validationResult(req).throw(); //

    let { username, password } = req.body;

    let queryUser = await User.findAll({
      where: {
        username,
      },
    });

    if (queryUser.length > 0) {
      let passwords = md5(md5(password) + queryUser[0].code_security);
      if (queryUser[0].password == passwords) {
        let token = jwt.sign(
          {
            username,
            password,
            id: queryUser[0].id,
            email: queryUser[0].email,
          },
          config.get("site.secret")
        );
        res.status(200).json({
          stt: 0,
          msg: "Login success",
          success: true,
          token,
        });
      } else {
        throw {
          stt: 2,
          msg: "Password wrong!!",
          success: true,
        };
      }
    } else {
      throw {
        stt: 1,
        msg: "Username hasn't exist",
        success: false,
      };
    }
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};

const register = async (req, res) => {
  try {
    validationResult(req).throw(); //

    let { username, password, repassword } = req.body;

    if (password != repassword) {
      throw {
        stt: 2,
        msg: "Re-password not match password",
        success: false,
      };
    }

    let code_random = Math.floor(Math.random() * 10000);

    let passwords = md5(md5(password) + code_random);

    let queryUser = await User.findAll({
      where: {
        username,
      },
    });

    if (queryUser.length > 0) {
      throw {
        stt: 1,
        msg: "Username has exist",
        success: false,
      };
    } else {
      User.create({
        username,
        password: passwords,
        code_security: code_random,
      }).then((dataInsert) => {
        res.status(200).json({
          stt: 0,
          success: true,
          msg: "Register user success",
          dataInsert,
        });
      });
    }
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};

const fetchUserDetail = async (req, res) => {
  try {
    let detailUsers = await Auth(req);

    let queryUsers = await User.findAll({
      where: { id: detailUsers.id },
      attributes: ["id", "username", "name", "createdAt", "updatedAt"],
    });
    if (queryUsers.length > 0) {
      res.status(200).json(queryUsers[0]);
    } else {
      throw { msg: "Not found", success: false, stt: 404 };
    }
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};

module.exports = {
  login,
  register,
  fetchUserDetail,
};
