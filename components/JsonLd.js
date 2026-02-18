/**
 * JSON-LD structured data component for SEO.
 * Renders a <script type="application/ld+json"> tag.
 */
export default function JsonLd({ data }) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
