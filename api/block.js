const pool = require("./../pool.js");

const blockUser = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (token && req.receiver) {
      pool.pool.query(
        "INSERT INTO blocked (sender, receiver) VALUES ((SELECT id FROM users WHERE connected_token = $1), $2)",
        [token, req.receiver],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({
              msg: "Unable to block this user.",
            });
          } else {
            resolve({ block: true });
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to block this user.",
      });
    }
  });
};

const getBlockedList = (request, response) => {
  const { token } = request;
  return new Promise(function (resolve, reject) {
    if (token) {
      pool.pool.query(
        "SELECT u.username, b.sender, b.receiver FROM blocked b INNER JOIN users u ON u.id = b.receiver WHERE b.sender = (SELECT id FROM users WHERE connected_token = $1) ORDER BY b.id DESC;",
        [token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ blockList: false });
          } else {
            resolve(results.rows);
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to get your block list.",
      });
    }
  });
};

const deleteBlockedUser = (request, response) => {
  const { req, token } = request;
  return new Promise(function (resolve, reject) {
    if (req.receiver && token) {
      pool.pool.query(
        "DELETE FROM blocked WHERE receiver = $1 AND sender = (SELECT id FROM users WHERE connected_token = $2);",
        [req.receiver, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ deleteBlock: false });
          } else {
            resolve({ deleteBlock: true });
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to unblock this user.",
      });
    }
  });
};

module.exports = { blockUser, getBlockedList, deleteBlockedUser };
