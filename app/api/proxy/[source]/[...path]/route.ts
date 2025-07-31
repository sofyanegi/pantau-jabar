import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import http from 'http';
import { proxyDestinations } from '@/libs/getProxiedUrl';

export async function GET(req: NextRequest, { params }: { params: Promise<{ source: string; path: string[] }> }) {
  try {
    const { source, path } = await params;

    const config = proxyDestinations[source];

    if (!config) {
      return NextResponse.json({ error: `Proxy source '${source}' not found.` }, { status: 404 });
    }

    const pathString = path ? path.join('/') : '';
    const targetUrl = new URL(pathString, config.destination);

    const headers = new Headers(req.headers);
    headers.set('host', targetUrl.host);
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
    headers.delete('accept-encoding');

    const protocol = targetUrl.protocol === 'https:' ? https : http;

    const agent =
      protocol === https
        ? new https.Agent({
            rejectUnauthorized: !config.bypassSsl,
            keepAlive: true,
          })
        : new http.Agent({ keepAlive: true });

    const proxyResponse = await new Promise<Response>((resolve, reject) => {
      const proxyReq = protocol.request(
        targetUrl,
        {
          agent: agent,
          method: 'GET',
          headers: Object.fromEntries(headers.entries()),
          signal: req.signal,
        },
        (res) => {
          const responseHeaders = new Headers();
          Object.entries(res.headers).forEach(([key, value]) => {
            if (value) {
              responseHeaders.set(key, Array.isArray(value) ? value.join(', ') : value);
            }
          });

          resolve(new Response(res as any, { status: res.statusCode || 500, headers: responseHeaders }));
        }
      );

      proxyReq.on('error', reject);
      proxyReq.end();
    });

    return proxyResponse;
  } catch (error: any) {
    console.error(`[REUSABLE_PROXY_ERROR]`, error);
    const errorMessage = error?.cause?.code || error.message || 'Unknown proxy error';
    return NextResponse.json({ error: `Proxy request failed: ${errorMessage}` }, { status: 502 });
  }
}
