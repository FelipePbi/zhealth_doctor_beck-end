import database from '../src/database/index';

export default async function truncate() {
  await database.connection.dropDatabase();
}
