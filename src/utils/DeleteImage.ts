import * as fs from "fs";
import path from "path";

function deleteImage(name:string|undefined,cb:Function){
    const imagePath = path.join(__dirname,"../../uploads/"+name);
   fs.unlink(imagePath,(err)=>{
    if(err) {
        cb(new Error("Something went wrong while deleting image"));
        return;
    }
    cb(null);
   })
}


export default deleteImage;