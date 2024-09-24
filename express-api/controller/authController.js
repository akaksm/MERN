const User = require('../models/authModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/setEmail')
const jwt = require('jsonwebtoken') //this is used for authentication.
const { response } = require('express')
const { error } = require('console')
const {expressjwt}= require('express-jwt')

//to register a new user
exports.postUser = async (request, response) => {
  let user = new User({
    name:request.body.name,
    email:request.body.email,
    password:request.body.password
  })
  User.findOne({ email:user.email }).then(async data => {
    if (data == null) {
      user = await user.save()
      if (!user) {
        return request.status(400).json({ error: 'Something went wrong' })
      }
      // working for token
      let token = new Token({
        token:crypto.randomBytes(16).toString('hex'),
        userId:user._id
      })
      token = await token.save()
      if (!token) {
        return response.status(400).json({ error: 'failed to create a token' })
      }

      //send eamil process
      sendEmail({
        from:'no-replay@online-store.com',
        to:user.email,
        subject:'Email Verification Link',  
        text: `Hello, \n\n, Please verify your email by using the below link\n\n http:\/\/${request.headers.host}\/api\/confirmation\/${token.token}`,
        html: `<h1> Verify your Email </h1>`
      })
      response.send(user)
    } else {
      return response.status(400).json({ error: "email must be unique" })
    }
  })
}

// confirming the email
exports.postEmailConfirmation=(request,response)=>{
  //at first find the valid or matching token
  Token.findOne({token:request.params.token})
  .then(token=>{
    if(!token){
      return response.status(400).json({error:'invalid token or token may have expired'})
    }
    // if we find the valid token then find the valid user for that token
    User.findOne({_id:token.userID})
    .then(user=>{
      if(!user){
        return response.status(400).json({error:'We are unable to fin the user.'})
      }
      // check if email is already verified or not
      if(user.isVerified){
        return response.status(400).json({error:'Email is already verified.'})
      }
      //save the verified user
      user.isVerified=true
      user.save()
      .then(user=>{
        if(!user){
          return response.status(400).json({
            error:'failed to verify the email.'
          })
        }
        response.json({message:'congrats, your email has been verified, login'})
      })
      .catch(err=>{
        return response.status(400).json({error:err})
      })
    })
    .catch(err=>{
      return response.status(400).json({error:err})
    })
  })
  .catch(err=>{
    return response.status(400).json({error:err})
  })
}

// signin process
exports.signIn=async(request,response)=>{
  const {email,password}=request.body
  
  // at first check if email is register in a database or not
  const user =await User.findOne({email})
  if(!user){
    return response.status(403).json({error:'Email does not exist in the database,Register first to login'})
  }
  // if email found then check the password for that email
  if(!user.authenticate(password)){
    return response.status(400).json({error:'Email and password does not match'})
  }
  // Check if user is verified or not
  if(!user.isVerified){
    return response.status(400).json({error:'please verify your email to continue.'})
  }
  //now generate token
  const token = jwt.sign({_id:user.id, role:user.role},process.env.JWT_SECRET)
  // store token in the cookie
  response.cookie('myCookie',token,{expire:Date.now()+9999999})
  // return user information to frontend
  const{_id,name,role}=user 
  return response.json({token,user:{_id,name,email,role}})
}

// forget password
exports.forgetPassword=async(response,request)=>{
  const user = await User.findOne({email:request.body.email})
  if(!user){
    return request.status(400).json({error:'sorry we are unable to find the email in our database, tey anoter or register first'})
  }
  let token =  new Token({
    userId:user._id,
    token:crypto.randomBytes(16).toString('hex')
  })
  token = await token.save()
  if(!token){
    return response.status(400).json({error:'failed to create token'})
  }
  //send email process
  sendEmail({
        from:'no-replay@online-store.com',
        to:user.email,
        subject:'Password Verification Link',  
        text: `Hello, \n\n, Please reset your password by using the below link\n\n http:\/\/${request.headers.host}\/api\/confirmation\/${token.token}`,
        html: `<h1> Reset Password </h1>`
      })
      response.json({msg:'password reset link has been sent to your email.'})
}

// reset password
exports.resetPassword=async(request,response)=>{
  // at first find the valis token
  let token = await Token.findOne({token:request.params.token})
  if(!token){
    return request.status(400).json({error:'invalid token or token may have expired'})
  }
  //if token found then find the valid user for that token
  let user = await User.findOne({_id:token.userId})
  if(!user){
    return response.status(400).json({error:'we are unable to find the valid user for this token'})
  }
  user.password=request.body.password
  user = await user.save()
  if(!user){
    return response.status(400).json({error:'failed to reset your password.'})
  }
  response.json({msg:'password has been reset successfully.'})
}

//user list
exports.userList=async(request,response)=>{
  const user = await User.find()
  .select('-hashed_password')
  .select('-salt')
  if(!user){
    return response.status(400).json({error:'something went wrong'})
  }
  response.send(user)
}

//user details
exports.userDetails=async(request,response)=>{
  const user = await User.findById(request.params.id)
  .select('-hashed_password')
  .select('-salt')
  if(!user){
    return res.status(400).json({error:'something went wrong'})
  }
  response.send(user)
}

// middleware for user role
exports.requireUser=(request,response,next)=>{
  // verify jwt 
  expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256']
  })(request,response,(err)=>{
    if(err){
      return response.status(401).json({error:'Unauthorized'})
    }
    // check for user role
    if(request.user.role==0){
      //grant access
      next()
    }
    else{
      // unauthorized
      return response.status(403).json({error:'Forbidden'})
    }
  })
}

// middleware for admin role
exports.requireAdmin=(request,response,next)=>{
  // verify jwt 
  expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256']
  })(request,response,(err)=>{
    if(err){
      return response.status(401).json({error:'Unauthorized'})
    }
    // check for user role
    if(request.user.role==1){
      //grant access
      next()
    }
    else{
      // unauthorized
      return response.status(403).json({error:'Forbidden'})
    }
  })
}