export default class ImageCompress {
  file: File;
  fileSize: number;
  maxWH: number;

  constructor(file: File, fileSize: number, maxWH: number = 1920) {
    this.file = file;
    this.fileSize = fileSize;
    this.maxWH = maxWH;
  }

  compress(): Promise<File> {
    const fileType = this.file.type;
    const fileSize = this.file.size / 1024;
    return new Promise<File>(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        const canvas = document.createElement("canvas");
        const img = document.createElement("img");
        img.src = reader.result as string;
        img.onload = () => {
          const ctx = canvas.getContext("2d");
          const _dWH = this.dWH(img.width, img.height, this.maxWH);
          canvas.width = _dWH.width;
          canvas.height = _dWH.height;

          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const newImgData = canvas.toDataURL(fileType, 0.9);

          const newImgSize = this.fileSizeKB(newImgData);

          if (newImgSize > fileSize) {
            console.log("图片尺寸太大!" + fileSize + " >> " + newImgSize);
          }

          const blob = this.dataURLtoBlob(newImgData, fileType);
          const nfile = new File([blob], this.file.name, { type: fileType });
          resolve(nfile);
        };
      };
    });
  }

  dWH(
    srcW: number,
    srcH: number,
    dMax: number
  ): { width: number; height: number } {
    const defaults = {
      width: srcW,
      height: srcH
    };
    if (Math.max(srcW, srcH) > dMax) {
      if (srcW > srcH) {
        defaults.width = dMax;
        defaults.height = Math.round(srcH * (dMax / srcW));
        return defaults;
      } else {
        defaults.height = dMax;
        defaults.width = Math.round(srcW * (dMax / srcH));
        return defaults;
      }
    } else {
      return defaults;
    }
  }

  fileSizeKB(dataURL: string): number {
    let sizeKB = 0;
    sizeKB = Math.round((dataURL.split(",")[1].length * 3) / 4 / 1024);
    return sizeKB;
  }

  dataURLtoBlob(dataURL: string, fileType: string): Blob {
    const byteString = atob(dataURL.split(",")[1]);
    let mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    if (fileType) {
      mimeString = fileType;
    }
    return new Blob([ab], { type: mimeString });
  }
}

const path = import.meta.env.VITE_FILE_API;

const getUrl = (url: string | undefined): string | undefined => {
  if (url && url.slice(0, 4) !== "http") {
    if (path === "/") {
      return url;
    }
    if (url.slice(0, 1) === "/") {
      return path + url;
    }
    return path + "/" + url;
  } else {
    return url;
  }
};

const isVideoExt = (url: string): boolean =>
  url.endsWith(".mp4") ||
  url.endsWith(".mov") ||
  url.endsWith(".webm") ||
  url.endsWith(".ogg");

const isVideoMime = (type: string): boolean =>
  type === "video/mp4" || type === "video/webm" || type === "video/ogg";

const isImageMime = (type: string): boolean =>
  type === "image/jpeg" ||
  type === "image/png" ||
  type === "image/webp" ||
  type === "image/svg+xml";

export { getUrl, isVideoExt, isVideoMime, isImageMime };
