import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
): Promise<{ url: string; cloudinaryId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
        } else {
          resolve({
            url: result.secure_url,
            cloudinaryId: result.public_id,
          });
        }
      }
    );
    stream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (
  cloudinaryId: string
): Promise<void> => {
  await cloudinary.uploader.destroy(cloudinaryId);
};
