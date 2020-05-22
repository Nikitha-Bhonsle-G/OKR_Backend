const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');
const axios = require('axios')


router.post('/signup',async (req,res)=>{
   
    const {full_name,email,contact,organisation_id,password,designation,employee_id,ptq,rating,user_type} = req.body;

    try{
      const user = new User({full_name,email,contact,organisation_id,password,designation,employee_id,ptq,rating,user_type});
      await  user.save();
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})

    }catch(err){
      return res.status(400).send(err.message)
    }
    
    
})

router.post('/signin',async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).send({error :"must provide valid email or password"})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(422).send({error :"must provide valid email or password"})
    }
    try{
        const payload={
            _id:user._id,
            full_name:user.full_name,
            email:user.email,
            contact:user.contact,
            organisation_id:user.organisation_id,
            designation:user.designation,
            employee_id:user.employee_id,
            ptq:user.ptq,
            rating:user.rating
        }
      await user.comparePassword(password);    
      let token = jwt.sign(payload,jwtkey);
      res.send({token})
    }catch(err){
        return res.status(422).send({error :"must provide email or password"})
    }   

})


module.exports = router