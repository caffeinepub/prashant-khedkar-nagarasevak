# Prashant Khedkar - Nagarasevak

## Current State
- Website for नगरसेवक प्रशांत उर्फ भैय्या खेडकर, प्रभाग क्र. ८, कोल्हापूर महानगरपालिका
- Sections: Navbar, Hero, About, Projects, Gallery, Contact/Grievance, Footer
- Backend supports: submitGrievance, getAllGrievances, addGalleryPhoto, getAllGalleryPhotos, getAllProjects
- AdminGalleryPanel: basic dialog to add gallery photos by URL (no password protection)
- No admin panel to view grievances or manage projects

## Requested Changes (Diff)

### Add
- Admin Panel page (route `/admin`) accessible from a hidden or small link in the footer
- Admin login with password protection (password stored/verified in backend)
- Admin dashboard with 3 tabs:
  1. **तक्रारी** (Grievances): View all submitted grievances with name, mobile, message, timestamp
  2. **गॅलरी** (Gallery): Add new photos (URL + caption + sub), delete existing photos
  3. **विकास कामे** (Projects): Add new projects (title, description, category, status), delete existing projects
- Backend: `adminLogin(password)` to verify password, `deleteGalleryPhoto(id)`, `addProject(title, description, category, status)`, `deleteProject(id)`, `updateAdminPassword(oldPassword, newPassword)`

### Modify
- AdminGalleryPanel: Remove the existing simple gallery-only admin button from GallerySection (consolidate into full Admin Panel)
- Footer: Add a small "Admin" link that navigates to `/admin`
- useQueries.ts: Add hooks for new admin backend functions

### Remove
- AdminGalleryPanel component as a standalone widget (it will be part of the Admin Panel page)

## Implementation Plan
1. Update backend main.mo: add adminPassword state, adminLogin(), deleteGalleryPhoto(), addProject(), deleteProject(), updateAdminPassword() functions
2. Regenerate backend.d.ts to include new function signatures
3. Create AdminPage.tsx with:
   - Password login screen (session stored in localStorage)
   - Tabbed dashboard (Grievances / Gallery / Projects)
   - Grievances tab: table/list of all submissions
   - Gallery tab: add photo form + list with delete button
   - Projects tab: add project form + list with delete button, status selector
4. Add route for `/admin` in App.tsx using React Router or conditional rendering
5. Update useQueries.ts with new hooks
6. Update Footer.tsx to include small Admin link
7. Remove AdminGalleryPanel from GallerySection or keep it (consolidate)
