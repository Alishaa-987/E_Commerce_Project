const mongoose = require('mongoose');

const connectionDatabase = ()=>{
    mongoose.connect(process.env.DB_URL)
    .then((data) => console.log(`mongo connected with sever: ${data.connection.host}`))
    .catch((err) => console.log(err));
}

module.exports = {
    connectionDatabase
}