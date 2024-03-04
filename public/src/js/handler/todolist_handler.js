// config to handle, if database is available
let databaseAvailable = true;

// Declare your variable outside of both click and ready functions
let todoListDatatable;

export function todoListHandler() {
    let button = $('#addToDo');
    let input = $('#toDoContent');
    let ul = $('#ul_toDo');
    let statusTexts = {
        success: $('#statusTextSuccess'),
        failed: $('#statusTextFailed')
    };

    button.on('click', function() {
        // if input is empty
        if(input.val() !== "") {
            if(databaseAvailable) {
                jQuery.post('/todolist/addtodo', {
                    "item": input.val()
                })
                    .done(function(response) {
                        statusTexts.success.text(response).css("display", "block").delay(2000).slideUp(3000);
                        if(todoListDatatable) {
                            todoListDatatable.ajax.reload();
                        }
                        input.val("");
                    })
                    .fail(function(jqXHR, textStatus, errorMessage) {
                        statusTexts.failed.text(errorMessage).css("display", "block").delay(2000).slideUp(3000);
                    });
            } else {
                ul.append(`<li> ${input.val()} </li>`);
                console.log("ToDo added");
                statusTexts.success.text('To-Do added!').css("display", "block").delay(2000).slideUp(3000);
                input.val("");
            }// if databaseAvailable

        } else {
            statusTexts.failed.text('Please enter a To-Do!').css("display", "block").delay(2000).slideUp(3000);
        } // if input is empty

    }); // button on click

    let switch_toDo = $('#toDoSwitch');
    let switchContent = $('#switchContent');

    switch_toDo.on('change', function() {
        console.log("Switched");
        switchContent.toggle();
    });

    $(document).ready(function () {
        // ListDatatable
        todoListDatatable = jQuery('#todoListDatatable').DataTable({
            "order": [
                [0, "desc"]
            ],
            "processing": true,
            "serverSide": true,
            "initComplete": function (settings, json) {
                jQuery(todoListDatatable).show();
            },
            "select": true,
            "bFilter": false,
            "bInfo": true,
            "bPaginate": true,
            "pagingType": "simple",
            "columns": [
                {"data": "dbf_int_index"},
                {"data": "dbf_str_name"},
                {"data": "dbf_datetime_created"}

            ],
            "language": {
                "emptyTable": "No data to show.!"
            },
            "ajax": {
                "type": 'POST',
                "url": '/todolist/todo_list_datatables',
                "contentType": 'application/json; charset=utf-8',
                "dataType": 'json',
                "dataSrc": "data",
                "data": function (d) {
                    d.search = jQuery('#searchText').val();
                    return JSON.stringify(d);
                }
            }
        });

        // Search Text
        $('#searchText').on('keydown', function (e) {
            if (e.keyCode === 13) {
                todoListDatatable.ajax.reload();
            }
        }); // Search Text

    }); // document ready
} // todoListHandler