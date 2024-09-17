import mongoose from 'mongoose';

export class Mongo {
  private URI: string
  private connection: mongoose.Connection | undefined;
  constructor() {
    const mongoURI = process.env.MONGO
    if (!mongoURI) throw new Error('mongo URI not found')
    this.URI = mongoURI
  }

  connect(): void {
    if (this.connection !== undefined) {
      console.warn('MongoDB Connection already established')
    }

    mongoose.connect(this.URI)
      .then(() => {
        this.connection = mongoose.connection
        console.log('Connected to MongoDB')
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB', error)
      })
  }

  getConnection(): mongoose.Connection | undefined {
    return this.connection
  }

  disconnect(): void {
    if (this.connection !== null) {
      this.connection?.close()
        .then(() => {
          console.log('Mongodb Connection closed')
        })
        .catch((error) => {
          console.error('Error when closing connection MongoDB', error)
        })
    }
  }
}