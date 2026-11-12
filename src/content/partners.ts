/**
 * Genuine client logos and partner credentials.
 * Intentionally empty — add entries only with permission from the client or
 * partner. The "Trusted by" strip on the homepage appears automatically once
 * this list has items. Place logo files in /public/partners.
 */
export interface Partner {
  name: string;
  logo: string; // e.g. "/partners/acme.svg"
  width?: number;
  height?: number;
}

export const partners: Partner[] = [];
