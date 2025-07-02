const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // Página principal do Bingotingo
    const origem = "https://bingotingo.com/best-social-media-platforms/";
    const origemHtml = await fetch(origem).then(r => r.text());

    // Extrai link do Biozium
    const bioziumMatch = origemHtml.match(/https?:\/\/[^\s"'<>]*biozium[^\s"'<>]*/i);
    if (!bioziumMatch) {
      return res.status(404).json({ error: "Link do Biozium não encontrado." });
    }
    const bioziumLink = bioziumMatch[0];

    // Acessa página do Biozium
    const bioziumHtml = await fetch(bioziumLink).then(r => r.text());

    // Extrai link do Canva
    const canvaMatch = bioziumHtml.match(/https?:\/\/[^\s"'<>]*canva\.com[^\s"'<>]*/i);
    if (!canvaMatch) {
      return res.status(404).json({ error: "Link do Canva não encontrado na página do Biozium." });
    }
    const canvaLink = canvaMatch[0];

    // Verifica status do link Canva
    let isOnline = false;
    try {
      const response = await fetch(canvaLink, { method: "HEAD" });
      isOnline = response.ok;
    } catch {
      isOnline = false;
    }

    // Retorna link e status de online
    return res.status(200).json({ link: canvaLink, isOnline });

  } catch (e) {
    console.error("Erro geral:", e);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
