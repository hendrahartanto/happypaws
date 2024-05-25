import Player from "../Player";
import PlayerState from "./PlayerState";

class IdleState implements PlayerState {
  update(player: Player, ctx: CanvasRenderingContext2D): void {
    if (player.isMirrored) {
      player.currAnimation = player.mIdleAnimation;
    } else {
      player.currAnimation = player.IdleAnimation;
    }
    player.drawFrame(ctx);
  }
}

export default IdleState;
