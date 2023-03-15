document.addEventListener("keyup", function(event) {
    console.log('keyup event occurred');
    const target = event.target;
    if (target.matches("input[type='text'], input[type='search'], textarea")) {
        console.log('sending message to background page');
        const text = target.value;
        chrome.runtime.sendMessage({ type: 'text', text: text });
    }
  });
  
  // Listen for messages from popup page
  chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'replace') {
          const error = message.error;
          const suggestion = message.suggestion;
  
          // Replace error with suggestion in active element
          const activeElement = document.activeElement;
          if (activeElement.matches("input[type='text'], input[type='search'], textarea")) {
              const regex = new RegExp(error, "g");
              activeElement.value = activeElement.value.replace(regex, suggestion);
          }
      }
  });