const libre = require('libreoffice-convert');
const path = require('path');
const fs = require('fs');


let work, id;

function ConvertToPDF( usr, work, res) {
    console.log("work", work);
    console.log("usr", usr);
    const extend = '.pdf';
    const FilePath = path.join(__dirname, '../../docs', usr, work);
    const FolderPath = path.join(__dirname, '../../public/pdf', usr);
    const outputPath = path.join(__dirname, '../../public/pdf', usr, work + extend);
    if (fs.existsSync(outputPath)) {
        res.sendFile(outputPath);
        return;
    }

    console.log(FilePath, FolderPath, outputPath);

    if (!fs.existsSync(FolderPath)){
        fs.mkdirSync(FolderPath, function(err) {
            if(err) {
                console.log('Error in folder creation');
            }
        })
    }

    if (work.endsWith('.pdf')) {
        res.sendFile(FilePath);
        return;
    }

    const docxBuf = fs.readFileSync(FilePath);
    libre.convert(docxBuf, extend, undefined,function(err,data) {
        if (err) console.log("file error " + err);
        fs.writeFileSync(outputPath, data);
        res.sendFile(outputPath);
    });





}

function FreeCache(){
    let dir = path.join(__dirname, '../../public/pdf');
    if (fs.existsSync(dir)){
        fs.rmSync(dir, { recursive: true })
        fs.mkdirSync(dir)
    }
}



module.exports = {work, id, ConvertToPDF, FreeCache}