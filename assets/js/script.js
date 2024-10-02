// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null) {
        nextId = 1;
    } else {
        nextId++;
    }

    localStorage.setItem('nextId', JSON.stringify(nextId));
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
 const card = $("<div>");
 card.addClass("card task-card draggable");
 card.attr("data-id", task.id);

 const cardHeader = $("<div>");
 cardHeader.addClass("card-header");
 cardHeader.text(task.title);

 const cardBody = $("<div>");
 cardBody.addClass("card-body");

 const cardDescription = $("<p>");
 cardDescription.addClass("card-text");
 cardDescription.text(task.description);
 
 cardBody.append(cardDescription);
 card.append(CardHeader, cardBody);
 return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if(!taskList) {
        taskList = [];
    }

    const todoList = $("#todo-cards");
    todoList.empty();
        
    const inProgressList = $("#in-progress-cards");
    inProgressList.empty();
        
    const completeList = $("#done-cards");
    completeList.empty();

    for (let index = 0; index < taskList.length; index++) {
        const task = taskList[index];

        if(task.status === "to-do"){
            todoList.append(createTaskCard(task));
        } else if(task.status === "in-progress"){
            inProgressList.append(createTaskCard(task));
        } else if(task.status === "done"){
            completeList.append(createTaskCard(task));
        }
    };

    $('.draggable').draggable({});
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const title = $('#taskTitle').val();
    const description = $('#taskDescription').val();
    const dueDate = $('#taskDueDate').val();

    const task = {
        id: generateTaskId(),
        title,
        description,
        dueDate,
        status: 'to-do',
    };

    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

    $('#taskTitle').val('');
    $('#taskDescription').val('');
    $('#taskDueDate').val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('task-form').on("submit", handleAddTask);

    $(".lane").droppable({
        accept: ".draggable",
        drop: handleDrop,
    });

    $("#taskDueDate").datepicker({
        changeMonth: true,
        changeYear: true,
    });
});
