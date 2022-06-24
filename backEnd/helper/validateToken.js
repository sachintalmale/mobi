const jwt = require("jsonwebtoken");
var mongoose = require("mongoose"),
    User = mongoose.model('User');

exports.validateToken = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    let result;
    if (!authorizationHeader)
        return res.status(401).json({
            code: 401,
            status: "Failed",
            message: "Access token is missing",
            data: {}
        });
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    const options = {
        expiresIn: "1h",
    };
    try {

        result = jwt.verify(token, process.env.JWT_SECRET, options);
        //console.log(result)
        let user = await User.findOne({
            username: result.username,
        });
        if (!user) {
            result = {
                code: 401,
                status: "Not Found",
                message: `Invalid token`,
                data: {}
            };
            return res.status(401).json(result);
        }

        req.user = result.username;
        next();
    } catch (err) {
        console.error(err);
        if (err.name === "TokenExpiredError") {
            result = {
                code: 400,
                status: "Not Found",
                message: `TokenExpired`,
                data: {}
            };
        } else {
            result = {
                code: 401,
                status: "Failed",
                message: `Authentication error`,
                data: {}
            };
        }
        return res.status(404).json(result);
    }
}