const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // Etapa 1: Acessa a página do Bingotingo
    const origem = "https://bingotingo.com/best-social-media-platforms/";
    const origemHtml = await fetch(origem).then(r => r.text());

    // Etapa 2: Extrai o link do Biozium
    const bioziumMatch = origemHtml.match(/https?:\/\/[^\s"'<>]*biozium[^\s"'<>]*/i);
    if (!bioziumMatch) {
      return res.status(404).json({ error: "Link do Biozium não encontrado." });
    }
    const bioziumLink = bioziumMatch[0];

    // Etapa 3: Acessa a página do Biozium
    const bioziumHtml = await fetch(bioziumLink).then(r => r.text());

    // Etapa 4: Extrai o link do Canva
    const canvaMatch = bioziumHtml.match(/https?:\/\/[^\s"'<>]*canva\.com[^\s"'<>]*/i);
    if (!canvaMatch) {
      return res.status(404).json({ error: "Link do Canva não encontrado na página do Biozium." });
    }
    const canvaLink = canvaMatch[0];

    // Etapa 5: Verifica se o link do Canva está acessível
    const response = await fetch(canvaLink, { method: "HEAD" }); // apenas cabeçalhos
    if (!response.ok) {
      return res.status(400).json({ error: "O link do Canva parece estar offline ou inválido.", status: response.status });
    }

    // ✅ Retorna o link válido
    return res.status(200).json({ link: canvaLink });

  } catch (e) {
    console.error("Erro geral:", e);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
