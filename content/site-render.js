(async function(){
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=x=>{const s=String(x||'');return /^(https?:|\/\/|javascript:|data:)/i.test(s)?'#':s.split('/').map(encodeURIComponent).join('/')};
try{
 const response=await fetch('content/site.json',{cache:'no-store'});if(!response.ok)throw Error('content unavailable');const d=await response.json();
 const docs=document.getElementById('documents-list');if(docs&&Array.isArray(d.documents))docs.innerHTML=d.documents.map(x=>`<p><a href="${url(x.file)}" target="_blank" rel="noopener">📄 ${safe(x.title)}</a></p>`).join('')||'Құжаттар әзірге жоқ.';
 const sections=[
 ['announcements','Хабарландырулар',x=>`<article><h3>${safe(x.title)}</h3><p>${safe(x.text)}</p></article>`],
 ['news','Жаңалықтар',x=>`<article><h3>${safe(x.title)}</h3><p>${safe(x.date)}</p><p>${safe(x.text)}</p>${x.image?`<img loading="lazy" style="max-width:300px;width:100%" src="${url(x.image)}" alt="">`:''}</article>`],



 ];for(const [key,label,render] of sections){const el=document.getElementById('cms-'+key);if(el&&Array.isArray(d[key])&&d[key].length)el.innerHTML=`<h2>${label}</h2>`+d[key].map(render).join('')}

 const mount=(id,items,fn)=>{const el=document.getElementById(id);if(el&&Array.isArray(items))el.innerHTML=items.map(fn).join('')};
 mount('managed-gallery',d.gallery,x=>`<img loading="lazy" src="${url(x.image)}" alt="${safe(x.caption)}">`);
 mount('managed-excursion',d.excursion,x=>`<img loading="lazy" src="${url(x.image)}" alt="${safe(x.caption)}">`);
 mount('managed-groups',d.groups,x=>`<div class="group">${x.image?`<img loading="lazy" src="${url(x.image)}" alt="">`:''}<h3>${safe(x.age)}</h3><p>${safe(x.name)}</p>${x.description?`<p>${safe(x.description)}</p>`:''}</div>`);
 mount('managed-programs',d.programs,x=>`<div class="program">${x.image?`<img loading="lazy" src="${url(x.image)}" alt="">`:''}<h2>${safe(x.name)}</h2></div>`);
 const carousel=document.getElementById('managed-teachers');
 if(carousel&&Array.isArray(d.staff)){
  const next=carousel.querySelector('.next');
  carousel.querySelectorAll('.teacher-card').forEach(x=>x.remove());
  d.staff.forEach(x=>{const card=document.createElement('div');card.className='teacher-card';card.innerHTML=`${x.image?`<img src="${url(x.image)}" alt="${safe(x.name)}">`:''}<div class="info"><h3>${safe(x.name)}</h3><p><strong>${safe(x.role)}</strong></p><p>${safe(x.education)}</p></div>`;carousel.insertBefore(card,next)});
  const cards=[...carousel.querySelectorAll('.teacher-card')],dotsBox=carousel.parentElement.querySelector('.dots');let current=0;
  if(dotsBox)dotsBox.innerHTML=cards.map((_,i)=>`<span class="dot${i===0?' active':''}"></span>`).join('');
  const show=i=>{if(!cards.length)return;current=(i+cards.length)%cards.length;cards.forEach((c,j)=>c.style.display=j===current?'flex':'none');if(dotsBox)[...dotsBox.children].forEach((c,j)=>c.classList.toggle('active',j===current))};
  carousel.querySelector('.prev')?.addEventListener('click',()=>show(current-1));next?.addEventListener('click',()=>show(current+1));
  if(dotsBox)[...dotsBox.children].forEach((x,i)=>x.addEventListener('click',()=>show(i)));show(0);
 }
}catch(e){console.warn('CMS content unavailable',e)}
})();