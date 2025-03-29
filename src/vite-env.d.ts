/// <reference types="vite/client" />

declare module 'react-pdf' {
  export const Document: any;
  export const Page: any;
  export const pdfjs: any;
}

declare module 'pdfjs-dist' {
  const pdfjs: any;
  export default pdfjs;
}