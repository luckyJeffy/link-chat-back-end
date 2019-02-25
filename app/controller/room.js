'use strict';

const Controller = require('egg').Controller;

module.exports = class Rooms extends Controller {
  async joinRandomRoom() {
    const { user } = this.ctx.session;
    const { logger } = this.ctx.app;
    let { id, room, hasRoom } = user;
    let code = 0,
      message = 'Join room successed.';

    if (hasRoom) {
      message = 'Already join the room.';
      logger.debug(
        '#room joined',
        `User ${id} already joined the room: ${room}`
      );
    }
    // 用户没有房间，找可用房间
    if (!hasRoom) {
      try {
        room = await this.service.room.joinRandomRoom();
        if (!room) {
          message = 'Join failed, please create a room.';
        } else {
          logger.debug('#room joined', `User ${id} joined the room: ${room}`);
        }
      } catch {
        logger.error(e);
        code = 500;
        message =
          'Join failed, please try agian later or contact administrator.';
      }
    }
    this.ctx.body = {
      code,
      message,
      data: { room },
    };
  }
  async createRoom() {
    const { user } = this.ctx.session;
    const { logger } = this.ctx.app;
    let { id, room, hasRoom } = user;
    let code = 0,
      message = 'Create successed.';

    // 没有房间，创建房间
    if (!hasRoom) {
      try {
        room = await this.service.room.createRoom();
        logger.debug('#room create', `User ${id} created the room: ${room}`);
      } catch (e) {
        logger.error('#room create', e);
        code = 500;
        message =
          'Create failed, please try agian later or contact administrator.';
      }
    } else {
      message = 'Already join a room.';
      logger.debug(
        '#room joined',
        `User ${id} already joined the room: ${room}`
      );
    }
    this.ctx.body = {
      code,
      message,
      data: { room },
    };
  }
  async leaveRoom() {
    const { user } = this.ctx.session;
    const { logger } = this.ctx.app;
    let { id, hasRoom } = user;
    let code = 0,
      message = 'Successfully left the room.';

    try {
      if (!hasRoom) {
        message = 'Can not leave the room before joined the room.';
        logger.debug('#room leave', `User ${id} not yet joined the room.`);
      } else {
        // 清除 roomID
        await this.service.room.leaveRoom();
      }
    } catch (e) {
      logger.error('#room leave', e);
      code = 500;
      message =
        'Leave failed, please try agian later or contact administrator.';
    }
    this.ctx.body = {
      code,
      message,
    };
  }
};
