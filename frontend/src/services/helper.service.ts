import { notification } from "antd";

class HelperService {
  static showSuccess(title: string, message?: string) {
    notification.success({
      message: title,
      description: message,
    });
  }

  static showError(title: string, message?: string) {
    notification.error({
      message: title,
      description: message,
    });
  }

  static showWarning(title: string, message?: string) {
    notification.warning({
      message: title,
      description: message,
    });
  }

  static showInfo(title: string, message?: string) {
    notification.info({
      message: title,
      description: message,
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
}

export default HelperService;
