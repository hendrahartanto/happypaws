import Animations from "./animation/Animations";
import FrontKickAnimation from "./animation/FrontKickAnimation";
import IdleAnimation from "./animation/IdleAnimation";
import JumpAnimation from "./animation/JumpAnimation";
import LowKickAnimation from "./animation/LowKickAnimation";
import WalkAnimation from "./animation/WalkAnimation";
import FrontKickState from "./state/FrontKickState";
import IdleState from "./state/IdleState";
import JumpState from "./state/JumpingState";
import LowKickState from "./state/LowKickState";
import PlayerState from "./state/PlayerState";
import WalkState from "./state/WalkState";

class Player {
  public hp: number;
  public atkFrame: number;
  public frameCount: number;
  public x: number;
  public y: number;
  private speed: number;
  public isJumping: boolean;
  public currAnimation: Animations;
  public IdleAnimation: IdleAnimation;
  public mIdleAnimation: IdleAnimation;
  public walkForwardAnimation: WalkAnimation;
  public walkBackwardAnimation: WalkAnimation;
  public mwalkForwardAnimation: WalkAnimation;
  public mWalkBackwardAnimation: WalkAnimation;
  public jumpForwardAnimation: JumpAnimation;
  public jumpBackwardAnimation: JumpAnimation;
  public lowKickAnimation: LowKickAnimation;
  public mLowKickAnimation: LowKickAnimation;
  public frontKickAnimation: FrontKickAnimation;
  public mFrontKickAnimation: FrontKickAnimation;
  public jumpVelocity: number;
  public state: PlayerState;
  public isMirrored: boolean;
  public hitbox: { x: number; y: number; width: number; height: number };

  constructor(
    x: number,
    y: number,
    speed: number,
    idleSpritePaths: string[],
    mIdleSpritePaths: string[],
    walkForwardSprite: string[],
    walkBackwardSprite: string[],
    mWalkForwardSprite: string[],
    mWalkBackwardSprite: string[],
    jumpForwardSprites: string[],
    jumpBackwardSprites: string[],
    lowKickSprites: string[],
    mLowKickSprites: string[],
    fronKickSprites: string[],
    mFronKickSprites: string[]
  ) {
    this.hp = 100;
    this.frameCount = 0;
    this.atkFrame = 0;
    this.isJumping = false;
    this.x = x;
    this.y = y;
    this.jumpVelocity = -20;
    this.speed = speed;
    this.state = new IdleState();
    this.IdleAnimation = new IdleAnimation(idleSpritePaths);
    this.mIdleAnimation = new IdleAnimation(mIdleSpritePaths);
    this.walkForwardAnimation = new WalkAnimation(walkForwardSprite);
    this.walkBackwardAnimation = new WalkAnimation(walkBackwardSprite);
    this.mwalkForwardAnimation = new WalkAnimation(mWalkForwardSprite);
    this.mWalkBackwardAnimation = new WalkAnimation(mWalkBackwardSprite);
    this.jumpForwardAnimation = new JumpAnimation(jumpForwardSprites);
    this.jumpBackwardAnimation = new JumpAnimation(jumpBackwardSprites);
    this.lowKickAnimation = new LowKickAnimation(lowKickSprites);
    this.mLowKickAnimation = new LowKickAnimation(mLowKickSprites);
    this.frontKickAnimation = new FrontKickAnimation(fronKickSprites);
    this.mFrontKickAnimation = new FrontKickAnimation(mFronKickSprites);
    this.currAnimation = this.IdleAnimation;
    this.isMirrored = false;
    this.hitbox = {
      x: this.x,
      y: this.y,
      width: 230,
      height: 230,
    };
  }

  public startMoving(dir: number) {
    this.state = new WalkState(dir);
  }

  public startIdling() {
    this.state = new IdleState();
  }

  public startJumping() {
    this.state = new JumpState();
  }

  public stopJumping() {
    this.state = new IdleState();
    this.y = window.innerHeight - 280;
    this.jumpVelocity = -20;
  }

  public startLowKick() {
    this.state = new LowKickState();
  }

  public startFrontKick() {
    this.state = new FrontKickState();
  }

  public moveLeft() {
    this.x -= this.speed;
    this.hitbox.x = this.x;
  }

  public moveRight() {
    this.x += this.speed;
    this.hitbox.x = this.x;
  }

  public update(ctx: CanvasRenderingContext2D) {
    this.state.update(this, ctx);
  }

  public drawFrame(ctx: CanvasRenderingContext2D) {
    this.currAnimation.drawFrame(ctx, this.x, this.y);
    ctx.strokeStyle = "red";
    ctx.strokeRect(
      this.hitbox.x,
      this.hitbox.y,
      this.hitbox.width,
      this.hitbox.height
    );
  }

  public checkCollision(object: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    return (
      this.hitbox.x < object.x + object.width &&
      this.hitbox.x + this.hitbox.width > object.x &&
      this.hitbox.y < object.y + object.height &&
      this.hitbox.y + this.hitbox.height > object.y
    );
  }
}

export default Player;
