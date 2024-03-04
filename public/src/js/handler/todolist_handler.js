// config to handle, if database is available


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
            }



    }); // button on click

    let switch_toDo = $('#toDoSwitch');
    let switchContent = $('#switchContent');

    switch_toDo.on('change', function() {
        console.log("Switched");
        switchContent.toggle();
    });


    const renderStatus = function (data, type, row) {
        if(data === 0) {
            return `In Progress`;
        } else {
            return 'Finished';
        }
    };

    let localTime = 'de-De'; /// switch to your location => America: 'en-US', Germany: 'de-De'
    const renderDate = function (data, type, row) {
        let date = new Date(data);
        // Format date as dd.mm.yyyy
        return date.toLocaleDateString(localTime, {
            day: '2-digit', //
            month: '2-digit',
            year: 'numeric'
        });
    };

    $(document).ready(function () {
        // ListDatatable
        todoListDatatable = jQuery('#todoListDatatable').DataTable({
            "order": [
                [1, "asc"]
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
                {"data": "dbf_str_task"},
                {
                    "data": "dbf_datetime_created",
                    "render": renderDate
                },
                {
                    "data": "dbf_int_status",
                    "render": renderStatus
                },

                // Add new column for action buttons
                {
                    "data": "dbf_int_index",
                    "sortable": false,
                    "render": function (data, type, row) {
                        let updateBtn = ` <button class="btn btn-warning btn-sm btn_updateTask" >Update</button>`;
                        let deleteBtn = ` <button class="btn btn-danger btn-sm btn_deleteTask">Delete</button>`;



                        return `
                        ${updateBtn}&ensp;
                        ${deleteBtn}
                        
                        
                    `;
                    }
                }

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


        // Delete Task
        $(document).on('click', '.btn_deleteTask', function () {
            const row = todoListDatatable.row( $(this).parents('tr') );
            const rowData = row.data();
            const itemID = rowData.dbf_int_index;

            $.post('/todolist/delete_task', {dbf_int_index: itemID})
                .done(function () {
                    todoListDatatable.ajax.reload();

                })
                .fail(function (error) {
                    //console.log(error);
                });
        });  // Delete Contact




    }); // document ready
} // todoListHandler