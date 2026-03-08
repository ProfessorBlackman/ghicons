## Development

### Project Structure

- `src/icons/svg`: Raw SVG files organized by category.
- `src/icons/components`: Generated React components.
- `src/stories`: Generated Storybook stories.
- `custom_scripts`: Build scripts for generating components and stories.

### Available Scripts

- `pnpm run generate:stories -- <path_to_components>`: Generates Storybook stories for components in the specified directory.
- `pnpm run storybook`: Starts the Storybook development server.
- `pnpm run build-storybook`: Builds the Storybook static site.
- `pnpm run build`: Builds the library for production.
- `pnpm run lint`: Lints the project.

### Adding New Icons

1. Add your `.svg` file to the appropriate subdirectory in `src/icons/svg/`.
2. Run the corresponding generation script (e.g., `npm run generate:icons`).
3. Generate stories for the new components: `npm run generate:stories -- src/icons/components/<category>`.

## CI/CD

This project uses GitHub Actions for continuous integration and delivery.

### Workflow

- **Build & Test**: Every pull request targeting the `master` branch triggers a build and lint check.
- **Release**: Merging or pushing to the `master` branch will trigger a release to NPM.
- **Validation**: Every PR to dev will trigger a validation check for the svg files to ensure they meet the required standards.
- **Dev Release**: Merging or pushing to the `dev` branch will trigger a release on github.
