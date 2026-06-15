import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:5173/auth', { waitUntil: 'networkidle2' });
  
  console.log("Clicking Google sign-in button...");
  await page.waitForSelector('.auth-google-btn');
  
  const [popup] = await Promise.all([
    new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))),
    page.click('.auth-google-btn')
  ]);
  
  await new Promise(r => setTimeout(r, 2000));
  console.log("Popup URL:", popup ? popup.url() : "No popup created");
  
  await browser.close();
})();
