import Animations from "./Animations";

class IdleAnimation extends Animations {
  constructor(sprites: string[]) {
    super(sprites, sprites.length, 10);
  }
}

export default IdleAnimation;
