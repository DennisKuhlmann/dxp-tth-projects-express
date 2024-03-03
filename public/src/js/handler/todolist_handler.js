
// config to handle, if database is available
let databaseAvailable = false;


export function addToDo() {
    let button = $('#addToDo');
    let input = $('#toDoContent');
    let ul = $('#ul_toDo');
    let alertDiv = $('#inputAlert');  // Name geändert

    button.on('click', function() {

        // if input is empty
        if(input.val() !== "") {
                if(databaseAvailable) {
                        jQuery.post('/todolist/addtodo', {
                            "item": input.val()
                        })
                            .done(function(response) {
                                alertDiv.text(response).slideUp(2000);
                                //alertDiv.css('display', 'block');
                                input.val("");
                            })
                            .fail(function(jqXHR, textStatus, errorMessage) {
                                //alertDiv.text(errorMessage).slideUp(2000);
                                alertDiv.css('display', 'block');
                            });
                    } else {
                    ul.append(`<li> ${input.val()} </li>`);
                    input.val("");
                }// if databaseAvailable

        } else {
            alertDiv.text('Please enter a To-Do!').slideUp(2000);
            alertDiv.css('display', 'block');
        } // if input is empty

    }); // button on click

    let switch_toDo = $('#toDoSwitch');
    let switchContent = $('#switchContent');

    switch_toDo.on('change', function() {
        console.log("Switched");
        switchContent.toggle();
    });
}