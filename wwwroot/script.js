function showSuccess(message) {
    document.getElementById("errorMsg").textContent="";
    const el = document.getElementById("successMsg");
    el.textContent = message;

    setTimeout(()=>{
        el.textContent="";
    }, 3000);
}

function showError (message){
    document.getElementById("successMsg").textContent="";
    const el = document.getElementById("errorMsg");
    el.textContent = message;
}

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
                    }).then(res => {
                        if(!res.ok) throw "Failed to update task";
                        loadTasks();
                    })
                    .catch(err=>showError(err));    
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

                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = "Cancel";

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
                    li.insertBefore(cancelBtn, saveBtn.nextSibling);

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
                        }).then(res =>{
                            if(!res.ok){
                                return res.text().then(msg => {throw msg});
                            }
                            showSuccess("Task updated");
                            loadTasks();
                        })
                        .catch(err=>{
                            errorMsgEdit.textContent = err;
                        });

                        
                    }
                    cancelBtn.onclick = function () {
                        li.replaceChild(titleSpan, input);

                        errorMsgEdit.remove();

                        li.replaceChild(editBtn, saveBtn);

                        cancelBtn.remove();
                    };

                    

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
    const input = document.getElementById("title").value;
    const title = input.trim();
    //const errorMsg = document.getElementById("errorMsg");

    if(title === ""){
        showError("Field empty");
        //errorMsg.textContent = "Field empty";
        //console.log("no issues");
        return;
    }

    fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title })
    }).then(res => {
        if(!res.ok){
            return res.text().then(msg =>{throw msg;});
        }
        return res.json();
    })
    .then(()=>{
        showSuccess("Task added");
        input.value = "";
        loadTasks();
    })
    .catch(err=>{
        showError(err);
    });
}

function deleteTask(id) {
    if(!confirm("Are you sure you wanna delete the task?")){
        return;
    }
    fetch("/tasks/" + id, {
        method: "DELETE"
    }).then(res => {
        if(!res.ok){
            throw "Failed to delete the task";
        }
        showSuccess("Task deleted");
        loadTasks();
    })
    .catch(err => showError(err));
}

loadTasks();