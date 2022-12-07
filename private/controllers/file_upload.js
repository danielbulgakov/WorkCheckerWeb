const multer = require('multer')
const path = require("path");
const fs = require("fs")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let upath = path.join(__dirname, "../../docs", req.session.user_id);
        if (!fs.existsSync(upath)){
            fs.mkdir(upath, function(err) {
                if(err) {
                    console.log('[MULTER]', 'Error in folder creation');
                }
                cb(null, upath);
            })
        }
        else {
            cb(null, upath);
        }



        // Uploads is the Upload_folder_name

    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})


const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single("files");

module.exports = {upload}