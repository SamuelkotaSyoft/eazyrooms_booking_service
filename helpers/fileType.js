export function getFileTypeFromBase64Url(base64Url) {
  // Remove data URL prefix (e.g., 'data:image/png;base64,')
  const fileType = base64Url?.split(";base64")[0]?.split("data:")[1];
  return fileType;
}

// Example usage
const base64Url = "data:image/png;base64,iVBORw0KGg...";
const fileType = getFileTypeFromBase64Url(base64Url);
