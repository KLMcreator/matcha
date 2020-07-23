const pool = require("./../pool.js");
const fs = require("fs");
const bcrypt = require("bcrypt");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);

// Get lists
const getSettingsList = () => {
  return new Promise(function (resolve, reject) {
    pool.pool.query(
      "SELECT genderList, sexualList, tagList FROM settingsList",
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (!results.rowCount) {
          resolve({ list: false });
        } else {
          resolve(results.rows);
        }
      }
    );
  });
};

const checkEmail = (req, token) => {
  return new Promise(function (resolve, reject) {
    if (
      req.email &&
      req.newEmail &&
      req.verifEmail &&
      req.email !== req.newEmail &&
      req.newEmail === req.verifEmail &&
      req.newEmail.length === req.newEmail.replace(/\s/g, "").length
    ) {
      pool.pool.query(
        "SELECT COUNT(email) FROM users WHERE email = $1 AND connected_token = $2 AND (SELECT COUNT(email) FROM users WHERE email = $3) = $4",
        [req.email, token, req.verifEmail, 0],
        (error, results) => {
          if (error) {
            resolve(false);
          }
          if (results.rows[0].count === "1") {
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

const checkPassword = (req, token) => {
  return new Promise(function (resolve, reject) {
    let checkNewPwd = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    if (
      req.password &&
      req.newPassword &&
      req.verifPassword &&
      req.password !== req.newPassword &&
      req.newPassword.length === req.newPassword.replace(/\s/g, "").length &&
      req.newPassword === req.verifPassword &&
      checkNewPwd.test(req.newPassword)
    ) {
      pool.pool.query(
        "SELECT password FROM users WHERE connected_token = $1",
        [token],
        (error, results) => {
          if (error) {
            resolve(false);
          }
          if (results.rowCount === 1) {
            resolve(results.rows[0].password);
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

const editUserEmail = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.email && token) {
      checkEmail(req, token).then((res) => {
        if (res) {
          let random_value =
            Math.floor(Math.random() * (4242424242 - 2424242424 + 1)) +
            2424242424 +
            Date.now();
          pool.pool.query(
            "UPDATE users SET connected = $1, connected_token = $2, email = $3, verified = $4, verified_value = $5 WHERE email = $6 AND connected_token = $7 returning username",
            [
              false,
              null,
              req.verifEmail,
              false,
              random_value,
              req.email,
              token,
            ],
            (error, results) => {
              if (error) {
                reject(error);
              }
              if (!results.rowCount) {
                resolve({
                  msg: "Email does not correspond to the logged user.",
                });
              } else {
                resolve({
                  edit: true,
                  random: random_value,
                  rows: results.rows,
                });
              }
            }
          );
        } else {
          resolve({
            msg:
              "Email already in use or doesn't respect standard email format.",
          });
        }
      });
    } else {
      resolve({ msg: "Unable to update your email." });
    }
  });
};

const editUserPassword = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.password && req.newPassword && token) {
      checkPassword(req, token).then((res) => {
        if (res) {
          bcrypt.compare(req.password, res, function (err, result) {
            if (result) {
              bcrypt.hash(req.newPassword, 10, function (err, hash) {
                pool.pool.query(
                  "UPDATE users SET connected = $1, connected_token = $2, password = $3 WHERE password = $4 AND connected_token = $5",
                  [false, null, hash, res, token],
                  (error, results) => {
                    if (error) {
                      reject(error);
                    }
                    if (!results.rowCount) {
                      resolve({
                        msg:
                          "There's an error with your old password, double check.",
                      });
                    } else {
                      resolve({ edit: true });
                    }
                  }
                );
              });
            } else {
              resolve({
                msg: "Your password does not match the registered password",
              });
            }
          });
        } else {
          resolve({
            msg:
              "Password does not match the rules or is not different than your old one.",
          });
        }
      });
    } else {
      resolve({ msg: "Unable to update your password." });
    }
  });
};

const editUserBirthdate = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.birthdate && token) {
      if (
        moment()
          .range(
            moment().subtract(100, "years"),
            moment().subtract(18, "years")
          )
          .contains(moment(req.birthdate, "YYYY-MM-DD"))
      ) {
        pool.pool.query(
          "UPDATE users SET birthdate = $1 WHERE connected_token = $2",
          [
            moment(moment(req.birthdate, "YYYY-MM-DD").toDate()).format(
              "DD/MM/YYYY"
            ),
            token,
          ],
          (error, results) => {
            if (error) {
              reject(error);
            }
            if (!results.rowCount) {
              resolve({
                msg: "Unable to update your birthdate.",
              });
            } else {
              resolve({ edit: true });
            }
          }
        );
      } else {
        resolve({
          msg: "You must be between 18 and 100 years old to create an account.",
        });
      }
    } else {
      resolve({ msg: "Unable to edit your birthdate." });
    }
  });
};

const editUserGender = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.gender && token) {
      pool.pool.query(
        "UPDATE users SET gender = $1 WHERE connected_token = $2",
        [req.gender, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({
              msg: "Unable to update your gender.",
            });
          } else {
            resolve({ edit: true });
          }
        }
      );
    } else {
      resolve({ msg: "Unable to edit your gender." });
    }
  });
};

const editUserLocation = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.country && req.city && token) {
      pool.pool.query(
        "UPDATE users SET country = $1, city = $2 WHERE connected_token = $3",
        [req.country, req.city, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({
              msg: "Unable to update your location.",
            });
          } else {
            resolve({ location: true });
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to edit your location.",
      });
    }
  });
};

const editUserSexOr = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.sexual_orientation && token) {
      pool.pool.query(
        "UPDATE users SET sexual_orientation = $1 WHERE connected_token = $2",
        [req.sexual_orientation, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({
              msg: "Unable to update your sexual orientation.",
            });
          } else {
            resolve({ edit: true });
          }
        }
      );
    } else {
      resolve({ msg: "Unable to edit your sexual orientation." });
    }
  });
};

const editUserTags = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (token && req) {
      let tags;
      if (!Object.keys(req.tags).length) {
        tags = null;
      } else {
        tags = JSON.stringify(req.tags);
      }
      pool.pool.query(
        "UPDATE users SET tags = $1 WHERE connected_token = $2",
        [tags, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({
              msg: "Unable to update your tags.",
            });
          } else {
            resolve({ edit: true });
          }
        }
      );
    } else {
      resolve({ msg: "Unable to update your tags." });
    }
  });
};

const editUserBio = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.bio && token) {
      let bio = req.bio.trim();
      if (bio.length < 280) {
        pool.pool.query(
          "UPDATE users SET bio = $1 WHERE connected_token = $2",
          [bio ? bio : null, token],
          (error, results) => {
            if (error) {
              reject(error);
            }
            if (!results.rowCount) {
              resolve({
                msg: "Unable to update your bio.",
              });
            } else {
              resolve({ edit: true });
            }
          }
        );
      } else {
        resolve({ msg: "You dirty boy, it's 280 char max, I SAID." });
      }
    } else {
      resolve({ msg: "Unable to edit your bio." });
    }
  });
};

const editUserFirstname = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.firstname && token) {
      let accentedCharacters =
        "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";
      let checkSpecChar = new RegExp(
        "^[-'A-Z" + accentedCharacters + "a-z ]+$"
      );
      if (
        req.firstname &&
        req.firstname.length === req.firstname.replace(/\s/g, "").length &&
        checkSpecChar.test(req.firstname)
      ) {
        pool.pool.query(
          "UPDATE users SET firstname = $1 WHERE connected_token = $2",
          [req.firstname, token],
          (error, results) => {
            if (error) {
              reject(error);
            }
            if (!results.rowCount) {
              resolve({
                msg: "Unable to update your firstname.",
              });
            } else {
              resolve({ edit: true });
            }
          }
        );
      } else {
        resolve({
          msg: "First name can't be null and must only contain letters.",
        });
      }
    } else {
      resolve({ msg: "Unable to edit your firstname." });
    }
  });
};

const editUserLastname = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (token && req.lastname) {
      let accentedCharacters =
        "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";
      let checkSpecChar = new RegExp(
        "^[-'A-Z" + accentedCharacters + "a-z ]+$"
      );
      if (
        req.lastname &&
        req.lastname.length === req.lastname.replace(/\s/g, "").length &&
        checkSpecChar.test(req.lastname)
      ) {
        let lastName = req.lastname.toUpperCase();
        pool.pool.query(
          "UPDATE users SET lastname = $1 WHERE connected_token = $2",
          [lastName ? lastName : null, token],
          (error, results) => {
            if (error) {
              reject(error);
            }
            if (!results.rowCount) {
              resolve({
                msg: "Unable to update your lastname.",
              });
            } else {
              resolve({ edit: true });
            }
          }
        );
      } else {
        resolve({
          msg: "Lastname can't be null and must only contain letters.",
        });
      }
    } else {
      resolve({ msg: "Unable to edit your lastname." });
    }
  });
};

const addUserPhoto = (request, response) => {
  const { filename, index, token } = request;
  let photos = JSON.parse(request.photos);
  photos[index] = filename;
  return new Promise(function (resolve, reject) {
    if ((filename, index, token)) {
      pool.pool.query(
        "UPDATE users SET photos = $1 WHERE connected_token = $2",
        [JSON.stringify(photos), token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({
              msg: "Unable to update your photos.",
            });
          } else {
            resolve({ edit: true, photos: photos });
          }
        }
      );
    } else {
      resolve({ msg: "Unable to get add a photos." });
    }
  });
};

const editUserPhoto = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.photos && token) {
      pool.pool.query(
        "UPDATE users SET photos = $1 WHERE connected_token = $2",
        [JSON.stringify(req.photos), token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({
              msg: "Unable to update your main profile picture.",
            });
          } else {
            resolve({ edit: true });
          }
        }
      );
    } else {
      resolve({ msg: "Unable to edit your photos." });
    }
  });
};

const checkCompletedProfile = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.username && token) {
      pool.pool.query(
        "SELECT photos FROM users WHERE username = $1 AND connected_token = $2",
        [req.username, token],
        (error, resultPhotos) => {
          if (error) {
            reject(error);
          }
          if (resultPhotos.rows[0] && resultPhotos.rows[0].photos) {
            let photos = JSON.parse(resultPhotos.rows[0].photos);
            pool.pool.query(
              "SELECT completed FROM users WHERE username = $1 AND connected_token = $2 AND username IS NOT NULL AND country IS NOT NULL AND city IS NOT NULL AND password IS NOT NULL AND firstname IS NOT NULL AND lastname IS NOT NULL AND email IS NOT NULL AND birthdate IS NOT NULL AND gender IS NOT NULL AND sexual_orientation IS NOT NULL AND tags IS NOT NULL AND bio IS NOT NULL;",
              [req.username, token],
              (error, resultCompleted) => {
                if (error) {
                  reject(error);
                }
                if (
                  photos[0] &&
                  resultCompleted.rows[0] &&
                  resultCompleted.rows[0].completed === false
                ) {
                  pool.pool.query(
                    "UPDATE users SET completed = true WHERE username = $1 AND connected_token = $2",
                    [req.username, token],
                    (error, results) => {
                      if (error) {
                        reject(error);
                      }
                      resolve({
                        isCompleted: true,
                        msg:
                          "Your profile is completed, you can match with people.",
                      });
                    }
                  );
                } else if (
                  photos[0] &&
                  resultCompleted.rows[0] &&
                  resultCompleted.rows[0].completed === true
                ) {
                  resolve({
                    isCompleted: true,
                    msg:
                      "Your profile is completed, you can match with people.",
                  });
                } else {
                  pool.pool.query(
                    "UPDATE users SET completed = false WHERE username = $1 AND connected_token = $2",
                    [req.username, token],
                    (error, results) => {
                      if (error) {
                        reject(error);
                      }
                      resolve({
                        isCompleted: false,
                        msg:
                          "You must fill all your settings before access to matches.",
                      });
                    }
                  );
                }
              }
            );
          } else {
            resolve({ msg: "Unable to get user photos." });
          }
        }
      );
    } else {
      resolve({ msg: "Unable to check your account state." });
    }
  });
};

const deleteUserPhoto = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.index !== 0 && token) {
      if (
        fs.existsSync("./client/src/assets/photos/" + req.photos[req.index])
      ) {
        let photos = [...req.photos];
        photos.splice(req.index, 1);
        photos[4] = null;
        pool.pool.query(
          "UPDATE users SET photos = $1 WHERE connected_token = $2",
          [JSON.stringify(photos), token],
          (error, results) => {
            if (error) {
              reject(error);
            }
            if (!results.rowCount) {
              resolve({
                msg: "Unable to delete your picture from the database.",
              });
            } else {
              fs.unlinkSync(
                "./client/src/assets/photos/" + req.photos[req.index]
              );
              resolve({ edit: true, photos: photos });
            }
          }
        );
      } else {
        resolve({
          msg: "Unable to delete your picture from the server.",
        });
      }
    } else {
      resolve({
        msg: "You can't delete your only photo.",
      });
    }
  });
};

const deleteUser = (request, response) => {
  const { token } = request;
  return new Promise(function (resolve, reject) {
    if (token) {
      pool.pool.query(
        "DELETE FROM blocked WHERE sender = (SELECT id FROM users WHERE connected_token = $1) OR receiver = (SELECT id FROM users WHERE connected_token = $2)",
        [token, token],
        (error, resultsBlocked) => {
          if (error) {
            reject(error);
          }
          pool.pool.query(
            "DELETE FROM likes WHERE sender = (SELECT id FROM users WHERE connected_token = $1) OR receiver = (SELECT id FROM users WHERE connected_token = $2)",
            [token, token],
            (error, resultsLikes) => {
              if (error) {
                reject(error);
              }
              pool.pool.query(
                "DELETE FROM notifications WHERE sender = (SELECT id FROM users WHERE connected_token = $1) OR receiver = (SELECT id FROM users WHERE connected_token = $2)",
                [token, token],
                (error, resultsNotifications) => {
                  if (error) {
                    reject(error);
                  }
                  pool.pool.query(
                    "DELETE FROM messages WHERE sender = (SELECT id FROM users WHERE connected_token = $1) OR receiver = (SELECT id FROM users WHERE connected_token = $2)",
                    [token, token],
                    (error, resultsMessages) => {
                      if (error) {
                        reject(error);
                      }
                      pool.pool.query(
                        "DELETE FROM visits WHERE sender = (SELECT id FROM users WHERE connected_token = $1) OR receiver = (SELECT id FROM users WHERE connected_token = $2)",
                        [token, token],
                        (error, resultsVisits) => {
                          if (error) {
                            reject(error);
                          }
                          pool.pool.query(
                            "SELECT photos FROM users WHERE id = (SELECT id FROM users WHERE connected_token = $1) AND connected_token = $2;",
                            [token, token],
                            (error, resultsPhotos) => {
                              if (error) {
                                reject(error);
                              }
                              if (resultsPhotos.rows[0]) {
                                let photos = JSON.parse(
                                  resultsPhotos.rows[0].photos
                                );
                                let i = 0;
                                while (i < 5) {
                                  if (photos[i] === null) break;
                                  else {
                                    if (
                                      fs.existsSync(
                                        "./client/src/assets/photos/" +
                                          photos[i]
                                      )
                                    ) {
                                      fs.unlinkSync(
                                        "./client/src/assets/photos/" +
                                          photos[i]
                                      );
                                    }
                                  }
                                  i++;
                                }
                              }
                              pool.pool.query(
                                "DELETE FROM users WHERE id = (SELECT id FROM users WHERE connected_token = $1) AND connected_token = $2",
                                [token, token],
                                (error, resultsUsers) => {
                                  if (error) {
                                    reject(error);
                                  }
                                  if (!resultsUsers.rowCount) {
                                    resolve({
                                      msg: "Unable to delete your account.",
                                    });
                                  } else {
                                    resolve({ delete: true });
                                  }
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    } else {
      resolve({
        msg: "Unable to delete your account.",
      });
    }
  });
};

module.exports = {
  checkCompletedProfile,
  addUserPhoto,
  deleteUserPhoto,
  deleteUser,
  getSettingsList,
  editUserEmail,
  editUserPassword,
  editUserBirthdate,
  editUserGender,
  editUserSexOr,
  editUserTags,
  editUserBio,
  editUserFirstname,
  editUserLastname,
  editUserPhoto,
  editUserLocation,
};
