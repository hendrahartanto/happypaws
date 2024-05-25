abstract class Animations {
  public sprites: HTMLImageElement[];
  public totalFrames: number;
  public currFrame: number;
  public frameCount: number;
  public frameInterval: number;

  constructor(paths: string[], totalFrames: number, frameInterval: number) {
    this.sprites = [];
    paths.forEach((path) => {
      var sprite = new Image();
      sprite.src = path;
      this.sprites.push(sprite);
    });
    this.totalFrames = totalFrames;
    this.currFrame = 0;
    this.frameCount = 0;
    this.frameInterval = frameInterval;
  }

  public updateFrame(): void {
    this.frameCount++;

    if (this.frameCount >= this.frameInterval) {
      this.frameCount = 0;
      this.currFrame = (this.currFrame + 1) % this.totalFrames;
    }
  }

  drawFrame(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.drawImage(this.sprites[this.currFrame], x, y, 230, 230);
    this.updateFrame();
  }

  // abstract update(): void;
}

export default Animations;
