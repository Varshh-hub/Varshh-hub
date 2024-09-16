document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortByDateButton = document.getElementById('sort-date');
    const sortByCompletionButton = document.getElementById('sort-completion');
    const toggleThemeButton = document.getElementById('toggle-theme');
    const fullscreenToggleButton = document.getElementById('fullscreen-toggle');

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach(task => createTaskElement(task.text, task.completed, task.date));
    };

    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll('#task-list li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed'),
                date: li.dataset.date
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const createTaskElement = (text, completed = false, date = new Date().toISOString()) => {
        const li = document.createElement('li');
        if (completed) li.classList.add('completed');
        li.dataset.date = date;

        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = text;

        const actions = document.createElement('div');
        actions.classList.add('task-actions');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(li));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(li));

        const toggleButton = document.createElement('button');
        toggleButton.textContent = completed ? 'Undo' : 'Complete';
        toggleButton.addEventListener('click', () => toggleTask(li, toggleButton));

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        actions.appendChild(toggleButton);

        li.appendChild(taskText);
        li.appendChild(actions);
        taskList.appendChild(li);

        saveTasks();
    };

    addTaskButton.addEventListener('click', () => {
        const text = newTaskInput.value.trim();
        if (text) {
            createTaskElement(text);
            newTaskInput.value = '';
        }
    });

    const editTask = (li) => {
        const taskText = li.querySelector('.task-text');
        const newText = prompt('Edit task:', taskText.textContent);
        if (newText) {
            taskText.textContent = newText.trim();
            saveTasks();
        }
    };

    const deleteTask = (li) => {
        if (confirm('Are you sure you want to delete this task?')) {
            li.remove();
            saveTasks();
        }
    };

    const toggleTask = (li, button) => {
        li.classList.toggle('completed');
        button.textContent = li.classList.contains('completed') ? 'Undo' : 'Complete';
        saveTasks();
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.querySelectorAll('#task-list li').forEach(li => {
                if (filter === 'all') {
                    li.style.display = 'flex';
                } else if (filter === 'active') {
                    li.style.display = li.classList.contains('completed') ? 'none' : 'flex';
                } else if (filter === 'completed') {
                    li.style.display = li.classList.contains('completed') ? 'flex' : 'none';
                }
            });
        });
    });

    sortByDateButton.addEventListener('click', () => {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
        tasks.forEach(task => taskList.appendChild(task));
    });

    sortByCompletionButton.addEventListener('click', () => {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => a.classList.contains('completed') - b.classList.contains('completed'));
        tasks.forEach(task => taskList.appendChild(task));
    });

    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    fullscreenToggleButton.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    });

    loadTasks();
});
