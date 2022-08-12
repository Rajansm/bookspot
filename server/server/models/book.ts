/**
 * Define model for Book
 */

 import mongoose from 'mongoose';

 /**
  * Book Schema
  */
 const bookSchema = new mongoose.Schema(
   {
     _id: mongoose.Schema.Types.ObjectId,
     isbn: {
       type: String,
       required: true
     },
     title: {
       type: String,
       required: true
     },
     subtitle: {
       type: String,
       required: true
     },
     author: {
       type: String,
       required: true
     },
     published: {
       type: String,
       required: true
     },
     publisher: {
       type: String,
       required: true
     },
     pages: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      cover: {
        type: String,
        required: true
      },
   },
   {
     timestamps: true
   }
 );
 
 /**
  * Statics
  */
 bookSchema.statics = {
   /**
    * Get Book
    * @param {ObjectId} id - The objectId of book.
    */
   get(id: string): mongoose.Document {
     return this.findById(id)
       .execAsync()
       .then((book: any) => {
         if (book) {
           return book;
         }
       });
   }
 };
 
 /**
  * Methods
  */
 bookSchema.methods = {};
 
 export default mongoose.model('User', bookSchema);
 