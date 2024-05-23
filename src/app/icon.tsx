import { ImageResponse } from 'next/og';

// Taille de l'image
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Fonction de conversion hexadécimale en RGB
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

// Fonction qui génère l'image de l'icône
export default function Icon() {
  // Conversion de la couleur hexadécimale en RGB
  const bgColor = hexToRgb('#3b82f6');
  const textColor = hexToRgb('#000000'); // Texte en noir

  return new ImageResponse(
    (
      // Élément JSX pour l'ImageResponse
      <div
        style={{
          fontSize: 24,
          background: bgColor ? `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})` : '', // Utilisation de la couleur RGB comme couleur de fond
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor ? `rgb(${textColor[0]}, ${textColor[1]}, ${textColor[2]})` : '', // Utilisation de la couleur RGB comme couleur de texte
          borderRadius: '50%', // Pour créer un cercle
        }}
      >
        TF
      </div>
    ),
    // Options de l'ImageResponse
    {
      // Utilisation des métadonnées de taille exportées pour définir également la largeur et la hauteur de l'image
      ...size,
    }
  );
}
