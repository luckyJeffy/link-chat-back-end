'use strict';

async function initSession(ctx, next) {
  if (ctx.session.isNew) {
    ctx.session.user = {
      id:
        typeof ctx.request.body.userId === 'string'
          ? ctx.request.body.userId
          : '',
      room: '',
      status: '',
      hasRoom: false,
    };
  }
  await next();
}

module.exports = initSession;
