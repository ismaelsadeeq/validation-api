const models = require('../models');
async function addData(req,res){
  const data = req.body;
  if(data){
    await models.user.create(
      {
        name:data.names,
        github:data.github,
        email:data.email,
        mobile:data.mobile,
        twitter:data.twitter
      }
    );
    res.statusCode = 200;
    let message = 'User created';
    let status = 'success';
    return res.json({message,status})
  } else
  {
    res.statusCode = 200;
    let message = 'empty post';
    let status = 'error';
    return res.json({message,status})
  }
 
}
module.exports ={
  addData
}