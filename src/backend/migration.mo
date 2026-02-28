import List "mo:core/List";
import Nat "mo:core/Nat";

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

  type OldActor = {
    grievanceCounter : Nat;
    galleryPhotoCounter : Nat;
    grievances : [GrievanceSubmission];
    galleryPhotos : [GalleryPhoto];
    projects : [Project];
  };

  type NewActor = {
    adminPassword : Text;
    grievanceCounter : Nat;
    galleryPhotoCounter : Nat;
    projectCounter : Nat;
    grievances : List.List<GrievanceSubmission>;
    galleryPhotos : List.List<GalleryPhoto>;
    projects : List.List<Project>;
  };

  public func run(old : OldActor) : NewActor {
    {
      adminPassword = "admin123";
      grievanceCounter = old.grievanceCounter;
      galleryPhotoCounter = old.galleryPhotoCounter;
      projectCounter = 4;
      grievances = List.fromArray(old.grievances);
      galleryPhotos = List.fromArray(old.galleryPhotos);
      projects = List.fromArray<Project>(old.projects);
    };
  };
};
