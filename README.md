# Matcha

A tinder-like website where you can search for love anywhere in the world, stalk them and talk to them.

# Developed with

- [React](https://reactjs.org/)
- [Node](https://nodejs.org/)
- [Express](http://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- And more... (check [package.json](https://raw.githubusercontent.com/KLMcreator/matcha/master/package.json))

# Informations

Keep in mind this project was made in a "rush" so the code might not be as clean as possible, comments were also removed to avoid "cheating / stealing"

# Constraint imposed by 42

- No ORM or ODM
- No data validator tools
- No user account management tools
- No database management tools
- Crypted passwords, no XSS or major security issues
- Works on Firefox >= 41 and Chrome >= 46
- No warnings or console logs except HTTPS related

# Dependencies

You need to have [PostgreSQL](https://wiki.postgresql.org/wiki/Homebrew) and [NodeJS](https://nodejs.org/en/) installed, everything else is included in the modules.

# Installation

For now, just head to the root folder (matcha) and client folder (client) and install modules in both of them.

```bash
./matcha: npm install
./matcha/client: npm install
```

The database is hydrated with fake people, fake likes, fake matches and fake messages for demonstration purpose. You can populate it by doing

```bash
./matcha: node setup.js
```

# Usage

Start both servers (Node.js and React) and you are good to go. (In case you didn't know, you will need two shell windows to do so)

```bash
./matcha: npm start
./matcha/client: npm start
```

# Features

- Between 500 and 1000 fake users with real data<br />
- Big center of interests list<br />
- You can upload up to 5 profile pictures<br />
- Real time notification system for likes, messages, visits, unlikes<br />
- Block and report system available (10 reports = disabled account)<br />
- Real time live chat<br />
- Fully responsive<br />
- Popularity system based on activity<br />
- Suggestions based on multiple criteria like age, proximity, common interests, gender, sexual orientation, popularity...<br />
- Geolocalisation via IP address to refine the matching system<br />
- More than just "generic" sexual orientations
- Poor front because we were in a rush<br />

# Contributing

This project won't be updated but if you want to pull something, feel free to do so.

# Authors

- [shortcuts](https://github.com/shortcuts)<br />
- [Eozimek](https://github.com/Eozimek)
