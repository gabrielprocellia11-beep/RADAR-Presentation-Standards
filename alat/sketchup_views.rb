# =====================================================================
#  sketchup_views.rb - RAD+ar: ekspor view ortografis + daftar material
#  SketchUp: Extensions > Developer > Ruby Console, lalu:
#     load 'D:/.../alat/sketchup_views.rb'
#  Tidak mengubah/menyimpan model. Kamera dikembalikan di akhir.
# =====================================================================
OUT    = 'D:/000 RAD+AR/AI/PRACTICE/DIAGRAMS/_sumber/'   # folder hasil (akhiri '/')
VIEW_M = 120      # lebar/tinggi yang terlihat (meter) untuk view ortografis
W, H   = 3000, 1875
VIEWS  = { 'iso_SE'=>[1,-1,0.9], 'iso_SW'=>[-1,-1,0.9], 'iso_NE'=>[1,1,0.9], 'iso_NW'=>[-1,1,0.9],
           'tampak_S'=>[0,-1,0], 'tampak_E'=>[1,0,0], 'tampak_N'=>[0,1,0], 'tampak_W'=>[-1,0,0], 'atas'=>[0,0,1] }

Dir.mkdir(OUT) unless File.directory?(OUT)
m=Sketchup.active_model; v=m.active_view; c=v.camera
keep=[c.eye.clone, c.target.clone, c.up.clone, c.perspective?, (c.perspective? ? c.fov : c.height)]
hit=m.raytest([c.eye, c.target-c.eye]); ctr=hit ? hit[0] : c.target
ctr=Geom::Point3d.new(ctr.x, ctr.y, 0)
scale=[]
VIEWS.each{|name,d|
  dir=Geom::Vector3d.new(d[0], d[1], d[2]==0 ? 0.0001 : d[2]); dir.length=400.m
  up = (d[0]==0 && d[1]==0) ? Y_AXIS : Z_AXIS
  v.camera.set(ctr.offset(dir), ctr, up); v.camera.perspective=false; v.camera.height=VIEW_M.m
  v.write_image(OUT+name+'.png', W, H, true)
  scale << "#{name}: #{(H.to_f/VIEW_M).round(2)} px/m (ortografis, vertikal iso diperpendek)" }
File.write(OUT+'scale.txt', scale.join("\n"))
File.open(OUT+'materials.txt','w'){|o| m.materials.each{|x| cl=x.color
  o.puts [x.display_name, cl.red, cl.green, cl.blue, (x.texture ? 'tex' : '')].join('|')}}
v.camera.set(keep[0], keep[1], keep[2]); v.camera.perspective=keep[3]
keep[3] ? (v.camera.fov=keep[4]) : (v.camera.height=keep[4])
puts "VIEWS DONE -> #{OUT}"
