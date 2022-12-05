const libre = require('libreoffice-convert');
const path = require('path');
const fs = require('fs');


var work, id;

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
        fs.copyFile(FilePath, outputPath, (err) => {
            if (err) throw err;
            console.log('File was copied to destination');
        });
        res.sendFile(outputPath);
        return;
    }

    const docxBuf = fs.readFileSync(FilePath);
    const pdfBuf = libre.convert(docxBuf, extend, undefined,function(err,data) {
        if (err) console.log("file error " + err);
        fs.writeFileSync(outputPath, data);
        res.sendFile(outputPath);
        return;
    });





}

function FreeCache(){
    var dir = path.join(__dirname, '../../public/pdf');
    if (fs.existsSync(dir)){
        fs.rmSync(dir, { recursive: true })
        fs.mkdirSync(dir)
    }
}



module.exports = {work, id, ConvertToPDF, FreeCache}