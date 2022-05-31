const knex = require("../config/db.js");
const knexdb =knex.knex;
const filepath =knex.filepath;
const bcrypt = require('bcryptjs');
const auth = require('../../utils/auth');
const common = require('./common.js');
const cryptojs = require('../../utils/cryptojs');
const fs = require('fs');
async function register(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.body.source || (req.body.source == 1 && (!(req.body.email).trim() || !(req.body.password).trim())) || (req.body.source != 1 && !(req.body.source_id).trim()))
      return res.send({
        status: false,
        message: "All fields required."
      });

    /*const first_name = (req.body.first_name).trim();
    let name = first_name;
    let last_name = "";
    if(req.body.last_name)
    {
      last_name = (req.body.last_name).trim();
      name = name+' '+last_name;
    }*/
    let email = "";
    const source = req.body.source;
    let password = "";
    if(source == 1)
    {
      password = (req.body.password).trim();
      password = await bcrypt.hashSync(password,10);
    }
    let source_id = "";
    if(source != 1)
      source_id = (req.body.source_id).trim();

    if(req.body.email)
    {
      email = (req.body.email).trim();
      let checkuniq = await knexdb('users').where('email','like',email).where('source',source).count({ rows: 'id'});
      if(checkuniq && checkuniq[0].rows > 0)
        return res.send({
          status: false,
          message: "Email id already exists in our database."
        });
    }
    
    if(source != 1)
    {
      let checkuniqsource = await knexdb('users').where('source',source).where('source_id',source_id).count({ rows: 'id'});
      if(checkuniqsource && checkuniqsource[0].rows > 0)
        return res.send({
          status: false,
          message: "You account already register with same source id."
        });
    }
    let display_name = await common.getDisplayName();
    if(req.body.display_name)
      display_name = (req.body.display_name).trim();
    name = display_name;
    const verifytoken = cryptojs.encryptStr(new Date());
    let email_verified = 0;
    if(source == 2)
      email_verified = 1;
    const usersData = {
      name,
      //first_name: first_name,
      //last_name: last_name,
      email,
      email_verified,
      password,
      source,
      source_id,
      display_name,
      email_verifiy_token:verifytoken,
      last_login: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };

    const userResponse = await knexdb('users').insert(usersData);
    if(!userResponse)
      return res.send({
        status: false,
        message:'Network connection error.'
      });
    const user_id = userResponse[0];
    const profile = await profileData(user_id);
    if(!profile)
      return res.send({
        status: false,
        message:'Network connection error.'
      });
    profile.user_id = cryptojs.encryptStr(user_id.toString());
    const userInfo = {
      name: profile.name,
      source: profile.source,
      email: profile.email
    };
    const token = auth.generateToken(userInfo);
    const authData = {
      user_id: user_id,
      token: token,
      created_at: new Date()
    };
    const authResponse = await knexdb('auth').insert(authData);
    const link = `https://thetalkplace.com/verifyemail/${profile.user_id}/${verifytoken}`;
    if(profile.email && email_verified == 0)
    {
      const template = fs.readFileSync('talkemail/verifyemail.html',{encoding:'utf-8'});
      let body = template.replace('[USER_NAME]', profile.name);
      body = body.replace('[REQUEST_LINK]', link);
      common.sendemail(profile.email,"Verification Email",body);
    }
    return res.send({
      status: true,
      message:'User has been register successfully.',
      body:{
        'profile':profile,
        'token': token
      }
    });
  } catch (err) {
    common.logdata('register', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function login(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.body.source || !(req.body.email).trim() || !(req.body.password).trim())
      return res.send({
        status: false,
        message: "All fields required."
      });

    const source = req.body.source;
    if(source != 1)
      return res.send({
        status: false,
        message: "Invalid Request."
      });
    const email = (req.body.email).trim();
    const password = (req.body.password).trim();
    const validateEmail = await knexdb('users').where('email',email).where('source',source).count({ rows: 'id'});
    if(validateEmail && validateEmail[0].rows == 0)
      return res.send({
        status: false,
        message: "Email id not found."
      });

    const users = await knexdb('users').select(['id','name','first_name','last_name','email','source','password','status','image','post_as_anonymous','display_name','view_previous_invoice']).where('email',email).where('source',source);
    if(!users)
      return res.send({
        status: false,
        message: "User not found."
      });
    const user = users[0];
    if(user.status !== 1)
      return res.send({
        status: false,
        message: "Your account is currently inactive, please contact admin."
      });
    if(user.image != "")
      user.image = filepath+user.image;
    if(!bcrypt.compareSync(password,user.password))
      return res.send({
        status: false,
        message: "Invalid user. Please enter the valid details."
      });
    const user_id = user.id;
    user.user_id = cryptojs.encryptStr(user_id.toString());
    delete user.password;
    delete user.id;
    
    await knexdb('users').where('id',user_id).update({"last_login":new Date(), "post_as_anonymous":1});
    user.post_as_anonymous = 1;
    const userInfo = {
      name: user.name,
      source: user.source,
      email: user.email
    };
    const token = auth.generateToken(userInfo);
    const authData = {
      user_id: user_id,
      token: token,
      created_at: new Date()
    };
    const authResponse = await knexdb('auth').insert(authData);
    return res.send({
        status: true,
        body:{
          'profile':user,
          'token':token
        }
    });
  } catch (err) {
    common.logdata('login', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function sociallogin(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.body.source || !(req.body.source_id).trim())
      return res.send({
        status: false,
        message: "All fields required."
      });

    const source = req.body.source;
    if(source == 1)
      return res.send({
        status: false,
        message: "Invalid Request."
      });
    const source_id = (req.body.source_id).trim();
    const validateSourceId = await knexdb('users').where('source_id',source_id).where('source',source).count({ rows: 'id'});
    if(validateSourceId && validateSourceId[0].rows == 0)
      return res.send({
        status: false,
        message: "Source id not found.",
        is_registered: 0
      });

    const users = await knexdb('users').select(['id','name','first_name','last_name','email','source','status','image','post_as_anonymous','display_name','view_previous_invoice']).where('source_id',source_id).where('source',source);
    if(!users)
      return res.send({
        status: false,
        message: "Something went wrong."
      });
    const user = users[0];
    if(user.image != "")
      user.image = filepath+user.image;
    const user_id = user.id;
    user.user_id = cryptojs.encryptStr(user_id.toString());
    delete user.id;
    if(user.status !== 1)
      return res.send({
        status: false,
        message: "Your account is currently inactive, please contact admin."
      });
    await knexdb('users').where('id',user_id).update({"last_login":new Date(),"post_as_anonymous":1});
    user.post_as_anonymous = 1;
    const userInfo = {
      name: user.name,
      source: user.source,
      email: user.email
    };
    const token = auth.generateToken(userInfo);
    const authData = {
      user_id: user_id,
      token: token,
      created_at: new Date()
    };
    const authResponse = await knexdb('auth').insert(authData);
    return res.send({
        status: true,
        body:{
          'profile':user,
          'token':token
        },
        is_registered: 1
    });
  } catch (err) {
    common.logdata('createconfession', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function logout(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const response = await common.tokenAuthenticate(knexdb, token);
    if(response)
      await knexdb('auth').where('token',token).delete();
    return res.send({
        status: true,
        message: "Logout successfully."
    });
  } catch (err) {
    common.logdata('login', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function profileData(user_id)
{
  const users = await knexdb('users').select(['name','first_name','last_name','email','source','status','image','post_as_anonymous','display_name','view_previous_invoice']).where('id',user_id);
  if(!users)
    return false;
  const user = users[0];
  if(user.image != "")
      user.image = filepath+user.image;
  return user;
}

async function sendtestemail(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!(req.body.to).trim() || !(req.body.subject).trim() || !(req.body.body).trim())
      return res.send({
        status: false,
        message: "All fields required."
      });
    const to = (req.body.to).trim();
    let body = (req.body.body).trim();
    const subject = (req.body.subject).trim();
    //var template = fs.readFileSync('talkemail/requestemail.html',{encoding:'utf-8'});
    //body = template.replace('[USER_NAME]', 'Ankush')
    const response = await common.sendemail(to, subject, body);
    return res.send({
        status: true,
        message: "Sent"
    });
  } catch (err) {
    common.logdata('sendtestemail', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function sendverifyemail(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });
    const profile = await profileData(user_id);
    if(req.body.email)
    {
      email = (req.body.email).trim();
      let checkuniq = await knexdb('users').where('email','like',email).where('source',profile.source).count({ rows: 'id'});
      if(checkuniq && checkuniq[0].rows > 0)
        return res.send({
          status: false,
          message: "Email id already exists in our database."
        });
      profile.email = email;
    }

    const verifytoken = cryptojs.encryptStr(new Date());
    const usersData = {
      email_verifiy_token:verifytoken
    };
    if(req.body.email)
      usersData.email = email;
    const userResponse = await knexdb('users').where('id',user_id).update(usersData);
    const userIdEncry = cryptojs.encryptStr(user_id.toString());
    const link = `https://thetalkplace.com/verifyemail/${userIdEncry}/${verifytoken}`;
    if(profile.email)
    {
      const template = fs.readFileSync('talkemail/verifyemail.html',{encoding:'utf-8'});
      let body = template.replace('[USER_NAME]', profile.name);
      body = body.replace('[REQUEST_LINK]', link);
      common.sendemail(profile.email,"Verification Email",body);
    }
    return res.send({
      status: true,
      message:'Verify email sent.'
    });
  } catch (err) {
    common.logdata('sendverifyemail', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}
exports.register = register;
exports.sendverifyemail = sendverifyemail;
exports.login = login;
exports.sociallogin = sociallogin;
exports.logout = logout;
exports.sendtestemail = sendtestemail;