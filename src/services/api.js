import env from "../utils/env";

async function fetcher(url, options) {
  const response = await fetch(`${env.VITE_BACKEND_URL}${url}`, options);

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  const error = new Error();

  error.cause = data.message;
  error.original = data;

  throw error;
}

export default fetcher;
