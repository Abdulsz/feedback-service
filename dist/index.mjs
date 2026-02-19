import { jsxs as o, jsx as e, Fragment as ie } from "react/jsx-runtime";
import { forwardRef as re, useState as f, useRef as se, useEffect as ae, useCallback as w, useImperativeHandle as le } from "react";
const de = "http://localhost:8787";
function ce(a) {
  return a === "dark" ? {
    bg: "#1a1a2e",
    surface: "#16213e",
    text: "#e0e0e0",
    textSecondary: "#a0a0b0",
    border: "#2a2a4a",
    inputBg: "#0f3460",
    inputBorder: "#2a2a4a",
    inputText: "#e0e0e0",
    shadow: "rgba(0, 0, 0, 0.4)"
  } : {
    bg: "#ffffff",
    surface: "#f8f9fa",
    text: "#1a1a1a",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    inputBg: "#ffffff",
    inputBorder: "#d1d5db",
    inputText: "#1a1a1a",
    shadow: "rgba(0, 0, 0, 0.15)"
  };
}
function fe(a) {
  const s = { position: "fixed", zIndex: 9999 }, n = 20;
  switch (a) {
    case "bottom-left":
      return { ...s, bottom: n, left: n };
    case "top-right":
      return { ...s, top: n, right: n };
    case "top-left":
      return { ...s, top: n, left: n };
    default:
      return { ...s, bottom: n, right: n };
  }
}
function ue(a) {
  const s = a.startsWith("top");
  return {
    position: "absolute",
    ...a.endsWith("left") ? { left: 0 } : { right: 0 },
    ...s ? { top: 64 } : { bottom: 64 }
  };
}
function pe() {
  return /* @__PURE__ */ e("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ e("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) });
}
function U() {
  return /* @__PURE__ */ o("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  ] });
}
function he() {
  return /* @__PURE__ */ o("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ e("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
    /* @__PURE__ */ e("polyline", { points: "22 4 12 14.01 9 11.01" })
  ] });
}
const xe = re(
  function(s, n) {
    const {
      projectId: v,
      apiKey: P,
      apiBaseUrl: j = de,
      config: _ = {},
      onOpen: h,
      onClose: b,
      onSubmit: g,
      onError: l,
      userId: S,
      userEmail: C,
      customMetadata: F
    } = s, {
      theme: I = "light",
      position: T = "bottom-right",
      primaryColor: W = "#007bff",
      title: H = "Send us your feedback",
      showEmail: K = !0
    } = _, [i, u] = f("idle"), [m, E] = f(""), [y, M] = f(""), [x, R] = f(C ?? ""), [D, p] = f(""), [B, $] = f(!1), [q, N] = f(!1), Y = se(null);
    ae(() => {
      const t = () => N(window.innerWidth < 400);
      return t(), window.addEventListener("resize", t), () => window.removeEventListener("resize", t);
    }, []);
    const k = w(() => {
      u("open"), requestAnimationFrame(() => $(!0)), h == null || h();
    }, [h]), d = w(() => {
      $(!1), setTimeout(() => {
        u("idle"), E(""), M(""), R(C ?? ""), p("");
      }, 200), b == null || b();
    }, [b, C]);
    le(n, () => ({ open: k, close: d }), [
      k,
      d
    ]);
    const J = w(() => {
      i === "idle" ? k() : d();
    }, [i, k, d]), X = w(
      async (t) => {
        if (t.preventDefault(), p(""), !m.trim() || !y.trim()) {
          p("Title and description are required.");
          return;
        }
        u("submitting");
        const ne = {
          projectId: v,
          title: m.trim(),
          description: y.trim(),
          ...x.trim() && { email: x.trim() },
          metadata: {
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer,
            ...S && { userId: S },
            customFields: F
          }
        };
        try {
          const c = await fetch(`${j}/api/feedback/submit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": P
            },
            body: JSON.stringify(ne)
          });
          if (!c.ok) {
            const O = {
              400: "Missing required fields. Please fill in all required fields.",
              401: "Authentication failed. Invalid API key.",
              403: "Access denied. Invalid API key or project mismatch."
            }[c.status] ?? `Something went wrong (${c.status}). Please try again.`;
            p(O), u("open"), l == null || l(O);
            return;
          }
          const V = await c.json();
          g == null || g({ feedbackId: V.data.feedbackId, type: V.data.type }), u("success"), setTimeout(() => d(), 2e3);
        } catch {
          const c = "Network error. Please check your connection and try again.";
          p(c), u("open"), l == null || l(c);
        }
      },
      [
        m,
        y,
        x,
        v,
        P,
        j,
        S,
        F,
        g,
        l,
        d
      ]
    ), r = ce(I), G = fe(T), Q = ue(T), Z = {
      width: 52,
      height: 52,
      borderRadius: "50%",
      border: "none",
      backgroundColor: W,
      color: "#ffffff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 4px 12px ${r.shadow}`,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      outline: "none"
    }, ee = {
      ...Q,
      width: q ? "calc(100vw - 32px)" : 360,
      backgroundColor: r.bg,
      borderRadius: 12,
      boxShadow: `0 8px 30px ${r.shadow}`,
      border: `1px solid ${r.border}`,
      overflow: "hidden",
      opacity: B ? 1 : 0,
      transform: B ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.2s ease, transform 0.2s ease",
      pointerEvents: B ? "auto" : "none",
      ...q && {
        position: "fixed",
        left: 16,
        right: 16,
        width: "auto",
        ...T.startsWith("top") ? { top: 80 } : { bottom: 80 }
      }
    }, te = {
      padding: "16px 20px",
      backgroundColor: W,
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }, L = {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 8,
      border: `1px solid ${r.inputBorder}`,
      backgroundColor: r.inputBg,
      color: r.inputText,
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s ease"
    }, z = {
      display: "block",
      fontSize: 13,
      fontWeight: 500,
      color: r.textSecondary,
      marginBottom: 6
    }, oe = {
      width: "100%",
      padding: "11px 16px",
      borderRadius: 8,
      border: "none",
      backgroundColor: W,
      color: "#ffffff",
      fontSize: 14,
      fontWeight: 600,
      cursor: i === "submitting" ? "not-allowed" : "pointer",
      opacity: i === "submitting" ? 0.7 : 1,
      transition: "opacity 0.15s ease",
      outline: "none"
    }, A = i !== "idle";
    return /* @__PURE__ */ o("div", { style: G, "data-feedback-widget": !0, children: [
      /* @__PURE__ */ e(
        "button",
        {
          onClick: J,
          style: Z,
          "aria-label": A ? "Close feedback" : "Open feedback",
          onMouseEnter: (t) => {
            t.currentTarget.style.transform = "scale(1.08)";
          },
          onMouseLeave: (t) => {
            t.currentTarget.style.transform = "scale(1)";
          },
          children: A ? /* @__PURE__ */ e(U, {}) : /* @__PURE__ */ e(pe, {})
        }
      ),
      A && /* @__PURE__ */ e("div", { ref: Y, style: ee, children: i === "success" ? /* @__PURE__ */ o(
        "div",
        {
          style: {
            padding: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12
          },
          children: [
            /* @__PURE__ */ e("div", { style: { color: "#22c55e" }, children: /* @__PURE__ */ e(he, {}) }),
            /* @__PURE__ */ e(
              "p",
              {
                style: {
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: r.text,
                  textAlign: "center"
                },
                children: "Thanks for your feedback!"
              }
            )
          ]
        }
      ) : /* @__PURE__ */ o(ie, { children: [
        /* @__PURE__ */ o("div", { style: te, children: [
          /* @__PURE__ */ e("span", { style: { fontSize: 15, fontWeight: 600 }, children: H }),
          /* @__PURE__ */ e(
            "button",
            {
              onClick: d,
              style: {
                background: "none",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
                opacity: 0.8
              },
              "aria-label": "Close",
              children: /* @__PURE__ */ e(U, {})
            }
          )
        ] }),
        /* @__PURE__ */ o(
          "form",
          {
            onSubmit: X,
            style: { padding: 20, display: "flex", flexDirection: "column", gap: 16 },
            children: [
              /* @__PURE__ */ o("div", { children: [
                /* @__PURE__ */ o("label", { style: z, children: [
                  "Title ",
                  /* @__PURE__ */ e("span", { style: { color: "#ef4444" }, children: "*" })
                ] }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    type: "text",
                    value: m,
                    onChange: (t) => E(t.target.value),
                    placeholder: "Brief summary of your feedback",
                    style: L,
                    disabled: i === "submitting"
                  }
                )
              ] }),
              /* @__PURE__ */ o("div", { children: [
                /* @__PURE__ */ o("label", { style: z, children: [
                  "Description ",
                  /* @__PURE__ */ e("span", { style: { color: "#ef4444" }, children: "*" })
                ] }),
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: y,
                    onChange: (t) => M(t.target.value),
                    placeholder: "Describe your feedback in detail...",
                    rows: 4,
                    style: { ...L, resize: "vertical" },
                    disabled: i === "submitting"
                  }
                )
              ] }),
              K && /* @__PURE__ */ o("div", { children: [
                /* @__PURE__ */ e("label", { style: z, children: "Email (optional)" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    type: "email",
                    value: x,
                    onChange: (t) => R(t.target.value),
                    placeholder: "your@email.com",
                    style: L,
                    disabled: i === "submitting"
                  }
                )
              ] }),
              D && /* @__PURE__ */ e(
                "div",
                {
                  style: {
                    padding: "10px 12px",
                    borderRadius: 8,
                    backgroundColor: I === "dark" ? "#3b1111" : "#fef2f2",
                    border: `1px solid ${I === "dark" ? "#5c1e1e" : "#fecaca"}`,
                    color: "#ef4444",
                    fontSize: 13
                  },
                  children: D
                }
              ),
              /* @__PURE__ */ e("button", { type: "submit", style: oe, disabled: i === "submitting", children: i === "submitting" ? "Submitting..." : "Submit Feedback" })
            ]
          }
        )
      ] }) })
    ] });
  }
);
export {
  xe as FeedbackWidget
};
