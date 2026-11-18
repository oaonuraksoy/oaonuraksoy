import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

export async function getStaticPaths() {
  const papers = await getCollection(
    'broadcasts',
    ({ data }) => data.lang === 'en' && Boolean(data.doi && data.scholarlyPaper?.pdfPath)
  );

  return papers.map((item) => ({
    params: {
      slug: item.id.replace(/^en\//, ''),
      pdf: path.basename(item.data.scholarlyPaper!.pdfPath)
    },
    props: {
      pdfRelPath: item.data.scholarlyPaper!.pdfPath
    }
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { pdfRelPath } = props as { pdfRelPath: string };
  const pdfPath = path.resolve('public', pdfRelPath.replace(/^\//, ''));
  const buf = fs.readFileSync(pdfPath);

  return new Response(buf, {
    headers: { 'Content-Type': 'application/pdf' }
  });
};
