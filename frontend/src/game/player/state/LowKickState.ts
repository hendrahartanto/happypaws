import Player from "../Player";
import lowKickSprites from "../animation/blastImpulseSprites/lowKickSpritePaths";
import PlayerState from "./PlayerState";

class LowKickState implements PlayerState {
  update(player: Player, ctx: CanvasRenderingContext2D): void {
    player.frameCount++;
    if (player.isMirrored) {
      player.currAnimation = player.mLowKickAnimation;
    } else {
      player.currAnimation = player.lowKickAnimation;
    }
    if (player.frameCount >= 10) {
      player.atkFrame++;
      player.frameCount = 0;
    }
    player.drawFrame(ctx);
    if (player.atkFrame == lowKickSprites.length) {
      player.startIdling();
      player.atkFrame = 0;
    }
  }
}

export default LowKickState;
