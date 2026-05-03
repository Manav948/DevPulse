import { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import api from "../lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload, ZoomIn } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { getCroppedImgBlob } from "../utils/cropImage";

const EditProfileModal = ({ open, setOpen, user, refreshUser }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cropReady, setCropReady] = useState(false);

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const croppedAreaPixelsRef = useRef(null);

  const resetEditorState = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropReady(false);
    croppedAreaPixelsRef.current = null;
  }, []);

  useEffect(() => {
    if (!open) {
      setImageSrc(null);
      resetEditorState();
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    resetEditorState();
    if (user?.profileImage) {
      const base = user.profileImage;
      const url = base.includes("?") ? `${base}&t=${Date.now()}` : `${base}?t=${Date.now()}`;
      setImageSrc(url);
    } else {
      setImageSrc(null);
    }
  }, [open, user?.profileImage, resetEditorState]);

  const onCropAreaChange = useCallback((_, croppedPixels) => {
    croppedAreaPixelsRef.current = croppedPixels;
    if (croppedPixels?.width && croppedPixels?.height) {
      setCropReady(true);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      resetEditorState();
    };
    reader.readAsDataURL(file);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    const pixels = croppedAreaPixelsRef.current;
    if (!imageSrc || !pixels) {
      toast.error("Wait for the image to finish loading, then try again.");
      return;
    }

    try {
      setLoading(true);
      const blob = await getCroppedImgBlob(imageSrc, pixels);

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        toast.error("Upload is not configured (Cloudinary env vars missing).");
        return;
      }

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

      await refreshUser();
      toast.success("Profile picture updated");
      handleClose();
    } catch (error) {
      console.error(error);
      if (error?.message?.includes("canvas") || error?.name === "SecurityError") {
        toast.error("Could not read the image. Try uploading a new photo.");
      } else {
        toast.error("Could not save profile picture");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] sm:p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="pr-10 text-center text-lg font-semibold text-white sm:text-xl">
          Profile photo
        </h2>
        <p className="mt-1 text-center text-sm text-gray-400">
          Your current picture is shown below. Zoom and drag to frame your face, then save.
        </p>

        <div className="mt-5 flex items-center gap-4 rounded-xl border border-white/10 bg-white/4 p-4">
          <UserAvatar key={user?.profileImage} user={user} size="lg" />
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium text-white">
              {user?.name || user?.username || "Your account"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user?.profileImage ? "Adjust crop or upload a new image" : "Add a photo — or we’ll show your initial"}
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {!imageSrc && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-green-500/40 bg-green-500/5 py-8 text-sm font-medium text-green-400 transition hover:border-green-500/60 hover:bg-green-500/10"
          >
            <Upload size={18} />
            Choose an image
          </button>
        )}

        {imageSrc && (
          <>
            <div className="relative mt-4 h-56 w-full overflow-hidden rounded-xl bg-zinc-900 sm:h-64">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropAreaChange={onCropAreaChange}
                onCropComplete={onCropAreaChange}
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <ZoomIn size={16} className="shrink-0 text-gray-500" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-green-500"
              />
              <span className="w-10 shrink-0 text-right text-xs tabular-nums text-gray-400">
                {zoom.toFixed(1)}×
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-white/10"
              >
                Replace image
              </button>
              <button
                type="button"
                disabled={loading || !cropReady}
                onClick={handleSave}
                className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Saving…" : "Save photo"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditProfileModal;
