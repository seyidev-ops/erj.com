const fs=require('fs'), path=require('path');
const html=fs.readFileSync('blog.html','utf8');
const m=html.match(/const SEEDS=\[[\s\S]*?\n\];/);
if(!m){console.error('SEEDS not found');process.exit(1);}
const SEEDS=eval(m[0].replace('const SEEDS=','')+';');

/* Build a static page for EVERY seed, including ones dated in the future.
   A post whose page does not exist yet is a post Google cannot see on the day
   it goes live — and the blog reveals a new one daily. Pages are cheap; being
   invisible on publication day is not. blog.html still reveals each post on
   its own date; this only guarantees the destination is already there. */
const TODAY='9999-12-31';
const SITE='https://everythingremotejob.com';

function slugify(t){
  return t.toLowerCase()
    .replace(/[’'"“”]/g,'')
    .replace(/&/g,' and ')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
    .split('-').reduce((a,w)=> (a+'-'+w).length>72 ? a : (a?a+'-'+w:w), '');
}
const seen=new Map();
const live=SEEDS.filter(p=>p.published===true || (p.date && p.date<=TODAY));
live.forEach(p=>{
  let s=slugify(p.title)||('post-'+p.id);
  if(seen.has(s)) s=s+'-'+p.id;
  seen.set(s,p); p.slug=s;
});
live.sort((a,b)=> a.date<b.date?1:-1);
fs.writeFileSync('./posts.json', JSON.stringify(live.map(p=>({
  id:p.id,slug:p.slug,title:p.title,date:p.date,category:p.category,tags:p.tags||[],
  author:p.author,readTime:p.readTime,emoji:p.emoji,excerpt:p.excerpt,content:p.content
})),null,1));
console.log('published posts:',live.length);
console.log('sample slugs:'); live.slice(0,4).forEach(p=>console.log('  /blog/'+p.slug+'/  ←',p.title.slice(0,60)));
const dupes=[...seen.keys()].filter((s,i,a)=>a.indexOf(s)!==i);
console.log('duplicate slugs:',dupes.length);
const longest=[...seen.keys()].sort((a,b)=>b.length-a.length)[0];
console.log('longest slug:',longest.length,'chars →',longest);
