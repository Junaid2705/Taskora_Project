import React, { useState, useEffect, useRef } from "react";
import ProfileService from "../services/profileService";

const Profile = () => {
  // --- STATE ---
  const [profile, setProfile] = useState({
    fullName: "",
    role: "",
    bio: "",
    portfolioUrl: "",
    avatarUrl: "",
    coverUrl: "",
  });
  const [portfolioItems, setPortfolioItems] = useState([]); // New state for the gallery

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false); // Toggle for project form
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    projectUrl: "",
    file: null,
  });

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // --- LIFECYCLE ---
  useEffect(() => {
    // Load both the user profile AND their portfolio items
    Promise.all([
      ProfileService.getProfile(),
      ProfileService.getPortfolio(),
    ]).then(
      ([profileRes, portfolioRes]) => {
        setProfile(profileRes.data);
        setPortfolioItems(portfolioRes.data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading profile data", error);
        setIsLoading(false);
      },
    );
  }, []);

  // --- HANDLERS ---
  const handleTextChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const saveTextUpdates = (e) => {
    e.preventDefault();
    ProfileService.updateProfile({
      bio: profile.bio,
      portfolioUrl: profile.portfolioUrl,
    }).then(() => {
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    });
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "avatar") {
      ProfileService.uploadAvatar(file).then((res) =>
        setProfile({ ...profile, avatarUrl: res.data.url }),
      );
    } else {
      ProfileService.uploadCover(file).then((res) =>
        setProfile({ ...profile, coverUrl: res.data.url }),
      );
    }
  };

  // Portfolio Specific Handlers
  const handleProjectChange = (e) =>
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  const handleProjectFile = (e) =>
    setNewProject({ ...newProject, file: e.target.files[0] });

  const saveNewProject = (e) => {
    e.preventDefault();
    if (!newProject.file) {
      setMessage("Please select an image for your project.");
      return;
    }

    ProfileService.addPortfolioItem(
      newProject.title,
      newProject.description,
      newProject.projectUrl,
      newProject.file,
    )
      .then((res) => {
        // Refresh the portfolio list dynamically
        setPortfolioItems([
          ...portfolioItems,
          { ...newProject, imageUrl: res.data.imageUrl },
        ]);
        setIsAddingProject(false);
        setNewProject({
          title: "",
          description: "",
          projectUrl: "",
          file: null,
        });
        setMessage("Project added successfully!");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => setMessage("Failed to upload project. Check file size."));
  };

  if (isLoading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  const defaultGradient =
    "linear-gradient(to right, #ff7e5f, #feb47b, #86a8e7, #91eae4)";

  return (
    <div
      className="container py-4 fade-in"
      style={{ position: "relative", zIndex: 9999 }}
    >
      {message && (
        <div
          className={`alert ${message.includes("Failed") || message.includes("Please") ? "alert-danger" : "alert-success"} shadow-sm`}
        >
          {message}
        </div>
      )}

      {/* --- TOP PROFILE CARD --- */}
      <div
        className="card shadow-sm border-0 mb-4"
        style={{ borderRadius: "15px" }}
      >
        <div
          className="position-relative w-100 m-0"
          onClick={() => coverInputRef.current.click()}
          style={{ cursor: "pointer" }}
          title="Change cover"
        >
          <div
            style={{
              height: "250px",
              background: profile.coverUrl
                ? `url(${profile.coverUrl}) center/cover`
                : defaultGradient,
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
            }}
          ></div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e, "cover")}
          />
        </div>

        <div className="card-body position-relative px-4 px-md-5 pb-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end">
            <div className="d-flex flex-column">
              <div
                style={{ marginTop: "-80px", zIndex: 10, cursor: "pointer" }}
                onClick={() => avatarInputRef.current.click()}
                title="Change avatar"
              >
                <img
                  src={profile.avatarUrl || "https://via.placeholder.com/150"}
                  alt="Avatar"
                  className="rounded-circle border border-5 border-white shadow-sm"
                  style={{
                    width: "160px",
                    height: "160px",
                    objectFit: "cover",
                    backgroundColor: "#fff",
                  }}
                />
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(e, "avatar")}
                />
              </div>

              <div className="mt-3">
                <h2 className="fw-bold mb-1 text-dark">{profile.fullName}</h2>
                <h5 className="text-secondary mb-1">
                  {profile.role ? profile.role.replace("ROLE_", "") : ""}
                </h5>
              </div>
            </div>

            <div
              className="d-flex gap-2 mt-3 mt-md-0 mb-md-4"
              style={{ zIndex: 20, position: "relative" }}
            >
              <button
                className="btn btn-outline-primary fw-bold px-4 rounded-pill shadow-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "Edit Bio"}
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* --- BIO SECTION --- */}
          <div className="row position-relative" style={{ zIndex: 20 }}>
            <div className="col-md-12">
              {isEditing ? (
                <form
                  onSubmit={saveTextUpdates}
                  className="bg-light p-4 rounded border"
                >
                  <label className="form-label fw-semibold">About Me</label>
                  <textarea
                    className="form-control mb-3"
                    rows="3"
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleTextChange}
                    placeholder="Keep it simple and direct..."
                  ></textarea>

                  <label className="form-label fw-semibold">
                    Main Website Link
                  </label>
                  <input
                    type="url"
                    className="form-control mb-4"
                    name="portfolioUrl"
                    value={profile.portfolioUrl || ""}
                    onChange={handleTextChange}
                    placeholder="https://github.com/..."
                  />

                  <button
                    type="submit"
                    className="btn btn-success fw-bold px-5 rounded-pill shadow-sm"
                  >
                    Save Bio
                  </button>
                </form>
              ) : (
                <p
                  className="text-muted"
                  style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}
                >
                  {profile.bio ||
                    "No bio added yet. Click 'Edit Bio' to introduce yourself."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- PORTFOLIO GALLERY SECTION --- */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <h3 className="fw-bold text-dark mb-0">
          <i className="bi bi-grid-1x2-fill text-primary me-2"></i>My Portfolio
        </h3>
        <button
          className="btn btn-primary fw-bold rounded-pill shadow-sm"
          onClick={() => setIsAddingProject(!isAddingProject)}
        >
          {isAddingProject ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {/* Add Project Form */}
      {isAddingProject && (
        <div className="card shadow-sm border-0 mb-4 bg-light">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">Upload New Project</h5>
            <form onSubmit={saveNewProject}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Project Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={newProject.title}
                    onChange={handleProjectChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Live URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="projectUrl"
                    className="form-control"
                    value={newProject.projectUrl}
                    onChange={handleProjectChange}
                    placeholder="https://..."
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={newProject.description}
                    onChange={handleProjectChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium">
                    Project Screenshot
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleProjectFile}
                    required
                  />
                </div>
                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-success fw-bold px-4 rounded-pill"
                  >
                    Upload to Gallery
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* The Gallery Grid */}
      <div className="row g-4 mb-5">
        {portfolioItems.length === 0 && !isAddingProject ? (
          <div className="col-12 text-center py-5 text-muted">
            <i className="bi bi-images fs-1 d-block mb-2"></i>
            <p>Your gallery is empty. Show off your best work!</p>
          </div>
        ) : (
          portfolioItems.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div
                className="card border-0 shadow-sm h-100 hover-lift overflow-hidden"
                style={{ borderRadius: "12px" }}
              >
                <div
                  style={{
                    height: "200px",
                    backgroundImage: `url(${item.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold text-dark">{item.title}</h5>
                  <p className="text-muted small flex-grow-1">
                    {item.description}
                  </p>
                  {item.projectUrl && (
                    <a
                      href={
                        item.projectUrl.startsWith("http")
                          ? item.projectUrl
                          : `https://${item.projectUrl}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm fw-bold rounded-pill mt-3"
                    >
                      View Live Project{" "}
                      <i className="bi bi-box-arrow-up-right ms-1"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
