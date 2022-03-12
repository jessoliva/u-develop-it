// to use Express.js
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

// Express middleware
// Middleware is a function or piece of code that is called (run) between when a server gets a request from a client and when it sends a response back to the client
// a method inbuilt in express to recognize the incoming Request Object as strings or arrays
// Express.urlencoded() expects request data to be sent encoded in the URL, usually in strings or arrays --> .../Name=Pikachu&Type=Banana&Number+In+Stable=12
app.use(express.urlencoded({ extended: false }));
// a method inbuilt in express to recognize the incoming Request Object as a JSON Object
// Express.json() expects request data to be sent in JSON format --> {"Name": "Pikachu", "Type": "Banana", "Number In Stable": 12}
app.use(express.json());
// need these middleware for POST and PUT requests because in both these requests you are sending data (in the form of some data object) to the server and you are asking the server to accept or store that data (object), which is enclosed in the body (i.e. req.body) of that (POST or PUT) Request

// what is displayed on root page


// order of routes matter so this route should be at the very end since it's a catchall
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// function that will start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});