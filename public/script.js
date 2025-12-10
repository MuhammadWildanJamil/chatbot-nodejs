
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');


const addMessage = (sender, message) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);

    
    if (sender === 'bot') {
        
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        message = message.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        message = message.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    }

    messageElement.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(messageElement);
    
    chatBox.scrollTop = chatBox.scrollHeight;
};


const showTypingIndicator = () => {
    
    const typingElement = document.createElement('div');
    typingElement.id = 'typing-indicator';
    typingElement.classList.add('chat-message', 'bot-message');
    typingElement.innerHTML = `
        <div class="typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    chatBox.appendChild(typingElement);
    chatBox.scrollTop = chatBox.scrollHeight;
};

const hideTypingIndicator = () => {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
};


const getBotResponse = async (userMessage) => {
    showTypingIndicator();
    try {
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        hideTypingIndicator(); 

        if (!response.ok) {
            
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error || `Gagal mendapatkan respons dari server. Status: ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        addMessage('bot', data.reply);

    } catch (error) {
        
        hideTypingIndicator();
        console.error('Error:', error);
        addMessage('bot', `Maaf, terjadi masalah: ${error.message}`);
    }
};


chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const userMessage = userInput.value.trim();

    if (userMessage) {
        addMessage('user', userMessage);
        userInput.value = '';
        
        getBotResponse(userMessage);
    }
});
