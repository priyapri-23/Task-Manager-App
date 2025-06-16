document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId"); // Get user ID from storage
    const taskInput = document.getElementById("taskInput");
    const addButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const logoutButton = document.getElementById("logout");

    // ✅ Store guest tasks locally
    let tasks = JSON.parse(localStorage.getItem("guestTasks")) || [];

    // ✅ Read: Load tasks for guests or registered users
    async function loadTasks() {
        taskList.innerHTML = "";

        if (!userId) {
            tasks.forEach((task, index) => {
                const listItem = createTaskElement(task.task, index, false, task.completed);
                taskList.appendChild(listItem);
            });
            return;
        }

        try {
            const response = await fetch(`https://your-api-url/tasks/${userId}`);
            const dbTasks = await response.json();
            dbTasks.forEach(task => {
                const listItem = createTaskElement(task.task, task._id, true, task.completed);
                taskList.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    function createTaskElement(taskText, id, isDBTask, completed = false) {
        const listItem = document.createElement("li");
        listItem.textContent = taskText || "Unnamed Task";

        if (completed) listItem.classList.add("completed");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.addEventListener("change", async () => {
            if (isDBTask) {
                await fetch(`https://your-api-url/task/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completed: checkbox.checked }),
                });
            } else {
                tasks[id].completed = checkbox.checked;
                localStorage.setItem("guestTasks", JSON.stringify(tasks));
            }
            loadTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.classList.add("delete-btn");


        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", async () => {
            if (isDBTask) {
                await fetch(`https://your-api-url/task/${id}`, { method: "DELETE" });
            } else {
                tasks.splice(id, 1);
                localStorage.setItem("guestTasks", JSON.stringify(tasks));
            }
            loadTasks();
        });

        listItem.prepend(checkbox);
        listItem.appendChild(deleteButton);
        return listItem;
    }

    // ✅ Create: Add tasks for guest users or registered users
    addButton.addEventListener("click", async () => {
        if (taskInput.value.trim() !== "") {
            if (!userId) {
                tasks.push({ task: taskInput.value, completed: false });
                localStorage.setItem("guestTasks", JSON.stringify(tasks));
            } else {
                await fetch("https://your-api-url/task", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, task: taskInput.value }),
                });
            }
            taskInput.value = "";
            loadTasks(); // ✅ Refresh task list immediately after adding a task
        }
    });
    // ✅ Logout: Redirect to login page
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("userId");
        window.location.href = "login.html";
    });

    loadTasks();
});
