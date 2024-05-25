import Animations from "./Animations";

class JumpAnimation extends Animations {
  constructor(sprites: string[]) {
    super(sprites, sprites.length, 10);
  }
}

export default JumpAnimation;
