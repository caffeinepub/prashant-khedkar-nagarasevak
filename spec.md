# Prashant Khedkar - Nagarasevak

## Current State
नगरसेवक प्रशांत उर्फ भैय्या खेडकर यांची पूर्ण वेबसाइट आहे:
- Hero section, About section (१० वर्षे सेवा), Projects, Govt Schemes, Civic Services, Information, Gallery, Contact, Footer
- Admin Panel (/admin) - password: #BK1234, Gallery/Projects/Schemes/Civic/Team/Ratings tabs
- Gallery tab मध्ये mobile gallery upload (file picker) आधीच आहे
- Floating contact buttons (WhatsApp, Telegram) उजव्या खालच्या कोपऱ्यात
- Footer मध्ये पत्ता: "प्रभाग क्र. ८, कोल्हापूर - ४१६०१२"
- Navbar मध्ये icon: `/assets/uploads/IMG-20260301-WA0009-1.jpg` (local file)
- Hero आणि About section मध्ये same local photo

## Requested Changes (Diff)

### Add
1. **Calling बटण (Home Page)** - Hero section आणि Navbar मध्ये "📞 कॉल करा" बटण जोडणे जे दोन नंबर दाखवते:
   - नगरसेवक: +91 97641 51234
   - दुसरा नंबर: +91 95298 83084
   - मोबाईलवर tap करताच direct call होईल, desktop वर दोन्ही नंबर दाखवणारा dropdown/modal येईल
2. **Admin - Hero Photo Management** - Admin panel मध्ये नवीन "फोटो" tab जोडणे:
   - Navbar icon photo (गोल icon) - gallery मधून upload करा
   - Hero portrait photo (उजवीकडे मोठा फोटो) - gallery मधून upload करा
   - About section photo - gallery मधून upload करा
   - सर्व photos file picker (mobile gallery) वापरून जोडता येतील, backend मध्ये base64 save होईल
   - Upload केलेला photo persistent राहील (backend stable var मध्ये)
3. **Notifications** - App-based in-app notification system:
   - Admin ला नवीन तक्रार आल्यावर notification badge (लाल dot) Admin panel header मध्ये
   - User ला (home page visitor ला) floating notification bell icon जोडणे - Admin Panel मधून "सर्व नागरिकांना" push notification पाठवता येईल
   - Browser Notification API वापरणे (permission request करणे)

### Modify
1. **About Section** - "१० वर्षे" → "**पंधरा वर्षे** (१५ वर्षे)" सर्व ठिकाणी बदलणे
2. **Footer/Contact पत्ता** - सध्याचा generic पत्ता → **"611 ए वॉर्ड खेडकर गल्ली, बोर तालीम चौक, लक्षतीर्थ वसाहत, कोल्हापूर"**
3. **Backend** - नवीन stable vars जोडणे:
   - `navbarPhotoData: Text` - base64 navbar icon
   - `heroPhotoData: Text` - base64 hero portrait
   - `aboutPhotoData: Text` - base64 about section photo
   - `notifications: [Notification]` - admin-created notifications
   - `unreadGrievanceCount: Nat` - unread tally
4. **Admin Panel Gallery Tab** - आधीच file picker आहे, ते ठेवायचे. नवीन "फोटो व्यवस्थापन" tab वेगळा असेल.

### Remove
- About section मधील "परिचय section मध्ये फोटो" - ते admin managed photo ने replace होईल (about photo)

## Implementation Plan
1. Backend मध्ये नवीन types आणि stable vars जोडणे: sitePhotos (navbar, hero, about), notifications array, addNotification/getAllNotifications functions, getSitePhoto/setSitePhoto functions, getUnreadGrievanceCount/markGrievancesRead
2. Generate Motoko backend
3. Frontend - AboutSection.tsx: "१० वर्षे" → "१५ वर्षे" update
4. Frontend - Footer.tsx: पत्ता update
5. Frontend - HeroSection.tsx: Calling बटण जोडणे (Phone icon, modal with two numbers)
6. Frontend - Navbar.tsx: Calling बटण जोडणे (Phone icon)
7. Frontend - HeroSection.tsx, AboutSection.tsx, Navbar.tsx: Dynamic photo loading from backend
8. Frontend - AdminPage.tsx: नवीन "फोटो" tab - navbar/hero/about photo upload via gallery
9. Frontend - AdminPage.tsx: Notifications tab - admin ला notifications पाठवण्याचा पर्याय
10. Frontend - App.tsx/FloatingContactButtons.tsx: Notification bell icon - user ला browser notifications
