document.addEventListener('DOMContentLoaded', () => {
    const reminderInterval = 10000; 

    const notifyReminder = (task) => {
        if (Notification.permission === 'granted') {
            new Notification('Reminder', {
                body: `Remember to complete your task: ${task}`,
            });
        }
    };

    const checkReminders = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (!task.completed) {
                notifyReminder(task.text);
            }
        });
    };
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    setInterval(checkReminders, reminderInterval);
});
