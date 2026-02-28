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
    rating : Nat; // 1-5
    name : Text;
    comment : Text;
    timestamp : Int;
  };

  var adminPassword = "#BK1234";
  var grievanceCounter = 0;
  var galleryPhotoCounter = 0;
  var projectCounter = 4;
  var schemeCounter = 5;
  var ratingCounter = 0;

  let grievances = List.empty<GrievanceSubmission>();
  let galleryPhotos = List.empty<GalleryPhoto>();
  let projectRatings = List.empty<ProjectRating>();

  let schemes = List.fromArray<Scheme>([
    {
      id = 1;
      title = "प्रधानमंत्री आवास योजना (शहरी)";
      description = "गरीबांना शहरी भागात घर मिळवण्यास मदत करणारी योजना.";
      status = "active";
      category = "गृहनिर्माण";
      benefit = "घरांसाठी सबसिडी";
      eligibility = "नियमित गरजूंनाच";
    },
    {
      id = 2;
      title = "स्वच्छ भारत मिशन (शहरी)";
      description = "शहरांमध्ये स्वच्छता आणि परिसर व्यवस्था सुधारण्याची योजना.";
      status = "active";
      category = "स्वच्छता";
      benefit = "स्वच्छता विकास निधी";
      eligibility = "सर्व नागरीकांसाठी";
    },
    {
      id = 3;
      title = "राजीव गांधी घरकुल योजना";
      description = "विकासकांच्या सहाय्याने ग्रामिण भागात घरकुल बांधण्याची योजना.";
      status = "past";
      category = "गृहनिर्माण";
      benefit = "घर बांधणी अनुदान";
      eligibility = "ग्रामीण गरजूंसाठी";
    },
    {
      id = 4;
      title = "अमृत २.० - पाणीपुरवठा व सांडपाणी";
      description = "अन्य पोषण संशोधने";
      status = "upcoming";
      category = "पाणी व स्वच्छता";
      benefit = "पाणीपुरवठा सुविधा";
      eligibility = "सर्व गुणवत्ता आवश्यक";
    },
  ]);

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

  // Scheme management functions
  public shared ({ caller }) func addScheme(title : Text, description : Text, category : Text, status : Text, benefit : Text, eligibility : Text) : async Nat {
    let newScheme : Scheme = {
      id = schemeCounter;
      title;
      description;
      category;
      status;
      benefit;
      eligibility;
    };
    schemes.add(newScheme);
    let currentId = schemeCounter;
    schemeCounter += 1;
    currentId;
  };

  public shared ({ caller }) func deleteScheme(id : Nat) : async Bool {
    let filteredSchemes = schemes.filter(
      func(scheme) {
        scheme.id != id;
      }
    );
    schemes.clear();
    schemes.addAll(filteredSchemes.values());
    true;
  };

  public query ({ caller }) func getAllSchemes() : async [Scheme] {
    schemes.toArray();
  };

  // RATING SYSTEM

  public shared ({ caller }) func submitRating(projectId : Nat, rating : Nat, name : Text, comment : Text) : async Nat {
    let newRating : ProjectRating = {
      id = ratingCounter;
      projectId;
      rating;
      name;
      comment;
      timestamp = Time.now();
    };
    projectRatings.add(newRating);
    let currentId = ratingCounter;
    ratingCounter += 1;
    currentId;
  };

  public query ({ caller }) func getRatingsForProject(projectId : Nat) : async [ProjectRating] {
    let filteredRatings = projectRatings.filter(
      func(rating) {
        rating.projectId == projectId;
      }
    );
    filteredRatings.toArray();
  };

  public query ({ caller }) func getAverageRating(projectId : Nat) : async {
    averageRating : Nat;
    totalRatings : Nat;
  } {
    let filteredRatings = projectRatings.filter(
      func(rating) {
        rating.projectId == projectId;
      }
    );

    let ratingsArray = filteredRatings.toArray();

    if (ratingsArray.size() == 0) {
      return {
        averageRating = 0;
        totalRatings = 0;
      };
    };

    let sum = ratingsArray.foldLeft(
      0,
      func(acc, curr) {
        acc + curr.rating;
      },
    );

    {
      averageRating = (sum * 10) / ratingsArray.size();
      totalRatings = ratingsArray.size();
    };
  };

  public query ({ caller }) func getAllRatings() : async [ProjectRating] {
    projectRatings.toArray();
  };
};
