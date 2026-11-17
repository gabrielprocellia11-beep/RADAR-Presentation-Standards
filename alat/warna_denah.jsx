// =====================================================================
//  warna_denah.jsx  -  RAD+ar: warnai denah PDF (plot) di Photoshop, berlayer
//  Photoshop -> File -> Scripts -> Browse... -> pilih file ini.
//  Input  : PDF hasil plot_frame.lsp + regions_<TAG>.txt (mm kertas, origin kiri-atas)
//  Output : <OUT>.psd (berlayer) + <OUT>.jpg
//  Isi blok CONFIG di bawah. Tidak perlu Python.
// =====================================================================
#target photoshop

// ------------------------------- CONFIG ------------------------------
var CONFIG = {
  folder : "D:/000 RAD+AR/AI/PRACTICE/",
  sheets : [   // satu baris per lantai
    { pdf: "PROJECT LEVEL 2 PLAN.pdf", regions: "regions_L2.txt", out: "PROJECT LEVEL 2 PLAN - COLOUR" }
  ],
  dpi    : 200,
  ground : false,          // true = lantai dasar (cincin/planter lantai dasar = rumput)
  // palet lembut kantor (ganti dengan warna material model 3D bila sudah dibaca)
  colors : {
    site:"ECE7DD", road:"D5D5D2", grass:"A8C88A", water:"BFD8E6", paving:"DDBFA6",
    context:"E3E3E1", lobby:"F3E7D2", office:"F4EEE2", lounge:"EFDFC6", meeting:"E8E0F0",
    service:"DDE6EA", core:"D9D6D0", parking:"E6E6E3", zone:"F2E9DA"
  },
  // kata kunci teks ruang -> warna (dicek berurutan, teks tanpa spasi, huruf besar)
  zoneWords : [
    ["LOBBY|RECEPTION|LOBI","lobby"], ["OFFICE|KANTOR|WORK","office"],
    ["LOUNGE|CAFE|F&B|RESTO|DINING|BAR","lounge"], ["MEETING|RAPAT|BOARD","meeting"],
    ["TOILET|WC|PANTRY|SERVICE|SERVIS|GUDANG|STORE","service"],
    ["STAIR|LIFT|CORE|TANGGA","core"], ["PARKING|PARKIR","parking"]
  ],
  // poligon tambahan manual (mm kertas): [nama layer, kunci warna, [[x,y],...]]
  extra : [
    // ["ROAD JALAN UTAMA","road",[[296,40],[388,40],[388,236],[296,236]]]
  ],
  shadow : { px: 18, opacity: 18, blur: 10 }
};
// ---------------------------------------------------------------------

app.preferences.rulerUnits = Units.PIXELS;
function readLines(path){ var f=new File(path); if(!f.exists) return []; f.open("r"); var t=f.read(); f.close(); return t.split(/\r?\n/); }
function pts(s){ var out=[], a=s.split(";"); for(var i=0;i<a.length;i++){ if(a[i]=="")continue; var p=a[i].split(","); if(p.length==2) out.push([parseFloat(p[0]),parseFloat(p[1])]); } return out; }
function inPoly(x,y,poly){ var c=false; for(var i=0,j=poly.length-1;i<poly.length;j=i++){ var xi=poly[i][0],yi=poly[i][1],xj=poly[j][0],yj=poly[j][1];
  if(((yi>y)!=(yj>y)) && (x < (xj-xi)*(y-yi)/(yj-yi)+xi)) c=!c; } return c; }
function area(poly){ var a=0; for(var i=0,j=poly.length-1;i<poly.length;j=i++) a+=(poly[j][0]+poly[i][0])*(poly[j][1]-poly[i][1]); return Math.abs(a/2); }
function color(hex){ var c=new SolidColor(); c.rgb.hexValue=hex; return c; }

function parseRegions(lines){
  var R={texts:[],hatch:[],poly:[]};
  for(var i=0;i<lines.length;i++){ var f=lines[i].split("|"); if(f.length<3) continue;
    if(f[0]=="T") R.texts.push({layer:f[1], p:pts(f[2])[0], txt:(f[4]||"")});
    else if(f[0]=="H"){ var loops=f[3].split("#"), L=[]; for(var k=0;k<loops.length;k++){ var q=pts(loops[k]); if(q.length>2) L.push(q);} R.hatch.push({layer:f[1], pat:f[2].toUpperCase(), loops:L}); }
    else if(f[0]=="P"){ var q=pts(f[2]); if(q.length>2) R.poly.push({layer:f[1].toUpperCase(), pts:q}); }
  }
  return R;
}
function zoneKey(txt){
  var t=txt.toUpperCase().replace(/^.*?C\d/,""); // buang kode format MTEXT
  for(var i=0;i<CONFIG.zoneWords.length;i++){ if(new RegExp(CONFIG.zoneWords[i][0]).test(t)) return CONFIG.zoneWords[i][1]; }
  return "zone";
}
function cleanName(txt){ var t=txt.toUpperCase().replace(/^.*?C\d/,"").replace(/PFFL/,"  FFL "); return t.substring(0,40); }

function build(sheet){
  var o=new PDFOpenOptions(); o.resolution=CONFIG.dpi; o.mode=OpenDocumentMode.RGB; o.antiAlias=true; o.cropPage=CropToType.MEDIABOX; o.usePageNumber=true; o.page=1;
  var doc=app.open(new File(CONFIG.folder+sheet.pdf), o);
  var W=doc.width.as("px"), H=doc.height.as("px"), kx=W/420.0, ky=H/297.0;
  var line=doc.activeLayer; line.name="LINEWORK (multiply)"; try{ line.isBackgroundLayer=false; }catch(e){}
  function P(a){ var r=[]; for(var i=0;i<a.length;i++) r.push([a[i][0]*kx,a[i][1]*ky]); return r; }
  function fillLayer(name,key,polys,subs){
    if(!polys.length) return null;
    var L=doc.artLayers.add(); L.name=name; L.move(line,ElementPlacement.PLACEAFTER);
    for(var i=0;i<polys.length;i++) doc.selection.select(P(polys[i]), i==0?SelectionType.REPLACE:SelectionType.EXTEND, 0, true);
    if(subs) for(var j=0;j<subs.length;j++) doc.selection.select(P(subs[j]), SelectionType.DIMINISH, 0, true);
    doc.selection.fill(color(CONFIG.colors[key]||CONFIG.colors.zone)); doc.selection.deselect(); return L;
  }
  var paper=doc.artLayers.add(); paper.name="PAPER"; paper.move(line,ElementPlacement.PLACEAFTER);
  doc.selection.selectAll(); doc.selection.fill(color("FFFFFF")); doc.selection.deselect();
  line.blendMode=BlendMode.MULTIPLY;

  var R=parseRegions(readLines(CONFIG.folder+sheet.regions));
  // urutan = bawah ke atas (layer baru selalu tepat di bawah LINEWORK)
  var site=[], ctx=[], grass=[], water=[], pave=[], zones=[];
  for(var i=0;i<R.poly.length;i++){ if(R.poly[i].layer=="ASIT") site.push(R.poly[i].pts); }
  for(var i=0;i<R.hatch.length;i++){ var h=R.hatch[i], p=h.pat;
    if(/GRASS|LONGGRASS|BORDERPLANT|CREEPER|GREEN/.test(p)) grass.push(h);
    else if(/WATER|WAVE/.test(p)) water.push(h);
    else if(/ANSI31|EARTH/.test(p)) ctx.push(h);
    else if(/AR-B816|PAVING|PAVER|RANDOM|CRAZY|PEBBLE|TILE|STONE|AR-CONC/.test(p)) pave.push(h); }
  fillLayer("SITE PAVING","site",site);
  for(var e=0;e<CONFIG.extra.length;e++) fillLayer(CONFIG.extra[e][0],CONFIG.extra[e][1],[CONFIG.extra[e][2]]);
  function hatchLayers(list,name,key){ var polys=[],subs=[];
    for(var i=0;i<list.length;i++){ var L=list[i].loops; if(!L.length) continue;
      // dua loop bersarang = cincin (luar - dalam)
      if(L.length==2 && area(L[0])>area(L[1])*1.05 && inPoly(L[1][0][0],L[1][0][1],L[0])){ fillLayer(name+" (ring)", (name=="GRASS"&&!CONFIG.ground)?"site":key,[L[0]],[L[1]]); }
      else for(var k=0;k<L.length;k++) polys.push(L[k]); }
    fillLayer(name,key,polys); }
  hatchLayers(ctx,"CONTEXT","context"); hatchLayers(pave,"PAVING","paving");
  hatchLayers(water,"WATER","water"); hatchLayers(grass,"GRASS","grass");

  // zona ruang: polyline tertutup di layer AREA, warna dari teks di dalamnya
  var areas=[]; for(var i=0;i<R.poly.length;i++) if(R.poly[i].layer=="AREA") areas.push(R.poly[i].pts);
  var shadowPolys=[];
  for(var a=0;a<areas.length;a++){ var name="ZONE", key="zone";
    for(var t=0;t<R.texts.length;t++){ var tp=R.texts[t].p; if(tp && inPoly(tp[0],tp[1],areas[a])){ key=zoneKey(R.texts[t].txt); name="ZONE "+cleanName(R.texts[t].txt); break; } }
    fillLayer(name,key,[areas[a]]); shadowPolys.push(areas[a]); }

  // bayangan lembut di bawah zona bangunan
  if(shadowPolys.length){
    var sh=doc.artLayers.add(); sh.name="SHADOW"; sh.move(line,ElementPlacement.PLACEAFTER);
    for(var s=0;s<shadowPolys.length;s++) doc.selection.select(P(shadowPolys[s]), s==0?SelectionType.REPLACE:SelectionType.EXTEND,0,true);
    doc.selection.translateBoundary(UnitValue(CONFIG.shadow.px,"px"),UnitValue(CONFIG.shadow.px,"px"));
    doc.selection.fill(color("000000")); doc.selection.deselect(); sh.opacity=CONFIG.shadow.opacity; sh.applyGaussianBlur(CONFIG.shadow.blur);
    try{ sh.move(doc.artLayers.getByName("SITE PAVING"),ElementPlacement.PLACEBEFORE); }catch(e){}
  }
  doc.saveAs(new File(CONFIG.folder+sheet.out+".psd"), new PhotoshopSaveOptions(), true);
  var j=new JPEGSaveOptions(); j.quality=11; doc.saveAs(new File(CONFIG.folder+sheet.out+".jpg"), j, true);
  return areas.length;
}

var report=[];
for(var i=0;i<CONFIG.sheets.length;i++){ var n=build(CONFIG.sheets[i]); report.push(CONFIG.sheets[i].out+" : "+n+" zona AREA"); }
var f=new File(CONFIG.folder+"warna_denah_done.txt"); f.open("w"); f.write(report.join("\n")); f.close();
