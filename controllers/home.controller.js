const models = require('../models');


async function getData(req,res){
  const user = await models.user.findOne(
    {
			where:{email:'ask4ismailsadiq@gmail.com'},
			attributes:['name','email','mobile','twitter']
    }
  );
  res.statusCode = 200;
	let message = 'My Rule-Validation API';
	let status = 'success';
	let data = user
	res.json({message,status,data});
}

async function validate(req,res){
  let message, status, data;
  const response = req.body;
  const rule = response.rule; const dataField = response.data;

  if(rule == undefined && dataField == undefined){
    res.statusCode = 400;
    message ='rule and data fields are required.';
    status='error'
    data = null;
    return res.json({message,status,data})
  }
  if(rule){
    if(typeof(rule)!=='object'){
      res.statusCode = 400;
      message ='rule should be a an object.';
      status='error'
      data = null;
      return res.json({message,status,data})
    }
    if(dataField){
      if(typeof(dataField)=='object' || typeof(dataField) == 'array' || typeof(dataField) == 'string'){
        if(rule.field){
          if(typeof(rule.field)=='string'){
            if(rule.condition && rule.condition_value){
              let field;
              let ruleField = rule.field
              let x;
              for( x in dataField){
                if(dataField[`${ruleField}`]){
                  field = dataField[`${ruleField}`];
                }
              }
              if(field){
                return singleSwitch(res,ruleField,rule.condition,field,rule.condition_value)
              }
              res.statusCode = 400;
              message ='field is needed in the data.';
              status='error'
              data = null;
              return res.json({message,status,data})
            }
            if(!rule.condition){
              res.statusCode = 400;
              message =`${rule.condition} is required.`;
              status='error'
              data = null;
              return res.json({message,status,data})
            }
            if(!rule.condition_value){
              res.statusCode = 400;
              message =`${rule.condition_value} is required.`;
              status='error'
              data = null;
              return res.json({message,status,data})
            }
          }else {
            let i;
            let fields = [];
            let fieldsValue = [];
            for(i in rule.field){
              let j;
              for(j in dataField){
                if(dataField[`${i}`]){
                  let k;
                  for(k in dataField[`${i}`]){
                    if(k == rule.field[`${i}`]){
                      let validate =  MultipleSwitch(rule.condition,dataField[`${i}`][`${k}`],rule.condition_value);
                      if(!validate){
                        res.statusCode = 200;
                        message =`field ${i} failed validated.`;
                        status = 'error';
                        data = {
                          "validation": {
                          "error":true,
                          "field": i,
                          "field_value": dataField[`${i}`][`${k}`],
                          "condition": rule.condition,
                          "condition_value":rule.condition_value
                          }
                        }
                        return res.json({message,status,data})
                      
                      }else{
                        fields.push(i);
                        fieldsValue.push(dataField[`${i}`][`${k}`])
                      }
                    }
                    res.statusCode = 400;
                    message ='field is needed in the data.';
                    status='error'
                    data = null;
                    return res.json({message,status,data})
                  }
                  
                }
                res.statusCode = 400;
                message ='field is needed in the data.';
                status='error'
                data = null;
                return res.json({message,status,data})
              }
              
            }
            let newFields = [... new Set(fields)].sort();
            let newFieldsValue = [... new Set(fieldsValue)].sort()
            console.log(newFields);
            res.statusCode = 200;
            message =`fields ${newFields} successfully validated.`;
            status = 'success';
            data = {
              "validation":{
                "error":false,
                "field": newFields,
                "field_values": newFieldsValue,
                "condition": rule.condition,
                "condition_value":rule.condition_value
              }
            }
            return res.json({message,status,data})
          }  
        }
        res.statusCode = 400;
        message ='field is required.';
        status='error'
        data = null;
        return res.json({message,status,data})
      }
      res.statusCode = 400;
      message ='data field has incorrect datatype.';
      status='error'
      data = null;
      return res.json({message,status,data})
    }
    res.statusCode = 400;
    message ='data is required.';
    status='error'
    data = null;
    return res.json({message,status,data})
  }
  res.statusCode = 400;
  message ='rule is required.';
  status='error'
  data = null;
  return res.json({message,status,data})
  
}

const MultipleSwitch =(condition,field,value)=>{
  switch(condition){
    case 'eq':
      if(field===value){
        return true
      }
      return false
    case 'neq':
      if(field !== value ){
        return true
      }
      return false
    case 'gt':
      if(field > value ){
        return true
      }
      return false
    case 'gte':
      if(field >=value){
        return true
      }
      return false;
    case 'contains':
      if(field == value ){
        return true
      }
      return false;
  }
}
const singleSwitch =(res,ruleField,condition,field,value)=>{
  switch(condition){
    case 'eq':
      if(field===value){
        res.statusCode = 200;
        message =`field ${ruleField} successfully validated.`;
        status = 'success';
        data = {
          "validation":{
            "error":false,
            "field": ruleField,
            "field_value": field,
            "condition": condition,
            "condition_value":value
          }
        }
        return res.json({message,status,data})
      }
      res.statusCode = 200;
      message =`field ${ruleField} failed validated.`;
      status = 'error';
      data = {
        "validation":{
          "error":true,
          "field": ruleField,
          "field_value": field,
          "condition": condition,
          "condition_value":value
        }
      }
      return res.json({message,status,data})
    case 'neq':
      if(field !== value ){
        res.statusCode = 200;
        message =`field ${ruleField} successfully validated.`;
        status = 'success';
        data = {
          "validation":{
            "error":false,
            "field": ruleField,
            "field_value": field,
            "condition": condition,
            "condition_value":value
          }
        }
        return res.json({message,status,data})
      }
      res.statusCode = 200;
      message =`field ${ruleField} failed validated.`;
      status = 'error';
      data = {
        "validation":{
          "error":true,
          "field": ruleField,
          "field_value": field,
          "condition": condition,
          "condition_value":value
        }
      }
      return res.json({message,status,data})
    case 'gt':
      if(field > value ){
        res.statusCode = 200;
        message =`field ${ruleField} successfully validated.`;
        status = 'success';
        data = {
          "validation":{
            "error":false,
            "field": ruleField,
            "field_value": field,
            "condition": condition,
            "condition_value":value
          }
        }
        return res.json({message,status,data})
      }
      res.statusCode = 200;
      message =`field ${ruleField} failed validated.`;
      status = 'error';
      data = {
        "validation":{
          "error":true,
          "field": ruleField,
          "field_value": field,
          "condition": condition,
          "condition_value":value
        }
      }
      return res.json({message,status,data})
    case 'gte':
      if(field >=value){
        res.statusCode = 200;
        message =`field ${ruleField} successfully validated.`;
        status = 'success';
        data = {
          "validation":{
            "error":false,
            "field": ruleField,
            "field_value": field,
            "condition": condition,
            "condition_value":value
          }
        }
        return res.json({message,status,data})
      }
      res.statusCode = 200;
      message =`field ${ruleField} failed validated.`;
      status = 'error';
      data = {
        "validation":{
          "error":true,
          "field": ruleField,
          "field_value": field,
          "condition": condition,
          "condition_value":value
        }
      }
      return res.json({message,status,data});
    case 'contains':
      if(field == value ){
        res.statusCode = 200;
        message =`field ${ruleField} successfully validated.`;
        status = 'success';
        data = {
          "validation":{
            "error":false,
            "field": ruleField,
            "field_value": field,
            "condition": condition,
            "condition_value":value
          }
        }
        return res.json({message,status,data})
      }
      res.statusCode = 200;
      message =`field ${ruleField} failed validated.`;
      status = 'error';
      data = {
        "validation":{
          "error":true,
          "field": ruleField,
          "field_value": field,
          "condition": condition,
          "condition_value":value
        }
      }
      return res.json({message,status,data});
  }
}

module.exports ={
  getData,
  validate
}