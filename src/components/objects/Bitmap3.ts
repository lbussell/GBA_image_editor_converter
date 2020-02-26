import {
  Color,
  Dimensions,
  ImageCoordinates,
  ImageInterface
} from "../../lib/interfaces";
import {
  generateHeaderString, generateCSourceFileString
} from "../../lib/exportUtils";
import * as Loader from "../../lib/imageLoadUtils";
import Bitmap from "./Bitmap";
import ImageCanvas from "./ImageCanvas";

export default class Bitmap3 extends Bitmap {

  constructor(
    fileName: string,
    dimensions: Dimensions,
    imageData?: Uint8ClampedArray
  ) {
    super(fileName, dimensions, imageData);

    this.imageCanvas.drawImageToHiddenCanvas(this);
  }

  public getCSourceData(): string {
    return generateCSourceFileString(this, 3);
  }

  public getHeaderData(): string {
    return generateHeaderString(
      { fileName: this.fileName, imageDimensions: this.dimensions },
      3
    );
  }

  public getPixelColorAt(pos: ImageCoordinates): Color {
    return {
      r: this.imageData[Loader.offset(pos, this.dimensions)],
      b: this.imageData[Loader.offset(pos, this.dimensions) + 2],
      g: this.imageData[Loader.offset(pos, this.dimensions) + 1],
      a: this.imageData[Loader.offset(pos, this.dimensions) + 3]
    };
  }

  public setPixelColor(
    pos: ImageCoordinates,
    paletteIndex?: number,
    color?: Color
  ): ImageInterface {
    console.warn(
      "Method setPixelColor in ImageObject not implemented yet. " +
      "Returning the current image."
    );
    return this;
  }
}
