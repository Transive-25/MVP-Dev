// Helper: generate secure random token (hex)
export function generateResetToken() {
  const array = new Uint8Array(32); // 256-bit token
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("hex");
}