const bodyParser = require('body-parser');
const { prototype } = require('events');
let express =require('express')
  path = require('path')
  mongoose = require('mongoose');
  cors  = require('cors')

  mongoDb = require('./database/db')


mongoose.Promis = global.Promise;
mongoose.connect(mongoDb.db, {
  useNewUrlParser: true,
  
  useUnifiedTopology: true
}).then(()=>{
  console.log("Database successfully connected");
},error=>{
  console.log("Database eerror: "+error);
})

const bookRoute = require("./routes/book_routes")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(cors());

//Static directiroy path

app.use(express.static(path.join(__dirname, 'dest/')))
//Base route

app.get('/',(req, res)=>{
  res.sendFile(path.join(__dirname, 'dest/index.html'))
})

//API Root
app.use('/api',bookRoute)
;

//PORT
const port = process.env.PORT || 8080


app.listen(port, ()=>{
  console.log('Listenning on port '+port);
})
//404 Hander

app.use((req, res,next)=>{
  next(createError(404));
})

//error hander
app.use(function(err, req, res, next){
  console.log(err.message);
  if(!err.statusCode)err.statusCode = 500;
  res.status(err.statusCode).send(err.message)
})
