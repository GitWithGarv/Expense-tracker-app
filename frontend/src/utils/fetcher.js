import { http } from "./http";

export const fetcher = (url) => http.get(url).then((res) => res.data);