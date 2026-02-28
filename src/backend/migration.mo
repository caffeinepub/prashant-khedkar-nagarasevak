import List "mo:core/List";
import Nat "mo:core/Nat";

module {
  type OldGrievanceSubmission = {
    id : Nat;
    name : Text;
    mobile : Text;
    message : Text;
    timestamp : Int;
  };

  type OldProject = {
    id : Nat;
    title : Text;
    description : Text;
    status : Text;
    category : Text;
  };

  type OldGalleryPhoto = {
    id : Nat;
    url : Text;
    caption : Text;
    sub : Text;
    timestamp : Int;
  };

  type OldScheme = {
    id : Nat;
    title : Text;
    description : Text;
    status : Text;
    category : Text;
    benefit : Text;
    eligibility : Text;
  };

  type OldActor = {
    adminPassword : Text;
    grievanceCounter : Nat;
    galleryPhotoCounter : Nat;
    projectCounter : Nat;
    schemeCounter : Nat;
    grievances : List.List<OldGrievanceSubmission>;
    galleryPhotos : List.List<OldGalleryPhoto>;
    schemes : List.List<OldScheme>;
    projects : List.List<OldProject>;
  };

  type NewProjectRating = {
    id : Nat;
    projectId : Nat;
    rating : Nat;
    name : Text;
    comment : Text;
    timestamp : Int;
  };

  type NewActor = {
    adminPassword : Text;
    grievanceCounter : Nat;
    galleryPhotoCounter : Nat;
    projectCounter : Nat;
    schemeCounter : Nat;
    ratingCounter : Nat;
    grievances : List.List<OldGrievanceSubmission>;
    galleryPhotos : List.List<OldGalleryPhoto>;
    schemes : List.List<OldScheme>;
    projects : List.List<OldProject>;
    projectRatings : List.List<NewProjectRating>;
  };

  public func run(old : OldActor) : NewActor {
    { old with ratingCounter = 0; projectRatings = List.empty<NewProjectRating>() };
  };
};
