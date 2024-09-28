import type { HomeLayoutProps } from 'fumadocs-ui/home-layout';
import type { DocsLayoutProps } from 'fumadocs-ui/layout';
import { source } from './source';
 
export const baseOptions: HomeLayoutProps = {
  nav: {
    title: 'CarbonCraft'
  },
};

export const docsOptions: DocsLayoutProps = {
	...baseOptions,
	tree: source.pageTree,
	nav: {
		...baseOptions.nav,
		transparentMode: "none",
		children: undefined
	}
}