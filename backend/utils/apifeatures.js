class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // here search will work
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // here 'i' means case insensitive
          },
        }
      : {};
    this.query = this.query.find({ ...keyword }); // whatever search user wants will get in to this.query and again calling find but with embedded value which is keyword.
    return this;
  }
  //here filter will work
  filter() {
    const queryCopy = { ...this.queryStr }; // this {...this.queryStr} is called spread operator, which is used to create the actual copy rather then providing the reference.
    // Removing some fields for Category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    //Filter for Price and Rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); // '/\b(kisko change krna hai)\b/g' this is used to apply on all the similar values
    // here gt = greater than and all use in mongodb
    // console.log(queryStr);
    // console.log(queryCopy);
    this.query = this.query.find(JSON.parse(queryStr));
    // console.log(queryStr);
    return this;
  }
  // Pagination
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}
module.exports = ApiFeatures;
