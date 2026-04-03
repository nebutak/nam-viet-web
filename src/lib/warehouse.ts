export const convertWarehouseType = (type: string) => {
    switch (type) {
      case "raw_material":
        return "Nguyên liệu";
      case "packaging":
        return "Bao bì";
      case "finished_product":
        return "Thành phẩm";
      case "goods":
        return "Hàng hóa";
      default:
        return "";
    }
  };