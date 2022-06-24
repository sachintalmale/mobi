const router = require("express").Router();

const {validateToken} = require("../helper/validateToken")
const {register } = require("../controller/register");
const {login } = require("../controller/login");
const{
    createFile,
    showFiles,
    deleteFile
} = require("../controller/fileController");
const upload = require('../utils/multer');

router.post('/register',register);
router.post('/login',login);

router.post('/createFile',validateToken,upload.array('image'),createFile)
router.post('/deleteFile',validateToken,deleteFile);
router.get('/showFiles',validateToken,showFiles);

module.exports = router;