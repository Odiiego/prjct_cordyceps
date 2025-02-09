document.getElementById('ask').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      const question = window.getSelection().toString();
      chrome.runtime.sendMessage(
        { action: 'searchBrainly', question },
        (response) => {
          console.clear();
          console.log(response);
        },
      );
    },
  });
});
