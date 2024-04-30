import { generateQrCode } from '@/actions/generateQrCode';

test('get qr code', async () => {
  let data = {
    firstname: 'Aymane',
    lastname: 'Chaaba',
  };
  let url = await generateQrCode(data);

  expect(typeof url).toEqual('string');
});
