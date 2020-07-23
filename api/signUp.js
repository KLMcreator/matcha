const pool = require("./../pool.js");
const bcrypt = require("bcrypt");
const Moment = require("moment");
const MomentRange = require("moment-range");

const moment = MomentRange.extendMoment(Moment);

// Check if mail is already existing AND if user did not put space in the field
const checkMail = (request, response) => {
  return new Promise(function (resolve, reject) {
    const rgx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      request.email &&
      request.email.length === request.email.replace(/\s/g, "").length &&
      rgx.test(request.email)
    ) {
      pool.pool.query(
        "SELECT id FROM users where email = $1",
        [request.email],
        (error, results) => {
          if (error) {
            resolve(false);
          }
          if (!results.rowCount) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    } else {
      resolve(false);
    }
  });
};

// Check if password contain only letters and at least one cap, one min letter, one digit and at least 8 char AND if user did not put space in the field
const checkPassword = (request, response) => {
  return new Promise(function (resolve, reject) {
    let checkPwd = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    if (
      request.confirmedPassword &&
      request.password &&
      request.password.length === request.password.replace(/\s/g, "").length &&
      request.confirmedPassword === request.password &&
      checkPwd.test(request.password)
    ) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

// Check if username is already existing AND if user did not put space in the field
const checkUsername = (request, response) => {
  return new Promise(function (resolve, reject) {
    let accentedCharacters =
      "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";
    let checkSpecChar = new RegExp(
      "^[-'A-Z" + accentedCharacters + "a-z0-9 ]+$"
    );
    if (
      request.username &&
      request.username.length === request.username.replace(/\s/g, "").length &&
      checkSpecChar.test(request.username)
    ) {
      pool.pool.query(
        "SELECT * FROM users where username = $1",
        [request.username],
        (error, results) => {
          if (error) {
            resolve(false);
          }
          if (!results.rowCount) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    } else {
      resolve(false);
    }
  });
};

// Check if user did not put space in the field firstname
const checkFirstname = (request, response) => {
  let accentedCharacters =
    "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";
  let checkSpecChar = new RegExp("^[-'A-Z" + accentedCharacters + "a-z0-9 ]+$");
  return new Promise(function (resolve, reject) {
    if (
      request.firstName &&
      request.firstName.length ===
        request.firstName.replace(/\s/g, "").length &&
      checkSpecChar.test(request.firstName)
    ) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

// Check if user did not put space in the field lastname
const checkLastname = (request, response) => {
  let accentedCharacters =
    "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";
  let checkSpecChar = new RegExp("^[-'A-Z" + accentedCharacters + "a-z0-9 ]+$");
  return new Promise(function (resolve, reject) {
    if (
      request.lastName &&
      request.lastName.length === request.lastName.replace(/\s/g, "").length &&
      checkSpecChar.test(request.lastName)
    ) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

// Check if user is at least 18years old and is not more than 100y old
const checkBirthDate = (request, response) => {
  return new Promise((resolve, reject) => {
    if (
      moment()
        .range(moment().subtract(100, "years"), moment().subtract(18, "years"))
        .contains(moment(request.birthDate, "DD/MM/YYYY"))
    ) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

// Sign up -> username, lastname, firstname, gender, mail, age and password in database
const userSignUp = (request, response) => {
  const {
    username,
    firstName,
    lastName,
    email,
    birthDate,
    gender,
    password,
  } = request;
  return new Promise(function (resolve, reject) {
    checkBirthDate(request, response).then((birthCheck) => {
      if (birthCheck) {
        checkUsername(request, response).then((usernameCheck) => {
          if (usernameCheck) {
            checkFirstname(request, response).then((firstnameCheck) => {
              if (firstnameCheck) {
                checkLastname(request, response).then((lastnameCheck) => {
                  if (lastnameCheck) {
                    lastNameUpper = lastName.toUpperCase();
                    checkMail(request, response).then((result) => {
                      if (result) {
                        checkPassword(request, response).then((res) => {
                          if (res) {
                            bcrypt.hash(password, 10, function (err, hash) {
                              let random_value =
                                Math.floor(
                                  Math.random() * (4242424242 - 2424242424 + 1)
                                ) +
                                2424242424 +
                                Date.now();
                              pool.pool.query(
                                "INSERT INTO users (username, password, firstname, lastname, email, birthdate, gender, verified_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                                [
                                  username,
                                  hash,
                                  firstName,
                                  lastNameUpper,
                                  email,
                                  birthDate,
                                  gender ? gender : "Male",
                                  random_value,
                                ],
                                (error, results) => {
                                  if (error) {
                                    reject(error);
                                  }
                                  if (!results.rowCount) {
                                    resolve({
                                      msg:
                                        "Unable to create user. You probably already have an account.",
                                    });
                                  } else {
                                    resolve({
                                      signup: true,
                                      random: random_value,
                                    });
                                  }
                                }
                              );
                            });
                          } else {
                            resolve({ msg: "Incorrect password." });
                          }
                        });
                      } else {
                        resolve({ msg: "Incorrect email." });
                      }
                    });
                  } else {
                    resolve({ msg: "Incorrect lastname." });
                  }
                });
              } else {
                resolve({ msg: "Incorrect firstname." });
              }
            });
          } else {
            resolve({ msg: "Incorrect username." });
          }
        });
      } else {
        resolve({ msg: "Incorrect birthdate." });
      }
    });
  });
};

module.exports = { userSignUp };
