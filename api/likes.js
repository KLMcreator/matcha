const pool = require("../pool.js");

// when like is updated (unliked = false)
// check if sender = receiver and receiver = sender
// send notif type 5

const checkIfMatch = (token, receiver) => {
  return new Promise(function (resolve, reject) {
    pool.pool.query(
      "SELECT COUNT (*), a.created_at FROM likes a JOIN (SELECT sender, receiver, unliked, MAX(created_at) FROM likes WHERE sender = (SELECT id FROM users WHERE connected_token = $1) GROUP BY sender, receiver, unliked) b ON a.sender = b.receiver INNER JOIN users u1 ON u1.id = a.receiver INNER JOIN users u2 ON u2.id = b.receiver AND a.receiver = b.sender AND a.sender = $2 AND b.receiver = $3 AND a.unliked = $4 AND b.unliked = $5 GROUP BY a.created_at HAVING COUNT(*) > 0 ORDER BY created_at DESC;",
      [token, receiver, receiver, false, false],
      (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        if (results.rowCount === 1) {
          resolve(0);
        } else {
          resolve(1);
        }
      }
    );
  });
};

const updateLikes = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.receiver && token) {
      pool.pool.query(
        "SELECT sender, receiver, unliked, created_at FROM likes WHERE sender = (SELECT id FROM users WHERE connected_token = $1) AND receiver = $2",
        [token, req.receiver],
        (error, resultSelect) => {
          if (error) {
            reject(error);
          }
          if (!resultSelect.rowCount) {
            pool.pool.query(
              "INSERT INTO likes (sender, receiver, created_at) VALUES ((SELECT id FROM users WHERE connected_token = $1), $2, (SELECT NOW()))",
              [token, req.receiver],
              (error, resultInsert) => {
                if (error) {
                  reject(error);
                }
                if (!resultInsert.rowCount) {
                  resolve({ msg: "Error adding like." });
                } else {
                  pool.pool.query(
                    "UPDATE users SET popularity = (SELECT popularity FROM users WHERE id = $1) + $2 WHERE id = $3",
                    [req.receiver, 50, req.receiver],
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
                          [token, req.receiver, 1],
                          (error, resultAddNotif) => {
                            if (error) {
                              reject(error);
                            }
                            if (!resultAddNotif.rowCount) {
                              resolve({
                                msg: "Unable to update user notifications.",
                              });
                            } else {
                              checkIfMatch(token, req.receiver)
                                .then((res) => {
                                  if (res === 0) {
                                    pool.pool.query(
                                      "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ((SELECT id FROM users WHERE connected_token = $1), $2, (SELECT NOW()), $3)",
                                      [token, req.receiver, 5],
                                      (error, resultAddNotifMatchSender) => {
                                        if (error) {
                                          reject(error);
                                        }
                                        if (
                                          !resultAddNotifMatchSender.rowCount
                                        ) {
                                          resolve({
                                            msg:
                                              "Unable to update user notifications.",
                                          });
                                        } else {
                                          pool.pool.query(
                                            "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ($1, (SELECT id FROM users WHERE connected_token = $2), (SELECT NOW()), $3)",
                                            [req.receiver, token, 5],
                                            (error, resultAddNotifReceiver) => {
                                              if (error) {
                                                reject(error);
                                              }
                                              if (
                                                !resultAddNotifReceiver.rowCount
                                              ) {
                                                resolve({
                                                  msg:
                                                    "Unable to update user notifications.",
                                                });
                                              } else {
                                                resolve({ update: true });
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );
                                  } else {
                                    resolve({ update: true });
                                  }
                                })
                                .catch((e) =>
                                  resolve({
                                    msg: e,
                                  })
                                );
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
            if (resultSelect.rows[0].unliked === true) {
              pool.pool.query(
                "UPDATE likes SET unliked = $1, created_at = (SELECT NOW()) WHERE sender = (SELECT id FROM users WHERE connected_token = $2) AND receiver = $3 AND unliked = $4",
                [false, token, req.receiver, true],
                (error, resultUpdate) => {
                  if (error) {
                    reject(error);
                  }
                  if (!resultUpdate.rowCount) {
                    resolve({ msg: "Error updating like state." });
                  } else {
                    pool.pool.query(
                      "UPDATE users SET popularity = (SELECT popularity FROM users WHERE id = $1) + $2 WHERE id = $3",
                      [req.receiver, 50, req.receiver],
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
                            [token, req.receiver, 1],
                            (error, resultAddNotif) => {
                              if (error) {
                                reject(error);
                              }
                              if (!resultAddNotif.rowCount) {
                                resolve({
                                  msg: "Unable to update user notifications.",
                                });
                              } else {
                                checkIfMatch(token, req.receiver)
                                  .then((res) => {
                                    if (res === 0) {
                                      pool.pool.query(
                                        "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ((SELECT id FROM users WHERE connected_token = $1), $2, (SELECT NOW()), $3)",
                                        [token, req.receiver, 5],
                                        (error, resultAddNotifMatchSender) => {
                                          if (error) {
                                            reject(error);
                                          }
                                          if (
                                            !resultAddNotifMatchSender.rowCount
                                          ) {
                                            resolve({
                                              msg:
                                                "Unable to update user notifications.",
                                            });
                                          } else {
                                            pool.pool.query(
                                              "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ($1, (SELECT id FROM users WHERE connected_token = $2), (SELECT NOW()), $3)",
                                              [req.receiver, token, 5],
                                              (
                                                error,
                                                resultAddNotifReceiver
                                              ) => {
                                                if (error) {
                                                  reject(error);
                                                }
                                                if (
                                                  !resultAddNotifReceiver.rowCount
                                                ) {
                                                  resolve({
                                                    msg:
                                                      "Unable to update user notifications.",
                                                  });
                                                } else {
                                                  resolve({ update: true });
                                                }
                                              }
                                            );
                                          }
                                        }
                                      );
                                    } else {
                                      resolve({ update: true });
                                    }
                                  })
                                  .catch((e) =>
                                    resolve({
                                      msg: e,
                                    })
                                  );
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
              checkIfMatch(token, req.receiver)
                .then((res) => {
                  if (res === 0) {
                    pool.pool.query(
                      "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ((SELECT id FROM users WHERE connected_token = $1), $2, (SELECT NOW()), $3)",
                      [token, req.receiver, 6],
                      (error, resultAddNotifMatchSender) => {
                        if (error) {
                          reject(error);
                        }
                        if (!resultAddNotifMatchSender.rowCount) {
                          resolve({
                            msg: "Unable to update user notifications.",
                          });
                        } else {
                          pool.pool.query(
                            "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ($1, (SELECT id FROM users WHERE connected_token = $2), (SELECT NOW()), $3)",
                            [req.receiver, token, 6],
                            (error, resultAddNotifReceiver) => {
                              if (error) {
                                reject(error);
                              }
                              if (!resultAddNotifReceiver.rowCount) {
                                resolve({
                                  msg: "Unable to update user notifications.",
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                  pool.pool.query(
                    "UPDATE likes SET unliked = $1 WHERE sender = (SELECT id FROM users WHERE connected_token = $2) AND receiver = $3 AND unliked = $4",
                    [true, token, req.receiver, false],
                    (error, resultUpdate) => {
                      if (error) {
                        reject(error);
                      }
                      if (!resultUpdate.rowCount) {
                        resolve({ msg: "Error updating like state." });
                      } else {
                        pool.pool.query(
                          "UPDATE users SET popularity = (SELECT popularity FROM users WHERE id = $1) - $2 WHERE id = $3",
                          [req.receiver, 50, req.receiver],
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
                                [token, req.receiver, 2],
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
                                    resolve({ update: false });
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                })
                .catch((e) =>
                  resolve({
                    msg: e,
                  })
                );
            }
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to update your like.",
      });
    }
  });
};

const getLastLikes = (request, response) => {
  const { token } = request;
  return new Promise(function (resolve, reject) {
    if (token) {
      pool.pool.query(
        "SELECT u.username, l.sender, l.receiver, l.unliked, l.created_at FROM likes l INNER JOIN users u ON u.id = l.sender WHERE l.receiver = (SELECT id FROM users WHERE connected_token = $1) AND l.unliked = $2 AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = l.receiver AND bu.receiver = (SELECT id FROM users WHERE connected_token = $3)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = l.sender AND bu.sender = (SELECT id FROM users WHERE connected_token = $4)) ORDER BY l.created_at DESC;",
        [token, false, token, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ likeList: false });
          } else {
            resolve(results.rows);
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to get your user like history.",
      });
    }
  });
};

const checkIfUserLiked = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.sender && token) {
      pool.pool.query(
        "SELECT created_at FROM likes WHERE sender = $1 AND receiver = (SELECT id FROM users WHERE connected_token = $2) AND unliked = $3",
        [req.sender, token, false],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ checkVisited: false });
          } else {
            resolve({ checkVisited: results.rows });
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to get your liked status.",
      });
    }
  });
};

const checkIfLoggedLiked = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.receiver && token) {
      pool.pool.query(
        "SELECT created_at FROM likes WHERE sender = (SELECT id FROM users WHERE connected_token = $1) AND receiver = $2 AND unliked = $3",
        [token, req.receiver, false],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ checkLogged: false });
          } else {
            resolve({ checkLogged: true });
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to get your liked status.",
      });
    }
  });
};

const getLikeList = (request, response) => {
  const { token } = request;
  return new Promise(function (resolve, reject) {
    if (token) {
      pool.pool.query(
        "SELECT u.username, l.sender, l.receiver, l.created_at FROM likes l INNER JOIN users u ON u.id = l.receiver WHERE l.sender = (SELECT id FROM users WHERE connected_token = $1) AND l.unliked = $2 AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = l.sender AND bu.receiver = (SELECT id FROM users WHERE connected_token = $3)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = l.receiver AND bu.sender = (SELECT id FROM users WHERE connected_token = $4)) ORDER BY l.created_at DESC;",
        [token, false, token, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ likeList: false });
          } else {
            resolve(results.rows);
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to get your like list.",
      });
    }
  });
};

const getMatchList = (request, response) => {
  const { token } = request;
  return new Promise(function (resolve, reject) {
    if (token) {
      pool.pool.query(
        "SELECT u1.username as sender, u2.username as receiver, u2.firstname as receiver_f, u2.lastname as receiver_l, u2.photos as receiver_p, u2.last_connection as receiver_lc, u2.connected as receiver_c, b.receiver as receiverid, a.receiver as senderid, a.created_at, (SELECT MAX(created_at) FROM messages m INNER JOIN users u1 ON u1.id = m.sender INNER JOIN users u2 ON u2.id = m.receiver WHERE ((m.receiver = a.receiver AND m.sender = b.receiver AND m.r_bool = false) OR (m.receiver = b.receiver AND m.sender = a.receiver AND m.s_bool = false))) as lastupdate FROM likes a JOIN (SELECT sender, receiver, unliked, MAX(created_at) FROM likes WHERE sender = (SELECT id FROM users WHERE connected_token = $1) GROUP BY sender, receiver, unliked) b ON a.sender = b.receiver INNER JOIN users u1 ON u1.id = a.receiver INNER JOIN users u2 ON u2.id = b.receiver AND a.receiver = b.sender AND a.unliked = $2 AND b.unliked = $3 AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = u1.id AND bu.receiver = (SELECT id FROM users WHERE connected_token = $4)) AND NOT EXISTS  (SELECT 1 FROM blocked bu WHERE bu.receiver = u2.id AND bu.sender = (SELECT id FROM users WHERE connected_token = $5)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = u2.id AND bu.receiver = (SELECT id FROM users WHERE connected_token = $6)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = u1.id AND bu.sender = (SELECT id FROM users WHERE connected_token = $7)) ORDER BY lastupdate ASC;",
        [token, false, false, token, token, token, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ matchList: false });
          } else {
            let matchList = results.rows.sort((a, b) =>
              a.lastupdate > b.lastupdate
                ? -1
                : a.lastupdate < b.lastupdate
                ? 1
                : 0
            );
            resolve(matchList);
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to get your match list.",
      });
    }
  });
};

module.exports = {
  getMatchList,
  updateLikes,
  getLastLikes,
  checkIfUserLiked,
  checkIfLoggedLiked,
  getLikeList,
};
