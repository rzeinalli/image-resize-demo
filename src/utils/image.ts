import Pica from "pica";

interface LoadedImage {
  image: HTMLImageElement;
  width: number;
  height: number;
}

const hasCanvasSupport = typeof HTMLCanvasElement !== "undefined";
const hasReaderSupport = typeof FileReader !== "undefined";

/**
 * @param file <File> Form-data value from file input.
 * @param size <number> Max width for image frame. e.g. 1284px.
 * @returns Promise<File>
 */
const loadImage = (file: File, size: number): Promise<LoadedImage> => {
  if (!("File" in window && file instanceof File)) {
    return Promise.reject(new Error("Provided value is not File"));
  }

  return new Promise<LoadedImage>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onerror = (err) => reject(err);
    image.onload = (e) => {
      const { width, height } = e.target as HTMLImageElement;
      const resizeWidth = size;
      const resizeHeight = (resizeWidth * height) / width;
      resolve({
        image,
        width: resizeWidth,
        height: resizeHeight
      });
    };

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = () => {
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * @param file <File> which is form-data from file input.
 * @param size <number> which is max width for canvas as image frame. e.g. 1284px.
 * @returns Promise<string> - returns image source as base64.
 */
export const getResizedImage = (file: File, size: number): Promise<string> => {
  // Early exit - not supported by browser
  if (!hasCanvasSupport && !hasReaderSupport) {
    return Promise.reject(
      new Error("Browser doesn't have support for Canvas or FileReader")
    );
  }

  // Early exit - not compatible file type
  if (!file?.type?.match(/image.*/) || file?.type?.match(/image\/gif/)) {
    return Promise.reject(
      new Error("Provided value is not supported file type")
    );
  }

  // Any kind of image proccessing (e.g. resize) needs to happen after image is "loaded".
  return loadImage(file, size).then(({ image, width, height }) => {
    // Initializing Pica object
    const pica = new Pica();

    // Creating canvas for image frame.
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    return pica
      .resize(image, canvas)
      .then((result) => result.toDataURL("image/png").split(";base64,")[1]);
  });
};
