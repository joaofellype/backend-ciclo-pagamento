const express = require('express');

const models = require('../models/creditScheme');
const User  = require('../models/user')
const router = express.Router();
const bcrypt = require('bcryptjs')
const genereteJwt = require('../controller/token')
const authentic = require('../controller/authenticUser')
const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/
router.post('/createCredit',async (req,res)=>{
    try{
       
        const  credit = await models.CreditSchema.create(req.body);
  
        return res.send({credit})
    }catch(err){
        return res.status(400).send({error: 'REGISTRATION FAILK'})
    }
})

router.post('/createBillingCycle',async (req,res)=>{
	console.log(req.body)
    if(!req.body.name){
        res.status(400).json({message:'O campo Nome tem que ser preenchido'})
        return
    }
    if(!req.body.month){
        res.status(400).json({message:'O campo Mês tem que ser preenchido'})
        return
    }
    if(!req.body.year){
        res.status(400).json({message:'O campo Ano tem que ser preenchido'})
        return
    }
    try{

        const  billing = await models.BillingCycleSchema.create(req.body);
        return res.send({billing})
    }catch(err){
        console.log(err)
        return res.status(400).send({error: 'REGISTRATION FAILK'})
    }
})
router.post('/createDebit',async (req,res)=>{
    try{
        const  debit = await models.DebtSchema.create(req.body);
        return res.send({debit})
    }catch(err){
        return res.status(400).send({error: 'REGISTRATION FAILK'})
    }
})

router.get('/listarAllCredit',async (req,res)=>{
    try{
        const credit = await models.CreditSchema.find();
        return res.send({credit})
    }catch(erro){
        return res.status(400).send({err:erro})
    }
})
router.get('/listarAllDebit',async (req,res)=>{
    try{
        const debit = await models.DebtSchema.find();
        return res.send({debit})
    }catch(erro){
        return res.status(400).send({err:erro})
    }
})
router.get('/listarAllBilling',async (req,res)=>{
    try{
        const billing = await models.BillingCycleSchema.find();
        return res.send({billing})
    }catch(erro){
        return res.status(400).send({err:erro})
    }
})
router.get('/listarCreditoOne/:id',async(req,res)=>{
    try{
        const credit = await models.CreditSchema.findById(req.param.id);
        return res.send({credit});
    }catch(err){
        return res.status(400).send({err:err})
    }
})
router.get('/listarDebitOne/:id',async(req,res)=>{
    try{
        const debit = await models.DebtSchema.findById(req.param.id);
        return res.send({debit});
    }catch(err){
        return res.status(400).send({err:err})
    }
})
router.get('/listarBillingOne/:id',async(req,res)=>{
    try{
        const billing = await models.BillingCycleSchema.findById(req.params.id);
        return res.send({billing});
    }catch(err){
        return res.status(400).send({err:err})
    }
});

router.put('/editCredit/:id',async(req,res)=>{
    try{
        const Credit = req.body;
        const billing = await models.CreditSchema.findOneAndUpdate({id:req.params.id},{Credit},{new:true});
        return res.send({billing})
    }catch(erro){
        res.status(400).send({err:erro})
    }
})
router.put('/editBilling/:id',async(req,res)=>{
    try{
        const BillingCycleSchema = req.body;
        console.log(req.params.id)
        const billing = await models.BillingCycleSchema.findByIdAndUpdate({_id:req.params.id},BillingCycleSchema,{new:true});
        return res.send({billing})
    }catch(erro){
        res.status(400).send({err:erro})
    }
})

router.delete('/deleteBilling/:id',async(req,res)=>{
    try{
        const billing = await models.BillingCycleSchema.deleteOne({_id:req.params.id});
        return res.status(200).send({message:'Deletado com sucesso'})
    }catch(erro){
        res.status(400).send({error:erro})
    }
})
router.get('/count',async(req,res)=>{
    try{
        const billing = await models.BillingCycleSchema.count()
        return res.send({billing})
    }catch(erro){
        res.status(400).send({error:erro})
    }
})
router.get('/summary',async(req,res)=>{
    try{
      models.BillingCycleSchema.aggregate([{
          $project:{credit:{$sum:'$credits.value'},debt:{$sum:"$debts.value"}}
      },{
          $group:{_id:null,credit:{$sum:"$credit"},debt:{$sum:"$debt"}}
      },{
          $project:{_id:0,credit:1,debt:1}
      }],(error,result)=>{
          console.log(result)
          if(error){
              res.status(500).json({errors:error})
          }else{
              res.json(result[0] ||{credit:0,debt:0})
          }
      })
    }catch(erro){
        res.status(400).send({error:erro})
    }
})

router.post('/createUser', async (req,res)=>{
    const { email, password } = req.body
    if(!email.match(emailRegex)){
        return res.status(400).json({message:'Email Inválido'})
    }
    if(!password.match(passwordRegex)){
        return res.status(400).json({message:'Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-20.'})
    }
        try{
            if(await User.findOne({email}))
              return res.status(400).json({message:'Usuario existente'}) 
            
            const user = await User.create(req.body)
            return res.status(200).json({message:'Usuario Cadastrado',user:user})
        }catch(err){
            return res.status(400).json({message:err})
        }
});

router.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    console.log('jdfldjfkdjf')
    console.log(req.body)
    const user = await User.findOne({email}).select('+password');

    if(!user)
        return res.status(400).json({message:'Usuário nao encontrado'})
    
    if(!await bcrypt.compare(password,user.password))
        return  res.status(400).json({message:'Senha Incorreta'})

    user.password = undefined
    const token = genereteJwt.genereteToken({user})
        console.log(token)
    return res.status(200).json({user,token})

});
router.post('/validateToken',genereteJwt.validateToken)

module.exports = app => app.use('/',router)