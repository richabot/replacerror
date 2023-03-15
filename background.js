chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === 'text') {
        const text = message.text;
        fetch(`https://api.languagetool.org/v2/check?text=${text}&language=en-US`, {
            "method": "GET",
        })
        .then(response => response.json())
        .then(data => {
            const matches = data.matches;
            const suggestions = matches.map(match => {
                return { error: match.context.text.substring(match.context.offset, match.context.offset+match.context.length), suggestion: match.replacements[0].value };
            });
            chrome.runtime.sendMessage({ type: 'suggestions', suggestions: suggestions });
        })
        .catch(err => {
            console.error(err);
        });
    }
});