//Import the express by this process below
const express = require("express");
const morgan = require('morgan')


// const { testFunction } = require("./controller/testController");

//Imort the dotenv and then it is configured using .config(). During configuration parenthesis"()" should not forget because it is a function.
require("dotenv").config();
require("./DB/connection");
const bodyParser = require("body-parser");

//testRoute is imported from the route folder.
// const testRoute = require("./routes/testRoutes");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");
const orderRoute = require('./routes/orderRoute')

//In this step the variable declared above of express is initialized in the app variable.
const app = express();

//get, post, put, patch, delete (put update the whole data while patch only update new data). /test is route, and another is function. This is just an example. We simple do not do like this.
// app.get("/test", (request, response) => {
//   response.send(`This is a api server.`);
// });

app.use(bodyParser.json());
app.use(morgan('dev'))

//routes
// app.use('/api', testRoute)
app.use("/api", categoryRoute);
app.use("/api", productRoute);
app.use("/api", authRoute);
app.use("/api" ,orderRoute)

//In this step we take port number that is declared on the .env file or if the .env file is not declared we can give the port number to the variable directly by sing the or(||).
port = process.env.PORT || 8000;

// To listen port by the server or to read which port it is we use the function app.listen
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//To start the server open the terminal and type "node server.js(file_name)" and hit enter.
//But if the content are updated every time we also need to restart the server each time so to eradicate this we use nodemon.
// type npm install nodemon in the terminal to install nodemon. We can check if it is install or not. Inside the package.json file there is a key called dependencies which includes values how many files are install.
//inside the script key under the same file make ("start":"nodemon server.js"). Now type npm start in the terminal to start the server and it will restart the server each time we save the files.
