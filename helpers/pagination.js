module.exports = (query, objectPagination, countProducts) => {
    objectPagination.currentPage =
        parseInt(query.page) > 0 ? parseInt(query.page) : 1;

    // Tính toán tổng số trang
    objectPagination.totalPage = Math.ceil(
        countProducts / objectPagination.limitItems
    );

    // Giới hạn currentPage không vượt quá totalPage
    if (objectPagination.currentPage > objectPagination.totalPage) {
        objectPagination.currentPage = objectPagination.totalPage || 1;
    }

    // Tính vị trí skip để lấy dữ liệu
    objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limitItems;
    return objectPagination;
};
