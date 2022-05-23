const mongoose = require('mongoose');

module.exports = function() {
  const db = "mongodb+srv://aditiiraj:Qwerty123@cluster0.kruht.mongodb.net/?retryWrites=true&w=majority";
  mongoose.connect(db)
    .then(() => console.info(`Connected to ${db}...`))
    .catch((err) => console.error(err))
}