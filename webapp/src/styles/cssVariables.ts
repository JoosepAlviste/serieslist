// .css.ts files processed by vanilla-extract do not go through Vite, but are
// built with esbuild directly. This means that importing special files that
// work through Vite plugins (like .svg files) do not work. This file re-exports
// variables from style files so that they can be imported without accidentally
// importing other irrelevant files.
//
// I think that this issue is related to this:
// https://github.com/vanilla-extract-css/vanilla-extract/issues/665

export { iconColorVar } from '@/components/Icon/Icon.css'
