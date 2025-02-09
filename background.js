chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'searchBrainly') {
    searchBrainly(message.question)
      .then((data) => {
        sendResponse(data);
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
    const hasVerifiedAnswer =
      data.results.filter(({ question }) => question.answer.verified).length >
      0;
    const bestRating = Math.max(
      ...data.results.map(({ question }) => question.answer.rating),
    );

    const results = data.results
      .filter(
        ({ question }) =>
          question.answer.verified === hasVerifiedAnswer &&
          question.answer.rating === bestRating,
      )
      .sort(
        (a, b) => b.question.answer.ratesCount - a.question.answer.ratesCount,
      );

    if (results.length === 0) {
      return [
        {
          pergunta: question,
          resposta: 'Nenhuma resposta encontrada',
        },
      ];
    }

    const formattedResult = results.map(({ question }) => {
      return {
        pergunta: question.content,
        resposta: question.answer.content,
      };
    });

    return formattedResult;
  } catch (error) {
    console.error('Erro ao buscar resposta:', error);
    return 'Erro ao buscar resposta.';
  }
}
