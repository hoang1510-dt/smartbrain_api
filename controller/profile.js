
const handleProfileGet = (req,res)=>{
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
}

module.exports = {
    handleProfileGet: handleProfileGet
}