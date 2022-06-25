var mongoose = require("mongoose"),
    User = mongoose.model('User');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
  });
const { v4: uuidv4 } = require('uuid');

const fileUpload = require("../utils/fileUpload");

const deleteImageCloudinary = async (id) => {

    cloudinary.uploader.destroy(id);
};

exports.createFile = async (req, res) => {
    try{
    var uniqueNumber = Math.floor(100000 + Math.random() * 900000);

    const files = req.files;

    console.log(req.files)
    
    let fileData ;
    for (const file of files) {
        const newPath = await fileUpload(file);
        const id = uuidv4();
        console.log(id)
        fileData = {
            id,
            password: uniqueNumber,
            cloudinary_id: newPath.public_id,
            url: newPath.secure_url,
            name:file.originalname
        };
    }

    await User.findOneAndUpdate({username:req.user},{$push:{files:fileData}})

    return res.status(200).json({
        code: 200,
        status: "OK",
        message: "File uploaded successfully",
        data: {
            fileId:fileData.id,
            filePassword:uniqueNumber,
            fileUrl:fileData.url,
            fileName: fileData.name
        },
    });
}catch(err){
    console.log("createFile error: ",err)
    return res.status(500).json({
        code: 500,
        status: "Failed",
        message: "Something wrong",
        data: {},
    });
}
}

exports.deleteFile = async(req,res)=>{
    try{
        const {id} = req.body;
        var fileCheck = false;
        var userData = await User.findOne({username:req.user});
        userData = userData.files;
        for (value of userData){
            if(id == value.id){
                fileCheck=true;
                await deleteImageCloudinary(value.cloudinary_id);

                await User.findOneAndUpdate({username:req.user},{$pull:{files:{id:id}}})
                break;
            }
        }
        if(fileCheck==false){
            return res.status(400).json({
                code: 400,
                status: "Failed",
                message: "file not found",
                data: {},
            });
        }else{
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: "File deleted successfully",
                data: {},
            });
        }
        
    }catch(err){
        console.log("deleteFile error: ",err)
    }
}

exports.showFiles = async(req,res)=>{
    try{
        const userData = await User.findOne({username:req.user});

        const files = userData.files;

        var responseData = [];

        for(data of files){
            var objectData = {
                id:data.id,
                fileName:data.name,
                fileUrl:data.url,
            }
            responseData.push(objectData)
        }

        return res.status(200).json({
            code: 200,
            status: "OK",
            message: "Successful",
            data: responseData,
        });
    }catch(err){
        console.log("showFiles error: ",err);
        return res.status(500).json({
            code: 500,
            status: "Failed",
            message: "Something wrong",
            data: {},
        });
    }
}

exports.download = async(req,res)=>{
    try{
        const {id,password}=req.body;

        if (!id || !password) {

            return res.status(400).json({
                code: 400,
                status: "Failed",
                message: "fill required details",
                data: {},
            });

        }

        
        var checkPassword=false,fileCheck=false;
        var userData = await User.findOne({username:req.user})
        userData = userData.files;
        var response
        for (value of userData){
            if(id == value.id){
                fileCheck=true;
                if(password== value.password){
                 checkPassword = true;
                    response = {
                        fileId : value.id,
                        fileUrl:value.url
                    }
                }
            }
        }
        if(fileCheck==false){
            return res.status(400).json({
                code: 400,
                status: "Failed",
                message: "file not found",
                data: {},
            });
        }else if(checkPassword==false){
            
                return res.status(400).json({
                    code: 400,
                    status: "Failed",
                    message: "Enter correct password",
                    data: {},
                });
            
        }

        return res.status(200).json({
            code: 200,
            status: "OK",
            message: "Successful",
            data: {response}
        });
    }catch(err){
        console.log("download error:",err)
    }
}