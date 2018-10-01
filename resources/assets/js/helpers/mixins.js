import numeral from "numeral";
export default {
  filters: {
    formatNumber(value) {
      return numeral(value).format("0,0") + " Đ";
    }
  }
};
