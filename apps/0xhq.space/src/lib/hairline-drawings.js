// biome-ignore-all lint: Validated Hairline figure with its unchanged upstream kernel.
// Engine: @lucasmarkes/hairline, MIT.
/*
MIT License

Copyright (c) 2026 Lucas Marques

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/* hairline kernel sha256:346b48bdef2cdfafd5343eba01494255cf75f9c078e6fcd1aafc62bab62980a1 */
/*
 * HL: everything a figure may call. Read this index; the code under it is the
 * package's src/core, unchanged, and a figure should not need to read it.
 *
 * Every figure is drawn in a 400 × 320 viewBox. World space is x/y on the
 * ground and z up. Plates are filled with the ground colour and painted back
 * to front, so a nearer one covers a farther one: append in that order. At
 * the default camera, Cam(45, 0.5, S), +x runs down to the right and +y down
 * to the left, so the corner with the largest x and y is nearest the viewer:
 * append by ascending x + y, from the far corner (smallest x and y) to it.
 *
 * Camera
 *   Cam(azDeg, k, S)                       a camera: azimuth in degrees, k = sin(elevation) (0.5 is the 2:1 view), S = scale
 *   fit(C, points, cx, cy)                 centres the box of [x, y, z] points on (cx, cy); call it once, before proj
 *                                          it only centres, it never scales: choose S by trying values, with the most extreme pose in points.
 *                                          The six figures use S 1.42 to 2.12; the boxes they fit come out 230 to 310 wide and 180 to 245 tall
 *   proj(C)                                returns P(x, y, z), which gives [sx, sy]
 *   unproj(C, sx, sy, z)                   the world [x, y] under a screen point, on the plane at height z
 *   facing(C)                              returns front(sample): whether a ring sample faces the camera
 * Rounded solids
 *   rrect(u0, v0, u1, v1, r, n)            a rounded rectangle, as a ring of samples {u, v, nu, nv}
 *   circ(R, n)                             a circle, as a ring
 *   rings(x0, y0, x1, y1, r, b)            [ring, inner]: a rounded footprint and its crease ring, inset by b
 *                                          r, the corner radius, is cut to half the shorter side. b, the crease's inset in world units
 *                                          (0.6 to 2.2 in the figures), must stay under half the shorter side or the crease turns inside out
 *   prism(P, front, ring, inner, z0, z1)   {sil, crease}: a solid standing from z0 to z1, as two path strings
 *   ringAt(P, ring, z)                     the ring's points, projected at height z
 *   run(ring, keep)                        the one cyclic run of samples that pass keep
 *   hull(points)                           the convex hull of screen points
 *   extremes(P, ring)                      [left, right, nearest] samples: where dashed drops fall from
 *   fillet(points, radii, n)               rounds every vertex of a closed polygon; returns the new points
 *                                          radii is an array, one radius per vertex, each cut to half its shorter edge; a single number gives NaN.
 *                                          n is the steps round each corner, default 4: each vertex becomes n + 1 points
 *   ghost(P, front, ring, z0, depth)       a reflection's path {d, y0, y1}; reflect() draws it for you
 * Paths and numbers
 *   poly(points)                           a closed path string
 *   open(points)                           an open polyline string
 *   seg(a, b)                              one segment between two screen points [sx, sy], as its own subpath; project world points with P first
 *   clamp(v, a, b)
 *   lerp(a, b, t)
 *   rad(deg)
 *   r2(n)                                  two decimals
 * The continuous clock: one spring per moving number
 *   spring(x, opts)                        at rest on x; write .t to retarget; opts {k, c, m, eps}, default k 100, c 18, m 1
 *   stepS(sp, dt)                          advances by dt seconds; returns whether it is still moving
 * The discrete clock: a 700ms tween on (.32, .72, 0, 1)
 *   tween(v, dur)                          at rest on v; dur defaults to 700 (ms)
 *   tset(tw, to, now, delay)               retargets from where it is, after delay ms: the stagger
 *                                          the same target again does nothing, so calling it on every pointer move is safe
 *   tval(tw, now)                          its value at now
 *   tdone(tw, now)                         whether it has landed
 *   bezier(x1, y1, x2, y2)                 a CSS cubic-bezier, as a function of progress
 *   EASE_LIFT                              the lift curve itself
 *   reducedMotion()                        true when the reader asked for less motion; springs and tweens already land at once
 *   setReducedMotion(on)                   the loop's business, not a figure's
 * Drawing
 *   mk(tag, attrs, parent)                 one svg element: the only way a figure makes a node
 *   solid(parent)                          {g, sil, cr}: a group holding a silhouette path and a crease path
 *   put(solid, paths)                      writes prism()'s {sil, crease} into solid()'s {sil, cr}: sil into sil, crease into cr
 *   flatDot(parent, C, r, cls)             a dot lying on the ground plane; cls is "dot", "dot m" or "dot off"
 *   place(el, point)                       moves a dot or a circle to [sx, sy]
 *   reflect(svg, parent, P, front, ring, z0, depth)   a fading mirror under a solid
 *   fade(svg, y0, y1, a0)                  a vertical fade, as a mask; returns the value for a mask attribute
 * Life
 *   register(stage, tick)                  joins the one frame loop; tick(dt in seconds, now in ms) returns true to ask for another frame; gives {wake, unregister}
 *   pointer(stage, handlers)               {move(point), down(point), leave()}, points in viewBox units; returns its disposer
 *   disposer()                             {add, on, dispose}: collects tear-down, so destroy is bag.dispose
 * The bench's business, not a figure's
 *   css(lightDark)
 *   inject(root)
 *   tour(stage, stops, onStop)             an unseen pointer that walks the stops, [x, y] in viewBox units or null to leave, and gives way to a real one; onStop(i) on each arrival; returns {stop}
 *   LAP                                    the default stops: a diamond around the centre, then a leave
 *
 * Classes, on path, polygon, ellipse and line. They are the whole palette; a
 * figure sets no colour, width or fill of its own.
 *     (none)   filled with the ground colour, medium stroke
 *     sil      the silhouette's stroke        hi    the bright stroke: the only highlight
 *     lo       the dim stroke                 nf    no fill        fo   fill only, no stroke
 *     dash     a dashed guide
 *     dot      a bright dot                   dot m   a medium dot     dot off   a dim dot
 */
var HL = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/hairline/src/core/kernel.ts
  var kernel_exports = {};
  __export(kernel_exports, {
    Cam: () => Cam,
    EASE_LIFT: () => EASE_LIFT,
    LAP: () => LAP,
    bezier: () => bezier,
    circ: () => circ,
    clamp: () => clamp,
    css: () => css,
    disposer: () => disposer,
    extremes: () => extremes,
    facing: () => facing,
    fade: () => fade,
    fillet: () => fillet,
    fit: () => fit,
    flatDot: () => flatDot,
    ghost: () => ghost,
    hull: () => hull,
    inject: () => inject,
    lerp: () => lerp,
    mk: () => mk,
    open: () => open,
    place: () => place,
    pointer: () => pointer,
    poly: () => poly,
    prism: () => prism,
    proj: () => proj,
    put: () => put,
    r2: () => r2,
    rad: () => rad,
    reducedMotion: () => reducedMotion,
    reflect: () => reflect,
    register: () => register,
    ringAt: () => ringAt,
    rings: () => rings,
    rrect: () => rrect,
    run: () => run,
    seg: () => seg,
    setReducedMotion: () => setReducedMotion,
    solid: () => solid,
    spring: () => spring,
    stepS: () => stepS,
    tdone: () => tdone,
    tour: () => tour,
    tset: () => tset,
    tval: () => tval,
    tween: () => tween,
    unproj: () => unproj
  });

  // packages/hairline/src/core/iso.ts
  var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  var lerp = (a, b, t) => a + (b - a) * t;
  var rad = (d) => d * Math.PI / 180;
  var r2 = (n) => Math.round(n * 100) / 100;
  var poly = (pts) => "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L") + "Z";
  var seg = (a, b) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`;
  var open = (pts) => pts.length < 2 ? "" : "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L");
  var Cam = (azDeg, k, S) => ({ az: rad(azDeg), k, S, ox: 0, oy: 0 });
  function proj(C) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    return (x, y, z) => {
      const X = x * c - y * s, Y = x * s + y * c;
      return [C.ox + C.S * X, C.oy + C.S * (Y * C.k - z * zf)];
    };
  }
  function unproj(C, sx, sy, z) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const X = (sx - C.ox) / C.S, Y = ((sy - C.oy) / C.S + z * zf) / C.k;
    return [X * c + Y * s, -X * s + Y * c];
  }
  function fit(C, pts, cx, cy) {
    C.ox = 0;
    C.oy = 0;
    const P = proj(C);
    let a = 1e9, b = -1e9, c = 1e9, d = -1e9;
    for (const p of pts) {
      const q = P(p[0], p[1], p[2]);
      a = Math.min(a, q[0]);
      b = Math.max(b, q[0]);
      c = Math.min(c, q[1]);
      d = Math.max(d, q[1]);
    }
    C.ox = cx - (a + b) / 2;
    C.oy = cy - (c + d) / 2;
  }
  function rrect(u0, v0, u1, v1, r, n = 4) {
    r = Math.max(0, Math.min(r, (u1 - u0) / 2, (v1 - v0) / 2));
    const out = [];
    for (const [cu, cv, a0] of [[u1 - r, v1 - r, 0], [u0 + r, v1 - r, 90], [u0 + r, v0 + r, 180], [u1 - r, v0 + r, 270]])
      for (let k = 0; k <= n; k++) {
        const a = rad(a0 + 90 * k / n), ca = Math.cos(a), sa = Math.sin(a);
        out.push({ u: cu + r * ca, v: cv + r * sa, nu: ca, nv: sa });
      }
    return out;
  }
  function circ(R, n = 96) {
    const out = [];
    for (let k = 0; k < n; k++) {
      const a = k / n * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      out.push({ u: R * ca, v: R * sa, nu: ca, nv: sa });
    }
    return out;
  }
  function hull(input) {
    const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const x = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of pts) {
      while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
      lo.push(p);
    }
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i];
      while (up.length > 1 && x(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
      up.push(p);
    }
    lo.pop();
    up.pop();
    return lo.concat(up);
  }
  var ringAt = (P, ring, z) => ring.map((q) => P(q.u, q.v, z));
  var facing = (C) => {
    const s = Math.sin(C.az), c = Math.cos(C.az);
    return (q) => q.nu * s + q.nv * c >= -1e-6;
  };
  function run(ring, keep) {
    const n = ring.length;
    let s = -1;
    for (let i = 0; i < n; i++) if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) {
      s = i;
      break;
    }
    if (s < 0) return keep(ring[0]) ? ring.slice() : [];
    const out = [];
    for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) out.push(ring[(s + k) % n]);
    return out;
  }
  function prism(P, front, ring, inner, z0, z1) {
    return {
      sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))),
      crease: inner ? open(ringAt(P, run(inner, front), z1)) : ""
    };
  }
  var rings = (x0, y0, x1, y1, r, b) => [
    rrect(x0, y0, x1, y1, r),
    rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b))
  ];
  function extremes(P, ring) {
    const pr = ring.map((q) => P(q.u, q.v, 0));
    let a = 0, b = 0, c = 0;
    pr.forEach((p, k) => {
      if (p[0] < pr[a][0]) a = k;
      if (p[0] > pr[b][0]) b = k;
      if (p[1] > pr[c][1]) c = k;
    });
    return [ring[a], ring[b], ring[c]];
  }
  function fillet(pts, rs, n = 4) {
    const m = pts.length, out = [];
    for (let i = 0; i < m; i++) {
      const a = pts[(i + m - 1) % m], p = pts[i], b = pts[(i + 1) % m];
      const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
      const t = Math.min(rs[i], la / 2, lb / 2);
      const p1 = [p[0] + (a[0] - p[0]) / la * t, p[1] + (a[1] - p[1]) / la * t];
      const p2 = [p[0] + (b[0] - p[0]) / lb * t, p[1] + (b[1] - p[1]) / lb * t];
      for (let k = 0; k <= n; k++) {
        const s = k / n, w = 1 - s;
        out.push([w * w * p1[0] + 2 * w * s * p[0] + s * s * p2[0], w * w * p1[1] + 2 * w * s * p[1] + s * s * p2[1]]);
      }
    }
    return out;
  }
  function ghost(P, front, ring, z0, depth) {
    const f = run(ring, front), lowP = ringAt(P, f, z0 - depth);
    return {
      d: open(lowP) + [f[0], f[f.length - 1]].map((q) => seg(P(q.u, q.v, z0), P(q.u, q.v, z0 - depth))).join(""),
      y0: Math.min(...ringAt(P, f, z0).map((p) => p[1])),
      y1: Math.max(...lowP.map((p) => p[1])) + 2
    };
  }

  // packages/hairline/src/core/motion.ts
  var reduced = false;
  var setReducedMotion = (on) => {
    reduced = on;
  };
  var reducedMotion = () => reduced;
  function spring(x, o = {}) {
    return { x, v: 0, t: x, k: o.k ?? 100, c: o.c ?? 18, m: o.m ?? 1, eps: o.eps ?? 0.01 };
  }
  function stepS(sp, dt) {
    if (reduced) {
      sp.x = sp.t;
      sp.v = 0;
      return false;
    }
    const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = (-sp.k * (sp.x - sp.t) - sp.c * sp.v) / sp.m;
      sp.v += a * h;
      sp.x += sp.v * h;
    }
    if (Math.abs(sp.x - sp.t) < sp.eps && Math.abs(sp.v) < sp.eps * 10) {
      sp.x = sp.t;
      sp.v = 0;
      return false;
    }
    return true;
  }
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = (u) => ((ax * u + bx) * u + cx) * u;
    const Y = (u) => ((ay * u + by) * u + cy) * u;
    const dX = (u) => (3 * ax * u + 2 * bx) * u + cx;
    return (t) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      let u = t;
      for (let i = 0; i < 8; i++) {
        const e = X(u) - t;
        if (Math.abs(e) < 1e-5) break;
        const d = dX(u);
        if (Math.abs(d) < 1e-6) break;
        u -= e / d;
      }
      if (!(u >= 0 && u <= 1) || Math.abs(X(u) - t) > 1e-4) {
        let lo = 0, hi = 1;
        u = t;
        for (let i = 0; i < 24; i++) {
          if (X(u) < t) lo = u;
          else hi = u;
          u = (lo + hi) / 2;
        }
      }
      return Y(u);
    };
  }
  var EASE_LIFT = bezier(0.32, 0.72, 0, 1);
  var tween = (v, dur = 700) => ({ from: v, to: v, t0: -1e9, dur });
  var tval = (tw, now) => {
    const p = clamp((now - tw.t0) / tw.dur, 0, 1);
    return tw.from + (tw.to - tw.from) * (reduced ? 1 : EASE_LIFT(p));
  };
  var tset = (tw, to, now, delay) => {
    if (tw.to === to) return;
    tw.from = tval(tw, now);
    tw.to = to;
    tw.t0 = now + delay;
  };
  var tdone = (tw, now) => reduced || now >= tw.t0 + tw.dur;

  // packages/hairline/src/core/stage.ts
  var NS = "http://www.w3.org/2000/svg";
  function mk(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, String(attrs[k]));
    if (parent) parent.appendChild(e);
    return e;
  }
  function solid(parent) {
    const g = mk("g", {}, parent);
    return { g, sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g) };
  }
  var put = (el, s) => {
    el.sil.setAttribute("d", s.sil);
    el.cr.setAttribute("d", s.crease);
  };
  var flatDot = (parent, C, r, cls) => mk("ellipse", { rx: r2(r * C.S), ry: r2(r * C.S * C.k), class: cls }, parent);
  var place = (el, q) => {
    el.setAttribute("cx", String(r2(q[0])));
    el.setAttribute("cy", String(r2(q[1])));
  };
  var fid = 0;
  function fade(svg, y0, y1, a0 = 0.7) {
    const id = "hl-fd" + ++fid, defs = mk("defs", {}, svg);
    const lg = mk("linearGradient", { id: id + "g", gradientUnits: "userSpaceOnUse", x1: 0, y1: r2(y0), x2: 0, y2: r2(y1) }, defs);
    mk("stop", { offset: 0, "stop-color": "#fff", "stop-opacity": a0 }, lg);
    mk("stop", { offset: 1, "stop-color": "#fff", "stop-opacity": 0 }, lg);
    const m = mk("mask", { id, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 400, height: 320 }, defs);
    mk("rect", { x: 0, y: 0, width: 400, height: 320, fill: `url(#${id}g)` }, m);
    return `url(#${id})`;
  }
  function reflect(svg, parent, P, front, ring, z0, depth) {
    const r = ghost(P, front, ring, z0, depth);
    const gh = mk("g", { class: "ghost", mask: fade(svg, r.y0, r.y1) }, parent);
    mk("path", { d: r.d }, gh);
  }
  var boards = [];
  var byStage = /* @__PURE__ */ new Map();
  var raf = 0;
  var last = 0;
  var io = null;
  var rm = null;
  function frame() {
    const now = performance.now();
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1e3));
    last = now;
    let any = false;
    for (const b of boards.slice()) if (b.vis && b.awake) {
      try {
        b.awake = !!b.tick(dt, now);
      } catch (err) {
        b.awake = false;
        setTimeout(() => {
          throw err;
        });
      }
      any = any || b.awake;
    }
    raf = any ? requestAnimationFrame(frame) : 0;
  }
  function wake(b) {
    b.awake = true;
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }
  var onMotion = () => {
    setReducedMotion(!!rm?.matches);
    boards.forEach(wake);
  };
  function start() {
    if (io) return;
    io = new IntersectionObserver((es) => {
      for (const e of es) {
        const set = byStage.get(e.target);
        if (!set) continue;
        for (const b of set) {
          b.vis = e.isIntersecting;
          if (b.vis) wake(b);
        }
      }
    }, { rootMargin: "80px" });
    rm = matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(rm.matches);
    rm.addEventListener("change", onMotion);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    io?.disconnect();
    io = null;
    rm?.removeEventListener("change", onMotion);
    rm = null;
  }
  function register(stage, tick) {
    start();
    const b = { stage, tick, vis: false, awake: true };
    boards.push(b);
    const peers = byStage.get(stage);
    if (peers) {
      for (const p of peers) b.vis = p.vis;
      peers.add(b);
      if (b.vis) wake(b);
    } else {
      byStage.set(stage, /* @__PURE__ */ new Set([b]));
      io.observe(stage);
    }
    tick(0, performance.now());
    let gone = false;
    return {
      wake: () => {
        if (!gone) wake(b);
      },
      unregister: () => {
        if (gone) return;
        gone = true;
        boards = boards.filter((x) => x !== b);
        const set = byStage.get(stage);
        if (set) {
          set.delete(b);
          if (!set.size) {
            byStage.delete(stage);
            io?.unobserve(stage);
          }
        }
        if (!boards.length) stop();
      }
    };
  }
  var handlers = /* @__PURE__ */ new WeakMap();
  var touring = /* @__PURE__ */ new WeakMap();
  function pointer(stage, on) {
    handlers.set(stage, on);
    let tm = 0;
    const pt = (e) => {
      const r = stage.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width * 400, (e.clientY - r.top) / r.height * 320];
    };
    const move = (e) => {
      clearTimeout(tm);
      touring.get(stage)?.hold();
      on.move(pt(e), e);
    };
    const down = (e) => {
      clearTimeout(tm);
      touring.get(stage)?.hold();
      if (e.pointerType !== "mouse") stage.releasePointerCapture?.(e.pointerId);
      if (on.down) on.down(pt(e), e);
      else on.move(pt(e), e);
    };
    const leave = (e) => {
      clearTimeout(tm);
      tm = window.setTimeout(() => {
        on.leave(e);
        touring.get(stage)?.release();
      }, e.pointerType === "mouse" ? 0 : 1400);
    };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointerleave", leave);
    return () => {
      clearTimeout(tm);
      if (handlers.get(stage) === on) handlers.delete(stage);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointerleave", leave);
    };
  }
  var LAP = [[128, 150], [200, 118], [272, 150], [200, 206], null];
  var TRAVEL = 900;
  var DWELL = 1200;
  var REST = 1800;
  var RESUME = 1200;
  var STAGGER = 450;
  var GHOST = { pointerType: "ghost" };
  var started = 0;
  function entry([x, y]) {
    const dx = x - 200, dy = y - 160;
    if (!dx && !dy) return [200, 320];
    const k = Math.min(dx ? (dx > 0 ? 200 : -200) / dx : Infinity, dy ? (dy > 0 ? 160 : -160) / dy : Infinity);
    return [200 + dx * k, 160 + dy * k];
  }
  function tour(stage, stops, onStop) {
    let i = 0;
    let wait = RESUME + STAGGER * (started++ % 4);
    let t = -1;
    let at = null;
    let origin = [200, 320];
    let hand = false, keys = stage.contains(stage.ownerDocument.activeElement);
    let gone = false;
    const leave = () => {
      at = null;
      t = -1;
      handlers.get(stage)?.leave(GHOST);
    };
    const tick = (dt) => {
      if (hand || keys || !stops.length) return false;
      if (reducedMotion()) {
        if (at) leave();
        return false;
      }
      if (wait > 0) {
        wait -= dt * 1e3;
        return true;
      }
      const stop2 = stops[i];
      if (stop2 === null) {
        if (at) leave();
        onStop?.(i);
        i = (i + 1) % stops.length;
        wait = REST;
        return true;
      }
      const h = handlers.get(stage);
      if (!h) return true;
      if (t < 0) {
        origin = at ?? entry(stop2);
        t = 0;
      }
      t = Math.min(TRAVEL, t + dt * 1e3);
      const k = EASE_LIFT(t / TRAVEL);
      at = [origin[0] + (stop2[0] - origin[0]) * k, origin[1] + (stop2[1] - origin[1]) * k];
      h.move(at, GHOST);
      if (t < TRAVEL) return true;
      onStop?.(i);
      i = (i + 1) % stops.length;
      t = -1;
      wait = DWELL;
      return true;
    };
    const take = () => {
      at = null;
      t = -1;
    };
    const give = () => {
      if (hand || keys) return;
      i = 0;
      t = -1;
      wait = RESUME;
      board.wake();
    };
    const me = {
      hold: () => {
        hand = true;
        take();
      },
      release: () => {
        if (!hand) return;
        hand = false;
        give();
      }
    };
    const focusIn = () => {
      keys = true;
      take();
    };
    const focusOut = (e) => {
      if (keys && !stage.contains(e.relatedTarget)) {
        keys = false;
        give();
      }
    };
    stage.addEventListener("focusin", focusIn);
    stage.addEventListener("focusout", focusOut);
    touring.set(stage, me);
    const board = register(stage, tick);
    return {
      stop: () => {
        if (gone) return;
        gone = true;
        board.unregister();
        stage.removeEventListener("focusin", focusIn);
        stage.removeEventListener("focusout", focusOut);
        if (touring.get(stage) === me) touring.delete(stage);
        if (at) leave();
      }
    };
  }
  function disposer() {
    let fns = [];
    return {
      add: (fn) => {
        fns.push(fn);
      },
      on: (target, type, fn, opts) => {
        const h = fn;
        target.addEventListener(type, h, opts);
        fns.push(() => target.removeEventListener(type, h, opts));
      },
      dispose: () => {
        const run2 = fns;
        fns = [];
        for (let i = run2.length - 1; i >= 0; i--) run2[i]();
      }
    };
  }

  // packages/hairline/src/core/styles.ts
  var LIGHT = { plate: "#ffffff", hi: "#232327", edge: "#a4a4ac", mid: "#c3c3c9", lo: "#e0e0e4" };
  var DARK = { plate: "#08090a", hi: "#d0d6e0", edge: "#5b5d64", mid: "#3e3e44", lo: "#29292d" };
  var KEYS = ["plate", "hi", "edge", "mid", "lo"];
  var vars = (p) => KEYS.map((k) => `--hl-${k}:var(--hairline-${k},${p[k]});`).join("");
  var EASE = "cubic-bezier(0.5,0,0.1,1)";
  var SVG = ":where([data-hairline]>svg)";
  function css(lightDark) {
    const both = Object.fromEntries(KEYS.map((k) => [k, `light-dark(${LIGHT[k]},${DARK[k]})`]));
    return [
      // the box, and the palette: light unless something below says otherwise
      `:where([data-hairline]){display:block;position:relative;aspect-ratio:5/4;touch-action:pan-y;user-select:none;-webkit-user-select:none;--hl-sw:var(--hairline-stroke,0.9);${vars(LIGHT)}}`,
      // the page's color-scheme
      lightDark ? `:where([data-hairline]){${vars(both)}}` : "",
      // an ancestor that says dark
      `:where(.dark,[data-theme="dark"]) :where([data-hairline]){${vars(DARK)}}`,
      // the figure's own theme option
      `:where([data-hairline][data-hairline-theme="light"]){${vars(LIGHT)}}`,
      `:where([data-hairline][data-hairline-theme="dark"]){${vars(DARK)}}`,
      `:where([data-hairline]:focus-visible){outline:1.5px solid var(--hl-hi);outline-offset:2px}`,
      `${SVG}{position:absolute;inset:0;width:100%;height:100%;display:block}`,
      // Riffle's live region: read, not seen
      `:where([data-hairline]>[data-hairline-live]){position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`,
      // the drawing: plates are filled with the plate colour and painted back to front
      `${SVG} :where(path,polygon,ellipse,line){fill:var(--hl-plate);stroke:var(--hl-mid);stroke-width:var(--hl-sw);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round;transition:stroke 260ms ${EASE}}`,
      `${SVG} :where(.nf){fill:none}`,
      `${SVG} :where(.fo){stroke:none}`,
      `${SVG} :where(.sil){stroke:var(--hl-edge)}`,
      `${SVG} :where(.hi){stroke:var(--hl-hi)}`,
      `${SVG} :where(.lo){stroke:var(--hl-lo)}`,
      `${SVG} :where(.dash){stroke-dasharray:1 3}`,
      `${SVG} :where(.dot){stroke:none;fill:var(--hl-hi);transition:fill 260ms ${EASE}}`,
      `${SVG} :where(.dot.m){fill:var(--hl-edge)}`,
      `${SVG} :where(.dot.off){fill:var(--hl-lo)}`,
      `${SVG} :where(.ghost path){fill:none;stroke:var(--hl-mid)}`
    ].join("");
  }
  var done = /* @__PURE__ */ new WeakSet();
  function inject(root) {
    if (done.has(root)) return;
    done.add(root);
    const doc = root.nodeType === 9 ? root : root.ownerDocument;
    const win = doc.defaultView;
    const text = css(!!win?.CSS?.supports?.("color", "light-dark(#000,#fff)"));
    if (win && "adoptedStyleSheets" in root) {
      try {
        const sheet = new win.CSSStyleSheet();
        sheet.replaceSync(text);
        root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
        return;
      } catch {
      }
    }
    const style = doc.createElement("style");
    style.setAttribute("data-hairline-style", "");
    style.textContent = text;
    (root.nodeType === 9 ? doc.head ?? doc.documentElement : root).appendChild(style);
  }
  return __toCommonJS(kernel_exports);
})();
/* /hairline kernel */





/** Bonjour: an open sketchbook, its blank leaves inviting a closer look. */
const {
  Cam, clamp, facing, fillet, fit, hull, mk, open, pointer, poly, prism,
  proj, put, rad, register, rings, solid, spring, stepS, unproj, disposer,
} = HL;

function mountSketchbookFigure({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value, hand = null, side = -1;
  const C = Cam(45, 0.5, 1.86);
  fit(C, [[-70, -48, 0], [-70, 48, 0], [87, -48, 0], [87, 48, 0],
    [0, -44, 55], [64, 44, 55]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [cover, coverIn] = rings(1, -47, 68, 47, 4, 1.5);
  const [leaf, leafIn] = rings(2, -43, 64, 43, 3, 1.1);
  const [left, leftIn] = rings(-64, -43, -2, 43, 3, 1.1);
  const [leftCover, leftCoverIn] = rings(-68, -47, -1, 47, 4, 1.5);
  const leftP = (x, y, z) => P(x, y, z + (-x - 2) * 0.075);
  put(solid(g), prism(leftP, front, leftCover, leftCoverIn, 0, 2.5));
  put(solid(g), prism(P, front, cover, coverIn, 0, 2.5));
  // The rounded spine joins the two covers; every line belongs to the book.
  const [spine, spineIn] = rings(-2.5, -45, 2.5, 45, 2, 0.7);
  put(solid(g), prism(P, front, spine, spineIn, 2, 5));
  put(solid(g), prism(leftP, front, left, leftIn, 3, 4));
  const leftPage = solid(g);
  put(leftPage, prism(leftP, front, left, leftIn, 5, 6));
  const pages = Array.from({ length: 4 }, (_, i) => ({
    part: solid(g), angle: spring(2 + i * 3), last: NaN,
  }));
  // A hexagonal barrel, exposed wood and graphite distinguish the pencil.
  const pencil = mk("g", {}, g);
  const body = fillet([[77, -32], [81, -47], [85, -32], [85, 35], [77, 35]],
    [0.8, 0.45, 0.8, 1.2, 1.2]);
  const pencilP = (x, y, z) => P(x + (y + 3) * 0.09, y, z);
  mk("path", { class: "sil", d: poly(hull(body.map(([x, y]) => pencilP(x, y, 1))
    .concat(body.map(([x, y]) => pencilP(x, y, 5))))) }, pencil);
  mk("path", { class: "nf lo", d: open([[81, -32], [81, 33], [83.5, 34]]
    .map(([x, y]) => pencilP(x, y, 5))) }, pencil);
  mk("path", { class: "nf lo", d: open([[77.7, -31], [81, -29.5], [84.3, -31]]
    .map(([x, y]) => pencilP(x, y, 5))) }, pencil);
  mk("path", { class: "nf", d: open([[79.8, -42], [81, -46], [82.2, -42]]
    .map(([x, y]) => pencilP(x, y, 4))) }, pencil);

  function targets() {
    const reach = hand ? clamp((hand[0] + 68) / 125, 0, 1) : 0;
    const near = hand ? clamp((hand[1] + 43) / 86 * 3, 0, 3) : 1.5;
    let spread = 0;
    pages.forEach((page, i) => {
      const distance = (i - near) / 1.35;
      spread += lift * reach * Math.exp(-distance * distance / 2) / 4;
      page.angle.t = clamp(2 + i * 3 + spread, 2, 31);
    });
  }

  const loop = register(stage, (dt) => {
    let moving = false;
    pages.forEach((page, i) => {
      if (stepS(page.angle, dt)) moving = true;
      const angle = clamp(page.angle.x, 2, 31);
      if (angle === page.last) return;
      page.last = angle;
      const a = rad(angle), c = Math.cos(a), s = Math.sin(a);
      const sheetP = (x, y, z) => P(x * c, y, 6 + i * 0.7 + x * s + z + (y > 28 ? Math.pow((y - 28) / 15, 2) * x / 64 * 2.4 : 0));
      put(page.part, prism(sheetP, front, leaf, leafIn, 0, 0.65));
    });
    return moving;
  });
  bag.add(loop.unregister);

  function highlight(next) {
    side = next;
    leftPage.sil.classList.toggle("hi", side === 0);
    pages[3].part.sil.classList.toggle("hi", side !== 0);
    read.textContent = side < 0 ? "rest" : side === 0 ? "left page" : "turning pages";
  }
  function move(point) {
    // The fixed plane never follows the lifted pages, so hover cannot flicker.
    const q = unproj(C, point[0], point[1], 8);
    const inside = q[0] >= -70 && q[0] <= 72 && q[1] >= -50 && q[1] <= 50;
    hand = inside ? q : null;
    highlight(inside ? (q[0] < -2 ? 0 : 1) : -1);
    targets();
    loop.wake();
  }
  bag.add(pointer(stage, { move, leave: () => {
    hand = null;
    highlight(-1);
    targets();
    loop.wake();
  } }));
  bag.add(() => svg.replaceChildren());
  highlight(-1);
  return {
    set(v) { lift = v; targets(); loop.wake(); },
    destroy: bag.dispose,
  };
}


/** Workbench: a maker's desk, ready for the next idea. */
function mountWorkbenchFigure({ stage, svg, read }, value) {
  const {
    Cam, clamp, facing, fit, mk, pointer, prism, proj, put, register,
    rings, solid, spring, stepS, unproj, disposer,
  } = HL;
  const bag = disposer(), C = Cam(45, 0.5, 1.9);
  fit(C, [[-68, -48, -20], [68, 48, -20], [-68, 48, 52], [68, -48, 52]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  let lift = value, point = null;
  function block(parent, x0, y0, x1, y1, z0, z1, r = 2) {
    const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(0.8, r / 2));
    const part = solid(parent);
    put(part, prism(P, front, ring, inner, z0, z1));
    return part;
  }
  // Four round-ended legs, with their upper edges hidden by the desk.
  for (const [x, y] of [[-56, -35], [54, -35], [-56, 33], [54, 33]]) {
    block(g, x - 3, y - 3, x + 3, y + 3, -19, 20, 2.5);
  }
  block(g, -68, -47, 68, 47, 18, 23, 5);
  const tools = [
    { x: -33, y: -13, z: 28, name: "notebook" },
    { x: 30, y: -19, z: 29, name: "music pad" },
    { x: 21, y: 28, z: 43, name: "in progress" },
  ].map((tool) => ({ ...tool, group: mk("g", {}, g), motion: spring(0), last: NaN, parts: [] }));

  function draw(tool, dz) {
    // Reuse the same solids; only rewrite geometry when the spring changes.
    let index = 0;
    function part(x0, y0, x1, y1, z0, z1, r = 2) {
      const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(0.8, r / 2));
      const shape = tool.parts[index] ?? (tool.parts[index] = solid(tool.group));
      const Q = (x, y, z) => {
        if (tool.name === "notebook" && z0 >= 26) {
          const a = dz * 0.045, reach = x + 53;
          return P(-53 + reach * Math.cos(a), y, z + reach * Math.sin(a));
        }
        if (tool.name === "music pad") return P(x, y, z - (z0 === 28 && y0 > -29 ? dz * 0.16 : 0));
        return P(x, y, z + (tool.name === "in progress" && z0 === 40 ? Math.max(0, 4 - dz * 0.6) : 0));
      };
      put(shape, prism(Q, front, ring, inner, z0, z1));
      index++;
    }
    if (tool.name === "notebook") {
      part(-55, -36, -10, 12, 24, 26, 3);
      part(-53, -34, -12, 10, 26, 28, 2.5);
      // The binding and elastic strap are physical features, not labels.
      part(-52, -33, -50, 9, 28, 28.6, 0.8);
      part(-20, -33, -17, 9, 28, 28.8, 0.8);
      part(-32, 8, -27, 19, 26, 26.7, 1.2);
    } else if (tool.name === "music pad") {
      part(8, -38, 53, 1, 24, 28, 3);
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          const x = 12 + col * 13, y = -26 + row * 12;
          part(x, y, x + 10, y + 9, 28, 29.5, 1.6);
        }
      }
      part(13, -34, 19, -29, 28, 31, 2);
      part(43, -34, 49, -29, 28, 31, 2);
    } else {
      // An unfinished little arch: two feet and a broad rounded bridge.
      part(1, 17, 41, 39, 24, 26, 3);
      part(6, 21, 14, 35, 26, 40, 2);
      part(28, 21, 36, 35, 26, 40, 2);
      part(6, 21, 36, 35, 40, 45, 2.4);
    }
  }
  const loop = register(stage, (dt) => {
    let moving = false;
    tools.forEach((tool) => {
      if (stepS(tool.motion, dt)) moving = true;
      const height = clamp(tool.motion.x, 0, 12);
      if (height === tool.last) return;
      tool.last = height;
      draw(tool, height);
    });
    return moving;
  });
  bag.add(loop.unregister);
  function update() {
    let nearest = -1, distance = Infinity;
    tools.forEach((tool, i) => {
      // Each tool is tested at its own fixed resting top, never its lifted pose.
      const q = point ? unproj(C, point[0], point[1], tool.z) : null;
      const d = q ? Math.hypot(q[0] - tool.x, q[1] - tool.y) : Infinity;
      tool.motion.t = d < 60 ? lift * Math.exp(-d * d / 850) : 0;
      if (d < distance && d < 45) { nearest = i; distance = d; }
    });
    tools.forEach((tool, i) => {
      tool.parts[tool.name === "notebook" ? 1 : tool.name === "in progress" ? 3 : 0]?.sil.classList.toggle("hi", i === (nearest < 0 ? 0 : nearest));
    });
    read.textContent = nearest < 0 ? "rest" : tools[nearest].name;
    loop.wake();
  }
  tools.forEach((tool) => { draw(tool, 0); tool.last = 0; });
  update();
  bag.add(pointer(stage, { move(p) { point = p; update(); }, leave() { point = null; update(); } }));
  bag.add(() => svg.replaceChildren());
  return { set(v) { lift = v; update(); }, destroy: bag.dispose };
}


/** Ideas: an architectural model, the pieces finding their place. */
function mountIdeasFigure({ stage, svg, read }, value) {
  const { Cam, clamp, facing, fit, mk, pointer, prism, proj, put, register,
    rings, rrect, circ, solid, spring, stepS, unproj, disposer, poly, open, ringAt } = HL;
  const bag = disposer(), C = Cam(45, 0.5, 1.9);
  fit(C, [[-68,-45,0],[68,45,0],[-68,45,74],[68,-45,74]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  let strength = value, point = null;
  function plate(parent, ring, inner, z0, z1, project = P) {
    const part = solid(parent);
    put(part, prism(project, front, ring, inner, z0, z1));
    return part;
  }
  function box(parent, x0, y0, x1, y1, z0, z1, r = 3) {
    const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(1, r / 2));
    return plate(parent, ring, inner, z0, z1);
  }
  box(g, -65, -43, 65, 43, 0, 4, 5);
  const items = [{x:0,y:-24,z:35,name:"back wall",i:0},{x:0,y:24,z:39,name:"doorway",i:1},{x:0,y:0,z:58,name:"roof",i:2}].map(item => ({ ...item, group: mk("g", {}, g),
    motion: spring(0), last: NaN, parts: [] }));
  function draw(item, h) {
    let index = 0;
    const Q = (x,y,z) => P(x,y + (item.i === 0 ? h * 0.12 : item.i === 1 ? -h * 0.12 : 0),z - (item.i === 2 ? h * 0.65 : 0));
    function shape(ring, inner, z0, z1) {
      const part = item.parts[index] ?? (item.parts[index] = solid(item.group));
      put(part, prism(Q, front, ring, inner, z0, z1));
      index++;
      return part;
    }
    function block(x0, y0, x1, y1, z0, z1, r = 3) {
      const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(1, r / 2));
      return shape(ring, inner, z0, z1);
    }
    function disk(x, y, radius, z0, z1) {
      const ring = circ(radius, 64).map(q => ({ ...q, u: q.u + x, v: q.v + y }));
      const inner = circ(radius - 1, 64).map(q => ({ ...q, u: q.u + x, v: q.v + y }));
      return shape(ring, inner, z0, z1);
    }
    if (item.i === 0) {
      block(-33, -29, 33, -21, 8, 35, 2.5);
      block(-33, -21, -26, 21, 8, 35, 2.5);
    } else if (item.i === 1) {
      block(-33, 21, -12, 29, 8, 39, 2.5);
      block(12, 21, 33, 29, 8, 39, 2.5);
      block(-12, 21, 12, 29, 30, 39, 2.5);
    } else {
      // A broad eave and a narrow ridge give the model a real pitched roof.
      const foot = rrect(-43, -36, 43, 36, 3, 12);
      const top = rrect(-3, -34, 3, 34, 2, 12);
      const inner = rrect(-2, -33, 2, 33, 1, 12);
      const part = item.parts[0] ?? (item.parts[0] = solid(item.group));
      put(part, { sil: poly(HL.hull(ringAt(Q, foot, 48).concat(ringAt(Q, top, 66)))),
        crease: open(ringAt(Q, HL.run(inner, front), 66)) });
    }
  }
  const loop = register(stage, dt => {
    let moving = false;
    items.forEach(item => {
      if (stepS(item.motion, dt)) moving = true;
      const h = clamp(item.motion.x, 0, 16);
      if (h === item.last) return;
      item.last = h;
      draw(item, h);
    });
    return moving;
  });
  bag.add(loop.unregister);
  function update() {
    let nearest = -1, distance = Infinity;
    items.forEach((item, i) => {
      const q = point ? unproj(C, point[0], point[1], item.z) : null;
      const d = q ? Math.hypot(q[0] - item.x, q[1] - item.y) : Infinity;
      item.motion.t = d < 75 ? strength * Math.exp(-d * d / 1100) : 0;
      if (d < distance && d < 55) { nearest = i; distance = d; }
    });
    items.forEach((item, i) => item.parts[0]?.sil.classList.toggle("hi", i === (nearest < 0 ? 2 : nearest)));
    read.textContent = nearest < 0 ? "rest" : items[nearest].name;
    loop.wake();
  }
  items.forEach(item => { draw(item, 0); item.last = 0; });
  update();
  bag.add(pointer(stage, { move(p) { point = p; update(); }, leave() { point = null; update(); } }));
  bag.add(() => svg.replaceChildren());
  return { set(v) { strength = v; update(); }, destroy: bag.dispose };
}

/** Learn: a reference book opened above two well-used volumes. */
function mountLearnFigure({ stage, svg, read }, value) {
  const { Cam, clamp, facing, fit, mk, pointer, prism, proj, put, register,
    rings, rrect, circ, solid, spring, stepS, unproj, disposer, poly, open, ringAt } = HL;
  const bag = disposer(), C = Cam(45, 0.5, 1.85);
  fit(C, [[-68,-48,0],[68,48,0],[-68,48,48],[68,-48,48]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  let strength = value, point = null;
  function plate(parent, ring, inner, z0, z1, project = P) {
    const part = solid(parent);
    put(part, prism(project, front, ring, inner, z0, z1));
    return part;
  }
  function box(parent, x0, y0, x1, y1, z0, z1, r = 3) {
    const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(1, r / 2));
    return plate(parent, ring, inner, z0, z1);
  }
  box(g, -53, -38, 57, 42, 0, 4, 4);
  box(g, -51, -36, 55, 40, 4, 12, 3);
  box(g, -53, -38, 57, 42, 12, 14, 4);
  box(g, -59, -43, 51, 37, 15, 18, 4);
  box(g, -57, -41, 49, 35, 18, 24, 3);
  box(g, -59, -43, 51, 37, 24, 26, 4);
  box(g, -65, -45, 65, 45, 27, 30, 4);
  box(g, -2, -43, 2, 43, 30, 33, 1.8);
  const items = [{x:-32,y:0,z:35,name:"left page",i:0},{x:32,y:0,z:35,name:"right page",i:1}].map(item => ({ ...item, group: mk("g", {}, g),
    motion: spring(0), last: NaN, parts: [] }));
  function draw(item, h) {
    let index = 0;
    const Q = (x,y,z) => {
      const a = 0.055 + h * 0.009;
      return P(x * Math.cos(a), y, z + Math.abs(x) * Math.sin(a)
        + 2 * Math.exp(-Math.abs(x) / 9) - Math.max(0, y - 41) * 0.7);
    };
    function shape(ring, inner, z0, z1) {
      const part = item.parts[index] ?? (item.parts[index] = solid(item.group));
      put(part, prism(Q, front, ring, inner, z0, z1));
      index++;
      return part;
    }
    function block(x0, y0, x1, y1, z0, z1, r = 3) {
      const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(1, r / 2));
      return shape(ring, inner, z0, z1);
    }
    function disk(x, y, radius, z0, z1) {
      const ring = circ(radius, 64).map(q => ({ ...q, u: q.u + x, v: q.v + y }));
      const inner = circ(radius - 1, 64).map(q => ({ ...q, u: q.u + x, v: q.v + y }));
      return shape(ring, inner, z0, z1);
    }
    const x0 = item.i === 0 ? -62 : 2, x1 = item.i === 0 ? -2 : 62;
    block(x0, -42, x1, 42, 31, 32, 3);
    block(x0, -42, x1, 42, 33, 34, 3);
    // A ribbon bookmark hangs from the near edge of the reference book.
    if (item.i === 1) block(38, 12, 44, 54, 34, 34.6, 1.2);
  }
  const loop = register(stage, dt => {
    let moving = false;
    items.forEach(item => {
      if (stepS(item.motion, dt)) moving = true;
      const h = clamp(item.motion.x, 0, 18);
      if (h === item.last) return;
      item.last = h;
      draw(item, h);
    });
    return moving;
  });
  bag.add(loop.unregister);
  function update() {
    let nearest = -1, distance = Infinity;
    items.forEach((item, i) => {
      const q = point ? unproj(C, point[0], point[1], item.z) : null;
      const d = q ? Math.hypot(q[0] - item.x, q[1] - item.y) : Infinity;
      item.motion.t = d < 75 ? strength * Math.exp(-d * d / 1100) : 0;
      if (d < distance && d < 55) { nearest = i; distance = d; }
    });
    items.forEach((item, i) => item.parts[1]?.sil.classList.toggle("hi", i === (nearest < 0 ? 1 : nearest)));
    read.textContent = nearest < 0 ? "rest" : items[nearest].name;
    loop.wake();
  }
  items.forEach(item => { draw(item, 0); item.last = 0; });
  update();
  bag.add(pointer(stage, { move(p) { point = p; update(); }, leave() { point = null; update(); } }));
  bag.add(() => svg.replaceChildren());
  return { set(v) { strength = v; update(); }, destroy: bag.dispose };
}

/** Curated: three carefully chosen objects on unequal display plinths. */
function mountCuratedFigure({ stage, svg, read }, value) {
  const { Cam, clamp, facing, fit, mk, pointer, prism, proj, put, register,
    rings, rrect, circ, solid, spring, stepS, unproj, disposer, poly, open, ringAt, hull, run } = HL;
  const bag = disposer(), C = Cam(45, 0.5, 1.9);
  fit(C, [[-68,-45,0],[68,45,0],[-68,45,72],[68,-45,72]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  let strength = value, point = null;
  function plate(parent, ring, inner, z0, z1, project = P) {
    const part = solid(parent);
    put(part, prism(project, front, ring, inner, z0, z1));
    return part;
  }
  function box(parent, x0, y0, x1, y1, z0, z1, r = 3) {
    const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(1, r / 2));
    return plate(parent, ring, inner, z0, z1);
  }
  box(g, -65, -42, 65, 45, 0, 4, 5);
  for (const [x,y,z] of [[-38,-13,9],[27,-17,11],[13,29,13]]) {
    box(g, x - 19, y - 16, x + 19, y + 16, 5, z, 3);
  }
  const items = [{x:-38,y:-13,z:38,name:"console",i:0},{x:27,y:-17,z:54,name:"lamp",i:1},{x:13,y:29,z:25,name:"sneaker",i:2}].map(item => ({ ...item, group: mk("g", {}, g),
    motion: spring(0), last: NaN, parts: [] }));
  function draw(item, h) {
    let index = 0;
    const Q = (x,y,z) => {
      const a = h * 0.018, dx = x - item.x, dy = y - item.y;
      return P(item.x + dx * Math.cos(a) - dy * Math.sin(a),
        item.y + dx * Math.sin(a) + dy * Math.cos(a), z + h * 0.7);
    };
    function shape(ring, inner, z0, z1) {
      const part = item.parts[index] ?? (item.parts[index] = solid(item.group));
      put(part, prism(Q, front, ring, inner, z0, z1));
      index++;
      return part;
    }
    function block(x0, y0, x1, y1, z0, z1, r = 3) {
      const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(1, r / 2));
      return shape(ring, inner, z0, z1);
    }
    function disk(x, y, radius, z0, z1) {
      const ring = circ(radius, 64).map(q => ({ ...q, u: q.u + x, v: q.v + y }));
      const inner = circ(radius - 1, 64).map(q => ({ ...q, u: q.u + x, v: q.v + y }));
      return shape(ring, inner, z0, z1);
    }
    const x = item.x, y = item.y;
    function taper(r0, r1, z0, z1) {
      const ring = r => circ(r, 64).map(q => ({ ...q, u: q.u + x, v: q.v + y }));
      const part = item.parts[index] ?? (item.parts[index] = solid(item.group));
      put(part, { sil: poly(hull(ringAt(Q, ring(r0), z0).concat(ringAt(Q, ring(r1), z1)))),
        crease: open(ringAt(Q, run(ring(r1 - 0.8), front), z1)) });
      index++;
    }
    if (item.i === 0) {
      // A tilted handheld: inset screen, a cross-shaped control and two buttons.
      const consoleP = (u,v,d) => Q(x + u, y - (v + 24) * 0.22 + d, 10 + (v + 24) * 0.92);
      function control(ring, inner, d0, d1) {
        const part = item.parts[index] ?? (item.parts[index] = solid(item.group));
        put(part, prism(consoleP, q => q.nu - q.nv > 0, ring, inner, d0, d1));
        index++;
      }
      function panel(u0,v0,u1,v1,r,d0,d1) {
        const [ring, inner] = rings(u0,v0,u1,v1,r,Math.min(0.6,r / 2));
        control(ring,inner,d0,d1);
      }
      panel(-14,-24,14,24,3.5,0,3);
      panel(-11,0,11,20,2,3,3.25);
      panel(-9,2,9,18,1.2,3.25,3.4);
      panel(-10,-13,-2,-10,0.7,3,4);
      panel(-7.5,-15.5,-4.5,-7.5,0.7,3,4);
      for (const [u,v] of [[5,-12],[10,-8]]) {
        const ring = r => circ(r,32).map(q => ({ ...q, u:q.u + u, v:q.v + v }));
        control(ring(2),ring(1.4),3,4);
      }
      for (let i = 0; i < 3; i++) panel(2 + i * 3,-20,3 + i * 3,-17,0.4,3,3.2);
    } else if (item.i === 1) {
      disk(x, y, 12, 11, 14);
      disk(x, y, 2.8, 14, 41);
      taper(18, 9, 36, 51);
      disk(x, y, 3.2, 51, 53);
    } else {
      // A broad sole, low toe, raised heel and open collar make a sneaker.
      block(x - 25,y - 10,x + 24,y + 10,13,17,7);
      const foot = rrect(x - 23,y - 8,x + 22,y + 8,6,12);
      const collar = rrect(x + 5,y - 7,x + 21,y + 7,3,12);
      const inset = rrect(x + 6,y - 6,x + 20,y + 6,2,12);
      const upper = item.parts[index] ?? (item.parts[index] = solid(item.group));
      put(upper, { sil: poly(hull(ringAt(Q,foot,17).concat(ringAt(Q,foot,21),ringAt(Q,collar,27)))),
        crease: open(ringAt(Q,run(inset,front),27)) });
      index++;
      block(x + 9,y - 4,x + 19,y + 4,27,27.4,2.5);
      block(x + 1,y - 5,x + 8,y + 5,25,28.5,1.5);
      block(x + 19,y - 4,x + 22,y + 4,26,29,1.3);
      item.stitch ??= mk("path", { class:"nf lo" },item.group);
      item.stitch.setAttribute("d",open([Q(x + 16,y + 8,18.5),Q(x + 15,y + 8,23),Q(x + 6,y + 7,26.8)]));
      item.toe ??= mk("path", { class:"nf lo" },item.group);
      item.toe.setAttribute("d",open([Q(x - 10,y - 6,21.5),Q(x - 10,y + 6,21.5)]));
      // Lace bridges follow the sloping vamp; every mark belongs to the shoe.
      item.laces ??= [0,1,2].map(() => mk("path", { class:"nf lo" },item.group));
      [0,1,2].forEach(i => {
        const u = x - 5 + i * 4, z = 25.3 + i * 0.85;
        item.laces[i].setAttribute("d",open([Q(u,y - 5,z),Q(u + 1,y + 5,z)]));
      });
    }
  }
  const loop = register(stage, dt => {
    let moving = false;
    items.forEach(item => {
      if (stepS(item.motion, dt)) moving = true;
      const h = clamp(item.motion.x, 0, 11);
      if (h === item.last) return;
      item.last = h;
      draw(item, h);
    });
    return moving;
  });
  bag.add(loop.unregister);
  function update() {
    let nearest = -1, distance = Infinity;
    items.forEach((item, i) => {
      const q = point ? unproj(C, point[0], point[1], item.z) : null;
      const d = q ? Math.hypot(q[0] - item.x, q[1] - item.y) : Infinity;
      item.motion.t = d < 75 ? strength * Math.exp(-d * d / 1100) : 0;
      if (d < distance && d < 55) { nearest = i; distance = d; }
    });
    items.forEach((item, i) => item.parts[item.i === 1 ? 2 : item.i === 2 ? 1 : 0]?.sil.classList.toggle("hi", i === (nearest < 0 ? 0 : nearest)));
    read.textContent = nearest < 0 ? "rest" : items[nearest].name;
    loop.wake();
  }
  items.forEach(item => { draw(item, 0); item.last = 0; });
  update();
  bag.add(pointer(stage, { move(p) { point = p; update(); }, leave() { point = null; update(); } }));
  bag.add(() => svg.replaceChildren());
  return { set(v) { strength = v; update(); }, destroy: bag.dispose };
}

/** Content: a record slips from its sleeve, ready to be played. */
function mountContentFigure({ stage, svg, read }, value) {
  const { Cam, clamp, facing, fit, mk, pointer, prism, proj, put, register,
    rings, rrect, circ, solid, spring, stepS, unproj, disposer, poly, open, ringAt } = HL;
  const bag = disposer(), C = Cam(45, 0.5, 2.12);
  fit(C, [[-68,-48,0],[78,48,0],[-68,48,32],[78,-48,32]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  let strength = value, point = null;
  function plate(parent, ring, inner, z0, z1, project = P) {
    const part = solid(parent);
    put(part, prism(project, front, ring, inner, z0, z1));
    return part;
  }
  function box(parent, x0, y0, x1, y1, z0, z1, r = 3) {
    const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(1, r / 2));
    return plate(parent, ring, inner, z0, z1);
  }
  
  const items = [{x:17,y:0,z:6,name:"record",i:0},{x:-25,y:0,z:9,name:"sleeve",i:1}].map(item => ({ ...item, group: mk("g", {}, g),
    motion: spring(0), last: NaN, parts: [] }));
  function draw(item, h) {
    let index = 0;
    const Q = (x,y,z) => P(x + (item.i === 0 ? h : 0),y,z);
    function shape(ring, inner, z0, z1) {
      const part = item.parts[index] ?? (item.parts[index] = solid(item.group));
      put(part, prism(Q, front, ring, inner, z0, z1));
      index++;
      return part;
    }
    function block(x0, y0, x1, y1, z0, z1, r = 3) {
      const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(1, r / 2));
      return shape(ring, inner, z0, z1);
    }
    function disk(x, y, radius, z0, z1) {
      const ring = circ(radius, 64).map(q => ({ ...q, u: q.u + x, v: q.v + y }));
      const inner = circ(radius - 1, 64).map(q => ({ ...q, u: q.u + x, v: q.v + y }));
      return shape(ring, inner, z0, z1);
    }
    if (item.i === 0) {
      disk(17, 0, 43, 3, 5);
      // Concentric pressing grooves and the centre label are physical details.
      item.grooves ??= [35, 30, 25].map(() => mk("path", { class: "nf lo" }, item.group));
      [35, 30, 25].forEach((r,i) => {
        const ring = circ(r, 96).map(q => ({ ...q, u: q.u + 17 }));
        item.grooves[i].setAttribute("d", poly(ringAt(Q, ring, 5.1)));
      });
      disk(17, 0, 12, 5.1, 5.3);
      disk(17, 0, 1.7, 5.3, 5.5);
    } else {
      block(-64, -47, 9, 47, 6, 9, 4);
      // The open mouth of the sleeve, with a second line for its thickness.
      item.seam ??= mk("path", { class: "nf lo" }, item.group);
      item.seam.setAttribute("d", open([Q(6, -40, 9.1), Q(6, 40, 9.1)]));
    }
  }
  const loop = register(stage, dt => {
    let moving = false;
    items.forEach(item => {
      if (stepS(item.motion, dt)) moving = true;
      const h = clamp(item.motion.x, 0, 20);
      if (h === item.last) return;
      item.last = h;
      draw(item, h);
    });
    return moving;
  });
  bag.add(loop.unregister);
  function update() {
    let nearest = -1, distance = Infinity;
    items.forEach((item, i) => {
      const q = point ? unproj(C, point[0], point[1], item.z) : null;
      const d = q ? Math.hypot(q[0] - item.x, q[1] - item.y) : Infinity;
      item.motion.t = d < 75 ? strength * Math.exp(-d * d / 1100) : 0;
      if (d < distance && d < 55) { nearest = i; distance = d; }
    });
    items.forEach((item, i) => item.parts[0]?.sil.classList.toggle("hi", i === (nearest < 0 ? 0 : nearest)));
    read.textContent = nearest < 0 ? "rest" : items[nearest].name;
    loop.wake();
  }
  items.forEach(item => { draw(item, 0); item.last = 0; });
  update();
  bag.add(pointer(stage, { move(p) { point = p; update(); }, leave() { point = null; update(); } }));
  bag.add(() => svg.replaceChildren());
  return { set(v) { strength = v; update(); }, destroy: bag.dispose };
}
/** Mount a custom figure using the unchanged Hairline engine above. */
export function mountDrawing(stage, scene) {
  HL.inject(document);
  const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
  const context = { stage, svg, read: { textContent: "rest" } };
  const figures = {
    workbench: [mountWorkbenchFigure, 7],
    sketchbook: [mountSketchbookFigure, 12],
    ideas: [mountIdeasFigure, 10],
    learn: [mountLearnFigure, 11],
    curated: [mountCuratedFigure, 7],
    content: [mountContentFigure, 13],
  };
  const [mountFigure, value] = figures[scene];
  const figure = mountFigure(context, value);
  return { destroy() { figure.destroy(); svg.remove(); } };
}

// The portrait composition shares this engine and its visibility-aware clock.
export { HL as hairlineCore };
