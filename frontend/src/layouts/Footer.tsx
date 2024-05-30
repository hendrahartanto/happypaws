import { Link } from "react-router-dom";
import logo from "../assets/Logo/happy_paws.png";
import instagramIcon from "../assets/social_media_icon/instagram.png";
import twitterIcon from "../assets/social_media_icon/twitter.png";
import youtubeIcon from "../assets/social_media_icon/youtube.png";
import tiktokIcon from "../assets/social_media_icon/tik-tok.png";
import facebookIcon from "../assets/social_media_icon/facebook.png";

const Footer = () => {
	return (
		<div className="footer" id="footer">
			<div className="page-center">
				<div className="footer-container">
					<div className="section-1">
						<div className="logo">
							<img src={logo} alt="" />
						</div>
					</div>
					<div className="section-2">
						<div className="header">Products</div>
						<Link className="link" to={"/home"}>
							Home
						</Link>
						<Link className="link" to={"/flights"}>
							Flights
						</Link>
						<Link className="link" to={"/hotels"}>
							Hotels
						</Link>
						<Link className="link" to={"/cart"}>
							Cart
						</Link>
						<Link className="link" to={"/mybooking"}>
							My Booking
						</Link>
					</div>
					<div className="section-3">
						<div className="header">Follow Us On</div>
						<a
							className="link"
							target="_blank"
							href="https://www.instagram.com/traveloka.id/"
						>
							<img src={instagramIcon} alt="" />
							Instagram
						</a>
						<a
							className="link"
							target="_blank"
							href="https://www.facebook.com/traveloka.id/"
						>
							<img src={facebookIcon} alt="" />
							Facebook
						</a>
						<a
							className="link"
							target="_blank"
							href="https://twitter.com/Traveloka"
						>
							<img src={twitterIcon} alt="" />
							Twitter
						</a>
						<a
							className="link"
							target="_blank"
							href="https://www.youtube.com/Traveloka"
						>
							<img src={youtubeIcon} alt="" />
							Youtube
						</a>
						<a
							className="link"
							target="_blank"
							href="https://www.tiktok.com/@traveloka.id"
						>
							<img src={tiktokIcon} alt="" />
							Tiktok
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
