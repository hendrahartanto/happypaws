import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import locationIcon from "../../assets/UI/location.svg";
import starIcon from "../../assets/UI/star.png";
import ButtonBlue from "../../components/ButtonBlue";
import ButtonOrange from "../../components/ButtonOrange";
import anonymousProfilePicture from "../../assets/UI/anonymous.png";
import { useUser } from "../../contexts/UserContext";
import Unauthorized from "../../components/Unauthorized";
import { useEffect, useState } from "react";
import InputForm from "../../components/InputForm";
import { postData } from "../../services/api";
import FormModal from "../../components/FormModal";

const HotelsPageDetail = () => {
  const [error, setError] = useState({
    isError: false,
    erroeMessage: "",
  });

  const [modalError, setModalError] = useState({
    isError: false,
    erroeMessage: "",
  });

  const { id } = useParams();

  const { user } = useUser();

  const [bookModalIsOpen, setBookModalIsOpen] = useState(false);

  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const [bookPrice, setBookPrice] = useState<null | number>(null);
  const [bookStartDate, setBookStartDate] = useState<null | string>(null);
  const [bookEndDate, setBookEndDate] = useState<null | string>(null);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });

  const paymentMethods = [{ id: 0, name: "HI Wallet" }];

  const temp = { id: 1, name: "Credit Card" };

  if (user?.CreditCards.length > 0) {
    paymentMethods.push(temp);
  }

  const [bookFormData, setBookFormData] = useState({
    promoCode: "",
    paymentMethod: 0,
  });

  useEffect(() => {
    if (bookModalIsOpen) {
      document.body.classList.add("unscrollable");
    } else {
      document.body.classList.remove("unscrollable");
    }

    return () => {
      document.body.classList.remove("unscrollable");
    };
  }, [bookModalIsOpen]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    const updatedValue =
      name === "day"
        ? value !== ""
          ? Math.max(1, parseInt(value, 10))
          : 1
        : value;

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const { data: hotelDatas, loading: hotelLoading } = useFetch(
    "http://localhost:8080/hotel/getallhotel"
  );

  if (hotelLoading) {
    return <div>Loading</div>;
  }

  const hotelData = hotelDatas.find((hotelData: any) => hotelData.ID == id);

  const calculateNights = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    const timeDiff = end.getTime() - start.getTime();

    const nights = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return nights;
  };

  const handleAddCart = async (room: any) => {
    if (formData.startDate == "" || formData.endDate == "") {
      alert("Insert date first");
      return;
    }
    const price = room.pricePreDay * calculateNights();
    const userID = user?.ID;
    const roomID = room.ID;
    const startDate = new Date(formData.startDate).toISOString();
    const endDate = new Date(formData.endDate).toISOString();

    console.log(startDate);

    try {
      await postData(
        "http://localhost:8080/roomcart/postroomcart",
        {
          price,
          userID,
          roomID,
          startDate: startDate,
          endDate: endDate,
        },
        { withCredentials: true }
      );
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        setIsUnauthorized(true);
        return;
      }
      setError({
        isError: true,
        erroeMessage: error.message,
      });
      return;
    }

    setError({
      isError: false,
      erroeMessage: "",
    });

    alert("Successfully Added to Cart!");
  };

  const handleBookNow = (room: any) => {
    if (user == null) {
      setIsUnauthorized(true);
      return;
    }
    if (formData.startDate == "" || formData.endDate == "") {
      alert("Insert date first");
      return;
    }
    setBookPrice(room.pricePreDay * calculateNights());
    let startDate = new Date(formData.startDate);
    let endDate = new Date(formData.endDate);
    setBookStartDate(startDate.toLocaleString());
    setBookEndDate(endDate.toLocaleString());
    setBookModalIsOpen(true);
  };

  const bookModalClose = () => {
    setBookModalIsOpen(false);
  };

  if (isUnauthorized) {
    return <Unauthorized />;
  }

  const inputFormFields = [
    {
      label: "Promo Code",
      name: "promoCode",
      type: "text",
      placeHolder: "Insert promo code",
    },
  ];

  const selectFormFields = [
    {
      label: "Select Payment Method",
      name: "paymentMethod",
      options: paymentMethods,
    },
  ];

  const handleBookTransaction = async () => {
    try {
      await postData(
        "http://localhost:8080/review/postreview",
        {},
        { withCredentials: true }
      );
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        setIsUnauthorized(true);
        return;
      }
      setModalError({
        isError: true,
        erroeMessage: error.message,
      });
      return;
    }
    setModalError({
      isError: false,
      erroeMessage: "",
    });
    alert("Comment posted successfully!");
    setBookModalIsOpen(false);
  };

  return (
    <div className="hotel-detail">
      <FormModal
        isOpen={bookModalIsOpen}
        onSubmit={() => {}}
        inputFormFields={inputFormFields}
        modalFormData={bookFormData}
        title="You accommodation Booking"
        bookPrice={bookPrice}
        bookStartDate={bookStartDate}
        bookEndDate={bookEndDate}
        onClose={bookModalClose}
        selectFormFields={selectFormFields}
        modalError={modalError}
      />
      <div className="header-section">
        <div className="page-center">
          <div className="header-container">
            <p className="title">{hotelData.hotelName}</p>
            <div className="address-container">
              <img src={locationIcon} alt="" />
              <p className="address">{hotelData.address}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="preview-section">
        <div className="page-center">
          <div className="preview-container">
            <div className="left">
              <img src={hotelData.picture} alt="" />
            </div>
            <div className="right">
              <div className="rating-container">
                <div className="rating-header">Rating</div>
                <div className="rating">
                  <div className="text">
                    {hotelData.Reviews.length == 0
                      ? "-"
                      : hotelData.averageRating.toFixed(1) + "/10"}
                  </div>
                  <img src={starIcon} alt="" />
                  <div className="text">({hotelData.Reviews.length})</div>
                </div>
              </div>
              <div className="about-hotel-container">
                <p className="about-hotel-header">
                  About {hotelData.hotelName}
                </p>
                <p className="about-hotel-body">{hotelData.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="facilities-section">
        <div className="page-center">
          <div className="facilites-container">
            <div className="facility-header">Hotel Facilities</div>
            <div className="facility-list">
              {hotelData.HotelFacilities.map((facility: any) => (
                <div className="facility" key={facility.facilityName}>
                  {facility.facilityName}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="rooms-section">
        <div className="page-center">
          <div className="rooms-container">
            <div className="rooms-header">
              Available Room Types in {hotelData.hotelName}
            </div>
            <div className="room-list">
              {hotelData.Rooms.map((room: any) => (
                <div className="room" key={room.ID}>
                  <div className="left">
                    <img src={room.picture} alt="" />
                  </div>
                  <div className="right">
                    <div className="header">{room.roomType}</div>
                    <div className="room-facilities-container">
                      <div className="room-facility-header">
                        Room Facilities
                      </div>
                      <div className="room-facility-list">
                        {room.RoomFacilities.map((roomFacility: any) => (
                          <div
                            className="room-facility"
                            key={roomFacility.facilityName}
                          >
                            {roomFacility.facilityName}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="price-container">
                      <InputForm
                        label={"Select Start Date"}
                        placeHolder={""}
                        type={"datetime-local"}
                        name={"startDate"}
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                      <InputForm
                        label={"Select End Date"}
                        placeHolder={""}
                        type={"datetime-local"}
                        name={"endDate"}
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                      {error.isError && (
                        <div className="error">{error.erroeMessage}</div>
                      )}
                      <div className="price">
                        {room.pricePreDay.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "iDR",
                        })}
                      </div>
                      <div className="button-container">
                        <div className="button">
                          <ButtonBlue
                            type={"button"}
                            label={"Add to Cart"}
                            onClick={() => handleAddCart(room)}
                          />
                        </div>
                        <div className="button">
                          <ButtonOrange
                            label={"Book Now!"}
                            onClick={() => handleBookNow(room)}
                            type={"button"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="review-section">
        <div className="page-center">
          <div className="review-container">
            <div className="review-header">Reviews</div>
            {hotelData.Reviews.length == 0 && (
              <div className="no-review">No Review Currently</div>
            )}
            <div className="review-list">
              {hotelData.Reviews.map((review: any) => (
                <div className="review" key={review.ID}>
                  <div className="left">
                    <div className="username">
                      {review.isAnonymous ? "Anonymous" : review.User.userName}
                    </div>
                    <div className="profile-picture">
                      <img
                        src={
                          review.isAnonymous
                            ? anonymousProfilePicture
                            : review.User.profilePicture
                        }
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="right">
                    <div className="rating">
                      {review.rating}/10 {review.type}
                    </div>
                    <div className="comment">{review.comment}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPageDetail;
