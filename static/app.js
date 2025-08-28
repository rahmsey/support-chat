class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        // Toggle chatbox on open button click
        openButton.addEventListener('click', () => this.toggleState(chatBox));

        // Send message on send button click
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        // Send message on Enter key press
        const inputNode = chatBox.querySelector('input');
        inputNode.addEventListener('keyup', (event) => {
            if (event.key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatBox) {
        this.state = !this.state;  // flip the state

        if (this.state) {
            chatBox.classList.add('chatbox--active');
        } else {
            chatBox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatBox) {
        var textField = chatBox.querySelector('input');
        let text1 = textField.value.trim(); // trim whitespace
        if (text1 === "") {
            return;
        }

        // Add user message
        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        // Send to backend
        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2); // corrected
            this.updateChatText(chatBox);
            textField.value = '';
        })
        .catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatBox);
            textField.value = '';
        });
    }

    updateChatText(chatBox) {
        let html = '';
        this.messages.slice().reverse().forEach((item) => {  // corrected
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">'+ item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">'+ item.message + '</div>';
            }
        });

        const chatMessages = chatBox.querySelector('.chatbox__messages');
        chatMessages.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();
