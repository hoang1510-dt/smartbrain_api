
const Clarifai = require('clarifai');


const app = new Clarifai.App({
    apiKey: 'f2d9807d08e9495d86af74f88e08dad5'
  })
const handleApiCall = (req,res) =>{
    const {input} = req.body;
    app.models
    .predict(  Clarifai.FACE_DETECT_MODEL, input)
    .then(data=>{
    res.json(data)  
    })
    .catch(err=>{res.status(400)})
}
  

const handleImageGet = (req,res,database)=>{   
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
}

module.exports = {
    handleImageGet: handleImageGet,
    handleApiCall:handleApiCall
}