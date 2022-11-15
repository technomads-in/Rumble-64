const mongoose = require('mongoose')
require('dotenv').config()

function mongoConnect() {
    // Database connection
    mongoose.connect(process.env.MONGODB
    ).then(() => console.log("DB connection successful!"))
        .catch((err) => {
            console.log(err)
            console.log("Error connecting DB!")
        });
}

module.exports = mongoConnect()