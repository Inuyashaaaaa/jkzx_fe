import momentTimezone from 'moment-timezone';

function moment(time) {
  return momentTimezone(time)
    .tz('Asia/Taipei')
    .format('YYYY-MM-DD HH:mm:ss');
}

module.exports = moment;
