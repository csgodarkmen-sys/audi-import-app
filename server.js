import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '32kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function cleanText(s='') {
  return String(s).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
    .replace(/\s+/g,' ').trim();
}
function parsePrice(text) {
  const s = cleanText(text);
  const patterns = [
    /(\d{1,3}(?:[ .]\d{3})+|\d{4,6})\s*(?:zł|PLN)\b/i,
    /(?:PLN|zł)\s*(\d{1,3}(?:[ .]\d{3})+|\d{4,6})/i
  ];
  for (const p of patterns) {
    const m=s.match(p);
    if (m) {
      const n=Number(m[1].replace(/[ .]/g,''));
      if (n>=5000 && n<=1000000) return n;
    }
  }
  return null;
}
function median(nums) {
  if (!nums.length) return null;
  const a=[...nums].sort((x,y)=>x-y), m=Math.floor(a.length/2);
  return a.length%2?a[m]:(a[m-1]+a[m])/2;
}
function normalizeUrl(u) {
  try { const x=new URL(u); x.hash=''; for (const k of [...x.searchParams.keys()]) if (/utm_|tracking|campaign/i.test(k)) x.searchParams.delete(k); return x.toString(); } catch { return u; }
}
app.get('/api/health', (_req,res)=>res.json({ok:true, searchConfigured:Boolean(process.env.BRAVE_SEARCH_API_KEY)}));

app.post('/api/search', async (req,res) => {
  const b=req.body||{};
  const yearFrom=Math.max(2010,Math.min(2026,Number(b.yearFrom)||2019));
  const yearTo=Math.max(yearFrom,Math.min(2026,Number(b.yearTo)||yearFrom));
  const maxKm=Math.max(0,Math.min(500000,Number(b.maxKm)||150000));
  const model=String(b.model||'Audi A3').slice(0,50);
  const fuel=String(b.fuel||'benzyna').slice(0,30);
  const engine=String(b.engine||'1.5 TFSI').slice(0,40);
  if (!process.env.BRAVE_SEARCH_API_KEY) {
    return res.status(503).json({error:'Brak klucza Brave Search API. Skopiuj .env.example do .env, wpisz BRAVE_SEARCH_API_KEY i uruchom serwer ponownie.', needsKey:true});
  }
  const queries = [
    `site:otomoto.pl/osobowe/oferta ${model} sedan limousine ${engine} ${fuel} ${yearFrom} ${yearTo}`,
    `site:olx.pl/motoryzacja/samochody ${model} sedan ${engine} ${yearFrom} ${yearTo}`,
    `site:autoplac.pl/oferta ${model} sedan ${engine} ${yearFrom} ${yearTo}`
  ];
  try {
    const batches=await Promise.all(queries.map(async q=>{
      const url=new URL('https://api.search.brave.com/res/v1/web/search');
      url.searchParams.set('q',q);
      url.searchParams.set('count','10');
      url.searchParams.set('country','PL');
      url.searchParams.set('search_lang','pl');
      const r=await fetch(url,{headers:{'X-Subscription-Token':process.env.BRAVE_SEARCH_API_KEY,'Accept':'application/json'}});
      if (!r.ok) throw new Error(`Brave Search API zwróciło HTTP ${r.status}. Sprawdź klucz i limit API.`);
      const data=await r.json();
      return (data.web?.results||[]).map(x=>({
        title:cleanText(x.title||''),
        url:normalizeUrl(x.url||''),
        description:cleanText(x.description||''),
        price:parsePrice(`${x.title||''} ${x.description||''}`),
        source:new URL(x.url).hostname.replace(/^www\./,'')
      }));
    }));
    const seen=new Set(), all=[];
    for (const item of batches.flat()) {
      if (!item.url || seen.has(item.url)) continue;
      seen.add(item.url);
      if (!/(otomoto|olx\.pl|autoplac|gratka|allegro)/i.test(item.source)) continue;
      if (!item.price) continue;
      const hay=(item.title+' '+item.description).toLowerCase();
      if (!hay.includes('a3') && !hay.includes('audi')) continue;
      all.push(item);
    }
    const priced=all.filter(x=>x.price);
    const prices=priced.map(x=>x.price);
    res.json({
      query:queries,
      checkedAt:new Date().toISOString(),
      count:priced.length,
      mean:prices.length?prices.reduce((a,c)=>a+c,0)/prices.length:null,
      median:median(prices),
      min:prices.length?Math.min(...prices):null,
      max:prices.length?Math.max(...prices):null,
      offers:priced.slice(0,20),
      note:priced.length
        ? 'Ceny odczytano z publicznych fragmentów wyników wyszukiwania. Zweryfikuj kwotę, nadwozie, rok i przebieg na stronie ogłoszenia.'
        : 'Nie znaleziono wystarczającej liczby wyników z rozpoznawalną ceną. Spróbuj szerszych kryteriów.'
    });
  } catch(e) {
    res.status(502).json({error:e.message||'Błąd wyszukiwania'});
  }
});

app.get('*', (_req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
const port=Number(process.env.PORT)||3000;
app.listen(port,()=>console.log(`Audi Import działa: http://localhost:${port}`));
