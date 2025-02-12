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

/* Permission category*/

const tablePermission = document.querySelector('[table-permission]');
if (tablePermission) {
    const btnSubmit = document.querySelector('[button-submit]');

    btnSubmit.addEventListener('click', () => {
        let permissions = [];

        const rows = tablePermission.querySelectorAll('[data-name]');

        rows.forEach((row) => {
            const dataName = row.getAttribute('data-name');
            const inputs = row.querySelectorAll('input');
            if (dataName == 'id') {
                inputs.forEach((input) => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: [],
                    });
                });
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if (checked == true) {
                        permissions[index].permissions.push(dataName);
                    }
                });
            }
        });

        //có mảng permissions => bỏ mảng vào form và submit
        if (permissions.length > 0) {
            const formChangePermission = document.querySelector(
                '#form-change-permission'
            );
            const inpPermissions = formChangePermission.querySelector(
                "input[name='permissions']"
            );

            //chuyển mảng thành chuỗi json
            inpPermissions.value = JSON.stringify(permissions);

            formChangePermission.submit();
        }
    });
}

/* End permission category*/

/* Permission data default */
const dataRecords = document.querySelector('[data-records]');
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute('data-records'));
    const tablePermission = document.querySelector('[table-permission]');

    records.forEach((record, index) => {
        const permissions = record.permissions;

        permissions.forEach((permission) => {
            const row = tablePermission.querySelector(
                `[data-name="${permission}"]`
            );
            const input = row.querySelectorAll('input')[index];

            input.checked = true;
        });
    });
}
/* End permission data default */
