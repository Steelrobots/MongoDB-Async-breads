//variable
let userId = null,
    page = 1,
    query = '',
    limit = 5,
    sortBy = '_id',
    sortMode = 'desc'

const formModal = new bootstrap.Modal(document.getElementById('formData'), {
    keyboard: false
});
const deleteModal = new bootstrap.Modal(document.getElementById('deleteData'), {
    keyboard: false
});

function showAdd() {
    document.getElementById('submitAdd').style.display = 'block';
    document.getElementById('submitEdit').style.display = 'none';
    document.getElementById('name').value = ''
    document.getElementById('phone').value = ''
    formModal.show()
}
function showUpdate(_id, name, phone) {
    document.getElementById('submitAdd').style.display = 'none';
    document.getElementById('submitEdit').style.display = 'block';
    document.getElementById('name').value = name
    document.getElementById('phone').value = phone
    userId = _id
    formModal.show()
}
function showDelete(_id) {
    deleteModal.show()
    userId = _id
}

const setLimit = () => {
    limit = document.getElementById('limit').value
    page = 1
    loadData()
}

const search = () => {
    query = document.getElementById('input-search').value;
    page = 1
    loadData()
}

const reset = () => {
    document.getElementById('input-search').value = ''
    limit = document.getElementById('limit').value = "5"
    sortBy = '_id'
    sortMode = 'desc'
    let defaultName = `<a onclick="sortNameAsc('name')"><i class="fa-solid fa-sort"
    style="color: #000000;"></i></a>&nbsp;Name`
    let defaultPhone = `<a onclick="sortPhoneAsc('phone')"><i class="fa-solid fa-sort"
    style="color: #000000;"></i></a>&nbsp;Phone`
    query = ''

    document.getElementById('sort-name').innerHTML = defaultName
    document.getElementById('sort-phone').innerHTML = defaultPhone
    loadData()
}

const changePage = (numb) => {
    page = numb
    loadData(page)
}

const sortNameAsc = (name) => {
    sortBy = name
    sortMode = 'asc'
    let random = `<a type="button" onclick="sortPhoneAsc('name')"><i class="fa-solid fa-sort"></i></a> Phone</th>`
    let sortAsc = `
    <a type="button" onclick="sortNameDesc('name')"><i class="fa-solid fa-sort-up"></i></a>
    <span>Name</span>
    `
    document.getElementById(`sort-name`).innerHTML = sortAsc
    document.getElementById(`sort-phone`).innerHTML = random
    loadData()
}

const sortNameDesc = (name) => {
    sortBy = name
    sortMode = 'desc'
    let sortDesc = `
    <a type="button" onclick="sortNameAsc('name')"><i class="fa-solid fa-sort-down"></i></a>
    <span>Name</span>
    `
    document.getElementById(`sort-name`).innerHTML = sortDesc
    loadData()
}

const sortPhoneAsc = (phone) => {
    sortBy = phone
    sortMode = 'asc'
    let random = `<a type="button" onclick="sortNameAsc('name')"><i class="fa-solid fa-sort"></i></a> Phone</th>`
    let sortAsc = `
    <a type="button" onclick="sortPhoneDesc('phone')"><i class="fa-solid fa-sort-up"></i></a>
    <span>Phone</span>
    `
    document.getElementById(`sort-phone`).innerHTML = sortAsc
    document.getElementById(`sort-name`).innerHTML = random
    loadData()
}

const sortPhoneDesc = (phone) => {
    sortBy = phone
    sortMode = 'desc'
    let sortDesc = `
    <a type="button" onclick="sortPhoneAsc('phone')"><i class="fa-solid fa-sort-down"></i></a>
    <span>Phone</span>
    `
    document.getElementById(`sort-phone`).innerHTML = sortDesc
    loadData()
}
async function loadData() {
    try {
        const response = await fetch(`http://localhost:3000/api/users?query=${query}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortMode=${sortMode}`);
        const users = await response.json();
        console.log(users)
        const offset = users.offset
        let html = ''
        let pagination = ''
        let pageNumber = ''
        users.data.forEach((item, index) => {
            html += `<tr>
            <td>
              ${index + 1 + offset}
            </td>
            <td>
              ${item.name}
            </td>
            <td>
              ${item.phone}
            </td>
            <td><button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editData" onclick="showUpdate('${item._id}', '${item.name}', '${item.phone}')"><i
                  class="fa-solid fa-pencil"></i></button>&nbsp;
              <button class="btn btn-danger" onclick="showDelete('${item._id}')" data-bs-toggle="modal" data-bs-target="#deleteData"><i
                  class="fa-solid fa-trash" data-bs-toggle="modal"></i></button>&nbsp;
                  <a href="/users/${item._id}/todos" class="btn btn-warning"><i class="fa-solid fa-right-to-bracket"></i></a>
            </td>
          
          </tr>`
        });
        for (let i = 1; i <= users.pages; i++) {
            pageNumber += `<a class="page-link ${page == i ? ' active' : ''} " ${users.pages == 1 ? `style =border-radius:4px;` : ''} ${i == 1 && page == i ? `style="border-top-left-radius:4px; border-bottom-left-radius:5px;"` : ''}  ${i == users.pages && page == i ? `style="border-top-right-radius:4px; border-bottom-right-radius:5px;"` : ''} id="button-pagination" onclick="changePage(${i})">${i}</a>`

        }

        if (document.getElementById('limit').value == 0) {
            pagination += `
        <span class="showPage">Showing ${users.offset + 1} to ${users.total} of ${users.total} entries </span>
        <div class="page">
        <a class="page-link active" style="border-radius:6px" id="button-pagination">1</a>
        </div>
        `
        } else {
            pagination = `
        <span class="showPage">Showing ${users.offset + 1} to ${(Number(limit) + Number(users.offset)) >= users.total ? Number(users.total) : Number(limit) + Number(users.offset)} of ${users.total} entries </span>
        <div class="page">
        ${users.page == 1 ? '' : '<a onclick="changePage(page - 1)" style="border-top-left-radius:4px; border-bottom-left-radius:4px;" class="page-link" arial-lable="back"><span arial-hidden = true">&laquo</span></a>'}
        ${pageNumber}
        ${users.page == users.pages ? '' : '<a onclick="changePage(page + 1)" class="page-link" style="border-top-right-radius:4px; border-bottom-right-radius:4px;" arial-lable="next"><span arial-hidden = true">&raquo</span></a>'}
        </div>
        `
        }

        document.getElementById('button-pagination').innerHTML = pagination
        document.getElementById('tbody').innerHTML = html

    } catch (error) {
        console.log('ngebug', error)

    }

}

loadData()

async function addData() {
    try {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        const response = await fetch(`http://localhost:3000/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, phone }),
        });
        const { data } = await response.json()
        loadData()
        formModal.hide()
    } catch (error) {
        console.log('ngebug', error)
    }
}

async function deleteData() {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const users = await response.json()
        loadData()
        deleteModal.hide()
    } catch (error) {
        console.log('ngebug', error)
    }

}
async function updateData() {
    try {
        let name = document.getElementById('name').value
        let phone = document.getElementById('phone').value
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, phone })
        });
        const users = await response.json()
        loadData()
        formModal.hide()
    } catch (error) {
        console.log('ngebug', error)
    }
}