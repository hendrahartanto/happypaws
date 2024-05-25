import Animations from "./Animations";

class LowKickAnimation extends Animations {
  constructor(sprites: string[]) {
    super(sprites, sprites.length, 10);
  }
}

export default LowKickAnimation;
