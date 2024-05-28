interface PaginationProps {
	totalPaginate: number;
	currPage: number;
	paginate: any;
}

const Pagination: React.FC<PaginationProps> = ({
	totalPaginate,
	currPage,
	paginate,
}) => {
	return (
		<nav>
			<div className="pagination">
				<div
					onClick={() => paginate("prev")}
					className={currPage == 1 ? "button disabled" : "button"}
				>
					{`<<`} Prev
				</div>
				<div
					onClick={() => paginate("next")}
					className={currPage == totalPaginate ? "button disabled" : "button"}
				>
					Next {`>>`}
				</div>
			</div>
		</nav>
	);
};

export default Pagination;
