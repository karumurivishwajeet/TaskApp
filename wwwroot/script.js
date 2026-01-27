function loadTasks(){
    fetch("/tasks")
        .then(res=> res.json())
        .then(tasks => {
            const list = document.getElementById("list");
            list.innerHTML = "";

            tasks.forEach((t, index) => {
                const li = document.createElement("li");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = t.isCompleted;

                checkbox.onchange = function(){
                    fetch("/tasks/" + t.id + "/toggle", {
                        method: "PUT"
                    }).then(() => {
                        loadTasks();
                    });    
                }


                if(t.isCompleted){
                    li.style.textDecoration = "line-through";
                }
                
                const displayNumber = index + 1;
                const titleSpan = document.createElement("span");
                titleSpan.textContent = displayNumber + " . " + t.title + " ";

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.onclick = function() {
                    deleteTask(t.id);
                };

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";

                editBtn.onclick = function(){

                    const input = document.createElement("input");
                    input.type = "text";
                    input.value = t.title;

                    const errorMsgEdit = document.createElement("p");
                    errorMsgEdit.style.color = "red";
                    errorMsgEdit.textContent = "";


                    const saveBtn = document.createElement("button");
                    saveBtn.textContent = "Save";

                    li.replaceChild(input, titleSpan);
                    li.insertBefore(errorMsgEdit, input);
                    li.replaceChild(saveBtn, editBtn);

                    saveBtn.onclick = function(){
                        const newTitle = input.value.trim();
                        errorMsgEdit.style.color = "red";
                        if (newTitle === ""){
                            errorMsgEdit.textContent = "Field empty";
                            //alert("Title cannot be empty");
                            return;
                        }
                        errorMsgEdit.textContent = "";
                        fetch("/tasks/" +t.id,{
                            method: "PUT",
                            headers:{"Content-Type": "application/json"},
                            body: JSON.stringify({title: newTitle})
                        }).then(loadTasks);
                    }

                    // const newTitle = prompt("Edit task title:", t.title);
                    // if(!newTitle) return;

                    
                };

                list.appendChild(li);
                li.appendChild(titleSpan);
                li.appendChild(checkbox);//li.appendChild(text);
                li.appendChild(editBtn);
                li.appendChild(deleteBtn);
                //li.appendChild(titleSpan);
            });
        });
}

function addTask() {
    const title = document.getElementById("title").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    if(title === ""){
        errorMsg.textContent = "Field empty";
        //console.log("no issues");
        return;
    }

    fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title })
    }).then(() => {
        document.getElementById("title").value = "";
        loadTasks();
    });
}

function deleteTask(id) {
    fetch("/tasks/" + id, {
        method: "DELETE"
    }).then(() => {
        loadTasks();
    });
}

loadTasks();