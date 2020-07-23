const pool = require("./../pool.js");

const reportUser = (request, response) => {
  const { req, token } = request;
  return new Promise(function(resolve, reject) {
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
              "SELECT reported_count FROM users WHERE id = $1",
              [req.receiver],
              (error, resultReceiverReports) => {
                if (error) {
                  reject(error);
                }
                if (!resultReceiverReports.rowCount) {
                  resolve({ msg: "Can't get reported history" });
                } else {
                  let reportHistory = resultReceiverReports.rows[0]
                    .reported_count
                    ? JSON.parse(resultReceiverReports.rows[0].reported_count)
                    : [];
                  if (
                    !reportHistory ||
                    reportHistory.length === 0 ||
                    reportHistory
                      .map(function(e) {
                        return e.id;
                      })
                      .indexOf(sender) === -1
                  ) {
                    reportHistory.push({ id: sender });
                    let isReported = false;
                    if (Object.keys(reportHistory).length >= 10) {
                      isReported = true;
                    }
                    pool.pool.query(
                      "UPDATE users SET reported_count = $1, reported = $2 WHERE id = $3",
                      [JSON.stringify(reportHistory), isReported, req.receiver],
                      (error, results) => {
                        if (error) {
                          reject(error);
                        }
                        if (!results.rowCount) {
                          resolve({
                            msg: "Unable to set this user as reported."
                          });
                        } else {
                          if (isReported) {
                            pool.pool.query(
                              "DELETE FROM blocked WHERE sender = $1 OR receiver = $2",
                              [req.receiver, req.receiver],
                              (error, resultsBlocked) => {
                                if (error) {
                                  reject(error);
                                }
                                pool.pool.query(
                                  "DELETE FROM likes WHERE sender = $1 OR receiver = $2",
                                  [req.receiver, req.receiver],
                                  (error, resultsLikes) => {
                                    if (error) {
                                      reject(error);
                                    }
                                    pool.pool.query(
                                      "DELETE FROM notifications WHERE sender = $1 OR receiver = $2",
                                      [req.receiver, req.receiver],
                                      (error, resultsNotifications) => {
                                        if (error) {
                                          reject(error);
                                        }
                                        pool.pool.query(
                                          "DELETE FROM messages WHERE sender = $1 OR receiver = $2",
                                          [req.receiver, req.receiver],
                                          (error, resultsMessages) => {
                                            if (error) {
                                              reject(error);
                                            }
                                            pool.pool.query(
                                              "DELETE FROM visits WHERE sender = $1 OR receiver = $2",
                                              [req.receiver, req.receiver],
                                              (error, resultsVisits) => {
                                                if (error) {
                                                  reject(error);
                                                }
                                                pool.pool.query(
                                                  "SELECT photos FROM users WHERE id = $1;",
                                                  [req.receiver],
                                                  (error, resultsPhotos) => {
                                                    if (error) {
                                                      reject(error);
                                                    }
                                                    if (resultsPhotos.rows[0]) {
                                                      let photos = JSON.parse(
                                                        resultsPhotos.rows[0]
                                                          .photos
                                                      );
                                                      let i = 0;
                                                      while (
                                                        i < 5 &&
                                                        !photos[i].startsWith(
                                                          "https://"
                                                        )
                                                      ) {
                                                        if (photos[i] === null)
                                                          break;
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
                                                    resolve({
                                                      report: true,
                                                      reported_count: JSON.stringify(
                                                        reportHistory
                                                      )
                                                    });
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
                              report: true,
                              reported_count: JSON.stringify(reportHistory)
                            });
                          }
                        }
                      }
                    );
                  } else {
                    resolve({ msg: "You have already reported this user" });
                  }
                }
              }
            );
          }
        }
      );
    } else {
      resolve({
        msg: "Unable to report this user."
      });
    }
  });
};

module.exports = { reportUser };
