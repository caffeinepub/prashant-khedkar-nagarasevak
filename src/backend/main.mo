import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Migration "migration";

(with migration = Migration.run)
actor {
  type GrievanceSubmission = {
    id : Nat;
    name : Text;
    mobile : Text;
    message : Text;
    timestamp : Int;
  };

  type Project = {
    id : Nat;
    title : Text;
    description : Text;
    status : Text;
    category : Text;
  };

  type GalleryPhoto = {
    id : Nat;
    url : Text;
    caption : Text;
    sub : Text;
    timestamp : Int;
  };

  type Scheme = {
    id : Nat;
    title : Text;
    description : Text;
    status : Text;
    category : Text;
    benefit : Text;
    eligibility : Text;
  };

  type ProjectRating = {
    id : Nat;
    projectId : Nat;
    rating : Nat;
    name : Text;
    comment : Text;
    timestamp : Int;
  };

  type TeamMember = {
    id : Nat;
    name : Text;
    role : Text;
    photoUrl : Text;
    mobile : Text;
    description : Text;
  };

  type CivilService = {
    id : Nat;
    title : Text;
    description : Text;
    category : Text;
    url : Text;
    isActive : Bool;
  };

  type AppNotification = {
    id : Nat;
    title : Text;
    body : Text;
    timestamp : Int;
  };

  let adminPassword : Text = "#BK1234";

  stable var grievanceCounter : Nat = 0;
  stable var galleryPhotoCounter : Nat = 0;
  stable var projectCounter : Nat = 3;
  stable var schemeCounter : Nat = 4;
  stable var ratingCounter : Nat = 0;
  stable var teamMemberCounter : Nat = 1;
  stable var civilServiceCounter : Nat = 12;
  stable var notificationCounter : Nat = 0;

  stable var lastReadGrievanceCount : Nat = 0;

  stable var navbarPhotoData : Text = "";
  stable var heroPhotoData : Text = "";
  stable var aboutPhotoData : Text = "";

  stable var grievances : [GrievanceSubmission] = [];
  stable var galleryPhotos : [GalleryPhoto] = [];
  stable var projectRatings : [ProjectRating] = [];
  stable var notifications : [AppNotification] = [];

  stable var schemes : [Scheme] = [
    { id = 0; title = "प्रधानमंत्री आवास योजना (शहरी)"; description = "गरीबांना शहरी भागात घर मिळवण्यास मदत करणारी योजना."; status = "active"; category = "गृहनिर्माण"; benefit = "घरांसाठी सब्सिडी"; eligibility = "नियमित गरजूंनाच" },
    { id = 1; title = "स्वच्छ भारत मिशन (शहरी)"; description = "शहरांमध्ये स्वच्छता आणि परिसर व्यवस्था सुधारण्याची योजना."; status = "active"; category = "स्वच्छता"; benefit = "स्वच्छता विकास निधी"; eligibility = "सर्व नागरीकांसाठी" },
    { id = 2; title = "राजीव गांधी घरकुल योजना"; description = "विकासकांच्या सहाय्याने घरकुल बांधण्याची योजना."; status = "past"; category = "गृहनिर्माण"; benefit = "घर बांधणी अनुदान"; eligibility = "ग्रामीण गरजूंसाठी" },
    { id = 3; title = "अमृत २.० - पाणीपुरवठा व सांडपाणी"; description = "शहरी पाणीपुरवठा सुधारण्यासाठी राष्ट्रीय योजना."; status = "upcoming"; category = "पाणी व स्वच्छता"; benefit = "पाणीपुरवठा सुविधा"; eligibility = "सर्व गुणवत्ता आवश्यक" },
  ];

  stable var projects : [Project] = [
    { id = 0; title = "पार्क नूतनीकरण"; description = "केंद्रिय बागेला नवीन खेळांची साधने बसविणे."; status = "पूर्ण झाले"; category = "विकासकामे" },
    { id = 1; title = "रोड दुरुस्ती"; description = "मुख्य मार्गांची खड्डे बुजविणे आणि पुनःनिर्माण करणे."; status = "चालू"; category = "विकासकामे" },
    { id = 2; title = "समुदाय केंद्र कार्यक्रम"; description = "शैक्षणिक आणि मनोरंजक कार्यक्रम सुरू करणे."; status = "योजना"; category = "समाजकल्याण" },
  ];

  stable var teamMembers : [TeamMember] = [
    { id = 0; name = "प्रशांत उर्फ भैय्या खेडकर"; role = "नगरसेवक, प्रभाग क्र. २"; photoUrl = "/assets/uploads/IMG_20260228_195714-1-1.jpg"; mobile = "+91 97641 51234"; description = "कोल्हापूर महानगरपालिका प्रभाग क्र. २ चे नगरसेवक" },
  ];

  stable var civilServices : [CivilService] = [
    { id = 0; title = "मिळकत कर भरणा"; description = "KMC पोर्टलवर मिळकत कर ऑनलाइन भरा"; category = "कर सेवा"; url = "https://web.kolhapurcorporation.gov.in/propertytax"; isActive = true },
    { id = 1; title = "मिळकत कर थकबाकी तपासा"; description = "तुमची कर थकबाकी ऑनलाइन तपासा"; category = "कर सेवा"; url = "https://web.kolhapurcorporation.gov.in/propertytax"; isActive = true },
    { id = 2; title = "पाणीपट्टी थकबाकी"; description = "पाण्याची थकबाकी तपासा"; category = "पाणी सेवा"; url = "https://web.kolhapurcorporation.gov.in/wts"; isActive = true },
    { id = 3; title = "KMC नागरिक पोर्टल"; description = "सर्व नागरिक सेवांसाठी KMC पोर्टल"; category = "नागरिक सेवा"; url = "https://web.kolhapurcorporation.gov.in"; isActive = true },
    { id = 4; title = "जन्म नोंदणी"; description = "जन्म प्रमाणपत्रासाठी अर्ज करा"; category = "दस्तऐवज"; url = "https://aaplesarkar.mahaonline.gov.in"; isActive = true },
    { id = 5; title = "मृत्यू नोंदणी"; description = "मृत्यू प्रमाणपत्रासाठी अर्ज करा"; category = "दस्तऐवज"; url = "https://aaplesarkar.mahaonline.gov.in"; isActive = true },
    { id = 6; title = "परवाना थकबाकी"; description = "परवाना थकबाकी तपासा"; category = "परवाने"; url = "https://web.kolhapurcorporation.gov.in"; isActive = true },
    { id = 7; title = "RTI माहिती"; description = "माहिती अधिकार कायद्यांतर्गत अर्ज"; category = "नागरिक सेवा"; url = "https://web.kolhapurcorporation.gov.in"; isActive = true },
    { id = 8; title = "E-Tender"; description = "निविदा माहिती पाहा"; category = "निविदा"; url = "https://web.kolhapurcorporation.gov.in"; isActive = true },
    { id = 9; title = "भरती जाहिराती"; description = "KMC भरती माहिती"; category = "निविदा"; url = "https://web.kolhapurcorporation.gov.in"; isActive = true },
    { id = 10; title = "आपत्ती व्यवस्थापन"; description = "आपत्कालीन सेवा माहिती"; category = "आपत्कालीन"; url = "https://web.kolhapurcorporation.gov.in"; isActive = true },
    { id = 11; title = "शासन निर्णय"; description = "KMC शासन निर्णय व परिपत्रके"; category = "माहिती"; url = "https://web.kolhapurcorporation.gov.in"; isActive = true },
  ];

  public func submitGrievance(name : Text, mobile : Text, message : Text) : async Nat {
    let newGrievance : GrievanceSubmission = { id = grievanceCounter; name; mobile; message; timestamp = Time.now() };
    grievances := grievances.concat([newGrievance]);
    let currentId = grievanceCounter;
    grievanceCounter += 1;
    currentId;
  };

  public query func getAllGrievances() : async [GrievanceSubmission] { grievances };

  public func addGalleryPhoto(url : Text, caption : Text, sub : Text) : async Nat {
    let newPhoto : GalleryPhoto = { id = galleryPhotoCounter; url; caption; sub; timestamp = Time.now() };
    galleryPhotos := galleryPhotos.concat([newPhoto]);
    let currentId = galleryPhotoCounter;
    galleryPhotoCounter += 1;
    currentId;
  };

  public func deleteGalleryPhoto(id : Nat) : async Bool {
    galleryPhotos := galleryPhotos.filter(func(p : GalleryPhoto) : Bool { p.id != id });
    true;
  };

  public query func getAllGalleryPhotos() : async [GalleryPhoto] { galleryPhotos };

  public func addProject(title : Text, description : Text, category : Text, status : Text) : async Nat {
    let newProject : Project = { id = projectCounter; title; description; category; status };
    projects := projects.concat([newProject]);
    let currentId = projectCounter;
    projectCounter += 1;
    currentId;
  };

  public func deleteProject(id : Nat) : async Bool {
    projects := projects.filter(func(p : Project) : Bool { p.id != id });
    true;
  };

  public query func getAllProjects() : async [Project] { projects };

  public func adminLogin(password : Text) : async Bool {
    Text.equal(password, adminPassword);
  };

  public func addScheme(title : Text, description : Text, category : Text, status : Text, benefit : Text, eligibility : Text) : async Nat {
    let newScheme : Scheme = { id = schemeCounter; title; description; category; status; benefit; eligibility };
    schemes := schemes.concat([newScheme]);
    let currentId = schemeCounter;
    schemeCounter += 1;
    currentId;
  };

  public func deleteScheme(id : Nat) : async Bool {
    schemes := schemes.filter(func(s : Scheme) : Bool { s.id != id });
    true;
  };

  public query func getAllSchemes() : async [Scheme] { schemes };

  public func submitRating(projectId : Nat, rating : Nat, name : Text, comment : Text) : async Nat {
    let newRating : ProjectRating = { id = ratingCounter; projectId; rating; name; comment; timestamp = Time.now() };
    projectRatings := projectRatings.concat([newRating]);
    let currentId = ratingCounter;
    ratingCounter += 1;
    currentId;
  };

  public query func getRatingsForProject(projectId : Nat) : async [ProjectRating] {
    projectRatings.filter(func(r : ProjectRating) : Bool { r.projectId == projectId });
  };

  public query func getAverageRating(projectId : Nat) : async { averageRating : Nat; totalRatings : Nat } {
    let filtered = projectRatings.filter(func(r : ProjectRating) : Bool { r.projectId == projectId });
    let total = filtered.size();
    if (total == 0) { return { averageRating = 0; totalRatings = 0 } };
    var sum : Nat = 0;
    for (r in filtered.vals()) { sum += r.rating };
    { averageRating = (sum * 10) / total; totalRatings = total };
  };

  public query func getAllRatings() : async [ProjectRating] { projectRatings };

  public func addTeamMember(name : Text, role : Text, photoUrl : Text, mobile : Text, description : Text) : async Nat {
    let newMember : TeamMember = { id = teamMemberCounter; name; role; photoUrl; mobile; description };
    teamMembers := teamMembers.concat([newMember]);
    let currentId = teamMemberCounter;
    teamMemberCounter += 1;
    currentId;
  };

  public func deleteTeamMember(id : Nat) : async Bool {
    teamMembers := teamMembers.filter(func(m : TeamMember) : Bool { m.id != id });
    true;
  };

  public query func getAllTeamMembers() : async [TeamMember] { teamMembers };

  public func addCivilService(title : Text, description : Text, category : Text, url : Text) : async Nat {
    let newService : CivilService = { id = civilServiceCounter; title; description; category; url; isActive = true };
    civilServices := civilServices.concat([newService]);
    let currentId = civilServiceCounter;
    civilServiceCounter += 1;
    currentId;
  };

  public func toggleCivilService(id : Nat, isActive : Bool) : async Bool {
    civilServices := civilServices.map(func(s : CivilService) : CivilService {
      if (s.id == id) { { id = s.id; title = s.title; description = s.description; category = s.category; url = s.url; isActive = isActive } } else { s };
    });
    true;
  };

  public func deleteCivilService(id : Nat) : async Bool {
    civilServices := civilServices.filter(func(s : CivilService) : Bool { s.id != id });
    true;
  };

  public query func getAllCivilServices() : async [CivilService] { civilServices };

  public query func getSitePhoto(photoKey : Text) : async Text {
    if (Text.equal(photoKey, "navbar")) { return navbarPhotoData } else if (Text.equal(photoKey, "hero")) { return heroPhotoData } else if (Text.equal(photoKey, "about")) { return aboutPhotoData } else { return "" };
  };

  public func setSitePhoto(photoKey : Text, data : Text) : async Bool {
    if (Text.equal(photoKey, "navbar")) {
      navbarPhotoData := data;
      true;
    } else if (Text.equal(photoKey, "hero")) {
      heroPhotoData := data;
      true;
    } else if (Text.equal(photoKey, "about")) {
      aboutPhotoData := data;
      true;
    } else {
      false;
    };
  };

  public func addNotification(title : Text, body : Text) : async Nat {
    let newNotification : AppNotification = { id = notificationCounter; title; body; timestamp = Time.now() };
    notifications := [newNotification].concat(notifications);
    let currentId = notificationCounter;
    notificationCounter += 1;
    currentId;
  };

  public query func getAllNotifications() : async [AppNotification] { notifications };

  public query func getUnreadNotificationCount() : async Nat { notifications.size() };

  public func markAllNotificationsRead() : async Bool {
    notifications := [];
    true;
  };

  public query func getUnreadGrievanceCount() : async Nat { grievances.size() - lastReadGrievanceCount };

  public func markGrievancesRead() : async Bool {
    lastReadGrievanceCount := grievances.size();
    true;
  };
};
