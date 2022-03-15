// to use Express.js
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

// import index.js, which is the central hub that pulls all the different routes
const apiRoutes = require('./routes/apiRoutes');
// you don't have to specify index.js in the path (e.g., ./routes/apiRoutes/index.js). If the directory has an index.js file in it, Node.js will automatically look for it when requiring the directory.

// import database connection code (connecting mysql to the application)
const db = require('./db/connection');

// Express middleware
// Middleware is a function or piece of code that is called (run) between when a server gets a request from a client and when it sends a response back to the client
// a method inbuilt in express to recognize the incoming Request Object as strings or arrays
// Express.urlencoded() expects request data to be sent encoded in the URL, usually in strings or arrays --> .../Name=Pikachu&Type=Banana&Number+In+Stable=12
app.use(express.urlencoded({ extended: false }));
// a method inbuilt in express to recognize the incoming Request Object as a JSON Object
// Express.json() expects request data to be sent in JSON format --> {"Name": "Pikachu", "Type": "Banana", "Number In Stable": 12}
app.use(express.json());
// need these middleware for POST and PUT requests because in both these requests you are sending data (in the form of some data object) to the server and you are asking the server to accept or store that data (object), which is enclosed in the body (i.e. req.body) of that (POST or PUT) Request

// use index.js routes file
// By adding the /api prefix here, we can remove it from the individual route expressions
app.use('/api', apiRoutes);

// order of routes matter so this route should be at the very end since it's a catchall
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {

    if (err) throw err;
    
    console.log('Database connected.');

    // function that will start the Express.js server on port 3001
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});