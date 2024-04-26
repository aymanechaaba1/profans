'use server';

import puppeteer, { Browser } from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export async function getPdfBuffer(html: string) {
  const executablePath = await chromium.executablePath();

  let browser: any;
  if (process.env.VERCEL_ENV === 'production')
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
  else browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  const pdfBuffer = await page.pdf({
    width: '8.5in',
    height: '5.5in',
  });

  await browser.close();

  return pdfBuffer;
}
