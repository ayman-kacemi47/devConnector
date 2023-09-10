const mongoose = require('mongoose');  // in the mongoURI you can't have special character in name or password so  for my case i used %40 instead of @
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try{
       await mongoose.connect(db,{
        useNewUrlParser:true,
       // useCreateIndex: true,  i think it works in old version 'now it cause errors'
       });
       console.log('MongoDB Connected...');
    }catch(err){
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
}
module.exports = connectDB;