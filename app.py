import asyncio
from flask import Flask, render_template, jsonify
from pyppeteer import launch

app = Flask(__name__)

async def get_canva_link():
    browser = await launch(headless=True)
    page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36')
    await page.goto("https://bingotingo.com/best-social-media-platforms/")
    await page.waitForXPath("//h2[text()='Free Guide']")
    await page.xpath("//h2[text()='Free Guide']")
    print("Trying to find Canva Pro for you...")

    await page.waitForXPath("//*[@id='download']", {'visible': True, 'timeout': 70000})
    button = await page.xpath("//*[@id='download']")
    await button[0].click()
    await asyncio.sleep(5)

    new_tab = (await browser.pages())[-1]
    await new_tab.bringToFront()

    href_link = await new_tab.xpath("//a[text()='GET HERE']")
    href_link = await (await href_link[0].getProperty('href')).jsonValue()

    await browser.close()
    return href_link

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-link')
def fetch_link():
    link = asyncio.get_event_loop().run_until_complete(get_canva_link())
    return jsonify({'link': link})

if __name__ == '__main__':
    app.run(debug=True)
