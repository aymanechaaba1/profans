'use server';

import { storage } from '@/lib/firebase';
import { StringFormat, ref, uploadBytes, uploadString } from 'firebase/storage';

type Props = {
  path: string;
  url: string;
  format?: StringFormat;
};
export async function uploadFileToFirebase({ path, url, format }: Props) {
  const storageRef = ref(storage, path);

  const snapshot = await uploadString(storageRef, url, format);
  return snapshot;
}
