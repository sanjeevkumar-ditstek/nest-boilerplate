export const jwtConstants = {
  SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH: {
    SECRET: process.env.JWT_REFRESH_SECRET,
    EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};
