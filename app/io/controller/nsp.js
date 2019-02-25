const Controller = require('egg').Controller;

class NspController extends Controller {
  async exchange() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;

    try {
      const { mid, sendDate, target, payload } = message;
      if (!target) return;
      const msg = ctx.helper.parseMsg('exchange', payload, {
        client,
        target,
        mid,
        sendDate,
      });
      nsp.emit(target, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }
  async leave() {
    // 重制双方session
    // redis内删除room
    const { ctx, app } = this;
    // const socket = ctx.socket;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    // const client = socket.id;

    try {
      const { room } = message;
      if (!room) return;
      // todo 房间不存在 return
      nsp.adapter.clients(room, (err, clients) => {
        // 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
        clients.map(client => {
          nsp.adapter.remoteDisconnect(client, true, err => {
            logger.error(err);
          });
        });
      });
    } catch (error) {
      app.logger.error(error);
    }
  }
}

module.exports = NspController;
