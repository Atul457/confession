const util = require('../../../utils/util');
const knex = require("../../config/db.js");
const common = require('../common.js');
const knexdb =knex.knex;

// Create and Save a new Category
async function createcategory(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !(req.body.category_name).trim() || !req.body.status)
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

    const category_name = (req.body.category_name).trim();
    const status = req.body.status;

    let checkuniq;
    if(!req.body.category_id || req.body.category_id === "" || !req.body.category_id === "0")
      checkuniq = await knexdb('categories').where('category_name','like',category_name).count({ rows: 'id'});
    else
      checkuniq = await knexdb('categories').where('id','!=',req.body.category_id).where('category_name','like',category_name).count({ rows: 'id'});
    if(checkuniq && checkuniq[0].rows > 0)
      return res.send({
        status: false,
        message: "Category name already exixts in database."
      });

    // Create a Confession
    const category = {
      category_name: category_name,
      status: status,
      created_by: admin_id,
      updated_at: new Date()
    };

    let categoryResponse;
    let category_id = req.body.category_id;
    let msg = 'Category has been updated successfully.';
    if(!req.body.category_id || req.body.category_id === "" || !req.body.category_id === "0")
    {
      category.created_at = new Date();
      category.created_by = admin_id;
      categoryResponse = await knexdb('categories').insert(category);
      category_id = categoryResponse[0];
      let msg = 'Category has been created successfully.';
    } else categoryResponse = await knexdb('categories').where('id',category_id).update(category);
    if(!categoryResponse)
      return res.send({
          status: false,
          message:'Network connection error.'
      });
    const categoryData = await knexdb("categories").select(['id','category_name','status']).where('id',category_id);
    return res.send({
        status: true,
        message:msg,
        category: categoryData
    });
  } catch (err) {
    common.logdata('createcategory', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function getcategories(req, res)
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
    if(!response)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });

    const categories = await knexdb('categories').select(['id','category_name','status']);
    if(!categories)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    
    return res.send({
        status: true,
        categories:categories
    });
  } catch (err) {
    common.logdata('getcategories', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function deletecategory(req, res)
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
    const admin_id = await common.adminTokenAuthenticate(knexdb, token);
    if(!admin_id)
      return res.send({
        status: false,
        message: "Token not found in our database."
      });
    const category_id = req.params.id;
    let category = await knexdb('categories').where('id','=',category_id).count({ rows: 'id'});
    if(!category || category[0].rows == 0)
      return res.send({
        status: false,
        message: "Category not found."
      });
    
    let confession_thoughts = await knexdb('confession_thoughts').where('category_id','=',category_id).count({ rows: 'id'});
    if(confession_thoughts[0].rows > 0)
      return res.send({
        status: false,
        message: "The category cannot be deleted as confession is assigned to a category."
      });
    await knexdb('categories').where('id', category_id).delete()
    return res.send({
      status: true,
      message: "Category deleted"
    });
  } catch (err) {
    common.logdata('getcategories', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}
exports.createcategory = createcategory;
exports.getcategories = getcategories;
exports.deletecategory = deletecategory;