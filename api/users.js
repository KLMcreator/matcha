const pool = require("./../pool.js");
const bcrypt = require("bcrypt");

const getLoggedUser = (request, response) => {
  const { token } = request;
  return new Promise(function (resolve, reject) {
    if (token) {
      pool.pool.query(
        "SELECT id, username, firstname, country, city, lastname, email, birthdate, gender, sexual_orientation, tags, bio, photos, popularity, connected, last_connection, reported_count, verified, completed FROM users WHERE connected_token = $1",
        [token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ user: false });
          } else {
            resolve(results.rows);
          }
        }
      );
    } else {
      resolve({ msg: "Unable to get logged user details." });
    }
  });
};

const toRadians = (degres) => {
  return degres * (Math.PI / 180);
};

const calcDistUsersMatch = (latUser, lonUser, latMatch, lonMatch) => {
  let distanceLat = toRadians(latMatch - latUser);
  let distanceLon = toRadians(lonMatch - lonUser);
  let distance =
    Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) +
    Math.cos(toRadians(latUser)) *
      Math.cos(toRadians(latMatch)) *
      Math.sin(distanceLon / 2) *
      Math.sin(distanceLon / 2);
  let calcul = 2 * Math.atan2(Math.sqrt(distance), Math.sqrt(1 - distance));
  let distInKm = 6371 * calcul;
  return distInKm;
};

const getUserInformations = (token) => {
  return new Promise(function (resolve, reject) {
    pool.pool.query(
      "SELECT gender, sexual_orientation, longitude, latitude FROM users WHERE connected_token = $1;",
      [token],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (!results.rowCount) {
          resolve({ user: false });
        } else {
          resolve(results.rows[0]);
        }
      }
    );
  });
};

const getUsers = (request, response) => {
  const { req, token } = request;
  let genderMatch;
  let sexOrienMatch;
  return getUserInformations(token).then((res) => {
    const getUserInfoResult = res;
    if (getUserInfoResult.gender === "Male") {
      if (
        getUserInfoResult.sexual_orientation === "Heterosexual" ||
        getUserInfoResult.sexual_orientation === "Asexual Heterosexual" ||
        getUserInfoResult.sexual_orientation === "Aromantic Heterosexual"
      ) {
        genderMatch = ["Female"];
        if (getUserInfoResult.sexual_orientation === "Heterosexual") {
          sexOrienMatch = [getUserInfoResult.sexual_orientation, "Bisexual"];
        } else {
          sexOrienMatch = [getUserInfoResult.sexual_orientation];
        }
      } else if (
        getUserInfoResult.sexual_orientation === "Homosexual" ||
        getUserInfoResult.sexual_orientation === "Asexual Homosexual" ||
        getUserInfoResult.sexual_orientation === "Aromantic Homosexual"
      ) {
        genderMatch = ["Male"];
        if (getUserInfoResult.sexual_orientation === "Homosexual") {
          sexOrienMatch = [getUserInfoResult.sexual_orientation, "Bisexual"];
        } else {
          sexOrienMatch = [getUserInfoResult.sexual_orientation];
        }
      } else {
        genderMatch = ["Female", "Male"];
        sexOrienMatch = ["Homosexual", "Bisexual", "Heterosexual"];
      }
    } else if (getUserInfoResult.gender === "Female") {
      if (
        getUserInfoResult.sexual_orientation === "Heterosexual" ||
        getUserInfoResult.sexual_orientation === "Asexual Heterosexual" ||
        getUserInfoResult.sexual_orientation === "Aromantic Heterosexual"
      ) {
        genderMatch = ["Male"];
        if (getUserInfoResult.sexual_orientation === "Heterosexual") {
          sexOrienMatch = [getUserInfoResult.sexual_orientation, "Bisexual"];
        } else {
          sexOrienMatch = [getUserInfoResult.sexual_orientation];
        }
        sexOrienMatch = [getUserInfoResult.sexual_orientation];
      } else if (
        getUserInfoResult.sexual_orientation === "Homosexual" ||
        getUserInfoResult.sexual_orientation === "Asexual Homosexual" ||
        getUserInfoResult.sexual_orientation === "Aromantic Homosexual" ||
        getUserInfoResult.sexual_orientation === "Lesbian"
      ) {
        genderMatch = ["Female"];
        if (
          getUserInfoResult.sexual_orientation === "Homosexual" ||
          getUserInfoResult.sexual_orientation === "Lesbian"
        ) {
          sexOrienMatch = [
            getUserInfoResult.sexual_orientation,
            "Bisexual",
            "Homosexual",
          ];
        } else {
          sexOrienMatch = [getUserInfoResult.sexual_orientation];
        }
      } else {
        genderMatch = ["Female", "Male"];
        sexOrienMatch = ["Homosexual", "Lesbian", "Bisexual", "Heterosexual"];
      }
    }
    return new Promise(function (resolve, reject) {
      pool.pool.query(
        "SELECT id, username, firstname, lastname, birthdate, gender, sexual_orientation, tags, bio, photos, popularity, last_connection, connected, verified, completed, country, city, latitude, longitude, reported, SUM(CASE WHEN label = ANY($1) THEN 1 ELSE 0 END) AS tagMatch FROM (SELECT u.id, u.username, u.firstname, u.lastname, u.birthdate, u.gender, u.sexual_orientation, u.tags, u.bio, u.photos, u.popularity, u.last_connection, u.connected, u.verified, u.completed, u.country, u.city, u.latitude, u.longitude, u.reported, u.connected_token, json_array_elements(tags::json)->>'label' AS label FROM users u WHERE NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = u.id AND bu.receiver = (SELECT id FROM users WHERE connected_token = $2)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = u.id AND bu.sender = (SELECT id FROM users WHERE connected_token = $3))) AS tag_labels WHERE verified = $4 AND completed = $5 AND reported = $6 AND EXTRACT(YEAR FROM age(to_date(birthdate, 'DD/MM/YYYY'))) BETWEEN $7 AND $8 AND popularity BETWEEN $9 AND $10 AND ((country = $11 AND city = $12) OR country = $13) AND (connected_token != $14 OR connected_token IS NULL) AND gender = ANY($15) AND sexual_orientation = ANY($16) GROUP BY id, username, firstname, lastname, birthdate, gender, sexual_orientation, tags, bio, photos, popularity, last_connection, connected, verified, completed, country, city, latitude, longitude, reported",
        [
          req.searchTags,
          token,
          token,
          true,
          true,
          false,
          req.minAge,
          req.maxAge,
          req.minPop,
          req.maxPop,
          req.country,
          req.city,
          req.country,
          token,
          genderMatch,
          sexOrienMatch,
        ],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ users: false });
          } else {
            let users = results.rows;
            if (getUserInfoResult.sexual_orientation === "Bisexual") {
              if (getUserInfoResult.gender === "Male") {
                users = users.filter((el) =>
                  (el.gender === "Male" &&
                    el.sexual_orientation === "Heterosexual") ||
                  (el.gender === "Female" &&
                    el.sexual_orientation === "Homosexual")
                    ? false
                    : true
                );
              } else if (getUserInfoResult.gender === "Female") {
                users = users.filter((el) =>
                  (el.gender === "Female" &&
                    el.sexual_orientation === "Heterosexual") ||
                  (el.gender === "Male" &&
                    el.sexual_orientation === "Lesbian") ||
                  (el.gender === "Male" &&
                    el.sexual_orientation === "Homosexual")
                    ? false
                    : true
                );
              }
            }
            users.map((el) => {
              el.km = calcDistUsersMatch(
                getUserInfoResult.latitude ? getUserInfoResult.latitude : 0,
                getUserInfoResult.longitude ? getUserInfoResult.longitude : 0,
                el.latitude,
                el.longitude
              );
            });
            users = users.sort((a, b) =>
              a.tagmatch > b.tagmatch
                ? -1
                : a.tagmatch < b.tagmatch
                ? 1
                : 0 || a.km < b.km
                ? -1
                : a.km > b.km
                ? 1
                : 0 || a.popularity < b.popularity
                ? -1
                : a.popularity > b.popularity
                ? 1
                : 0
            );
            if (req.proximity > 0) {
              users = users.filter((e) => e.km < req.proximity);
            }
            if (users.length > req.limit) {
              users = users.slice(0, req.limit);
            }
            resolve(users);
          }
        }
      );
    });
  });
};

const getUserList = (request, response) => {
  const { req, token } = request;
  return getUserInformations(token).then((res) => {
    const getUserInfoResult = res;
    return new Promise(function (resolve, reject) {
      if (req.country && req.city) {
        pool.pool.query(
          "SELECT id, username, firstname, lastname, birthdate, gender, sexual_orientation, tags, bio, photos, popularity, last_connection, connected, verified, completed, country, city, latitude, longitude, reported, SUM(CASE WHEN label = ANY($1) THEN 1 ELSE 0 END) AS tagMatch FROM (SELECT u.id, u.username, u.firstname, u.lastname, u.birthdate, u.gender, u.sexual_orientation, u.tags, u.bio, u.photos, u.popularity, u.last_connection, u.connected, u.verified, u.completed, u.country, u.city, u.latitude, u.longitude, u.reported, u.connected_token, json_array_elements(tags::json)->>'label' AS label FROM users u WHERE NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = u.id AND bu.receiver = (SELECT id FROM users WHERE connected_token = $2)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = u.id AND bu.sender = (SELECT id FROM users WHERE connected_token = $3))) AS tag_labels WHERE verified = $4 AND completed = $5 AND reported = $6 AND EXTRACT(YEAR FROM age(to_date(birthdate, 'DD/MM/YYYY'))) BETWEEN $7 AND $8 AND popularity BETWEEN $9 AND $10 AND ((country = $11 AND city = $12) OR country = $13) AND (connected_token != $14 OR connected_token IS NULL) GROUP BY id, username, firstname, lastname, birthdate, gender, sexual_orientation, tags, bio, photos, popularity, last_connection, connected, verified, completed, country, city, latitude, longitude, reported ORDER BY id",
          [
            req.searchTags,
            token,
            token,
            true,
            true,
            false,
            req.minAge,
            req.maxAge,
            req.minPop,
            req.maxPop,
            req.country,
            req.city,
            req.country,
            token,
          ],
          (error, results) => {
            if (error) {
              reject(error);
            }
            if (!results.rowCount) {
              resolve({ users: false });
            } else {
              let users = results.rows;
              getUserInfoResult.latitude ? getUserInfoResult.latitude : 0,
                users.map((el) => {
                  el.km = calcDistUsersMatch(
                    getUserInfoResult.latitude ? getUserInfoResult.latitude : 0,
                    getUserInfoResult.longitude
                      ? getUserInfoResult.longitude
                      : 0,
                    el.latitude,
                    el.longitude
                  );
                });
              if (users.length > req.limit) {
                users = users.slice(0, req.limit);
              }
              resolve(users);
            }
          }
        );
      } else {
        pool.pool.query(
          "SELECT id, username, firstname, lastname, birthdate, gender, sexual_orientation, tags, bio, photos, popularity, last_connection, connected, verified, completed, country, city, latitude, longitude, reported, SUM(CASE WHEN label = ANY($1) THEN 1 ELSE 0 END) AS tagMatch FROM (SELECT u.id, u.username, u.firstname, u.lastname, u.birthdate, u.gender, u.sexual_orientation, u.tags, u.bio, u.photos, u.popularity, u.last_connection, u.connected, u.verified, u.completed, u.country, u.city, u.latitude, u.longitude, u.reported, u.connected_token, json_array_elements(tags::json)->>'label' AS label FROM users u WHERE NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = u.id AND bu.receiver = (SELECT id FROM users WHERE connected_token = $2)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = u.id AND bu.sender = (SELECT id FROM users WHERE connected_token = $3))) AS tag_labels WHERE verified = $4 AND completed = $5 AND reported = $6 AND EXTRACT(YEAR FROM age(to_date(birthdate, 'DD/MM/YYYY'))) BETWEEN $7 AND $8 AND popularity BETWEEN $9 AND $10 AND (connected_token != $11 OR connected_token IS NULL) GROUP BY id, username, firstname, lastname, birthdate, gender, sexual_orientation, tags, bio, photos, popularity, last_connection, connected, verified, completed, country, city, latitude, longitude, reported ORDER BY id",
          [
            req.searchTags,
            token,
            token,
            true,
            true,
            false,
            req.minAge,
            req.maxAge,
            req.minPop,
            req.maxPop,
            token,
          ],
          (error, results) => {
            if (error) {
              reject(error);
            }
            if (!results.rowCount) {
              resolve({ users: false });
            } else {
              let users = results.rows;
              getUserInfoResult.latitude ? getUserInfoResult.latitude : 0,
                users.map((el) => {
                  el.km = calcDistUsersMatch(
                    getUserInfoResult.latitude ? getUserInfoResult.latitude : 0,
                    getUserInfoResult.longitude
                      ? getUserInfoResult.longitude
                      : 0,
                    el.latitude,
                    el.longitude
                  );
                });
              if (users.length > req.limit) {
                users = users.slice(0, req.limit);
              }
              resolve(users);
            }
          }
        );
      }
    });
  });
};

const getUserProfile = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.id) {
      pool.pool.query(
        "SELECT id, username, firstname, lastname, birthdate, gender, sexual_orientation, tags, bio, photos, popularity, last_connection, connected, verified, reported, reported_count, country, city FROM users WHERE id = $1 AND id != (SELECT id FROM users WHERE connected_token = $2) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = $3 AND bu.receiver = (SELECT id FROM users WHERE connected_token = $4)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = (SELECT id FROM users WHERE connected_token = $5) AND bu.sender = $6);",
        [req.id, token, req.id, token, token, req.id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ user: false });
          } else {
            resolve(results.rows);
          }
        }
      );
    } else {
      resolve({ msg: "Unable to get user profile." });
    }
  });
};

const getMinMaxAgePop = (request, response) => {
  return new Promise(function (resolve, reject) {
    pool.pool.query(
      "SELECT MIN(popularity) AS minpop, MAX(popularity) AS maxpop, MIN(to_date(birthdate, 'DD/MM/YYYY')) AS mindate, MAX(to_date(birthdate, 'DD/MM/YYYY')) AS maxdate FROM users",
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (!results.rowCount) {
          resolve(false);
        } else {
          resolve(results.rows);
        }
      }
    );
  });
};

const recoverPwd = (request, response) => {
  const { req } = request;
  return new Promise(function (resolve, reject) {
    if (req.login && req.email) {
      pool.pool.query(
        "SELECT COUNT(id) FROM users WHERE username = $1 AND email = $2;",
        [req.login, req.email],
        (error, resultSelect) => {
          if (error) {
            reject(error);
          }
          if (!resultSelect.rowCount) {
            resolve({ recover: false });
          } else {
            const rnd = [
              "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
              "abcdefghijklmnopqrstuvwxyz",
              "0123456789",
              "=-][./_@",
            ];
            let random = "";
            let i = 0;
            while (i < 14) {
              let id = Math.floor(Math.random() * 4);
              random += rnd[id].charAt(
                Math.floor(Math.random() * rnd[id].length)
              );
              i++;
            }
            bcrypt.hash(random, 10, function (err, hash) {
              pool.pool.query(
                "UPDATE users SET password = $1 WHERE username = $2 AND email = $3;",
                [hash, req.login, req.email],
                (error, resultUpdate) => {
                  if (error) {
                    reject(error);
                  }
                  if (!resultUpdate.rowCount) {
                    resolve({ recover: false });
                  } else {
                    resolve({
                      recover: true,
                      random: random,
                    });
                  }
                }
              );
            });
          }
        }
      );
    } else {
      resolve({ msg: "Missing informations." });
    }
  });
};

const updateLocation = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.lat && req.lon && token) {
      pool.pool.query(
        "UPDATE users SET latitude = $1, longitude = $2 WHERE connected_token = $3",
        [req.lat, req.lon, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({
              msg: "Error with user token.",
            });
          } else {
            resolve({ location: true });
          }
        }
      );
    } else {
      resolve({ msg: "Error with user token." });
    }
  });
};

module.exports = {
  updateLocation,
  recoverPwd,
  getUsers,
  getLoggedUser,
  getUserProfile,
  getMinMaxAgePop,
  getUserList,
  getUserInformations,
  calcDistUsersMatch,
  toRadians,
};
