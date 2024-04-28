'use server';

import puppeteer from 'puppeteer';

export async function getPdfBuffer(html: string) {
  // let browser: any;
  // if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production')
  //   browser = await puppeteerCore.launch({
  //     args: chromium.args,
  //     defaultViewport: chromium.defaultViewport,
  //     executablePath,
  //     headless: chromium.headless,
  //   });
  // else browser = await puppeteer.launch();

  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  const pdfBuffer = await page.pdf({
    width: '8.5in',
    height: '5.5in',
  });

  await browser.close();

  return pdfBuffer;
}
