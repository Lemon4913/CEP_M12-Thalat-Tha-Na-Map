import pier from "../assets/checkpoints/02-pier.webp";
import samyaekShops from "../assets/checkpoints/03-samyaek-shops.webp";
import leftEntrance from "../assets/checkpoints/04-left-entrance.webp";

/**
 * Generated illustrations for checkpoints where the team supplied an on-site
 * reference photo (see checkpoints/ next to this repo). Each one was made by
 * feeding that photo to an image model as a style-transfer reference, prompted
 * into the project's own "minimal Thai heritage" palette — not the photo
 * itself, so this carries the same standing as PoiArt.tsx's hand-drawn work.
 *
 * Checkpoints without an entry here (still awaiting a reference photo, or budget
 * for the next generation round) fall back to PoiArt's flat SVG motif.
 */
export const CHECKPOINT_PHOTO_ART: Record<string, string> = {
  "2": pier,
  "3": samyaekShops,
  "4": leftEntrance,
};
