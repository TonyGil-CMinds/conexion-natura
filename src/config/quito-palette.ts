/** Runs before the page paints; the choice survives client-side navigation. */
export const QUITO_PALETTE_SCRIPT = `(function(){
  var h=document.documentElement;
  if(h.hasAttribute('data-quito-palette'))return;
  var seed=crypto.getRandomValues(new Uint32Array(1))[0];
  var palettes=['blue','pink','white'],previous='';
  try{previous=sessionStorage.getItem('quito-palette')||'';}catch(e){}
  var choices=palettes.filter(function(p){return p!==previous;});
  var palette=choices[seed%choices.length];
  h.setAttribute('data-quito-palette',palette);
  h.setAttribute('data-quito-seed',String(seed));
  try{sessionStorage.setItem('quito-palette',palette);}catch(e){}
})();`;
