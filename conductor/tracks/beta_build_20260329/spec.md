# Specification: Feature Branch Testing and Beta Building

## Goal
Enhance the existing CI/CD pipeline to support automated testing and Docker image building for all non-main branches, with images pushed to GHCR using a "-beta" suffix.

## Scope
- Update `.github/workflows/main.yml` to trigger on all branch pushes.
- Implement conditional logic in the pipeline to distinguish between `main` releases and "beta" builds.
- Configure Docker tagging to append `-beta` to images built from non-main branches.
- Ensure all beta images are pushed to the GitHub Container Registry (GHCR).

## Functional Requirements
- **Universal Triggers**: The pipeline must run linting, building, and unit tests for every push to any branch.
- **Beta Build Stage**: For non-main branches (e.g., `feature/*`, `fix/*`), the pipeline must build a Docker image.
- **Beta Tagging**: Beta images must be tagged with `<branch-name>-beta`.
- **GHCR Push**: Automated push of beta images to `ghcr.io`.

## Non-Functional Requirements
- **Consistency**: Maintain the same security scanning and code quality checks used for the `main` branch.
- **Performance**: Optimize the build process to handle frequent pushes from feature branches efficiently.

## Acceptance Criteria
- Pushing to a feature branch triggers the "Test and Scan" job.
- Pushing to a feature branch triggers a Docker build and push to GHCR.
- The resulting image in GHCR has the correct branch-based tag with a `-beta` suffix.
- Pushing to `main` (or a release tag) continues to follow the existing release logic.

## Out of Scope
- Automated deployment of beta images to staging/production environments.
- Cleanup of old beta images in GHCR.
