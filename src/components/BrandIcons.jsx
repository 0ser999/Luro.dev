import { siDiscord } from "simple-icons";

// Tool logos. Figma and Discord come from simple-icons / the official palette;
// Photoshop is the official 2026 app icon; Windows is drawn as SVG (simple-icons does not ship it).

export function Photoshop({ size = 22 }) {
  // official Adobe Photoshop 2026 app icon
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" role="img" aria-label="Photoshop">
      <path d="M34.4678 0H7.53225C3.3723 0 0 3.3723 0 7.53225V34.4678C0 38.6277 3.3723 42 7.53225 42H34.4678C38.6277 42 42 38.6277 42 34.4678V7.53225C42 3.3723 38.6277 0 34.4678 0Z" fill="#001E36" />
      <path d="M14.6661 11.1485C20.1565 11.1485 23.2484 13.7203 23.2484 18.0259C23.2484 23.0539 19.0584 25.0767 15.1284 25.0767H12.47V30.5093H7.09517V11.1485H14.6661ZM12.47 15.7431V20.4821H14.8395C16.4866 20.4821 17.6425 19.8175 17.6425 18.1415C17.6425 16.61 16.66 15.7431 14.9551 15.7431H12.47Z" fill="#31A8FF" />
      <path d="M24.3408 29.5557L24.3698 25.0767C25.9013 26.0881 28.0396 26.7238 29.5134 26.7238C30.5247 26.7238 30.9871 26.4348 30.9871 25.9147C30.9871 25.3368 30.3514 25.1056 29.1377 24.7299C26.797 24.0364 24.2253 23.0828 24.2253 20.0198C24.2253 16.8989 26.797 15.1652 30.5247 15.1652C32.2874 15.1652 33.7323 15.4252 35.0037 15.9743L34.9748 20.251C33.9634 19.6441 31.9696 19.0951 30.6692 19.0951C29.7156 19.0951 29.34 19.3841 29.34 19.8175C29.34 20.3376 29.8023 20.4821 31.1894 20.9156C33.8768 21.7247 36.1307 22.5916 36.1307 25.7413C36.1307 28.7465 33.6745 30.7693 29.8312 30.7693C27.8084 30.7693 25.9013 30.4226 24.3408 29.5557Z" fill="#31A8FF" />
    </svg>
  );
}

export function Figma({ size = 22 }) {
  return (
    <svg width={size * 0.67} height={size} viewBox="0 0 38 57" role="img" aria-label="Figma">
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

export function Windows({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 23 23" role="img" aria-label="Windows">
      <path fill="#0078D4" d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
    </svg>
  );
}

export function Discord({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Discord" fill="#5865F2">
      <path d={siDiscord.path} />
    </svg>
  );
}
