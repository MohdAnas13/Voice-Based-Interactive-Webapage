<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Voice Assistant</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>AI Voice Assistant</h1>
            <div class="status" id="status">Status: Ready</div>
        </header>
        
        <div class="interaction-area">
            <button id="startVoice" class="pulse">Start Voice Recognition</button>
            <div id="output" class="output">Voice output will appear here...</div>
            
            <div class="input-group">
                <input type="text" id="textInput" placeholder="Type your message or command...">
                <button id="sendText">Send</button>
            </div>

            <div class="search-container">
                <div id="searchResults" class="search-results"></div>
                <div id="searchFilters" class="search-filters"></div>
            </div>
        </div>

        <div class="commands">
            <h2>Available Commands</h2>
            <div class="command-grid">
                <div class="command-card">
                    <h3>Search</h3>
                    <p>"search [topic]"</p>
                </div>
                <div class="command-card">
                    <h3>Calculate</h3>
                    <p>"calculate [expression]"</p>
                </div>
                <div class="command-card">
                    <h3>Time & Date</h3>
                    <p>"current time/date"</p>
                </div>
                <div class="command-card">
                    <h3>Help</h3>
                    <p>"show commands"</p>
                </div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
