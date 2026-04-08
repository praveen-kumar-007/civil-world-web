import { useState } from "react";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

export default function GalleryPage() {
  const { content } = useContent();
  const [selectedImage, setSelectedImage] = useState("");
  const galleryImages = Array.isArray(content?.data?.galleryImages)
    ? content.data.galleryImages
    : [];

  return (
    <>
      <PageHero
        eyebrow={content?.galleryPage?.eyebrow || "Gallery"}
        title={content?.galleryPage?.title || "Classroom moments and student community"}
        subtitle={
          content?.galleryPage?.subtitle ||
          "A visual glimpse of classes, discussions, and learning milestones."
        }
      />

      <section className="container">
        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <button
              key={image}
              type="button"
              className="gallery-item"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt="Civil World classroom" loading="lazy" />
            </button>
          ))}
        </div>
      </section>

      {selectedImage ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage("")}
        >
          <img src={selectedImage} alt="Large classroom view" />
        </div>
      ) : null}
    </>
  );
}
