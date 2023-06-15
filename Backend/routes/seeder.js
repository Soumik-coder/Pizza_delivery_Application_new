const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/config');

const Pizza = require('./models/pizzaModel');
const Pizzas = require('./data/pizzaData');
dotenv.config();
connectDB();
const importData = async() => {
    try {
        await Pizza.deleteMany();
        const sampleData = Pizzas.map(pizza => {return {...pizza}});
        await Pizza.insertMany(sampleData);
        console.log("Data IMPORTED");
        process.exit();
    }
    catch (err) {
        console.error(err);

    }
}

const dataDestroy = () => {}

if(process.argv[2]=== '-d')
{
    dataDestroy();
}else{
    importData();
}
