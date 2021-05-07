const { json } = require('body-parser');
const fs=require('fs');
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
            console.log('body details>>>>',req.body);
            
            let avatar = req.files.avatar;
            avatar.mv('./uploads/' + avatar.name);
            const sastService=new SastService();
            let response=await sastService.main(avatar.name);
            
            const dir = 'uploads';
            fs.rmdir(dir, { recursive: true }, (err) => {
                if (err) {
                    throw err;
                }
            
                console.log(`${dir} is deleted!`);
            });
            
           
            res.send(response);
        }
   
});


module.exports=router;

