/* Button status */

const buttonStatus = document.querySelectorAll('[button-status]');
if (buttonStatus.length > 0) {
    //phân tích url
    let url = new URL(window.location.href);

    buttonStatus.forEach((button) => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('button-status');

            if (status) {
                url.searchParams.set('status', status);
            } else {
                url.searchParams.delete('status');
            }
            window.location.href = url.href;
        });
    });
}
/* End button status */

/* Form search */

const formSearch = document.querySelector('#form-search');
if (formSearch) {
    //phân tích url
    let url = new URL(window.location.href);

    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set('keyword', keyword);
        } else {
            url.searchParams.delete('keyword');
        }
        window.location.href = url.href;
    });
}

/* End form search */

/* Pagination */
const buttonPagination = document.querySelectorAll('[button-pagination]');

if (buttonPagination.length > 0) {
    let url = new URL(window.location.href);

    buttonPagination.forEach((button) => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');

            if (page) {
                url.searchParams.set('page', page);
            } else {
                url.delete('page');
            }
            window.location.href = url.href;
        });
    });
}

/* End pagination */

/* Show-alert */

// const showAlert = document.querySelector('[show-alert]');
// if (showAlert) {
//     const time = parseInt(showAlert.getAttribute('data-time'));

//     setTimeout(() => {
//         showAlert.classList.add('alert-hidden');
//     }, time);
// }

document.addEventListener('DOMContentLoaded', () => {
    const message = document
        .getElementById('flashMessage')
        ?.getAttribute('data-message');
    const type = document
        .getElementById('flashMessage')
        ?.getAttribute('data-type');
    if (message && type) {
        // Loại bỏ dấu ngoặc vuông và khoảng trắng dư thừa
        const cleanMessage = message.replace(/[\[\]"]+/g, '').trim();
        Swal.fire({
            title:
                type === 'success'
                    ? 'Thành công!'
                    : type == 'warning'
                    ? 'Cảnh báo'
                    : 'Lỗi!',
            text: cleanMessage,
            icon: type,
            confirmButtonText: 'OK',
        });
    }
});

/* End show-alert */

/* Upload image & delete preview*/

const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
    const btnDeletePreview = document.querySelector(
        '[btn-delete-imagePreview]'
    );
    const uploadImageInput = document.querySelector('[upload-image-input]');
    const uploadImagePreview = document.querySelector('[upload-image-preview]');

    btnDeletePreview.style.display = 'none';

    uploadImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];

        if (file) {
            //tạo đg dẫn tạm thời cho ảnh mà không cần upload lên server
            uploadImagePreview.src = URL.createObjectURL(file);

            btnDeletePreview.style.display = 'inline-block';
        }
    });

    btnDeletePreview.addEventListener('click', () => {
        uploadImageInput.value = '';
        uploadImagePreview.src = '';
        btnDeletePreview.style.display = 'none';
    });
}
/* End upload image & delete preview*/

/* Sort */
const sort = document.querySelector('[sort]');

if (sort) {
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector('[sort-select]');
    const sortClear = sort.querySelector('[sort-clear]');

    sortSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split('-');

        url.searchParams.set('sortKey', sortKey);
        url.searchParams.set('sortValue', sortValue);

        window.location.href = url.href;
    });

    //clear sort
    sortClear.addEventListener('click', () => {
        url.searchParams.delete('sortKey');
        url.searchParams.delete('sortValue');

        window.location.href = url.href;
    });

    //add selected option
    const sortKey = url.searchParams.get('sortKey');
    const sortValue = url.searchParams.get('sortValue');

    if (sortKey && sortValue) {
        const optionString = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(
            `option[value='${optionString}']`
        );
        optionSelected.selected = true;
    }
}

/* End sort */
