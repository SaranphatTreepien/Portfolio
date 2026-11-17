export const COUNTED_TOPICS = ["Cloud", "Network", "DevSecOps", "Certificate", "Event"];

export const isYearCategory = (value) => /^\d{4}$/.test(String(value || "").trim());

export const hasSpecialTopic = (item, topic) => {
  const topics = Array.isArray(item.specialTopics)
    ? item.specialTopics.map((value) => value === "Community" ? "Event" : value)
    : [];
  if (topics.includes(topic)) return true;
  if (item.specialTopic === topic) return true;
  if (topic === "Cloud") return item.isCloud === true;
  if (topic === "Network") return item.isNetwork === true;
  if (topic === "DevSecOps") return item.isDevSecOps === true;
  if (topic === "Certificate") return item.isCertificate === true;
  if (topic === "Event") return item.isEvent === true || item.isCommunity === true;
  return false;
};

export const matchesTab = (item, tabValue) => {
  if (tabValue === "all") return true;
  if (tabValue === "Best") return item.isBest === true;
  if (COUNTED_TOPICS.includes(tabValue)) return hasSpecialTopic(item, tabValue);
  return item.category === tabValue;
};
