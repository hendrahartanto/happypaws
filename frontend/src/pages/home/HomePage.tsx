import heroDogImage from "../../assets/dog_picture/dog_picture1.png";

const HomePage = () => {
	return (
		<div className="home-page">
			<div className="hero-section">
				<div className="page-center">
					<div className="hero-container">
						<div className="hero-left">
							<p className="title">Welcome to Happy Paws</p>
							<p className="subtitle">
								The Best Place to Care for Your Pets with Love and Attention
							</p>
						</div>
						<div className="hero-right">
							<img src={heroDogImage} alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
