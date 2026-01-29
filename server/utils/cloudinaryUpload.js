import { v2 as cloudinary } from 'cloudinary'
/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath, folder) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: `${folder}`
    };

    try {
        // Upload the image
        const res = await cloudinary.uploader.upload(imagePath, options);
        // console.log(res);
        return res
        //   return result.public_id;
    } catch (error) {
        console.error(error);
    }
};
export default uploadImage; 