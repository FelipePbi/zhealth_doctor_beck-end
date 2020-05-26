import '../bootstrap';
import mongoose from 'mongoose';
import requireDir from 'require-dir';

mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

requireDir('../app/models');

export default mongoose;
