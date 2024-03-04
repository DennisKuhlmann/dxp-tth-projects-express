// config to handle, if database is available


// Declare your variable outside of both click and ready functions
let taskListDatatable;

export function taskListHandler() {
    let button = $('#addTask');
    let input = $('#taskContent');
    let statusTexts = {
        success: $('#statusTextSuccess'),
        failed: $('#statusTextFailed')
    };

    button.on('click', function() {
        // if input is empty
        if(input.val() !== "") {

                jQuery.post('/tasklist/addtask', {
                    "item": input.val()
                })
                    .done(function(response) {
                        statusTexts.success.text(response).css("display", "block").delay(2000).slideUp(3000);
                        if(taskListDatatable) {
                            taskListDatatable.ajax.reload();
                        }
                        input.val("");
                    })
                    .fail(function(jqXHR, textStatus, errorMessage) {
                        statusTexts.failed.text(errorMessage).css("display", "block").delay(2000).slideUp(3000);
                    });
            }



    }); // button on click

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
        taskListDatatable = jQuery('#taskListDatatable').DataTable({
            "order": [
                [1, "asc"]
            ],
            "processing": true,
            "serverSide": true,
            "initComplete": function (settings, json) {
                jQuery(taskListDatatable).show();
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
                        let updateBtn = ` <button class="btn btn-warning btn-sm btn_updateTask" data-taskID="${data}">Update</button>`;
                        let deleteBtn = ` <button class="btn btn-danger btn-sm btn_deleteTask" data-taskID="${data}">Delete</button>`;

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
                "url": '/tasklist/task_list_datatables',
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
                taskListDatatable.ajax.reload();
            }
        }); // Search Text


        // Delete Task
        $(document).on('click', '.btn_deleteTask', function () {
            const taskID = $(this).attr('data-taskID');


            $.post('/tasklist/delete_task', {
                taskID: taskID
            })
                .done(function () {
                    taskListDatatable.ajax.reload();

                })
                .fail(function (error) {
                    console.log(error);
                });
        });  // Delete Task


        // Update Task
        $(document).on('click', '.btn_updateTask', function () {
            let taskID = $(this).attr('data-taskID');

            $.post('/tasklist/update_task', {
                taskID : taskID
            })
                .done(function () {
                    taskListDatatable.ajax.reload();

                })
                .fail(function (error) {
                    console.log(error);
                });
        });  // Update Contact




    }); // document ready
} // todoListHandler