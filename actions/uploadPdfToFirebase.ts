'use server';

import { storage } from '@/lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';

type Props = {
  pdfBuffer: Buffer;
  path: string;
};
export async function uploadPdfToFirebase({ path, pdfBuffer }: Props) {
  const pdfRef = ref(storage, path);

  const snapshot = await uploadBytes(pdfRef, pdfBuffer, {
    contentType: 'application/pdf',
  });
  return snapshot;
}
