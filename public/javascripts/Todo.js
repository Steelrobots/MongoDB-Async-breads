let title = '', page = 1, complete = '', startDeadline = '', endDeadline = '', sortBy = '_id', sortMode = 'desc', limit = 10, executor = executorid, deadline = null, todoId = null, id = null, complt = false;




function getId(_id) {
    todoId = _id
    console.log(todoId)
}



$(window).scroll(function () {
    if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
        page++
        loadData(complt)
    }
})

const search = () => {
    console.log("jalan")
    page = 1
    title = $('#inputTitle').val()
    startDeadline = $('#startDeadline').val()
    endDeadline = $('#endDeadline').val()
    if ($('#complete').val()) complete = $('#complete').val()
    else complete = ''
    loadData(!complt)

}
const reset = () => {
    title = ''
    startDeadline = ''
    endDeadline = ''
    complete = ''
    $('#inputTitle').val('')
    $('#startDeadline').val('')
    $('#endDeadline').val('')
    $('#complete').val('')

    sortBy = '_id'
    sortMode = 'desc'
    let defaultMode = `
    <button class="btn btn-success" onclick="sortDesc('deadline')"><i class="fa-solid fa-sort"></i> sort by deadline</button>
    `
    $('#changeSort').html(defaultMode)
    loadData(!complt)
}

const sortAsc = (deadline) => {
    page = 1
    sortBy = deadline
    sortMode = "asc"
    let ascMode = `
    <button class="btn btn-success" onclick="sortDesc('deadline')"><i class="fa-solid fa-sort-down"></i> sort by deadline</button>`
    $('#changeSort').html(ascMode)
    loadData(!complt)
}
const sortDesc = (deadline) => {
    page = 1
    sortBy = deadline
    sortMode = "desc"
    let descMode = `
    <button class="btn btn-success" onclick="sortAsc('deadline')"><i class="fa-solid fa-sort-up"></i> sort by deadline</button>`
    $('#changeSort').html(descMode)
    loadData(!complt)
}

const getData = async (_id) => {
    console.log('jalaan')
    try {
        getId(_id)
        const response = await $.ajax({
            url: `/api/todos/${todoId}`,
            method: "GET",
            dataType: "json",
        });
        console.log(response.title, response.deadline, response.complete)
        $('#editTitle').val(response.title)
        $('#editDeadline').val(moment(response.deadline).format('YYYY-MM-DDThh:mm'))
        $('#editComplete').prop('checked', response.complete)
    } catch (err) {
        throw err
    }
    loadData(complt)
}

const loadData = async () => {
    try {
        const response = await $.ajax({
            url: "/api/todos",
            data: "data",
            method: "GET",
            dataType: "json",
            data: {
                executor,
                sortBy,
                sortMode,
                deadline,
                title,
                startDeadline,
                endDeadline,
                complete,
                page,
                limit
            }
        });
        let list = ''
        response.data.forEach((item) => {
            list += `
            <div id="${item._id}" class="todoslist ${item.complete == false && new Date(`${item.deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : item.complete == true ? ' alert alert-success' : ' alert alert-secondary'}" role="alert">
                 ${moment(item.deadline).format('DD-MM-YYYY HH:mm')} ${item.title}
                 <div>
                    <a type="button" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#formTodo" ><i class="fa-solid fa-pencil"></i></a>
                    <a type="button" onclick="getId('${item._id}')"  data-bs-toggle="modal" data-bs-target="#deleteTodo"><i class="fa-solid fa-trash mx-2"></i></a>
                 </div>    
                </div>`
        });

        if (page === 1) {
            $('#todos-list').html(list)
        } else if (page > 1) {
            $('#todos-list').append(list)
        }
    } catch (error) {
        throw error.message

    }
}
loadData(complt)

const addTodo = async () => {
    try {
        title = $('#title').val()
        const a_day = 24 * 60 * 1000
        const response = await $.ajax({
            url: `/api/todos`,
            method: "POST",
            dataType: "json",
            data: {
                title,
                executor
            }
        });
        let addList = ''
        addList += `
        <div id="${response[0]._id}" class="todoslist ${response[0].complete == false && new Date(`${response[0].deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : response[0].complete == true ? ' alert alert-success' : ' alert alert-secondary'}" role="alert">
        ${moment(new Date(Date.now() + a_day)).format('DD-MM-YYYY HH:mm')} ${title}
        <div>
        <a type="button" onclick="modalUpdate('${response[0]._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
        <a type="button" onclick="getId('${response[0]._id}')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
        </div>
         </div>`
        $('#todos-list').prepend(addList)
        title = ''
        $('#title').val('')

    } catch (error) {
        console.log(error.message)
    }
}

const updateTodo = async () => {
    try {
        console.log('update jalan')
        let title = $('#editTitle').val()
        let deadline = $('#editDeadline').val()
        let complete = $('#editComplete').prop('checked')
        const response = await $.ajax({
            url: `/api/todos/${todoId}`,
            method: "PUT",
            dataType: "json",
            data: {
                title,
                executor,
                deadline,
                complete: Boolean(complete)
            }
        });
        let editList = ''
        editList += `
        ${moment(new Date(deadline)).format('DD-MM-YYYY HH:mm')} ${title}
        <div>
        <a type="button" onclick="modalUpdate('${response._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
        <a type="button" onclick="getId('${response._id}')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
        </div>
        `
        $(`#${response._id}`).attr('class', `todoslist ${response.complete == false && new Date(`${response.deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : response.complete == true ? ' alert alert-success' : ' alert alert-secondary'}`).html(editList)
        title = $('#searchTitle').val()
        if ($('#completeTodo').val()) {
            complete = $('#completeTodo').val()
        } else {
            complete = ''
        }
        console.log(editList)
        loadData(complt)
    } catch (error) {
        console.log('ngebug', error.message)
    }
}

const deleteTodo = async () => {
    try {
        const response = await $.ajax({
            url: `/api/todos/${todoId}`,
            method: "DELETE",
            dataType: "json"
        })
        $(`#${todoId}`).remove()
    } catch (error) {
        console.log('ngebug', error.message)
    }
    loadData(complt)
}
