const handleSignIn = (database,bcrypt)  =>  (req,res) => {
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
}

module.exports = {
    handleSignIn: handleSignIn
}