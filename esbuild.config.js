const esbuild = require('esbuild');
const sassPlugin = require('esbuild-sass-plugin').sassPlugin;

esbuild.build({
  entryPoints: {
    'application': 'app/assets/javascripts/application.js',
    'activity': 'app/assets/javascripts/packs/activity.js',
    // Update other entry points as needed
  },
  bundle: true,
  outdir: 'app/assets/builds',
  sourcemap: true,
  splitting: true, // Required for multiple entry points
  format: 'esm',  // Required for multiple entry points
  plugins: [sassPlugin()],
}).catch(() => process.exit(1));
