import {defineConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';

export default defineConfig({
    plugins: [pluginReact()],
    source: {entry: {index: './src/main.tsx'}},
    server: {port: 3000},
    html: {title: 'SRS Live Console'},
});
