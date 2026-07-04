import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
// fs stand for file system, it comes with node js 

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null

        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        // to delete file from the server we are going to use unlinkSync
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async(cloudinaryUrl)=>{
    try{
        if(!cloudinaryUrl) return null

        // hum split function ko use krege cloudinary ke url se publicID nikalne ke liye
        // first step is to cloudinary ke url ko split krna by /
        // this will give the publicId of the image with extension
        const publicIdWithExtension = cloudinaryUrl.split("/").pop()

        // now remove yhe .jpg .jpeg .png extension from the above using the split function
        // isse humko id miljaayegi
        const publicId = publicIdWithExtension.split(".")[0]

        const response = await cloudinary.uploader.destroy(publicId)
        if(response?.result !== "ok"){
        throw new ApiError(500, "Failed to delete image")
}
        console.log("Deleted from Cloudinary:", response);
        return response
    }catch(error){
        console.error("Error while deleting the file from cloudinary")
        return null
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}
   