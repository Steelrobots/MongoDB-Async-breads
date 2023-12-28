//variable
let id = null, conditional = null, page = 1, query = '', limit = 5, sortBy = '_id', sortMode = 'desc'

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