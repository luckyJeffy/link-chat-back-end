'use strict';

module.exports = appInfo => {
  return {
    security: {
      csrf: {
        enable: false,
      },
    },
    redis: {
      client: {
        host: '127.0.0.1',
        port: 6379,
        password: '',
        db: '0',
      },
    },
    io: {
      namespace: {
        '/': {
          connectionMiddleware: [ 'auth' ],
          packetMiddleware: [], // 针对消息的处理暂时不实现
        },
      },
      // cluster 模式下，通过 redis 实现数据共享
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
  };
};
