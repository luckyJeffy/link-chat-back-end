'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io, middleware } = app;
  const { initSession } = middleware;

  router.get('/', initSession, controller.home.index);
  router.post('/api/chat/createRoom', initSession, controller.room.createRoom);
  router.post('/api/chat/joinRandomRoom', initSession, controller.room.joinRandomRoom);
  router.post('/api/chat/leaveRoom', initSession, controller.room.leaveRoom);

  // socket.io
  io.of('/').route('exchange', io.controller.nsp.exchange);
  io.of('/').route('leave', io.controller.nsp.leave);
};
