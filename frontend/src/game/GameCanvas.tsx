import { useEffect, useRef, useState } from "react";
import bgImgSrc from "../assets/game_asset/background/background.png";
import Player from "./player/Player";
import JumpState from "./player/state/JumpingState";
import LowKickState from "./player/state/LowKickState";
import FrontKickState from "./player/state/FrontKickState";
import idleSpritePaths from "./player/animation/blastImpulseSprites/idleSpritePaths";
import mIdleSpritePaths from "./player/animation/blastImpulseSprites/mIdleSpritePaths";
import walkForwardSprite from "./player/animation/blastImpulseSprites/walkForwardSpritePaths";
import walkBackwardSprite from "./player/animation/blastImpulseSprites/walkBackwardSpritePaths";
import mWalkForwardSprite from "./player/animation/blastImpulseSprites/mWalkForwardSpritePaths";
import mWalkBackwardSprite from "./player/animation/blastImpulseSprites/mWalkBackwardSpritePaths";
import jumpForwardSprites from "./player/animation/blastImpulseSprites/jumpForwardSpritesPaths";
import jumpBackwardSprites from "./player/animation/blastImpulseSprites/jumpBackwardSpritePaths";
import lowKickSprites from "./player/animation/blastImpulseSprites/lowKickSpritePaths";
import mLowKickSprites from "./player/animation/blastImpulseSprites/mLowKickSpritePaths";
import fronKickSprites from "./player/animation/blastImpulseSprites/frontKickSpritePaths";
import mFronKickSprites from "./player/animation/blastImpulseSprites/mFrontKickSpritePaths";

import idleSpritePaths2 from "./player/animation/swordImpulseSprites/idleSpritePaths";
import mIdleSpritePaths2 from "./player/animation/swordImpulseSprites/mIdleSpritePaths";
import walkForwardSprite2 from "./player/animation/swordImpulseSprites/walkForwardSpritePaths";
import walkBackwardSprite2 from "./player/animation/blastImpulseSprites/walkBackwardSpritePaths";
import mWalkForwardSprite2 from "./player/animation/swordImpulseSprites/mWalkForwardSpritePaths";
import mWalkBackwardSprite2 from "./player/animation/blastImpulseSprites/mWalkBackwardSpritePaths";
import jumpForwardSprites2 from "./player/animation/swordImpulseSprites/jumpForwardSpritesPaths";
import jumpBackwardSprites2 from "./player/animation/swordImpulseSprites/jumpBackwardSpritePaths";
import lowKickSprites2 from "./player/animation/swordImpulseSprites/lowKickSpritePaths";
import mLowKickSprites2 from "./player/animation/swordImpulseSprites/mLowKickSpritePaths";
import fronKickSprites2 from "./player/animation/swordImpulseSprites/frontKickSpritePaths";
import mFronKickSprites2 from "./player/animation/swordImpulseSprites/mFrontKickSpritePaths";
import lifeBarSrc from "../assets/game_asset/lifebar full.png";
import winSrc from "../assets/game_asset/win.png";
import drawSrc from "../assets/game_asset/draw.png";
import loseSrc from "../assets/game_asset/lose.png";
import { useUser } from "../contexts/UserContext";
import { updateData } from "../services/api";

const GameCanvas = () => {
	const socket = new WebSocket("ws://localhost:9090/ws");

	let playerId = 0;
	let timer = "";
	let draw = false;
	let lose = false;
	let win = false;

	const { user } = useUser();

	const handleGetPrice = async () => {
		try {
			await updateData(
				"http://localhost:8080/user/getprice",
				{
					userID: user?.ID,
				},
				{ withCredentials: true }
			);
		} catch (error: any) {
			if (error.message.includes("Unauthorized")) {
				return;
			}
		}
	};

	useEffect(() => {
		socket.onmessage = (e: any) => {
			const message = JSON.parse(e.data);
			console.log(message);
			switch (message.type) {
				case "onConnect":
					playerId = message.payload;
					if (message.payload == 2) {
						sendMessage("player1Pos", {
							x: player.x,
							y: player.y,
							x2: window.innerWidth - 400,
						});
					}
					break;
				case "moveLeft":
					if (message.payload == 1) {
						player.moveLeft();
					} else {
						player2.moveLeft();
					}
					break;
				case "startMovingLeft":
					if (message.payload == 1) {
						player.startMoving(-1);
					} else {
						player2.startMoving(-2);
					}
					break;
				case "moveRight":
					if (message.payload == 1) {
						player.moveRight();
					} else {
						player2.moveRight();
					}
					break;
				case "startMovingRight":
					if (message.payload == 1) {
						player.startMoving(1);
					} else {
						player2.startMoving(2);
					}
					break;
				case "startJumping":
					if (message.payload == 1) {
						player.startJumping();
					} else {
						player2.startJumping();
					}
					break;
				case "startIdling":
					if (message.payload == 1) {
						player.startIdling();
					} else {
						player2.startIdling();
					}
					break;
				case "startFrontKick":
					if (message.payload == 1) {
						player.startFrontKick();
						if (player.checkCollision(player2.hitbox)) {
							player2.hp -= 10;
						}
						if (player2.hp <= 0) {
							player2.hp = 0;
							if (playerId == 2) {
								lose = true;
							} else {
								win = true;
								handleGetPrice();
							}
						}
					} else {
						player2.startFrontKick();
						if (player2.checkCollision(player.hitbox)) {
							player.hp -= 10;
							if (player.hp <= 0) {
								player.hp = 0;
								if (playerId == 1) {
									lose = true;
								} else {
									win = true;
									handleGetPrice();
								}
							}
						}
					}
					break;
				case "startLowKick":
					if (message.payload == 1) {
						player.startLowKick();
						if (player.checkCollision(player2.hitbox)) {
							player2.hp -= 15;
						}
						if (player2.hp <= 0) {
							player2.hp = 0;
							if (playerId == 2) {
								lose = true;
							} else {
								win = true;
								handleGetPrice();
							}
						}
					} else {
						player2.startLowKick();
						if (player2.checkCollision(player.hitbox)) {
							console.log(player.hp);
							player.hp -= 15;
							if (player.hp <= 0) {
								player.hp = 0;
								if (playerId == 1) {
									lose = true;
								} else {
									win = true;
									handleGetPrice();
								}
							}
						}
					}
					break;
				case "player1Pos":
					player.x = message.payload.x;
					player.y = message.payload.y;
					player2.x = message.payload.x2;
					player2.hitbox.x = message.payload.x2;
					break;
				case "onDisconnect":
					if (message.payload == 1) {
						player.x = -1000;
						player.hitbox.x = player.x;
					} else {
						player2.x = window.innerWidth + 200;
						player2.hitbox.x = player2.x;
					}
					break;
				case "timer":
					if (message.payload <= 0) {
						timer = "0";
						if (player.hp == player2.hp) {
							draw = true;
						} else if (player.hp > player2.hp) {
							if (playerId == 1) {
								win = true;
							} else {
								lose = true;
							}
						} else {
							if (playerId == 2) {
								win = true;
							} else {
								lose = true;
							}
						}
					} else {
						timer = message.payload.toString();
					}
					break;
			}
			// console.log(e.data);
		};

		return () => {
			socket.close();
		};
	}, []);

	socket.onopen = () => {
		console.log("Connected to web socket server");
		// const message = {
		//   type: "testing",
		//   payload: { message: "halo" },
		// };
		// socket.send(JSON.stringify(message));
	};

	const sendMessage = (type: string, payload: any) => {
		const message = {
			type: type,
			payload: payload,
		};
		socket.send(JSON.stringify(message));
	};

	let sKeyPressed = false;
	let dKeyPressed = false;
	let aKeyPressed = false;

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const player2 = new Player(
		window.innerWidth + 200,
		window.innerHeight - 280,
		4,
		idleSpritePaths2,
		mIdleSpritePaths2,
		walkForwardSprite2,
		walkBackwardSprite2,
		mWalkForwardSprite2,
		mWalkBackwardSprite2,
		jumpForwardSprites2,
		jumpBackwardSprites2,
		lowKickSprites2,
		mLowKickSprites2,
		fronKickSprites2,
		mFronKickSprites2
	);

	const player = new Player(
		200,
		window.innerHeight - 280,
		4,
		idleSpritePaths,
		mIdleSpritePaths,
		walkForwardSprite,
		walkBackwardSprite,
		mWalkForwardSprite,
		mWalkBackwardSprite,
		jumpForwardSprites,
		jumpBackwardSprites,
		lowKickSprites,
		mLowKickSprites,
		fronKickSprites,
		mFronKickSprites
	);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const context = canvas.getContext("2d");
		if (!context) return;

		const lifeBar = new Image();
		lifeBar.src = lifeBarSrc;

		const result = new Image();

		const drawLifeBar = (
			ctx: any,
			x: number,
			y: number,
			width: number,
			height: number,
			hp: number,
			maxHp: number
		) => {
			const lifeWidth = (width * hp) / maxHp;

			ctx.fillStyle = "gray";
			ctx.fillRect(x, y, width, height);

			ctx.fillStyle = "green";
			ctx.fillRect(x, y, lifeWidth, height);
		};

		let animationId: number;

		const animate = () => {
			context.clearRect(0, 0, canvas.width, canvas.height);

			handleKeyPress();

			// VALIDASI MIRRORED
			if (player.x > player2.x) {
				player.isMirrored = true;
			} else {
				player.isMirrored = false;
			}

			if (player2.x > player.x) {
				player2.isMirrored = true;
			} else {
				player2.isMirrored = false;
			}
			context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

			drawLifeBar(
				context,
				canvas.width / 8,
				70,
				canvas.width / 3.2,
				40,
				player.hp,
				100
			);
			drawLifeBar(
				context,
				canvas.width / 1.77,
				70,
				canvas.width / 3.2,
				40,
				player2.hp,
				100
			);

			context.drawImage(lifeBar, 0, 0, canvas.width, 150);
			player.update(context);
			player2.update(context);
			context.font = "40px Arial";
			context.fillStyle = "white";
			context.fillText(timer, canvas.width / 2 - 20, canvas.height / 10);

			if (win || lose || draw) {
				if (win) {
					result.src = winSrc;
				} else if (draw) {
					result.src = drawSrc;
				} else {
					result.src = loseSrc;
				}

				context.drawImage(
					result,
					(canvas.width - result.width) / 2,
					(canvas.height - result.height) / 2
				);
			}

			animationId = requestAnimationFrame(animate);
		};

		let keys: Record<string, boolean> = {};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (!win && !lose && !draw) {
				if (playerId == 1) {
					if (event.key === "s") {
						sKeyPressed = true;
					} else if (event.key === " " && sKeyPressed) {
						if (
							!(player.state instanceof JumpState) &&
							!(player.state instanceof FrontKickState) &&
							!(player.state instanceof LowKickState)
						) {
							sendMessage("startLowKick", 1);
						}
					}

					if (event.key === "a") {
						aKeyPressed = true;
					} else if (event.key === " " && aKeyPressed) {
						if (
							!(player.state instanceof JumpState) &&
							!(player.state instanceof FrontKickState) &&
							!(player.state instanceof LowKickState)
						) {
							if (player.isMirrored) {
								sendMessage("startFrontKick", 1);
							}
						}
					}

					if (event.key === "d") {
						dKeyPressed = true;
					} else if (event.key === " " && dKeyPressed) {
						if (
							!(player.state instanceof JumpState) &&
							!(player.state instanceof FrontKickState) &&
							!(player.state instanceof LowKickState)
						) {
							if (!player.isMirrored) {
								sendMessage("startFrontKick", 1);
							}
						}
					}
				} else {
					if (event.key === "s") {
						sKeyPressed = true;
					} else if (event.key === " " && sKeyPressed) {
						if (
							!(player2.state instanceof JumpState) &&
							!(player2.state instanceof FrontKickState) &&
							!(player2.state instanceof LowKickState)
						) {
							sendMessage("startLowKick", 2);
						}
					}

					if (event.key === "a") {
						aKeyPressed = true;
					} else if (event.key === " " && aKeyPressed) {
						if (
							!(player2.state instanceof JumpState) &&
							!(player2.state instanceof FrontKickState) &&
							!(player2.state instanceof LowKickState)
						) {
							if (player2.isMirrored) {
								sendMessage("startFrontKick", 2);
							}
						}
					}

					if (event.key === "d") {
						dKeyPressed = true;
					} else if (event.key === " " && dKeyPressed) {
						if (
							!(player2.state instanceof JumpState) &&
							!(player2.state instanceof FrontKickState) &&
							!(player2.state instanceof LowKickState)
						) {
							if (!player2.isMirrored) {
								sendMessage("startFrontKick", 2);
							}
						}
					}
				}
				keys[event.key] = true;
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (!win && !lose && !draw) {
				if (event.key === "s") {
					sKeyPressed = false;
				}

				if (event.key === "a") {
					aKeyPressed = false;
				}

				if (event.key === "d") {
					dKeyPressed = false;
				}
				if (playerId == 1) {
					if (
						!(player.state instanceof JumpState) &&
						!(player.state instanceof LowKickState) &&
						!(player.state instanceof FrontKickState)
					) {
						sendMessage("startIdling", 1);
					}
				} else {
					if (
						!(player2.state instanceof JumpState) &&
						!(player2.state instanceof LowKickState) &&
						!(player2.state instanceof FrontKickState)
					) {
						sendMessage("startIdling", 2);
					}
				}
				keys[event.key] = false;
			}
		};

		const handleKeyPress = () => {
			if (!win && !lose && !draw) {
				if (playerId == 1) {
					if (keys["a"]) {
						if (
							!(player.state instanceof LowKickState) &&
							!(player.state instanceof FrontKickState)
						) {
							sendMessage("moveLeft", 1);
						}
						if (
							!(player.state instanceof JumpState) &&
							!(player.state instanceof LowKickState) &&
							!(player.state instanceof FrontKickState)
						) {
							sendMessage("startMovingLeft", 1);
						}
					}
					if (keys["d"]) {
						if (
							!(player.state instanceof JumpState) &&
							!(player.state instanceof LowKickState) &&
							!(player.state instanceof FrontKickState)
						) {
							sendMessage("startMovingRight", 1);
						}
						if (
							!(player.state instanceof LowKickState) &&
							!(player.state instanceof FrontKickState)
						) {
							sendMessage("moveRight", 1);
						}
					}
					if (keys["w"]) {
						if (!(player.state instanceof LowKickState)) {
							sendMessage("startJumping", 1);
						}
					}
				} else {
					if (keys["a"]) {
						if (
							!(player2.state instanceof LowKickState) &&
							!(player2.state instanceof FrontKickState)
						) {
							sendMessage("moveLeft", 2);
						}
						if (
							!(player2.state instanceof JumpState) &&
							!(player2.state instanceof LowKickState) &&
							!(player2.state instanceof FrontKickState)
						) {
							sendMessage("startMovingLeft", 2);
						}
					}
					if (keys["d"]) {
						if (
							!(player2.state instanceof JumpState) &&
							!(player2.state instanceof LowKickState) &&
							!(player2.state instanceof FrontKickState)
						) {
							sendMessage("startMovingRight", 2);
						}
						if (
							!(player2.state instanceof LowKickState) &&
							!(player2.state instanceof FrontKickState)
						) {
							sendMessage("moveRight", 2);
						}
					}
					if (keys["w"]) {
						if (!(player2.state instanceof LowKickState)) {
							sendMessage("startJumping", 2);
						}
					}
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		const backgroundImage = new Image();
		backgroundImage.src = bgImgSrc;
		backgroundImage.onload = () => {
			animationId = requestAnimationFrame(animate);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			width={window.innerWidth}
			height={window.innerHeight}
		></canvas>
	);
};

export default GameCanvas;
