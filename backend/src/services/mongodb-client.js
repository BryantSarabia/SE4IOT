// backend/src/services/mongodb-client.js

import { MongoClient } from 'mongodb'
import { MONGODB_CONFIG } from '../config'

class MongoDBClient {
  constructor () {
    this.client = null
    this.dbName = MONGODB_CONFIG.dbName
    this.dbUrl = MONGODB_CONFIG.dbUrl
  }

  async connect () {
    this.client = new MongoClient(this.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })

    try {
      await this.client.connect()
      this.db = this.client.db(this.dbName)
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw error
    }
  }

  createCollection (collectionName) {
    if (!this.db) {
      throw new Error('MongoDB client not connected.')
    }
    return this.db.createCollection(collectionName)
  }

  insertDocument (collectionName, document) {
    if (!this.db) {
      throw new Error('MongoDB client not connected.')
    }
    return this.db.collection(collectionName).insertOne(document)
  }

  deleteDocument (collectionName, document) {
    if (!this.db) {
      throw new Error('MongoDB client not connected.')
    }
    return this.db.collection(collectionName).deleteOne(document)
  }

  getDB () {
    if (!this.db) {
      throw new Error('MongoDB client not connected.')
    }
    return this.db
  }

  async close () {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }
}

export const mongodbClient = new MongoDBClient()
