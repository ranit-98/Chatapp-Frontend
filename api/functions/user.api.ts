import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

/**
 * Update user profile
 * @param body FormData containing name, email, and/or avatar file
 */
export const userUpdateProfileFn = async (body: FormData) => {
    const res = await axiosInstance.patch(
        endpoints.user.updateProfile,
        body,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return res;
};

/**
 * Get current user profile details
 */
export const userGetMeFn = async () => {
    const res = await axiosInstance.get(endpoints.user.me);
    return res;
};

/**
 * List all users
 */
export const userListFn = async () => {
    const res = await axiosInstance.get(endpoints.user.list);
    return res;
};
