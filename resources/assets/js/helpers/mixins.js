import numeral from 'numeral'
import moment from 'moment'
export const format = {
  filters: {
    formatNumber(value) {
      return numeral(value).format('0,0') + ' Đ'
    },
    filterWeekDay(value) {
      if (value == 1) {
        return 'Chủ nhật'
      } else {
        return 'Thứ ' + value
      }
    },
    formatDate(date) {
      if (date) {
        let d = new Date(date)
        return moment(d).format('DD/MM/YYYY')
      }
    },
    formatDateBlog(date) {
      if (date) {
        let d = new Date(date);
        return moment(d).format('DD/MM/YYYY hh:mm')
      }
    }
  }
}
export const hoursList = {
  data() {
    return {
      hours: [
        '00:00',
        '00:30',
        '01:00',
        '01:30',
        '02:00',
        '02:30',
        '03:00',
        '03:30',
        '04:00',
        '04:30',
        '05:00',
        '05:30',
        '06:00',
        '06:30',
        '07:00',
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
        '22:00',
        '22:30',
        '23:00',
        '23:30'
      ]
    }
  },
  computed: {
    hoursData() {
      return this.hours
    }
  }
}
export const monthsList = {
  data() {
    return {
      months: [{
          id: 1,
          value: '1'
        },
        {
          id: 2,
          value: '2'
        },
        {
          id: 3,
          value: '3'
        },
        {
          id: 4,
          value: '4'
        },
        {
          id: 5,
          value: '5'
        },
        {
          id: 6,
          value: '6'
        },
        {
          id: 7,
          value: '7'
        },
        {
          id: 8,
          value: '8'
        },
        {
          id: 9,
          value: '9'
        },
        {
          id: 10,
          value: '10'
        },
        {
          id: 11,
          value: '11'
        },
        {
          id: 12,
          value: '12'
        }
      ]
    }
  },
  computed: {
    monthsData() {
      return this.months
    }
  }
}
export const yearsList = {
  data() {
    return {
      years: [{
          id: 1,
          value: '2016'
        },
        {
          id: 2,
          value: '2017'
        },
        {
          id: 3,
          value: '2018'
        },
        {
          id: 4,
          value: '2019'
        }
      ]
    }
  },
  computed: {
    yearsData() {
      let d = new Date()
      let oldYears = this.years
      let currentYear = d.getFullYear()
      let length = currentYear.length
      oldYears.forEach(item => {
        if (item.value == currentYear) {
          this.years.push({
            id: length + 1,
            value: currentYear + 2 + ''
          })
        }
      })
      return this.years
    }
  }
}

export const location = {
  data() {
    return {
      citiesList: [],
      districtsList: []
    }
  },
  methods: {
    async getCities() {
      try {
        const response = await axios.get(`cities?limit=-1`)
        this.citiesList = response.data.data
        // console.log(response.data.data)
      } catch (error) {
        if (error) {
          window.toastr['error']('There was an error', 'Error')
        }
      }
    },
    async getDistricts() {
      try {
        const response = await axios.get(`districts?limit=-1`)
        this.districtsList = response.data.data
        // console.log(response.data.data)
      } catch (error) {
        if (error) {
          window.toastr['error']('There was an error', 'Error')
        }
      }
    }
  },
  mounted() {
    // console.log('asdasd')
    this.getCities()
    this.getDistricts()
  },
  computed: {
    cities() {
      return this.citiesList
    },
    districts() {
      return this.districtsList
    }
  }
}

export const constant = {
  data() {
    return {
      paymentStatusList: [{
          value: 3,
          title: 'Đã thanh toán'
        },
        {
          value: 0,
          title: 'Chưa thanh toán'
        }
      ],
      paymentMethodList: [{
          value: 1,
          title: 'Tiền mặt'
        },
        {
          value: 2,
          title: 'Chuyển khoản'
        },
        {
          value: 3,
          title: 'Bảo kim'
        },
        {
          value: 4,
          title: 'Internet Banking'
        },
        {
          value: 5,
          title: 'Thẻ Visa/MasterCard'
        }
      ],
      bookingStatusList: [{
          value: 1,
          title: 'Đơn mới'
        },
        {
          value: 2,
          title: 'Đã xác nhận'
        },
        {
          value: 3,
          title: 'Đang sử dụng'
        },
        {
          value: 4,
          title: 'Đã hoàn thành'
        },
        {
          value: 5,
          title: 'Đã hủy'
        }
      ],
      sourceList: [{
          value: 1,
          title: 'Trang fanpage'
        },
        {
          value: 2,
          title: 'Tổng đài'
        },
        {
          value: 3,
          title: 'Qua Team Sale'
        },
        {
          value: 4,
          title: 'Qua Website'
        },
        {
          value: 5,
          title: 'Qua AirBnb'
        },
        {
          value: 5,
          title: 'Qua Booking.com'
        }
      ],
      room_type_list: [{
          id: 1,
          name: 'Nhà riêng'
        },
        {
          id: 2,
          name: 'Căn hộ/ Chung cư'
        },
        {
          id: 3,
          name: 'Biệt thự'
        },
        {
          id: 4,
          name: 'Phòng riêng'
        },
        {
          id: 5,
          name: 'Khách sạn'
        }
      ],
      rent_type_list: [{
          id: 1,
          value: 'Theo giờ'
        },
        {
          id: 2,
          value: 'Theo ngày'
        },
        {
          id: 3,
          value: 'Cả ngày và giờ'
        }
      ],
      room_status_list: [{
          id: 1,
          value: 'Đang hoạt động'
        },
        {
          id: 2,
          value: 'Không hoạt động'
        },
        {
          id: 0,
          value: 'Chưa xác nhận'
        },
        {
          id: 3,
          value: 'Dọn dẹp phòng'
        },
        {
          id: 4,
          value: 'Thiết lập dịch vụ'
        }
      ],
      booking_type_list: [{
          id: 1,
          name: 'Theo giờ'
        },
        {
          id: 2,
          name: 'Theo ngày'
        },
      ],
      weekday_list: [{
          id: 2,
          name: 'Thứ 2'
        },
        {
          id: 3,
          name: 'Thứ 3'
        },
        {
          id: 4,
          name: 'Thứ 4'
        },
        {
          id: 5,
          name: 'Thứ 5'
        },
        {
          id: 6,
          name: 'Thứ 6'
        },
        {
          id: 7,
          name: 'Thứ 7'
        },
        {
          id: 1,
          name: 'Chủ nhật'
        },
      ],
    }
  },
  computed: {
    statusList() {
      return this.bookingStatusList
    },
    paymentList() {
      return this.paymentStatusList
    },
    paymentMethods() {
      return this.paymentMethodList
    },
    bookingSource() {
      return this.sourceList
    }
  }
}
