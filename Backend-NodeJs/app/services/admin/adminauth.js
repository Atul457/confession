const knex = require("../../config/db.js");
const knexdb =knex.knex;
const bcrypt = require('bcryptjs');
const auth = require('../../../utils/auth');
const common = require('../common.js')
async function login(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }
    if(!(req.body.email).trim() || !(req.body.password).trim())
      return res.send({
        status: false,
        message: "All fields required."
      });

    const email = (req.body.email).trim();
    const password = (req.body.password).trim();
    const validateEmail = await knexdb('admin_users').where('email','like',email).count({ rows: 'id'});
    if(validateEmail && validateEmail[0].rows == 0)
      return res.send({
        status: false,
        message: "Email id not found."
      });

    const users = await knexdb('admin_users').select(['id','first_name','last_name','email','status','password']).where('email',email);
    if(!users)
      return res.send({
        status: false,
        message: "User not found."
      });
    const user = users[0];
    const user_id = user.id;
    if(user.status === 0)
      return res.send({
        status: false,
        message: "Your account inactive. Please contact with support."
      });
    if(!bcrypt.compareSync(password,user.password))
      return res.send({
        status: false,
        message: "Invalid user. Please enter the valid details."
      });
    delete user.password;
    delete user.id;

    const userInfo = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
    };
    const token = auth.generateToken(userInfo);

    const authData = {
      user_id: user_id,
      token: token,
      created_at: new Date()
    };
    const authResponse = await knexdb('admin_auth').insert(authData);
    return res.send({
        status: true,
        body:{
          'profile':user,
          'token':token
        }
    });
  } catch (err) {
    //err.message
    common.logdata('login', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function register(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!(req.body.first_name).trim() || !(req.body.last_name).trim() || !(req.body.email).trim() || !(req.body.password).trim())
      return res.send({
        status: false,
        message: "All fields required."
      });

    const first_name = (req.body.first_name).trim();
    const last_name = (req.body.last_name).trim();
    const email = (req.body.email).trim();
    let password = (req.body.password).trim();
    password = await bcrypt.hashSync(password,10)
    let checkuniq = await knexdb('admin_users').where('email','like',email).count({ rows: 'id'});
    if(checkuniq && checkuniq[0].rows > 0)
      return res.send({
        status: false,
        message: "Email id already exists in our database."
      });

    // Create a Confession
    const usersData = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      created_at: new Date(),
      updated_at: new Date()
    };

    const userResponse = await knexdb('admin_users').insert(usersData);
    if(!userResponse)
      return res.send({
        status: false,
        message:'Network connection error.'
      });
    return res.send({
      status: true,
      message:'User has been register successfully.'
    });
  } catch (err) {
    //err.message
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function profileData(user_id)
{
  const users = await knexdb('admin_users').select(['name','email','status']).where('id',user_id);
  if(!users)
    return false;
  const user = users[0];
  return user;
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
    const response = await common.adminTokenAuthenticate(knexdb, token);
    if(response)
      await knexdb('admin_auth').where('token',token).delete();
    return res.send({
      status: true,
      message: "Logout successfully."
    });
  } catch (err) {
    //err.message
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function updatepassword(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !req.body.password || !req.body.old_password)
      return res.send({
        status: false,
        message: "All fields required."
      });

    const token = req.headers.token;
    const admin_id = await common.adminTokenAuthenticate(knexdb, token);
    if(!admin_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });
    const updateData = {};
    const oldpassword = (req.body.old_password).trim();
    const chkusers = await knexdb('admin_users').select(['password']).where('id',admin_id);
    if(!chkusers)
      return res.send({
        status: false,
        message: "A user with this email address not found."
      });
    const chkuser = chkusers[0];
    if(!bcrypt.compareSync(oldpassword,chkuser.password))
      return res.send({
        status: false,
        message: "Old password not match."
      });
    const password = (req.body.password).trim();
    updateData.password = await bcrypt.hashSync(password,10);
    updateData.updated_at = new Date();
    await knexdb("admin_users").where('id',admin_id).update(updateData);
    return res.send({
        status: true,
        message: "Password has been changed"
    });
  } catch (err) {
    console.log(err);
    common.logdata('updatepassword', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}
exports.login = login;
exports.register = register;
exports.logout = logout;
exports.updatepassword = updatepassword;