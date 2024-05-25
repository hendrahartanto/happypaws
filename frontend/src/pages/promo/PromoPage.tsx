import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import ButtonBlue from "../../components/ButtonBlue";
import ButtonOrange from "../../components/ButtonOrange";
import { updateData } from "../../services/api";
import Unauthorized from "../../components/Unauthorized";

const PromoPage = () => {
	const [unaithorized, setIsUnauthorized] = useState(false);

	const {
		data: activePromos,
		loading: activePromosLoading,
		refetch: activePromosRefecth,
	} = useFetch(`http://localhost:8080/promo/getactivepromos`);

	const {
		data: nonactivePromos,
		loading: nonactivePromosLoading,
		refetch: nonactivePromosRefecth,
	} = useFetch(`http://localhost:8080/promo/getnonactivepromos`);

	const handleRemovePromo = async (promoID: any) => {
		try {
			await updateData(
				"http://localhost:8080/promo/deactivatepromo",
				{
					promoID: promoID,
				},
				{ withCredentials: true }
			);
		} catch (error: any) {
			if (error.message.includes("Unauthorized")) {
				setIsUnauthorized(true);
				return;
			}
			return;
		}
		activePromosRefecth();
		nonactivePromosRefecth();
	};

	const handleAddPromo = async (promoID: any) => {
		try {
			await updateData(
				"http://localhost:8080/promo/activatepromo",
				{
					promoID: promoID,
				},
				{ withCredentials: true }
			);
		} catch (error: any) {
			if (error.message.includes("Unauthorized")) {
				setIsUnauthorized(true);
				return;
			}
			alert(error.message);
			return;
		}
		activePromosRefecth();
		nonactivePromosRefecth();
	};

	if (activePromosLoading || nonactivePromosLoading) {
		return <div>Loading...</div>;
	}

	if (unaithorized) {
		return <Unauthorized />;
	}

	console.log(nonactivePromos);
	console.log(activePromos);

	return (
		<div className="promo-page">
			<div className="page-center">
				<div className="active-promo-section">
					<div className="section-container">
						<div className="header">Active Promos</div>
						<div className="promo-container">
							{activePromos.map((promo: any) => (
								<div className="promo">
									<div className="promo-name">{promo.promoName}</div>
									<div className="promo-code">
										Promo code: {promo.promoCode}
									</div>
									<img src={promo.picture} alt="" className="promo-picture" />
									<div className="button">
										<ButtonOrange
											label={"Remove"}
											onClick={() => handleRemovePromo(promo.ID)}
											type={"Button"}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="nonactive-promo-section">
					<div className="section-container">
						<div className="header">Nonactive Promos</div>
						<div className="promo-container">
							{nonactivePromos.map((promo: any) => (
								<div className="promo">
									<div className="promo-name">{promo.promoName}</div>
									<div className="promo-code">
										Promo code: {promo.promoCode}
									</div>
									<img src={promo.picture} alt="" className="promo-picture" />
									<div className="button">
										<ButtonOrange
											label={"Add"}
											onClick={() => handleAddPromo(promo.ID)}
											type={"Button"}
										/>
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

export default PromoPage;
