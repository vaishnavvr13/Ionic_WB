import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonTextarea,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButtons,
  IonLoading,
  IonToast,
  IonAlert,
} from "@ionic/react";
import { addOutline, createOutline, trashOutline } from "ionicons/icons";

const API_URL = "http://localhost:5000/api";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    image: "",
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/blogs");
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      setToastMessage("Failed to load blogs");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBlog),
      });

      if (response.ok) {
        const newBlogData = await response.json();
        setBlogs((prevBlogs) => [newBlogData, ...prevBlogs]);
        setShowModal(false);
        setNewBlog({ title: "", content: "", image: "" });
        setToastMessage("Blog created successfully");
        setShowToast(true);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to create blog");
      }
    } catch (error) {
      setToastMessage(error.message || "Failed to create blog");
      setShowToast(true);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingBlog) return;

    setLoading(true);
    try {
      const updateData = {
        title: editingBlog.title,
        content: editingBlog.content,
        image: editingBlog.image || "",
      };

      const response = await fetch(`${API_URL}/blogs/${editingBlog._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update blog");
      }

      const updatedBlog = await response.json();

      // Update blogs state with server response
      setBlogs((prevBlogs) => {
        const newBlogs = prevBlogs.map((blog) =>
          blog._id === editingBlog._id ? { ...blog, ...updatedBlog } : blog
        );
        return newBlogs;
      });

      // Close modal and reset state
      setEditingBlog(null);
      setToastMessage("Blog updated successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating blog:", error);
      setToastMessage(error.message || "Error updating blog");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await fetch(`${API_URL}/blogs/${blogId}`, {
        method: "DELETE",
        headers: {},
      });

      if (response.ok) {
        fetchBlogs();
        setToastMessage("Blog deleted successfully");
        setShowToast(true);
      } else {
        throw new Error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      setToastMessage("Failed to delete blog");
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blogs</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonLoading isOpen={loading} message="Loading..." />

        <IonList>
          {blogs.map((blog) => (
            <IonCard key={blog._id}>
              <IonCardHeader>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <IonCardTitle>{blog.title}</IonCardTitle>
                  <IonButtons>
                    {/* <IonButton onClick={() => handleEditBlog(blog)}>
                      <IonIcon icon={createOutline} />
                    </IonButton> */}
                    <IonButton onClick={() => setBlogToDelete(blog._id)}>
                      <IonIcon icon={trashOutline} color="danger" />
                    </IonButton>
                  </IonButtons>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    marginBottom: "15px",
                    lineHeight: "1.5",
                  }}
                >
                  {blog.content}
                </p>
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {/* Edit Modal */}
        <IonModal
          isOpen={!!editingBlog}
          onDidDismiss={() => setEditingBlog(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Blog</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setEditingBlog(null)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form onSubmit={handleEditSubmit}>
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Title</IonLabel>
                  <IonInput
                    value={editingBlog?.title}
                    onIonChange={(e) =>
                      setEditingBlog({ ...editingBlog, title: e.detail.value })
                    }
                    placeholder="Enter blog title"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Content</IonLabel>
                  <IonTextarea
                    value={editingBlog?.content}
                    onIonChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        content: e.detail.value,
                      })
                    }
                    placeholder="Write your blog content"
                    rows={6}
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Image URL (optional)</IonLabel>
                  <IonInput
                    value={editingBlog?.image}
                    onIonChange={(e) =>
                      setEditingBlog({ ...editingBlog, image: e.detail.value })
                    }
                    placeholder="Enter image URL"
                  />
                </IonItem>
                <div className="ion-padding">
                  <IonButton
                    expand="block"
                    type="submit"
                    className="ion-margin-bottom"
                    strong={true}
                    disabled={
                      loading || !editingBlog?.title || !editingBlog?.content
                    }
                  >
                    {loading ? "Updating..." : "Update Blog"}
                  </IonButton>
                  <IonButton
                    expand="block"
                    color="medium"
                    onClick={() => setEditingBlog(null)}
                    disabled={loading}
                  >
                    Cancel
                  </IonButton>
                </div>
              </IonList>
            </form>
          </IonContent>
        </IonModal>

        {/* Delete Confirmation Alert */}
        <IonAlert
          isOpen={!!blogToDelete}
          onDidDismiss={() => setBlogToDelete(null)}
          header="Confirm Delete"
          message="Are you sure you want to delete this blog post?"
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => setBlogToDelete(null),
            },
            {
              text: "Delete",
              role: "destructive",
              handler: () => {
                handleDeleteBlog(blogToDelete);
                setBlogToDelete(null);
              },
            },
          ]}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Create New Blog</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Title</IonLabel>
                <IonInput
                  value={newBlog.title}
                  onIonChange={(e) =>
                    setNewBlog({ ...newBlog, title: e.detail.value })
                  }
                  placeholder="Enter blog title"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Content</IonLabel>
                <IonTextarea
                  value={newBlog.content}
                  onIonChange={(e) =>
                    setNewBlog({ ...newBlog, content: e.detail.value })
                  }
                  placeholder="Write your blog content"
                  rows={6}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Image URL (optional)</IonLabel>
                <IonInput
                  value={newBlog.image}
                  onIonChange={(e) =>
                    setNewBlog({ ...newBlog, image: e.detail.value })
                  }
                  placeholder="Enter image URL"
                />
              </IonItem>
              <IonButton
                expand="block"
                onClick={handleCreateBlog}
                className="ion-margin"
              >
                Create Blog
              </IonButton>
            </IonList>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
