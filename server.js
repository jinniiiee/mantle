const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/surface', {useNewUrlParser: true, useUnifiedTopology: true});

// API Routes (require from routes folder and pass in Express app)
//require('./routes/api-routes')(app);
// HTML Routes (require from routes folder and pass in Express app)
//require('./routes/html-routes')(app);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("We are connected");
});

var storySchema = new mongoose.Schema({
  author: String,
  title: String,
  credits: Number,
  //publishedDate: Date,
  blogContent: String
});

var Story = mongoose.model("Story", storySchema);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', function(req, res){
        Story.find({}, function (err, blogContent) {
                res.render('index',{blogContent:blogContent});
        });
		/*Story.find({}).populate('blogContent').exec(function (err, stories) {
		  if (err) return handleError(err);
		  //console.log('The author is %s', stories.blogContent);
		  res.render('index',{stories:stories});
		});
        */
});

app.get('/saveContent', function(req, res){
        Story.find({}, function (err, blogContent) {
            res.render('index',{blogContent:blogContent});
        });
});

app.post('/', function (req, res) {
  //res.send('Hello World!')
  console.log(req.body.content);
  res.render('index');
});

app.post("/saveContent", (req, res) => {
  var myData = new Story(req.body);
  myData.save()
    .then(item => {
      Story.find({}, function (err, blogContent) {
            res.render('index',{blogContent:blogContent});
        });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
	  console.log(err);
    });	
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


