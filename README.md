# Matcha
A tinder-like website where you can search for love anywhere in the world, stalk them and talk to them.
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
* More than 500 fake users with real data<br />
* Big center of interests list<br />
* You can upload up to 5 pictures<br />
* Real time notification system for likes, messages, visists, unlikes<br />
* Block and report system available<br />
* Real time live chat<br />
* Fully responsive<br />
* Popularity system<br />
* Suggestions based on multiple criteria like age, proximity, common interests, gender, sexual orientation, popularity...<br />
* Geolocalisation via IP address to refine the matching system<br />
* Poor front because we were in a rush<br />
# Contributing
This project won't be updated but if you want to pull something, feel free to do so.
# Authors
* Clement [KLMcreator](https://github.com/KLMcreator) VANNICATTE<br />
* Elise [Eozimek](https://github.com/Eozimek) OZIMEK
