chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'searchBrainly') {
    searchBrainly(message.question)
      .then((answer) => {
        sendResponse({ answer });
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
        sendResponse({ answer: 'Erro ao buscar resposta.' });
      });

    return true;
  }
});

async function searchBrainly(question) {
  try {
    const response = await fetch(
      'https://srv-unified-search.external.search-systems-production.z-dn.net/api/v1/pt/search',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          Accept: '*/*',
          Origin: 'https://brainly.com.br',
          Referer: 'https://brainly.com.br/',
          'User-Agent': 'Mozilla/5.0',
          'x-api-key': '22df2c14-f58b-4603-abf2-788ba76862a0',
        },
        body: JSON.stringify({
          query: {
            text: question,
          },
          context: {
            supportedTypes: ['question'],
          },
          pagination: {
            cursor: null,
            limit: 20,
          },
        }),
      },
    );

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar resposta:', error);
    return 'Erro ao buscar resposta.';
  }
}
