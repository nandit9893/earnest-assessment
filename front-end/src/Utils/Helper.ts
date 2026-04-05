const getInitials = (firstName = "", lastName = "", maxLetters = 2) => {
  const fullName = `${firstName} ${lastName}`.trim();
  if (!fullName) return "";
  return fullName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, maxLetters);
};

const statusItems = [
  { _id: "1", status: "Pending" },
  { _id: "2", status: "In Progress" },
  { _id: "3", status: "Completed" },
  { _id: "4", status: "Draft" },
];

const itemsLimit = [
  { _id: "1", limit: "10" },
  { _id: "2", limit: "25" },
  { _id: "3", limit: "50" },
  { _id: "4", limit: "100" },
];

const formatDateWithTimezone = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetSign = timezoneOffset >= 0 ? "+" : "-";
  const offsetHours = String(
    Math.floor(Math.abs(timezoneOffset) / 60),
  ).padStart(2, "0");
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000${offsetSign}${offsetHours}:${offsetMinutes}`;
};

const activeStatus = [
  {
    _id: "1",
    deleted: "Active",
  },
  {
    _id: "2",
    deleted: "InActive",
  },
];

export {
  getInitials,
  statusItems,
  activeStatus,
  itemsLimit,
  formatDateWithTimezone,
};
