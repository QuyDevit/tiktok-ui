export const formatters = {
  formatTime: (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  },
  formatDate: (dateString) => {
    if (!dateString) return "";

    let date;
    try {
      date = new Date(dateString);

      if (isNaN(date.getTime())) {
        date = new Date(parseInt(dateString));
      }

      if (isNaN(date.getTime())) {
        console.error("Invalid date format:", dateString);
        return "";
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      return "";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} tháng trước`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
  },
  formatShortDate: (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().split("T")[0];
  },
  formatNumber: (num) => {
    const units = [
      { value: 1e9, suffix: "B" },
      { value: 1e6, suffix: "M" },
      { value: 1e3, suffix: "K" },
    ];

    for (const { value, suffix } of units) {
      if (num >= value) {
        return (num / value).toFixed(1).replace(/\.0$/, "") + suffix;
      }
    }
    return num.toString();
  },
  base64ToBlob: (base64, mimeType) => {
    const byteCharacters = atob(base64.split(",")[1]); // Bỏ phần đầu 'data:image/jpeg;base64,'
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  },
};
export const authcookie = {
  hasValidRefreshToken: () => {
    const expiryTime = parseInt(localStorage.getItem("hasRefreshtoken"), 10);
    return !isNaN(expiryTime) && Date.now() < expiryTime;
  },
  setRefreshTokenExpiry: (days = 7) => {
    const expiryTime = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem("hasRefreshtoken", expiryTime.toString());
  },
  clearRefreshToken: () => {
    localStorage.removeItem("hasRefreshtoken");
  },
};
