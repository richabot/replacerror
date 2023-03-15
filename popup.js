chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: () => {
            document.addEventListener("keyup", function(event) {
                const target = event.target;
                if (target.matches("input[type='text'], input[type='search'], textarea")) {
                    const text = target.value;
                    chrome.runtime.sendMessage({ type: 'text', text: text });
                }
            });
        }
    });
});

// Listen for messages from background page
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
                replaceWord(target, suggestion.error, suggestion.suggestion);
            }
            suggestionsDiv.appendChild(suggestionElement);
        }
    }
});

function replaceWord(target, error, suggestion) {
    const regex = new RegExp(error, "g");
    target.value = target.value.replace(regex, suggestion);
}