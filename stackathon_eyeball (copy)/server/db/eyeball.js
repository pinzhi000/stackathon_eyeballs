const Sequelize = require("sequelize");
const db = require("./database");

const Eyeball = db.define("eyeballtable", {
  imageUrl: {
    type: Sequelize.STRING
    // allowNull: false
  },
  diagnosis: {
    type: Sequelize.STRING
  }
});

module.exports = Eyeball;
