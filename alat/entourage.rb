# =====================================================================
#  entourage.rb - RAD+ar: ekspor view axo + posisi pohon/semak/orang berskala
#  Ruby Console:  load 'D:/.../alat/entourage.rb'   -> E_base.png + E_entourage.json
#  Lalu Photoshop: alat/entourage.jsx (MODE = "axo").
# =====================================================================
OUT='D:/000 RAD+AR/AI/PRACTICE/DIAGRAMS/_sumber/'   # folder hasil (akhiri '/')
VIEW_M=95          # tinggi view ortografis (m)
DIRV=[1,-1,0.9]    # arah kamera (iso SE)
m=Sketchup.active_model; v=m.active_view; d=OUT
Dir.mkdir(d) unless File.directory?(d)
c=v.camera; keep=[c.eye.clone,c.target.clone,c.up.clone,c.perspective?,(c.perspective? ? c.fov : c.height)]
# centre = what the user is looking at
hit=m.raytest([c.eye,c.target-c.eye]); ctr=hit ? hit[0] : c.target
ctr=Geom::Point3d.new(ctr.x,ctr.y,0)
dir=Geom::Vector3d.new(*DIRV); dir.length=250.m
v.camera.set(ctr.offset(dir),ctr,Z_AXIS); v.camera.perspective=false; v.camera.height=VIEW_M.m
W=3000; H=1875
v.write_image(d+'E_base.png',W,H,true)
sx=W.to_f/v.vpwidth; sy=H.to_f/v.vpheight
scr=lambda{|p| q=v.screen_coords(p); [(q.x*sx).round(1),(q.y*sy).round(1)]}
on=lambda{|q| q[0]>-50 && q[0]<W+50 && q[1]>-50 && q[1]<H+50}
grass=[]; pave=[]
walk=lambda{|ents,tr,depth|
  ents.each{|e|
    if e.is_a?(Sketchup::Face)
      mat=e.material; next unless mat
      n=e.normal.transform(tr); next unless n.z>0.95
      a=e.area*(tr.xscale*tr.yscale rescue 1); next if a<1.5.m*1.5.m
      pts=e.outer_loop.vertices.map{|vx| vx.position.transform(tr)}
      next if pts[0].z>20.m
      cl=mat.color; nm=mat.display_name.downcase
      g=(nm=~/grass|rumput|lawn|green|plant|taman/ || (cl.green>cl.red+15 && cl.green>cl.blue+10))
      (g ? grass : pave) << pts
    elsif (e.is_a?(Sketchup::Group) || e.is_a?(Sketchup::ComponentInstance)) && depth<5 && !e.hidden?
      df=e.respond_to?(:definition) ? e.definition : e.entities.parent
      walk.call(df.entities,tr*e.transformation,depth+1)
    end}}
walk.call(m.entities,Geom::Transformation.new,0)
def inside(pt,poly)
  c=false; j=poly.size-1
  poly.each_with_index{|p,i| q=poly[j]
    c=!c if ((p.y>pt.y)!=(q.y>pt.y)) && (pt.x < (q.x-p.x)*(pt.y-p.y)/(q.y-p.y)+p.x); j=i}; c
end
srand(7); out={'W'=>W,'H'=>H,'grass'=>[],'trees'=>[],'shrubs'=>[],'people'=>[]}
grass.each{|pts| s=pts.map{|p| scr.call(p)}; next unless s.any?{|q| on.call(q)}; out['grass']<<s
  xs=pts.map(&:x); ys=pts.map(&:y); z=pts.map(&:z).max
  area=(xs.max-xs.min)*(ys.max-ys.min)
  # trees every ~7 m on bigger lawns, shrubs everywhere
  ntr=(area/(7.m*7.m)).to_i.clamp(0,12); nsh=(area/(2.5.m*2.5.m)).to_i.clamp(1,40)
  [[ntr,'trees',7.m,2.6.m],[nsh,'shrubs',1.0.m,0.6.m]].each{|cnt,key,h,r| k=0; tries=0
    while k<cnt && tries<cnt*20; tries+=1
      p=Geom::Point3d.new(xs.min+rand*(xs.max-xs.min), ys.min+rand*(ys.max-ys.min), z)
      next unless inside(p,pts); b=scr.call(p); next unless on.call(b)
      t=scr.call(p.offset(Z_AXIS,h)); rr=scr.call(p.offset(Geom::Vector3d.new(1,1,0),r))
      out[key]<<[b,t,((rr[0]-b[0])**2+(rr[1]-b[1])**2)**0.5]; k+=1 end}}
pave.select{|pts| pts.map(&:z).max<3.m}.sort_by{|pts| -pts.size}.first(60).each{|pts|
  xs=pts.map(&:x); ys=pts.map(&:y); z=pts.map(&:z).max; area=(xs.max-xs.min)*(ys.max-ys.min)
  next if area<30.m*1.m
  n=(area/(60.m*1.m)).to_i.clamp(0,4); k=0; tries=0
  while k<n && tries<60; tries+=1
    p=Geom::Point3d.new(xs.min+rand*(xs.max-xs.min), ys.min+rand*(ys.max-ys.min), z)
    next unless inside(p,pts); b=scr.call(p); next unless on.call(b)
    t=scr.call(p.offset(Z_AXIS,1.7.m)); out['people']<<[b,t]; k+=1 end}
out['ppm']=(scr.call(ctr.offset(Z_AXIS,10.m))[1]-scr.call(ctr)[1]).abs/10.0
require 'json'; File.write(d+'E_entourage.json',JSON.generate(out))
v.camera.set(keep[0],keep[1],keep[2]); v.camera.perspective=keep[3]
keep[3] ? (v.camera.fov=keep[4]) : (v.camera.height=keep[4])
puts "ENTOURAGE DONE g=#{out['grass'].size} t=#{out['trees'].size} s=#{out['shrubs'].size} p=#{out['people'].size}"
