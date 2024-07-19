import env from "../utils/env";

async function fetcher(url, options) {
  try {
    const response = await fetch(`${env.VITE_BACKEND_URL}${url}`, options);

    if (options?.method === "DELETE" && response.ok) {
      return {};
    }

    const data = await response.json();

    if (response.ok) {
      return data;
    }

    const error = new Error(data.error || "Erro desconhecido");
    error.status = response.status;
    error.data = data;

    throw error;
  } catch (error) {
    if (!error.data) {
      error.data = { error: error.message || "Erro de rede" };
    }
    throw error;
  }
}

fetcher.get = function (url) {
  return fetcher(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

fetcher.post = function (url, data) {
  return fetcher(url, {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

fetcher.put = function (url, data) {
  return fetcher(url, {
    body: JSON.stringify(data),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

fetcher.delete = function (url) {
  return fetcher(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default fetcher;
