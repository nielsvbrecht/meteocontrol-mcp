# Implementation Plan: Feature Branch Testing and Beta Building

## Phase 1: Pipeline Configuration Update [checkpoint: 4d1cbfa]
- [x] Task: Update Workflow Triggers (2d8adeb)
  - [x] Modify `.github/workflows/main.yml` to include all branches in the `push` event.
  - [x] Verify the trigger logic with a local dry-run if possible.
- [x] Task: Implement Conditional Beta Logic (d64fef1)
  - [x] Add logic to the `test` job to set an output variable indicating if the branch is `main` or a feature branch.
  - [x] Update the `release` job to also trigger on feature branches, but with a different naming convention.
- [x] Task: Conductor - User Manual Verification 'Pipeline Configuration Update' (Protocol in workflow.md) (4d1cbfa)

## Phase 2: Docker Tagging and Registry Push
- [x] Task: Configure Docker Tagging for Beta (b59e396)
  - [x] Update the `metadata-action` step in `main.yml` to support branch-based tagging with `-beta` suffix.
  - [x] Ensure the existing `v*` tag logic for main releases remains unaffected.
- [ ] Task: Enable GHCR Push for Beta Images
  - [ ] Update the `build-and-push-action` to push images for feature branches.
  - [ ] Verify that the `permissions` for `packages: write` are correctly set for all jobs.
- [ ] Task: Conductor - User Manual Verification 'Docker tagging and Registry Push' (Protocol in workflow.md)

## Phase 3: Verification and Documentation
- [ ] Task: End-to-End Pipeline Testing
  - [ ] Push a change to a new feature branch and verify the "beta" build triggers and pushes to GHCR.
  - [ ] Push a change to `main` (or a test release tag) and verify the standard release logic still works.
- [ ] Task: Update README with Beta Instructions
  - [ ] Add a section to `README.md` explaining how to find and use beta images from feature branches.
- [ ] Task: Conductor - User Manual Verification 'Verification and Documentation' (Protocol in workflow.md)
