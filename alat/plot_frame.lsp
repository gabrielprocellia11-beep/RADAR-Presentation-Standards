;;; =====================================================================
;;;  plot_frame.lsp  -  RAD+ar: plot frame A3 per judul ke PDF + ekspor regions
;;;  Pakai (di command line AutoCAD, gambar sumber sudah terbuka):
;;;    (setq pl:out   "D:/PROYEK/PRESENTASI/01 DENAH WARNA/")   ; folder hasil, akhiri "/"
;;;    (setq pl:proj  "NAMA PROYEK")                            ; awalan nama file
;;;    (setq pl:levels '(("LEVEL2PLAN" "L2" "LEVEL 2 PLAN")      ; (judul-tanpa-spasi tag nama-file)
;;;                      ("GROUNDFLOORPLAN" "GF" "GROUND FLOOR PLAN")))
;;;    (load "D:/…/alat/plot_frame.lsp")
;;;  Judul dicocokkan dengan teks title block (huruf/angka saja, tanpa spasi).
;;;  Setting plot: AutoCAD PDF (High Quality Print) · ISO full bleed A3 · 214 plotstyle.ctb
;;;  · Window = pojok sheet A3 · Fit · Center · Landscape · lineweights + plot styles.
;;;  Hasil: <proj> <nama>.pdf, regions_<tag>.txt, frames_<tag>.txt. TIDAK menyimpan DWG.
;;; =====================================================================
(vl-load-com)
(if (not pl:out) (setq pl:out "D:/000 RAD+AR/AI/PRACTICE/"))
(if (not pl:proj) (setq pl:proj "PROJECT"))
(defun pl:bb (e / o mn mx) (setq o (vlax-ename->vla-object e))
  (vla-GetBoundingBox o 'mn 'mx) (list (vlax-safearray->list mn) (vlax-safearray->list mx)))
(defun pl:in (p bb) (and (<= (car (car bb)) (car p) (car (cadr bb))) (<= (cadr (car bb)) (cadr p) (cadr (cadr bb)))))
(defun pl:txt (e / d) (setq d (entget e))
  (if (= (cdr (assoc 0 d)) "MTEXT") (vla-get-TextString (vlax-ename->vla-object e)) (cdr (assoc 1 d))))
(defun pl:clean (s / r i c)
  (setq r "" i 1)
  (while (<= i (strlen s)) (setq c (substr s i 1))
    (if (wcmatch c "@,#") (setq r (strcat r (strcase c)))) (setq i (1+ i))) r)
;; 1. sheet frames: closed LWPOLYLINE on DEFPOINTS, aspect 420:297
(setq ss (ssget "_X" '((0 . "LWPOLYLINE") (8 . "DEFPOINTS,Defpoints,defpoints"))) frames nil i 0)
(if ss (repeat (sslength ss)
  (setq e (ssname ss i) i (1+ i) b (pl:bb e)
        w (- (car (cadr b)) (car (car b))) h (- (cadr (cadr b)) (cadr (car b))))
  (if (and (> h 0) (< (abs (- (/ w h) (/ 420.0 297.0))) 0.01)) (setq frames (cons (list w b) frames)))))
;; keep outermost sheets only (largest per cluster)
(setq sheets nil)
(foreach f (vl-sort frames '(lambda (a b) (> (car a) (car b))))
  (if (not (vl-some '(lambda (s) (and (pl:in (car (cadr f)) (cadr s)) (pl:in (cadr (cadr f)) (cadr s)))) sheets))
    (setq sheets (cons f sheets))))
(defun pl:run (want tag name / tx rep pick p0 p1 g hs ps j e d p b s on pdf ttl)
;; 2. titles inside each sheet
(setq tx (ssget "_X" '((0 . "TEXT,MTEXT") (410 . "Model"))) rep (open (strcat pl:out "frames_" tag ".txt") "w") pick nil)
(foreach s sheets
  (setq ttl "" j 0)
  (if tx (repeat (sslength tx)
    (setq e (ssname tx j) j (1+ j) p (cdr (assoc 10 (entget e))))
    (if (and (pl:in p (cadr s)) (< (cadr p) (+ (cadr (car (cadr s))) (* 0.12 (- (cadr (cadr (cadr s))) (cadr (car (cadr s)))))))
             (wcmatch (pl:clean (pl:txt e)) "*PLAN*,*FLOOR*,*LEVEL*,*LANTAI*"))
      (setq ttl (strcat ttl "|" (pl:clean (pl:txt e)))))))
  (write-line (strcat (rtos (car (car (cadr s))) 2 0) "," (rtos (cadr (car (cadr s))) 2 0) " w=" (rtos (car s) 2 0) " " ttl) rep)
  (if (and (not pick) (wcmatch ttl (strcat "*" want "*"))) (setq pick s)))
(if (not pick) (progn (princ (strcat "\nJudul " want " tidak ditemukan - lihat frames_" tag ".txt")) (exit)))

(setq p0 (car (cadr pick)) p1 (cadr (cadr pick)))
(write-line (strcat "PICK " (rtos (car p0) 2 1) "," (rtos (cadr p0) 2 1) " " (rtos (car p1) 2 1) "," (rtos (cadr p1) 2 1)) rep)
(close rep)
;; 3. seeds + polygons inside the picked sheet, in paper mm (origin top-left, 420x297)
(defun pl:pp (p) (strcat (rtos (* 420.0 (/ (- (car p) (car p0)) (- (car p1) (car p0)))) 2 2) ","
                         (rtos (* 297.0 (/ (- (cadr p1) (cadr p)) (- (cadr p1) (cadr p0)))) 2 2)))
(setq g (open (strcat pl:out "regions_" tag ".txt") "w"))
(if tx (progn (setq j 0) (repeat (sslength tx)
  (setq e (ssname tx j) j (1+ j) d (entget e) p (cdr (assoc 10 d)))
  (if (and (pl:in p (list p0 p1)) (not (wcmatch (strcase (cdr (assoc 8 d))) "DEFPOINTS")))
    (write-line (strcat "T|" (cdr (assoc 8 d)) "|" (pl:pp p) "|" (rtos (* 297.0 (/ (cdr (assoc 40 d)) (- (cadr p1) (cadr p0)))) 2 2) "|" (pl:clean (pl:txt e))) g)))))
(setq hs (ssget "_X" '((0 . "HATCH") (410 . "Model"))) j 0)
(if hs (repeat (sslength hs)
  (setq e (ssname hs j) j (1+ j) d (entget e) b (pl:bb e))
  (if (and (pl:in (car b) (list p0 p1)) (pl:in (cadr b) (list p0 p1)) (/= (cdr (assoc 2 d)) "SOLID"))
    (progn (setq s (strcat "H|" (cdr (assoc 8 d)) "|" (cdr (assoc 2 d)) "|") on nil)
      ;; boundary vertices (code 10 after first 91)
      (foreach x d (cond ((= (car x) 91) (setq on T)) ((= (car x) 75) (setq on nil))
                         ((and on (= (car x) 10)) (setq s (strcat s (pl:pp (cdr x)) ";")))
                         ((and on (= (car x) 92)) (setq s (strcat s "#")))))
      (write-line s g)))))
(setq ps (ssget "_X" '((0 . "LWPOLYLINE") (410 . "Model") (70 . 1))) j 0)
(if ps (repeat (sslength ps)
  (setq e (ssname ps j) j (1+ j) d (entget e) b (pl:bb e))
  (if (and (pl:in (car b) (list p0 p1)) (pl:in (cadr b) (list p0 p1)) (not (wcmatch (strcase (cdr (assoc 8 d))) "DEFPOINTS,ACUT,AHAT,ATEX*,ADIM")))
    (progn (setq s (strcat "P|" (cdr (assoc 8 d)) "|"))
      (foreach x d (if (= (car x) 10) (setq s (strcat s (pl:pp (cdr x)) ";"))))
      (write-line s g)))))
(close g)
;; 4. PLOT (exact dialog settings)
(setvar "BACKGROUNDPLOT" 0)
(setq pdf (strcat pl:out pl:proj " " name ".pdf"))
(command "_.-PLOT" "_Y" "Model" "AutoCAD PDF (High Quality Print).pc3" "ISO full bleed A3 (297.00 x 420.00 MM)"
         "_M" "_L" "_N" "_W" p0 p1 "_F" "_C" "_Y" "214 plotstyle.ctb" "_Y" "_W" pdf "_N" "_Y")
(while (> (getvar "CMDACTIVE") 0) (command ""))
(setq rep (open (strcat pl:out "plot-done_" tag ".txt") "w")) (write-line (strcat "PDF " pdf " exists=" (if (findfile pdf) "YES" "NO")) rep) (close rep)


(princ (strcat "\nPLOT " tag " DONE")))
(if pl:levels (foreach L pl:levels (apply 'pl:run L)))
(princ)
