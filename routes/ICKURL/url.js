const express = require("express");
const router = express.Router();

const { URL } = require('../../models/ICKURL/URL')
 
router.get("/", async(req, res) =>{
    try{
        const data = await URL.find({});
        res.status(200).json({status:'ok', message:'All url that available', data:data});
    }catch(e){
        res.status(500).json({status:'err', messsage:'Internal err', err:e});
    }
});



router.get("/:url", async(req, res) =>{
    try{
        const shorten_url = req.params.url;
        const data = await URL.findOne({shorten_url});
        if(!data) return res.status(404).json({status:'err', message:`${shorten_url} not found`}); 
        res.status(200).json({status:'ok', message:'URL Founded!', data:data});
    }catch(e){
        res.status(500).json({status:'err', messsage:'Internal err', err:e});
    }
})

router.get("/owner/:owner", async(req, res) =>{
    try{
        const owner = req.params.owner;
        const data = await URL.find({owner});
        if(!data || data.length < 1) return res.status(404).json({status:'err', message:`${owner} not have any url`}); 
        res.status(200).json({status:'ok', message:'URL Founded!', data:data});
    }catch(e){
        res.status(500).json({status:'err', messsage:'Internal err', err:e});
    }
})

router.post("/", async(req, res) => {
    try{
        const { original_url, shorten_url, owner, title, desc, img} = req.body;
        const existingURL = await URL.findOne({ shorten_url });
        if (existingURL) {
            res.json({ status: "err", message:  `${shorten_url} : Already Exists` });
            return;
        }
        if(!img.startsWith('http')){
            return res.json({status:'err', message:'Image must be a URL!!'})
        }
        const newURL = new URL({
            original_url,
            shorten_url,
            owner,
            title,
            desc,
            img
        });
        await newURL.save();
        console.log(`URL ${shorten_url} saved!`);
        res.status(200).json({status:'ok', message:`${shorten_url} Added!`});
    }catch(e){
        res.status(500).json({status:'err', messsage:'Internal err', err:e});
    }
});

router.delete("/:url", async(req, res) => {
    try{
        const shorten_url = req.params.url;
        const existingURL = await URL.findOne({shorten_url});
        if (!existingURL) {
            res.json({ status: "err", message:  `${shorten_url} : not exists!` });
            return;
        }
        const deleted = await URL.deleteOne({shorten_url});
        console.log(`URL ${shorten_url} deleted!`);
        res.status(200).json({status:'ok', message:`${shorten_url} Deleted!`, action:deleted, data:existingURL});
    }catch(e){
        res.status(500).json({status:'err', messsage:'Internal err', err:e});
    }
});

router.patch("/", async(req, res) => {
    try{
        const shorten_url = req.body.shorten_url;
        const existingURL = await URL.findOne({shorten_url});
        const data = req.body;
        if (!existingURL) {
            res.json({ status: "err", message:  `${shorten_url} : not exists!` });
            return;
        }
        const edit = await URL.findOneAndUpdate({shorten_url}, data, {new:true});
        const updateData = await URL.findOne({shorten_url});
        console.log(`URL ${shorten_url} updated!`);
        res.status(200).json({status:'ok', message:`${shorten_url} Updated!`, action:edit});
    }catch(e){
        res.status(500).json({status:'err', messsage:'Internal err', err:e});
    }
});

//console.log(router.stack.map(r => r.route));

module.exports = router;