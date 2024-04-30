import { Ticket } from '@/components/ticket';
import { htmlToBuffer } from '@/utils/helpers';

test('html to buffer', () => {
  const html = `<html><body><h1>Hello, world!</h1></body></html>`;

  const buffer = htmlToBuffer(html);

  expect(buffer instanceof ArrayBuffer).toBeTruthy();
});
