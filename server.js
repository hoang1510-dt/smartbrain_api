const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const register = require('./controller/register');
const signin = require('./controller/signin');
const image = require('./controller/image');
const profile = require('./controller/profile');

const database = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'hoangnamio',
      password : 'hoangnamIO',
      database : 'smartbrain'
    }
  });


const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{res.send(database.users) })

app.get('/profile/:id',(req,res)=>{profile.handleProfileGet(req,res)})

app.post('/signin',signin.handleSignIn(database,bcrypt))

app.post('/register',(req,res)=>{register.handleRegister(req,res,database,bcrypt)})

app.put('/image',(req,res)=>{image.handleImageGet(req,res,database)})

app.post('/imageurl',(req,res)=>{image.handleApiCall(req,res,database)})

app.listen(port,()=>{
    console.log("app is running on port",port)
});

