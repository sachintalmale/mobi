const jwt = require("jsonwebtoken");
const options = {
    expiresIn : "1h"
}
exports.generateToken = async (username, userId) => {
    try {
        const payload = { username, id: userId };
        const token = await jwt.sign(payload, process.env.JWT_SECRET, options);
        return { error: false, token: token };
    } catch (error) {
        console.log(error, 'error')
        return { error: true };
    }
}