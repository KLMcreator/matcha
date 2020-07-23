const Pool = require("pg").Pool;
const faker = require("faker");
const bcrypt = require("bcrypt");
const moment = require("moment");
const fs = require("fs");

let geo = JSON.parse(fs.readFileSync("./client/src/geo.json"));
let totalMessages = 0;
let totalUser = 0;
let totalLikes = 0;
let totalVisits = 0;

const rootPool = new Pool({
  user: "klm",
  host: "localhost",
  database: "postgres",
  password: "root",
  port: 5432,
});

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "matcha",
  password: "root",
  port: 5432,
});

const genderList = [
  { value: 0, label: "Male" },
  { value: 1, label: "Female" },
];

const sexualList = [
  { value: 0, label: "Asexual Heterosexual" },
  { value: 1, label: "Asexual Homosexual" },
  { value: 2, label: "Aromantic Heterosexual" },
  { value: 3, label: "Aromantic Homosexual" },
  { value: 4, label: "Bisexual" },
  { value: 5, label: "Heterosexual" },
  { value: 6, label: "Homosexual" },
  { value: 7, label: "Lesbian" },
];

const tagList = [
  { value: 0, label: "Advertising" },
  { value: 1, label: "Agriculture" },
  { value: 2, label: "Architecture" },
  { value: 3, label: "Aviation" },
  { value: 4, label: "Investment banking" },
  { value: 5, label: "Online banking" },
  { value: 6, label: "Retail banking" },
  { value: 7, label: "Business" },
  { value: 8, label: "Construction" },
  { value: 9, label: "Fashion design" },
  { value: 10, label: "Graphic design" },
  { value: 11, label: "Interior design" },
  { value: 12, label: "Economics" },
  { value: 13, label: "Engineering" },
  { value: 14, label: "Entrepreneurship" },
  { value: 15, label: "Health care" },
  { value: 16, label: "Higher education" },
  { value: 17, label: "Management" },
  { value: 18, label: "Marketing" },
  { value: 19, label: "Insurance" },
  { value: 20, label: "Investment" },
  { value: 21, label: "Mortgage loans" },
  { value: 22, label: "Real estate" },
  { value: 23, label: "Retail" },
  { value: 24, label: "Sales" },
  { value: 25, label: "Science" },
  { value: 26, label: "Entertainment" },
  { value: 27, label: "Video games" },
  { value: 28, label: "Gambling" },
  { value: 29, label: "Ballet" },
  { value: 30, label: "Bars" },
  { value: 31, label: "Concerts" },
  { value: 32, label: "Dancehalls" },
  { value: 33, label: "Music festivals" },
  { value: 34, label: "Nightclubs" },
  { value: 35, label: "Parties" },
  { value: 36, label: "Plays" },
  { value: 37, label: "Theatre" },
  { value: 38, label: "Movies" },
  { value: 39, label: "Music" },
  { value: 40, label: "Reading" },
  { value: 41, label: "Comics" },
  { value: 42, label: "Literature" },
  { value: 43, label: "Manga" },
  { value: 44, label: "TV" },
  { value: 45, label: "Family and relationships" },
  { value: 46, label: "Fitness and wellness" },
  { value: 47, label: "Food and drink" },
  { value: 48, label: "Cooking" },
  { value: 49, label: "Baking" },
  { value: 50, label: "Recipes" },
  { value: 51, label: "Cuisine" },
  { value: 52, label: "Food" },
  { value: 53, label: "Veganism" },
  { value: 54, label: "Vegetarianism" },
  { value: 55, label: "Restaurants" },
  { value: 56, label: "Arts and music" },
  { value: 57, label: "Acting" },
  { value: 58, label: "Crafts" },
  { value: 59, label: "Dance" },
  { value: 60, label: "Drawing" },
  { value: 61, label: "Drums" },
  { value: 62, label: "Fine art" },
  { value: 63, label: "Guitar" },
  { value: 64, label: "Painting" },
  { value: 65, label: "Performing arts" },
  { value: 66, label: "Photography" },
  { value: 67, label: "Sculpture" },
  { value: 68, label: "Singing" },
  { value: 69, label: "Writing" },
  { value: 70, label: "Current events" },
  { value: 71, label: "Home and garden" },
  { value: 72, label: "Do it yourself (DIY)" },
  { value: 73, label: "Pets" },
  { value: 74, label: "Politics and social issues" },
  { value: 75, label: "Charity and causes" },
  { value: 76, label: "Community issues" },
  { value: 77, label: "Environmentalism" },
  { value: 78, label: "Law" },
  { value: 79, label: "Military" },
  { value: 80, label: "Politics" },
  { value: 81, label: "Religion" },
  { value: 82, label: "Veterans" },
  { value: 83, label: "Volunteering" },
  { value: 84, label: "Travel" },
  { value: 85, label: "Beaches" },
  { value: 86, label: "Cruises" },
  { value: 87, label: "Ecotourism" },
  { value: 88, label: "Nature" },
  { value: 89, label: "Theme parks" },
  { value: 90, label: "Tourism" },
  { value: 91, label: "Vacations" },
  { value: 92, label: "Vehicles" },
  { value: 93, label: "Shopping and fashion" },
  { value: 94, label: "Beauty" },
  { value: 95, label: "Cosmetics" },
  { value: 96, label: "Tattoos" },
  { value: 97, label: "Clothing" },
  { value: 98, label: "Shoes" },
  { value: 99, label: "Jewelry" },
  { value: 100, label: "Shopping" },
  { value: 101, label: "Sports and outdoors" },
  { value: 102, label: "Outdoor recreation" },
  { value: 103, label: "Boating" },
  { value: 104, label: "Camping" },
  { value: 105, label: "Fishing" },
  { value: 106, label: "Hunting" },
  { value: 107, label: "Thriathlons" },
  { value: 108, label: "Technology" },
  { value: 109, label: "Computers" },
  { value: 110, label: "Free software" },
  { value: 111, label: "Hard drives" },
  { value: 112, label: "Network storage" },
  { value: 113, label: "Software" },
  { value: 114, label: "Tablet computers" },
  { value: 115, label: "Consumer electronics" },
  { value: 116, label: "Audio equipment" },
  { value: 117, label: "Camcorders" },
  { value: 118, label: "Cameras" },
  { value: 119, label: "E-book readers" },
  { value: 120, label: "GPS devices" },
  { value: 121, label: "Game consoles" },
  { value: 122, label: "Mobile phones" },
  { value: 123, label: "Smartphones" },
  { value: 124, label: "Televisions" },
];

const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const setupSettingsList = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE IF NOT EXISTS settingsList (id SERIAL, genderList VARCHAR NULL DEFAULT NULL, sexualList VARCHAR NULL DEFAULT NULL, tagList VARCHAR NULL DEFAULT NULL, PRIMARY KEY (id));",
      (error, res) => {
        if (error) {
          resolve(error);
        } else {
          console.log("TABLE settingsList HAS BEEN CREATED.");
          pool.query(
            "INSERT INTO settingsList (genderList, sexualList, tagList) VALUES ($1, $2, $3);",
            [
              JSON.stringify(genderList),
              JSON.stringify(sexualList),
              JSON.stringify(tagList),
            ],
            (error, res) => {
              if (error) {
                resolve(error);
              } else {
                console.log(
                  "TABLE settingsList HAS BEEN POPULATED WITH THE DEFAULT VALUES."
                );
                resolve(true);
              }
            }
          );
        }
      }
    );
  });
};

const setupNotifications = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE IF NOT EXISTS notifications (id SERIAL,sender INTEGER NULL DEFAULT NULL,receiver INTEGER NULL DEFAULT NULL,created_at TIMESTAMP DEFAULT NULL,seen BOOLEAN default false, type INTEGER NOT NULL, PRIMARY KEY (id));",
      (error, res) => {
        if (error) {
          resolve(error);
        } else {
          console.log("TABLE notifications HAS BEEN CREATED.");
          resolve(true);
        }
      }
    );
  });
};

const setupBlocked = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE IF NOT EXISTS blocked (id SERIAL,sender INTEGER NULL DEFAULT NULL,receiver INTEGER NULL DEFAULT NULL,PRIMARY KEY (id));",
      (error, res) => {
        if (error) {
          resolve(error);
        } else {
          console.log("TABLE blocked HAS BEEN CREATED.");
          resolve(true);
        }
      }
    );
  });
};

const setupLikes = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE IF NOT EXISTS likes (id SERIAL,sender INTEGER NULL DEFAULT NULL,receiver INTEGER NULL DEFAULT NULL,unliked BOOLEAN DEFAULT FALSE,created_at TIMESTAMP DEFAULT NULL,PRIMARY KEY (id));",
      (error, res) => {
        if (error) {
          resolve(error);
        } else {
          console.log("TABLE likes HAS BEEN CREATED.");
          resolve(true);
        }
      }
    );
  });
};

const setupVisits = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE IF NOT EXISTS visits (id SERIAL,sender INTEGER NULL DEFAULT NULL,receiver INTEGER NULL DEFAULT NULL,created_at TIMESTAMP DEFAULT NULL,PRIMARY KEY (id));",
      (error, res) => {
        if (error) {
          resolve(error);
        } else {
          console.log("TABLE visits HAS BEEN CREATED.");
          resolve(true);
        }
      }
    );
  });
};

const setupMessages = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE IF NOT EXISTS messages (id SERIAL,sender INTEGER NULL DEFAULT NULL,receiver INTEGER NULL DEFAULT NULL,created_at TIMESTAMP DEFAULT NULL,message VARCHAR(300) DEFAULT NULL, s_bool BOOLEAN DEFAULT FALSE, r_bool BOOLEAN DEFAULT FALSE, PRIMARY KEY (id));",
      (error, res) => {
        if (error) {
          resolve(error);
        } else {
          console.log("TABLE messages HAS BEEN CREATED.");
          resolve(true);
        }
      }
    );
  });
};

const setupUser = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE IF NOT EXISTS users (id SERIAL, username VARCHAR(64) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, birthdate VARCHAR DEFAULT NULL, gender VARCHAR(255) DEFAULT NULL, sexual_orientation VARCHAR(255) DEFAULT 'Bisexual', tags VARCHAR NULL DEFAULT NULL, bio VARCHAR(280) NULL DEFAULT NULL, photos varchar(1000) NOT NULL DEFAULT '[null,null,null,null,null]', popularity INTEGER DEFAULT 0, connected BOOLEAN DEFAULT FALSE, connected_token VARCHAR(255) NULL DEFAULT NULL,last_connection VARCHAR NULL DEFAULT NULL, longitude VARCHAR(255) NULL DEFAULT NULL, latitude VARCHAR(255) NULL DEFAULT NULL, country VARCHAR(255) NULL DEFAULT NULL,city VARCHAR(255) NULL DEFAULT NULL, reported_count VARCHAR NULL DEFAULT NULL, reported BOOLEAN DEFAULT FALSE, verified BOOLEAN DEFAULT FALSE, verified_value VARCHAR(255) NULL DEFAULT NULL, completed BOOLEAN DEFAULT FALSE, PRIMARY KEY (id));",
      (error, res) => {
        if (error) {
          resolve(error);
        } else {
          console.log("TABLE users HAS BEEN CREATED.");
          resolve(true);
        }
      }
    );
  });
};

const insertIntoLikes = (likeS, likeR) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO likes (sender, receiver, created_at) VALUES ($1, $2, (SELECT NOW()))",
      [likeS, likeR],
      (error, resultInsert) => {
        if (error) {
          resolve(error);
        } else {
          pool.query(
            "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ($1, $2, (SELECT NOW()), $3)",
            [likeS, likeR, 1],
            (error, resultAddNotif) => {
              if (error) {
                resolve(error);
              } else {
                totalLikes++;
                resolve(true);
              }
            }
          );
        }
      }
    );
  });
};

const insertIntoVisits = (visitS, visitR) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO visits (sender, receiver, created_at) VALUES ($1, $2, (SELECT NOW()))",
      [visitS, visitR],
      (error, resultInsert) => {
        if (error) {
          resolve(error);
        } else {
          pool.query(
            "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ($1, $2, (SELECT NOW()), $3)",
            [visitS, visitR, 3],
            (error, resultAddNotif) => {
              if (error) {
                resolve(error);
              } else {
                totalVisits++;
                resolve(true);
              }
            }
          );
        }
      }
    );
  });
};

const insertIntoUsers = (user) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users (username, password, firstname, lastname, email, birthdate, gender, sexual_orientation, tags, bio, photos, popularity, last_connection, latitude, longitude, reported_count, reported, verified, verified_value, completed, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)",
      [
        user.username,
        user.password,
        user.firstname,
        user.lastname,
        user.email,
        user.birthdate,
        user.gender,
        user.sexual_orientation,
        user.tags,
        user.bio,
        user.photos,
        user.popularity,
        user.last_connection,
        user.latitude,
        user.longitude,
        user.reported_count,
        user.reported,
        user.verified,
        user.verified_value,
        user.completed,
        user.country,
        user.city,
      ],
      (error, results) => {
        if (error) {
          resolve(error);
        } else {
          Promise.all(user.randomLikes.map((e) => insertIntoLikes(e.s, e.r)))
            .then((res) => {
              Promise.all(
                user.randomVisits.map((e) => insertIntoVisits(e.s, e.r))
              )
                .then((res) => {
                  resolve(0);
                })
                .catch((e) => {
                  console.log(e);
                });
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    );
  });
};

const insertIntoMessages = (messageS, messageR) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO messages (sender, receiver, created_at, message) VALUES ($1, $2, (SELECT NOW()), $3)",
      [messageS, messageR, faker.lorem.sentences()],
      (error, resultInsert) => {
        if (error) {
          resolve(error);
        } else {
          pool.query(
            "INSERT INTO notifications (sender, receiver, created_at, type) VALUES ($1, $2, (SELECT NOW()), $3)",
            [messageS, messageR, 4],
            (error, resultAddNotif) => {
              if (error) {
                resolve(error);
              } else {
                totalMessages++;
                resolve(true);
              }
            }
          );
        }
      }
    );
  });
};

const hydrateSeed = async (totalUser) => {
  let hash = await bcrypt.hash("Matcha42", 10);
  let i = 0;
  let users = [];
  const totalTags = tagList.length;
  const totalSexOr = sexualList.length;
  const totalGender = genderList.length;
  const totalCountry = Object.entries(geo).length;
  while (i < totalUser) {
    let username = faker.internet.userName();
    let email = faker.internet.email();
    if (
      users.map((e) => e.username).indexOf(username) === -1 &&
      users.map((e) => e.email).indexOf(email) === -1
    ) {
      let j = 0;
      let randomTag = [];
      let randomLikes = [];
      let reportedList = [];
      let randomVisits = [];
      let gender = genderList[Math.floor(Math.random() * totalGender)].label;
      let sexOr = sexualList[Math.floor(Math.random() * totalSexOr)].label;
      if (gender === "Male") {
        while (sexOr === "Lesbian") {
          sexOr = sexualList[Math.floor(Math.random() * totalSexOr)].label;
        }
      }
      let photos = [null, null, null, null, null];
      let rndPhoto = Math.floor(Math.random() * 3) + 1;
      let totalReported = Math.floor(Math.random() * 10) + 1;
      let rndCountry =
        i < totalUser / 2
          ? 49
          : Math.floor(Math.random() * Math.floor(totalCountry));
      let totalCity = Object.entries(geo)[rndCountry][1].length;
      let rndCity =
        i < totalUser / 3
          ? 8719
          : Math.floor(Math.random() * Math.floor(totalCity));
      let country = Object.entries(geo)[rndCountry];
      let city = Object.entries(geo)[rndCountry][1][rndCity];
      const coordParis = {
        latMin: Math.min(48.858291, 48.901531, 48.818209, 48.862944, 48.858053),
        latMax: Math.max(48.858291, 48.901531, 48.818209, 48.862944, 48.858053),
        lonMin: Math.min(2.352129, 2.352129, 2.352129, 2.268752, 2.268752),
        lonMax: Math.max(2.352129, 2.352129, 2.352129, 2.268752, 2.268752),
      };
      const coordFrance = {
        latMin: Math.min(47.081686, 50.793318, 42.902853, 47.528668, 48.803576),
        latMax: Math.max(47.081686, 50.793318, 42.902853, 47.528668, 48.803576),
        lonMin: Math.min(2.462916, 2.172157, 2.749746, -0.951085, 7.699275),
        lonMax: Math.max(2.462916, 2.172157, 2.749746, -0.951085, 7.699275),
      };
      while (j < 30) {
        if (j < 10) {
          const rand = Math.floor(Math.random() * totalTags);
          if (!randomTag.some((el) => el.label === tagList[rand].label)) {
            randomTag.push({ value: j, label: tagList[rand].label });
            if (j < totalReported) {
              let rndReport = Math.floor(Math.random() * totalUser);
              while (rndReport === i + 1) {
                rndReport = Math.floor(Math.random() * totalUser);
              }
              reportedList.push({
                id: rndReport,
              });
              if (j < rndPhoto) {
                photos[j] = faker.internet.avatar();
              }
            }
          }
        }
        let like = Math.floor(Math.random() * totalUser);
        let visit = Math.floor(Math.random() * totalUser);
        let likeSender = Math.floor(Math.random() * totalUser);
        let visitSender = Math.floor(Math.random() * totalUser);
        if (
          randomLikes.map((e) => e).indexOf(like) === -1 &&
          like !== likeSender
        ) {
          randomLikes.push({ r: like, s: likeSender });
        }
        if (
          randomVisits.map((e) => e).indexOf(visit) === -1 &&
          visit !== visitSender
        ) {
          randomVisits.push({ r: visit, s: visitSender });
        }
        j++;
      }
      users.push({
        randomLikes: randomLikes,
        randomVisits: randomVisits,
        username: username,
        password: hash,
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName().toUpperCase(),
        email: email,
        birthdate: moment(
          randomDate(new Date(1925, 0, 1), new Date(2001, 11, 31))
        ).format("DD/MM/YYYY"),
        country: country[0],
        city: city,
        gender: gender,
        sexual_orientation: sexOr,
        tags: JSON.stringify(randomTag),
        bio: faker.lorem.sentence(),
        photos: JSON.stringify(photos),
        popularity: Math.floor(Math.random() * 1420),
        last_connection: moment(
          randomDate(new Date(2018, 0, 1), new Date())
        ).format("DD/MM/YYYY hh:mm:ss"),
        latitude:
          i < totalUser / 3
            ? Math.random() * (+coordParis.latMax - +coordParis.latMin) +
              +coordParis.latMin
            : i < totalUser / 2
            ? Math.random() * (+coordFrance.latMax - +coordFrance.latMin) +
              +coordFrance.latMin
            : faker.address.latitude(),
        longitude:
          i < totalUser / 3
            ? Math.random() * (+coordParis.lonMax - +coordParis.lonMin) +
              +coordParis.lonMin
            : i < totalUser / 2
            ? Math.random() * (+coordFrance.lonMax - +coordFrance.lonMin) +
              +coordFrance.lonMin
            : faker.address.longitude(),
        reported_count: JSON.stringify(reportedList),
        reported: totalReported === 10 ? 1 : 0,
        verified: 1,
        verified_value: 1,
        completed: true,
      });
      i++;
    }
  }
  return users;
};

const populateMessages = () => {
  return new Promise(async (resolve, reject) => {
    pool.query(
      "SELECT a.sender as sender, b.sender as receiver FROM likes a INNER JOIN likes b ON a.sender = b.receiver AND a.receiver = b.sender ORDER BY a.sender;",
      (error, resultGetMatch) => {
        if (error) {
          resolve(error);
        } else {
          if (resultGetMatch.rows && resultGetMatch.rows.length) {
            console.log(resultGetMatch.rows.length + " MATCHES FOUND.");
            Promise.all(
              resultGetMatch.rows.map((e) =>
                insertIntoMessages(e.sender, e.receiver)
              )
            )
              .then((res) => {
                resolve(0);
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            resolve(0);
          }
        }
      }
    );
  });
};

const populateUsers = () => {
  return new Promise(async (resolve, reject) => {
    totalUser = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
    console.log(totalUser + " USERS WILL BE ADDED TO THE TABLE users.");
    console.log("Adding fake likes, visits and messages might take some time.");
    const users = await hydrateSeed(totalUser);
    Promise.all(users.map((e) => insertIntoUsers(e)))
      .then((res) => {
        console.log(
          totalUser +
            " UNIQUE USERS HAVE BEEN ADDED TO TABLE users, their password is Matcha42."
        );
        resolve(0);
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

const setupDatabase = () => {
  return new Promise(function (resolve, reject) {
    rootPool.query(
      "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'me') THEN CREATE ROLE me WITH LOGIN PASSWORD 'root'; END IF; END $$ LANGUAGE plpgsql;",
      (error, resrole) => {
        if (error) {
          reject(error);
        } else {
          console.log("ROLE me CREATED WITH PASSWORD 'root'.");
          rootPool.query("ALTER ROLE me WITH LOGIN;", (error, reslogin) => {
            if (error) {
              reject(error);
            } else {
              console.log("ROLE me CAN NOW LOGIN.");
              rootPool.query("ALTER ROLE me CREATEDB;", (error, rescreate) => {
                if (error) {
                  reject(error);
                } else {
                  console.log("ROLE me CAN NOW CREATE DATABASES.");
                  rootPool.query(
                    "CREATE DATABASE matcha;",
                    (error, resdatname) => {
                      if (!error || error.code === "42P04") {
                        console.log("DATABASE matcha HAS BEEN CREATED.");
                        Promise.all([
                          setupVisits(),
                          setupLikes(),
                          setupNotifications(),
                          setupSettingsList(),
                          setupBlocked(),
                          setupMessages(),
                          setupUser(),
                        ])
                          .then((res) => {
                            if (
                              res[0] &&
                              res[1] &&
                              res[2] &&
                              res[3] &&
                              res[4] &&
                              res[5] &&
                              res[6]
                            ) {
                              populateUsers()
                                .then((res) => {
                                  console.log(
                                    "NOW POPULATING MESSAGES FOR " +
                                      totalUser +
                                      " USERS IF THEY HAVE MATCHES."
                                  );
                                  populateMessages()
                                    .then((res) => {
                                      console.log(
                                        totalMessages +
                                          " MESSAGES HAVE BEEN ADDED."
                                      );
                                      console.log(
                                        "SEED HAS BEEN HYDRATED WITH " +
                                          totalUser +
                                          " USERS, THEIR PASSWORD IS Matcha42, " +
                                          totalMessages +
                                          " TOTAL MESSAGES, " +
                                          totalLikes +
                                          " TOTAL LIKES, " +
                                          totalVisits +
                                          " TOTAL VISITS. HAVE FUN."
                                      );
                                      resolve(res);
                                    })
                                    .catch((err) => reject(err));
                                })
                                .catch((err) => reject(err));
                            } else {
                              resolve(1);
                            }
                          })
                          .catch((err) => {
                            reject(err);
                          });
                      } else {
                        reject(error);
                      }
                    }
                  );
                }
              });
            }
          });
        }
      }
    );
  });
};

setupDatabase()
  .then((res) => process.exit(res))
  .catch((err) => console.log(err));
