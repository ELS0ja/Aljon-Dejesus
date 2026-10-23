const fs = require('node:fs');
const path = require('node:path');
const directory = path.resolve('storage/app/visual-qa');
const results = JSON.parse(fs.readFileSync(path.join(directory, 'results.json'), 'utf8'));
const exact = results.comparisons.filter(result => result.exactChangedPixels === 0).length;
const report = `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Portfolio visual comparisons</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#0b0f19;color:#f8fafc;font:15px/1.6 system-ui,sans-serif}main{max-width:1600px;margin:auto;padding:30px}h1{font-size:28px;margin:0 0 8px}p{color:#94a3b8}select,input{accent-color:#60a5fa}select{padding:8px;background:#151c2c;color:#f8fafc;border:1px solid #273449;border-radius:6px}label{display:inline-flex;gap:12px;align-items:center;margin:8px 20px 18px 0}.viewer{height:75vh;overflow:auto;border:1px solid #273449;border-radius:8px;background:#111827}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}.pair img,.overlay img,.diff img{width:100%;display:block}.overlay{position:relative}.overlay img+img{position:absolute;inset:0}.hidden{display:none}header{position:sticky;top:0;background:#0b0f19;padding:8px;z-index:1}.legend{display:flex;justify-content:space-around;color:#94a3b8;font-size:13px}
</style><main><h1>Reference and Laravel portfolio</h1>
<p>${results.comparisons.length} matched captures. ${exact} are identical under strict pixel comparison. Chrome ${results.conditions.browser}, scale 1, zoom 100%, reduced motion. Reference preview: 862 × 902. Each pair uses the same viewport, content, scroll position, and state.</p>
<label>Capture <select id="capture"></select></label><label>View <select id="mode"><option value="pair">Side by side</option><option value="overlay">Overlay</option><option value="diff">Difference</option></select></label><label>Overlay opacity <input id="opacity" type="range" min="0" max="100" value="50"></label>
<p id="measurement"></p><div class="legend"><span>Reference</span><span>Laravel</span></div>
<div class="viewer"><div class="pair" id="pair"><img id="ref" alt="Reference screenshot"><img id="local" alt="Laravel screenshot"></div><div class="overlay hidden" id="overlay"><img id="under" alt="Reference screenshot"><img id="over" alt="Laravel overlay"></div><div class="diff hidden" id="diff"><img id="difference" alt="Image difference"></div></div>
<p>The original dialog lacks keyboard focus trapping and Escape support. Laravel adds these behaviors without changing its appearance. Contact success text confirms database storage; a missing CV produces honest feedback. Screenshot comparisons cover the captured states; other browsers, arbitrary widths, operating systems, and future reference changes are outside this verification.</p>
<script>
const results=${JSON.stringify(results.comparisons)};
const select=document.getElementById('capture');
results.forEach((r,i)=>{const option=document.createElement('option');option.value=i;option.textContent=r.file.replace('.png','');select.appendChild(option)});
function render(){const r=results[Number(select.value)];if(!r)return;document.getElementById('ref').src=document.getElementById('under').src='reference/'+r.file;document.getElementById('local').src=document.getElementById('over').src='local/'+r.file;document.getElementById('difference').src='comparisons/'+r.file.replace('.png','-diff.png');document.getElementById('measurement').textContent='Detected difference: '+r.changedPercent+'% · Strict changed pixels: '+r.exactChangedPixels+' / '+r.totalPixels;document.querySelector('.viewer').scrollTop=0}
select.onchange=render;document.getElementById('mode').onchange=e=>['pair','overlay','diff'].forEach(id=>document.getElementById(id).classList.toggle('hidden',id!==e.target.value));document.getElementById('opacity').oninput=e=>document.getElementById('over').style.opacity=e.target.value/100;document.getElementById('over').style.opacity=.5;render();
</script></main></html>`;
fs.writeFileSync(path.join(directory, 'index.html'), report);
console.log('Visual comparison gallery created.');
