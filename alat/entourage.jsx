// =====================================================================
//  entourage.jsx - RAD+ar: rumput, planter, semak, pohon, orang BERSKALA
//  sebagai layer terpisah di atas ekspor 3D. Photoshop -> File -> Scripts -> Browse.
//  MODE "elevation": tampak/potongan ortografis (isi GROUND_Y, PPM, rentang X)
//  MODE "axo"      : baca E_entourage.json dari alat/entourage.rb (posisi & ukuran tepat)
// =====================================================================
#target photoshop
var CFG = {
  MODE   : "elevation",
  folder : "D:/000 RAD+AR/AI/PRACTICE/DIAGRAMS/_sumber/",
  base   : "tampak_S.png",          // ekspor SketchUp (bukan screenshot user)
  json   : "E_entourage.json",      // mode axo
  out    : "D:/000 RAD+AR/AI/PRACTICE/DIAGRAMS/E01_TAMPAK_SELATAN",
  crop   : null,                    // [x0,y0,x1,y1] px atau null
  // ---- mode elevation (px pada gambar SETELAH crop)
  GROUND_Y : 840,                   // y garis tanah/perkerasan
  PPM      : 17.8,                  // px per meter (ukur dari elemen yang diketahui)
  X_FROM   : 40, X_TO : 1800,       // rentang yang diberi entourage
  TREES    : 9, PEOPLE : 22,
  planters : [[90,370],[410,610]],  // rentang x planter (px)
  seed     : 11,
  title    : "S O U T H   E L E V A T I O N   –   L A N D S C A P E   &   P E O P L E",
  red      : "C8553D", green:"8DB580", shrub:"6F9E58", trunk:"6B5A48", planter:"B9B4AA"
};
app.preferences.rulerUnits=Units.PIXELS; app.preferences.typeUnits=TypeUnits.PIXELS;
var rs=CFG.seed; function rnd(){ rs=(rs*9301+49297)%233280; return rs/233280; }
function col(h){var c=new SolidColor();c.rgb.hexValue=h;return c;}
var doc=app.open(new File(CFG.folder+CFG.base)); if(CFG.crop) doc.crop(CFG.crop);
var base=doc.activeLayer; try{base.isBackgroundLayer=false;}catch(e){} base.name="3D BASE – SketchUp export";
function grp(n){var g=doc.layerSets.add();g.name=n;return g;}
function lay(g,n){var l=g.artLayers.add();l.name=n;doc.activeLayer=l;return l;}
function sel(p,first){doc.selection.select(p, first?SelectionType.REPLACE:SelectionType.EXTEND,0,true);}
function ell(cx,cy,rx,ry,first){var p=[];for(var i=0;i<28;i++){var a=i/28*2*Math.PI;p.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);} sel(p,first);}
function fill(h){try{doc.selection.fill(col(h));}catch(e){} doc.selection.deselect();}
var BODY=[[-0.09,0.82],[0.09,0.82],[0.13,0.56],[0.09,0.53],[0.10,0.46],[0.07,0.0],[0.025,0.0],[0.0,0.40],[-0.025,0.0],[-0.07,0.0],[-0.10,0.46],[-0.09,0.53],[-0.13,0.56]];
function person(x,y,h,f,first){var p=[];for(var j=0;j<BODY.length;j++)p.push([x+BODY[j][0]*h*f,y-BODY[j][1]*h]); sel(p,first); ell(x,y-0.915*h,0.065*h,0.075*h,false);}

var trees=[], shrubs=[], people=[], grassPolys=[];   // trees: [x,y,hPx,wPx]  people: [x,y,hPx,colour,flip]
if(CFG.MODE=="elevation"){
  var G=CFG.GROUND_Y, M=CFG.PPM, span=CFG.X_TO-CFG.X_FROM;
  grassPolys.push([[CFG.X_FROM,G-0.3*M],[CFG.X_TO,G-0.3*M],[CFG.X_TO,G+3],[CFG.X_FROM,G+3]]);
  for(var i=0;i<CFG.TREES;i++){ var h=6+rnd()*3; trees.push([CFG.X_FROM+span*(i+0.5)/CFG.TREES+(rnd()-0.5)*40,G,h*M,(h*0.7)*M]); }
  for(var x=CFG.X_FROM;x<CFG.X_TO;x+=2.1*M) shrubs.push([x+(rnd()-0.5)*12,G,(0.6+rnd()*0.5)*M,(0.9+rnd()*0.7)*M]);
  for(var i=0;i<CFG.PEOPLE;i++){ var hh=(i%9==4)?1.2:1.6+rnd()*0.25; people.push([CFG.X_FROM+rnd()*span,G,hh*M,(i%3==2)?"3A3A3A":CFG.red,rnd()>0.5?1:-1]); }
} else {
  var jf=new File(CFG.folder+CFG.json); jf.open("r"); var J=eval("("+jf.read()+")"); jf.close();
  for(var i=0;i<J.grass.length;i++) grassPolys.push(J.grass[i]);
  for(var i=0;i<J.trees.length;i++){ var t=J.trees[i]; trees.push([t[0][0],t[0][1],Math.abs(t[0][1]-t[1][1]),2*t[2]]); }
  for(var i=0;i<J.shrubs.length;i++){ var s=J.shrubs[i]; shrubs.push([s[0][0],s[0][1],Math.abs(s[0][1]-s[1][1]),2*s[2]]); }
  for(var i=0;i<J.people.length;i++){ var p=J.people[i]; people.push([p[0][0],p[0][1],Math.abs(p[0][1]-p[1][1]),(i%3==2)?"3A3A3A":CFG.red,(i%2)?1:-1]); }
}
// ---------- LANDSCAPE
var gL=grp("LANDSCAPE");
lay(gL,"GRASS"); for(var i=0;i<grassPolys.length;i++) sel(grassPolys[i],i==0); if(grassPolys.length) fill(CFG.green);
if(CFG.MODE=="elevation" && CFG.planters.length){ lay(gL,"PLANTERS (0.6 m)");
  for(var i=0;i<CFG.planters.length;i++){var a=CFG.planters[i]; sel([[a[0],CFG.GROUND_Y-0.6*CFG.PPM],[a[1],CFG.GROUND_Y-0.6*CFG.PPM],[a[1],CFG.GROUND_Y],[a[0],CFG.GROUND_Y]],i==0);} fill(CFG.planter); }
var ls=lay(gL,"SHRUBS (0.6–1.1 m)"); for(var i=0;i<shrubs.length;i++){var s=shrubs[i]; ell(s[0],s[1]-s[2]/2,s[3]/2,s[2]/2,i==0);} if(shrubs.length) fill(CFG.shrub); ls.opacity=90;
// ---------- TREES
var gT=grp("TREES (6–9 m)");
if(CFG.MODE=="axo"){ var tsh=lay(gT,"tree shadows"); for(var i=0;i<trees.length;i++){var t=trees[i]; ell(t[0]+t[3]*0.35,t[1]+t[3]*0.1,t[3]/2,t[3]/4,i==0);} if(trees.length) fill("000000"); tsh.opacity=18; }
lay(gT,"tree trunks"); for(var i=0;i<trees.length;i++){var t=trees[i],w=Math.max(2,t[2]*0.04); sel([[t[0]-w/2,t[1]-t[2]*0.45],[t[0]+w/2,t[1]-t[2]*0.45],[t[0]+w/2,t[1]],[t[0]-w/2,t[1]]],i==0);} if(trees.length) fill(CFG.trunk);
var tc=lay(gT,"tree canopies"); for(var i=0;i<trees.length;i++){var t=trees[i],cy=t[1]-t[2]*0.68,r=t[3]/2;
  ell(t[0],cy,r,t[2]*0.32,i==0); ell(t[0]-r*0.45,cy+t[2]*0.08,r*0.6,t[2]*0.22,false); ell(t[0]+r*0.45,cy+t[2]*0.06,r*0.6,t[2]*0.22,false);} if(trees.length) fill(CFG.green); tc.opacity=72;
// ---------- PEOPLE
var gP=grp("PEOPLE (1.2–1.85 m)"); var groups={};
for(var i=0;i<people.length;i++){ var k=people[i][3]; if(!groups[k]) groups[k]=[]; groups[k].push(people[i]); }
if(CFG.MODE=="axo"){ var psh=lay(gP,"people shadows"); var first=true; for(var i=0;i<people.length;i++){var p=people[i]; ell(p[0]+p[2]*0.18,p[1],p[2]*0.22,p[2]*0.07,first); first=false;} if(people.length) fill("000000"); psh.opacity=20; }
for(var k in groups){ lay(gP,"people "+(k==CFG.red?"RED (scale figures)":"#"+k)); for(var i=0;i<groups[k].length;i++){var p=groups[k][i]; person(p[0],p[1],p[2],p[4],i==0);} fill(k); }
// ---------- ANNOTATION
var gA=grp("ANNOTATION");
function txt(s,x,y,sz,c,bold){var t=gA.artLayers.add();t.kind=LayerKind.TEXT;t.textItem.contents=s;t.textItem.size=sz;t.textItem.position=[x,y];t.textItem.color=col(c);try{t.textItem.font=bold?"Arial-BoldMT":"ArialMT";}catch(e){} return t;}
txt(CFG.title,40,60,30,"2B2B2B",true);
if(CFG.MODE=="elevation"){
  txt("Exported from the SketchUp model (orthographic) · entourage to scale: 1.7 m figure = "+Math.round(1.7*CFG.PPM)+" px",40,100,17,"666666",false);
  var sx=40, sy=doc.height.as("px")-60, mk=[0,5,10,20]; lay(gA,"scale bar 0-5-10-20 m");
  for(var i=0;i<3;i++){ if(i==1) continue; sel([[sx+mk[i]*CFG.PPM,sy],[sx+mk[i+1]*CFG.PPM,sy],[sx+mk[i+1]*CFG.PPM,sy+10],[sx+mk[i]*CFG.PPM,sy+10]],i==0);} fill("2B2B2B");
  lay(gA,"scale bar outline"); sel([[sx,sy],[sx+20*CFG.PPM,sy],[sx+20*CFG.PPM,sy+10],[sx,sy+10]],true); try{doc.selection.stroke(col("2B2B2B"),1);}catch(e){} doc.selection.deselect();
  for(var i=0;i<4;i++) txt(mk[i]+(i==3?" m":""),sx+mk[i]*CFG.PPM-4,sy+32,14,"2B2B2B",false);
}
doc.saveAs(new File(CFG.out+".psd"),new PhotoshopSaveOptions(),true);
var jo=new JPEGSaveOptions(); jo.quality=11; doc.saveAs(new File(CFG.out+".jpg"),jo,true);
