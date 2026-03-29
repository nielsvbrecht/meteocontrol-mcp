# Specification: Fix MeteoControl API Authentication Logic

## Goal
Correct the authentication mechanism for the MeteoControl VCOM API v2 to require an API Key, Username, and Password.

## Scope
- Update `MeteoControlApi` to send `X-API-KEY` header and use Basic Auth for user credentials.
- Update `MeteoControlServer` to read `METEOCONTROL_API_KEY`, `METEOCONTROL_USER`, and `METEOCONTROL_PASSWORD`.
- Update all relevant tests to reflect the new credential structure.
- Update documentation (README.md) and project configuration.

## Deliverables
- Fixed API client and server implementation.
- Updated test suite passing with new authentication logic.
- Accurate documentation for environment variables.
