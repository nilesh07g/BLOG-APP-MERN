//these are middlewares so take 3 things as parameeters
const isAdmin = (req, res, next) => {
    if(req.role!=='admin'){
        return res.status(403).send({success:false, message:"You are not allowed to perform this action .Login as admin"});
    }else{
        next(); }
};

module.exports = isAdmin;