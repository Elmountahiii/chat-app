export function getCookieValue(
  cookieString: string,
  name: string
): string | undefined {
  const match = cookieString.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : undefined;
}
