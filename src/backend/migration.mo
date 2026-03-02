import Array "mo:core/Array";

module {
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

  type OldActor = {
    var grievanceCounter : Nat;
    var galleryPhotoCounter : Nat;
    var projectCounter : Nat;
    var schemeCounter : Nat;
    var ratingCounter : Nat;
    var teamMemberCounter : Nat;
    var civilServiceCounter : Nat;
    var schemes : [Scheme];
    var projects : [Project];
    var teamMembers : [TeamMember];
    var civilServices : [CivilService];
    var grievances : [GrievanceSubmission];
    var galleryPhotos : [GalleryPhoto];
    var projectRatings : [ProjectRating];
  };

  type NewActor = {
    var grievanceCounter : Nat;
    var galleryPhotoCounter : Nat;
    var projectCounter : Nat;
    var schemeCounter : Nat;
    var ratingCounter : Nat;
    var teamMemberCounter : Nat;
    var civilServiceCounter : Nat;
    var notificationCounter : Nat;
    var lastReadGrievanceCount : Nat;
    var navbarPhotoData : Text;
    var heroPhotoData : Text;
    var aboutPhotoData : Text;
    var grievances : [GrievanceSubmission];
    var galleryPhotos : [GalleryPhoto];
    var projectRatings : [ProjectRating];
    var notifications : [AppNotification];
    var schemes : [Scheme];
    var projects : [Project];
    var teamMembers : [TeamMember];
    var civilServices : [CivilService];
  };

  public func run(old : OldActor) : NewActor {
    let newActor : NewActor = {
      var grievanceCounter = old.grievanceCounter;
      var galleryPhotoCounter = old.galleryPhotoCounter;
      var projectCounter = old.projectCounter;
      var schemeCounter = old.schemeCounter;
      var ratingCounter = old.ratingCounter;
      var teamMemberCounter = old.teamMemberCounter;
      var civilServiceCounter = old.civilServiceCounter;
      var notificationCounter = 0;
      var lastReadGrievanceCount = 0;
      var navbarPhotoData = "";
      var heroPhotoData = "";
      var aboutPhotoData = "";
      var grievances = old.grievances;
      var galleryPhotos = old.galleryPhotos;
      var projectRatings = old.projectRatings;
      var notifications : [AppNotification] = [];
      var schemes = old.schemes;
      var projects = old.projects;
      var teamMembers = old.teamMembers;
      var civilServices = old.civilServices;
    };
    newActor;
  };
};
