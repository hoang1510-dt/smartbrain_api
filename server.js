const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const database = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'hoangnamio',
      password : 'hoangnamIO',
      database : 'smartbrain'
    }
  });

const saltRounds = 10;

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    database.select('*').from('login').then(data =>{
        res.send(data.email);
    })
})

app.get('/profile/:id',(req,res)=>{
    const {id}= req.params;
    let found = false;
    database('users').where({id}).select('*')
    .then(user =>{
        if(user.length>0){
            res.json(user[0]);
        }
        else{
            res.status(400).json('Not Founds!');
        }
    });
})

app.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    database.select('email','hash')
    .from('login').where('email','=',email).then(data =>{
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
            return database.select('*').from('users').where('email','=',email)
            .then(user =>{
                res.status(200).json(user[0]);
            })
            .catch(err=>{
                res.status(400).json('unable to get user');
            })
        }
        else{
            res.status(400).json('wrong username or password!');
        }
    })
})

app.post('/register',(req,res)=>{
    const {name, email,password } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    database.transaction(trx =>{
        trx.insert({
            hash: hash,
            email: email
        }).into('login')
        .returning('email')
        .then(loginEmail =>{
           return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date(), 
            }).then(user=>res.json('success'))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err=> res.status(400).json("User has been register!"))
})

app.put('/image',(req,res)=>{
    const {id} = req.body;
    console.log(id)
    database('users')
    .where('id', '=', id)
    .increment('entries',1)
    .returning('*')
    .then(entries=>{
        res.json(entries[0]) 
    })
    .catch(err=>{res.status(400).json('unable to get to entries')})
})

app.listen(port,()=>{
    console.log("app is running on port",port)
});

