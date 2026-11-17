// =====================================================================
//  board.jsx - RAD+ar: papan diagram 16:9 BERLAYER di Photoshop
//  margin RADAR, judul berjarak, subjudul italic, panel langkah 01-05 dari
//  ekspor 3D, teks WHY, nomor + leader. Photoshop -> File -> Scripts -> Browse.
// =====================================================================
#target photoshop
var B = {
  out    : "D:/000 RAD+AR/AI/PRACTICE/DIAGRAMS/D01_MASSING",
  W:1920, H:1080,
  title  : "MASSING STRATEGY",
  sub    : "Why one compact tower + one low bar, pushed to the west and north edges",
  footer : "PROJECT – CITY   |   CONCEPT DIAGRAM 01 / 04",
  // panel: gambar (ekspor SketchUp / diagram), label & keterangan
  panels : [
    { img:"D:/000 RAD+AR/AI/PRACTICE/DIAGRAMS/_sumber/iso_SE.png", label:"01  SITE & ROADS", cap:"Three roads; main road = FFL ±0.000." },
    { img:"D:/000 RAD+AR/AI/PRACTICE/DIAGRAMS/_sumber/iso_SW.png", label:"02  STACK ON THE CORNER", cap:"All floor area in one compact tower." }
  ],
  cols : 2,                         // jumlah kolom panel
  why  : "WHY IT IS DESIGNED THIS WAY\n• …\n• …",
  callouts : [ /* [nomor, xTitik, yTitik, xLabel, yLabel] dalam px papan */ ],
  red:"C8553D", ink:"2B2B2B", grey:"999999"
};
app.preferences.rulerUnits=Units.PIXELS; app.preferences.typeUnits=TypeUnits.PIXELS;
function col(h){var c=new SolidColor();c.rgb.hexValue=h;return c;}
var doc=app.documents.add(B.W,B.H,72,"board",NewDocumentMode.RGB,DocumentFill.WHITE);
doc.activeLayer.name="PAPER";
function grp(n){var g=doc.layerSets.add();g.name=n;return g;}
function txt(g,s,x,y,sz,c,font,rot){var t=g.artLayers.add();t.kind=LayerKind.TEXT;var ti=t.textItem;
  if(s.indexOf("\n")>=0){ti.kind=TextType.PARAGRAPHTEXT;ti.width=new UnitValue(560,"px");ti.height=new UnitValue(700,"px");}
  ti.contents=s.replace(/\n/g,"\r");ti.size=sz;ti.position=[x,y];ti.color=col(c);try{ti.font=font;}catch(e){} if(rot)t.rotate(rot); t.name=s.substring(0,28); return t;}
var gImg=grp("3D BASE – panels");
var gAcc=grp("ACCENT (one layer per step – draw here)");
var gEnt=grp("ENTOURAGE (radar-entourage)");
var gAnn=grp("ANNOTATION"); var gMar=grp("RADAR MARGIN");
// margin
txt(gMar,"+",30,50,26,B.grey,"ArialMT"); txt(gMar,"+",B.W-50,50,26,B.grey,"ArialMT");
txt(gMar,"+",30,B.H-20,26,B.grey,"ArialMT"); txt(gMar,"+",B.W-50,B.H-20,26,B.grey,"ArialMT");
txt(gMar,"RADAR",B.W-20,B.H/2+50,30,"000000","Arial-BoldMT",-90);
txt(gMar,"www.radarchitecture.net",B.W-20,260,11,B.grey,"ArialMT",-90);
txt(gMar,"@radarchitects",B.W-20,B.H-120,11,B.grey,"ArialMT",-90);
// judul
txt(gAnn,B.title.split("").join(" ").replace(/   /g,"     "),96,110,28,B.ink,"Arial-BoldMT");
txt(gAnn,B.sub,96,148,15,"666666","Arial-ItalicMT");
txt(gAnn,B.footer,96,B.H-60,11,"888888","ArialMT");
txt(gAnn,B.why,1330,190,14,B.ink,"ArialMT");
// panel
var x0=96,y0=200,pw=(1180-(B.cols-1)*30)/B.cols, rows=Math.ceil(B.panels.length/B.cols), ph=(B.H-330-(rows-1)*40)/rows;
for(var i=0;i<B.panels.length;i++){ var P=B.panels[i], cx=x0+(i%B.cols)*(pw+30), cy=y0+Math.floor(i/B.cols)*(ph+40);
  txt(gAnn,P.label,cx,cy,13,B.red,"Arial-BoldMT"); txt(gAnn,P.cap,cx,cy+ph+18,11,"555555","ArialMT");
  var f=new File(P.img); if(!f.exists) continue;
  var src=app.open(f); src.flatten(); src.selection.selectAll(); src.selection.copy(); src.close(SaveOptions.DONOTSAVECHANGES);
  app.activeDocument=doc; doc.activeLayer=gImg; var L=doc.paste(); L.name="panel "+(i+1)+" – "+P.label;
  var b=L.bounds, w=b[2].as("px")-b[0].as("px"), h=b[3].as("px")-b[1].as("px"), s=Math.min(pw/w,(ph-20)/h)*100;
  L.resize(s,s,AnchorPosition.MIDDLECENTER); b=L.bounds;
  L.translate(cx-b[0].as("px"), cy+12-b[1].as("px")); }
// callouts
for(var i=0;i<B.callouts.length;i++){ var c=B.callouts[i]; var g=grp("callout "+c[0]); doc.activeLayer=g;
  var l=g.artLayers.add(); l.name="leader"; doc.selection.select([[c[1],c[2]],[c[3],c[4]],[c[3]+1,c[4]+1],[c[1]+1,c[2]+1]]); doc.selection.stroke(col(B.red),1); doc.selection.deselect();
  var bx=g.artLayers.add(); bx.name="box"; doc.selection.select([[c[3]-14,c[4]-14],[c[3]+14,c[4]-14],[c[3]+14,c[4]+14],[c[3]-14,c[4]+14]]); doc.selection.fill(col(B.red)); doc.selection.deselect();
  txt(g,String(c[0]),c[3]-6,c[4]+6,14,"FFFFFF","Arial-BoldMT"); }
doc.saveAs(new File(B.out+".psd"),new PhotoshopSaveOptions(),true);
var jo=new JPEGSaveOptions(); jo.quality=11; doc.saveAs(new File(B.out+".jpg"),jo,true);
