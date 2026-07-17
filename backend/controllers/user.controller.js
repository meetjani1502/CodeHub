const getProfile = async(req,res)=>{


    res.status(200).json({

        success:true,
        message:"Profile Data",

        user:req.user

    });


};


module.exports={
    getProfile
};