class VoiceAssistant {
    constructor() {
        this.setupElements();
        this.setupSpeechRecognition();
        this.setupEventListeners();
        this.searchHistory = [];
    }

    setupElements() {
        this.startBtn = document.getElementById('startVoice');
        this.sendTextBtn = document.getElementById('sendText');
        this.output = document.getElementById('output');
        this.textInput = document.getElementById('textInput');
        this.searchResults = document.getElementById('searchResults');
        this.status = document.getElementById('status');
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.lang = 'en-US';
            this.setupRecognitionEvents();
        } else {
            this.handleSpeechRecognitionError();
        }
    }

    setupRecognitionEvents() {
        this.recognition.onstart = () => {
            this.updateStatus('Listening...', 'listening');
            this.startBtn.disabled = true;
        };

        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript;
            this.output.textContent = `Voice Input: ${command}`;
            this.processCommand(command);
        };

        this.recognition.onend = () => {
            this.updateStatus('Ready', 'ready');
            this.startBtn.disabled = false;
        };

        this.recognition.onerror = (event) => {
            this.handleSpeechRecognitionError(event);
        };
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startListening());
        this.sendTextBtn.addEventListener('click', () => this.processTextInput());
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.processTextInput();
        });
    }

    startListening() {
        if (this.recognition) {
            this.recognition.start();
        }
    }

    processTextInput() {
        const text = this.textInput.value.trim();
        if (text) {
            this.output.textContent = `Text Input: ${text}`;
            this.processCommand(text);
            this.textInput.value = '';
        }
    }

    async processCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        if (cmd.startsWith('search')) {
            await this.handleSearch(cmd.replace('search', '').trim());
        } else if (cmd.startsWith('calculate')) {
            this.handleCalculation(cmd.replace('calculate', '').trim());
        } else if (cmd.includes('time')) {
            this.handleTimeRequest();
        } else if (cmd.includes('date')) {
            this.handleDateRequest();
        } else if (cmd.includes('help') || cmd.includes('commands')) {
            this.showHelp();
        } else {
            this.speak('Command not recognized. Say "help" for available commands.');
        }
    }

    async handleSearch(query) {
        if (!query) {
            this.speak('Please specify what you want to search for.');
            return;
        }

        try {
            this.updateStatus('Searching...', 'searching');
            
            // Simulated search results with categories
            const results = await this.performSearch(query);
            this.searchHistory.push({ query, timestamp: new Date() });
            
            this.displaySearchResults(results, query);
            this.speak(`Here are the search results for ${query}`);
        } catch (error) {
            console.error('Search error:', error);
            this.speak('Sorry, there was an error with the search.');
        } finally {
            this.updateStatus('Ready', 'ready');
        }
    }

    async performSearch(query) {
        // Simulated search API call
        return {
            web: [
                {
                    title: `Results for "${query}"`,
                    url: `https://example.com/search?q=${query}`,
                    snippet: 'This is a detailed search result snippet that would normally come from a search engine API.'
                },
                {
                    title: 'Secondary Result',
                    url: 'https://example.com/secondary',
                    snippet: 'Additional information related to your search query would appear here.'
                }
            ],
            images: [
                { title: 'Image 1', thumbnail: 'image1.jpg' },
                { title: 'Image 2', thumbnail: 'image2.jpg' }
            ],
            videos: [
                { title: 'Video 1', duration: '3:45' },
                { title: 'Video 2', duration: '2:30' }
            ]
        };
    }

    displaySearchResults(results, query) {
        const resultsTabs = `
            <div class="search-tabs">
                <button class="active" onclick="assistant.switchTab('web')">Web</button>
                <button onclick="assistant.switchTab('images')">Images</button>
                <button onclick="assistant.switchTab('videos')">Videos</button>
            </div>
            <div id="webResults">
                ${results.web.map(result => `
                    <div class="search-result">
                        <h4>${result.title}</h4>
                        <a href="${result.url}" target="_blank">${result.url}</a>
                        <p>${result.snippet}</p>
                    </div>
                `).join('')}
            </div>
        `;

        this.searchResults.innerHTML = resultsTabs;
        window.assistant = this; // Make instance available for tab switching
    }

    switchTab(tab) {
        // Update tab content based on selection
        document.querySelectorAll('.search-tabs button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    handleCalculation(expression) {
        try {
            // Safe evaluation of mathematical expressions
            const result = new Function('return ' + expression)();
            this.speak(`The result is ${result}`);
            this.output.textContent = `${expression} = ${result}`;
        } catch (error) {
            this.speak('Sorry, I could not calculate that expression.');
        }
    }

    handleTimeRequest() {
        const time = new Date().toLocaleTimeString();
        this.speak(`The current time is ${time}`);
        this.output.textContent = time;
    }

    handleDateRequest() {
        const date = new Date().toLocaleDateString();
        this.speak(`Today's date is ${date}`);
        this.output.textContent = date;
    }

    showHelp() {
        const helpText = `
            Available Commands:
            • "search [topic]" - Search for information
            • "calculate [expression]" - Perform calculations
            • "time" - Get current time
            • "date" - Get current date
            • "help" - Show this help message
        `;
        this.speak('Here are the available commands');
        this.output.textContent = helpText;
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }

    updateStatus(message, state) {
        this.status.textContent = `Status: ${message}`;
        this.status.className = `status ${state}`;
    }

    handleSpeechRecognitionError(event = null) {
        const errorMessage = event ? 
            `Speech recognition error: ${event.error}` : 
            'Speech recognition not supported in this browser';
        this.startBtn.disabled = true;
        this.updateStatus(errorMessage, 'error');
        console.error(errorMessage);
    }
}

// Initialize the voice assistant
const assistant = new VoiceAssistant();
