const { promises } = require("nodemailer/lib/xoauth2")

module.exports = (theFunc)=> (req, res, next)=>{
    promise.resolve(theFunc(req, res, next)).catch(next);
}