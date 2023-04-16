const DEFAULT_LIMIT_NUMBER = 50;
const query = ({ page, limit }) => ({
  skip: (+page - 1) * +limit || 0,
  limit: +limit || DEFAULT_LIMIT_NUMBER,
});
module.exports = query;
