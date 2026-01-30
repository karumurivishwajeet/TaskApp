let allTasks = [];
let currentStatusFilter = "all";
let currentSort = "none";

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

function setStatusFilter (status){
    currentStatusFilter = status;
    applyFilters();
}

function setSort (sortType){
    currentSort = sortType;
    applyFilters();
}

function showLoading(){
    document.getElementById("loadingMsg").style.display = "block";
}

function hideLoading(){
    document.getElementById("loadingMsg").style.display = "none";
}

function handleAddKey(event){
    if(event.key === "Enter"){
        addTask();
    }
}

function loadTasks(){
    showLoading();
    fetch("/tasks")
        .then(res=> res.json())
        .then(tasks => {
            allTasks = tasks;
            applyFilters();
            hideLoading();
            // const list = document.getElementById("list");
            // list.innerHTML = "";

            // tasks.forEach((t, index) => {
            //     const li = document.createElement("li");

            //     const checkbox = document.createElement("input");
            //     checkbox.type = "checkbox";
            //     checkbox.checked = t.isCompleted;

            //     checkbox.onchange = function(){
            //         fetch("/tasks/" + t.id + "/toggle", {
            //             method: "PUT"
            //         }).then(res => {
            //             if(!res.ok) throw "Failed to update task";
            //             loadTasks();
            //         })
            //         .catch(err=>showError(err));    
            //     }


            //     if(t.isCompleted){
            //         li.style.textDecoration = "line-through";
            //     }
                
            //     const displayNumber = index + 1;
            //     const titleSpan = document.createElement("span");
            //     titleSpan.textContent = displayNumber + " . " + t.title + " ";

            //     const prioritySpan = document.createElement("span");
            //     prioritySpan.textContent = " [" + t.priority + "] ";

            //     const dueDateSpan = document.createElement("span");
            //     if(t.dueDate){
            //         dueDateSpan.textContent = " (Due: " + t.dueDate.split("T")[0] + ")";
            //     }

            //     const deleteBtn = document.createElement("button");
            //     deleteBtn.textContent = "Delete";
            //     deleteBtn.onclick = function() {
            //         deleteTask(t.id);
            //     };

            //     const editBtn = document.createElement("button");
            //     editBtn.textContent = "Edit";

            //     const cancelBtn = document.createElement("button");
            //     cancelBtn.textContent = "Cancel";

            //     editBtn.onclick = function(){

            //         const input = document.createElement("input");
            //         input.type = "text";
            //         input.value = t.title;

            //         const prioritySelect = document.createElement("select");
            //         ["Low", "Medium", "High"].forEach(p=>{
            //             const opt = document.createElement("option");
            //             opt.value = p;
            //             opt.textContent = p;
            //             if(p === t.priority) opt.selected = true;
            //             prioritySelect.appendChild(opt);
            //         })

            //         const dueDateInput = document.createElement("input");
            //         dueDateInput.type = "date";

            //         if(t.dueDate){
            //             dueDateInput.value = t.dueDate.split("T")[0];
            //         }

            //         const errorMsgEdit = document.createElement("p");
            //         errorMsgEdit.style.color = "red";
            //         errorMsgEdit.textContent = "";


            //         const saveBtn = document.createElement("button");
            //         saveBtn.textContent = "Save";

            //         li.replaceChild(input, titleSpan);
            //         li.insertBefore(prioritySelect, input.nextSibling);
            //         li.insertBefore(dueDateInput, prioritySelect.nextSibling);
            //         li.insertBefore(errorMsgEdit, input);
            //         li.replaceChild(saveBtn, editBtn);
            //         li.insertBefore(cancelBtn, saveBtn.nextSibling);
                    

                    

            //         saveBtn.onclick = function(){
            //             const newTitle = input.value.trim();
            //             errorMsgEdit.style.color = "red";
            //             if (newTitle === ""){
            //                 errorMsgEdit.textContent = "Field empty";
            //                 //alert("Title cannot be empty");
            //                 return;
            //             }
            //             errorMsgEdit.textContent = "";
            //             fetch("/tasks/" +t.id,{
            //                 method: "PUT",
            //                 headers:{"Content-Type": "application/json"},
            //                 body: JSON.stringify({title: newTitle, priority: prioritySelect.value, dueDate: dueDateInput.value || null})
            //             }).then(res =>{
            //                 if(!res.ok){
            //                     return res.text().then(msg => {throw msg});
            //                 }
            //                 showSuccess("Task updated");
            //                 loadTasks();
            //             })
            //             .catch(err=>{
            //                 errorMsgEdit.textContent = err;
            //             });

                        
            //         }
            //         cancelBtn.onclick = function () {
            //             li.replaceChild(titleSpan, input);

            //             prioritySelect.remove();

            //             dueDateInput.remove();
                        
            //             errorMsgEdit.remove();

            //             li.replaceChild(editBtn, saveBtn);

            //             cancelBtn.remove();
            //         };

                    

            //         // const newTitle = prompt("Edit task title:", t.title);
            //         // if(!newTitle) return;

                    
            //     };

            //     list.appendChild(li);
            //     li.appendChild(titleSpan);
            //     li.appendChild(checkbox);//li.appendChild(text);
            //     li.appendChild(editBtn);
            //     li.appendChild(deleteBtn);
            //     li.appendChild(prioritySpan);
            //     li.appendChild(dueDateSpan);
            //     //li.appendChild(titleSpan);
            // });
        })
        .catch(err=>{
            showError("Failed to load tasks");
            hideLoading();
        });
}

function addTask() {
    showLoading();
    const input = document.getElementById("title");
    const title = input.value.trim();
    //const errorMsg = document.getElementById("errorMsg");
    const priority = document.getElementById("priority").value;
    const dueDateValue = document.getElementById("dueDate").value;
    const dueDate = dueDateValue ? dueDateValue : null;

    if(title === ""){
        showError("Field empty");
        //errorMsg.textContent = "Field empty";
        //console.log("no issues");
        return;
    }

    fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority, dueDate })
    }).then(res => {
        if(!res.ok){
            return res.text().then(msg =>{throw msg;});
        }
        return res.json();
    })
    .then(()=>{
        showSuccess("Task added");
        input.value = "";
        hideLoading();
        loadTasks();
    })
    .catch(err=>{
        hideLoading();
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

function renderTasks(tasks){
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

            const prioritySpan = document.createElement("span");
            prioritySpan.textContent = " [" + t.priority + "] ";

            const dueDateSpan = document.createElement("span");
            if(t.dueDate){
                dueDateSpan.textContent = " (Due: " + t.dueDate.split("T")[0] + ")";
            }

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

                const prioritySelect = document.createElement("select");
                ["Low", "Medium", "High"].forEach(p=>{
                    const opt = document.createElement("option");
                    opt.value = p;
                    opt.textContent = p;
                    if(p === t.priority) opt.selected = true;
                    prioritySelect.appendChild(opt);
                })

                const dueDateInput = document.createElement("input");
                dueDateInput.type = "date";

                if(t.dueDate){
                    dueDateInput.value = t.dueDate.split("T")[0];
                }

                const errorMsgEdit = document.createElement("p");
                errorMsgEdit.style.color = "red";
                errorMsgEdit.textContent = "";


                const saveBtn = document.createElement("button");
                saveBtn.textContent = "Save";

                li.replaceChild(input, titleSpan);
                li.insertBefore(prioritySelect, input.nextSibling);
                li.insertBefore(dueDateInput, prioritySelect.nextSibling);
                li.insertBefore(errorMsgEdit, input);
                li.replaceChild(saveBtn, editBtn);
                li.insertBefore(cancelBtn, saveBtn.nextSibling);
                
                input.focus();

                input.onkeydown = function (event){
                    if(event.key === "Enter"){
                        saveBtn.click();
                    }
                    else if(event.key === "Escape"){
                        cancelBtn.click();
                    }
                };
                

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
                        body: JSON.stringify({title: newTitle, priority: prioritySelect.value, dueDate: dueDateInput.value || null})
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

                    prioritySelect.remove();

                    dueDateInput.remove();
                    
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
            li.appendChild(prioritySpan);
            li.appendChild(dueDateSpan);
            //li.appendChild(titleSpan);
        });
}

function searchTasks(){
    applyFilters();
}

function applyFilters(){
    const query = document.getElementById("searchBox").value.toLowerCase();

    let filtered = allTasks;

    if (query){
        filtered = filtered.filter(t=>
            t.title.toLowerCase().includes(query)
        );
    }

    if (currentStatusFilter === "completed"){
        filtered = filtered.filter(t=> t.isCompleted);
    }
    else if (currentStatusFilter === "pending"){
        filtered = filtered.filter(t=> !t.isCompleted);
    }

    if (currentSort === "title"){
        filtered .sort((a, b) => a.title.localeCompare(b.title));
    }
    else if (currentSort === "priority"){
        const order = {High: 1, Medium: 2, Low: 3};
        filtered.sort((a,b) => order[a.priority]-order[b.priority]);
    }
    else if(currentSort === "dueDate"){
        filtered.sort((a,b)=>{
            if(!a.dueDate) return 1;
            if(!b.dueDate) return -1;
            return new Date(a.dueDate)-new Date(b.dueDate);
        });
    }

    renderTasks(filtered);
}

loadTasks();