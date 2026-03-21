import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://staybuddy2026:JtVwMfUkoMIaJI8S@staybuddy.znqbk3l.mongodb.net/?appName=StayBuddy';

async function fixIndexes() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test');
    const col = db.collection('users');

    const indexes = await col.indexes();
    console.log('Current indexes:', indexes.map(i => ({ name: i.name, key: i.key, unique: i.unique })));

    // Drop the old single-field unique indexes if they exist
    const toDrop = ['email_1', 'googleId_1'];
    for (const name of toDrop) {
      if (indexes.find(i => i.name === name)) {
        await col.dropIndex(name);
        console.log(`Dropped index: ${name}`);
      } else {
        console.log(`Index not found (skipping): ${name}`);
      }
    }

    // Ensure the correct compound indexes exist
    await col.createIndex({ email: 1, country: 1 }, { unique: true });
    console.log('Created compound index: { email, country }');

    // partialFilterExpression skips docs where googleId is null/missing (credentials users)
    await col.createIndex({ googleId: 1, country: 1 }, { unique: true, partialFilterExpression: { googleId: { $type: 'string' } } });
    console.log('Created compound index: { googleId, country }');

    const finalIndexes = await col.indexes();
    console.log('\nFinal indexes:', finalIndexes.map(i => ({ name: i.name, key: i.key, unique: i.unique })));

  } finally {
    await client.close();
  }
}

fixIndexes().catch(console.error);
