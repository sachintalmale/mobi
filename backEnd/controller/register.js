var mongoose = require("mongoose"),
    User = mongoose.model('User');
const {generateToken}=require("../helper/generateToken")

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {

            return res.status(400).json({
                code: 400,
                status: "Failed",
                message: "fill required details",
                data: {},
            });

        }

        const userData = await User.findOne({username});

        if(userData){
            return res.status(400).json({
                code: 400,
                status: "Failed",
                message: "Username already taken",
                data: {},
            });
        }

        var hashPassword = await User.hashPassword(password);

        await User.create({username,password:hashPassword});

        return res.status(200).json({
            code: 200,
            status: "OK",
            message: "User created successfully",
            data: {},
        });


    } catch (err) {
        console.log("register error ", err)
    }
}