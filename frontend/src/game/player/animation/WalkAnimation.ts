import Animations from "./Animations";

class WalkAnimation extends Animations {
  constructor(sprites: string[]) {
    super(sprites, sprites.length, 10);
  }
}

export default WalkAnimation;
