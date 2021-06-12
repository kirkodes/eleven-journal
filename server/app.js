require("dotenv").config(); // importing this package and invoking config(), we can make items in .env available to the whole application
const Express = require("express"); //import statement so I can use express
const app = Express(); // fires off a top-level function that allows me to create an Express app
const dbConnection = require("./db"); // imports the db file

// app.use('/test', (req, res) => {
//     res.send('This is a message from the test endpoint on the server!')
// }); //the canvas module said to remove this, but I wanna keep it to view as examples later

const controllers = require("./controllers"); // import the controllers as a bundle through the object that was exported in the index.js file and is stored in a variable called controllers (i think this bundle is the controllers file??)

app.use(Express.json()); // Express needs to json-ify the request to be able to parse and interpret the body of data being sent through the request. app.use MUST go above any routes, any routes above this statement will not be able to use express.json() function

app.use("/user", controllers.userController);

// app.use(require("./middleware/validate-jwt")); // anything below this will require a token; user route^ is not protected, but the journal route is... commenting out and putting this in the journalcontroller.js file as let validateJWT variable
app.use("/journal", controllers.journalController); // app.use() 1st param creates a base URL called /journal; 2nd param passes in the controllers object and uses dot notation to access the desired journalController; this means everything in the journalcontroller.js file will be sub-routes

dbConnection.authenticate() // use db variable to access the sequelize instance and its method from the db file; calls the authenticate method. This is an asynchronous method that runs a SELECT 1+1 AS result query. This method returns a promise.
    .then(() => dbConnection.sync()) // promise resolver to access the returned promise and call upon te sync() method; this will ensure that we sync all defined models to the database
    .then(() => { // use a promise resolver to access the returned promise from the sync() method and fire off the function that shows if we are connected
        app.listen(3000, () => { // app.listen uses express to start a UNIX socket and listens for connections on the given path. The given path is localhost:3000, which is indicated by the parameter 3000. port 3000, default port
            console.log(`[Server]: App is listening on 3000.`); // an anonymous callback ()function is called when the connection happens with a simple console.log; this allows me to see a message with the port that the server is running on
        });
    })
    .catch((err) => { /// promise rejection that fires off an error if there are any errors
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });