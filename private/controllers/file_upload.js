var multer = require('multer')
var path = require("path");
var fs = require("fs")


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var upath = path.join(__dirname, "../../docs", req.session.user_id);
        if (!fs.existsSync(upath)){
            fs.mkdir(upath, function(err) {
                if(err) {
                    console.log('Error in folder creation');
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


var upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single("files");

module.exports = {upload}