const pool = require("./../pool.js");

const addVisits = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.receiver && token) {
      pool.pool.query(
        "SELECT id FROM users WHERE connected_token = $1",
        [token],
        (error, resultSenderId) => {
          if (error) {
            reject(error);
          }
          if (!resultSenderId.rowCount) {
            resolve({ msg: "Can't get sender id" });
          } else {
            let sender = resultSenderId.rows[0].id;
            pool.pool.query(
              "SELECT sender FROM visits WHERE receiver = $1 ORDER BY created_at DESC",
              [req.receiver],
              (error, resultCheckLastSender) => {
                if (error) {
                  reject(error);
                }
                if (
                  !resultCheckLastSender.rowCount ||
                  resultCheckLastSender.rows[0].sender !== sender
                ) {
                  pool.pool.query(
                    "INSERT INTO visits (sender, receiver, created_at) VALUES ($1, $2, (SELECT NOW()))",
                    [sender, req.receiver],
                    (error, resultInsertVisit) => {
                      if (error) {
                        reject(error);
                      }
                      if (!resultInsertVisit.rowCount) {
                        resolve({
                          msg: "Unable to update user visit history.",
                        });
                      } else {
                        pool.pool.query(
                          "UPDATE users SET popularity = (SELECT popularity FROM users WHERE id = $1) + $2 WHERE id = $3",
                          [req.receiver, 5, req.receiver],
                          (error, resultUpdatePop) => {
                            if (error) {
                              reject(error);
                            }
                            if (!resultUpdatePop.rowCount) {
                              resolve({
                                msg: "Unable to update user popularity score.",
                              });
                            } else {
                              pool.pool.query(
                                "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ((SELECT id FROM users WHERE connected_token = $1), $2, (SELECT NOW()), $3)",
                                [token, req.receiver, 3],
                                (error, resultAddNotif) => {
                                  if (error) {
                                    reject(error);
                                  }
                                  if (!resultAddNotif.rowCount) {
                                    resolve({
                                      msg:
                                        "Unable to update user notifications.",
                                    });
                                  } else {
                                    resolve({ visit: true });
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                } else {
                  resolve({
                    msg: "You were the last one that visited this profile.",
                  });
                }
              }
            );
          }
        }
      );
    } else {
      resolve({ msg: "Unable to add visit." });
    }
  });
};

const checkIfLoggedHasBeenVisited = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.receiver && token) {
      pool.pool.query(
        "SELECT created_at FROM visits WHERE receiver = (SELECT id FROM users WHERE connected_token = $1) AND sender = $2;",
        [token, req.receiver],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ checkLogged: false });
          } else {
            resolve({ checkLogged: results.rows });
          }
        }
      );
    } else {
      resolve({ msg: "Unable to check last visit state." });
    }
  });
};

const getLastVisits = (request, response) => {
  const { token } = request;
  return new Promise(function (resolve, reject) {
    if (token) {
      pool.pool.query(
        "SELECT u.username, v.sender, v.receiver, v.created_at FROM visits v INNER JOIN users u ON u.id = v.sender WHERE v.receiver = (SELECT id FROM users WHERE connected_token = $1) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = v.receiver AND bu.receiver = (SELECT id FROM users WHERE connected_token = $2)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = v.sender AND bu.sender = (SELECT id FROM users WHERE connected_token = $3)) ORDER BY v.created_at DESC;",
        [token, token, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ visitList: false });
          } else {
            resolve(results.rows);
          }
        }
      );
    } else {
      resolve({ msg: "Unable to get last visit." });
    }
  });
};

const getVisitList = (request, response) => {
  const { token } = request;
  return new Promise(function (resolve, reject) {
    if (token) {
      pool.pool.query(
        "SELECT u.username, v.sender, v.receiver, v.created_at FROM visits v INNER JOIN users u ON u.id = v.receiver WHERE v.sender = (SELECT id FROM users WHERE connected_token = $1) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = v.sender AND bu.receiver = (SELECT id FROM users WHERE connected_token = $2)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = v.receiver AND bu.sender = (SELECT id FROM users WHERE connected_token = $3)) ORDER BY v.created_at DESC;",
        [token, token, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ visitList: false });
          } else {
            resolve(results.rows);
          }
        }
      );
    } else {
      resolve({ msg: "Unable to get visit list." });
    }
  });
};

module.exports = {
  addVisits,
  getLastVisits,
  checkIfLoggedHasBeenVisited,
  getVisitList,
};
