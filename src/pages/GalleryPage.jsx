import { useState } from "react";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

export default function GalleryPage() {
  const { content } = useContent();
  const { galleryPage } = content;
  const galleryImages = content.data.galleryImages;

  const [selectedImage, setSelectedImage] = useState("");

  return (
    <>
      <PageHero
        eyebrow={galleryPage.eyebrow}
        title={galleryPage.title}
        subtitle={galleryPage.subtitle}
      />

      <section className="container">
        <div className="gallery-grid gallery-mosaic-grid">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`gallery-item gallery-item-${(index % 6) + 1}`}
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
