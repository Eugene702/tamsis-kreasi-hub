import ImageTool from "@editorjs/image";
import { UploadApiResponse } from "cloudinary";
import { deleteImage } from "../cloudinary";

class CustomImageTools extends ImageTool{
    async removed(){
        const data = (this as unknown as { _data: { file: { data: UploadApiResponse } } })._data.file.data
        await deleteImage(data)
    }
}

export default CustomImageTools