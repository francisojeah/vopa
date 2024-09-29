import moment from 'moment';

function customTimestampPlugin(schema) {
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  schema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    this.updatedAt = Date.now();
    next();
  });

  schema.virtual('createdAtUTC').get(function () {
    return moment.utc(this.createdAt).format();
  });

  schema.virtual('updatedAtUTC').get(function () {
    return moment.utc(this.updatedAt).format();
  });
}

export { customTimestampPlugin };
