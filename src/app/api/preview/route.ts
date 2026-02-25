import { draftMode } from 'next/headers';
import { redirectToPreviewURL } from '@prismicio/next';
import { createClient } from '../../../prismicio';

export async function GET(request: Request) {
  const client = createClient();
  const draftSet = await draftMode();
  draftSet.enable();

  await redirectToPreviewURL({ client, request });
}
