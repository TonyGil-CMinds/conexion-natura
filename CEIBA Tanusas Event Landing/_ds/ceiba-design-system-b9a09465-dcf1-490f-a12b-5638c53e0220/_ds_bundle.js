/* @ds-bundle: {"format":4,"namespace":"CEIBADesignSystem_b9a094","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"CeibaLogo","sourcePath":"components/core/CeibaLogo.jsx"},{"name":"CountdownRuler","sourcePath":"components/core/CountdownRuler.jsx"},{"name":"DataRow","sourcePath":"components/core/DataRow.jsx"},{"name":"FaqRow","sourcePath":"components/core/FaqRow.jsx"},{"name":"Field","sourcePath":"components/core/Field.jsx"},{"name":"GridLines","sourcePath":"components/core/GridLines.jsx"},{"name":"NavLink","sourcePath":"components/core/NavLink.jsx"},{"name":"PartnerStrip","sourcePath":"components/core/PartnerStrip.jsx"},{"name":"PixelPattern","sourcePath":"components/core/PixelPattern.jsx"},{"name":"SectionTitle","sourcePath":"components/core/SectionTitle.jsx"},{"name":"SiteHeader","sourcePath":"components/core/SiteHeader.jsx"},{"name":"StatusLabel","sourcePath":"components/core/StatusLabel.jsx"},{"name":"StepBlock","sourcePath":"components/core/StepBlock.jsx"},{"name":"Icon","sourcePath":"components/social/Icon.jsx"},{"name":"SocialRow","sourcePath":"components/social/SocialRow.jsx"}],"sourceHashes":{"components/core/Button.jsx":"44c3e4236e7b","components/core/CeibaLogo.jsx":"3f2cb25cd932","components/core/CountdownRuler.jsx":"08a62a05f986","components/core/DataRow.jsx":"ca27bf12713d","components/core/FaqRow.jsx":"09781cbcf8f3","components/core/Field.jsx":"445fe830c592","components/core/GridLines.jsx":"c4b59e9349e8","components/core/NavLink.jsx":"2936baeca3a2","components/core/PartnerStrip.jsx":"1327233e946c","components/core/PixelPattern.jsx":"a7e6af095010","components/core/SectionTitle.jsx":"be1c738595d4","components/core/SiteHeader.jsx":"e4f3c3c5a478","components/core/StatusLabel.jsx":"20fc8cbeda1b","components/core/StepBlock.jsx":"f2d0741e5261","components/social/Icon.jsx":"b81dfc2559d3","components/social/SocialRow.jsx":"2e5774512572","components/social/icon-data.js":"21d0d9e168be","ui_kits/registro_web/AgendaScreen.jsx":"bf6cea8fb20d","ui_kits/registro_web/ConfirmScreen.jsx":"c6fe36a87674","ui_kits/registro_web/FaqScreen.jsx":"bd62e9896b41","ui_kits/registro_web/HeroScreen.jsx":"cace0f48cd9a","ui_kits/registro_web/RegistroScreen.jsx":"1fcd1c312639","ui_kits/registro_web/SpeakersScreen.jsx":"23fa040f2832"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CEIBADesignSystem_b9a094 = window.CEIBADesignSystem_b9a094 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  lg: {
    fontSize: 'var(--fs-lg)',
    minHeight: 91.545,
    padding: '32.955px 29.818px'
  },
  md: {
    fontSize: 'var(--fs-base)',
    minHeight: 54,
    padding: '17px 40px'
  },
  sm: {
    fontSize: 'var(--fs-sm)',
    minHeight: 43.597,
    padding: '13px 24px'
  }
};

/* Square, full-tracking pixel-mono buttons. No radius anywhere — the system
   is orthogonal by design (see nuevoHero 'REGISTRO ABIERTO', node 351:540). */
function Button({
  variant = 'signal',
  size = 'lg',
  block = false,
  disabled = false,
  icon = null,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const base = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    border: 0,
    borderRadius: 'var(--radius-none)',
    fontFamily: 'var(--font-pixel)',
    letterSpacing: 'var(--tracking-label)',
    lineHeight: 'var(--leading-flush)',
    textTransform: 'uppercase',
    textAlign: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out)',
    transform: down && !disabled ? 'translateY(1px)' : 'none',
    ...(SIZES[size] || SIZES.lg)
  };
  const skin = {
    signal: {
      background: hover && !disabled ? 'var(--ceiba-lime-deep)' : 'var(--surface-signal)',
      color: 'var(--text-on-signal)'
    },
    outline: {
      background: hover && !disabled ? 'rgba(247,255,210,0.08)' : 'transparent',
      color: 'var(--text-primary)',
      boxShadow: 'var(--outline-button)'
    },
    gradient: {
      background: 'var(--gradient-cta)',
      color: 'var(--ceiba-cream)',
      filter: hover && !disabled ? 'brightness(1.08)' : 'none'
    },
    ghost: {
      background: hover && !disabled ? 'rgba(208,255,0,0.28)' : 'rgba(208,255,0,0.18)',
      color: 'var(--ceiba-lime)'
    }
  }[variant] || {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    style: {
      ...base,
      ...skin,
      ...style
    }
  }, rest), children, icon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/CeibaLogo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Pixel-diamond mark + CEIBA wordmark. Mark geometry is transcribed verbatim
   from NEXO CEIBA.fig (node 351:542 header lockup). */
function CeibaLogo({
  variant = 'lockup',
  tone = 'onDark',
  height = 26,
  style,
  ...rest
}) {
  const cream = tone === 'onDark' ? 'var(--ceiba-cream-hi)' : 'var(--ceiba-ink-deep)';
  const lime = tone === 'onDark' ? 'var(--ceiba-lime-acid)' : 'var(--ceiba-green-forest)';
  const s = height / 26.047;
  const mark = /*#__PURE__*/React.createElement("svg", {
    width: 26.548 * s,
    height: 26.047 * s,
    viewBox: "0 0 26.548 26.047",
    fill: "none",
    "aria-hidden": "true",
    style: {
      display: 'block',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    fill: lime,
    d: "M 19.536 13.025 C 19.536 16.457 16.749 19.24 13.308 19.245 L 13.308 26.047 L 9.968 26.047 L 9.968 22.759 L 6.639 22.759 L 6.639 19.417 L 3.34 19.417 L 3.34 16.329 L 0 16.329 L 0 9.721 L 3.34 9.721 L 3.34 6.633 L 6.639 6.633 L 6.639 3.291 L 9.968 3.291 L 9.968 0 L 13.308 0 L 13.308 6.805 C 16.749 6.81 19.536 9.593 19.536 13.025 Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: cream,
    transform: "translate(13.274 0)",
    d: "M 13.274 9.721 L 13.274 16.329 L 9.938 16.329 L 9.938 19.417 L 6.645 19.417 L 6.645 22.759 L 3.316 22.759 L 3.316 26.047 L 0 26.047 L 0 19.245 C 3.437 19.24 6.221 16.457 6.221 13.025 C 6.221 9.593 3.437 6.81 0 6.805 L 0 0 L 3.316 0 L 3.316 3.291 L 6.645 3.291 L 6.645 6.633 L 9.938 6.633 L 9.938 9.721 L 13.274 9.721 Z"
  }));
  if (variant === 'mark') return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      ...style
    }
  }, rest), mark);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6 * s,
      ...style
    }
  }, rest), mark, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: height * 0.96,
      lineHeight: 1,
      letterSpacing: '0.02em',
      color: cream,
      textTransform: 'uppercase'
    }
  }, "CEIBA"));
}
Object.assign(__ds_scope, { CeibaLogo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CeibaLogo.jsx", error: String((e && e.message) || e) }); }

// components/core/CountdownRuler.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Hero countdown ruler (node 351:542). */
function CountdownRuler({
  label = 'DÌAS PARA CONEXIÓN500',
  days = [30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19],
  current = 20,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-pixel)',
      fontSize: 'var(--fs-nano)',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: 18
    }
  }, days.map(d => /*#__PURE__*/React.createElement("span", {
    key: d,
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: d === current ? 20.727272033691406 : 10,
      letterSpacing: 'var(--tracking-label)',
      color: d === current ? 'var(--ceiba-cream-hi)' : 'var(--text-muted)'
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 10,
      height: 13,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, Array.from({
    length: 61
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 1,
      height: i % 5 === 0 ? 13 : 8,
      background: 'var(--ceiba-cream)',
      opacity: i % 5 === 0 ? 1 : 0.55
    }
  }))), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '50%',
      bottom: -1,
      marginLeft: -12,
      width: 24,
      height: 13,
      background: 'var(--ceiba-cream)',
      clipPath: 'polygon(50% 0,100% 100%,0 100%)'
    }
  }));
}
Object.assign(__ds_scope, { CountdownRuler });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CountdownRuler.jsx", error: String((e && e.message) || e) }); }

// components/core/DataRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Label/value row from the registered-user screen (node 351:1465). */
function DataRow({
  label,
  value,
  tone = 'onDark',
  style,
  ...rest
}) {
  const c = tone === 'onDark' ? 'var(--text-primary)' : 'var(--ceiba-ink-deep)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 32,
      padding: '14px 0',
      boxShadow: 'inset 0 -0.5px 0 0 ' + (tone === 'onDark' ? 'var(--border-hairline)' : 'rgba(0,29,9,0.2)'),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 'var(--fs-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 'var(--fs-lg)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: c,
      textAlign: 'right'
    }
  }, value));
}
Object.assign(__ds_scope, { DataRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/DataRow.jsx", error: String((e && e.message) || e) }); }

// components/core/FaqRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Dashed-rule FAQ row (node 186:8). */
function FaqRow({
  question,
  answer,
  open = false,
  onToggle,
  tone = 'onLight',
  style,
  ...rest
}) {
  const [self, setSelf] = React.useState(open);
  const isOpen = onToggle ? open : self;
  const ink = tone === 'onLight' ? 'var(--ceiba-ink-deep)' : 'var(--text-primary)';
  const rule = tone === 'onLight' ? 'rgba(0,29,9,0.25)' : 'var(--border-grid-dashed)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderBottom: '1px dashed ' + rule,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onToggle || (() => setSelf(!self)),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 32,
      padding: '22px 0',
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 'var(--fs-lg)',
      lineHeight: 'var(--leading-flush)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: ink
    }
  }, question), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      width: 24,
      height: 9,
      background: 'var(--ceiba-lime-leaf)',
      clipPath: 'polygon(0 0,50% 100%,100% 0)',
      transform: isOpen ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), isOpen && answer ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      padding: '0 0 26px',
      maxWidth: 720,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-base)',
      lineHeight: 'var(--leading-prose)',
      color: ink
    }
  }, answer) : null);
}
Object.assign(__ds_scope, { FaqRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/FaqRow.jsx", error: String((e && e.message) || e) }); }

// components/core/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Registration input: 73px tall wash block, 20.727px tracked mono value,
   50%-opacity cream placeholder (nodes 826:32 / 351:1323). */
function Field({
  label,
  placeholder = '',
  value,
  onChange,
  type = 'text',
  name,
  hint,
  block = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: block ? 'block' : 'inline-block',
      width: block ? '100%' : undefined,
      ...style
    }
  }, rest), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 12,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 'var(--fs-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 73,
      padding: '0 24px',
      background: 'var(--surface-field)',
      boxShadow: 'inset 0 -1px 0 0 rgba(247,255,210,0.25)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: type,
    name: name,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      width: '100%',
      background: 'transparent',
      border: 0,
      outline: 'none',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-lg)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-primary)'
    }
  })), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 10,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-2xs)',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-muted)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Field.jsx", error: String((e && e.message) || e) }); }

// components/core/GridLines.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Hairline vertical column rules at x = 91, 263, 1029, 1201 (node 351:542). */
function GridLines({
  columns = [91, 263, 1029, 1201],
  variant = 'solid',
  top = 89,
  style,
  ...rest
}) {
  const dashed = variant === 'dashed';
  return /*#__PURE__*/React.createElement("div", _extends({
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      ...style
    }
  }, rest), columns.map(x => /*#__PURE__*/React.createElement("span", {
    key: x,
    style: {
      position: 'absolute',
      left: x,
      top: top,
      bottom: 0,
      width: 0,
      borderLeft: dashed ? '0.341px dashed var(--border-grid-dashed)' : '0.25px solid var(--border-grid)'
    }
  })));
}
Object.assign(__ds_scope, { GridLines });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/GridLines.jsx", error: String((e && e.message) || e) }); }

// components/core/NavLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavLink({
  href = '#',
  active = false,
  tone = 'onDark',
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const rest_ = tone === 'onDark' ? 'var(--ceiba-cream)' : 'var(--ceiba-ink-deep)';
  const color = active || hover ? 'var(--ceiba-lime)' : rest_;
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 'var(--fs-sm)',
      lineHeight: 'var(--leading-flush)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color,
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'color var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { NavLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/NavLink.jsx", error: String((e && e.message) || e) }); }

// components/core/PartnerStrip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Footer partner strip (node 49:13). */
function PartnerStrip({
  groups = [],
  tone = 'onDark',
  style,
  ...rest
}) {
  const ink = tone === 'onDark' ? 'var(--ceiba-white)' : 'var(--ceiba-ink-deep)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 38.1566162109375,
      ...style
    }
  }, rest), groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.label,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 19.623401641845703
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 'var(--fs-micro)',
      lineHeight: 'var(--leading-prose)',
      letterSpacing: '1.856px',
      textTransform: 'uppercase',
      color: ink
    }
  }, g.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 19.41472625732422,
      flexWrap: 'wrap'
    }
  }, (g.logos || []).map((l, i) => l.src ? /*#__PURE__*/React.createElement("img", {
    key: i,
    src: l.src,
    alt: l.alt || '',
    style: {
      height: l.height || 24,
      width: 'auto',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: ink
    }
  }, l.alt))))));
}
Object.assign(__ds_scope, { PartnerStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PartnerStrip.jsx", error: String((e && e.message) || e) }); }

// components/core/PixelPattern.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FILES = {
  staircase: 'pixel-staircase-lime.svg',
  diamond: 'pixel-diamond-magenta.svg',
  lattice: 'pixel-lattice-amber.svg',
  zigzag: 'pixel-zigzag-blue.svg'
};

/* Brand pattern tiles supplied with the source material. */
function PixelPattern({
  pattern = 'zigzag',
  assetBase = '',
  size = 187,
  repeat = 'repeat',
  opacity = 1,
  style,
  ...rest
}) {
  const url = 'url(' + assetBase + 'assets/patterns/' + (FILES[pattern] || FILES.zigzag) + ')';
  return /*#__PURE__*/React.createElement("div", _extends({
    "aria-hidden": "true",
    style: {
      backgroundImage: url,
      backgroundRepeat: repeat,
      backgroundSize: size + 'px auto',
      opacity: opacity,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { PixelPattern });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PixelPattern.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionTitle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BLOCKS = {
  warm: 'var(--surface-block-warm)',
  lime: 'var(--surface-block-light)',
  signal: 'var(--surface-signal)',
  none: 'transparent'
};

/* Pixel-mono section title sitting on a solid colour block (node 351:1246). */
function SectionTitle({
  children,
  block = 'warm',
  size = 64,
  tone = 'onLight',
  style,
  ...rest
}) {
  const bg = BLOCKS[block] || BLOCKS.warm;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-block',
      background: bg,
      padding: block === 'none' ? 0 : '22px 23px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-pixel)',
      fontSize: size,
      lineHeight: 'var(--leading-lede)',
      textTransform: 'uppercase',
      color: tone === 'onLight' ? 'var(--ceiba-ink-forest)' : 'var(--text-primary)'
    }
  }, children));
}
Object.assign(__ds_scope, { SectionTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionTitle.jsx", error: String((e && e.message) || e) }); }

// components/core/SiteHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* 89px header: logo left, 49px-gap nav centred, globe + ES|EN right,
   0.5px hairline rule on the baseline (nodes 351:542 / 351:1311). */
function SiteHeader({
  items = ['AGENDA', 'SPEAKERS', 'FAQ', 'REGÍSTRATE'],
  active = 'REGÍSTRATE',
  locale = 'ES | EN',
  tone = 'onDark',
  assetBase = '',
  style,
  ...rest
}) {
  const onDark = tone === 'onDark';
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      position: 'relative',
      height: 'var(--layout-header-h)',
      display: 'flex',
      alignItems: 'center',
      boxShadow: 'inset 0 -0.5px 0 0 ' + (onDark ? 'var(--border-hairline)' : 'rgba(0,29,9,0.2)'),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'var(--layout-content-w)',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.CeibaLogo, {
    tone: tone,
    height: 25
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--layout-nav-gap)'
    }
  }, items.map(i => /*#__PURE__*/React.createElement(__ds_scope.NavLink, {
    key: i,
    active: i === active,
    tone: tone
  }, i))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 27
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: assetBase + 'assets/icons/globe.svg',
    alt: "",
    width: 16.667,
    height: 16.667,
    style: {
      display: 'block',
      filter: onDark ? 'none' : 'invert(1)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 'var(--fs-sm)',
      letterSpacing: 'var(--tracking-label)',
      color: onDark ? 'var(--ceiba-white)' : 'var(--ceiba-ink-deep)'
    }
  }, locale))));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusLabel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  default: {
    color: 'var(--text-primary)'
  },
  muted: {
    color: 'var(--text-muted)'
  },
  signal: {
    color: 'var(--ceiba-lime)'
  },
  onLight: {
    color: 'var(--ceiba-ink-deep)'
  }
};

/* 11px / 0.17em tracked mono status line — 'QUEDAN: 5 LUGARES',
   'CUPO LIMITADO*' (nodes 351:1328, 351:542). */
function StatusLabel({
  children,
  tone = 'default',
  size = 11,
  block = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: block ? 'block' : 'inline-block',
      fontFamily: 'var(--font-mono)',
      fontSize: size,
      lineHeight: 'var(--leading-flush)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      ...(TONES[tone] || TONES.default),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { StatusLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusLabel.jsx", error: String((e && e.message) || e) }); }

// components/core/StepBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Stepped-quadrant shape framing photography (path from node 351:852). */
const D = 'M 320.768 216.95 L 210.808 216.95 L 210.808 109.182 L 109.174 109.182 L 109.174 0 L 0 0 L 0 109.182 L 0 435 L 150.016 435 L 210.808 435 L 319.826 435 L 320.768 435 L 429 435 L 429 325.818 L 320.768 325.818 L 320.768 216.95 Z';
function StepBlock({
  fill = 'var(--ceiba-lime)',
  image,
  width = 429,
  flip = false,
  style,
  ...rest
}) {
  const height = width * (435 / 429);
  const cid = React.useId();
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: width,
    height: height,
    viewBox: "0 0 429 435",
    fill: "none",
    "aria-hidden": "true",
    style: {
      display: 'block',
      transform: flip ? 'scaleX(-1)' : 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("clipPath", {
    id: cid
  }, /*#__PURE__*/React.createElement("path", {
    d: D
  })), image ? /*#__PURE__*/React.createElement("image", {
    href: image,
    width: "429",
    height: "435",
    preserveAspectRatio: "xMidYMid slice",
    clipPath: 'url(#' + cid + ')'
  }) : /*#__PURE__*/React.createElement("path", {
    d: D,
    fill: fill
  }));
}
Object.assign(__ds_scope, { StepBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StepBlock.jsx", error: String((e && e.message) || e) }); }

// components/social/icon-data.js
try { (() => {
// Generated by fig_materialize (moduleFormat: 'icon-data') — 52 icon(s)
// as { viewBox, body } SVG-markup entries. Render via the sibling Icon.jsx
// (<Icon name="SocialIconsPlatformAppleColorNegative" />), or consume the path data directly.
let __ds_default_components_social_icon_data_1jm1slw;
try {
  __ds_default_components_social_icon_data_1jm1slw = {
    "SocialIconsPlatformAppleColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 39.584 37.407 C 38.858 39.084 37.999 40.627 37.003 42.046 C 35.646 43.981 34.535 45.32 33.679 46.064 C 32.352 47.285 30.929 47.91 29.406 47.946 C 28.313 47.946 26.995 47.634 25.46 47.003 C 23.92 46.375 22.505 46.064 21.211 46.064 C 19.854 46.064 18.399 46.375 16.842 47.003 C 15.283 47.634 14.027 47.963 13.067 47.996 C 11.606 48.058 10.151 47.415 8.698 46.064 C 7.77 45.255 6.61 43.869 5.221 41.904 C 3.73 39.807 2.504 37.374 1.544 34.601 C 0.516 31.605 0 28.705 0 25.896 C 0 22.68 0.695 19.905 2.087 17.58 C 3.182 15.713 4.637 14.24 6.459 13.158 C 8.281 12.077 10.249 11.526 12.369 11.49 C 13.529 11.49 15.05 11.849 16.941 12.554 C 18.826 13.262 20.036 13.621 20.567 13.621 C 20.963 13.621 22.308 13.201 24.587 12.365 C 26.743 11.589 28.562 11.268 30.052 11.394 C 34.091 11.72 37.125 13.312 39.142 16.18 C 35.531 18.369 33.744 21.434 33.78 25.366 C 33.812 28.428 34.923 30.977 37.107 33.001 C 38.097 33.94 39.202 34.666 40.431 35.181 C 40.165 35.955 39.883 36.695 39.584 37.407 L 39.584 37.407 Z M 30.322 0.96 C 30.322 3.361 29.445 5.602 27.697 7.677 C 25.587 10.143 23.036 11.568 20.269 11.343 C 20.233 11.055 20.213 10.752 20.213 10.434 C 20.213 8.129 21.216 5.663 22.998 3.646 C 23.887 2.625 25.018 1.776 26.39 1.099 C 27.759 0.432 29.054 0.063 30.272 0 C 30.307 0.321 30.322 0.642 30.322 0.96 L 30.322 0.96 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 0.001)\"/>"
    },
    "SocialIconsPlatformAppleColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 39.584 37.407 C 38.858 39.084 37.999 40.627 37.003 42.046 C 35.646 43.981 34.535 45.32 33.679 46.064 C 32.352 47.285 30.929 47.91 29.406 47.946 C 28.313 47.946 26.995 47.634 25.46 47.003 C 23.92 46.375 22.505 46.064 21.211 46.064 C 19.854 46.064 18.399 46.375 16.842 47.003 C 15.283 47.634 14.027 47.963 13.067 47.996 C 11.606 48.058 10.151 47.415 8.698 46.064 C 7.77 45.255 6.61 43.869 5.221 41.904 C 3.73 39.807 2.504 37.374 1.544 34.601 C 0.516 31.605 0 28.705 0 25.896 C 0 22.68 0.695 19.905 2.087 17.58 C 3.182 15.713 4.637 14.24 6.459 13.158 C 8.281 12.077 10.249 11.526 12.369 11.49 C 13.529 11.49 15.05 11.849 16.941 12.554 C 18.826 13.262 20.036 13.621 20.567 13.621 C 20.963 13.621 22.308 13.201 24.587 12.365 C 26.743 11.589 28.562 11.268 30.052 11.394 C 34.091 11.72 37.125 13.312 39.142 16.18 C 35.531 18.369 33.744 21.434 33.78 25.366 C 33.812 28.428 34.923 30.977 37.107 33.001 C 38.097 33.94 39.202 34.666 40.431 35.181 C 40.165 35.955 39.883 36.695 39.584 37.407 L 39.584 37.407 Z M 30.322 0.96 C 30.322 3.361 29.445 5.602 27.697 7.677 C 25.587 10.143 23.036 11.568 20.269 11.343 C 20.233 11.055 20.213 10.752 20.213 10.434 C 20.213 8.129 21.216 5.663 22.998 3.646 C 23.887 2.625 25.018 1.776 26.39 1.099 C 27.759 0.432 29.054 0.063 30.272 0 C 30.307 0.321 30.322 0.642 30.322 0.96 L 30.322 0.96 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 0.001)\"/>"
    },
    "SocialIconsPlatformClubhouseColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 0.296 15.582 C 0.931 17.687 1.7 19.662 2.535 21.567 C 3.972 24.978 4.941 26.783 6.281 29.022 L 6.43 29.264 C 8.028 31.878 9.816 34.799 12.7 36.711 C 14.872 38.148 17.515 38.883 20.055 38.883 C 23.634 38.883 26.708 37.312 28.683 35.471 C 30.621 33.667 33.131 30.188 33.131 23.402 C 33.131 21.196 34.051 19.285 34.801 17.73 L 34.801 17.73 C 34.846 17.635 34.891 17.542 34.935 17.45 C 34.935 17.417 34.969 17.35 35.035 17.216 C 35.336 16.548 35.704 15.679 35.704 14.81 C 35.704 14.175 35.537 13.44 35.102 12.805 C 34.434 11.669 33.231 11.268 32.125 11.268 C 29.552 11.268 27.778 13.072 26.875 14.913 L 26.575 15.515 C 26.207 14.98 25.839 14.412 25.539 13.911 C 24.603 12.273 24.068 11.171 23.6 9.764 C 23.233 8.661 22.932 7.391 22.732 6.352 C 22.163 3.074 21.228 2.005 19.688 1.604 C 18.551 1.303 17.215 1.537 16.242 2.172 C 15.577 0.668 14.441 0 12.934 0 C 10.795 0 8.854 1.404 8.854 3.779 C 8.854 4.033 8.878 4.286 8.905 4.579 L 8.905 4.579 C 8.91 4.634 8.916 4.69 8.921 4.748 C 8.654 4.682 8.353 4.648 8.052 4.648 C 5.746 4.648 4.039 6.252 4.039 8.427 C 4.039 8.929 4.106 9.497 4.273 10.165 C 4.072 10.132 3.872 10.132 3.671 10.132 C 2.535 10.198 1.499 10.633 0.761 11.535 C 0.029 12.404 -0.272 13.741 0.296 15.582 Z M 2.201 14.98 C 1.9 14.011 1.934 13.276 2.301 12.808 C 2.669 12.374 3.17 12.173 3.772 12.14 C 4.808 12.106 5.209 12.841 5.81 14.746 C 6.178 15.949 6.913 17.69 7.347 18.659 C 7.915 19.829 8.717 21.399 9.085 21.937 C 9.386 22.405 9.653 22.539 9.954 22.539 C 10.489 22.539 10.89 22.238 10.89 21.703 C 10.89 21.433 10.646 20.999 10.475 20.696 L 10.475 20.696 C 10.456 20.663 10.438 20.631 10.422 20.6 C 10.361 20.486 10.287 20.349 10.204 20.195 L 10.204 20.194 L 10.204 20.194 C 9.873 19.582 9.399 18.701 9.052 17.927 C 8.584 16.858 8.049 15.521 7.615 14.315 C 7.347 13.613 7.047 12.611 6.746 11.608 C 6.278 10.071 6.044 9.135 6.044 8.43 C 6.044 7.361 6.846 6.659 8.049 6.659 C 8.918 6.659 9.486 7.094 9.854 8.664 C 10.154 10.101 10.689 12.444 11.458 14.281 C 11.959 15.485 12.694 17.092 13.129 17.894 C 13.216 18.046 13.307 18.192 13.39 18.325 C 13.56 18.599 13.697 18.817 13.697 18.93 C 13.697 19.078 13.521 19.281 13.299 19.538 C 13.171 19.685 13.029 19.85 12.895 20.032 C 12.661 20.333 12.56 20.534 12.56 20.768 C 12.56 20.968 12.694 21.169 12.895 21.436 C 13.095 21.703 13.296 21.971 13.53 21.971 C 13.697 21.971 13.797 21.904 13.897 21.77 C 14.933 20.467 16.069 19.565 17.376 18.826 C 18.913 17.957 20.487 17.523 21.723 17.256 C 22.324 17.122 22.492 16.988 22.492 16.654 C 22.492 16.253 22.191 16.019 21.79 15.986 C 21.544 15.958 21.321 15.976 20.992 16.001 C 20.918 16.007 20.839 16.013 20.754 16.019 C 20.42 16.053 20.253 15.886 20.052 15.451 C 19.959 15.254 19.851 15.035 19.734 14.797 C 19.098 13.501 18.172 11.614 17.579 9.299 C 17.278 8.13 17.011 6.893 16.844 5.286 C 16.744 4.551 16.877 4.284 17.245 3.949 C 17.713 3.548 18.548 3.381 19.183 3.548 C 19.952 3.749 20.353 4.35 20.754 6.693 C 20.954 7.795 21.289 9.199 21.69 10.405 C 22.191 11.942 22.826 13.215 23.795 14.919 C 24.33 15.855 24.998 16.824 25.7 17.763 C 25.566 18.164 25.332 18.431 24.563 19.066 C 23.795 19.701 23.026 20.37 22.324 21.606 C 21.823 22.508 21.589 23.511 21.589 24.179 C 21.589 24.814 21.723 24.948 22.124 24.948 C 22.826 24.948 23.394 24.814 23.427 24.513 C 23.594 23.31 23.795 22.542 24.463 21.636 C 24.864 21.135 25.566 20.5 26.134 19.999 C 27.203 19.13 27.571 18.629 27.939 17.392 C 28.106 16.824 28.306 16.29 28.574 15.788 C 29.209 14.619 30.345 13.282 32.119 13.282 C 32.687 13.282 33.155 13.449 33.456 13.917 C 33.623 14.184 33.69 14.552 33.69 14.819 C 33.69 15.392 33.296 16.177 33.085 16.597 L 33.055 16.657 C 33.017 16.737 32.979 16.818 32.94 16.902 L 32.939 16.902 C 32.201 18.473 31.116 20.778 31.116 23.411 C 31.116 29.462 28.978 32.473 27.304 34.01 C 25.666 35.547 23.09 36.887 20.049 36.887 C 17.877 36.887 15.635 36.252 13.797 35.049 C 11.276 33.379 9.682 30.776 8.079 28.157 L 8.079 28.157 L 7.979 27.995 C 6.676 25.823 5.774 24.115 4.367 20.807 C 3.574 18.89 2.836 17.019 2.201 14.98 Z M 12.934 2.008 C 11.965 2.008 10.795 2.509 10.795 3.779 C 10.795 4.615 11.029 5.851 11.263 6.851 C 11.554 7.555 11.669 8.065 11.901 9.095 C 11.989 9.485 12.094 9.95 12.232 10.53 C 12.533 11.769 12.901 12.838 13.268 13.774 C 13.703 14.913 14.204 15.882 14.906 17.186 C 15.24 17.821 15.407 17.821 16.209 17.386 C 16.844 17.052 17.78 16.651 18.481 16.417 C 17.278 13.811 16.276 11.635 15.775 9.797 C 15.641 9.263 15.173 7.121 15.039 6.185 C 14.939 5.25 14.839 4.448 14.605 3.579 C 14.338 2.509 13.97 2.008 12.934 2.008 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 0 5) matrix(1 0 0 1 11.515 0)\"/><path d=\"M 7.111 2.221 C 6.403 2.659 2.651 4.624 1.803 4.937 C 1.199 5.162 0.542 5.107 0.157 3.965 C -0.317 2.552 0.348 2.218 1.296 1.85 C 2.134 1.525 5.613 0.268 6.421 0.049 C 6.989 -0.103 7.384 0.088 7.657 0.772 C 7.958 1.522 7.752 1.823 7.111 2.221 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5) matrix(1 0 0 1 3.230 23.942)\"/><path d=\"M 7.248 3.217 C 6.239 3.245 2.05 3.066 1.093 2.971 C 0.261 2.889 -0.077 2.522 0.014 1.316 C 0.112 0.021 0.616 -0.058 1.433 0.021 C 2.381 0.113 6.771 0.827 7.47 1.042 C 8.193 1.267 8.293 1.595 8.205 2.227 C 8.092 3.047 7.722 3.202 7.248 3.217 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5) matrix(1 0 0 1 0 14.983)\"/><path d=\"M 6.177 5.867 C 5.023 5.502 1.596 3.427 0.703 2.892 C -0.106 2.406 -0.209 1.969 0.353 0.903 C 0.851 -0.039 1.404 -0.203 2.225 0.222 C 3.175 0.717 6.532 3.33 7.173 3.846 C 7.793 4.345 7.708 4.603 7.383 5.244 C 7.058 5.885 6.754 6.049 6.177 5.867 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5) matrix(1 0 0 1 1.590 3.852)\"/>"
    },
    "SocialIconsPlatformClubhouseColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 0.296 15.582 C 0.931 17.687 1.7 19.662 2.535 21.567 C 3.972 24.978 4.941 26.783 6.281 29.022 C 7.918 31.695 9.726 34.739 12.7 36.711 C 14.872 38.148 17.515 38.883 20.055 38.883 C 23.634 38.883 26.708 37.312 28.683 35.471 C 30.621 33.667 33.131 30.188 33.131 23.402 C 33.131 21.062 34.167 19.054 34.935 17.45 C 34.935 17.417 34.969 17.35 35.035 17.216 C 35.336 16.548 35.704 15.679 35.704 14.81 C 35.704 14.175 35.537 13.44 35.102 12.805 C 34.434 11.669 33.231 11.268 32.125 11.268 C 29.552 11.268 27.778 13.072 26.875 14.913 L 26.575 15.515 C 26.207 14.98 25.839 14.412 25.539 13.911 C 24.603 12.273 24.068 11.171 23.6 9.764 C 23.233 8.661 22.932 7.391 22.732 6.352 C 22.163 3.074 21.228 2.005 19.688 1.604 C 18.551 1.303 17.215 1.537 16.242 2.172 C 15.577 0.668 14.441 0 12.934 0 C 10.795 0 8.854 1.404 8.854 3.779 C 8.854 4.08 8.888 4.381 8.921 4.748 C 8.654 4.682 8.353 4.648 8.052 4.648 C 5.746 4.648 4.039 6.252 4.039 8.427 C 4.039 8.929 4.106 9.497 4.273 10.165 C 4.072 10.132 3.872 10.132 3.671 10.132 C 2.535 10.198 1.499 10.633 0.761 11.535 C 0.029 12.404 -0.272 13.741 0.296 15.582 Z\" fill=\"rgb(31,31,31)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5) matrix(1 0 0 1 11.515 0)\"/><path d=\"M 0.203 11.496 C -0.098 10.527 -0.064 9.792 0.303 9.324 C 0.671 8.89 1.172 8.689 1.774 8.656 C 2.81 8.622 3.211 9.357 3.812 11.262 C 4.18 12.465 4.915 14.206 5.349 15.175 C 5.917 16.345 6.719 17.915 7.087 18.453 C 7.388 18.921 7.655 19.055 7.956 19.055 C 8.491 19.055 8.892 18.754 8.892 18.219 C 8.892 17.918 8.591 17.417 8.424 17.116 C 8.123 16.548 7.488 15.412 7.054 14.443 C 6.586 13.374 6.051 12.037 5.617 10.831 C 5.349 10.129 5.049 9.127 4.748 8.124 C 4.28 6.587 4.046 5.651 4.046 4.946 C 4.046 3.877 4.848 3.175 6.051 3.175 C 6.92 3.175 7.488 3.61 7.856 5.18 C 8.156 6.617 8.691 8.96 9.46 10.797 C 9.961 12.001 10.696 13.608 11.131 14.41 C 11.398 14.877 11.699 15.278 11.699 15.446 C 11.699 15.68 11.264 16.047 10.897 16.548 C 10.663 16.849 10.563 17.05 10.563 17.284 C 10.563 17.484 10.696 17.685 10.897 17.952 C 11.097 18.219 11.298 18.487 11.532 18.487 C 11.699 18.487 11.799 18.42 11.899 18.286 C 12.935 16.983 14.071 16.081 15.378 15.342 C 16.915 14.473 18.489 14.039 19.725 13.772 C 20.327 13.638 20.494 13.504 20.494 13.17 C 20.494 12.769 20.193 12.535 19.792 12.502 C 19.491 12.468 19.224 12.502 18.756 12.535 C 18.422 12.569 18.255 12.402 18.054 11.967 C 17.453 10.697 16.283 8.555 15.581 5.815 C 15.28 4.646 15.013 3.409 14.846 1.802 C 14.746 1.067 14.879 0.8 15.247 0.465 C 15.715 0.064 16.55 -0.103 17.185 0.064 C 17.954 0.265 18.355 0.866 18.756 3.209 C 18.956 4.311 19.291 5.715 19.692 6.921 C 20.193 8.458 20.828 9.731 21.797 11.435 C 22.332 12.371 23 13.34 23.702 14.279 C 23.568 14.68 23.334 14.947 22.566 15.582 C 21.797 16.217 21.028 16.886 20.327 18.122 C 19.825 19.024 19.591 20.027 19.591 20.695 C 19.591 21.33 19.725 21.464 20.126 21.464 C 20.828 21.464 21.396 21.33 21.429 21.029 C 21.596 19.826 21.797 19.058 22.465 18.152 C 22.866 17.651 23.568 17.016 24.136 16.515 C 25.206 15.646 25.573 15.145 25.941 13.908 C 26.108 13.34 26.308 12.806 26.576 12.304 C 27.211 11.135 28.347 9.798 30.121 9.798 C 30.689 9.798 31.157 9.965 31.458 10.433 C 31.625 10.7 31.692 11.068 31.692 11.335 C 31.692 11.937 31.257 12.772 31.057 13.173 C 30.321 14.744 29.118 17.153 29.118 19.927 C 29.118 25.978 26.98 28.989 25.306 30.526 C 23.668 32.063 21.092 33.403 18.051 33.403 C 15.879 33.403 13.637 32.768 11.799 31.565 C 9.226 29.861 7.619 27.184 5.981 24.511 C 4.678 22.339 3.776 20.631 2.369 17.323 C 1.576 15.406 0.838 13.535 0.203 11.496 Z\" fill=\"rgb(255,228,80)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5) matrix(1 0 0 1 13.513 3.484)\"/><path d=\"M 0 1.771 C 0 0.501 1.17 0 2.139 0 C 3.175 0 3.542 0.501 3.81 1.571 C 4.044 2.439 4.144 3.242 4.244 4.177 C 4.378 5.113 4.846 7.255 4.979 7.789 C 5.481 9.627 6.483 11.803 7.686 14.409 C 6.984 14.643 6.049 15.044 5.414 15.378 C 4.612 15.813 4.445 15.813 4.11 15.178 C 3.409 13.874 2.907 12.905 2.473 11.766 C 2.105 10.83 1.738 9.761 1.437 8.522 C 0.936 6.416 0.869 5.815 0.468 4.843 C 0.234 3.843 0 2.607 0 1.771 Z\" fill=\"rgb(255,228,80)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5) matrix(1 0 0 1 22.310 2.008)\"/><path d=\"M 7.111 2.221 C 6.403 2.659 2.651 4.624 1.803 4.937 C 1.199 5.162 0.542 5.107 0.157 3.965 C -0.317 2.552 0.348 2.218 1.296 1.85 C 2.134 1.525 5.613 0.268 6.421 0.049 C 6.989 -0.103 7.384 0.088 7.657 0.772 C 7.958 1.522 7.752 1.823 7.111 2.221 Z\" fill=\"rgb(31,31,31)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5) matrix(1 0 0 1 3.230 23.942)\"/><path d=\"M 7.248 3.217 C 6.239 3.245 2.05 3.066 1.093 2.971 C 0.261 2.889 -0.077 2.522 0.014 1.316 C 0.112 0.021 0.616 -0.058 1.433 0.021 C 2.381 0.113 6.771 0.827 7.47 1.042 C 8.193 1.267 8.293 1.595 8.205 2.227 C 8.092 3.047 7.722 3.202 7.248 3.217 Z\" fill=\"rgb(31,31,31)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5) matrix(1 0 0 1 0 14.983)\"/><path d=\"M 6.177 5.867 C 5.023 5.502 1.596 3.427 0.703 2.892 C -0.106 2.406 -0.209 1.969 0.353 0.903 C 0.851 -0.039 1.404 -0.203 2.225 0.222 C 3.175 0.717 6.532 3.33 7.173 3.846 C 7.793 4.345 7.708 4.603 7.383 5.244 C 7.058 5.885 6.754 6.049 6.177 5.867 Z\" fill=\"rgb(31,31,31)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5) matrix(1 0 0 1 1.590 3.852)\"/>"
    },
    "SocialIconsPlatformDiscordColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 40.634 3.033 C 37.575 1.629 34.294 0.595 30.864 0.002 C 30.801 -0.009 30.739 0.02 30.707 0.077 C 30.285 0.827 29.817 1.806 29.49 2.576 C 25.801 2.023 22.13 2.023 18.517 2.576 C 18.189 1.789 17.705 0.827 17.281 0.077 C 17.249 0.022 17.187 -0.007 17.124 0.002 C 13.696 0.593 10.415 1.627 7.354 3.033 C 7.327 3.044 7.305 3.063 7.29 3.088 C 1.067 12.385 -0.638 21.453 0.198 30.409 C 0.202 30.453 0.227 30.495 0.261 30.521 C 4.366 33.536 8.343 35.367 12.247 36.58 C 12.309 36.599 12.375 36.576 12.415 36.525 C 13.338 35.264 14.161 33.934 14.867 32.536 C 14.909 32.454 14.869 32.357 14.784 32.325 C 13.478 31.83 12.235 31.226 11.039 30.54 C 10.945 30.485 10.937 30.35 11.024 30.285 C 11.276 30.096 11.528 29.9 11.768 29.702 C 11.811 29.666 11.872 29.658 11.923 29.681 C 19.779 33.268 28.283 33.268 36.046 29.681 C 36.097 29.656 36.158 29.664 36.203 29.7 C 36.443 29.898 36.695 30.096 36.948 30.285 C 37.035 30.35 37.03 30.485 36.935 30.54 C 35.739 31.239 34.496 31.83 33.189 32.323 C 33.104 32.355 33.066 32.454 33.108 32.536 C 33.829 33.932 34.652 35.262 35.558 36.523 C 35.596 36.576 35.664 36.599 35.726 36.58 C 39.648 35.367 43.625 33.536 47.731 30.521 C 47.767 30.495 47.79 30.454 47.793 30.411 C 48.794 20.057 46.117 11.063 40.696 3.09 C 40.683 3.063 40.661 3.044 40.634 3.033 Z M 16.04 24.956 C 13.675 24.956 11.726 22.784 11.726 20.118 C 11.726 17.451 13.637 15.28 16.04 15.28 C 18.462 15.28 20.392 17.47 20.354 20.118 C 20.354 22.784 18.443 24.956 16.04 24.956 Z M 31.989 24.956 C 29.625 24.956 27.676 22.784 27.676 20.118 C 27.676 17.451 29.587 15.28 31.989 15.28 C 34.411 15.28 36.341 17.47 36.303 20.118 C 36.303 22.784 34.411 24.956 31.989 24.956 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5.278)\"/>"
    },
    "SocialIconsPlatformDiscordColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 40.634 3.033 C 37.575 1.629 34.294 0.595 30.864 0.002 C 30.801 -0.009 30.739 0.02 30.707 0.077 C 30.285 0.827 29.817 1.806 29.49 2.576 C 25.801 2.023 22.13 2.023 18.517 2.576 C 18.189 1.789 17.705 0.827 17.281 0.077 C 17.249 0.022 17.187 -0.007 17.124 0.002 C 13.696 0.593 10.415 1.627 7.354 3.033 C 7.327 3.044 7.305 3.063 7.29 3.088 C 1.067 12.385 -0.638 21.453 0.198 30.409 C 0.202 30.453 0.227 30.495 0.261 30.521 C 4.366 33.536 8.343 35.367 12.247 36.58 C 12.309 36.599 12.375 36.576 12.415 36.525 C 13.338 35.264 14.161 33.934 14.867 32.536 C 14.909 32.454 14.869 32.357 14.784 32.325 C 13.478 31.83 12.235 31.226 11.039 30.54 C 10.945 30.485 10.937 30.35 11.024 30.285 C 11.276 30.096 11.528 29.9 11.768 29.702 C 11.811 29.666 11.872 29.658 11.923 29.681 C 19.779 33.268 28.283 33.268 36.046 29.681 C 36.097 29.656 36.158 29.664 36.203 29.7 C 36.443 29.898 36.695 30.096 36.948 30.285 C 37.035 30.35 37.03 30.485 36.935 30.54 C 35.739 31.239 34.496 31.83 33.189 32.323 C 33.104 32.355 33.066 32.454 33.108 32.536 C 33.829 33.932 34.652 35.262 35.558 36.523 C 35.596 36.576 35.664 36.599 35.726 36.58 C 39.648 35.367 43.625 33.536 47.731 30.521 C 47.767 30.495 47.79 30.454 47.793 30.411 C 48.794 20.057 46.117 11.063 40.696 3.09 C 40.683 3.063 40.661 3.044 40.634 3.033 Z M 16.04 24.956 C 13.675 24.956 11.726 22.784 11.726 20.118 C 11.726 17.451 13.637 15.28 16.04 15.28 C 18.462 15.28 20.392 17.47 20.354 20.118 C 20.354 22.784 18.443 24.956 16.04 24.956 Z M 31.989 24.956 C 29.625 24.956 27.676 22.784 27.676 20.118 C 27.676 17.451 29.587 15.28 31.989 15.28 C 34.411 15.28 36.341 17.47 36.303 20.118 C 36.303 22.784 34.411 24.956 31.989 24.956 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 5.278)\"/>"
    },
    "SocialIconsPlatformDribbbleColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24 0 C 10.742 0 0 10.75 0 23.996 C 0 36.587 9.714 46.922 22.053 47.913 L 22.053 48 L 24 48 C 37.258 48 48 37.25 48 24.004 C 48 10.759 37.259 0 24 0 Z M 29.303 43.4 C 27.798 43.811 26.221 44.051 24.597 44.098 L 24 44.098 C 21.291 44.098 18.707 43.562 16.348 42.589 C 18.632 34.359 24.824 28.464 31.912 25.829 C 33.135 31.757 32.247 38.109 29.303 43.4 Z M 30.833 22.08 C 22.743 24.994 15.678 31.557 12.84 40.716 C 7.447 37.11 3.893 30.965 3.893 23.996 C 3.893 21.524 4.34 19.157 5.157 16.969 C 7.591 18.182 10.193 19.04 12.87 19.517 C 16.28 20.142 19.773 20.121 23.173 19.508 C 25.108 19.159 26.997 18.602 28.809 17.861 C 29.615 19.201 30.293 20.614 30.833 22.08 Z M 35.665 24.758 C 36.834 30.153 36.479 35.871 34.613 41.081 C 40.148 37.634 43.885 31.572 44.097 24.628 C 41.346 24.129 38.477 24.19 35.665 24.758 Z M 43.826 20.642 C 40.779 20.214 37.646 20.353 34.585 21.007 C 33.982 19.316 33.221 17.687 32.315 16.14 C 34.829 14.687 37.126 12.859 39.1 10.728 C 41.515 13.473 43.193 16.881 43.826 20.642 Z M 13.558 15.685 C 11.233 15.271 8.974 14.525 6.867 13.472 C 8.679 10.528 11.229 8.087 14.26 6.405 L 14.283 6.413 L 14.284 6.413 L 14.284 6.413 L 14.284 6.413 C 14.614 6.517 14.93 6.616 15.233 6.725 C 15.345 6.768 15.455 6.809 15.562 6.85 L 15.564 6.851 L 15.564 6.851 L 15.564 6.851 C 16.056 7.037 16.495 7.204 16.863 7.374 L 16.967 7.427 L 16.992 7.438 C 17.224 7.546 17.558 7.705 17.859 7.849 C 18.019 7.925 18.17 7.997 18.291 8.054 L 18.296 8.057 C 18.397 8.111 18.482 8.157 18.561 8.204 C 18.626 8.246 18.683 8.28 18.714 8.298 C 18.771 8.331 18.829 8.364 18.877 8.39 C 18.917 8.413 18.958 8.435 18.988 8.452 L 19.003 8.46 L 19.035 8.478 L 19.039 8.48 C 19.083 8.506 19.138 8.537 19.199 8.572 C 19.332 8.647 19.499 8.743 19.683 8.85 C 19.812 8.926 19.933 8.999 20.032 9.06 C 20.106 9.106 20.146 9.132 20.161 9.142 L 20.162 9.143 C 20.168 9.147 20.17 9.148 20.167 9.146 L 20.252 9.211 L 20.347 9.267 C 20.492 9.353 20.634 9.451 20.812 9.574 L 20.812 9.574 L 20.812 9.574 L 20.813 9.575 C 20.894 9.631 20.983 9.692 21.082 9.76 L 21.15 9.806 L 21.207 9.838 C 21.207 9.838 21.21 9.84 21.215 9.844 C 21.231 9.854 21.268 9.88 21.334 9.926 C 21.434 9.998 21.556 10.089 21.689 10.189 L 21.848 10.309 C 21.929 10.37 22.012 10.432 22.082 10.485 C 22.174 10.554 22.288 10.638 22.39 10.709 C 23.884 11.852 25.25 13.157 26.466 14.595 C 25.172 15.068 23.839 15.432 22.481 15.677 C 19.522 16.211 16.5 16.225 13.568 15.687 L 13.563 15.686 L 13.558 15.685 Z M 24 3.893 C 28.615 3.893 32.867 5.449 36.26 8.065 C 34.481 9.99 32.397 11.629 30.116 12.912 C 28.548 10.919 26.734 9.124 24.711 7.583 L 24.662 7.546 L 24.611 7.512 L 24.597 7.502 C 24.586 7.495 24.572 7.484 24.554 7.471 C 24.516 7.444 24.47 7.409 24.414 7.368 C 24.351 7.321 24.288 7.273 24.221 7.222 L 24.22 7.222 L 24.206 7.211 C 24.151 7.17 24.093 7.126 24.03 7.078 C 23.892 6.974 23.74 6.862 23.602 6.762 C 23.505 6.693 23.365 6.594 23.223 6.507 L 23.132 6.445 L 23.132 6.445 L 23.132 6.445 C 22.946 6.316 22.668 6.124 22.415 5.968 C 22.179 5.803 21.86 5.614 21.65 5.491 C 21.448 5.373 21.23 5.248 21.094 5.171 L 21.093 5.17 L 20.991 5.112 C 20.965 5.097 20.943 5.085 20.934 5.08 L 20.933 5.079 L 20.881 5.05 L 20.863 5.04 C 20.833 5.024 20.802 5.007 20.771 4.989 C 20.735 4.969 20.706 4.953 20.685 4.94 L 20.67 4.93 L 20.618 4.899 C 20.431 4.784 20.237 4.68 20.131 4.623 L 20.129 4.622 L 20.092 4.603 L 20.047 4.578 L 20 4.556 C 19.907 4.512 19.77 4.447 19.614 4.373 C 21.026 4.058 22.493 3.893 24 3.893 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/>"
    },
    "SocialIconsPlatformDribbbleColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24 0 C 10.742 0 0 10.75 0 23.996 C 0 36.587 9.714 46.922 22.053 47.913 L 22.053 48 L 24 48 C 37.258 48 48 37.25 48 24.004 C 48 10.759 37.259 0 24 0 Z M 29.303 43.4 C 27.798 43.811 26.221 44.051 24.597 44.098 L 24 44.098 C 21.291 44.098 18.707 43.562 16.348 42.589 C 18.632 34.359 24.824 28.463 31.912 25.829 C 33.135 31.757 32.247 38.109 29.303 43.4 Z M 30.833 22.08 C 22.743 24.994 15.678 31.557 12.84 40.716 C 7.447 37.11 3.893 30.965 3.893 23.996 C 3.893 21.524 4.34 19.157 5.157 16.969 C 7.591 18.182 10.193 19.04 12.87 19.517 C 16.28 20.142 19.773 20.121 23.173 19.508 C 25.108 19.159 26.997 18.602 28.809 17.861 C 29.615 19.201 30.293 20.614 30.833 22.08 Z M 35.665 24.758 C 36.834 30.153 36.479 35.871 34.614 41.081 C 40.148 37.634 43.885 31.572 44.097 24.628 C 41.346 24.129 38.477 24.19 35.665 24.758 Z M 43.826 20.642 C 40.779 20.214 37.646 20.353 34.585 21.007 C 33.982 19.316 33.221 17.687 32.315 16.14 C 34.829 14.687 37.126 12.859 39.1 10.728 C 41.515 13.473 43.193 16.881 43.826 20.642 Z M 13.558 15.685 C 11.233 15.271 8.974 14.525 6.867 13.472 C 8.679 10.528 11.229 8.087 14.26 6.405 L 14.283 6.413 L 14.284 6.413 L 14.284 6.413 L 14.284 6.413 C 14.614 6.517 14.93 6.616 15.233 6.725 C 15.345 6.768 15.455 6.809 15.562 6.85 L 15.564 6.851 L 15.564 6.851 L 15.564 6.851 C 16.056 7.037 16.495 7.204 16.863 7.374 L 16.967 7.427 L 16.992 7.438 C 17.224 7.546 17.558 7.705 17.859 7.849 C 18.019 7.925 18.17 7.997 18.291 8.054 L 18.296 8.057 C 18.397 8.111 18.482 8.157 18.561 8.204 C 18.626 8.246 18.683 8.28 18.714 8.298 C 18.771 8.331 18.829 8.364 18.877 8.39 C 18.917 8.413 18.958 8.435 18.988 8.452 L 19.003 8.46 L 19.035 8.478 L 19.039 8.48 C 19.083 8.506 19.138 8.537 19.199 8.572 C 19.332 8.647 19.499 8.743 19.683 8.85 C 19.812 8.926 19.933 8.999 20.032 9.06 C 20.106 9.106 20.146 9.132 20.161 9.142 L 20.162 9.143 C 20.168 9.147 20.17 9.148 20.167 9.146 L 20.252 9.211 L 20.347 9.267 C 20.492 9.353 20.634 9.451 20.812 9.574 L 20.812 9.574 L 20.812 9.575 L 20.813 9.575 C 20.894 9.631 20.983 9.692 21.082 9.76 L 21.15 9.806 L 21.207 9.838 C 21.207 9.838 21.208 9.839 21.21 9.84 C 21.211 9.841 21.213 9.842 21.215 9.844 C 21.231 9.854 21.268 9.88 21.334 9.926 C 21.434 9.998 21.556 10.089 21.689 10.189 L 21.848 10.309 C 21.929 10.37 22.012 10.432 22.082 10.485 C 22.174 10.554 22.288 10.638 22.39 10.709 C 23.884 11.852 25.25 13.157 26.466 14.595 C 25.172 15.068 23.839 15.432 22.481 15.677 C 19.522 16.211 16.5 16.225 13.568 15.687 L 13.563 15.686 L 13.558 15.685 Z M 24 3.893 C 28.615 3.893 32.867 5.449 36.26 8.065 C 34.481 9.99 32.397 11.629 30.116 12.912 C 28.548 10.919 26.734 9.124 24.711 7.583 L 24.662 7.546 L 24.611 7.512 L 24.597 7.502 C 24.586 7.495 24.572 7.484 24.554 7.471 C 24.516 7.444 24.47 7.41 24.414 7.368 C 24.351 7.321 24.288 7.273 24.221 7.222 L 24.22 7.222 L 24.206 7.211 C 24.151 7.17 24.093 7.126 24.03 7.078 C 23.892 6.974 23.74 6.862 23.602 6.762 C 23.505 6.693 23.365 6.594 23.223 6.507 L 23.132 6.445 L 23.132 6.445 L 23.132 6.445 C 22.946 6.316 22.668 6.124 22.415 5.968 C 22.179 5.803 21.86 5.614 21.65 5.491 C 21.448 5.373 21.23 5.248 21.094 5.171 L 21.093 5.17 L 20.991 5.112 C 20.966 5.097 20.944 5.085 20.935 5.08 L 20.935 5.08 L 20.934 5.08 L 20.933 5.079 L 20.881 5.05 L 20.863 5.04 C 20.833 5.024 20.802 5.007 20.771 4.989 C 20.735 4.969 20.706 4.953 20.685 4.941 L 20.67 4.93 L 20.618 4.899 C 20.431 4.784 20.237 4.68 20.131 4.623 L 20.129 4.622 L 20.092 4.603 L 20.047 4.578 L 20 4.556 C 19.907 4.512 19.77 4.447 19.614 4.373 C 21.026 4.058 22.493 3.893 24 3.893 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/>"
    },
    "SocialIconsPlatformFacebookColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24 0 C 10.745 0 0 10.745 0 24 C 0 35.255 7.749 44.7 18.203 47.293 L 18.203 31.334 L 13.254 31.334 L 13.254 24 L 18.203 24 L 18.203 20.84 C 18.203 12.671 21.9 8.885 29.919 8.885 C 31.44 8.885 34.064 9.183 35.137 9.481 L 35.137 16.129 C 34.571 16.069 33.587 16.04 32.364 16.04 C 28.429 16.04 26.909 17.531 26.909 21.406 L 26.909 24 L 34.748 24 L 33.401 31.334 L 26.909 31.334 L 26.909 47.824 C 38.793 46.389 48.001 36.271 48.001 24 C 48 10.745 37.255 0 24 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/>"
    },
    "SocialIconsPlatformFacebookColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 48 24 C 48 10.745 37.255 0 24 0 C 10.745 0 0 10.745 0 24 C 0 35.255 7.749 44.7 18.203 47.293 L 18.203 31.334 L 13.254 31.334 L 13.254 24 L 18.203 24 L 18.203 20.84 C 18.203 12.671 21.9 8.885 29.919 8.885 C 31.44 8.885 34.064 9.183 35.137 9.481 L 35.137 16.129 C 34.571 16.069 33.587 16.04 32.364 16.04 C 28.429 16.04 26.909 17.531 26.909 21.406 L 26.909 24 L 34.748 24 L 33.401 31.334 L 26.909 31.334 L 26.909 47.824 C 38.793 46.389 48.001 36.271 48.001 24 L 48 24 Z\" fill=\"rgb(8,102,255)\" fill-rule=\"nonzero\"/><path d=\"M 20.148 22.45 L 21.494 15.115 L 13.655 15.115 L 13.655 12.521 C 13.655 8.646 15.176 7.155 19.111 7.155 C 20.333 7.155 21.317 7.185 21.883 7.244 L 21.883 0.596 C 20.81 0.298 18.186 0 16.666 0 C 8.646 0 4.949 3.786 4.949 11.955 L 4.949 15.115 L 0 15.115 L 0 22.45 L 4.949 22.45 L 4.949 38.409 C 6.805 38.869 8.748 39.115 10.746 39.115 C 11.73 39.115 12.701 39.055 13.654 38.94 L 13.654 22.45 L 20.147 22.45 L 20.148 22.45 Z\" fill=\"rgb(255,255,255)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 13.253 8.885)\"/>"
    },
    "SocialIconsPlatformFigmaColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 8.64 0 L 24 0 C 28.769 0 32.64 3.871 32.64 8.64 C 32.64 11.982 30.739 14.883 27.96 16.32 C 30.739 17.757 32.64 20.658 32.64 24 C 32.64 28.77 28.769 32.64 24 32.64 C 21.287 32.64 18.865 31.388 17.28 29.43 L 17.28 39.36 C 17.28 44.13 13.41 48 8.64 48 C 3.871 48 0 44.13 0 39.36 C 0 36.018 1.901 33.117 4.68 31.68 C 1.901 30.243 0 27.342 0 24 C 0 20.658 1.901 17.757 4.68 16.32 C 1.901 14.883 0 11.982 0 8.64 C 0 3.871 3.871 0 8.64 0 Z M 1.92 8.64 C 1.92 4.931 4.931 1.92 8.64 1.92 L 15.36 1.92 L 15.36 15.36 L 8.64 15.36 L 8.619 15.36 C 4.92 15.349 1.92 12.342 1.92 8.64 Z M 15.36 23.909 C 15.36 23.939 15.36 23.969 15.36 24 C 15.36 24.03 15.36 24.061 15.36 24.091 L 15.36 30.72 L 8.64 30.72 C 4.931 30.72 1.92 27.709 1.92 24 C 1.92 20.298 4.92 17.291 8.619 17.28 L 8.64 17.28 L 15.36 17.28 L 15.36 23.909 Z M 17.28 24.08 L 17.28 23.919 C 17.323 20.256 20.303 17.295 23.972 17.28 L 24 17.28 C 24.007 17.28 24.014 17.28 24.021 17.28 C 27.72 17.291 30.72 20.298 30.72 24 C 30.72 27.709 27.709 30.72 24 30.72 C 20.318 30.72 17.323 27.753 17.28 24.08 Z M 18.571 17.28 C 18.096 17.663 17.664 18.096 17.28 18.57 L 17.28 17.28 L 18.571 17.28 Z M 24.021 15.36 C 24.014 15.36 24.007 15.36 24 15.36 C 23.989 15.36 23.979 15.36 23.968 15.36 L 17.28 15.36 L 17.28 1.92 L 24 1.92 C 27.709 1.92 30.72 4.931 30.72 8.64 C 30.72 12.342 27.72 15.349 24.021 15.36 Z M 8.64 32.64 C 4.931 32.64 1.92 35.651 1.92 39.36 C 1.92 43.069 4.931 46.08 8.64 46.08 C 12.349 46.08 15.36 43.069 15.36 39.36 L 15.36 32.64 L 8.64 32.64 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 7.680 0)\"/>"
    },
    "SocialIconsPlatformFigmaColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 8 16 C 12.416 16 16 12.416 16 8 L 16 0 L 8 0 C 3.584 0 0 3.584 0 8 C 0 12.416 3.584 16 8 16 Z\" fill=\"rgb(10,207,131)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 8 32.000)\"/><path d=\"M 0 8 C 0 3.584 3.584 0 8 0 L 16 0 L 16 16 L 8 16 C 3.584 16 0 12.416 0 8 Z\" fill=\"rgb(162,89,255)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 8 16)\"/><path d=\"M 0 8 C 0 3.584 3.584 0 8 0 L 16 0 L 16 16 L 8 16 C 3.584 16 0 12.416 0 8 Z\" fill=\"rgb(242,78,30)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 8 0)\"/><path d=\"M 0 0 L 8 0 C 12.416 0 16 3.584 16 8 C 16 12.416 12.416 16 8 16 L 0 16 L 0 0 Z\" fill=\"rgb(255,114,98)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 24.000 0)\"/><path d=\"M 16 8 C 16 12.416 12.416 16 8 16 C 3.584 16 0 12.416 0 8 C 0 3.584 3.584 0 8 0 C 12.416 0 16 3.584 16 8 Z\" fill=\"rgb(26,188,254)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 24.000 16)\"/>"
    },
    "SocialIconsPlatformGithubColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24.02 0 C 10.737 0 0 10.817 0 24.198 C 0 34.895 6.88 43.95 16.424 47.154 C 17.617 47.395 18.054 46.634 18.054 45.993 C 18.054 45.432 18.015 43.509 18.015 41.505 C 11.333 42.948 9.942 38.621 9.942 38.621 C 8.868 35.816 7.277 35.096 7.277 35.096 C 5.09 33.613 7.436 33.613 7.436 33.613 C 9.862 33.774 11.135 36.097 11.135 36.097 C 13.282 39.783 16.742 38.741 18.134 38.1 C 18.333 36.538 18.969 35.456 19.646 34.855 C 14.316 34.294 8.709 32.211 8.709 22.916 C 8.709 20.272 9.663 18.109 11.175 16.426 C 10.936 15.825 10.101 13.341 11.414 10.016 C 11.414 10.016 13.442 9.375 18.015 12.5 C 19.973 11.97 21.992 11.7 24.02 11.698 C 26.048 11.698 28.115 11.979 30.025 12.5 C 34.598 9.375 36.626 10.016 36.626 10.016 C 37.939 13.341 37.103 15.825 36.865 16.426 C 38.416 18.109 39.33 20.272 39.33 22.916 C 39.33 32.211 33.723 34.254 28.354 34.855 C 29.23 35.616 29.985 37.058 29.985 39.342 C 29.985 42.587 29.945 45.191 29.945 45.992 C 29.945 46.634 30.383 47.395 31.576 47.155 C 41.12 43.949 48 34.895 48 24.198 C 48.039 10.817 37.262 0 24.02 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/>"
    },
    "SocialIconsPlatformGithubColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24.02 0 C 10.737 0 0 10.817 0 24.198 C 0 34.895 6.88 43.95 16.424 47.154 C 17.617 47.395 18.054 46.634 18.054 45.993 C 18.054 45.432 18.015 43.509 18.015 41.505 C 11.333 42.948 9.942 38.621 9.942 38.621 C 8.868 35.816 7.277 35.096 7.277 35.096 C 5.09 33.613 7.436 33.613 7.436 33.613 C 9.862 33.774 11.135 36.097 11.135 36.097 C 13.282 39.783 16.742 38.741 18.134 38.1 C 18.333 36.538 18.969 35.456 19.646 34.855 C 14.316 34.294 8.709 32.211 8.709 22.916 C 8.709 20.272 9.663 18.109 11.175 16.426 C 10.936 15.825 10.101 13.341 11.414 10.016 C 11.414 10.016 13.442 9.375 18.015 12.5 C 19.973 11.97 21.992 11.7 24.02 11.698 C 26.048 11.698 28.115 11.979 30.025 12.5 C 34.598 9.375 36.626 10.016 36.626 10.016 C 37.939 13.341 37.103 15.825 36.865 16.426 C 38.416 18.109 39.33 20.272 39.33 22.916 C 39.33 32.211 33.723 34.254 28.354 34.855 C 29.23 35.616 29.985 37.058 29.985 39.342 C 29.985 42.587 29.945 45.191 29.945 45.992 C 29.945 46.634 30.383 47.395 31.576 47.155 C 41.12 43.949 48 34.895 48 24.198 C 48.039 10.817 37.262 0 24.02 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/>"
    },
    "SocialIconsPlatformGoogleColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 0 0 L 0 9.295 L 12.916 9.295 C 12.349 12.284 10.647 14.815 8.094 16.516 L 15.883 22.56 C 20.422 18.371 23.04 12.218 23.04 4.909 C 23.04 3.208 22.887 1.571 22.603 0 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 24.000 19.636)\"/><path d=\"M 7.975 0 L 6.218 1.345 L 0 6.188 C 3.949 14.021 12.043 19.432 21.425 19.432 C 27.905 19.432 33.337 17.294 37.308 13.628 L 29.519 7.585 C 27.381 9.025 24.654 9.898 21.425 9.898 C 15.185 9.898 9.883 5.687 7.985 0.014 L 7.975 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.574 28.568)\"/><path d=\"M 2.574 0 C 0.938 3.229 0 6.873 0 10.756 C 0 14.64 0.938 18.283 2.574 21.512 C 2.574 21.534 10.56 15.316 10.56 15.316 C 10.08 13.876 9.796 12.349 9.796 10.756 C 9.796 9.163 10.08 7.636 10.56 6.196 L 2.574 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 13.244)\"/><path d=\"M 21.425 9.556 C 24.96 9.556 28.102 10.778 30.611 13.135 L 37.483 6.262 C 33.316 2.378 27.905 0 21.425 0 C 12.044 0 3.949 5.389 0 13.244 L 7.985 19.44 C 9.883 13.767 15.185 9.556 21.425 9.556 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.574 0)\"/>"
    },
    "SocialIconsPlatformGoogleColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 0 0 L 0 9.295 L 12.916 9.295 C 12.349 12.284 10.647 14.815 8.094 16.516 L 15.883 22.56 C 20.422 18.371 23.04 12.218 23.04 4.909 C 23.04 3.208 22.887 1.571 22.603 0 L 0 0 Z\" fill=\"rgb(66,133,244)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 24.000 19.636)\"/><path d=\"M 7.975 0 L 6.218 1.345 L 0 6.188 C 3.949 14.021 12.043 19.432 21.425 19.432 C 27.905 19.432 33.337 17.294 37.308 13.628 L 29.519 7.585 C 27.381 9.025 24.654 9.898 21.425 9.898 C 15.185 9.898 9.883 5.687 7.985 0.014 L 7.975 0 Z\" fill=\"rgb(52,168,83)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.574 28.568)\"/><path d=\"M 2.574 0 C 0.938 3.229 0 6.873 0 10.756 C 0 14.64 0.938 18.283 2.574 21.512 C 2.574 21.534 10.56 15.316 10.56 15.316 C 10.08 13.876 9.796 12.349 9.796 10.756 C 9.796 9.163 10.08 7.636 10.56 6.196 L 2.574 0 Z\" fill=\"rgb(251,188,5)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 13.244)\"/><path d=\"M 21.425 9.556 C 24.96 9.556 28.102 10.778 30.611 13.135 L 37.483 6.262 C 33.316 2.378 27.905 0 21.425 0 C 12.044 0 3.949 5.389 0 13.244 L 7.985 19.44 C 9.883 13.767 15.185 9.556 21.425 9.556 Z\" fill=\"rgb(234,67,53)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.574 0)\"/>"
    },
    "SocialIconsPlatformInstagramColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24 4.322 C 30.413 4.322 31.172 4.35 33.694 4.462 C 36.038 4.566 37.303 4.959 38.147 5.288 C 39.263 5.719 40.069 6.244 40.903 7.078 C 41.747 7.922 42.263 8.719 42.694 9.834 C 43.022 10.678 43.416 11.953 43.519 14.287 C 43.631 16.819 43.659 17.578 43.659 23.981 C 43.659 30.394 43.631 31.153 43.519 33.675 C 43.416 36.019 43.022 37.284 42.694 38.128 C 42.263 39.244 41.737 40.05 40.903 40.884 C 40.059 41.728 39.263 42.244 38.147 42.675 C 37.303 43.003 36.028 43.397 33.694 43.5 C 31.163 43.612 30.403 43.641 24 43.641 C 17.588 43.641 16.828 43.612 14.306 43.5 C 11.963 43.397 10.697 43.003 9.853 42.675 C 8.738 42.244 7.931 41.719 7.097 40.884 C 6.253 40.041 5.738 39.244 5.306 38.128 C 4.978 37.284 4.584 36.009 4.481 33.675 C 4.369 31.144 4.341 30.384 4.341 23.981 C 4.341 17.569 4.369 16.809 4.481 14.287 C 4.584 11.944 4.978 10.678 5.306 9.834 C 5.738 8.719 6.263 7.912 7.097 7.078 C 7.941 6.234 8.738 5.719 9.853 5.288 C 10.697 4.959 11.972 4.566 14.306 4.462 C 16.828 4.35 17.588 4.322 24 4.322 Z M 24 0 C 17.484 0 16.669 0.028 14.109 0.141 C 11.559 0.253 9.806 0.666 8.288 1.256 C 6.703 1.875 5.363 2.691 4.031 4.031 C 2.691 5.363 1.875 6.703 1.256 8.278 C 0.666 9.806 0.253 11.55 0.141 14.1 C 0.028 16.669 0 17.484 0 24 C 0 30.516 0.028 31.331 0.141 33.891 C 0.253 36.441 0.666 38.194 1.256 39.713 C 1.875 41.297 2.691 42.638 4.031 43.969 C 5.363 45.3 6.703 46.125 8.278 46.734 C 9.806 47.325 11.55 47.737 14.1 47.85 C 16.659 47.962 17.475 47.991 23.991 47.991 C 30.506 47.991 31.322 47.962 33.881 47.85 C 36.431 47.737 38.184 47.325 39.703 46.734 C 41.278 46.125 42.619 45.3 43.95 43.969 C 45.281 42.638 46.106 41.297 46.716 39.722 C 47.306 38.194 47.719 36.45 47.831 33.9 C 47.944 31.341 47.972 30.525 47.972 24.009 C 47.972 17.494 47.944 16.678 47.831 14.119 C 47.719 11.569 47.306 9.816 46.716 8.297 C 46.125 6.703 45.309 5.363 43.969 4.031 C 42.638 2.7 41.297 1.875 39.722 1.266 C 38.194 0.675 36.45 0.263 33.9 0.15 C 31.331 0.028 30.516 0 24 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/><path d=\"M 12.328 0 C 5.522 0 0 5.522 0 12.328 C 0 19.134 5.522 24.656 12.328 24.656 C 19.134 24.656 24.656 19.134 24.656 12.328 C 24.656 5.522 19.134 0 12.328 0 Z M 12.328 20.325 C 7.913 20.325 4.331 16.744 4.331 12.328 C 4.331 7.913 7.913 4.331 12.328 4.331 C 16.744 4.331 20.325 7.913 20.325 12.328 C 20.325 16.744 16.744 20.325 12.328 20.325 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 11.672 11.672)\"/><path d=\"M 5.756 2.878 C 5.756 4.472 4.463 5.756 2.878 5.756 C 1.284 5.756 0 4.463 0 2.878 C 0 1.284 1.294 0 2.878 0 C 4.463 0 5.756 1.294 5.756 2.878 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 33.938 8.306)\"/>"
    },
    "SocialIconsPlatformInstagramColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24 4.322 C 30.413 4.322 31.172 4.35 33.694 4.462 C 36.038 4.566 37.303 4.959 38.147 5.288 C 39.263 5.719 40.069 6.244 40.903 7.078 C 41.747 7.922 42.263 8.719 42.694 9.834 C 43.022 10.678 43.416 11.953 43.519 14.287 C 43.631 16.819 43.659 17.578 43.659 23.981 C 43.659 30.394 43.631 31.153 43.519 33.675 C 43.416 36.019 43.022 37.284 42.694 38.128 C 42.263 39.244 41.737 40.05 40.903 40.884 C 40.059 41.728 39.263 42.244 38.147 42.675 C 37.303 43.003 36.028 43.397 33.694 43.5 C 31.163 43.612 30.403 43.641 24 43.641 C 17.588 43.641 16.828 43.612 14.306 43.5 C 11.963 43.397 10.697 43.003 9.853 42.675 C 8.738 42.244 7.931 41.719 7.097 40.884 C 6.253 40.041 5.738 39.244 5.306 38.128 C 4.978 37.284 4.584 36.009 4.481 33.675 C 4.369 31.144 4.341 30.384 4.341 23.981 C 4.341 17.569 4.369 16.809 4.481 14.287 C 4.584 11.944 4.978 10.678 5.306 9.834 C 5.738 8.719 6.263 7.912 7.097 7.078 C 7.941 6.234 8.738 5.719 9.853 5.288 C 10.697 4.959 11.972 4.566 14.306 4.462 C 16.828 4.35 17.588 4.322 24 4.322 Z M 24 0 C 17.484 0 16.669 0.028 14.109 0.141 C 11.559 0.253 9.806 0.666 8.288 1.256 C 6.703 1.875 5.363 2.691 4.031 4.031 C 2.691 5.363 1.875 6.703 1.256 8.278 C 0.666 9.806 0.253 11.55 0.141 14.1 C 0.028 16.669 0 17.484 0 24 C 0 30.516 0.028 31.331 0.141 33.891 C 0.253 36.441 0.666 38.194 1.256 39.713 C 1.875 41.297 2.691 42.638 4.031 43.969 C 5.363 45.3 6.703 46.125 8.278 46.734 C 9.806 47.325 11.55 47.737 14.1 47.85 C 16.659 47.962 17.475 47.991 23.991 47.991 C 30.506 47.991 31.322 47.962 33.881 47.85 C 36.431 47.737 38.184 47.325 39.703 46.734 C 41.278 46.125 42.619 45.3 43.95 43.969 C 45.281 42.638 46.106 41.297 46.716 39.722 C 47.306 38.194 47.719 36.45 47.831 33.9 C 47.944 31.341 47.972 30.525 47.972 24.009 C 47.972 17.494 47.944 16.678 47.831 14.119 C 47.719 11.569 47.306 9.816 46.716 8.297 C 46.125 6.703 45.309 5.363 43.969 4.031 C 42.638 2.7 41.297 1.875 39.722 1.266 C 38.194 0.675 36.45 0.263 33.9 0.15 C 31.331 0.028 30.516 0 24 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/><path d=\"M 12.328 0 C 5.522 0 0 5.522 0 12.328 C 0 19.134 5.522 24.656 12.328 24.656 C 19.134 24.656 24.656 19.134 24.656 12.328 C 24.656 5.522 19.134 0 12.328 0 Z M 12.328 20.325 C 7.913 20.325 4.331 16.744 4.331 12.328 C 4.331 7.913 7.913 4.331 12.328 4.331 C 16.744 4.331 20.325 7.913 20.325 12.328 C 20.325 16.744 16.744 20.325 12.328 20.325 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 11.672 11.672)\"/><path d=\"M 5.756 2.878 C 5.756 4.472 4.463 5.756 2.878 5.756 C 1.284 5.756 0 4.463 0 2.878 C 0 1.284 1.294 0 2.878 0 C 4.463 0 5.756 1.294 5.756 2.878 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 33.938 8.306)\"/>"
    },
    "SocialIconsPlatformLinkedInColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 44.447 0 L 3.544 0 C 1.584 0 0 1.547 0 3.459 L 0 44.531 C 0 46.444 1.584 48 3.544 48 L 44.447 48 C 46.406 48 48 46.444 48 44.541 L 48 3.459 C 48 1.547 46.406 0 44.447 0 Z M 14.241 40.903 L 7.116 40.903 L 7.116 17.991 L 14.241 17.991 L 14.241 40.903 Z M 10.678 14.869 C 8.391 14.869 6.544 13.022 6.544 10.744 C 6.544 8.466 8.391 6.619 10.678 6.619 C 12.956 6.619 14.803 8.466 14.803 10.744 C 14.803 13.012 12.956 14.869 10.678 14.869 Z M 40.903 40.903 L 33.787 40.903 L 33.787 29.766 C 33.787 27.112 33.741 23.691 30.084 23.691 C 26.381 23.691 25.819 26.587 25.819 29.578 L 25.819 40.903 L 18.713 40.903 L 18.713 17.991 L 25.537 17.991 L 25.537 21.122 L 25.631 21.122 C 26.578 19.322 28.903 17.419 32.363 17.419 C 39.572 17.419 40.903 22.163 40.903 28.331 L 40.903 40.903 L 40.903 40.903 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/>"
    },
    "SocialIconsPlatformLinkedInColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 44.457 0 L 3.543 0 C 2.604 0 1.702 0.373 1.038 1.038 C 0.373 1.702 0 2.604 0 3.543 L 0 44.457 C 0 45.396 0.373 46.298 1.038 46.962 C 1.702 47.627 2.604 48 3.543 48 L 44.457 48 C 45.396 48 46.298 47.627 46.962 46.962 C 47.627 46.298 48 45.396 48 44.457 L 48 3.543 C 48 2.604 47.627 1.702 46.962 1.038 C 46.298 0.373 45.396 0 44.457 0 Z M 14.307 40.89 L 7.09 40.89 L 7.09 17.967 L 14.307 17.967 L 14.307 40.89 Z M 10.693 14.79 C 9.875 14.785 9.076 14.538 8.397 14.08 C 7.719 13.622 7.192 12.973 6.882 12.215 C 6.572 11.458 6.493 10.625 6.656 9.823 C 6.819 9.021 7.216 8.285 7.796 7.708 C 8.377 7.131 9.116 6.739 9.919 6.581 C 10.722 6.423 11.554 6.507 12.31 6.822 C 13.066 7.137 13.711 7.668 14.165 8.35 C 14.619 9.031 14.861 9.831 14.86 10.65 C 14.868 11.198 14.765 11.742 14.558 12.25 C 14.351 12.757 14.044 13.218 13.655 13.604 C 13.266 13.99 12.804 14.295 12.295 14.498 C 11.786 14.702 11.241 14.801 10.693 14.79 Z M 40.907 40.91 L 33.693 40.91 L 33.693 28.387 C 33.693 24.693 32.123 23.553 30.097 23.553 C 27.957 23.553 25.857 25.167 25.857 28.48 L 25.857 40.91 L 18.64 40.91 L 18.64 17.983 L 25.58 17.983 L 25.58 21.16 L 25.673 21.16 C 26.37 19.75 28.81 17.34 32.533 17.34 C 36.56 17.34 40.91 19.73 40.91 26.73 L 40.907 40.91 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/>"
    },
    "SocialIconsPlatformMediumColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 4.761 11.517 C 4.761 17.875 3.695 23.033 2.38 23.033 C 1.065 23.033 0 17.877 0 11.517 C 0 5.156 1.066 0 2.38 0 C 3.695 0 4.761 5.156 4.761 11.517 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 43.239 12.139)\"/><path d=\"M 13.538 12.856 C 13.538 19.954 10.507 25.711 6.769 25.711 C 3.031 25.711 0 19.954 0 12.856 C 0 5.757 3.03 0 6.768 0 C 10.507 0 13.537 5.755 13.537 12.856\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 28.388 10.800)\"/><path d=\"M 27.075 13.655 C 27.075 21.197 21.014 27.31 13.538 27.31 C 6.061 27.31 0 21.195 0 13.655 C 0 6.115 6.061 0 13.538 0 C 21.014 0 27.075 6.114 27.075 13.655 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 10)\"/>"
    },
    "SocialIconsPlatformMediumColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 4.761 11.517 C 4.761 17.875 3.695 23.033 2.38 23.033 C 1.065 23.033 0 17.877 0 11.517 C 0 5.156 1.066 0 2.38 0 C 3.695 0 4.761 5.156 4.761 11.517 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 43.239 12.139)\"/><path d=\"M 13.538 12.856 C 13.538 19.954 10.507 25.711 6.769 25.711 C 3.031 25.711 0 19.954 0 12.856 C 0 5.757 3.03 0 6.768 0 C 10.507 0 13.537 5.755 13.537 12.856\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 28.388 10.800)\"/><path d=\"M 27.075 13.655 C 27.075 21.197 21.014 27.31 13.538 27.31 C 6.061 27.31 0 21.195 0 13.655 C 0 6.115 6.061 0 13.538 0 C 21.014 0 27.075 6.114 27.075 13.655 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 10)\"/>"
    },
    "SocialIconsPlatformMessengerColorNegative": {
      viewBox: "0 0 48 48.001",
      body: "<path d=\"M 23.904 0 C 10.439 0 0 9.864 0 23.187 C 0 30.157 2.856 36.178 7.507 40.338 C 7.898 40.687 8.133 41.178 8.149 41.701 L 8.28 45.954 C 8.321 47.31 9.722 48.192 10.963 47.644 L 15.707 45.549 C 16.11 45.372 16.56 45.339 16.984 45.457 C 19.165 46.056 21.484 46.375 23.903 46.375 C 37.369 46.375 47.808 36.512 47.808 23.188 C 47.808 9.865 37.37 0 23.904 0 Z M 38.717 17 L 30.395 29.862 C 29.972 30.515 29.101 30.702 28.448 30.279 L 20.738 25.291 C 20.44 25.098 20.054 25.103 19.761 25.305 L 11.072 31.298 C 9.804 32.172 8.254 30.668 9.09 29.376 L 17.414 16.513 C 17.836 15.86 18.708 15.674 19.36 16.096 L 27.071 21.086 C 27.37 21.279 27.756 21.273 28.048 21.071 L 36.736 15.079 C 38.004 14.204 39.554 15.709 38.717 17.002 L 38.717 17 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0.096 0.096)\"/>"
    },
    "SocialIconsPlatformMessengerColorOriginal": {
      viewBox: "0 0 48 48.001",
      body: "<path d=\"M 48 23.28 C 48 36.657 37.52 46.56 24 46.56 C 21.572 46.56 19.242 46.239 17.052 45.637 C 16.627 45.519 16.175 45.553 15.771 45.731 L 11.007 47.834 C 9.761 48.384 8.355 47.498 8.314 46.137 L 8.183 41.867 C 8.167 41.34 7.931 40.849 7.538 40.499 C 2.868 36.323 0 30.277 0 23.28 C 0 9.903 10.48 0 24 0 C 37.52 0 48 9.903 48 23.28 Z\" fill=\"rgb(8,102,255)\" fill-rule=\"nonzero\"/><path d=\"M 21.627 15.106 L 29.983 2.192 C 30.823 0.894 29.267 -0.617 27.994 0.261 L 19.272 6.278 C 18.978 6.48 18.59 6.486 18.291 6.292 L 10.548 1.283 C 9.893 0.859 9.018 1.047 8.595 1.701 L 0.238 14.615 C -0.602 15.913 0.954 17.424 2.227 16.546 L 10.951 10.528 C 11.245 10.326 11.633 10.32 11.933 10.514 L 19.673 15.522 C 20.329 15.947 21.203 15.759 21.627 15.104 L 21.627 15.106 Z\" fill=\"rgb(255,255,255)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 8.889 14.876)\"/>"
    },
    "SocialIconsPlatformPinterestColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24 0 C 10.744 0 0 10.744 0 24 C 0 34.172 6.328 42.853 15.253 46.35 C 15.047 44.447 14.85 41.541 15.338 39.469 C 15.778 37.594 18.15 27.544 18.15 27.544 C 18.15 27.544 17.428 26.109 17.428 23.981 C 17.428 20.644 19.359 18.15 21.769 18.15 C 23.813 18.15 24.806 19.688 24.806 21.534 C 24.806 23.597 23.494 26.672 22.819 29.522 C 22.256 31.912 24.019 33.863 26.372 33.863 C 30.637 33.863 33.919 29.362 33.919 22.875 C 33.919 17.128 29.794 13.106 23.897 13.106 C 17.072 13.106 13.059 18.225 13.059 23.522 C 13.059 25.584 13.856 27.797 14.85 28.997 C 15.047 29.231 15.075 29.447 15.019 29.681 C 14.841 30.441 14.428 32.072 14.353 32.4 C 14.25 32.841 14.006 32.934 13.547 32.719 C 10.547 31.322 8.672 26.944 8.672 23.419 C 8.672 15.844 14.175 8.897 24.525 8.897 C 32.85 8.897 39.319 14.831 39.319 22.763 C 39.319 31.031 34.106 37.688 26.869 37.688 C 24.441 37.688 22.153 36.422 21.366 34.931 C 21.366 34.931 20.166 39.516 19.875 40.641 C 19.331 42.722 17.869 45.338 16.894 46.931 C 19.144 47.625 21.525 48 24 48 C 37.256 48 48 37.256 48 24 C 48 10.744 37.256 0 24 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/>"
    },
    "SocialIconsPlatformPinterestColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24 48 C 37.255 48 48 37.255 48 24 C 48 10.745 37.255 0 24 0 C 10.745 0 0 10.745 0 24 C 0 37.255 10.745 48 24 48 Z\" fill=\"rgb(255,255,255)\" fill-rule=\"nonzero\"/><path d=\"M 24 0 C 10.746 0 0 10.746 0 24 C 0 34.173 6.321 42.864 15.249 46.36 C 15.032 44.464 14.854 41.541 15.328 39.467 C 15.763 37.59 18.133 27.536 18.133 27.536 C 18.133 27.536 17.422 26.094 17.422 23.98 C 17.422 20.642 19.358 18.153 21.768 18.153 C 23.822 18.153 24.81 19.694 24.81 21.531 C 24.81 23.585 23.506 26.667 22.815 29.531 C 22.242 31.921 24.02 33.877 26.37 33.877 C 30.637 33.877 33.916 29.373 33.916 22.894 C 33.916 17.146 29.788 13.136 23.881 13.136 C 17.047 13.136 13.037 18.252 13.037 23.546 C 13.037 25.6 13.827 27.812 14.815 29.017 C 15.012 29.254 15.032 29.472 14.973 29.709 C 14.795 30.459 14.38 32.099 14.301 32.435 C 14.202 32.869 13.946 32.968 13.491 32.751 C 10.489 31.348 8.612 26.983 8.612 23.447 C 8.612 15.881 14.104 8.928 24.474 8.928 C 32.79 8.928 39.269 14.854 39.269 22.795 C 39.269 31.072 34.054 37.728 26.825 37.728 C 24.395 37.728 22.104 36.464 21.333 34.963 C 21.333 34.963 20.128 39.546 19.832 40.672 C 19.299 42.765 17.837 45.373 16.849 46.973 C 19.101 47.664 21.472 48.04 23.96 48.04 C 37.215 48.04 47.96 37.294 47.96 24.04 C 48 10.746 37.254 0 24 0 Z\" fill=\"rgb(230,0,25)\" fill-rule=\"nonzero\"/>"
    },
    "SocialIconsPlatformRedditColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24.094 4.92 C 24.51 6.684 26.094 7.999 27.986 7.999 C 30.195 7.999 31.986 6.208 31.986 3.999 C 31.986 1.791 30.195 0 27.986 0 C 26.055 0 24.444 1.369 24.069 3.189 C 20.835 3.536 18.309 6.279 18.309 9.604 C 18.309 9.611 18.309 9.617 18.309 9.624 C 14.792 9.773 11.58 10.774 9.03 12.354 C 8.083 11.621 6.894 11.184 5.604 11.184 C 2.509 11.184 0 13.693 0 16.789 C 0 19.035 1.32 20.97 3.227 21.864 C 3.413 28.371 10.502 33.604 19.223 33.604 C 27.943 33.604 35.042 28.365 35.218 21.853 C 37.11 20.953 38.419 19.024 38.419 16.791 C 38.419 13.695 35.91 11.186 32.814 11.186 C 31.53 11.186 30.347 11.619 29.402 12.347 C 26.829 10.755 23.582 9.754 20.029 9.621 C 20.029 9.615 20.029 9.611 20.029 9.606 C 20.029 7.224 21.799 5.248 24.094 4.924 L 24.094 4.92 Z M 8.805 20.346 C 8.899 18.313 10.249 16.753 11.818 16.753 C 13.388 16.753 14.588 18.401 14.494 20.434 C 14.4 22.466 13.228 23.205 11.657 23.205 C 10.086 23.205 8.711 22.378 8.805 20.346 Z M 26.629 16.753 C 28.2 16.753 29.55 18.313 29.642 20.346 C 29.736 22.378 28.359 23.205 26.79 23.205 C 25.221 23.205 24.047 22.468 23.953 20.434 C 23.859 18.401 25.058 16.753 26.629 16.753 Z M 24.761 25.048 C 25.056 25.078 25.243 25.384 25.129 25.658 C 24.163 27.966 21.883 29.588 19.223 29.588 C 16.562 29.588 14.284 27.966 13.316 25.658 C 13.202 25.384 13.389 25.078 13.684 25.048 C 15.409 24.874 17.274 24.778 19.223 24.778 C 21.171 24.778 23.034 24.874 24.761 25.048 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.789 6.397)\"/>"
    },
    "SocialIconsPlatformRedditColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24 0 C 10.746 0 0 10.746 0 24 C 0 30.628 2.687 36.628 7.029 40.971 L 2.458 45.542 C 1.551 46.449 2.194 48 3.476 48 L 24 48 C 37.254 48 48 37.254 48 24 C 48 10.746 37.254 0 24 0 Z\" fill=\"rgb(255,69,0)\" fill-rule=\"nonzero\"/><path d=\"M 5.604 11.209 C 8.7 11.209 11.209 8.7 11.209 5.604 C 11.209 2.509 8.7 0 5.604 0 C 2.509 0 0 2.509 0 5.604 C 0 8.7 2.509 11.209 5.604 11.209 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 32.001 17.580)\"/><path d=\"M 5.604 11.209 C 8.7 11.209 11.209 8.7 11.209 5.604 C 11.209 2.509 8.7 0 5.604 0 C 2.509 0 0 2.509 0 5.604 C 0 8.7 2.509 11.209 5.604 11.209 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.791 17.580)\"/><path d=\"M 15.999 24 C 24.836 24 31.999 18.627 31.999 12 C 31.999 5.373 24.836 0 15.999 0 C 7.163 0 0 5.373 0 12 C 0 18.627 7.163 24 15.999 24 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 8.014 15.999)\"/><path d=\"M 5.694 3.681 C 5.6 5.713 4.25 6.452 2.681 6.452 C 1.111 6.452 -0.089 5.411 0.005 3.379 C 0.099 1.346 1.449 0 3.018 0 C 4.588 0 5.788 1.648 5.694 3.681 Z\" fill=\"rgb(132,33,35)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 13.589 23.152)\"/><path d=\"M 5.694 3.379 C 5.788 5.411 4.59 6.452 3.018 6.452 C 1.447 6.452 0.097 5.715 0.005 3.681 C -0.089 1.648 1.11 0 2.681 0 C 4.252 0 5.602 1.344 5.694 3.379 Z\" fill=\"rgb(132,33,35)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 28.739 23.151)\"/><path d=\"M 0.005 3.491 C 0.093 5.394 1.355 6.084 2.825 6.084 C 4.295 6.084 5.416 5.051 5.328 3.148 C 5.24 1.245 3.978 0 2.508 0 C 1.038 0 -0.083 1.588 0.005 3.491 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 28.739 23.518)\"/><path d=\"M 5.328 3.491 C 5.24 5.394 3.978 6.084 2.508 6.084 C 1.038 6.084 -0.083 5.051 0.005 3.148 C 0.093 1.245 1.355 0 2.825 0 C 4.295 0 5.416 1.588 5.328 3.491 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 13.956 23.518)\"/><path d=\"M 6.053 0 C 4.069 0 2.168 0.096 0.409 0.27 C 0.109 0.3 -0.082 0.606 0.034 0.879 C 1.019 3.188 3.342 4.809 6.053 4.809 C 8.764 4.809 11.086 3.188 12.072 0.879 C 12.188 0.606 11.999 0.3 11.697 0.27 C 9.938 0.096 8.037 0 6.053 0 Z\" fill=\"rgb(187,207,218)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 17.960 30.960)\"/><path d=\"M 6.035 0 C 4.057 0 2.161 0.098 0.408 0.276 C 0.108 0.306 -0.082 0.617 0.035 0.894 C 1.017 3.24 3.333 4.886 6.033 4.886 C 8.733 4.886 11.05 3.238 12.033 0.894 C 12.149 0.617 11.96 0.306 11.66 0.276 C 9.907 0.098 8.011 0 6.033 0 L 6.035 0 Z\" fill=\"rgb(255,255,255)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 17.978 31.401)\"/><path d=\"M 5.94 0 C 3.994 0 2.128 0.096 0.401 0.27 C 0.107 0.3 -0.08 0.606 0.034 0.879 C 1 3.188 3.28 4.809 5.94 4.809 C 8.601 4.809 10.879 3.188 11.846 0.879 C 11.961 0.606 11.773 0.3 11.479 0.27 C 9.754 0.096 7.888 0 5.94 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 18.073 31.172)\"/><path d=\"M 3.971 7.942 C 6.165 7.942 7.943 6.165 7.943 3.971 C 7.943 1.778 6.165 0 3.971 0 C 1.778 0 0 1.778 0 3.971 C 0 6.165 1.778 7.942 3.971 7.942 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 28.806 6.426)\"/><path d=\"M 0.861 6.958 C 0.384 6.958 0 6.759 0 6.452 C 0 2.893 2.895 0 6.452 0 C 6.928 0 7.312 0.386 7.312 0.861 C 7.312 1.335 6.926 1.721 6.452 1.721 C 3.844 1.721 1.721 3.844 1.721 6.452 C 1.721 6.759 1.335 6.958 0.861 6.958 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 23.096 9.547)\"/><path d=\"M 3.499 1.333 C 3.499 2.07 2.715 2.4 1.749 2.4 C 0.784 2.4 0 2.07 0 1.333 C 0 0.596 0.784 0 1.749 0 C 2.715 0 3.499 0.596 3.499 1.333 Z\" fill=\"rgb(255,97,1)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 14.739 26.617)\"/><path d=\"M 3.499 1.333 C 3.499 2.07 2.715 2.4 1.749 2.4 C 0.784 2.4 0 2.07 0 1.333 C 0 0.596 0.784 0 1.749 0 C 2.715 0 3.499 0.596 3.499 1.333 Z\" fill=\"rgb(255,97,1)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 29.790 26.617)\"/><path d=\"M 0.622 1.358 C 0.966 1.358 1.245 1.054 1.245 0.679 C 1.245 0.304 0.966 0 0.622 0 C 0.279 0 0 0.304 0 0.679 C 0 1.054 0.279 1.358 0.622 1.358 Z\" fill=\"rgb(255,196,156)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 17.074 24.594)\"/><path d=\"M 0.622 1.358 C 0.966 1.358 1.245 1.054 1.245 0.679 C 1.245 0.304 0.966 0 0.622 0 C 0.279 0 0 0.304 0 0.679 C 0 1.054 0.279 1.358 0.622 1.358 Z\" fill=\"rgb(255,196,156)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 31.869 24.594)\"/>"
    },
    "SocialIconsPlatformSignalColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 18.238 0.701 L 18.777 2.883 C 16.654 3.407 14.622 4.249 12.749 5.378 L 11.597 3.449 C 13.658 2.2 15.898 1.274 18.238 0.701 L 18.238 0.701 Z M 29.762 0.701 L 29.223 2.883 C 31.346 3.407 33.378 4.249 35.251 5.378 L 36.417 3.449 C 34.35 2.201 32.106 1.275 29.762 0.701 L 29.762 0.701 Z M 3.449 11.59 C 2.201 13.654 1.275 15.896 0.701 18.238 L 2.883 18.777 C 3.407 16.654 4.249 14.622 5.378 12.749 L 3.449 11.59 Z M 2.248 24 C 2.248 22.909 2.33 21.819 2.494 20.741 L 0.271 20.4 C -0.09 22.784 -0.09 25.209 0.271 27.593 L 2.494 27.259 C 2.331 26.181 2.249 25.091 2.248 24 L 2.248 24 Z M 36.403 44.545 L 35.251 42.622 C 33.381 43.752 31.351 44.594 29.23 45.117 L 29.769 47.299 C 32.106 46.721 34.343 45.792 36.403 44.545 Z M 45.752 24 C 45.751 25.091 45.669 26.181 45.506 27.259 L 47.729 27.593 C 48.09 25.209 48.09 22.784 47.729 20.4 L 45.506 20.741 C 45.67 21.819 45.752 22.909 45.752 24 L 45.752 24 Z M 47.299 29.755 L 45.117 29.216 C 44.594 31.342 43.753 33.376 42.622 35.251 L 44.551 36.41 C 45.8 34.344 46.726 32.1 47.299 29.755 L 47.299 29.755 Z M 27.259 45.506 C 25.099 45.833 22.901 45.833 20.741 45.506 L 20.407 47.729 C 22.789 48.09 25.211 48.09 27.593 47.729 L 27.259 45.506 Z M 41.51 36.901 C 40.214 38.658 38.66 40.21 36.901 41.504 L 38.237 43.317 C 40.175 41.891 41.89 40.183 43.324 38.251 L 41.51 36.901 Z M 36.901 6.49 C 38.66 7.786 40.214 9.34 41.51 11.099 L 43.324 9.749 C 41.895 7.815 40.185 6.105 38.251 4.676 L 36.901 6.49 Z M 6.49 11.099 C 7.786 9.34 9.34 7.786 11.099 6.49 L 9.749 4.676 C 7.815 6.105 6.105 7.815 4.676 9.749 L 6.49 11.099 Z M 44.551 11.59 L 42.622 12.749 C 43.752 14.619 44.594 16.649 45.117 18.77 L 47.299 18.231 C 46.725 15.891 45.798 13.652 44.551 11.59 L 44.551 11.59 Z M 20.741 2.494 C 22.901 2.167 25.099 2.167 27.259 2.494 L 27.593 0.271 C 25.211 -0.09 22.789 -0.09 20.407 0.271 L 20.741 2.494 Z M 7.642 43.917 L 2.999 44.995 L 4.083 40.351 L 1.894 39.84 L 0.81 44.483 C 0.742 44.771 0.731 45.07 0.779 45.362 C 0.827 45.653 0.931 45.933 1.087 46.185 C 1.243 46.436 1.447 46.654 1.687 46.827 C 1.927 46.999 2.199 47.123 2.487 47.19 C 2.824 47.265 3.173 47.265 3.51 47.19 L 8.153 46.12 L 7.642 43.917 Z M 2.358 37.835 L 4.553 38.34 L 5.303 35.121 C 4.208 33.284 3.392 31.294 2.883 29.216 L 0.701 29.755 C 1.191 31.744 1.934 33.661 2.91 35.462 L 2.358 37.835 Z M 12.858 42.704 L 9.64 43.454 L 10.151 45.649 L 12.517 45.097 C 14.317 46.076 16.235 46.819 18.225 47.306 L 18.763 45.124 C 16.692 44.608 14.709 43.788 12.879 42.69 L 12.858 42.704 Z M 24 4.499 C 13.227 4.505 4.505 13.24 4.505 24.007 C 4.511 27.674 5.549 31.266 7.499 34.371 L 5.624 42.376 L 13.622 40.501 C 22.739 46.236 34.78 43.501 40.515 34.392 C 46.249 25.282 43.522 13.24 34.412 7.499 C 31.293 5.538 27.684 4.498 24 4.499\" fill=\"currentColor\" fill-rule=\"nonzero\"/>"
    },
    "SocialIconsPlatformSignalColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 18.238 0.701 L 18.777 2.883 C 16.654 3.407 14.622 4.249 12.749 5.378 L 11.597 3.449 C 13.658 2.2 15.898 1.274 18.238 0.701 L 18.238 0.701 Z M 29.762 0.701 L 29.223 2.883 C 31.346 3.407 33.378 4.249 35.251 5.378 L 36.417 3.449 C 34.35 2.201 32.106 1.275 29.762 0.701 L 29.762 0.701 Z M 3.449 11.59 C 2.201 13.654 1.275 15.896 0.701 18.238 L 2.883 18.777 C 3.407 16.654 4.249 14.622 5.378 12.749 L 3.449 11.59 Z M 2.248 24 C 2.248 22.909 2.33 21.819 2.494 20.741 L 0.271 20.4 C -0.09 22.784 -0.09 25.209 0.271 27.593 L 2.494 27.259 C 2.331 26.181 2.249 25.091 2.248 24 L 2.248 24 Z M 36.403 44.545 L 35.251 42.622 C 33.381 43.752 31.351 44.594 29.23 45.117 L 29.769 47.299 C 32.106 46.721 34.343 45.792 36.403 44.545 Z M 45.752 24 C 45.751 25.091 45.669 26.181 45.506 27.259 L 47.729 27.593 C 48.09 25.209 48.09 22.784 47.729 20.4 L 45.506 20.741 C 45.67 21.819 45.752 22.909 45.752 24 L 45.752 24 Z M 47.299 29.755 L 45.117 29.216 C 44.594 31.342 43.753 33.376 42.622 35.251 L 44.551 36.41 C 45.8 34.344 46.726 32.1 47.299 29.755 L 47.299 29.755 Z M 27.259 45.506 C 25.099 45.833 22.901 45.833 20.741 45.506 L 20.407 47.729 C 22.789 48.09 25.211 48.09 27.593 47.729 L 27.259 45.506 Z M 41.51 36.901 C 40.214 38.658 38.66 40.21 36.901 41.504 L 38.237 43.317 C 40.175 41.891 41.89 40.183 43.324 38.251 L 41.51 36.901 Z M 36.901 6.49 C 38.66 7.786 40.214 9.34 41.51 11.099 L 43.324 9.749 C 41.895 7.815 40.185 6.105 38.251 4.676 L 36.901 6.49 Z M 6.49 11.099 C 7.786 9.34 9.34 7.786 11.099 6.49 L 9.749 4.676 C 7.815 6.105 6.105 7.815 4.676 9.749 L 6.49 11.099 Z M 44.551 11.59 L 42.622 12.749 C 43.752 14.619 44.594 16.649 45.117 18.77 L 47.299 18.231 C 46.725 15.891 45.798 13.652 44.551 11.59 L 44.551 11.59 Z M 20.741 2.494 C 22.901 2.167 25.099 2.167 27.259 2.494 L 27.593 0.271 C 25.211 -0.09 22.789 -0.09 20.407 0.271 L 20.741 2.494 Z M 7.642 43.917 L 2.999 44.995 L 4.083 40.351 L 1.894 39.84 L 0.81 44.483 C 0.742 44.771 0.731 45.07 0.779 45.362 C 0.827 45.653 0.931 45.933 1.087 46.185 C 1.243 46.436 1.447 46.654 1.687 46.827 C 1.927 46.999 2.199 47.123 2.487 47.19 C 2.824 47.265 3.173 47.265 3.51 47.19 L 8.153 46.12 L 7.642 43.917 Z M 2.358 37.835 L 4.553 38.34 L 5.303 35.121 C 4.208 33.284 3.392 31.294 2.883 29.216 L 0.701 29.755 C 1.191 31.744 1.934 33.661 2.91 35.462 L 2.358 37.835 Z M 12.858 42.704 L 9.64 43.454 L 10.151 45.649 L 12.517 45.097 C 14.317 46.076 16.235 46.819 18.225 47.306 L 18.763 45.124 C 16.692 44.608 14.709 43.788 12.879 42.69 L 12.858 42.704 Z M 24 4.499 C 13.227 4.505 4.505 13.24 4.505 24.007 C 4.511 27.674 5.549 31.266 7.499 34.371 L 5.624 42.376 L 13.622 40.501 C 22.739 46.236 34.78 43.501 40.515 34.392 C 46.249 25.282 43.522 13.24 34.412 7.499 C 31.293 5.538 27.684 4.498 24 4.499\" fill=\"currentColor\" fill-rule=\"nonzero\"/>"
    },
    "SocialIconsPlatformSnapchatColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 47.826 34.565 C 47.496 33.658 46.858 33.168 46.135 32.776 C 46 32.702 45.878 32.629 45.767 32.58 C 45.547 32.469 45.326 32.359 45.105 32.249 C 42.85 31.047 41.085 29.552 39.872 27.763 C 39.528 27.26 39.222 26.721 38.977 26.169 C 38.866 25.875 38.879 25.703 38.952 25.544 C 39.026 25.421 39.124 25.323 39.246 25.238 C 39.639 24.98 40.031 24.723 40.301 24.551 C 40.779 24.232 41.171 23.987 41.416 23.816 C 42.335 23.166 42.985 22.48 43.389 21.707 C 43.965 20.629 44.039 19.366 43.598 18.226 C 42.985 16.608 41.465 15.616 39.614 15.616 C 39.222 15.616 38.842 15.652 38.45 15.738 C 38.352 15.763 38.241 15.787 38.143 15.812 C 38.156 14.709 38.131 13.544 38.033 12.392 C 37.69 8.359 36.268 6.251 34.797 4.572 C 33.853 3.518 32.75 2.623 31.512 1.924 C 29.281 0.65 26.744 0 23.986 0 C 21.228 0 18.703 0.65 16.473 1.924 C 15.235 2.623 14.131 3.518 13.188 4.572 C 11.717 6.251 10.307 8.372 9.952 12.392 C 9.854 13.544 9.829 14.709 9.841 15.812 C 9.743 15.787 9.645 15.763 9.535 15.738 C 9.155 15.652 8.763 15.616 8.383 15.616 C 6.532 15.616 5.012 16.621 4.399 18.226 C 3.958 19.366 4.032 20.629 4.608 21.707 C 5.012 22.48 5.662 23.166 6.581 23.816 C 6.826 23.987 7.206 24.232 7.696 24.551 C 7.954 24.723 8.334 24.968 8.714 25.213 C 8.849 25.299 8.959 25.409 9.045 25.544 C 9.118 25.703 9.131 25.875 9.008 26.194 C 8.763 26.733 8.469 27.26 8.125 27.75 C 6.937 29.491 5.221 30.974 3.039 32.163 C 1.887 32.776 0.685 33.18 0.171 34.565 C -0.209 35.607 0.036 36.784 1.004 37.789 C 1.36 38.157 1.776 38.475 2.23 38.72 C 3.174 39.235 4.179 39.64 5.233 39.922 C 5.453 39.983 5.65 40.069 5.833 40.191 C 6.189 40.498 6.14 40.963 6.606 41.65 C 6.838 42.005 7.145 42.312 7.488 42.557 C 8.481 43.243 9.596 43.28 10.773 43.329 C 11.839 43.366 13.041 43.415 14.426 43.868 C 15.002 44.052 15.59 44.42 16.276 44.849 C 17.931 45.866 20.187 47.251 23.974 47.251 C 27.761 47.251 30.029 45.854 31.696 44.837 C 32.382 44.42 32.971 44.052 33.522 43.868 C 34.895 43.415 36.109 43.366 37.175 43.329 C 38.352 43.28 39.467 43.243 40.46 42.557 C 40.877 42.263 41.22 41.895 41.465 41.454 C 41.808 40.878 41.796 40.473 42.115 40.191 C 42.286 40.069 42.482 39.983 42.678 39.934 C 43.733 39.652 44.762 39.247 45.718 38.72 C 46.196 38.463 46.638 38.12 47.005 37.715 L 47.017 37.703 C 47.974 36.722 48.206 35.57 47.826 34.565 Z M 44.468 36.367 C 42.421 37.495 41.048 37.372 39.994 38.059 C 39.087 38.635 39.626 39.885 38.977 40.338 C 38.168 40.89 35.79 40.302 32.726 41.319 C 30.188 42.152 28.583 44.567 24.023 44.567 C 19.463 44.567 17.894 42.165 15.32 41.319 C 12.256 40.302 9.878 40.902 9.069 40.338 C 8.42 39.885 8.947 38.635 8.052 38.059 C 6.986 37.372 5.625 37.495 3.578 36.367 C 2.267 35.644 3.014 35.203 3.443 34.994 C 10.871 31.403 12.06 25.85 12.109 25.434 C 12.17 24.931 12.244 24.539 11.692 24.036 C 11.165 23.546 8.812 22.087 8.15 21.634 C 7.071 20.874 6.593 20.126 6.949 19.195 C 7.194 18.557 7.795 18.312 8.42 18.312 C 8.616 18.312 8.812 18.337 9.008 18.374 C 10.197 18.631 11.349 19.219 12.011 19.391 C 12.097 19.415 12.17 19.428 12.256 19.428 C 12.612 19.428 12.734 19.244 12.71 18.839 C 12.636 17.54 12.452 15.015 12.661 12.649 C 12.943 9.401 13.984 7.783 15.235 6.361 C 15.835 5.675 18.642 2.709 24.023 2.709 C 29.404 2.709 32.211 5.663 32.811 6.349 C 34.062 7.771 35.104 9.389 35.385 12.637 C 35.594 15.003 35.41 17.528 35.324 18.827 C 35.3 19.256 35.422 19.415 35.778 19.415 C 35.863 19.415 35.937 19.403 36.023 19.379 C 36.685 19.219 37.837 18.619 39.026 18.361 C 39.222 18.312 39.418 18.3 39.614 18.3 C 40.239 18.3 40.84 18.545 41.085 19.182 C 41.44 20.114 40.962 20.862 39.884 21.622 C 39.234 22.075 36.881 23.534 36.341 24.024 C 35.79 24.527 35.863 24.919 35.925 25.421 C 35.974 25.838 37.163 31.391 44.591 34.982 C 45.032 35.19 45.767 35.644 44.468 36.367 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 0.350)\"/>"
    },
    "SocialIconsPlatformSnapchatColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 41.786 32.326 C 34.353 28.727 33.168 23.17 33.116 22.757 C 33.052 22.258 32.98 21.866 33.53 21.358 C 34.061 20.867 36.417 19.408 37.071 18.952 C 38.151 18.196 38.627 17.442 38.276 16.515 C 38.031 15.873 37.434 15.631 36.805 15.631 C 36.606 15.632 36.408 15.654 36.215 15.697 C 35.028 15.955 33.875 16.55 33.208 16.711 C 33.128 16.731 33.045 16.743 32.962 16.744 C 32.607 16.744 32.472 16.586 32.506 16.158 C 32.59 14.86 32.766 12.326 32.561 9.96 C 32.281 6.704 31.231 5.091 29.986 3.664 C 29.384 2.972 26.588 0 21.192 0 C 15.796 0 13.003 2.972 12.405 3.656 C 11.156 5.082 10.108 6.696 9.829 9.951 C 9.624 12.318 9.808 14.85 9.884 16.149 C 9.909 16.556 9.784 16.735 9.428 16.735 C 9.345 16.734 9.263 16.723 9.183 16.702 C 8.517 16.542 7.364 15.947 6.177 15.689 C 5.983 15.645 5.786 15.623 5.587 15.623 C 4.956 15.623 4.361 15.868 4.115 16.506 C 3.765 17.433 4.238 18.188 5.322 18.943 C 5.976 19.4 8.332 20.857 8.863 21.349 C 9.412 21.857 9.341 22.25 9.277 22.749 C 9.225 23.167 8.039 28.724 0.607 32.318 C 0.171 32.529 -0.569 32.975 0.737 33.696 C 2.787 34.83 4.152 34.708 5.213 35.392 C 6.113 35.972 5.581 37.223 6.236 37.675 C 7.04 38.23 9.418 37.635 12.49 38.65 C 15.066 39.499 16.631 41.897 21.198 41.897 C 25.765 41.897 27.375 39.488 29.905 38.65 C 32.971 37.635 35.354 38.23 36.16 37.675 C 36.813 37.223 36.282 35.972 37.182 35.392 C 38.243 34.708 39.607 34.83 41.659 33.696 C 42.962 32.984 42.222 32.537 41.786 32.326 Z\" fill=\"rgb(255,255,255)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.808 3.033)\"/><path d=\"M 47.828 34.587 C 47.495 33.679 46.86 33.193 46.136 32.791 C 46 32.711 45.875 32.648 45.768 32.598 C 45.552 32.487 45.331 32.379 45.112 32.265 C 42.857 31.069 41.096 29.56 39.874 27.771 C 39.527 27.268 39.226 26.734 38.975 26.176 C 38.871 25.878 38.876 25.709 38.951 25.554 C 39.025 25.435 39.123 25.333 39.239 25.254 C 39.626 24.997 40.026 24.737 40.297 24.562 C 40.78 24.249 41.163 24.001 41.41 23.826 C 42.335 23.178 42.983 22.49 43.388 21.721 C 43.67 21.189 43.835 20.603 43.87 20.003 C 43.906 19.402 43.812 18.801 43.595 18.239 C 42.982 16.625 41.457 15.623 39.61 15.623 C 39.221 15.622 38.832 15.663 38.451 15.745 C 38.35 15.767 38.248 15.791 38.149 15.816 C 38.166 14.712 38.141 13.547 38.043 12.4 C 37.695 8.368 36.283 6.254 34.812 4.568 C 33.869 3.512 32.759 2.619 31.526 1.924 C 29.293 0.648 26.76 0 24 0 C 21.239 0 18.719 0.648 16.483 1.924 C 15.247 2.619 14.135 3.514 13.192 4.573 C 11.72 6.259 10.308 8.376 9.96 12.405 C 9.862 13.552 9.837 14.723 9.853 15.821 C 9.754 15.796 9.654 15.772 9.552 15.75 C 9.171 15.668 8.782 15.627 8.393 15.628 C 6.545 15.628 5.018 16.63 4.407 18.244 C 4.189 18.806 4.094 19.407 4.129 20.009 C 4.164 20.61 4.328 21.197 4.609 21.729 C 5.015 22.499 5.663 23.187 6.589 23.835 C 6.834 24.006 7.218 24.254 7.701 24.571 C 7.962 24.74 8.344 24.988 8.718 25.235 C 8.849 25.32 8.96 25.432 9.044 25.563 C 9.122 25.724 9.125 25.897 9.008 26.216 C 8.761 26.761 8.465 27.284 8.124 27.777 C 6.93 29.525 5.22 31.007 3.037 32.194 C 1.881 32.807 0.679 33.217 0.171 34.597 C -0.212 35.638 0.039 36.823 1.011 37.822 C 1.368 38.195 1.782 38.508 2.238 38.751 C 3.185 39.272 4.193 39.675 5.239 39.952 C 5.454 40.007 5.659 40.099 5.844 40.223 C 6.199 40.533 6.149 41 6.621 41.685 C 6.858 42.039 7.159 42.345 7.509 42.588 C 8.499 43.272 9.613 43.315 10.793 43.361 C 11.859 43.401 13.067 43.448 14.446 43.903 C 15.018 44.092 15.611 44.457 16.299 44.884 C 17.951 45.9 20.213 47.29 23.997 47.29 C 27.782 47.29 30.059 45.893 31.724 44.873 C 32.407 44.454 32.997 44.092 33.552 43.908 C 34.932 43.451 36.14 43.406 37.205 43.366 C 38.385 43.32 39.499 43.277 40.49 42.593 C 40.904 42.304 41.249 41.927 41.5 41.489 C 41.84 40.911 41.831 40.507 42.15 40.225 C 42.324 40.107 42.516 40.019 42.719 39.965 C 43.779 39.688 44.801 39.28 45.761 38.753 C 46.245 38.493 46.68 38.152 47.048 37.745 L 47.061 37.73 C 47.973 36.753 48.202 35.603 47.828 34.587 Z M 44.464 36.395 C 42.413 37.529 41.049 37.407 39.988 38.091 C 39.087 38.671 39.62 39.922 38.965 40.374 C 38.161 40.929 35.783 40.334 32.711 41.349 C 30.177 42.187 28.561 44.596 24.003 44.596 C 19.446 44.596 17.868 42.192 15.292 41.343 C 12.226 40.328 9.844 40.923 9.038 40.367 C 8.384 39.916 8.915 38.665 8.015 38.084 C 6.953 37.401 5.589 37.523 3.539 36.395 C 2.233 35.674 2.973 35.227 3.409 35.016 C 10.841 31.417 12.027 25.86 12.079 25.448 C 12.143 24.948 12.214 24.556 11.665 24.048 C 11.134 23.557 8.778 22.099 8.124 21.642 C 7.043 20.887 6.567 20.132 6.917 19.205 C 7.163 18.563 7.761 18.322 8.389 18.322 C 8.588 18.322 8.785 18.344 8.979 18.388 C 10.166 18.645 11.319 19.24 11.985 19.401 C 12.065 19.422 12.147 19.433 12.23 19.434 C 12.586 19.434 12.711 19.255 12.686 18.848 C 12.61 17.549 12.426 15.017 12.631 12.65 C 12.912 9.394 13.961 7.781 15.207 6.355 C 15.805 5.669 18.617 2.696 23.995 2.696 C 29.373 2.696 32.192 5.657 32.79 6.34 C 34.038 7.767 35.087 9.38 35.366 12.636 C 35.571 15.002 35.394 17.535 35.311 18.833 C 35.282 19.261 35.411 19.419 35.767 19.419 C 35.85 19.418 35.932 19.407 36.012 19.386 C 36.679 19.226 37.832 18.631 39.019 18.373 C 39.213 18.33 39.411 18.307 39.609 18.307 C 40.241 18.307 40.836 18.552 41.081 19.19 C 41.432 20.117 40.958 20.872 39.875 21.628 C 39.222 22.084 36.866 23.541 36.335 24.033 C 35.784 24.541 35.856 24.934 35.92 25.433 C 35.973 25.851 37.158 31.408 44.591 35.002 C 45.03 35.221 45.771 35.668 44.464 36.395 Z\" fill=\"rgb(0,0,0)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 0.350)\"/>"
    },
    "SocialIconsPlatformSpotifyColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 23.927 0 C 10.713 0 0 10.712 0 23.926 C 0 37.141 10.713 47.852 23.927 47.852 C 37.142 47.852 47.853 37.141 47.853 23.926 C 47.853 10.713 37.142 0.001 23.926 0.001 L 23.927 0 Z M 34.899 34.509 C 34.471 35.211 33.551 35.434 32.848 35.003 C 27.23 31.571 20.158 30.794 11.829 32.697 C 11.027 32.88 10.227 32.377 10.044 31.574 C 9.86 30.771 10.361 29.971 11.166 29.789 C 20.28 27.705 28.098 28.603 34.405 32.457 C 35.108 32.889 35.331 33.806 34.899 34.509 Z M 37.828 27.993 C 37.288 28.871 36.139 29.149 35.262 28.609 C 28.831 24.655 19.027 23.51 11.42 25.819 C 10.433 26.117 9.391 25.561 9.092 24.576 C 8.795 23.589 9.351 22.549 10.336 22.249 C 19.025 19.613 29.828 20.89 37.213 25.429 C 38.091 25.969 38.368 27.117 37.828 27.993 Z M 38.079 21.209 C 30.368 16.629 17.645 16.207 10.282 18.442 C 9.1 18.801 7.85 18.133 7.491 16.951 C 7.133 15.768 7.8 14.519 8.983 14.159 C 17.435 11.593 31.485 12.089 40.363 17.36 C 41.429 17.991 41.777 19.364 41.146 20.426 C 40.517 21.49 39.14 21.84 38.08 21.209 L 38.079 21.209 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/>"
    },
    "SocialIconsPlatformSpotifyColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 23.927 0 C 10.713 0 0 10.712 0 23.926 C 0 37.141 10.713 47.852 23.927 47.852 C 37.142 47.852 47.853 37.141 47.853 23.926 C 47.853 10.713 37.142 0.001 23.926 0.001 L 23.927 0 Z M 34.899 34.509 C 34.471 35.211 33.551 35.434 32.848 35.003 C 27.23 31.571 20.158 30.794 11.829 32.697 C 11.027 32.88 10.227 32.377 10.044 31.574 C 9.86 30.771 10.361 29.971 11.166 29.789 C 20.28 27.705 28.098 28.603 34.405 32.457 C 35.108 32.889 35.331 33.806 34.899 34.509 Z M 37.828 27.993 C 37.288 28.871 36.139 29.149 35.262 28.609 C 28.831 24.655 19.027 23.51 11.42 25.819 C 10.433 26.117 9.391 25.561 9.092 24.576 C 8.795 23.589 9.351 22.549 10.336 22.249 C 19.025 19.613 29.828 20.89 37.213 25.429 C 38.091 25.969 38.368 27.117 37.828 27.993 Z M 38.079 21.209 C 30.368 16.629 17.645 16.207 10.282 18.442 C 9.1 18.801 7.85 18.133 7.491 16.951 C 7.133 15.768 7.8 14.519 8.983 14.159 C 17.435 11.593 31.485 12.089 40.363 17.36 C 41.429 17.991 41.777 19.364 41.146 20.426 C 40.517 21.49 39.14 21.84 38.08 21.209 L 38.079 21.209 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 0)\"/>"
    },
    "SocialIconsPlatformTelegramColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 48 24 C 48 37.255 37.255 48 24 48 C 10.745 48 0 37.255 0 24 C 0 10.745 10.745 0 24 0 C 37.255 0 48 10.745 48 24 Z M 24.86 17.718 C 22.526 18.689 17.86 20.698 10.864 23.747 C 9.728 24.198 9.133 24.64 9.078 25.073 C 8.987 25.803 9.901 26.091 11.147 26.482 C 11.316 26.536 11.492 26.591 11.672 26.649 C 12.897 27.048 14.546 27.514 15.403 27.532 C 16.18 27.549 17.047 27.228 18.005 26.571 C 24.542 22.158 27.917 19.928 28.129 19.88 C 28.278 19.846 28.485 19.803 28.626 19.928 C 28.766 20.052 28.752 20.289 28.737 20.352 C 28.647 20.738 25.056 24.076 23.198 25.804 C 22.619 26.342 22.208 26.724 22.124 26.811 C 21.936 27.007 21.744 27.192 21.56 27.369 C 20.422 28.467 19.568 29.29 21.607 30.634 C 22.587 31.279 23.372 31.813 24.154 32.346 C 25.008 32.928 25.861 33.509 26.963 34.231 C 27.244 34.415 27.512 34.607 27.774 34.793 C 28.768 35.502 29.661 36.139 30.765 36.037 C 31.406 35.978 32.069 35.375 32.405 33.577 C 33.2 29.326 34.763 20.117 35.124 16.322 C 35.156 15.989 35.116 15.564 35.084 15.377 C 35.052 15.19 34.986 14.924 34.743 14.727 C 34.455 14.494 34.011 14.445 33.813 14.448 C 32.91 14.464 31.525 14.946 24.86 17.718 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/>"
    },
    "SocialIconsPlatformTelegramColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24 48 C 37.255 48 48 37.255 48 24 C 48 10.745 37.255 0 24 0 C 10.745 0 0 10.745 0 24 C 0 37.255 10.745 48 24 48 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/><path d=\"M 1.792 9.299 C 8.788 6.25 13.454 4.241 15.788 3.27 C 22.453 0.498 23.838 0.016 24.741 0 C 24.939 -0.003 25.383 0.046 25.671 0.279 C 25.914 0.476 25.98 0.742 26.012 0.929 C 26.044 1.116 26.084 1.541 26.052 1.874 C 25.691 5.669 24.128 14.878 23.333 19.129 C 22.997 20.927 22.334 21.53 21.693 21.589 C 20.299 21.718 19.241 20.668 17.891 19.783 C 15.779 18.399 14.586 17.537 12.535 16.186 C 10.166 14.624 11.702 13.766 13.052 12.363 C 13.406 11.996 19.546 6.411 19.665 5.904 C 19.68 5.841 19.694 5.604 19.554 5.48 C 19.413 5.355 19.206 5.398 19.057 5.432 C 18.845 5.48 15.47 7.71 8.933 12.123 C 7.975 12.78 7.108 13.101 6.331 13.084 C 5.474 13.066 3.825 12.6 2.6 12.201 C 1.097 11.713 -0.098 11.454 0.006 10.625 C 0.06 10.192 0.656 9.75 1.792 9.299 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 9.072 14.448)\"/>"
    },
    "SocialIconsPlatformThreadsColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 32.134 22.247 C 31.927 22.148 31.717 22.053 31.505 21.961 C 31.134 15.135 27.404 11.226 21.14 11.186 C 21.112 11.186 21.084 11.186 21.056 11.186 C 17.309 11.186 14.193 12.785 12.276 15.695 L 15.72 18.058 C 17.153 15.885 19.401 15.421 21.057 15.421 C 21.076 15.421 21.095 15.421 21.114 15.421 C 23.177 15.435 24.733 16.034 25.74 17.204 C 26.473 18.055 26.963 19.231 27.206 20.716 C 25.378 20.405 23.4 20.31 21.286 20.431 C 15.331 20.774 11.503 24.247 11.76 29.073 C 11.89 31.521 13.11 33.627 15.194 35.003 C 16.956 36.166 19.225 36.735 21.583 36.606 C 24.698 36.435 27.141 35.247 28.845 33.074 C 30.14 31.424 30.958 29.286 31.32 26.591 C 32.804 27.487 33.904 28.666 34.512 30.083 C 35.545 32.492 35.605 36.45 32.375 39.677 C 29.546 42.504 26.144 43.727 21.003 43.765 C 15.301 43.722 10.988 41.894 8.185 38.329 C 5.559 34.992 4.202 30.17 4.151 24 C 4.202 17.829 5.559 13.008 8.185 9.671 C 10.988 6.106 15.301 4.278 21.003 4.235 C 26.747 4.278 31.135 6.115 34.046 9.697 C 35.474 11.453 36.55 13.662 37.259 16.238 L 41.296 15.161 C 40.436 11.991 39.083 9.259 37.241 6.994 C 33.509 2.402 28.051 0.049 21.017 0 L 20.989 0 C 13.97 0.049 8.573 2.41 4.947 7.02 C 1.72 11.122 0.056 16.829 0 23.983 L 0 24 L 0 24.017 C 0.056 31.171 1.72 36.879 4.947 40.98 C 8.573 45.59 13.97 47.951 20.989 48 L 21.017 48 C 27.258 47.957 31.656 46.323 35.279 42.703 C 40.02 37.966 39.877 32.03 38.315 28.385 C 37.194 25.772 35.057 23.649 32.134 22.247 Z M 21.36 32.377 C 18.75 32.524 16.039 31.352 15.905 28.843 C 15.806 26.983 17.229 24.906 21.52 24.659 C 22.012 24.631 22.494 24.617 22.968 24.617 C 24.527 24.617 25.985 24.768 27.31 25.058 C 26.816 31.234 23.916 32.236 21.36 32.377 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.250 0)\"/>"
    },
    "SocialIconsPlatformThreadsColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 32.134 22.247 C 31.927 22.148 31.717 22.053 31.505 21.961 C 31.134 15.135 27.404 11.226 21.14 11.186 C 21.112 11.186 21.084 11.186 21.056 11.186 C 17.309 11.186 14.193 12.785 12.276 15.695 L 15.72 18.058 C 17.153 15.885 19.401 15.421 21.057 15.421 C 21.076 15.421 21.095 15.421 21.114 15.421 C 23.177 15.435 24.733 16.034 25.74 17.204 C 26.473 18.055 26.963 19.231 27.206 20.716 C 25.378 20.405 23.4 20.31 21.286 20.431 C 15.331 20.774 11.503 24.247 11.76 29.073 C 11.89 31.521 13.11 33.627 15.194 35.003 C 16.956 36.166 19.225 36.735 21.583 36.606 C 24.698 36.435 27.141 35.247 28.845 33.074 C 30.14 31.424 30.958 29.286 31.32 26.591 C 32.804 27.487 33.904 28.666 34.512 30.083 C 35.545 32.492 35.605 36.45 32.375 39.677 C 29.546 42.504 26.144 43.727 21.003 43.765 C 15.301 43.722 10.988 41.894 8.185 38.329 C 5.559 34.992 4.202 30.17 4.151 24 C 4.202 17.829 5.559 13.008 8.185 9.671 C 10.988 6.106 15.301 4.278 21.003 4.235 C 26.747 4.278 31.135 6.115 34.046 9.697 C 35.474 11.453 36.55 13.662 37.259 16.238 L 41.296 15.161 C 40.436 11.991 39.083 9.259 37.241 6.994 C 33.509 2.402 28.051 0.049 21.017 0 L 20.989 0 C 13.97 0.049 8.573 2.41 4.947 7.02 C 1.72 11.122 0.056 16.829 0 23.983 L 0 24 L 0 24.017 C 0.056 31.171 1.72 36.879 4.947 40.98 C 8.573 45.59 13.97 47.951 20.989 48 L 21.017 48 C 27.258 47.957 31.656 46.323 35.279 42.703 C 40.02 37.966 39.877 32.03 38.315 28.385 C 37.194 25.772 35.057 23.649 32.134 22.247 Z M 21.36 32.377 C 18.75 32.524 16.039 31.352 15.905 28.843 C 15.806 26.983 17.229 24.906 21.52 24.659 C 22.012 24.631 22.494 24.617 22.968 24.617 C 24.527 24.617 25.985 24.768 27.31 25.058 C 26.816 31.234 23.916 32.236 21.36 32.377 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.250 0)\"/>"
    },
    "SocialIconsPlatformTikTokColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 30.145 0 L 22.056 0 L 22.056 32.696 C 22.056 36.591 18.944 39.791 15.073 39.791 C 11.201 39.791 8.089 36.591 8.089 32.696 C 8.089 28.87 11.132 25.739 14.865 25.6 L 14.865 17.391 C 6.637 17.53 0 24.278 0 32.696 C 0 41.183 6.776 48 15.142 48 C 23.508 48 30.283 41.113 30.283 32.696 L 30.283 15.93 C 33.325 18.157 37.059 19.478 41 19.548 L 41 11.339 C 34.916 11.13 30.145 6.122 30.145 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 0)\"/>"
    },
    "SocialIconsPlatformTikTokColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 24.913 15.407 C 28 17.621 31.781 18.924 35.865 18.924 L 35.865 11.037 C 35.092 11.037 34.321 10.957 33.565 10.796 L 33.565 17.004 C 29.481 17.004 25.7 15.701 22.613 13.487 L 22.613 29.582 C 22.613 37.633 16.109 44.16 8.087 44.16 C 5.093 44.16 2.311 43.252 0 41.694 C 2.638 44.401 6.316 46.08 10.386 46.08 C 18.409 46.08 24.913 39.553 24.913 31.502 L 24.913 15.407 L 24.913 15.407 L 24.913 15.407 Z M 27.75 7.45 C 26.173 5.721 25.137 3.485 24.913 1.014 L 24.913 0 L 22.733 0 C 23.282 3.141 25.153 5.824 27.75 7.45 Z M 5.074 35.516 C 4.193 34.356 3.717 32.937 3.719 31.479 C 3.719 27.796 6.693 24.81 10.364 24.81 C 11.048 24.81 11.727 24.915 12.379 25.123 L 12.379 17.06 C 11.618 16.955 10.849 16.91 10.08 16.927 L 10.08 23.203 C 9.428 22.995 8.748 22.89 8.064 22.89 C 4.393 22.89 1.419 25.876 1.419 29.559 C 1.419 32.163 2.906 34.417 5.074 35.516 Z\" fill=\"rgb(255,0,79)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 9.440 1.920)\"/><path d=\"M 26.753 13.487 C 29.841 15.701 33.622 17.004 37.705 17.004 L 37.705 10.796 C 35.426 10.308 33.408 9.113 31.89 7.45 C 29.293 5.824 27.422 3.14 26.874 0 L 21.148 0 L 21.148 31.501 C 21.135 35.174 18.166 38.147 14.503 38.147 C 12.345 38.147 10.428 37.115 9.214 35.516 C 7.046 34.417 5.559 32.163 5.559 29.559 C 5.559 25.876 8.533 22.891 12.203 22.891 C 12.907 22.891 13.584 23 14.22 23.203 L 14.22 16.927 C 6.339 17.09 0 23.553 0 31.501 C 0 35.469 1.578 39.066 4.14 41.694 C 6.451 43.252 9.234 44.16 12.227 44.16 C 20.25 44.16 26.753 37.633 26.753 29.582 L 26.753 13.487 L 26.753 13.487 Z\" fill=\"rgb(0,0,0)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.300 1.920)\"/><path d=\"M 40.005 12.716 L 40.005 11.037 C 37.95 11.04 35.934 10.462 34.19 9.37 C 35.734 11.066 37.767 12.236 40.005 12.716 Z M 29.173 1.92 C 29.121 1.62 29.081 1.318 29.053 1.014 L 29.053 0 L 21.148 0 L 21.148 31.502 C 21.135 35.174 18.166 38.147 14.503 38.147 C 13.428 38.147 12.413 37.891 11.514 37.436 C 12.728 39.035 14.645 40.067 16.803 40.067 C 20.465 40.067 23.435 37.094 23.448 33.421 L 23.448 1.92 L 29.173 1.92 Z M 16.52 18.847 L 16.52 17.06 C 15.86 16.969 15.194 16.924 14.527 16.924 C 6.504 16.924 0 23.451 0 31.502 C 0 36.549 2.556 40.997 6.44 43.614 C 3.878 40.986 2.3 37.389 2.3 33.421 C 2.3 25.473 8.638 19.01 16.52 18.847 Z\" fill=\"rgb(0,242,234)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 0)\"/>"
    },
    "SocialIconsPlatformTumblrColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 19.2 48 C 12 48 6.6 44.3 6.6 35.4 L 6.6 21.2 L 0 21.2 L 0 13.5 C 7.2 11.6 10.2 5.4 10.6 0 L 18.1 0 L 18.1 12.2 L 26.8 12.2 L 26.8 21.2 L 18.1 21.2 L 18.1 33.6 C 18.1 37.3 20 38.6 23 38.6 L 27.2 38.6 L 27.2 48 L 19.2 48 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 10 0)\"/>"
    },
    "SocialIconsPlatformTumblrColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 19.2 48 C 12 48 6.6 44.3 6.6 35.4 L 6.6 21.2 L 0 21.2 L 0 13.5 C 7.2 11.6 10.2 5.4 10.6 0 L 18.1 0 L 18.1 12.2 L 26.8 12.2 L 26.8 21.2 L 18.1 21.2 L 18.1 33.6 C 18.1 37.3 20 38.6 23 38.6 L 27.2 38.6 L 27.2 48 L 19.2 48 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 10 0)\"/>"
    },
    "SocialIconsPlatformTwitchColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 8.571 0 L 0 8.571 L 0 39.429 L 10.286 39.429 L 10.286 48 L 18.857 39.429 L 25.714 39.429 L 41.143 24 L 41.143 0 L 8.571 0 Z M 37.714 22.286 L 30.857 29.143 L 24 29.143 L 18 35.143 L 18 29.143 L 10.286 29.143 L 10.286 3.429 L 37.714 3.429 L 37.714 22.286 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.430 0)\"/><path d=\"M 3.429 0 L 0 0 L 0 10.286 L 3.429 10.286 L 3.429 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 32.573 9.429)\"/><path d=\"M 3.429 0 L 0 0 L 0 10.286 L 3.429 10.286 L 3.429 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 23.144 9.429)\"/>"
    },
    "SocialIconsPlatformTwitchColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 27.429 18.857 L 20.571 25.714 L 13.714 25.714 L 7.714 31.714 L 7.714 25.714 L 0 25.714 L 0 0 L 27.429 0 L 27.429 18.857 Z\" fill=\"rgb(255,255,255)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 13.716 3.429)\"/><path d=\"M 8.571 0 L 0 8.571 L 0 39.429 L 10.286 39.429 L 10.286 48 L 18.857 39.429 L 25.714 39.429 L 41.143 24 L 41.143 0 L 8.571 0 Z M 37.714 22.286 L 30.857 29.143 L 24 29.143 L 18 35.143 L 18 29.143 L 10.286 29.143 L 10.286 3.429 L 37.714 3.429 L 37.714 22.286 Z\" fill=\"rgb(145,70,255)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.430 0)\"/><path d=\"M 3.429 0 L 0 0 L 0 10.286 L 3.429 10.286 L 3.429 0 Z\" fill=\"rgb(145,70,255)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 32.573 9.429)\"/><path d=\"M 3.429 0 L 0 0 L 0 10.286 L 3.429 10.286 L 3.429 0 Z\" fill=\"rgb(145,70,255)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 23.144 9.429)\"/>"
    },
    "SocialIconsPlatformVKColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 3.374 3.374 C 0 6.748 0 12.179 0 23.04 L 0 24.96 C 0 35.821 0 41.252 3.374 44.626 C 6.748 48 12.179 48 23.04 48 L 24.96 48 C 35.821 48 41.252 48 44.626 44.626 C 48 41.252 48 35.821 48 24.96 L 48 23.04 C 48 12.179 48 6.748 44.626 3.374 C 41.252 0 35.821 0 24.96 0 L 23.04 0 C 12.179 0 6.748 0 3.374 3.374 Z M 8.1 14.6 C 8.36 27.08 14.6 34.58 25.54 34.58 L 26.16 34.58 L 26.16 27.44 C 30.18 27.84 33.22 30.78 34.44 34.58 L 40.12 34.58 C 38.56 28.9 34.46 25.76 31.9 24.56 C 34.46 23.08 38.06 19.48 38.92 14.6 L 33.76 14.6 C 32.64 18.56 29.32 22.16 26.16 22.5 L 26.16 14.6 L 21 14.6 L 21 28.44 C 17.8 27.64 13.76 23.76 13.58 14.6 L 8.1 14.6 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/>"
    },
    "SocialIconsPlatformVKColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 0 23.04 C 0 12.179 0 6.748 3.374 3.374 C 6.748 0 12.179 0 23.04 0 L 24.96 0 C 35.821 0 41.252 0 44.626 3.374 C 48 6.748 48 12.179 48 23.04 L 48 24.96 C 48 35.821 48 41.252 44.626 44.626 C 41.252 48 35.821 48 24.96 48 L 23.04 48 C 12.179 48 6.748 48 3.374 44.626 C 0 41.252 0 35.821 0 24.96 L 0 23.04 Z\" fill=\"rgb(0,119,255)\" fill-rule=\"nonzero\"/><path d=\"M 17.44 19.98 C 6.5 19.98 0.26 12.48 0 0 L 5.48 0 C 5.66 9.16 9.7 13.04 12.9 13.84 L 12.9 0 L 18.06 0 L 18.06 7.9 C 21.22 7.56 24.54 3.96 25.66 0 L 30.82 0 C 29.96 4.88 26.36 8.48 23.8 9.96 C 26.36 11.16 30.46 14.3 32.02 19.98 L 26.34 19.98 C 25.12 16.18 22.08 13.24 18.06 12.84 L 18.06 19.98 L 17.44 19.98 Z\" fill=\"rgb(255,255,255)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 8.100 14.600)\"/>"
    },
    "SocialIconsPlatformWhatsAppColorNegative": {
      viewBox: "0 0 48.000 48",
      body: "<path d=\"M 0 48 L 3.374 35.674 C 1.292 32.066 0.198 27.976 0.2 23.782 C 0.206 10.67 10.876 0 23.986 0 C 30.348 0.002 36.32 2.48 40.812 6.976 C 45.302 11.472 47.774 17.448 47.772 23.804 C 47.766 36.918 37.096 47.588 23.986 47.588 C 20.006 47.586 16.084 46.588 12.61 44.692 L 0 48 Z M 13.194 40.386 C 16.546 42.376 19.746 43.568 23.978 43.57 C 34.874 43.57 43.75 34.702 43.756 23.8 C 43.76 12.876 34.926 4.02 23.994 4.016 C 13.09 4.016 4.22 12.884 4.216 23.784 C 4.214 28.234 5.518 31.566 7.708 35.052 L 5.71 42.348 L 13.194 40.386 Z M 35.968 29.458 C 35.82 29.21 35.424 29.062 34.828 28.764 C 34.234 28.466 31.312 27.028 30.766 26.83 C 30.222 26.632 29.826 26.532 29.428 27.128 C 29.032 27.722 27.892 29.062 27.546 29.458 C 27.2 29.854 26.852 29.904 26.258 29.606 C 25.664 29.308 23.748 28.682 21.478 26.656 C 19.712 25.08 18.518 23.134 18.172 22.538 C 17.826 21.944 18.136 21.622 18.432 21.326 C 18.7 21.06 19.026 20.632 19.324 20.284 C 19.626 19.94 19.724 19.692 19.924 19.294 C 20.122 18.898 20.024 18.55 19.874 18.252 C 19.724 17.956 18.536 15.03 18.042 13.84 C 17.558 12.682 17.068 12.838 16.704 12.82 L 15.564 12.8 C 15.168 12.8 14.524 12.948 13.98 13.544 C 13.436 14.14 11.9 15.576 11.9 18.502 C 11.9 21.428 14.03 24.254 14.326 24.65 C 14.624 25.046 18.516 31.05 24.478 33.624 C 25.896 34.236 27.004 34.602 27.866 34.876 C 29.29 35.328 30.586 35.264 31.61 35.112 C 32.752 34.942 35.126 33.674 35.622 32.286 C 36.118 30.896 36.118 29.706 35.968 29.458 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/>"
    },
    "SocialIconsPlatformWhatsAppColorOriginal": {
      viewBox: "0 0 48.000 48",
      body: "<path d=\"M 0 48 L 3.374 35.674 C 1.292 32.066 0.198 27.976 0.2 23.782 C 0.206 10.67 10.876 0 23.986 0 C 30.348 0.002 36.32 2.48 40.812 6.976 C 45.302 11.472 47.774 17.448 47.772 23.804 C 47.766 36.918 37.096 47.588 23.986 47.588 C 20.006 47.586 16.084 46.588 12.61 44.692 L 0 48 Z M 13.194 40.386 C 16.546 42.376 19.746 43.568 23.978 43.57 C 34.874 43.57 43.75 34.702 43.756 23.8 C 43.76 12.876 34.926 4.02 23.994 4.016 C 13.09 4.016 4.22 12.884 4.216 23.784 C 4.214 28.234 5.518 31.566 7.708 35.052 L 5.71 42.348 L 13.194 40.386 Z M 35.968 29.458 C 35.82 29.21 35.424 29.062 34.828 28.764 C 34.234 28.466 31.312 27.028 30.766 26.83 C 30.222 26.632 29.826 26.532 29.428 27.128 C 29.032 27.722 27.892 29.062 27.546 29.458 C 27.2 29.854 26.852 29.904 26.258 29.606 C 25.664 29.308 23.748 28.682 21.478 26.656 C 19.712 25.08 18.518 23.134 18.172 22.538 C 17.826 21.944 18.136 21.622 18.432 21.326 C 18.7 21.06 19.026 20.632 19.324 20.284 C 19.626 19.94 19.724 19.692 19.924 19.294 C 20.122 18.898 20.024 18.55 19.874 18.252 C 19.724 17.956 18.536 15.03 18.042 13.84 C 17.558 12.682 17.068 12.838 16.704 12.82 L 15.564 12.8 C 15.168 12.8 14.524 12.948 13.98 13.544 C 13.436 14.14 11.9 15.576 11.9 18.502 C 11.9 21.428 14.03 24.254 14.326 24.65 C 14.624 25.046 18.516 31.05 24.478 33.624 C 25.896 34.236 27.004 34.602 27.866 34.876 C 29.29 35.328 30.586 35.264 31.61 35.112 C 32.752 34.942 35.126 33.674 35.622 32.286 C 36.118 30.896 36.118 29.706 35.968 29.458 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 0)\"/>"
    },
    "SocialIconsPlatformXTwitterColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 34.653 0 L 41.4 0 L 26.659 16.847 L 44 39.772 L 30.422 39.772 L 19.788 25.868 L 7.62 39.772 L 0.869 39.772 L 16.635 21.752 L 0 0 L 13.922 0 L 23.535 12.709 L 34.653 0 Z M 32.285 35.734 L 36.023 35.734 L 11.891 3.826 L 7.879 3.826 L 32.285 35.734 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 3.808)\"/>"
    },
    "SocialIconsPlatformXTwitterColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 34.653 0 L 41.4 0 L 26.659 16.847 L 44 39.772 L 30.422 39.772 L 19.788 25.868 L 7.62 39.772 L 0.869 39.772 L 16.635 21.752 L 0 0 L 13.922 0 L 23.535 12.709 L 34.653 0 Z M 32.285 35.734 L 36.023 35.734 L 11.891 3.826 L 7.879 3.826 L 32.285 35.734 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 3.808)\"/>"
    },
    "SocialIconsPlatformYouTubeColorNegative": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 47.522 7.284 C 47.522 7.284 47.053 3.975 45.609 2.522 C 43.781 0.609 41.738 0.6 40.8 0.487 C 34.088 0 24.009 0 24.009 0 L 23.991 0 C 23.991 0 13.913 0 7.2 0.487 C 6.263 0.6 4.219 0.609 2.391 2.522 C 0.947 3.975 0.487 7.284 0.487 7.284 C 0.487 7.284 0 11.175 0 15.056 L 0 18.694 C 0 22.575 0.478 26.466 0.478 26.466 C 0.478 26.466 0.947 29.775 2.381 31.228 C 4.209 33.141 6.609 33.075 7.678 33.281 C 11.522 33.647 24 33.759 24 33.759 C 24 33.759 34.088 33.741 40.8 33.263 C 41.738 33.15 43.781 33.141 45.609 31.228 C 47.053 29.775 47.522 26.466 47.522 26.466 C 47.522 26.466 48 22.584 48 18.694 L 48 15.056 C 48 11.175 47.522 7.284 47.522 7.284 Z M 19.041 23.109 L 19.041 9.619 L 32.006 16.387 L 19.041 23.109 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 7.116)\"/>"
    },
    "SocialIconsPlatformYouTubeColorOriginal": {
      viewBox: "0 0 48 48",
      body: "<path d=\"M 46.996 5.28 C 46.725 4.259 46.19 3.327 45.445 2.577 C 44.701 1.828 43.772 1.287 42.753 1.009 C 39 0 24 0 24 0 C 24 0 9 0 5.247 1.009 C 4.228 1.287 3.299 1.828 2.555 2.577 C 1.81 3.327 1.275 4.259 1.004 5.28 C 0 9.049 0 16.909 0 16.909 C 0 16.909 0 24.769 1.004 28.538 C 1.275 29.559 1.81 30.491 2.555 31.241 C 3.299 31.99 4.228 32.531 5.247 32.809 C 9 33.818 24 33.818 24 33.818 C 24 33.818 39 33.818 42.753 32.809 C 43.772 32.531 44.701 31.99 45.445 31.241 C 46.19 30.491 46.725 29.559 46.996 28.538 C 48 24.769 48 16.909 48 16.909 C 48 16.909 48 9.049 46.996 5.28 Z\" fill=\"rgb(255,3,2)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0.048 7.091)\"/><path d=\"M 0 14.275 L 0 0 L 12.545 7.137 L 0 14.275 Z\" fill=\"rgb(254,254,254)\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 19.139 16.863)\"/>"
    }
  };
} catch {}
Object.assign(__ds_scope, { __ds_default_components_social_icon_data_1jm1slw });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/social/icon-data.js", error: String((e && e.message) || e) }); }

__ds_scope.__ds_default_components_social_icon_data_1jm1slw$wh66y0 = __ds_scope.__ds_default_components_social_icon_data_1jm1slw;

// components/social/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  name,
  size,
  ...rest
}) {
  const d = __ds_scope.__ds_default_components_social_icon_data_1jm1slw$wh66y0[name];
  if (!d) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: d.viewBox,
    fill: "none"
    // body strings are emitter-controlled <path> markup — geometry,
    // numeric fills and transforms only; no .fig-authored text reaches them.
    ,
    dangerouslySetInnerHTML: {
      __html: d.body
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon, __ds_default_components_social_Icon_1bkztjh: Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/social/Icon.jsx", error: String((e && e.message) || e) }); }

// components/social/SocialRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Social row built from the file's own Social Icons set (52 variants). */
function SocialRow({
  platforms = ['Instagram', 'LinkedIn', 'YouTube', 'Facebook'],
  color = 'Negative',
  size = 24,
  gap = 15,
  tone = 'onDark',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: gap,
      color: tone === 'onDark' ? 'var(--ceiba-cream)' : 'var(--ceiba-ink-deep)',
      ...style
    }
  }, rest), platforms.map(p => /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    key: p,
    name: 'SocialIconsPlatform' + p + 'Color' + color,
    size: size
  })));
}
Object.assign(__ds_scope, { SocialRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/social/SocialRow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/registro_web/AgendaScreen.jsx
try { (() => {
const {
  SiteHeader,
  GridLines,
  SectionTitle,
  StatusLabel
} = window.CEIBADesignSystem_b9a094;
function AgendaScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 1280,
      height: 832,
      background: 'var(--surface-page)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    items: ['AGENDA', 'PONENTES', 'FAQ', 'REGÍSTRATE'],
    active: "AGENDA",
    assetBase: "../../"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 89,
      width: 1293,
      height: 430,
      background: 'url(../../assets/img/speakers-stage.jpg) 95.5% 29.5% / cover no-repeat',
      filter: 'saturate(0.85)'
    }
  }), /*#__PURE__*/React.createElement(GridLines, {
    columns: [89, 311, 969, 1190],
    variant: "dashed"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 89,
      top: 238
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    block: "warm",
    size: 64
  }, "Agenda")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 660,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 20,
      color: 'var(--text-quiet)'
    }
  }, "AGENDA EN CONSTRUCCI\xD3N"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(StatusLabel, {
    tone: "muted"
  }, "Publicamos el programa en agosto*"))), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icons/chevron-pixel.svg",
    alt: "",
    style: {
      position: 'absolute',
      left: 435,
      top: 59,
      width: 50
    }
  }));
}
Object.assign(window, {
  AgendaScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/registro_web/AgendaScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/registro_web/ConfirmScreen.jsx
try { (() => {
const {
  SiteHeader,
  GridLines,
  Button,
  DataRow,
  StatusLabel,
  PartnerStrip
} = window.CEIBADesignSystem_b9a094;
function ConfirmScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 1280,
      height: 832,
      background: 'var(--surface-page)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    items: ['ACERCA DE', 'MI AGENDA', 'FAQ', 'NOMBRE'],
    active: "NOMBRE",
    assetBase: "../../"
  }), /*#__PURE__*/React.createElement(GridLines, {
    columns: [91, 1201],
    variant: "dashed"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 182,
      top: 150,
      width: 440
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 20.727272033691406,
      letterSpacing: '0.17em',
      textTransform: 'uppercase',
      color: 'var(--text-primary)'
    }
  }, "Hola [nombre]"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 4,
      height: 63,
      background: 'var(--ceiba-lime-deep)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 22,
      lineHeight: 1.29,
      textTransform: 'uppercase',
      color: 'var(--text-primary)'
    }
  }, "Eres uno de los", /*#__PURE__*/React.createElement("br", null), "100 invitados")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 34,
      padding: '18px 22px',
      background: 'var(--surface-field)'
    }
  }, /*#__PURE__*/React.createElement(StatusLabel, {
    tone: "muted",
    block: true,
    style: {
      marginBottom: 8
    }
  }, "Informaci\xF3n del evento"), /*#__PURE__*/React.createElement(DataRow, {
    label: "Fecha",
    value: "Lunes 5 de octubre de 2026"
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Hora",
    value: "5:00 PM \u2013 9:00 PM"
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Lugar",
    value: "Jard\xEDn Bot\xE1nico de Quito"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 163,
      top: 690,
      width: 477
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    block: true
  }, "A\xF1adir a mi calendario")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 755,
      top: 89,
      width: 345,
      height: 620,
      background: 'var(--gradient-lime-sky)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 250,
      padding: '26px 22px',
      background: 'var(--ceiba-ink-deep)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 13,
      letterSpacing: '0.17em',
      color: 'var(--ceiba-lime)'
    }
  }, "PASE DIGITAL"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: 'var(--font-mono)',
      fontSize: 24,
      lineHeight: 1.2,
      textTransform: 'uppercase',
      color: 'var(--ceiba-cream)'
    }
  }, "Nombre", /*#__PURE__*/React.createElement("br", null), "Apellido"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: 'var(--font-pixel)',
      fontSize: 11,
      letterSpacing: '0.17em',
      color: 'var(--text-muted)'
    }
  }, "N5OO / QUITO 2026"), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/patterns/pixel-diamond-magenta.svg",
    alt: "",
    style: {
      width: 96,
      marginTop: 22
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 755,
      top: 723,
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    style: {
      width: 283,
      minHeight: 54
    }
  }, "Descargar"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 56,
      height: 54,
      background: 'rgba(208,255,0,0.57)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icons/arrow-diagonal.svg",
    alt: "",
    style: {
      width: 24,
      transform: 'rotate(-45deg)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 89,
      bottom: 24,
      width: 571
    }
  }, /*#__PURE__*/React.createElement(PartnerStrip, {
    groups: [{
      label: 'Initiative led by',
      logos: [{
        alt: 'CEIBA'
      }]
    }, {
      label: 'Funding partners',
      logos: [{
        alt: 'Partner'
      }, {
        alt: 'Partner'
      }, {
        alt: 'Partner'
      }]
    }]
  })));
}
Object.assign(window, {
  ConfirmScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/registro_web/ConfirmScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/registro_web/FaqScreen.jsx
try { (() => {
const {
  SiteHeader,
  SectionTitle,
  FaqRow
} = window.CEIBADesignSystem_b9a094;
const QA = [['¿Qué es Conexión 500?', 'Una noche de innovación e inversión para la biodiversidad y las economías del futuro, en Quito.'], ['¿Cuándo se realizará el evento?', 'Lunes 5 de octubre de 2026, de 5:00 PM a 9:00 PM, en el Jardín Botánico de Quito.'], ['¿Quién organiza el evento?', 'Una iniciativa liderada por CEIBA junto a sus socios financiadores.'], ['¿Cuál es el objetivo del foro?', 'Conectar capital, ciencia y política pública alrededor de las economías de la naturaleza.'], ['¿El evento está abierto al público?', 'El evento es abierto al público y se enmarca en el proceso rumbo a COP17 (Armenia, octubre 2026), posicionando a Quito como nodo clave del ecosistema de innovación para la biodiversidad y las economías de la naturaleza en la región.'], ['¿Habrá alimentos y bebidas?', 'Sí. La noche incluye una recepción con producto local.'], ['¿Qué es Natura500 y qué papel tendrá durante el evento?', 'Natura500 es la plataforma de portafolio que se presenta durante la noche.'], ['¿Cómo se relaciona con el GET Forum del BID Lab?', 'Conexión 500 funciona como antesala regional del GET Forum.']];
function FaqScreen() {
  const [open, setOpen] = React.useState(4);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 1280,
      height: 832,
      background: 'var(--surface-page-light)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    items: ['ACERCA DE', 'MI AGENDA', 'FAQ'],
    active: "FAQ",
    tone: "onLight",
    assetBase: "../../"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 89,
      top: 138
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    block: "lime",
    size: 64,
    tone: "onLight"
  }, "FAQ")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 89,
      right: 89,
      top: 310,
      maxHeight: 470,
      overflow: 'hidden'
    }
  }, QA.map(([q, a], i) => /*#__PURE__*/React.createElement(FaqRow, {
    key: q,
    question: q,
    answer: a,
    open: open === i,
    onToggle: () => setOpen(open === i ? -1 : i)
  }))), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icons/chevron-pixel.svg",
    alt: "",
    style: {
      position: 'absolute',
      left: 757,
      top: 61,
      width: 48,
      transform: 'rotate(180deg)'
    }
  }));
}
Object.assign(window, {
  FaqScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/registro_web/FaqScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/registro_web/HeroScreen.jsx
try { (() => {
const {
  SiteHeader,
  GridLines,
  Button,
  StatusLabel,
  CountdownRuler
} = window.CEIBADesignSystem_b9a094;
function HeroScreen({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 1280,
      height: 832,
      background: 'var(--surface-page)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    items: ['AGENDA', 'SPEAKERS', 'FAQ', 'REGÍSTRATE'],
    active: "REG\xCDSTRATE",
    assetBase: "../../"
  }), /*#__PURE__*/React.createElement(GridLines, {
    columns: [91, 263, 1029, 1201]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 640,
      top: 312,
      width: 627,
      height: 550,
      background: 'url(../../assets/img/hero-ceiba-night.png) 50% 22.4% / 100% 142.3% no-repeat'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 598,
      width: 1279,
      height: 234,
      background: 'var(--gradient-scrim)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 489,
      top: 141,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '0.17em',
      color: 'var(--ceiba-white)'
    }
  }, "05 OCTUBRE 2026 / QUITO, ECUADOR"), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/quito-on-dark.svg",
    alt: "CEIBA QUITO",
    style: {
      position: 'absolute',
      left: 92,
      top: 196,
      width: 1109
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 88,
      top: 481,
      width: 816,
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 32,
      lineHeight: 1.29,
      textTransform: 'uppercase',
      color: 'var(--text-primary)'
    }
  }, "Noche de Innovaci\xF3n e Inversi\xF3n para la Biodiversidad y las Econom\xEDas del Futuro"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 328,
      display: 'flex',
      flexDirection: 'column',
      gap: 15
    }
  }, /*#__PURE__*/React.createElement(Button, {
    block: true,
    onClick: () => go('registro')
  }, "Registro abierto"), /*#__PURE__*/React.createElement(StatusLabel, {
    tone: "muted"
  }, "Cupo limitado*"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 28,
      padding: '0 40px'
    }
  }, /*#__PURE__*/React.createElement(CountdownRuler, {
    current: 20
  })));
}
Object.assign(window, {
  HeroScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/registro_web/HeroScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/registro_web/RegistroScreen.jsx
try { (() => {
const {
  SiteHeader,
  GridLines,
  Field,
  Button,
  StatusLabel
} = window.CEIBADesignSystem_b9a094;
function RegistroScreen({
  go
}) {
  const [v, setV] = React.useState({
    nombre: '',
    apellido: '',
    mail: ''
  });
  const set = k => e => setV({
    ...v,
    [k]: e.target.value
  });
  const ready = v.nombre && v.mail.includes('@');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 1280,
      height: 832,
      background: 'var(--surface-page)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    items: ['AGENDA', 'PONENTES', 'FAQ', 'REGÍSTRATE'],
    active: "REG\xCDSTRATE",
    assetBase: "../../"
  }), /*#__PURE__*/React.createElement(GridLines, {
    columns: [91, 1215],
    variant: "dashed"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 1276,
      top: 5,
      width: 4,
      height: 63,
      background: 'var(--ceiba-lime-deep)'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/shapes/pixel-ring-b.svg",
    alt: "",
    style: {
      position: 'absolute',
      left: 420,
      top: 265,
      width: 61.809
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/shapes/pixel-ring-a.svg",
    alt: "",
    style: {
      position: 'absolute',
      left: 864,
      top: 267,
      width: 57.107
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 114,
      right: 114,
      top: 236,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 87.0207748413086,
      lineHeight: '100%',
      letterSpacing: '0.08em',
      color: 'var(--text-display)'
    }
  }, "acomp\xE1\xF1anos", /*#__PURE__*/React.createElement("br", null), "en natura500 night")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 339,
      top: 448,
      width: 602,
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Field, {
    placeholder: "ESCRIBE TU NOMBRE",
    value: v.nombre,
    onChange: set('nombre')
  }), /*#__PURE__*/React.createElement(Field, {
    placeholder: "ESCRIBE TU APELLIDO",
    value: v.apellido,
    onChange: set('apellido')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    placeholder: "TU CORREO ELECTR\xD3NICO",
    type: "email",
    value: v.mail,
    onChange: set('mail')
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "gradient",
    size: "sm",
    disabled: !ready,
    onClick: () => go('confirm'),
    style: {
      width: 108.904,
      minHeight: 73,
      flexShrink: 0
    },
    icon: /*#__PURE__*/React.createElement("img", {
      src: "../../assets/icons/arrow-diagonal.svg",
      alt: "",
      style: {
        width: 24.201,
        transform: 'rotate(-45deg)'
      }
    })
  })), /*#__PURE__*/React.createElement(StatusLabel, {
    tone: "muted"
  }, "Cupo limitado \xB7 quedan: 5 lugares")));
}
Object.assign(window, {
  RegistroScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/registro_web/RegistroScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/registro_web/SpeakersScreen.jsx
try { (() => {
const {
  SiteHeader,
  StepBlock
} = window.CEIBADesignSystem_b9a094;
function SpeakersScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 1280,
      height: 832,
      background: 'var(--surface-page)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    items: ['AGENDA', 'PONENTES', 'FAQ', 'REGÍSTRATE'],
    active: "PONENTES",
    assetBase: "../../"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 89,
      width: 1293,
      height: 430,
      background: 'url(../../assets/img/speakers-stage.jpg) 50% 22% / cover no-repeat'
    }
  }), /*#__PURE__*/React.createElement(StepBlock, {
    width: 430,
    image: null,
    fill: "var(--ceiba-lime)",
    style: {
      position: 'absolute',
      left: 0,
      top: 89,
      transform: 'rotate(-90deg)',
      transformOrigin: '0 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 89
    }
  }, /*#__PURE__*/React.createElement(StepBlock, {
    width: 429,
    fill: "var(--ceiba-lime)",
    flip: true
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 89,
      top: 602,
      width: 416,
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: 37.83159255981445,
      lineHeight: '100%',
      textTransform: 'uppercase',
      color: 'var(--text-primary)'
    }
  }, "Quienes dan forma a lo que viene en el futuro"), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/shapes/pixel-ring-a.svg",
    alt: "",
    style: {
      position: 'absolute',
      left: 736,
      top: 614,
      width: 49.481
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 735,
      top: 692,
      width: 406,
      fontFamily: 'var(--font-mono)',
      fontSize: 16,
      lineHeight: '100%',
      textTransform: 'uppercase',
      color: 'var(--text-primary)'
    }
  }, "Conoce la lista de Participantes y Ponentes de alto nivel"), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icons/chevron-pixel.svg",
    alt: "",
    style: {
      position: 'absolute',
      left: 556,
      top: 56,
      width: 50
    }
  }));
}
Object.assign(window, {
  SpeakersScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/registro_web/SpeakersScreen.jsx", error: String((e && e.message) || e) }); }

if (__ds_scope.__ds_default_components_social_icon_data_1jm1slw$wh66y0 === undefined) __ds_scope.__ds_default_components_social_icon_data_1jm1slw$wh66y0 = __ds_scope.__ds_default_components_social_icon_data_1jm1slw;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CeibaLogo = __ds_scope.CeibaLogo;

__ds_ns.CountdownRuler = __ds_scope.CountdownRuler;

__ds_ns.DataRow = __ds_scope.DataRow;

__ds_ns.FaqRow = __ds_scope.FaqRow;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.GridLines = __ds_scope.GridLines;

__ds_ns.NavLink = __ds_scope.NavLink;

__ds_ns.PartnerStrip = __ds_scope.PartnerStrip;

__ds_ns.PixelPattern = __ds_scope.PixelPattern;

__ds_ns.SectionTitle = __ds_scope.SectionTitle;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

__ds_ns.StatusLabel = __ds_scope.StatusLabel;

__ds_ns.StepBlock = __ds_scope.StepBlock;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.SocialRow = __ds_scope.SocialRow;

})();
