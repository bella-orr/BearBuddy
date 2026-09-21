# Functional Requirements

## Campus Navigation

- **FR-1.1:** The system shall display an interactive University of Cincinnati campus map.
- **FR-1.2:** The system shall allow users to search for campus buildings.
- **FR-1.3:** The system shall display building and classroom locations.
- **FR-1.4:** The system shall allow users to select a starting location and destination.
- **FR-1.5:** The system shall generate walking routes between selected locations.
- **FR-1.6:** The system shall display estimated walking times.
- **FR-1.7:** The system shall display construction or blocked pathway information when reliable data is available.
- **FR-1.8:** The system shall provide navigation through an appropriate mapping API.

## Schedule Management

- **FR-2.1:** The system shall allow users to manually enter and save class schedules.
- **FR-2.2:** The system shall allow users to view their scheduled classes.
- **FR-2.3:** The system shall allow users to edit or delete classes.
- **FR-2.4:** The system shall allow users to associate classes with buildings and classrooms.
- **FR-2.5:** The system shall use class locations to determine travel routes.
- **FR-2.6:** The system shall display estimated travel times between consecutive classes.
- **FR-2.7:** The system shall allow users to view their schedules by day or week.
- **FR-2.8:** The system shall identify potential scheduling or travel conflicts.
- **FR-2.9:** The system should integrate with the Canvas API if access and functionality are available.
- **FR-2.10:** The system should integrate with a personal calendar if feasible.

## Student Information and Security

- **FR-3.1:** The system shall authenticate users through an approved login system.
- **FR-3.2:** The system should support single sign-on (SSO) if access is available.
- **FR-3.3:** The system shall allow users to organize account and website information.
- **FR-3.4:** The system shall allow users to view and manage saved account information.
- **FR-3.5:** The system may identify and warn users about reused passwords if this feature is implemented.
- **FR-3.6:** The system shall include security features to protect user information.
- **FR-3.7:** The system shall restrict user information to authorized users.
- **FR-3.8:** The system shall allow users to manage their account settings.

## Backend and System Integration

- **FR-4.1:** The system shall provide backend services to support application functionality.
- **FR-4.2:** The frontend shall communicate with the backend through APIs.
- **FR-4.3:** The system shall store and retrieve schedule information.
- **FR-4.4:** The system shall retrieve mapping and location data through appropriate APIs.
- **FR-4.5:** The system shall handle API errors and display relevant messages to users.
- **FR-4.6:** The system shall validate user input before saving information.
- **FR-4.7:** The system shall support frontend and backend testing.