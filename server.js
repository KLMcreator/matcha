// dependencies
const mime = require("mime");
const multer = require("multer");
const crypto = require("crypto");
const express = require("express");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// files
const users = require("./api/users");
const login = require("./api/login");
const block = require("./api/block");
const likes = require("./api/likes");
const signUp = require("./api/signUp");
const report = require("./api/report");
const visits = require("./api/visits");
const confirm = require("./api/confirm");
const settings = require("./api/settings");
const messages = require("./api/messages");
const notifications = require("./api/notifications");
// const
const app = express();
const port = process.env.PORT || 5000;
const secret = "mysecretsshhh";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./client/src/assets/photos/");
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(
        null,
        raw.toString("hex") +
          Date.now() +
          "." +
          mime.getExtension(file.mimetype)
      );
    });
  },
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// allow to use static path for files
app.use(express.static("client"));
// avoid xss
app.disable("x-powered-by");
// parsing cookie
app.use(cookieParser());
// needed to read and parse some responses
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const sendMail = (receiver, type, random) => {
  return new Promise(function (resolve, reject) {
    if (type && (type === 1 || type === 2) && receiver && random) {
      let subject;
      let text;
      subject = type === 1 ? "Welcome to Matcha!" : "Recover your password!";
      text =
        type === 1
          ? "Please click the link below to confirm your account creation: " +
            random
          : "Please use the following password to login, don't forget to change it: " +
            random;
      const transporter = nodeMailer.createTransport({
        port: 25,
        host: "localhost",
        tls: {
          rejectUnauthorized: false,
        },
        service: "Gmail",
        auth: {
          user: "matcha42.no.reply@gmail.com",
          pass: "Matcha_42",
        },
      });
      var message = {
        from: "matcha42.no.reply@gmail.com",
        to: receiver,
        subject: subject,
        text: text,
      };

      transporter.sendMail(message, (error, info) => {
        if (error) {
          resolve(error);
        } else {
          resolve(true);
        }
      });
    } else {
      resolve(false);
    }
  });
};

// Check if the token is valid, needed for react router
app.get("/api/checkToken", function (req, res) {
  const token = req.cookies._matchaAuth;
  if (!token) {
    res.send({ status: false });
  } else {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        res.send({ status: false });
      } else {
        login
          .checkToken({
            token: req.cookies._matchaAuth,
          })
          .then((response) => {
            if (response.token === true) {
              res.send({ status: true });
            } else {
              res.send({ status: false });
            }
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      }
    });
  }
});

// Check if the user profile is completed
app.get("/api/checkCompleted", function (req, res) {
  login
    .checkProfil({
      token: req.cookies._matchaAuth,
      login: false,
    })
    .then((response) => {
      if (response.token === true) {
        res.send({ status: true });
      } else {
        res.send({ status: false });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Post create account user
app.post("/api/signUp", (req, res) => {
  signUp
    .userSignUp(req.body)
    .then((response) => {
      if (response.signup) {
        sendMail(
          req.body.email,
          1,
          "http://localhost:3000/confirm?r=" +
            response.random +
            "&u=" +
            req.body.username +
            "&e=" +
            req.body.email
        )
          .then((result) => {
            if (result) {
              res.status(200).send({ signup: { signup: response.signup } });
            } else {
              res
                .status(200)
                .send({ signup: { msg: "Unable to send email." } });
            }
          })
          .catch((error) => {
            res.status(200).send({ signup: { msg: "Unable to send email." } });
          });
      } else {
        res.status(200).send({ signup: { msg: "Unable to create account." } });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Recover user password
app.post("/api/recover", (req, res) => {
  users
    .recoverPwd({ req: req.body })
    .then((response) => {
      if (response.recover) {
        sendMail(req.body.email, 2, response.random)
          .then((result) => {
            if (result) {
              res.status(200).send({ recover: { recover: response.recover } });
            } else {
              res
                .status(200)
                .send({ recover: { msg: "Unable to send email." } });
            }
          })
          .catch((error) => {
            res.status(200).send({ recover: { msg: "Unable to send email." } });
          });
      } else {
        res.status(200).send({
          recover: { msg: "Given informations don't match any users." },
        });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Confirm user account
app.post("/api/confirm/account", (req, res) => {
  confirm
    .usrAccount({ req: req.body })
    .then((response) => {
      res.status(200).send({ confirm: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Clear token and set connected state to false
app.get("/api/logout", (req, res) => {
  login
    .unsetLoggedUser({
      isLogged: false,
      token: req.cookies._matchaAuth,
    })
    .then((result) => {
      if (result.logout === true) {
        res.status(200).clearCookie("_matchaAuth", {
          path: "/",
        });
        res.send({ status: true });
      } else {
        res.send(result);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Post login and return a token to save the session if it went through
app.post("/api/login", (req, res) => {
  login
    .logUser(req.body)
    .then((response) => {
      if (response === true && res.statusCode === 200) {
        const token = jwt.sign({ login }, secret, {
          expiresIn: "24h",
        });
        login
          .setLoggedUser({
            login: req.body.login,
            isLogged: true,
            token: token,
          })
          .then((setLogged) => {
            if (setLogged.login === true) {
              login
                .checkProfil({
                  login: req.body.login,
                })
                .then((repCheckProf) => {
                  res.cookie("_matchaAuth", token, { httpOnly: true });
                  res.send({
                    login: true,
                    isCompleted: repCheckProf.isCompleted,
                  });
                })
                .catch((error) => {
                  res.status(500).send(error);
                });
            } else {
              res.send(setLogged);
            }
          });
      } else {
        res.send({ login: response });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get profile information of the logged user
app.get("/api/profile", (req, res) => {
  users
    .getLoggedUser({
      token: req.cookies._matchaAuth,
    })
    .then((response) => {
      res.status(200).send({ user: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post("/api/settings/checkIfCompleted", (req, res) => {
  settings
    .checkCompletedProfile({
      req: req.body,
      token: req.cookies._matchaAuth,
    })
    .then((response) => {
      if (response === true && res.statusCode === 200) {
        res
          .send({
            isCompleted: response.isCompleted,
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      } else {
        res.send(response);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get index user list
app.post("/api/user", (req, res) => {
  users
    .getUserProfile({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ user: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get search user list
app.post("/api/users/list", (req, res) => {
  users
    .getUserList({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ users: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get min and max for age and pop
app.post("/api/search/minMax", (req, res) => {
  users
    .getMinMaxAgePop()
    .then((response) => {
      res.status(200).send({ criteria: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get index user list
app.post("/api/users", (req, res) => {
  users
    .getUsers({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ users: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Add block user
app.post("/api/block/add", (req, res) => {
  block
    .blockUser({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ block: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Delete block user
app.post("/api/block/delete", (req, res) => {
  block
    .deleteBlockedUser({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ block: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get logged user block history
app.post("/api/block/get", (req, res) => {
  block
    .getBlockedList({ token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ block: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get logged user notifications
app.post("/api/notifications/get", (req, res) => {
  notifications
    .getNotifs({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ notification: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Delete logged user notifications
app.post("/api/notifications/clear", (req, res) => {
  notifications
    .clearNotifs({ token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ notification: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Mark as read notifications for logged user
app.post("/api/notifications/read", (req, res) => {
  notifications
    .markAsRead({ token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ notification: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get logged user message history with clicked user
app.post("/api/messages/get", (req, res) => {
  messages
    .getMessages({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Send message from logged user to matched user (clicked user)
app.post("/api/messages/send", (req, res) => {
  messages
    .sendMessage({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Delete message from logged user with matched user (clicked user) based on his id
app.post("/api/messages/delete", (req, res) => {
  messages
    .deleteMessage({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ delete: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Delete conversation
app.post("/api/messages/delete/all", (req, res) => {
  messages
    .deleteAllMessages({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ delete: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Report user
app.post("/api/report/user", (req, res) => {
  report
    .reportUser({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ report: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Update like and user points
app.post("/api/likes/update", (req, res) => {
  likes
    .updateLikes({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ like: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get logged user likes history
app.post("/api/likes/get", (req, res) => {
  likes
    .getLastLikes({ token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ like: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get logged user matched list
app.post("/api/likes/get/match", (req, res) => {
  likes
    .getMatchList({ token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ match: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get logged user detailed match list
app.post("/api/likes/get/match/detailed", (req, res) => {
  likes
    .getMatchListDetailed({ token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ match: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get logged user likes list
app.post("/api/likes/get/list", (req, res) => {
  likes
    .getLikeList({ token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ like: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Check if visited profile like the logged user
app.post("/api/likes/checkUser", (req, res) => {
  likes
    .checkIfUserLiked({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ like: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Check if logged user like the visited profile
app.post("/api/likes/checkLogged", (req, res) => {
  likes
    .checkIfLoggedLiked({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ like: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Check if logged user has been visited
app.post("/api/visit/checkLogged", (req, res) => {
  visits
    .checkIfLoggedHasBeenVisited({
      req: req.body,
      token: req.cookies._matchaAuth,
    })
    .then((response) => {
      res.status(200).send({ visit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Update visit history and user points
app.post("/api/visits/add", (req, res) => {
  visits
    .addVisits({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ visit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get logged user visit history
app.post("/api/visits/get", (req, res) => {
  visits
    .getLastVisits({ token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ visit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get logged user visit list
app.post("/api/visits/get/list", (req, res) => {
  visits
    .getVisitList({ token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ visit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get setting list
app.get("/api/settings/list", (req, res) => {
  settings
    .getSettingsList()
    .then((response) => {
      res.status(200).send({ list: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Edit user email | with clear cookie and push to signin page
app.post("/api/settings/email", (req, res) => {
  settings
    .editUserEmail({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      if (response.edit) {
        sendMail(
          req.body.verifEmail,
          1,
          "http://localhost:3000/confirm?r=" +
            response.random +
            "&u=" +
            req.body.username +
            "&e=" +
            req.body.verifEmail
        )
          .then((result) => {
            if (result) {
              res.status(200).clearCookie("_matchaAuth", {
                path: "/",
              });
              res.status(200).send({ edit: { edit: response.edit } });
            } else {
              res.status(200).send({ edit: { msg: "Unable to send email." } });
            }
          })
          .catch((error) => {
            res.status(200).send({ edit: { msg: "Unable to send email." } });
          });
      } else {
        res.status(200).send({ edit: { msg: "Unable to edit." } });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Edit user password | with clear cookie and push to signin page
app.post("/api/settings/password", (req, res) => {
  settings
    .editUserPassword({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      if (response.edit === true) {
        res.status(200).clearCookie("_matchaAuth", {
          path: "/",
        });
      }
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Edit user birthdate
app.post("/api/settings/birthdate", (req, res) => {
  settings
    .editUserBirthdate({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Edit user gender
app.post("/api/settings/gender", (req, res) => {
  settings
    .editUserGender({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Edit user sexor
app.post("/api/settings/sexor", (req, res) => {
  settings
    .editUserSexOr({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Edit user tags
app.post("/api/settings/tags", (req, res) => {
  settings
    .editUserTags({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Edit user bio
app.post("/api/settings/bio", (req, res) => {
  settings
    .editUserBio({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Update user lat n lon
app.post("/api/settings/latlon", (req, res) => {
  users
    .updateLocation({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ location: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Edit user firstname
app.post("/api/settings/firstname", (req, res) => {
  settings
    .editUserFirstname({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Edit user location
app.post("/api/settings/location", (req, res) => {
  settings
    .editUserLocation({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Edit user lastname
app.post("/api/settings/lastname", (req, res) => {
  settings
    .editUserLastname({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Add profile picture
app.post("/api/settings/add/photo", (req, res) => {
  const upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
    if (!req.file) {
      res.status(200).send({ edit: { msg: "No files uploaded." } });
    } else {
      settings
        .addUserPhoto({
          filename: req.file.filename,
          photos: req.body.photos,
          index: req.body.index > 5 ? 5 : req.body.index,
          token: req.cookies._matchaAuth,
        })
        .then((response) => {
          res.status(200).send({ edit: response });
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    }
  });
});

// Edit main profile picture
app.post("/api/settings/edit/photo", (req, res) => {
  settings
    .editUserPhoto({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Delete profile picture
app.post("/api/settings/delete/photo", (req, res) => {
  settings
    .deleteUserPhoto({ req: req.body, token: req.cookies._matchaAuth })
    .then((response) => {
      res.status(200).send({ edit: response });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Delete user account and all the related datas
app.post("/api/settings/delete/user", (req, res) => {
  settings
    .deleteUser({ token: req.cookies._matchaAuth })
    .then((response) => {
      if (response.delete === true) {
        res.status(200).clearCookie("_matchaAuth", {
          path: "/",
        });
        res.send({ delete: true });
      } else {
        res.send(result);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
