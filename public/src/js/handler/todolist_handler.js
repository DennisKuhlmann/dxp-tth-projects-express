
// config to handle, if database is available
let databaseAvailable = false;


export function addToDo() {
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
}