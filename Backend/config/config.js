const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const url = process.env.MONGO_URL;
        const conn = await mongoose.connect(url,{
       
        })
        console.log("MongoDB is Connected")
    }
    catch (err) {
        console.log("error: ",err);
    }
}
module.exports = connectDB;
