const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const RallyService=require('../service/rallyService');
const SastService=require('../service/sastService');
router.post('/upload-avatar', async (req, res) => {
   
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            console.log('file details',req.files);
            let avatar = req.files.avatar;
            avatar.mv('./uploads/' + avatar.name);
            const sastService=new SastService();
            let response=sastService.main(avatar.name);
           
            res.send(response);
        }
   
});


module.exports=router;

