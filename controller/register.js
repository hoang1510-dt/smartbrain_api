const saltRounds = 10;


const handleRegister = (req,res,database,bcrypt)=>{
    const {name, email,password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json('incorrent form submission')
    }
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
            }).then(user=>res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err=> res.status(400).json("User has been register!"))
}

module.exports = {
    handleRegister: handleRegister
}