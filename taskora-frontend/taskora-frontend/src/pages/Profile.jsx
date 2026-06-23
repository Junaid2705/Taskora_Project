import React, { useState, useEffect, useRef } from "react";
import ProfileService from "../services/profileService";

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    role: "",
    bio: "",
    portfolioUrl: "",
    avatarUrl: "",
    coverUrl: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW: React Refs to force file clicks ---
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // Load the profile on mount
  useEffect(() => {
    ProfileService.getProfile().then(
      (response) => {
        setProfile(response.data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading profile", error);
        setIsLoading(false);
      },
    );
  }, []);

  const handleTextChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

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
      ProfileService.uploadAvatar(file).then(
        (res) => setProfile({ ...profile, avatarUrl: res.data.url }),
        (err) =>
          setMessage("Avatar upload failed. Check file size (Max 10MB)."),
      );
    } else {
      ProfileService.uploadCover(file).then(
        (res) => setProfile({ ...profile, coverUrl: res.data.url }),
        (err) => setMessage("Cover upload failed. Check file size (Max 10MB)."),
      );
    }
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
    <div className="container py-4">
      {message && (
        <div
          className={`alert ${message.includes("failed") ? "alert-danger" : "alert-success"} shadow-sm`}
        >
          {message}
        </div>
      )}

      <div
        className="card shadow-sm border-0 mb-4"
        style={{ borderRadius: "15px" }}
      >
        {/* --- COVER PHOTO (Using useRef) --- */}
        <div
          className="position-relative w-100 m-0"
          onClick={() => coverInputRef.current.click()}
          style={{ cursor: "pointer" }}
          title="Click to change cover photo"
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
            {/* --- AVATAR & BASIC INFO --- */}
            <div className="d-flex flex-column">
              {/* Avatar (Using useRef) */}
              <div
                style={{ marginTop: "-80px", zIndex: 10, cursor: "pointer" }}
                onClick={() => avatarInputRef.current.click()}
                title="Click to change avatar"
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

              {/* Name & Title */}
              <div className="mt-3">
                <h2 className="fw-bold mb-1 text-dark">{profile.fullName}</h2>
                <h5 className="text-secondary mb-1">
                  {profile.role ? profile.role.replace("ROLE_", "") : ""}
                </h5>
                <p className="text-muted small">
                  <i className="bi bi-geo-alt-fill me-1"></i> San Francisco, USA
                </p>
              </div>
            </div>

            {/* --- BUTTONS (Forced to the front with zIndex) --- */}
            <div
              className="d-flex gap-2 mt-3 mt-md-0 mb-md-4"
              style={{ zIndex: 20, position: "relative" }}
            >
              <button
                className="btn btn-outline-primary fw-bold px-4 rounded-pill"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>

              {/* View Portfolio Button */}
              {profile.portfolioUrl ? (
                <a
                  href={
                    profile.portfolioUrl.startsWith("http")
                      ? profile.portfolioUrl
                      : `https://${profile.portfolioUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn text-white fw-bold px-4 rounded-pill shadow-sm"
                  style={{ backgroundColor: "#6f42c1" }}
                >
                  View Portfolio
                </a>
              ) : (
                <button
                  className="btn btn-secondary px-4 rounded-pill shadow-sm"
                  disabled
                >
                  No Portfolio Added
                </button>
              )}
            </div>
          </div>

          <hr className="my-4" />

          {/* --- EDITABLE BIO & PORTFOLIO SECTION --- */}
          <div className="row position-relative" style={{ zIndex: 20 }}>
            <div className="col-md-8">
              {isEditing ? (
                <form
                  onSubmit={saveTextUpdates}
                  className="bg-light p-4 rounded border"
                >
                  <h5 className="fw-bold mb-3">Update Your Details</h5>

                  <label className="form-label fw-semibold">
                    About Me (Bio)
                  </label>
                  <textarea
                    className="form-control mb-3"
                    rows="4"
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleTextChange}
                    placeholder="Tell clients about your experience and skills..."
                  ></textarea>

                  <label className="form-label fw-semibold">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    className="form-control mb-4"
                    name="portfolioUrl"
                    value={profile.portfolioUrl || ""}
                    onChange={handleTextChange}
                    placeholder="https://github.com/yourusername"
                  />

                  <button
                    type="submit"
                    className="btn btn-success fw-bold px-5 rounded-pill shadow-sm"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <h5 className="fw-bold">
                    <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                    About Me
                  </h5>
                  <p
                    className="text-muted"
                    style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}
                  >
                    {profile.bio ||
                      "No bio added yet. Click 'Edit Profile' to introduce yourself!"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
