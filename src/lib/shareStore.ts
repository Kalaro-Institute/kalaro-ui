// TEMPORARY stub standing in for GET/POST /auth/me/share-photo.
// Replace getDefaultSharePhoto / setDefaultSharePhoto with real apiRequest
// calls once backend ships the endpoints. Everything else that uses this
// file stays the same — only these two functions need to change.

let _defaultPhotoDataUrl: string | null = null;
let _hasEverSetDefault = false;

export function getDefaultSharePhoto(): string | null {
  return _defaultPhotoDataUrl;
}

export function hasDefaultSharePhoto(): boolean {
  return _hasEverSetDefault;
}

export function setDefaultSharePhoto(dataUrl: string): void {
  _defaultPhotoDataUrl = dataUrl;
  _hasEverSetDefault = true;
}
