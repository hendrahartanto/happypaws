import Player from "../Player";
import PlayerState from "./PlayerState";

class JumpState implements PlayerState {
  update(player: Player, ctx: CanvasRenderingContext2D): void {
    if (player.isMirrored) {
      player.currAnimation = player.jumpBackwardAnimation;
    } else {
      player.currAnimation = player.jumpForwardAnimation;
    }
    player.jumpVelocity += 0.5;
    player.y += player.jumpVelocity;
    player.hitbox.y = player.y;
    if (player.y >= window.innerHeight - 280) {
      player.stopJumping();
    }
    player.drawFrame(ctx);
  }
}

export default JumpState;
