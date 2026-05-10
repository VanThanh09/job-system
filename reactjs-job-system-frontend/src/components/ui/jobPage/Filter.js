import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FiBriefcase, FiClock, FiDollarSign, FiFilter, FiMapPin, FiSearch } from "react-icons/fi";

const Filter = ({ filters, categories, handleFilterChange, handleClearFilters, handleSearch }) => {
    return (
        <Card className="shadow-sm mb-4 filter-card">
            <Card.Header className="bg-light border-0">
                <h5 className="mb-0 d-flex align-items-center">
                    <FiFilter className="me-2" />
                </h5>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Row>
                        <Col md={6} lg={3} className="mb-3">
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    <FiBriefcase className="me-1" size={14} />
                                    Danh mục
                                </Form.Label>
                                <Form.Select
                                    value={filters.categoryId ?? ''}
                                    onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                                >
                                    <option value="">Danh mục</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6} lg={2} className="mb-3">
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    <FiDollarSign className="me-1" size={14} />
                                    Lương tối thiểu
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Lương tối thiểu"
                                    value={filters.salaryFrom ?? ''}
                                    onChange={(e) => handleFilterChange('salaryFrom', e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} lg={2} className="mb-3">
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    <FiDollarSign className="me-1" size={14} />
                                    Lương tối đa
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Lương tối đa"
                                    value={filters.salaryTo ?? ''}
                                    onChange={(e) => handleFilterChange('salaryTo', e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} lg={3} className="mb-3">
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    <FiMapPin className="me-1" size={14} />
                                    Địa điểm
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập địa điểm"
                                    value={filters.address ?? ''}
                                    onChange={(e) => handleFilterChange('address', e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} lg={2} className="mb-3">
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    <FiClock className="me-1" size={14} />
                                    Giờ/tuần
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Thời gian tối đa"
                                    value={filters.workTime ?? ''}
                                    onChange={(e) => handleFilterChange('workTime', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col>
                            <div className="d-flex gap-2 justify-content-end">
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleClearFilters}
                                    className="px-4"
                                >
                                    Xóa lọc
                                </Button>
                                <Button
                                    variant="outline-success"
                                    onClick={handleSearch}
                                    type='submit'
                                    className="px-4 d-flex align-items-center"
                                >
                                    <FiSearch className="me-2" />
                                    Tìm
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default Filter;