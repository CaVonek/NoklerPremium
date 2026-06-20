export function getClientId() {
  let clientId = localStorage.getItem("nokler_client_id");

  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem("nokler_client_id", clientId);
  }

  return clientId;
}