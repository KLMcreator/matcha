const pool = require("./../pool.js");

const markAsRead = (request, response) => {
  const { token } = request;
  return new Promise(function (resolve, reject) {
    if (token) {
      pool.pool.query(
        "UPDATE notifications SET seen = $1 WHERE receiver = (SELECT id FROM users WHERE connected_token = $2)",
        [true, token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ msg: "Unable to mark your notifications as readed." });
          } else {
            resolve({ read: true });
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to set your notifications as readed.",
      });
    }
  });
};

const clearNotifs = (request, response) => {
  const { token } = request;
  return new Promise(function (resolve, reject) {
    if (token) {
      pool.pool.query(
        "DELETE FROM notifications where receiver = (SELECT id FROM users WHERE connected_token = $1)",
        [token],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ msg: "Unable to clear your notifications." });
          } else {
            resolve({ clear: true });
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to clear your notifications.",
      });
    }
  });
};

//types: like: 1, unlike: 2, visits: 3, messages: 4, match: 5, unmatch: 6
const getNotifs = (request, response) => {
  const { token, req } = request;
  return new Promise(function (resolve, reject) {
    if (token && req.limit) {
      pool.pool.query(
        "SELECT u.username, u.photos, u.firstname, u.lastname, n.sender, n.receiver, n.created_at, n.type, n.seen FROM notifications n INNER JOIN users u ON u.id = n.sender WHERE n.receiver = (SELECT id FROM users WHERE connected_token = $1) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = n.sender AND bu.receiver = (SELECT id FROM users WHERE connected_token = $2)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = n.receiver AND bu.sender = (SELECT id FROM users WHERE connected_token = $3)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.sender = n.receiver AND bu.receiver = (SELECT id FROM users WHERE connected_token = $4)) AND NOT EXISTS (SELECT 1 FROM blocked bu WHERE bu.receiver = n.sender AND bu.sender = (SELECT id FROM users WHERE connected_token = $5)) ORDER BY n.created_at DESC LIMIT $6;",
        [token, token, token, token, token, req.limit],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (!results.rowCount) {
            resolve({ notifList: false });
          } else {
            resolve(results.rows);
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to get your notifications.",
      });
    }
  });
};

module.exports = {
  getNotifs,
  markAsRead,
  clearNotifs,
};
