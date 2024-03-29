// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const storyRoutes = require('./routes/storyRoutes');
const {MongoClient} = require('mongodb');
const {getCollection} = require('./models/story');

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017';
app.set('view engine', 'ejs');

//mount middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

MongoClient.connect(url)
.then(client => {
    db = client.db('demos');
    getCollection(db);
    //start the server
    app.listen(port, host, () => {
        console.log('The server is running at port', port);
    });
})
.catch(err=> console.log(err.message));

app.get('/', (req, res) => {
    res.render('index');
});
app.use('/stories',storyRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate '+ req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server Error")
    }
    res.status(err.status);
    res.render('error',{error:err});
});
