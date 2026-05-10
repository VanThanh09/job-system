import { Modal, Button } from 'react-bootstrap';

const CVModal = ({ show, onHide, cvUrl, title }) => {
    const openInNewTab = () => {
        window.open(cvUrl, '_blank');
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="">
                <Modal.Title>CV - {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                {cvUrl ? (
                    <iframe
                        src={cvUrl}
                        width="100%"
                        height="600px"
                        title="CV Preview"
                        className="border-0"
                    />
                ) : (
                    <div className="text-center p-4">
                        <p>Không thể tải CV</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Đóng
                </Button>
                <Button
                    variant="dark"
                    onClick={openInNewTab}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Mở trong tab mới
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CVModal;