import numeral from "numeral";
export const format = {
  filters: {
    formatNumber(value) {
      return numeral(value).format("0,0") + " Đ";
    }
  }
};
export const hoursList = {
  data() {
    return {
      hours: [
        "00:00",
        "00:30",
        "01:00",
        "01:30",
        "02:00",
        "02:30",
        "03:00",
        "03:30",
        "04:00",
        "04:30",
        "05:00",
        "05:30",
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30"
      ]
    };
  },
  computed: {
    hoursData() {
      return this.hours;
    }
  }
};

export const location = {
  data() {
    return {
      citiesList: [],
      districtsList: []
    };
  },
  methods: {
    async getCities() {
      try {
        const response = await axios.get(`cities?limit=100`);
        this.citiesList = response.data.data;
        // console.log(response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getDistricts() {
      try {
        const response = await axios.get(`districts?limit=1000`);
        this.districtsList = response.data.data;
        // console.log(response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    }
  },
  mounted() {
    // console.log("asdasd");
    this.getCities();
    this.getDistricts();
  },
  computed: {
    cities() {
      return this.citiesList;
    },
    districts() {
      return this.districtsList;
    }
  }
};

export const constant = {
  data() {
    return {
      paymentStatusList: [
        { value: 3, title: "Đã thanh toán" },
        { value: 0, title: "Chưa thanh toán" }
      ],
      bookingStatusList: [
        { value: 1, title: "Đơn mới" },
        { value: 2, title: "Đã xác nhận" },
        { value: 3, title: "Đang sử dụng" },
        { value: 4, title: "Đã hoàn thành" },
        { value: 5, title: "Đã hủy" }
      ]
    };
  },
  computed: {
    statusList() {
      return this.bookingStatusList;
    },
    paymentList() {
      return this.paymentStatusList;
    }
  }
};
