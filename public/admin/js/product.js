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

/* Table checkbox multi */

const checkboxMulti = document.querySelector('[table-checkbox-multi]');

if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkAll']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    //check All
    inputCheckAll.addEventListener('click', () => {
        if (inputCheckAll.checked) {
            inputsId.forEach((inputId) => {
                inputId.checked = true;
            });
        } else {
            inputsId.forEach((inputId) => {
                inputId.checked = false;
            });
        }
    });

    //checkbox từng sản phẩm
    inputsId.forEach((inputId) => {
        inputId.addEventListener('click', () => {
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;

            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}
/* End table checkbox multi */

/* Form change multi & delete all & change position*/
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', async (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector('[table-checkbox-multi]');
        const inputChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );

        const typeChange = e.target.elements.type.value;

        if (typeChange == 'delete-all') {
            const result = await Swal.fire({
                title: 'Bạn có chắc không?',
                text: 'Xoá những sản phẩm này',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xoá',
            });

            if (!result.isConfirmed) {
                return;
            }
        }
        if (typeChange == 'delete-permanently') {
            const result = await Swal.fire({
                title: 'Bạn có chắc không?',
                text: 'Xoá vĩnh viễn những sản phẩm này',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xoá vĩnh viễn',
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        if (inputChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputChecked.forEach((input) => {
                const id = input.value;

                if (typeChange == 'change-position') {
                    const position = input
                        .closest('tr')
                        .querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });
            inputIds.value = ids.join(', ');

            formChangeMulti.submit();
        } else {
            alert('Vui lòng chọn ít nhất 1 bản ghi!');
        }
    });
}
/* End form change multi & delete all */

/* Delete item */

const buttonDeleteItem = document.querySelectorAll('[button-delete]');
if (buttonDeleteItem.length > 0) {
    const formDeleteItem = document.querySelector('#form-delete-item');
    const path = formDeleteItem.getAttribute('data-path');

    buttonDeleteItem.forEach((button) => {
        button.addEventListener('click', () => {
            Swal.fire({
                title: 'Bạn có chắc không?',
                text: 'Xoá sản phẩm',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xoá',
            }).then((result) => {
                if (result.isConfirmed) {
                    const idItem = button.getAttribute('data-id');

                    const action = path + `/${idItem}?_method=DELETE`;

                    formDeleteItem.action = action;
                    formDeleteItem.submit();
                }
            });
        });
    });
}

/* End delete item */

/* Restore item */

const buttonRestore = document.querySelectorAll('[button-restore]');

if (buttonRestore.length > 0) {
    const formRestore = document.querySelector('#form-restore-item');
    const path = formRestore.getAttribute('data-path');

    buttonRestore.forEach((button) => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const action = path + `/${id}?_method=PATCH`;
            formRestore.action = action;
            formRestore.submit();
        });
    });
}

/* End restore item */

/* Delete-permanently item */

const buttonDeletePermanently = document.querySelectorAll(
    '[ button-delete-permanently]'
);

if (buttonDeletePermanently.length > 0) {
    const formDeletePermanently = document.querySelector(
        '#form-delete-permanently-item'
    );
    const path = formDeletePermanently.getAttribute('data-path');

    buttonDeletePermanently.forEach((button) => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const action = path + `/${id}?_method=DELETE`;
            formDeletePermanently.action = action;
            formDeletePermanently.submit();
        });
    });
}

/* End delete-permanently item */
