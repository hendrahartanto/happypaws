import Player from "../Player";
import fronKickSprites from "../animation/blastImpulseSprites/frontKickSpritePaths";
import PlayerState from "./PlayerState";

class FrontKickState implements PlayerState {
  update(player: Player, ctx: CanvasRenderingContext2D): void {
    player.frameCount++;
    if (player.isMirrored) {
      player.currAnimation = player.mFrontKickAnimation;
    } else {
      player.currAnimation = player.frontKickAnimation;
    }
    if (player.frameCount >= 10) {
      player.atkFrame++;
      player.frameCount = 0;
    }
    player.drawFrame(ctx);
    if (player.atkFrame == fronKickSprites.length) {
      player.startIdling();
      player.atkFrame = 0;
    }
  }
}

export default FrontKickState;
