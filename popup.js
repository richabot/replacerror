chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'suggestions') {
        const suggestions = message.suggestions;

        // Display suggestions to the user
        const suggestionsDiv = document.getElementById("suggestions");
        suggestionsDiv.innerHTML = "";
        for (let i = 0; i < suggestions.length; i++) {
            const suggestion = suggestions[i];
            const suggestionElement = document.createElement("div");
            suggestionElement.innerHTML = `Did you mean <span class="suggestion">${suggestion.suggestion}</span> instead of <span class="error">${suggestion.error}</span>?`;
            suggestionElement.onclick = function() {
                // Send message to content script to replace error with suggestion
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: 'replace', error: suggestion.error, suggestion: suggestion.suggestion });
                });
                suggestionsDiv.innerHTML = "";
            }
            suggestionsDiv.appendChild(suggestionElement);
        }
    }
});