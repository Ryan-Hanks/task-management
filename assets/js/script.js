// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));


function readTasksFromStorage() {
    let tasks = tasklist;
    console.log(tasks);

    if (!tasks) {
        tasks = [];
    }

    return tasks;
}

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

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

 const cardDueDate = $('<p>');
 cardDueDate.addClass("card-text");
 cardDueDate.text(task.dueDate);

 const cardDeleteBtn = $('<button>');
 cardDeleteBtn.addClass('btn btn-danger delete');
 cardDeleteBtn.text('Delete');
 cardDeleteBtn.attr('data-task-id');

 cardDeleteBtn.on('click', handleDeleteTask);
 
 cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
 card.append(cardHeader, cardBody);
 console.log(card);
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

    for (let task of taskList) {
        if(task.status === "to-do"){
            todoList.append(createTaskCard(task));
        } else if(task.status === "in-progress"){
            inProgressList.append(createTaskCard(task));
        } else if(task.status === "done"){
            completeList.append(createTaskCard(task));
        }
    };

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const task = {
        id: generateTaskId(),
        title: $('#taskTitle').val(),
        description: $('#taskDescription').val(),
        dueDate: $('#taskDueDate').val(),
        status: 'to-do',
    };

    taskList.push(task);
    saveTasksToStorage(taskList)
    renderTaskList();

    $('#taskTitle').val('');
    $('#taskDescription').val('');
    $('#taskDueDate').val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    const taskId = $(this).attr('data-id');
    const tasks = readTasksFromStorage();


    tasks.forEach((task) => {
        if (task.id === taskId) {
            tasks.splice(tasks.indexOf(task), 1);
        }
    });

    saveTasksToStorage(tasks);

    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();

    const tasks = readTasksFromStorage();

    const taskID = ui.draggable.attr('data-task-id');

    const newStatus = event.target.id;

    for (let task of tasks) {
        if (task.id === taskID) {
            task.status = newStatus;
        }
    }

    saveTasksToStorage(tasks);
    renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('#taskForm').on("submit", handleAddTask);

    $(".lane").droppable({
        accept: ".draggable",
        drop: handleDrop,
    });

    $("#taskDueDate").datepicker({
        changeMonth: true,
        changeYear: true,
    });
});
