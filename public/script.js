// 1. Seleksi Elemen DOM
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// 2. Fungsi untuk menambahkan pesan ke chat box
const addMessage = (sender, message) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);

    // Parsing Markdown sederhana untuk tampilan yang lebih baik
    if (sender === 'bot') {
        // Ganti **text** dengan <strong>text</strong>
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Ganti *text* dengan <em>text</em>
        message = message.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Ganti ```code``` dengan <pre><code>code</code></pre>
        message = message.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    }

    messageElement.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(messageElement);
    // Auto-scroll ke pesan terbaru
    chatBox.scrollTop = chatBox.scrollHeight;
};

// 3. Fungsi untuk menampilkan/menghapus indikator "mengetik"
const showTypingIndicator = () => {
    // Buat elemen unik untuk indikator agar mudah ditemukan dan dihapus
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

// 4. Fungsi untuk mendapatkan respons dari backend kita
const getBotResponse = async (userMessage) => {
    showTypingIndicator();
    try {
        // Kirim pesan ke backend kita di endpoint /api/chat
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        hideTypingIndicator(); // Sembunyikan indikator setelah respons diterima

        if (!response.ok) {
            // Coba baca pesan error dari server jika ada
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error || `Gagal mendapatkan respons dari server. Status: ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        addMessage('bot', data.reply);

    } catch (error) {
        // Pastikan indikator disembunyikan jika terjadi error
        hideTypingIndicator();
        console.error('Error:', error);
        addMessage('bot', `Maaf, terjadi masalah: ${error.message}`);
    }
};

// 5. Event listener untuk form submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah form dari reload halaman
    const userMessage = userInput.value.trim();

    if (userMessage) {
        addMessage('user', userMessage);
        userInput.value = '';
        // Langsung panggil fungsi untuk mendapatkan balasan bot
        getBotResponse(userMessage);
    }
});
