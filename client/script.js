document.addEventListener('DOMContentLoaded', async () => {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messageContainer = document.getElementById('messageContainer');

    // Fetch messages from the server and display them
    async function fetchMessages() {
        const response = await fetch('/api/messages');
        const messages = await response.json();
        messageContainer.innerHTML = messages.map(message => createMessageHTML(message)).join('');
    }

    // Create HTML for each message
    function createMessageHTML(message) {
        return `
            <div class="message">
                <button class="delete-btn" data-id="${message.id}" onclick="deleteMessage(event)">Delete</button>
                <button class="like-btn" data-id="${message.id}" onclick="likeMessage(event)">Like</button>
                ${message.text}
            </div>
        `;
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

    // Delete message
    window.deleteMessage = async (e) => {
        const messageId = e.target.dataset.id;
        await fetch(`/api/messages/${messageId}`, {
            method: 'DELETE'
        });
        await fetchMessages();
    };

    // Like message
    window.likeMessage = async (e) => {
        const messageId = e.target.dataset.id;
        await fetch(`/api/messages/${messageId}/like`, {
            method: 'PUT'
        });
        await fetchMessages();
    };

    // Initial fetch of messages
    await fetchMessages();
});
