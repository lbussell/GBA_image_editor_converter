import {
  Color,
  Dimensions,
  ImageCoordinates,
  ImageInterface
} from "../../lib/interfaces";
import {
  generateHeaderString, generateCSourceFileString
} from "../../lib/exportUtils";
import Palette from "./Palette";
import Bitmap from "./Bitmap";
import ImageCanvas from "./ImageCanvas";

export default class Bitmap4 extends Bitmap {
  private data: number[];
  private palette: Palette;

  constructor(
    fileName: string,
    dimensions: Dimensions,
    indexArray: number[],
    palette: Palette
  ) {
    super(fileName, dimensions);
    this.data = indexArray;
    this.palette = palette;

    this.imageCanvas.drawImageToHiddenCanvas(this);
  }

  public getCSourceData(): string {
    return generateCSourceFileString(this, 4, this.palette);
  }

  public getHeaderData(): string {
    return generateHeaderString(
      {
        fileName: this.fileName,
        imageDimensions: this.dimensions,
        palette: this.palette
      },
      4
    );
  }

  /**
   * Returns the color at the specified index in the image by indexing into the
   * color palette
   * @param ImageCoordinates the index in the Sprite that you would like to get
   *    the color at
   */
  public getPixelColorAt(pos: ImageCoordinates): Color {
    if (pos.x >= this.dimensions.width || pos.y >= this.dimensions.height) {
      console.error(
        "Tried to access pixel at",
        pos,
        "but dimensions of sprite are",
        this.dimensions
      );
    }
    return this.palette.getColorAt(
      this.data[this.dimensions.width * pos.y + pos.x]
    );
  }

  public setPixelColor({ x, y }: ImageCoordinates): ImageInterface {
    console.warn(
      "Setting pixel colors not implemented yet! Returning unchanged image."
    );
    return this;
  }
}
