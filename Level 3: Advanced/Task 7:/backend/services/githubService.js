const GITHUB_API_URL = "https://api.github.com";
const GITHUB_OAUTH_URL = "https://github.com/login/oauth";

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function getAuthorizationUrl() {
  const clientId = getRequiredEnv("GITHUB_CLIENT_ID");
  const redirectUri = getRequiredEnv("GITHUB_CALLBACK_URL");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user user:email repo",
    allow_signup: "true"
  });

  return `${GITHUB_OAUTH_URL}/authorize?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
  const response = await fetch(`${GITHUB_OAUTH_URL}/access_token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: getRequiredEnv("GITHUB_CLIENT_ID"),
      client_secret: getRequiredEnv("GITHUB_CLIENT_SECRET"),
      code,
      redirect_uri: getRequiredEnv("GITHUB_CALLBACK_URL")
    })
  });
  const data = await response.json();

  if (!response.ok || data.error || !data.access_token) {
    throw new Error(data.error_description || "GitHub token exchange failed");
  }

  return data.access_token;
}

async function githubRequest(path, accessToken) {
  const response = await fetch(`${GITHUB_API_URL}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "GitHub API request failed");
  }

  return data;
}

function getAuthenticatedUser(accessToken) {
  return githubRequest("/user", accessToken);
}

async function getPrimaryEmail(accessToken) {
  const emails = await githubRequest("/user/emails", accessToken);
  const primary = emails.find((email) => email.primary && email.verified);
  return primary?.email || "";
}

async function getRepositories(accessToken) {
  const repositories = await githubRequest("/user/repos?sort=updated&per_page=20", accessToken);

  return repositories.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || "No description",
    private: repo.private,
    language: repo.language || "Mixed",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    url: repo.html_url,
    updatedAt: repo.updated_at
  }));
}

module.exports = {
  getAuthorizationUrl,
  exchangeCodeForToken,
  getAuthenticatedUser,
  getPrimaryEmail,
  getRepositories
};
