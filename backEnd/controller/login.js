var mongoose = require("mongoose"),
    User = mongoose.model('User');

const {generateToken} = require("../helper/generateToken")

exports.login = async (req, res) => {
    try {
        var { username, password } = req.body;

        //Throwing error for mandatory fields
        if (!username || !password) {

            return res.status(400).json({
                statuscode: 400,
                status: "Failed",
                message: "fill required details",
                data: {},
            });

        }

        username = username.toLowerCase();

        //Username exists or  not
        const userData = await User.findOne({username});

        if (!userData) {
            return res.status(400).json({
                statuscode: 400,
                status: "Failed",
                message: "User not found",
                data: {},
            });
        }

        //password validation
        var isValid = await User.comparePasswords(password, userData.password);

        if (!isValid) {
            return res.status(401).json({
                statuscode: 401,
                status: "Failed",
                message: "Invalid Credentials",
                data: {},
            });
        }

        //Generate token
        var {error,token} = await generateToken(username, userData._id)

        if (error) {
            return res.status(501).json({
                statuscode: 501,
                status: "Error",
                message: "Couldn't create access token. Please try again later",
                data: {},
            });
        }

        return res.status(200).json({
            statuscode: 200,
            status: "OK",
            message: "login successfully",
            data: {token},
        });


    } catch (err) {
        console.log("register error ", err)
    }
}