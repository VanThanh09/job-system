import { Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentCancel = () => {
    const nav = useNavigate();

    const posting = () => {
        nav(`/addPosting`);
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4 text-success">
                Thanh toán thất bại
            </h2>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md pb-4">
                Bạn đã hủy thanh toán bài đăng của bạn sẽ không được lưu trữ.
            </div>
            <Button onClick={posting} size="sm" variant="success" >
                Đăng bài mới
            </Button>
        </div >
    );
}

export default PaymentCancel;