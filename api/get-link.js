const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const response = await fetch("https://bingotingo.com/best-social-media-platforms/");
    const html = await response.text();

    // Expressão regular que captura links com "biozium"
    const match = html.match(/https?:\/\/[^\s"'<>]*biozium[^\s"'<>]*/i);

    if (match && match[0]) {
      return res.status(200).json({ link: match[0] });
    } else {
      return res.status(404).json({ error: "Link do Biozium não encontrado." });
    }
  } catch (e) {
    console.error("Erro ao buscar link:", e);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
