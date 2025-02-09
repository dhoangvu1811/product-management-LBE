/* Delete role */

const btnDelete = document.querySelectorAll('[btn-delete-role]');
if (btnDelete.length > 0) {
    const formDeleteRole = document.querySelector('#form-delete-role');
    const dataPath = formDeleteRole.getAttribute('data-path');

    btnDelete.forEach((button) => {
        button.addEventListener('click', () => {
            Swal.fire({
                title: 'Bạn có chắc không?',
                text: 'Xoá nhóm quyền',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xoá',
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = button.getAttribute('data-id');

                    const action = dataPath + `/${id}?_method=DELETE`;

                    formDeleteRole.action = action;
                    formDeleteRole.submit();
                }
            });
        });
    });
}

/* End delete role */
