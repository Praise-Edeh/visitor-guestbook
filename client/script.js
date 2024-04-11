const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messageList = document.getElementById('messageList');

messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = messageInput.value;
    if (message.trim() === '') return;
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        if (!response.ok) {
            throw new Error('Failed to submit message');
        }
        messageInput.value = '';
        fetchMessages();
    } catch (error) {
        console.error(error);
    }
});

async function fetchMessages() {
    try {
        const response = await fetch('/api/messages');
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const messages = await response.json();
        renderMessages(messages);
    } catch (error) {
        console.error(error);
    }
}

function renderMessages(messages) {
    messageList.innerHTML = '';
    messages.forEach(message => {
        const li = document.createElement('li');
        li.textContent = message.message;
        messageList.appendChild(li);
    });
}

// Fetch messages on page load
fetchMessages();
