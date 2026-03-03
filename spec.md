# Prashant Khedkar - Nagarasevak

## Current State
- Full website with Navbar, Hero, About, Projects, Government Schemes, Civic Services, Information, Gallery, Contact/Grievance sections
- Admin panel with tabs: Grievances (view only), Gallery, Projects, Schemes, Civic Services, Team, Notifications, Ratings, Photos
- Backend stores grievances, gallery photos, projects, schemes, team members, notifications, site photos
- Grievances are collected but admin cannot reply; no citizen notification on reply
- Team members managed via localStorage (gallery upload supported)
- Gallery photo upload supports device gallery
- Auto-notifications when admin sends manual notification only (no auto-trigger on content add)
- Government schemes section has manual sync button but no auto-add from new preset schemes
- Contact section ends with grievance form; no HD photo showcase below it

## Requested Changes (Diff)

### Add
1. **Grievance Reply System**: Backend field `reply: Text` and `repliedAt: Int` on GrievanceSubmission. New `replyToGrievance(id, reply)` backend function. Admin Grievances tab gets inline "उत्तर द्या" button per grievance that opens a reply textarea. When admin submits reply, an `AppNotification` is auto-created titled with the citizen's name so they see it in the notification bell.
2. **HD Photos Section (after Contact/Grievance)**: A new "भैय्या खेडकर - HD फोटो" section rendered after the ContactSection in App.tsx. Admin controls it from a new "HD फोटो" tab in Admin Panel. Photos stored in backend (base64 or URL). Displayed in a masonry/grid layout on public site.
3. **Auto-notifications on Admin actions**: When admin adds a project, uploads a gallery photo, or adds a scheme, an AppNotification is automatically created with appropriate title/body (no manual input needed). Citizen notification bell picks this up.
4. **Team management with gallery upload**: Existing team management (localStorage) - upgrade to support direct device gallery photo upload (file input → base64) instead of only URL. Admin "टीम" tab updated to include a gallery/camera tap area like the Gallery tab already has.
5. **Auto-add new government schemes**: A preset list of newer central/state government schemes added to the initial `schemes` stable array in the backend, plus a frontend mechanism in GovernmentSchemesSection that checks for new schemes since last visit and adds them automatically with "नवीन" badge.

### Modify
- `GrievanceSubmission` type: add `reply` and `repliedAt` fields
- `getAllGrievances` return type updated
- Admin GrievancesTab: add reply UI per card
- `useAddProject`, `useAddGalleryPhoto`, `useAddScheme` hooks: call `addNotification` automatically after success
- Team tab in Admin: add file-input based photo upload (same as GalleryTab)
- GovernmentSchemesSection: show "नवीन" badge on recently-added schemes

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo`: add `reply`/`repliedAt` fields to `GrievanceSubmission`, add `replyToGrievance` function, add more preset schemes to initial `schemes` array
2. Update `backend.d.ts`: reflect new `GrievanceSubmission` shape, add `replyToGrievance` function signature
3. Update `useQueries.ts`: add `useReplyToGrievance` hook; update `useAddProject`/`useAddGalleryPhoto`/`useAddScheme` to call `addNotification` automatically after success
4. Update `AdminPage.tsx` GrievancesTab: add reply button + inline reply form per grievance card, show existing reply if present
5. Create `HDPhotosSection.tsx`: new public section with masonry grid, fetches from backend (uses existing `getAllGalleryPhotos` with a separate key prefix OR a new dedicated store — use a `hdPhotos` tag/prefix in caption, or simpler: new tab in admin, same gallery backend with `sub="hd"` marker)
6. Update `App.tsx`: render `HDPhotosSection` after `ContactSection`
7. Update Admin Panel: add "HD फोटो" tab
8. Update team tab in Admin: add file input for photo upload from gallery
9. Update `GovernmentSchemesSection.tsx`: display "नवीन" badge for schemes added in last 30 days
