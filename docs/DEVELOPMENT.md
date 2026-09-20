## Development

For the full picture of how the pieces fit together — the generation pipeline, build
configuration, and design decisions — see [ARCHITECTURE.md](ARCHITECTURE.md).

### Project Structure

- `svg/`: Raw SVG files organized by category (`adinkra`, `general`, `national`).
- `src/icons/components/`: Generated React components (git-ignored).
- `src/icons/props.ts`: The shared `IconProps` interface and `trueSize` helper.
- `src/index.ts`: Generated barrel file — the package entry point.
- `src/stories/`: Generated Storybook stories (git-ignored).
- `custom_scripts/`: Build scripts for generating components and stories.

### Available Scripts

- `pnpm run generate:icons`: Generates components from `svg/` into `src/icons/components/`. Add `--overwrite` to regenerate existing ones.
- `pnpm run generate:stories <path_to_components>`: Generates Storybook stories for components in the specified directory.
- `pnpm run dir:rename <folder>`: Normalizes SVG filenames in a folder to PascalCase.
- `pnpm run dev`: Starts the Vite playground (icon browser).
- `pnpm run storybook`: Starts the Storybook development server.
- `pnpm run build-storybook`: Builds the Storybook static site.
- `pnpm run build`: Regenerates icons, type-checks, and builds the library for production.
- `pnpm run lint`: Lints the project.

> **Note:** Components and stories are git-ignored, so a fresh clone has none until you run
> `pnpm run generate:icons`.

### Adding New Icons

1. Add your `.svg` file to the appropriate subdirectory in `svg/` (e.g. `svg/adinkra/`).
2. Make sure it meets the [SVG requirements](CONTRIBUTING.md#svg-requirements) — `viewBox="0 0 24 24"`, `fill="currentColor"`, PascalCase filename. CI enforces these.
3. Generate the component: `pnpm run generate:icons`.
4. Generate stories for the new components: `pnpm run generate:stories src/icons/components/<category>`.

> If you **delete or rename** an SVG, also delete `src/index.ts` before regenerating — the
> generator only appends exports, it never removes stale ones.

## CI/CD

This project uses GitHub Actions for continuous integration and delivery.

### Workflow

- **Build & Test**: Every pull request targeting the `master` branch triggers a build and lint check.
- **Release**: Merging or pushing to the `master` branch will trigger a release to NPM.
- **Validation**: Every PR to dev will trigger a validation check for the svg files to ensure they meet the required standards.
- **Dev Release**: Merging or pushing to the `dev` branch will trigger a release on github.
