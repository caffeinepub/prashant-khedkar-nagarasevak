# Prashant Khedkar - Nagarasevak

## Current State
Full-stack website for Ward 8, Kolhapur with: Hero, About, Projects, Government Schemes, Gallery, Contact sections, Admin Panel with tabs for Grievances, Gallery, Projects, Schemes, and Password Change.

Projects are displayed as cards with status badges (पूर्ण / प्रगतीत / नियोजित). No rating mechanism exists.

## Requested Changes (Diff)

### Add
- **Rating type** in backend: `ProjectRating { projectId: Nat; rating: Nat; comment: Text; name: Text; timestamp: Int }`
- **Backend functions**: `submitRating(projectId, rating, name, comment)`, `getRatingsForProject(projectId)`, `getAverageRating(projectId)` returning average (1-5 stars) and count
- **Star rating UI on completed project cards**: Show current average + count. A "रेटिंग द्या" (Rate) button opens a dialog to select 1-5 stars, enter name and optional comment, then submit
- **Admin Panel "रेटिंग" tab**: View all ratings per project - project title, average stars, list of individual ratings with name, stars, comment, date

### Modify
- `ProjectsSection.tsx`: On completed projects (status "पूर्ण"), show average star rating and count below description. Add "रेटिंग द्या" button that opens a rating dialog
- `AdminPage.tsx`: Add a new "रेटिंग" tab in the Dashboard tabs to view ratings

### Remove
- Nothing

## Implementation Plan
1. Update `main.mo` to add `ProjectRating` type and rating functions (`submitRating`, `getRatingsForProject`, `getAverageRating`, `getAllRatings`)
2. Update `backend.d.ts` to reflect new types and functions
3. Update `backend.ts` to include new function bindings
4. Update `useQueries.ts` hooks to add `useSubmitRating`, `useGetRatingsForProject`, `useGetAverageRating`
5. Update `ProjectsSection.tsx` to show star rating display + "रेटिंग द्या" button and dialog on completed project cards
6. Update `AdminPage.tsx` to add "रेटिंग" tab showing per-project ratings
