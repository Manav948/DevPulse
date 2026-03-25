import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import api from "../lib/axios";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfileModal = ({ open, setOpen, user, refreshUser }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result);
    };
  };

  // Helper: convert base64 data URL → Blob
  const dataURLtoBlob = (dataURL) => {
    const [header, data] = dataURL.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    return new Blob([arr], { type: mime });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary credentials are not configured in .env");
      }
      const blob = dataURLtoBlob(imageSrc);
      const formData = new FormData();
      formData.append("file", blob, "avatar.jpg");
      formData.append("upload_preset", uploadPreset);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const imageUrl = uploadRes.data.secure_url;
      await api.put("/api/v1/users/profile", {
        profileImage: imageUrl,
      });

      refreshUser();
      setOpen(false);
      setImageSrc(null);
      toast.success("Profile update successfully")
    } catch (error) {
      console.error("Profile save failed:", error.message || error);
      toast.error("Profile not update successfully")
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-black border border-white/10 p-6 rounded-xl w-full max-w-md">

        <h2 className="text-xl mb-4 text-white">
          Edit Profile Picture
        </h2>

        {!imageSrc && (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}

        {imageSrc && (
          <div className="relative w-full h-64">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {imageSrc && (
          <button
            onClick={handleSave}
            className="bg-green-500 w-full mt-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditProfileModal;