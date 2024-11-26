export const siteOptions = sites.map((site) => ({
  value: site.id,
  label: site.name,
}));

export const agentOptions = users.map((user) => ({
  value: user.id,
  label: `${user.firstname} ${user.fullname}`, // Ajout du prénom au label
}));

export const getUserDetails = (userId) => {
  const user = users.find((user) => user.id == userId) || {};
  return {
    fullname: user.fullname || "Inconnu",
    firstname: user.firstname || "",
  };
};

export const getPostName = (postId) => {
  const post = posts.find((p) => p.abbreviation === postId);
  return post ? post.name : "Inconnu";
};

export const getUserName = (userId) => {
  const user = users.find((u) => u.id === parseInt(userId));
  return user ? user.fullname : "Inconnu";
};

export const getSiteName = (siteId) => {
  const site = sites.find((s) => s.id === parseInt(siteId));
  return site ? site.name : "Inconnu";
};
