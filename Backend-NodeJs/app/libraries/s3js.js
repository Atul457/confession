const AWS = require("aws-sdk");
const fs = require("fs");
const dotenv = require('dotenv');
dotenv.config();
AWS.config.update({
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET
});

// Create an S3 client setting the Endpoint to DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({endpoint: spacesEndpoint});
async function uploadFile(folder, buf, filename, type)
{
  try {
    const param = {Bucket: process.env.DO_SPACES_NAME, Key: `${folder}/${filename}`, Body: buf, ACL: "public-read",ContentType: 'image/'+type};
    return await s3.upload(param, {
      partSize: 10 * 1024 * 1024,
      queueSize: 10,
    }).send((err, data) => {
      //return data.key;
    });
  } catch (err) {
    return err.message;
  }
}

exports.uploadFile = uploadFile;