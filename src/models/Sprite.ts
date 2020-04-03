import { PALETTE_SIZE } from "../util/consts";
import {
  Dimensions,
  Drawable,
  ImageCoordinates,
  SpriteDimensions
} from "../util/types";
import ImageCanvas from "./ImageCanvas";
import Palette from "./Palette";
import Color from "./Color";

interface ISprite extends Drawable {
  dimensions: SpriteDimensions; // In pixels
  position: ImageCoordinates; // In tiles
  paletteRow: number;
}

export default class Sprite implements ISprite, Drawable {
  private _data: Uint8ClampedArray;
  private _dimensions: SpriteDimensions;
  private _position: ImageCoordinates;
  private _palette: Palette;
  private _paletteRow: number;
  private _imageCanvas: ImageCanvas;

  constructor(
    position: ImageCoordinates,
    dimensions: SpriteDimensions,
    palette: Palette,
    paletteRow: number
  ) {
    this._dimensions = dimensions;
    this._position = position;
    this._palette = palette;
    this._paletteRow = paletteRow;
    this._data = new Uint8ClampedArray(dimensions.height * dimensions.width);
    this._imageCanvas = new ImageCanvas(this);
  }

  public setPixelColorAt(pos: ImageCoordinates, col: number) {
    if (pos.x >= this._dimensions.width || pos.y >= this._dimensions.height) {
      console.error("Sprite: tried to set pixel color outside image bounds.");
      console.error(
        "Sprite dimensions:",
        this._dimensions,
        "Attempted to set color at coordinates:",
        pos
      );
    } else if (col < 0 || col > 0xf) {
      console.error(
        "Sprite: tried to set pixel color outside palette bounds:",
        col
      );
      return;
    }
    this._data[offset(this._dimensions, pos)] = col;
  }

  public getPixelColorAt(pos: ImageCoordinates) {
    const col = this._data[offset(this._dimensions, pos)];
    return this._palette[offset(PALETTE_SIZE, { x: col, y: this._paletteRow })];
  }

  public get position() {
    return this._position;
  }

  public get dimensions() {
    return this._dimensions;
  }

  // returns array of 8x8 pixel times
  public get tiles() {
    let tileArr: Color[][][] = [];

    let tileStartRow = 0;
    let tileStartCol = 0;
    let tile: Color[][] = [];

    //get the number of tiles needed to represent this sprite
    // # pixels in image / # pixles in sprite
    let numberTiles = 
      (this.dimensions.height * this.dimensions.width) / (8*8)

    while (tileArr.length < numberTiles) 
    {
      for (let i = tileStartRow; i % 8 != 0 && i != tileStartRow; i++) {
        for (let j = tileStartCol; j % 8 != 0 && j != tileStartCol; j++) {
          let pos: ImageCoordinates = {
            x: i,
            y: j
          }
          tile[i - tileStartRow][j - tileStartCol] = this.getPixelColorAt(pos);
        }
      }
      tileArr.push(tile);

      (tileStartCol + 8 >= this.dimensions.width) ? tileStartCol = 0 : tileStartCol += 8;
      (tileStartRow + 8 >= this.dimensions.height) ? tileStartRow = 0 : tileStartCol += 8;
    }

    return tileArr;
  }

  public set dimensions(newDimensions: SpriteDimensions) {
    console.warn("Sprite: Setting sprite dimensions not yet implemented.");
    // Make sure we properly resize the sprite data, as the Uint8ClampedArray
    // is flattened
  }

  public get paletteRow() {
    return this._paletteRow;
  }

  public set paletteRow(newPaletteRow: number) {
    if (newPaletteRow < 0 || newPaletteRow > 0xf) {
      console.error(
        "Sprite: tried to set palette row outside bounds: ",
        newPaletteRow
      );
    } else {
      this._paletteRow = newPaletteRow;
    }
  }

  public get imageCanvasElement() {
    return this._imageCanvas.imageCanvasElement;
  }

  public get pixelGridCanvasElement() {
    return this._imageCanvas.pixelGridCanvasElement;
  }
}

function offset({ width }: Dimensions, { x, y }: ImageCoordinates) {
  return width * y + x;
}
