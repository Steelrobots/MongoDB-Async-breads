//variable
let id = null, page = 1, query = '', limit = 5, sortBy = '_id', sortMode = 'desc'

const formModal = new bootstrap.Modal(document.getElementById('formData'), {
    keyboard: false
});
const deleteModal = new bootstrap.Modal(document.getElementById('deleteData'), {
    keyboard: false
});

function formSubmit(e){
    e.preventDefault()
    addData()
}


async function loadData() {
    try {
        const response = await fetch(`http://localhost:3000/api/users?query=${query}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortMode=${sortMode}`);
        const users = await response.json();
        const offset = users.offset
        let html = ''
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
            <td><button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editData"><i
                  class="fa-solid fa-pencil"></i></button>&nbsp;
              <button class="btn btn-danger" onclick="" data-bs-toggle="modal" data-bs-target="#deleteData"><i
                  class="fa-solid fa-trash"></i></button>&nbsp;
                  <a href="/users/${item.id}/todos" class="btn btn-warning"><i class="fa-solid fa-right-to-bracket"></i></a>
            </td>
          
          </tr>`
            document.getElementById('tbody').innerHTML = html
        });
    } catch (error) {
        console.log('ngebug', error)

    }

}

loadData()

async function addData(){
    try {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        const response = await fetch(`http://localhost:3000/api/users`,{
            method: "POST", 
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({name,phone}),
        });
        const {data} = await response.json()
        loadData()
        formModal.hide()
    } catch (error) {
        console.log('ngebug', error)
    }
}