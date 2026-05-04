const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path) {
  const response = await fetch(`${BASE}${path}`);

  if (!response.ok) {
    let message = "Request failed";

    try {
      const payload = await response.json();
      message = payload.error || payload.message || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getDevelopers() {
  return request("/developers");
}

export async function getICMetrics(developerId, month) {
  return request(
    `/metrics/ic?developer_id=${encodeURIComponent(
      developerId
    )}&month=${encodeURIComponent(month)}`
  );
}

export async function getManagerMetrics(month) {
  return request(`/metrics/manager?month=${encodeURIComponent(month)}`);
}

export async function getManagerDetail(managerId, month) {
  return request(
    `/metrics/manager/${encodeURIComponent(managerId)}?month=${encodeURIComponent(
      month
    )}`
  );
}

export async function getMonths() {
  return request("/months");
}
