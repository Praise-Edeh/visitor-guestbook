document.addEventListener('DOMContentLoaded', async () => {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messageContainer = document.getElementById('messageContainer');

    // Fetch messages from the server and display them
    async function fetchMessages() {
        const response = await fetch('/api/messages');
        const messages = await response.json();
        messageContainer.innerHTML = messages.map(message => `<div class="message">${message.text}</div>`).join('');
    }

    // Submit message form
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if (text !== '') {
            await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            messageInput.value = '';
            await fetchMessages();
        }
    });

    // Initial fetch of messages
    await fetchMessages();
});
