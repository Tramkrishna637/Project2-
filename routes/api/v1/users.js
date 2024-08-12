const express=require('express');
const router=express.Router();
const postApi=require('../../../controller/api/v1/users_api');

router.post('/createSession',postApi.createSession);
module.exports=router;