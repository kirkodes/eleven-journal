// usercontroller is a controller that we can use to fill our database with users. Note the .post()
const router = require("express").Router(); // import express and access the Router() method, assigning it to a variable called router
// const { UniqueConstraintError } = require("sequelize/types");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { UserModel } = require("../models"); // object deconstructuring to import the user model and store it in UserModel variable. Pascal casing (capital each word) for a model class with Sequelize.
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {  // async callback function, AKA "handler function", function gets called when the app receives a request to the specified route and HTTP method. The application listens for requests that match specified routes and methods, when it detects a match, the calls the specified callback function
    let { email, password } = req.body.user; // deconstruction to take in and parse the request. req.body middleware provided by Express and append two properties (key/value pairs) to it. This is what's sent to the database. req is the actual request, and body is where our data is being held. user is a property of body, while email and password are properies of user
    try {
        const User = await UserModel.create({ // create() is a sequelize method that allows us to create an instance of the User model and send it off to the database, as long as the data types match the model
            //const User -- saving User as a variable allows us to be able to readily call the data
            email, // what we extrapolate using the above deconstructuring will now be store when creating our user
            password: bcrypt.hashSync(password, 13), // hashSync() takes two arguments. 1st - a string; here we supply the original password. 2nd - a string or number. This argument is the number of times we want our first argument salted. Salting is the adding of random data to a hashed string
        });

        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24}); // call upon jwt which refers to our jsonwebtoken dependency. .sign() is a jwt method we use to create the token, which takes 2 parameters: 1st is the payload(User.id; the primary key of the user table and is assigned to the user when created in the db. User refers to the variable created above, which captures the promise when we create a new user) and 2nd is the signature (this is used to help encode and decode the token.
        //specific options can be added to a token, here we added an option to make the token expire.
        res.status(201).json({ //.json packages our response as json. res.send() and res.json
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }
    }
});

router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;
    
    try {
        const loginUser = await UserModel.findOne({ // findOne() is a sequelize method, it tries to find one element from the matching model within the database... AKA Data Retrieval
            where: { // where is an object within Sequelize that tells the db to look for something matching its properties
                email: email, // can filter what we want from a db with a where clause.. here we want to find a user whose value matches the value we send through our request; looking in the email column in the user table for one thing that matches the value passed from the client
            },
        });
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password); // comparing the 1st argument to the 2nd. 1st - the password value from the current request when the user is signing up. 2nd argument pulls the hashed password from the database
            if (passwordComparison) {
                let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect email or password."
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect email or password."
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});

module.exports = router;