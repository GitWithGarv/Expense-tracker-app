export const fetcher = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include", // ✅ REQUIRED FOR COOKIES
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};