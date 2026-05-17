// src/typings/scss-modules.d.ts
declare module '*.module.scss' {
  const classes: { readonly [className: string]: string };
  export default classes;
}