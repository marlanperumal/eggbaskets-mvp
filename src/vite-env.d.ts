/// <reference types="vite/client" />

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.d.ts" {
  const content: string;
  export default content;
}
