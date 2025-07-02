const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const origem = "https://bingotingo.com/best-social-media-platforms/";
    const origemHtml = await fetch(origem).then(r => r.text());

    const bioziumMatch = origemHtml.match(/https?:\/\/[^\s"'<>]*biozium[^\s"'<>]*/i);
    if (!bioziumMatch) {
      return res.status(404).json({ error: "Link do Biozium não encontrado." });
    }
    const bioziumLink = bioziumMatch[0];

    const bioziumHtml = await fetch(bioziumLink).then(r => r.text());

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

    // Sempre retorna 200 com link e status
    return res.status(200).json({ link: canvaLink, isOnline });

  } catch (e) {
    console.error("Erro geral:", e);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
