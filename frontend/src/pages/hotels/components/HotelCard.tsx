import { Link } from "react-router-dom";
import starIcon from "../../../assets/UI/star.png";
import locationIcon from "../../../assets/UI/location.svg";

const HotelCard = ({ hotelDatas }: any) => {
  return (
    <div className="hotel-card-container">
      {hotelDatas.map((hotelData: any) => (
        <Link
          to={`/hotels/${hotelData.ID}`}
          className="hotel-card"
          key={hotelData.ID}
        >
          <div className="left">
            <img src={hotelData.picture} alt="" />
          </div>
          <div className="right">
            <div className="title">{hotelData.hotelName}</div>
            <div className="rating">
              <div className="text">
                {hotelData.Reviews.length == 0
                  ? "-"
                  : hotelData.averageRating + "/10"}
              </div>
              <img src={starIcon} alt="" />
              <div className="text">({hotelData.Reviews.length})</div>
            </div>
            <div className="address">
              <img src={locationIcon} alt="" />
              <p>{hotelData.address}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HotelCard;
