import multer from "multer";
// we are going to use diskstorage , there is an option available for memory storage
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        // cb stands for callback
        cb(null,"/public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
})
export const upload = multer({ 
    storage, 
})