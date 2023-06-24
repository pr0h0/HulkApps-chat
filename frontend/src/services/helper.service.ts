import { notification } from "antd";

class HelperService {
  static showSuccess(title: string, message?: string) {
    notification.success({
      message: title,
      description: message,
      className: "notification-dark",
    });
  }

  static showError(title: string, message?: string) {
    notification.error({
      message: title,
      description: message,
      className: "notification-dark",
    });
  }

  static showWarning(title: string, message?: string) {
    notification.warning({
      message: title,
      description: message,
      className: "notification-dark",
    });
  }

  static showInfo(title: string, message?: string) {
    notification.info({
      message: title,
      description: message,
      className: "notification-dark",
    });
  }

  static copyToClipboard(text: string, showNotification = true) {
    const result = navigator.clipboard.writeText(text);

    if (showNotification) {
      result
        .then(() => {
          HelperService.showSuccess("Copied to clipboard");
        })
        .catch(() => {
          HelperService.showError("Failed to copy to clipboard");
        });
    }

    return result;
  }

  static formatDateTime(dateStr: string) {
    const dateObj = new Date(dateStr);
    const [date, time] = dateObj.toISOString().split("T");

    const [year, month, day] = date.split("-");
    const [hour, minute] = time.split(":");

    if (dateObj.getTime() > new Date().getTime() - 86400000) {
      return `${hour}:${minute}`;
    }

    if (dateObj.getFullYear() === new Date().getFullYear())
      return `${day}.${month} ${hour}:${minute}`;

    return `${day}.${month}.${year} ${hour}:${minute}`;
  }
}

export default HelperService;
