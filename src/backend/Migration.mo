import List "mo:core/List";

module Migration {
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

  public func migration(
    old : {
      var grievances : List.List<GrievanceSubmission>;
      var galleryPhotos : List.List<GalleryPhoto>;
      var projectRatings : List.List<ProjectRating>;
      var projects : List.List<Project>;
      var schemes : List.List<Scheme>;
    }
  ) : {
    var grievances : [GrievanceSubmission];
    var galleryPhotos : [GalleryPhoto];
    var projectRatings : [ProjectRating];
    var projects : [Project];
    var schemes : [Scheme];
  } {
    {
      var grievances = old.grievances.toArray();
      var galleryPhotos = old.galleryPhotos.toArray();
      var projectRatings = old.projectRatings.toArray();
      var projects = old.projects.toArray();
      var schemes = old.schemes.toArray();
    }
  };
};
