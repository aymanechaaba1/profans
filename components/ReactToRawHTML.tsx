'use client';

import { ReactNode } from 'react';
import ReactDOMServer from 'react-dom/server';

function ReactToRawHTML({ component }: { component: ReactNode }) {
  const rawHtml = ReactDOMServer.renderToString(component);

  return rawHtml;
}

export default ReactToRawHTML;
