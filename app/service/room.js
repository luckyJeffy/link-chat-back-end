'use strict';

const uuidv4 = require('uuid/v4');
const Service = require('egg').Service;

class RoomService extends Service {
  async hasRoom(room) {
    if (room.length > 1) {
      const chattingRoom = await this.app.redis.exists(
        `chatting:rooms:${room}`
      );
      const matchingRoom = await this.app.redis.sismember(
        'matching:rooms',
        room
      );
      // return 0 unavailable, 1 available
      return chattingRoom || matchingRoom;
    }
    return false;
  }
  async createRoom() {
    const roomId = uuidv4();
    await this.app.redis.sadd('matching:rooms', roomId);
    const user = this.ctx.session.user;
    user.room = roomId;
    user.status = 'matching';
    user.hasRoom = true;
    return roomId;
  }
  async joinRandomRoom() {
    const roomId = await this.app.redis.spop('matching:rooms');
    if (typeof roomId === 'string' && roomId.length > 0) {
      this.app.redis.set(`chatting:rooms:${roomId}`, '1');
      const user = this.ctx.session.user;
      user.room = roomId;
      user.status = 'matched';
      user.hasRoom = true;
      return roomId;
    }
    return null;
  }
  async leaveRoom() {
    // 离开房间
    const user = this.ctx.session.user;
    const { room } = user;
    user.room = '';
    user.status = 'disconnected';
    user.hasRoom = false;
    this.app.redis.del(`chatting:rooms:${room}`);
  }
}

module.exports = RoomService;
