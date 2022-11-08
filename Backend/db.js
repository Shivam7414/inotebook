// const mongoose = require('mongoose');
// // const mongoURI = "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
// const mongoURI = "mongodb://localhost:27017/inotebook"
// const connectToMongo = () => {
//     mongoose.connect(mongoURI, () => {
//         console.log("connected to Mongo succesfully")
//     })

// }
// module.exports = connectToMongo;
const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/inotebook').then(() => {
    console.log('connection successful')
}).catch((error) => {
    console.log("something wrong", error)
})


