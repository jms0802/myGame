const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String },
  googleId: { type: String },
  nickname: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// 사용자 삭제 시 연관된 모든 데이터 자동 삭제
userSchema.pre('remove', async function(next) {
  try {
    const uid = this.uid;
    
    // 연관된 모델들 import
    const GameRecord = mongoose.model('GameRecord');
    const UserRecord = mongoose.model('UserRecord');
    const Rank = mongoose.model('Rank');
    
    // 모든 연관 데이터 삭제
    await Promise.all([
      GameRecord.deleteMany({ uid }),
      UserRecord.deleteMany({ uid }),
      Rank.deleteMany({ uid })
    ]);
    
    console.log(`[User Deletion] Successfully removed all related data for uid: ${uid}`);
    next();
  } catch (error) {
    console.error(`[User Deletion] Error removing related data for uid: ${this.uid}:`, error);
    next(error);
  }
});

// findOneAndDelete, deleteOne 등에도 적용
userSchema.pre('findOneAndDelete', async function(next) {
  try {
    const uid = this.getQuery().uid;
    if (uid) {
      const GameRecord = mongoose.model('GameRecord');
      //const UserRecord = mongoose.model('UserRecord');
      const Rank = mongoose.model('Rank');
      
      await Promise.all([
        GameRecord.deleteMany({ uid }),
        //UserRecord.deleteMany({ uid }),
        Rank.deleteMany({ uid })
      ]);
      
      console.log(`[User Deletion] Successfully removed all related data for uid: ${uid}`);
    }
    next();
  } catch (error) {
    console.error(`[User Deletion] Error removing related data:`, error);
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema); 