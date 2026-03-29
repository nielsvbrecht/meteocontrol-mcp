# Implementation Plan: Fix MeteoControl API Authentication Logic

## Phase 1: API Client and Server Update
- [x] Task: Update MeteoControlApi (c1f5104)
  - [ ] Write failing tests for the new 3-credential auth logic.
  - [ ] Update `MeteoControlApi` class to handle `X-API-KEY` header and Basic Auth.
- [x] Task: Update MeteoControlServer (f9185ba)
  - [ ] Update server to read 3 environment variables.
  - [ ] Update server tests to mock the new configuration.
- [~] Task: Conductor - User Manual Verification 'API Client and Server Update' (Protocol in workflow.md)

## Phase 2: Documentation and Verification
- [ ] Task: Update Project Documentation
  - [ ] Update README.md with the new environment variable requirements.
  - [ ] Update `conductor/tech-stack.md` if necessary.
- [ ] Task: Final Verification
  - [ ] Update integration tests to use the new credential structure.
  - [ ] Run full project check (`npm run check`).
- [ ] Task: Conductor - User Manual Verification 'Documentation and Verification' (Protocol in workflow.md)
