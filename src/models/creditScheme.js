const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    value:{
        type:Number,
        min:0,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});

const debtSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    value:{
        type:Number,
        min:0,
        required:true
    },
    status:{
        type:String,
        required:false,
        uppercase:true,
        enum:['PAGO','PENDENTE','AGENDADO']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const billingCycleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    month:{
        type:Number,
        min:1,
        max:12,
        required:true,

    },
    year:{
        type:Number,
        min:1970,
        max:2100,
        required:true
    },
    credits:[creditSchema],
    debts:[debtSchema],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const CreditSchema = mongoose.model('Credit',creditSchema)
const DebtSchema = mongoose.model('Debit',debtSchema)
const BillingCycleSchema = mongoose.model('BillinClycle',billingCycleSchema);

module.exports={
    CreditSchema,
    DebtSchema,
    BillingCycleSchema
}