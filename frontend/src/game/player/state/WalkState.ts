import Player from "../Player";
import PlayerState from "./PlayerState";

class WalkState implements PlayerState {
  public dir: number;

  constructor(dir: number) {
    this.dir = dir;
  }

  update(player: Player, ctx: CanvasRenderingContext2D): void {
    if (!player.isMirrored) {
      if (this.dir == 1) {
        player.currAnimation = player.walkForwardAnimation;
      } else if (this.dir == 2) {
        player.currAnimation = player.walkForwardAnimation;
      } else if (this.dir == -2) {
        player.currAnimation = player.mwalkForwardAnimation;
      } else {
        player.currAnimation = player.walkBackwardAnimation;
      }
    } else {
      if (this.dir == -1) {
        player.currAnimation = player.mwalkForwardAnimation;
      } else if (this.dir == -2) {
        player.currAnimation = player.mwalkForwardAnimation;
      } else if (this.dir == 2) {
        player.currAnimation = player.mwalkForwardAnimation;
      } else {
        player.currAnimation = player.mWalkBackwardAnimation;
      }
    }
    player.drawFrame(ctx);
  }
}

export default WalkState;
