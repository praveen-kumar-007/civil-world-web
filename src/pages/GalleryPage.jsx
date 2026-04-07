import { useState } from "react";
import PageHero from "../components/PageHero";
import { galleryImages } from "../data/siteData";

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState("");

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Classroom moments and student community"
        subtitle="A visual glimpse of classes, discussions, and learning milestones."
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
