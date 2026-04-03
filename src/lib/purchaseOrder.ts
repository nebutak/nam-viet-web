import type { PurchaseOrderStatus } from "@/types";

export const getStatusInfo = (status: PurchaseOrderStatus) => {
    const statuses = {
        pending: { label: "Chờ duyệt", color: "yellow" as const },
        approved: { label: "Đã duyệt", color: "blue" as const },
        received: { label: "Đã nhận hàng", color: "green" as const },
        cancelled: { label: "Đã hủy", color: "red" as const },
    };
    return statuses[status] || { label: status, color: "gray" as const };
};

export const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: any }> = {
        pending: { label: "Chờ duyệt", color: "warning" },
        approved: { label: "Đã duyệt", color: "info" },
        received: { label: "Đã nhận hàng", color: "success" },
        cancelled: { label: "Đã hủy", color: "error" },
    };
    return map[status] || { label: status, color: "gray" };
};

export const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
        pending: "Chờ duyệt",
        approved: "Đã duyệt",
        received: "Đã nhận hàng",
        cancelled: "Đã hủy",
    };
    return map[status] || status;
};