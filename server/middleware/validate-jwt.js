const jwt = require("jsonwebtoken"); // we're interacting with the user's session token for authentication, so we need to import the JWT package here
const { UserModel } = require("../models"); // we want to find info about a specific use so we will need to communicate with our user model in our database

const validateJWT = async (req, res, next) => { // asynchronous fat arrow function called validateJWT. takes in those 3 params
    if (req.method == "OPTIONS") { // this function starts with a conditional statement that checks the method of the request. Sometimes a request will come in as OPTIONS rather than POST, GET, PUT, DELETE. OPTIONS is the first part of the pre-flight request. This determines if the actual request is safe to send or not.
        next(); // if there IS a preflight request, we pass in the 3rd param, declared in the asynchronous function. req, res, and next are parameters that can only be accessed by express middleware functions. next() is a nested middleware function that, when called, passes control to the next middleware function
    } else if ( // if we're dealing with a GET, POST, PUT, DELETE request, we want to see if there is any data in authorization header of the incoming request AND if that string includes the word Bearer
        req.headers.authorization &&
        req.headers.authorization.includes("Bearer")
    ) {
        const { authorization } = req.headers; // object deconstruction to pull the value of the authorization header and store it in a variable called authorization
        // console.log("authorization -->", authorization);
        const payload = authorization
        ? jwt.verify(
            authorization.includes("Bearer") // if we have token that includes the word Bearer, we extrapolate and return just the token from the whole string. If the word Bearer is not included in the authorization header, the just return the token
            ? authorization.split(" ")[1]
            : authorization,
            process.env.JWT_SECRET
        ) // dependent on the token and the conditional statement, the value of payload will either be the token excluding the word Bearer or undefined
        : undefined;

        // console.log("payload -->", payload);

        if (payload) {
            let foundUser = await UserModel.findOne({ where: { id: payload.id } }); // if payload comes back truthy, we use Sequelize's findOne method to look for a user in our UserModel where the ID of the user in database matches the ID stored in the token. It then stores the value of the located user in a variable called foundUser
            // console.log("foundUser -->", foundUser);
            if (foundUser) {
                // console.log("request -->", req);
                req.user = foundUser;
                next();
            } else {
                res.status(400).send({ message: "Not Authorized" });
            }
        } else {
            res.status(401).send({ message: "Invalid token" });
        }
    } else {
        res.status(403).send({ message: "Forbidden" });
    }
};

module.exports = validateJWT;

/*

Line 7, 8, and 9: If we are dealing with a POST, GET, PUT, or DELETE request, we want to see if there is any data in authorization header of the incoming request AND if that string includes the word Bearer.

Line 11: Next, we use object deconstruction to pull the value of the authorization header and store it in a variable called . We'll learn how to insert our token in our request in a later module.

Line 12 through 19: Let's start with a simple explanation and then dive into each piece a bit more.

Line 12, 13, and 19:
This is a ternary. This ternary verifies the token if  contains a truthy value. If it does not contain a truthy value, this ternary returns a value of  which is then stored in a variable called .

Line 13, 14, 15, 16, and 17:
If the token contains a truthy value, it does the following:
We call upon the JWT package and invoke the verify method. 
This method's first parameter is our token. This is the same variable we declared on line 11.
The second parameter is the JWT_SECRET we created in our  file so the method can decrypt the token.

Lines 14, 15, and 16, we are using another ternary to do some more checking.
If we have token that includes the word "Bearer", we extrapolate and return just the token from the whole string ().
If the word "Bearer" was not included in the authorization header, then return just the token. 
Long story short, dependent on the token and the conditional statement, the value of payload will either be the token excluding the word "Bearer" OR undefined.

Line 21: Here is another conditional statement that check if for a truthy value in payload.

Line 22: If payload comes back as a truthy value, we use Sequelize's findOne method to look for a user in our UserModel where the ID of the user in database matches the ID stored in the token. It then stores the value of the located user in a variable called foundUser.

Line 24: Another nested conditional statement! This one checks if the value of foundUser is truthy.

Line 25: This is incredibly important so please read this several times.

If we managed to find a user in the database that matches the information from the token, we create a new property called user to express's request object.

The value of this new property is the information stored in foundUser. Recall that this includes the email and password of the user.

This is crucial because we will now have access to this information when this big middleware function gets invoked. We will see this in action in the next few modules.

Line 26: Since we are creating a middleware function, we have access to that third parameter we established earlier: next(). As said earlier, the next function simply exits us out of this function. Click here to learn more about using Router-level middleware with Express. (Links to an external site.)

Lines 27, 28, and 29: If our code was unable to locate a user in the database, it will return a response with a 400 status code and a message that says "Not Authorized".

Lines 30, 31, and 32: If payload came back as undefined, we return a response with a 401 status code and a message that says "Invalid token".

Lines 33, 34, and 35: If the authorization object in the headers object of the request is empty or does not include the word "Bearer", it will return a response with a 403 status code and a message that says "Forbidden".

*/