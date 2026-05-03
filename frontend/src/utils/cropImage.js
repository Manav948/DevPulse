/**
 * Load an image for canvas (CORS-safe for remote URLs when server allows it).
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    if (!src.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }
    img.src = src;
  });
}

/**
 * Crop source image to the rectangle returned by react-easy-crop's croppedAreaPixels.
 */
export async function getCroppedImgBlob(imageSrc, pixelCrop, quality = 0.92) {
  if (!pixelCrop?.width || !pixelCrop?.height) {
    throw new Error("Invalid crop area");
  }

  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const { x, y, width, height } = pixelCrop;

  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  ctx.drawImage(
    image,
    x,
    y,
    width,
    height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not export cropped image"));
      },
      "image/jpeg",
      quality
    );
  });
}
