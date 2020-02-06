import ImageObject from "../components/ImageObject";

export function image2hex(image: ImageObject): string {

  let data = image.getImageData();
  let imageName = image.getFileName();
  let image_asHex =
    "const unsigned short " +
    imageName.slice(0, imageName.lastIndexOf(".")) +
    "Bitmap[256] __attribute__((aligned(4)))=\n{\n\t";
  let pixelCount = 0;
  for (var i = 0, j = data.length; i < j; i += 4) {
    let bgr = [data[i + 2], data[i + 1], data[i]]; // bgr for little endian
    let hexcode = pixel2hex(bgr);
    image_asHex += hexcode + ",";
    pixelCount++;
    if (pixelCount % 8 === 0 && pixelCount < 256) {
      image_asHex += "\n";
      if (pixelCount % 64 === 0) {
        image_asHex += "\n\t";
      } else {
        image_asHex += "\t";
      }
    }
  }
  return image_asHex + "\n};";
}

function pixel2hex(bgr: number[]): string {
  // convert to 16-bit binary format: 0bbbbbgggggrrrrr
  let binary_value = "0";
  bgr.forEach(element => {
    element = Math.floor((element * 32) / 256);
    let elementString = element.toString(2); // convert to binary
    while (elementString.length < 5) {
      elementString = "0" + elementString;
    }
    binary_value += elementString;
  });
  // convert to hex
  let hex_value = parseInt(binary_value, 2).toString(16);
  while (hex_value.length < 4) {
    hex_value = "0" + hex_value;
  }
  hex_value = hex_value.toUpperCase();
  return "0x" + hex_value;
}

/*
    Eventually need to add palette params to generateHFile and image2hex
    in order to match USENTI's export.

    In order to export both a .h/.c file, I saw that we could zip them.
    There are a few JS things you can do in order to download both but blocking pop-ups doesn't let you

    Also I pixel2hex is returning a bitmap array when a tilemap array is needed
*/


export function generateHFile(img: ImageObject): string {
  let imageName = img.getFileName().slice(0, img.getFileName().lastIndexOf("."));
  let imageArea = img.getDimensions().height * img.getDimensions().width;
  let toReturn = 
      "#ifndef " + imageName.toUpperCase() + "_H\n"
    + "#define " + imageName.toUpperCase() + "_H\n\n"
    + "#define " + imageName + "TilesLen " + imageArea + "\n"
    + "extern const unsigned short " + imageName + "Tiles[" + imageArea/2 + "];\n\n"
    + "#define " + imageName + "PalLen " + "{palette length}" + "\n"
    + "extern const unsigned short " + imageName + "Pal[" + "palette length / 2" + "];\n\n"
    + "#endif";

  return toReturn;
}

export function image2jpg(img: ImageObject): Blob {
  return img.getImageFileBlob();
}

export function image2png(img: ImageObject): Blob {
  return img.getImageFileBlob();
}