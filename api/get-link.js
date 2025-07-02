const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

module.exports = async (req, res) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      defaultViewport: { width: 1280, height: 800 }
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36');
    await page.goto("https://bingotingo.com/best-social-media-platforms/", { waitUntil: 'networkidle2' });

    await page.waitForXPath("//h2[text()='Free Guide']", { timeout: 20000 });
    const [downloadBtn] = await page.$x("//*[@id='download']");
    if (!downloadBtn) throw new Error('Botão não encontrado');

    await downloadBtn.click();
    await page.waitForTimeout(5000);

    const pages = await browser.pages();
    const newPage = pages[pages.length - 1];
    await newPage.bringToFront();

    const [linkEl] = await newPage.$x("//a[text()='GET HERE']");
    const href = await newPage.evaluate(el => el.href, linkEl);

    return res.status(200).json({ link: href });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  } finally {
    if (browser !== null) await browser.close();
  }
};
