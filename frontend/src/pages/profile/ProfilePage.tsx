import { storage } from "../../services/firebase";
import Unauthorized from "../../components/Unauthorized";
import useFetch from "../../hooks/useFetch";
import anonymousProfilePicture from "../../assets/UI/anonymous.png";
import InputForm from "../../components/InputForm";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ButtonBlue from "../../components/ButtonBlue";
import ButtonOrange from "../../components/ButtonOrange";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postData, updateData } from "../../services/api";
import { useUser } from "../../contexts/UserContext";
import FormModal from "../../components/FormModal";

const ProfilePage = () => {
  const [error, setError] = useState({
    isError: false,
    erroeMessage: "",
  });
  const { user: currUser } = useUser();
  const navigate = useNavigate();

  const [bookModalIsOpen, setBookModalIsOpen] = useState(false);

  const [modalError, setModalError] = useState({
    isError: false,
    erroeMessage: "",
  });

  const [unaithorized, setIsUnauthorized] = useState(false);

  const inputFormFields = [
    {
      label: "Credit Card Number",
      name: "creditCardNumber",
      type: "text",
      placeHolder: "Inserr credit card number",
    },
    {
      label: "CVV",
      name: "cvv",
      type: "text",
      placeHolder: "Inserr cvv",
    },
  ];

  const bookModalClose = () => {
    setBookModalIsOpen(false);
  };

  const [reviewFormData, setreviewFormData] = useState({
    creditCardNumber: "",
    cvv: "",
  });

  const {
    data: user,
    loading: userLoading,
    unauthorized,
    refetch,
  } = useFetch("http://localhost:8080/user/profile");

  useEffect(() => {
    refetch();
  }, [currUser]);

  const [photo, setPhoto] = useState(null);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    isSubscribed: false,
    profilePicture: "",
    address: "",
    phoneNumber: "",
    paymentMethod: -1,
  });

  const resetFormData = () => {
    setFormData({
      userName: user.userName,
      email: user.email,
      isSubscribed: user.isSubscribed,
      profilePicture: user.profilePicture,
      address: user.address,
      phoneNumber: user.phoneNumber,
      paymentMethod: user.paymentMethod,
    });
  };

  useEffect(() => {
    if (user) {
      resetFormData();
    }
  }, [user]);

  if (userLoading) {
    return <div>Loading</div>;
  }

  if (unauthorized) {
    return <Unauthorized />;
  }

  const paymentMethods = [{ id: 0, name: "HI Wallet" }];

  const temp = { id: 1, name: "Credit Card" };

  if (user.CreditCards.length > 0) {
    paymentMethods.push(temp);
  }

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    const inputValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };

  const handleFileChange = (e: any) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  let photoURL: string;

  const handleFileUpload = async () => {
    if (photo) {
      const storageRef = ref(storage, `photos/${(photo as File).name}`);
      try {
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      } catch (error: any) {
        console.error("Error uploading photo:", error.message);
      }
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    await handleFileUpload();

    if (photoURL == undefined) {
      photoURL = formData.profilePicture;
    }

    const {
      userName,
      email,
      isSubscribed,
      address,
      phoneNumber,
      paymentMethod,
    } = formData;

    // await axios
    // 	.put(`http://localhost:8080/user/updateuser/${user.ID}`, {
    // 		userName,
    // 		email,
    // 		isSubscribed,
    // 		profilePicture: photoURL,
    // 		address,
    // 		paymentMethod: parseInt(paymentMethod.toString()),
    // 		phoneNumber,
    // 	})
    // 	.catch((error) => console.error("Error updating todo:", error));
    try {
      await updateData(`http://localhost:8080/user/updateuser/${user.ID}`, {
        userName,
        email,
        isSubscribed,
        profilePicture: photoURL,
        address,
        paymentMethod: parseInt(paymentMethod.toString()),
        phoneNumber,
      });
    } catch (error: any) {
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

    navigate("/home");
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/removecookie", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        console.log("Logout successful");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:");
    }

    navigate("/home");
  };

  const handleAddCreditCard = async (formData: any) => {
    console.log(formData);
    try {
      await postData(
        "http://localhost:8080/creditcard/addcreditcard",
        {
          creditCardNumber: formData.creditCardNumber,
          cvv: formData.cvv,
          userID: user.ID,
          amount: 10000000,
        },
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
    alert("Added New Credit Card!");
    setBookModalIsOpen(false);
    refetch();
  };

  return (
    <div className="profile-page">
      <FormModal
        isOpen={bookModalIsOpen}
        onSubmit={handleAddCreditCard}
        inputFormFields={inputFormFields}
        modalFormData={reviewFormData}
        title="Add Credit Card"
        onClose={bookModalClose}
        modalError={modalError}
      />
      <div className="page-center">
        <div className="profile-container">
          <form action="">
            <div className="top-container">
              <div className="username">{user.userName}</div>
              <div className="profile-picture-container">
                <img
                  src={
                    user.profilePicture == null
                      ? anonymousProfilePicture
                      : user.profilePicture
                  }
                  alt=""
                />
              </div>
              <div className="upload-picture-button">
                <InputForm
                  label={"Change Profile Picture"}
                  placeHolder={""}
                  type={"file"}
                  name={"profilePicture"}
                  value={undefined}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="bottom-container">
              <div className="header">Peronal Information</div>
              <InputForm
                label={"Username"}
                placeHolder={"Insert new username"}
                type={"text"}
                name={"userName"}
                value={formData.userName}
                onChange={handleInputChange}
              />
              <InputForm
                label={"Email Address"}
                placeHolder={"Insert new email address"}
                type={"text"}
                name={"email"}
                value={formData.email}
                onChange={handleInputChange}
              />
              <InputForm
                type="text"
                value={formData.phoneNumber}
                name="phoneNumber"
                placeHolder="insert new phone number"
                label={"Phone Number"}
                onChange={handleInputChange}
              />
              <InputForm
                type="text"
                value={formData.address}
                name="address"
                placeHolder="insert new address"
                label={"Address"}
                onChange={handleInputChange}
              />
              {/* PAYMENT METHOD */}
              {/* <SelectForm
								label="Select Payment Method"
								name="paymentMethod"
								value={formData.paymentMethod}
								options={paymentMethods.map(
									(item: { id: number; name: string }) => ({
										id: item.id,
										name: item.name,
									})
								)}
								onChange={handleInputChange}
							/> */}
              {user.CreditCards.length == 0 && (
                <div className="button-credit">
                  <ButtonOrange
                    label={"Add Credit Card"}
                    onClick={() => setBookModalIsOpen(true)}
                    type={"button"}
                  />
                </div>
              )}
              <InputForm
                type="checkbox"
                value={formData.isSubscribed}
                name="isSubscribed"
                placeHolder="tes"
                label={"Subsribe to Newsletter"}
                onChange={handleInputChange}
              />
              <div className="button">
                <ButtonOrange
                  label={"Update Profile"}
                  onClick={handleUpdate}
                  type={"submit"}
                />
              </div>
              {error.isError && (
                <div className="error">{error.erroeMessage}</div>
              )}
              <div className="button">
                <ButtonBlue label={"Logout"} onClick={logout} type={"button"} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
