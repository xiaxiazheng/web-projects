import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: ['./src/**'],
    },
  },
  lib: [
    {
      bundle: false,
      dts: true,
      format: 'esm',
      syntax: 'es2015', // 类似于 target，nnd 改名字
    },
  ],
  output: {
    target: 'web',
    // sourceMap: true, // 这里打了 sourceMap，会导致 reactblog 打包失败，插件有冲突
  },
  plugins: [pluginReact(), pluginSass()],
});
