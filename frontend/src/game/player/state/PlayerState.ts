import Player from "../Player";

interface PlayerState {
	update(player: Player, ctx: CanvasRenderingContext2D): void;
}

export default PlayerState;
