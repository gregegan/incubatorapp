import { APP_URL } from "./env";
import { Notification } from "@/types/notifications";
import { logger } from "@/lib/logger";
import { LoginData, LoginResponse, User } from "@/types/users";

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await fetch(`${APP_URL}/api/notifications`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || errorData.message || "Failed to fetch notifications",
      );
    }
    const data = await response.json();
    logger.info("Successfully fetched notifications", { data });
    return data;
  } catch (error) {
    logger.error("Error in fetchNotifications", { error });
    throw error;
  }
};

export const fetchUnreadNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await fetch(`${APP_URL}/api/notifications/unread`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || errorData.message || "Failed to fetch notifications",
      );
    }
    const data = await response.json();
    logger.info("Successfully fetched notifications", { data });
    return data;
  } catch (error) {
    logger.error("Error in fetchNotifications", { error });
    throw error;
  }
};

export const markAllNotificationsRead = async (): Promise<{
  success: boolean;
}> => {
  try {
    const response = await fetch(`${APP_URL}/api/notifications/read-all`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          errorData.message ||
          "Failed to mark all notifications as read",
      );
    }
    const data = await response.json();
    logger.info("Successfully marked all notifications as read", { data });
    return data;
  } catch (error) {
    logger.error("Error in markAllNotificationsRead", { error });
    throw error;
  }
};

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${APP_URL}/api/users`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || errorData.message || "Failed to fetch users",
      );
    }

    const data = await response.json();
    logger.info("Successfully fetched users", { data });
    return data;
  } catch (error) {
    logger.error("Error in fetchUsers", { error });
    throw error;
  }
};

export const login = async (formData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${APP_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || "Login failed");
    }

    const data = await response.json();
    logger.info("Successfully logged in", { email: formData.email });
    return data;
  } catch (error) {
    logger.error("Error in login", { email: formData.email, error });
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${APP_URL}/api/auth/logout`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || "Logout failed");
    }

    const data = await response.json();
    logger.info("Successfully logged out");
    return data;
  } catch (error) {
    logger.error("Error in logout", { error });
    throw error;
  }
};
