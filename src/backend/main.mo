import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Iter "mo:core/Iter";
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

  var adminPassword = "admin123";
  var grievanceCounter = 0;
  var galleryPhotoCounter = 0;
  var projectCounter = 4;
  let grievances = List.empty<GrievanceSubmission>();
  let galleryPhotos = List.empty<GalleryPhoto>();
  let projects = List.fromArray<Project>([
    {
      id = 1;
      title = "पार्क नूतनीकरण";
      description = "केंद्रिय बागेला नवीन खेळांची साधने बसविणे.";
      status = "पूर्ण झाले";
      category = "विकासकामे";
    },
    {
      id = 2;
      title = "रोड दुरुस्ती";
      description = "मुख्य मार्गांची खड्डे बुजविणे आणि पुनःनिर्माण करणे.";
      status = "चालू";
      category = "विकासकामे";
    },
    {
      id = 3;
      title = "समुदाय केंद्र कार्यक्रम";
      description = "शैक्षणिक आणि मनोरंजक कार्यक्रम सुरू करणे.";
      status = "योजना";
      category = "समाजकल्याण";
    },
  ]);

  public shared ({ caller }) func submitGrievance(name : Text, mobile : Text, message : Text) : async Nat {
    let newGrievance : GrievanceSubmission = {
      id = grievanceCounter;
      name;
      mobile;
      message;
      timestamp = Time.now();
    };
    grievances.add(newGrievance);
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
    galleryPhotos.add(newPhoto);
    let currentId = galleryPhotoCounter;
    galleryPhotoCounter += 1;
    currentId;
  };

  public shared ({ caller }) func deleteGalleryPhoto(id : Nat) : async Bool {
    let filteredPhotos = galleryPhotos.filter(
      func(photo) {
        photo.id != id;
      }
    );
    galleryPhotos.clear();
    galleryPhotos.addAll(filteredPhotos.values());
    true;
  };

  public shared ({ caller }) func addProject(title : Text, description : Text, category : Text, status : Text) : async Nat {
    let newProject : Project = {
      id = projectCounter;
      title;
      description;
      category;
      status;
    };
    projects.add(newProject);
    let currentId = projectCounter;
    projectCounter += 1;
    currentId;
  };

  public shared ({ caller }) func deleteProject(id : Nat) : async Bool {
    let filteredProjects = projects.filter(
      func(project) {
        project.id != id;
      }
    );
    projects.clear();
    projects.addAll(filteredProjects.values());
    true;
  };

  public shared ({ caller }) func adminLogin(password : Text) : async Bool {
    Text.equal(password, adminPassword);
  };

  public shared ({ caller }) func updateAdminPassword(oldPassword : Text, newPassword : Text) : async Bool {
    if (Text.equal(oldPassword, adminPassword)) {
      adminPassword := newPassword;
      true;
    } else {
      false;
    };
  };

  public query ({ caller }) func getAllGrievances() : async [GrievanceSubmission] {
    grievances.toArray();
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    projects.toArray();
  };

  public query ({ caller }) func getAllGalleryPhotos() : async [GalleryPhoto] {
    galleryPhotos.toArray();
  };
};
