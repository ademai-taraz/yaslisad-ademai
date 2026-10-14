(async function(){
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=x=>{const s=String(x||'');return /^(https?:|\/\/|javascript:|data:)/i.test(s)?'#':s.split('/').map(encodeURIComponent).join('/')};
try{
 const response=await fetch('content/site.json',{cache:'no-store'});if(!response.ok)throw Error('content unavailable');const d=await response.json();
 const docs=document.getElementById('documents-list');if(docs&&Array.isArray(d.documents))docs.innerHTML=d.documents.map(x=>`<p><a href="${url(x.file)}" target="_blank" rel="noopener">📄 ${safe(x.title)}</a></p>`).join('')||'Құжаттар әзірге жоқ.';
 const sections=[
 ['announcements','Хабарландырулар',x=>`<article><h3>${safe(x.title)}</h3><p>${safe(x.text)}</p></article>`],
 ['news','Жаңалықтар',x=>`<article><h3>${safe(x.title)}</h3><p>${safe(x.date)}</p><p>${safe(x.text)}</p>${x.image?`<img loading="lazy" style="max-width:300px;width:100%" src="${url(x.image)}" alt="">`:''}</article>`],
 ['gallery','Фотогалерея',x=>`<figure style="display:inline-block;max-width:240px"><img loading="lazy" style="width:100%" src="${url(x.image)}" alt="${safe(x.caption)}"><figcaption>${safe(x.caption)}</figcaption></figure>`],
 ['staff','Қызметкерлер',x=>`<article><h3>${safe(x.name)}</h3><p>${safe(x.role)}</p>${x.image?`<img loading="lazy" style="max-width:180px;width:100%" src="${url(x.image)}" alt="">`:''}</article>`],
 ['groups','Топтар',x=>`<article><h3>${safe(x.name)}</h3><p>${safe(x.description)}</p></article>`]
 ];for(const [key,label,render] of sections){const el=document.getElementById('cms-'+key);if(el&&Array.isArray(d[key])&&d[key].length)el.innerHTML=`<h2>${label}</h2>`+d[key].map(render).join('')}
}catch(e){console.warn('CMS content unavailable',e)}
})();