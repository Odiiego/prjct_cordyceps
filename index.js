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
    const result = document.getElementById('result');
    result.innerHTML = '';

    if (!message.answer.resposta) {
      result.innerHTML = '<p>Nenhuma resposta escontrada.</p>';
      return;
    }

    const question = document.createElement('div');
    question.setAttribute('id', 'question');
    question.innerHTML = message.answer.pergunta;

    const answer = document.createElement('div');
    question.setAttribute('id', 'answer');
    answer.innerHTML = message.answer.resposta;

    result.appendChild(question);
    result.appendChild(answer);
  }
});
