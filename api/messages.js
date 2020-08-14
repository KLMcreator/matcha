const pool = require("../pool.js");

const getMessages = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.receiver && token && req.limit) {
      pool.pool.query(
        "SELECT COUNT (*), a.created_at FROM likes a JOIN ( SELECT sender, receiver, unliked, MAX(created_at) FROM likes WHERE sender = (SELECT id FROM users WHERE connected_token = $1) GROUP BY sender, receiver, unliked) b ON a.sender = b.receiver INNER JOIN users u1 ON u1.id = a.receiver INNER JOIN users u2 ON u2.id = b.receiver AND a.receiver = b.sender AND a.sender = $2 and b.receiver = $3 AND a.unliked = $4 AND b.unliked = $5 GROUP BY a.created_at HAVING COUNT(*) > 0 ORDER BY created_at DESC;",
        [token, req.receiver, req.receiver, false, false],
        (error, checkMatchResult) => {
          if (error) {
            reject(error);
          }
          if (!checkMatchResult.rowCount) {
            resolve({ msgList: false });
          } else {
            if (parseInt(checkMatchResult.rows[0].count, 10) === 1) {
              pool.pool.query(
                "SELECT * FROM (SELECT m.id, u1.username AS sender_username, m.sender AS sender_id, u2.username AS receiver_username, m.receiver AS receiver_id, m.message, m.created_at  FROM messages m  INNER JOIN users u1 ON u1.id = m.sender INNER JOIN users u2 ON u2.id = m.receiver WHERE ((m.receiver = (SELECT id FROM users WHERE connected_token = $1) AND m.sender = $2 AND m.r_bool = $3) OR (m.receiver = $4 AND m.sender = (SELECT id FROM users WHERE connected_token = $5) AND m.s_bool = $6)) ORDER BY created_at DESC LIMIT $7) AS sortedquery ORDER BY sortedquery.created_at ASC;",
                [
                  token,
                  req.receiver,
                  false,
                  req.receiver,
                  token,
                  false,
                  req.limit,
                ],
                (error, checkMsgResult) => {
                  if (error) {
                    reject(error);
                  }
                  if (!checkMsgResult.rowCount) {
                    resolve({ msgList: false });
                  }
                  resolve(checkMsgResult.rows);
                }
              );
            } else {
              resolve({ msgList: false });
            }
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to get your messages.",
      });
    }
  });
};

const sendMessage = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.message && req.receiver && token) {
      req.message = req.message.trim();
      if (req.message && req.message.length < 300) {
        pool.pool.query(
          "SELECT COUNT (*), a.created_at FROM likes a JOIN ( SELECT sender, receiver, unliked, MAX(created_at) FROM likes WHERE sender = (SELECT id FROM users WHERE connected_token = $1) GROUP BY sender, receiver, unliked) b ON a.sender = b.receiver INNER JOIN users u1 ON u1.id = a.receiver INNER JOIN users u2 ON u2.id = b.receiver AND a.receiver = b.sender AND a.sender = $2 and b.receiver = $3 AND a.unliked = $4 AND b.unliked = $5 GROUP BY a.created_at HAVING COUNT(*) > 0 ORDER BY created_at DESC;",
          [token, req.receiver, req.receiver, false, false],
          (error, checkMatchResult) => {
            if (error) {
              reject(error);
            }
            if (!checkMatchResult.rowCount) {
              resolve({ message: false });
            } else {
              if (parseInt(checkMatchResult.rows[0].count, 10) === 1) {
                pool.pool.query(
                  "INSERT INTO messages (sender, receiver, created_at, message) VALUES ((SELECT id FROM users WHERE connected_token = $1), $2, (SELECT NOW()), $3);",
                  [token, req.receiver, req.message],
                  (error, checkMsgResult) => {
                    if (error) {
                      reject(error);
                    }
                    if (!checkMsgResult.rowCount) {
                      resolve({ message: false });
                    }
                    pool.pool.query(
                      "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ((SELECT id FROM users WHERE connected_token = $1), $2, (SELECT NOW()), $3)",
                      [token, req.receiver, 4],
                      (error, resultAddNotif) => {
                        if (error) {
                          reject(error);
                        }
                        if (!resultAddNotif.rowCount) {
                          resolve({
                            msg: "Unable to update user notifications.",
                          });
                        } else {
                          resolve({ message: true });
                        }
                      }
                    );
                  }
                );
              } else {
                resolve({ message: false });
              }
            }
          }
        );
      } else {
        if (req.message && req.message.length > 300) {
          resolve({ msg: "You dirty boy, it's 300 char max, I SAID." });
        } else {
          resolve({ msg: "Unable to send empty messages." });
        }
      }
    } else {
      resolve({ msg: "Unable to send your message." });
    }
  });
};

const deleteAllMessages = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.receiver && token) {
      pool.pool.query(
        "SELECT COUNT (*), a.created_at FROM likes a JOIN ( SELECT sender, receiver, unliked, MAX(created_at) FROM likes WHERE sender = (SELECT id FROM users WHERE connected_token = $1) GROUP BY sender, receiver, unliked) b ON a.sender = b.receiver INNER JOIN users u1 ON u1.id = a.receiver INNER JOIN users u2 ON u2.id = b.receiver AND a.receiver = b.sender AND a.sender = $2 and b.receiver = $3 AND a.unliked = $4 AND b.unliked = $5 GROUP BY a.created_at HAVING COUNT(*) > 0 ORDER BY created_at DESC;",
        [token, req.receiver, req.receiver, false, false],
        (error, checkMatchResult) => {
          if (error) {
            reject(error);
          }
          if (!checkMatchResult.rowCount) {
            resolve({ delete: false });
          } else {
            if (parseInt(checkMatchResult.rows[0].count, 10) === 1) {
              pool.pool.query(
                "UPDATE messages SET s_bool = $1 FROM (SELECT * FROM messages WHERE sender = (SELECT id FROM users WHERE connected_token = $2) AND receiver = $3) AS sender_bool WHERE messages.sender=sender_bool.sender AND messages.sender = (SELECT id FROM users WHERE connected_token = $4) AND messages.receiver = $5;",
                [true, token, req.receiver, token, req.receiver],
                (error, checkDelSender) => {
                  if (error) {
                    reject(error);
                  }
                  pool.pool.query(
                    "UPDATE messages SET r_bool = $1 FROM (SELECT * FROM messages WHERE sender = $2 AND receiver = (SELECT id FROM users WHERE connected_token = $3)) AS sender_bool WHERE messages.sender=sender_bool.sender AND messages.sender = $4 AND messages.receiver = (SELECT id FROM users WHERE connected_token = $5);",
                    [true, req.receiver, token, req.receiver, token],
                    (error, checkDelReceiver) => {
                      if (error) {
                        reject(error);
                      }
                      pool.pool.query(
                        "DELETE FROM messages WHERE ((receiver = (SELECT id FROM users WHERE connected_token = $1) AND sender = $2) OR (sender = (SELECT id FROM users WHERE connected_token = $3) AND receiver = $4)) AND s_bool = $5 AND r_bool = $6;",
                        [token, req.receiver, token, req.receiver, true, true],
                        (error, checkDelReceiver) => {
                          if (error) {
                            reject(error);
                          }
                          resolve({ delete: true });
                        }
                      );
                    }
                  );
                }
              );
            } else {
              resolve({ delete: false });
            }
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to execute this request.",
      });
    }
  });
};

const deleteMessage = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.receiver && token && req.id) {
      pool.pool.query(
        "SELECT COUNT (*), a.created_at FROM likes a JOIN ( SELECT sender, receiver, unliked, MAX(created_at) FROM likes WHERE sender = (SELECT id FROM users WHERE connected_token = $1) GROUP BY sender, receiver, unliked) b ON a.sender = b.receiver INNER JOIN users u1 ON u1.id = a.receiver INNER JOIN users u2 ON u2.id = b.receiver AND a.receiver = b.sender AND a.sender = $2 and b.receiver = $3 AND a.unliked = $4 AND b.unliked = $5 GROUP BY a.created_at HAVING COUNT(*) > 0 ORDER BY created_at DESC;",
        [token, req.receiver, req.receiver, false, false],
        (error, checkMatchResult) => {
          if (error) {
            reject(error);
          }
          if (!checkMatchResult.rowCount) {
            resolve({ delete: false });
          } else {
            if (parseInt(checkMatchResult.rows[0].count, 10) === 1) {
              pool.pool.query(
                "UPDATE messages SET s_bool = $1 FROM (SELECT * FROM messages WHERE sender = (SELECT id FROM users WHERE connected_token = $2) AND receiver = $3) AS sender_bool WHERE messages.sender=sender_bool.sender AND messages.sender = (SELECT id FROM users WHERE connected_token = $4) AND messages.receiver = $5 AND messages.id = $6;",
                [true, token, req.receiver, token, req.receiver, req.id],
                (error, checkDelSender) => {
                  if (error) {
                    reject(error);
                  }
                  pool.pool.query(
                    "UPDATE messages SET r_bool = $1 FROM (SELECT * FROM messages WHERE sender = $2 AND receiver = (SELECT id FROM users WHERE connected_token = $3)) AS sender_bool WHERE messages.sender=sender_bool.sender AND messages.sender = $4 AND messages.receiver = (SELECT id FROM users WHERE connected_token = $5 AND messages.id = $6);",
                    [true, req.receiver, token, req.receiver, token, req.id],
                    (error, checkDelReceiver) => {
                      if (error) {
                        reject(error);
                      }
                      pool.pool.query(
                        "DELETE FROM messages WHERE ((receiver = (SELECT id FROM users WHERE connected_token = $1) AND sender = $2) OR (sender = (SELECT id FROM users WHERE connected_token = $3) AND receiver = $4)) AND s_bool = $5 AND r_bool = $6;",
                        [token, req.receiver, token, req.receiver, true, true],
                        (error, checkDelReceiver) => {
                          if (error) {
                            reject(error);
                          }
                          resolve({ delete: true });
                        }
                      );
                    }
                  );
                }
              );
            } else {
              resolve({ delete: false });
            }
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to execute this request.",
      });
    }
  });
};

module.exports = {
  getMessages,
  sendMessage,
  deleteAllMessages,
  deleteMessage,
};
