/* Change status */
const buttonChangeStatus = document.querySelectorAll('[button-changeStatus]');

if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector('#form-change-status');
    const path = formChangeStatus.getAttribute('data-path');

    buttonChangeStatus.forEach((button) => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('data-status');
            const id = button.getAttribute('data-id');

            let statusChange = status == 'active' ? 'inactive' : 'active';

            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}

/* End change status */
