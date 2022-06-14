const fs = require('fs');
const path = require('path');

let types ={ media:['mp4','mkv','mp3'],
            archives:['zip','7z','rar','tar','gz','ar','iso'],
            documents : ['docx','doc','pdf','xlsx','xls'],
            app : ['exe','dmg','msi','pkg'],
            images: ['jpg','png']
}

function organizeFn(dirPath){
    if(dirPath == undefined){
        console.log("Please enter a directory path");
        return;
    }else {
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            destPath = path.join(dirPath,'organized_files');

            if(fs.existsSync(destPath) == false){
                fs.mkdirSync(destPath);
            }else {
                console.log('the folder already exist');
            }
            organizeHelper(dirPath,destPath);
        }else {
            console.log("path does not exist");
        }

    }

}

function organizeHelper(src,dest){
    let childNames= fs.readdirSync(src);
    

    for(let i =0;i<childNames.length;i++){
        let childAddress = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();

        if(isFile){
            let fileCategory = getCategory(childNames[i]);

            console.log(childNames[i] +" belong to "+ fileCategory);
            sendFiles(childAddress,dest,fileCategory);

            
        }
    }
}

function getCategory(Name){
    let ext = path.extname(Name);

    ext = ext.slice(1);

    for(let type in types){
        let cTypeArr = types[type];
    for(let i =0;i<cTypeArr.length;i++){
        if(ext == cTypeArr[i]) return  type;
    }   
}
    return "others";
}

function sendFiles(srcFilePath,dest,fileCategory){
    let catPath = path.join(dest,fileCategory);
    if(fs.existsSync(catPath) == false){
        fs.mkdirSync(catPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(catPath,fileName);

    fs.copyFileSync(srcFilePath,destFilePath);

    // console.log
    fs.unlinkSync(srcFilePath);

}

module.exports= {
    organizeFnKey : organizeFn
}