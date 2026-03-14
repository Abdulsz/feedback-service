import { jsxs as o, jsx as e, Fragment as re } from "react/jsx-runtime";
import { forwardRef as se, useState as c, useRef as ae, useEffect as le, useCallback as S, useImperativeHandle as de } from "react";
const ce = "https://github-pr-agent.zakariatimalma.workers.dev";
function fe(a) {
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
function ue(a) {
  const s = { position: "fixed", zIndex: 9999 }, i = 20;
  switch (a) {
    case "bottom-left":
      return { ...s, bottom: i, left: i };
    case "top-right":
      return { ...s, top: i, right: i };
    case "top-left":
      return { ...s, top: i, left: i };
    default:
      return { ...s, bottom: i, right: i };
  }
}
function pe(a) {
  const s = a.startsWith("top");
  return {
    position: "absolute",
    ...a.endsWith("left") ? { left: 0 } : { right: 0 },
    ...s ? { top: 64 } : { bottom: 64 }
  };
}
function be() {
  return /* @__PURE__ */ e("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ e("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) });
}
function _() {
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
const ke = se(
  function(s, i) {
    const {
      projectId: C,
      apiKey: F,
      apiBaseUrl: p = ce,
      config: H = {},
      onOpen: b,
      onClose: h,
      onSubmit: g,
      onError: l,
      userId: I,
      userEmail: W,
      customMetadata: E
    } = s, {
      theme: T = "light",
      position: B = "bottom-right",
      primaryColor: z = "#007bff",
      title: K = "Send us your feedback",
      showEmail: N = !0
    } = H, [n, f] = c("idle"), [m, M] = c(""), [y, R] = c(""), [x, D] = c(W ?? ""), [$, u] = c(""), [L, q] = c(!1), [U, Y] = c(!1), J = ae(null);
    le(() => {
      const t = () => Y(window.innerWidth < 400);
      return t(), window.addEventListener("resize", t), () => window.removeEventListener("resize", t);
    }, []);
    const k = S(() => {
      f("open"), requestAnimationFrame(() => q(!0)), b == null || b();
    }, [b]), d = S(() => {
      q(!1), setTimeout(() => {
        f("idle"), M(""), R(""), D(W ?? ""), u("");
      }, 200), h == null || h();
    }, [h, W]);
    de(i, () => ({ open: k, close: d }), [
      k,
      d
    ]);
    const X = S(() => {
      n === "idle" ? k() : d();
    }, [n, k, d]), G = S(
      async (t) => {
        if (t.preventDefault(), u(""), !m.trim() || !y.trim()) {
          u("Title and description are required.");
          return;
        }
        f("submitting");
        const ne = {
          projectId: C,
          title: m.trim(),
          description: y.trim(),
          ...x.trim() && { email: x.trim() },
          metadata: {
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer,
            ...I && { userId: I },
            customFields: E
          }
        };
        try {
          const w = p.endsWith("/api/feedback/submit") ? p : `${p.replace(/\/$/, "")}/api/feedback/submit`, v = await fetch(w, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": F
            },
            body: JSON.stringify(ne)
          });
          if (!v.ok) {
            const O = {
              400: "Missing required fields. Please fill in all required fields.",
              401: "Authentication failed. Invalid API key.",
              403: "Access denied. Invalid API key or project mismatch."
            }[v.status] ?? `Something went wrong (${v.status}). Please try again.`;
            u(O), f("open"), l == null || l(O);
            return;
          }
          const V = await v.json();
          g == null || g({ feedbackId: V.data.feedbackId, type: V.data.type }), f("success"), setTimeout(() => d(), 2e3);
        } catch {
          const w = "Network error. Please check your connection and try again.";
          u(w), f("open"), l == null || l(w);
        }
      },
      [
        m,
        y,
        x,
        C,
        F,
        p,
        I,
        E,
        g,
        l,
        d
      ]
    ), r = fe(T), Q = ue(B), Z = pe(B), ee = {
      width: 52,
      height: 52,
      borderRadius: "50%",
      border: "none",
      backgroundColor: z,
      color: "#ffffff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 4px 12px ${r.shadow}`,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      outline: "none"
    }, te = {
      ...Z,
      width: U ? "calc(100vw - 32px)" : 360,
      backgroundColor: r.bg,
      borderRadius: 12,
      boxShadow: `0 8px 30px ${r.shadow}`,
      border: `1px solid ${r.border}`,
      overflow: "hidden",
      opacity: L ? 1 : 0,
      transform: L ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.2s ease, transform 0.2s ease",
      pointerEvents: L ? "auto" : "none",
      ...U && {
        position: "fixed",
        left: 16,
        right: 16,
        width: "auto",
        ...B.startsWith("top") ? { top: 80 } : { bottom: 80 }
      }
    }, oe = {
      padding: "16px 20px",
      backgroundColor: z,
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }, A = {
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
    }, P = {
      display: "block",
      fontSize: 13,
      fontWeight: 500,
      color: r.textSecondary,
      marginBottom: 6
    }, ie = {
      width: "100%",
      padding: "11px 16px",
      borderRadius: 8,
      border: "none",
      backgroundColor: z,
      color: "#ffffff",
      fontSize: 14,
      fontWeight: 600,
      cursor: n === "submitting" ? "not-allowed" : "pointer",
      opacity: n === "submitting" ? 0.7 : 1,
      transition: "opacity 0.15s ease",
      outline: "none"
    }, j = n !== "idle";
    return /* @__PURE__ */ o("div", { style: Q, "data-feedback-widget": !0, children: [
      /* @__PURE__ */ e(
        "button",
        {
          onClick: X,
          style: ee,
          "aria-label": j ? "Close feedback" : "Open feedback",
          onMouseEnter: (t) => {
            t.currentTarget.style.transform = "scale(1.08)";
          },
          onMouseLeave: (t) => {
            t.currentTarget.style.transform = "scale(1)";
          },
          children: j ? /* @__PURE__ */ e(_, {}) : /* @__PURE__ */ e(be, {})
        }
      ),
      j && /* @__PURE__ */ e("div", { ref: J, style: te, children: n === "success" ? /* @__PURE__ */ o(
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
      ) : /* @__PURE__ */ o(re, { children: [
        /* @__PURE__ */ o("div", { style: oe, children: [
          /* @__PURE__ */ e("span", { style: { fontSize: 15, fontWeight: 600 }, children: K }),
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
              children: /* @__PURE__ */ e(_, {})
            }
          )
        ] }),
        /* @__PURE__ */ o(
          "form",
          {
            onSubmit: G,
            style: { padding: 20, display: "flex", flexDirection: "column", gap: 16 },
            children: [
              /* @__PURE__ */ o("div", { children: [
                /* @__PURE__ */ o("label", { style: P, children: [
                  "Title ",
                  /* @__PURE__ */ e("span", { style: { color: "#ef4444" }, children: "*" })
                ] }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    type: "text",
                    value: m,
                    onChange: (t) => M(t.target.value),
                    placeholder: "Brief summary of your feedback",
                    style: A,
                    disabled: n === "submitting"
                  }
                )
              ] }),
              /* @__PURE__ */ o("div", { children: [
                /* @__PURE__ */ o("label", { style: P, children: [
                  "Description ",
                  /* @__PURE__ */ e("span", { style: { color: "#ef4444" }, children: "*" })
                ] }),
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: y,
                    onChange: (t) => R(t.target.value),
                    placeholder: "Describe your feedback in detail...",
                    rows: 4,
                    style: { ...A, resize: "vertical" },
                    disabled: n === "submitting"
                  }
                )
              ] }),
              N && /* @__PURE__ */ o("div", { children: [
                /* @__PURE__ */ e("label", { style: P, children: "Email (optional)" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    type: "email",
                    value: x,
                    onChange: (t) => D(t.target.value),
                    placeholder: "your@email.com",
                    style: A,
                    disabled: n === "submitting"
                  }
                )
              ] }),
              $ && /* @__PURE__ */ e(
                "div",
                {
                  style: {
                    padding: "10px 12px",
                    borderRadius: 8,
                    backgroundColor: T === "dark" ? "#3b1111" : "#fef2f2",
                    border: `1px solid ${T === "dark" ? "#5c1e1e" : "#fecaca"}`,
                    color: "#ef4444",
                    fontSize: 13
                  },
                  children: $
                }
              ),
              /* @__PURE__ */ e("button", { type: "submit", style: ie, disabled: n === "submitting", children: n === "submitting" ? "Submitting..." : "Submit Feedback" })
            ]
          }
        )
      ] }) })
    ] });
  }
);
export {
  ke as FeedbackWidget
};
