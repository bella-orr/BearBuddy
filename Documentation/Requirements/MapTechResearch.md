# Mapping Research within ReactNative

Top option is **Map-Libre**.

Map-Libre is a map rendering engine that is compatible and mainly used with React-Native mobile App Dev for iOS and Android.

The map style and tile source can come from OpenFreeMap, which is also highly compatible with React-Native and MapLibre. Implementation is relatively straightforward. This allows us to use free open street data and center a map around UC's main campus, which will then have preset locations so that we don't have to manually add everything ourselves. Although for our MVP we will not need to have every single location and route set. 

A automatic route calculation engine that is free, and open source is Valhalla. This is probably the most complex of the technologies to add, and is not strictly necessary unless we want the map to be able to calculate routes from the users current location, rather than have them type in a preset location.
Utilizing Valhalla would come far later in development after we had completed out MVP, and I think provides a more complete deliverable.


For storing custom routing information we could either store them in the app, or setup a database with GeoJSON mapping data that we could call with an API. I think that this is a decision that can be made later in Development depending on man hours and API development experience.

Backend could be developed with Node.js and Express to store information and routes.

This allows us to have high control over map development, including custom markers, custom routes and appearance.

React Native supported, open-source, free and lots of community support. API's are only necessary when including automatic navigation and mapping.

Has the ability to develop preset routes within a custom map.

Has the ability to display information about certain landmarks and features when they are clicked on.

Support both iOS and Android development.

## Recommended Development Path

1. React Native + MapLibre — get the mobile development environment running and render a basic interactive map.
2. OpenFreeMap + Campus Map — connect MapLibre to OpenFreeMap, center the map on UC, and configure basic controls.
3. UC Landmark GeoJSON — add 10–20 campus buildings/POIs with selectable markers.
4. First UC Route — create and display one verified preset campus route.
5. Multiple Routes — add campus tour, accessible, parking, athletics, and other preset routes.
6. UI/UX + Core MVP — complete route selection, landmark information, filters, route details, testing, and UI polish.
7. Location Features + Routing Preparation — add optional GPS location, permissions, and origin/destination selection.
8. Valhalla — integrate automatic route calculation between locations and from the user's current location.
9. Backend + Admin Functionality — implement Node/Express + PostgreSQL/PostGIS and allow route/landmark data to be managed outside the mobile application.
10. Integration, Testing & Final Build — test MapLibre, OpenFreeMap, Valhalla, backend services, devices, and produce the final stable build.

## Development Timeline

| **Week** | **Development Stage**           | **Main Goal**                                                                                     |
| -------- | ------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1        | Project Setup                   | React Native + MapLibre running in VS Code and Android/iOS development environments               |
| 2        | OpenFreeMap + Campus Map        | Connect OpenFreeMap, center map on UC, and configure basic map controls                           |
| 3        | Landmarks                       | Add 10–20 UC buildings/POIs using GeoJSON and selectable markers                                  |
| 4        | First Custom Route              | Build and display one verified preset UC campus route                                             |
| 5        | Multiple Routes                 | Add 3–4 selectable routes such as campus tour, accessible, athletics, and parking                 |
| 6        | UI/UX + Core MVP                | Route selection, landmark details, filters, route information, testing, and UI polish             |
| 7        | Location + Routing Preparation  | Add optional GPS, permissions, origin/destination selection, and prepare coordinates for routing  |
| 8        | Valhalla Routing                | Add automatic routing between selected locations and GPS coordinates                              |
| 9        | Backend + Admin                 | Node/Express API + PostgreSQL/PostGIS and basic route/landmark management                          |
| 10       | Integration + Testing           | Full-system testing, error handling, documentation, device validation, and final demo build       |

## Estimated Development Hours

| **Stage**                                      | **Team Hours/Week** | **Per Developer/Week** |
| ---------------------------------------------- | ------------------: | ---------------------: |
| Weeks 1–2: Setup + MapLibre + OpenFreeMap      |                8–12 |                    4–6 |
| Weeks 3–4: Landmarks + First Route             |                8–12 |                    4–6 |
| Weeks 5–6: Multiple Routes + Core MVP UI       |                8–12 |                    4–6 |
| Weeks 7–8: GPS + Valhalla                      |               10–16 |                    5–8 |
| Weeks 9–10: Backend + Admin + Integration      |               10–16 |                    5–8 |

## MVP Timeline

| **Week** | **MVP Goal**                                                        | **Approx. Team Hours** |
| -------- | ------------------------------------------------------------------- | ---------------------: |
| 1        | React Native + MapLibre setup and development builds working        |                   8–12 |
| 2        | OpenFreeMap UC basemap, camera controls, and map configuration      |                   8–12 |
| 3        | 10–20 UC landmarks with GeoJSON and marker interaction              |                   8–12 |
| 4        | First verified preset UC route                                      |                   8–12 |
| 5        | Multiple routes + route-selection functionality                     |                   8–12 |
| 6        | Complete core MVP, testing, fixes, UI polish, and device validation |                   8–12 |

## End-of-Week Deliverables

| **Week** | **Focus**                          | **End-of-Week Deliverable**                                                                                                                                                                      |
| -------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1        | Development Environment & MapLibre | React Native project runs on Android/iOS development build. MapLibre displays an interactive map. Project structure and Git repository established.                                              |
| 2        | OpenFreeMap & Campus Map           | OpenFreeMap integrated as the basemap. Map centered on UC with basic camera and map controls working.                                                                                            |
| 3        | UC Campus Data                     | At least 10–20 UC landmarks represented in GeoJSON with selectable markers and basic information.                                                                                               |
| 4        | First Custom Route                 | At least one complete preset UC route stored as GeoJSON and displayed through MapLibre over the OpenFreeMap basemap.                                                                             |
| 5        | Multiple Routes                    | At least 3–4 selectable routes available. Users can select, display, and switch between routes.                                                                                                  |
| 6        | UI/UX & Core MVP                   | Working MVP containing campus map, landmarks, preset routes, route selection, landmark/route information, improved controls, loading states, and UI polish.                                      |
| 7        | Location & Routing Preparation     | "Show My Location," permission handling, origin/destination selection, and coordinate handling implemented. Application prepared to send coordinates to Valhalla.                                |
| 8        | Valhalla                           | Valhalla routing integrated. Application can request an automatically calculated route and display the returned route through MapLibre.                                                          |
| 9        | Backend & Admin                    | Node/Express + PostgreSQL/PostGIS implemented if required. Routes and landmarks can be retrieved and managed through the backend rather than being hardcoded into the application.                |
| 10       | Testing, Bugs & Release            | Complete route verification, Valhalla testing, OpenFreeMap/MapLibre testing, device testing, API/network testing, documentation, bug fixes, and stable final build/demo.                          |