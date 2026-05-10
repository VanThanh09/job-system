import { Pagination } from "react-bootstrap";

const Paginator = ({ page, totalPage, setPage }) => {
    const generatePaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPage <= maxVisiblePages) {
            for (let i = 1; i <= totalPage; i++) {
                items.push(
                    <Pagination.Item
                        key={i}
                        active={i === page}
                        onClick={() => setPage(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }
        } else {
            // First page
            items.push(
                <Pagination.Item
                    key={1}
                    active={1 === page}
                    onClick={() => setPage(1)}
                >
                    1
                </Pagination.Item>
            );

            if (page > 3) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" />);
            }

            // Current page and neighbors    
            const start = Math.max(2, page - 1);
            const end = Math.min(totalPage - 1, page + 1);

            for (let i = start; i <= end; i++) {
                items.push(
                    <Pagination.Item
                        key={i}
                        active={i === page}
                        onClick={() => setPage(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }

            if (page < totalPage - 2) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" />);
            }

            // Last page
            if (totalPage > 1) {
                items.push(
                    <Pagination.Item
                        key={totalPage}
                        active={totalPage === page}
                        onClick={() => setPage(totalPage)}
                    >
                        {totalPage}
                    </Pagination.Item>
                );
            }
        }
        return items;
    };

    return (
        totalPage > 0 &&
        <div className="d-flex justify-content-center align-items-center flex-column">
            {totalPage === page &&
                <div className="text-center my-4">
                    <p className="lead text-muted">
                        Không còn nội dung nào để hiển thị
                    </p>
                </div>
            }
            <Pagination size="sm" className="custom-pagination">
                <Pagination.Prev
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                />

                {generatePaginationItems()}

                <Pagination.Next
                    disabled={page === totalPage}
                    onClick={() => setPage(prev => Math.min(totalPage, prev + 1))}
                />
            </Pagination>
        </div>
    )
}

export default Paginator;