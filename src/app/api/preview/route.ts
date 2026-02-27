import { draftMode } from 'next/headers';
import { redirectToPreviewURL } from '@prismicio/next';
import { NextRequest } from 'next/server';
import { createClient } from '../../../prismicio';

export async function GET(request: NextRequest) {
  const client = createClient();
  const draftSet = await draftMode();
  draftSet.enable();

  await redirectToPreviewURL({ client, request });
}
