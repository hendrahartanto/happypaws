import Animations from "./Animations";

class FrontKickAnimation extends Animations {
  constructor(sprites: string[]) {
    super(sprites, sprites.length, 10);
  }
}

export default FrontKickAnimation;
