document.getElementById('ask').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      const question = window.getSelection().toString();
      chrome.runtime.sendMessage({ action: 'searchBrainly', question });
    },
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'renderAnswer' && message.answer) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = message.answer;
  }
});
