import heroDogImage from "../../assets/dog_picture/dog_picture1.png";
import petGroomingImage from "../../assets/dog_picture/pet_grooming.png";
import petDayCareImage from "../../assets/dog_picture/pet_daycare.jpeg";
import petTrainingImage from "../../assets/dog_picture/pet_training.jpeg";

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
			<div className="services-section">
				<div className="page-center">
					<div className="content">
						<div className="header">Why us?</div>
						<div className="subtitle">
							We are the best pet hotel provider, wee offer a variety of
							services to meet your pet’s needs.
						</div>
						<div className="services-container">
							<div className="service">
								<div className="image-container">
									<img src={petGroomingImage} alt="" />
								</div>
								<div className="title">Grooming</div>
							</div>
							<div className="service">
								<div className="image-container">
									<img src={petDayCareImage} alt="" />
								</div>
								<div className="title">Day care</div>
							</div>
							<div className="service">
								<div className="image-container">
									<img src={petTrainingImage} alt="" />
								</div>
								<div className="title">Training</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
