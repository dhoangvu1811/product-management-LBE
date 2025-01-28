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

/* Upload image */

const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
    const uploadImageInput = document.querySelector('[upload-image-input]');
    const uploadImagePreview = document.querySelector('[upload-image-preview]');

    uploadImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];

        if (file) {
            //tạo đg dẫn tạm thời cho ảnh mà không cần upload lên server
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
/* End upload image */
