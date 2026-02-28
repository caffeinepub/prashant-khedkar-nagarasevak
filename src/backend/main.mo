import Array "mo:core/Array";
import Time "mo:core/Time";



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

  var grievanceCounter = 0;
  var galleryPhotoCounter = 0;
  var grievances : [GrievanceSubmission] = [];
  var galleryPhotos : [GalleryPhoto] = [];
  var projects : [Project] = [
    {
      id = 1;
      title = "Park Renovation";
      description = "Renovate the central park with new playground equipment.";
      status = "Completed";
      category = "Infrastructure";
    },
    {
      id = 2;
      title = "Road Repairs";
      description = "Fix potholes and resurface main roads in the district.";
      status = "In Progress";
      category = "Infrastructure";
    },
    {
      id = 3;
      title = "Community Center Programs";
      description = "Introduce new educational and recreational programs.";
      status = "Planned";
      category = "Community";
    },
  ];

  public shared ({ caller }) func submitGrievance(name : Text, mobile : Text, message : Text) : async Nat {
    let newGrievance : GrievanceSubmission = {
      id = grievanceCounter;
      name;
      mobile;
      message;
      timestamp = Time.now();
    };
    grievances := grievances.concat([newGrievance]);
    let currentId = grievanceCounter;
    grievanceCounter += 1;
    currentId;
  };

  public shared ({ caller }) func addGalleryPhoto(url : Text, caption : Text, sub : Text) : async Nat {
    let newPhoto : GalleryPhoto = {
      id = galleryPhotoCounter;
      url;
      caption;
      sub;
      timestamp = Time.now();
    };
    galleryPhotos := galleryPhotos.concat([newPhoto]);
    let currentId = galleryPhotoCounter;
    galleryPhotoCounter += 1;
    currentId;
  };

  public query ({ caller }) func getAllGrievances() : async [GrievanceSubmission] {
    grievances;
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    projects;
  };

  public query ({ caller }) func getAllGalleryPhotos() : async [GalleryPhoto] {
    galleryPhotos;
  };
};
