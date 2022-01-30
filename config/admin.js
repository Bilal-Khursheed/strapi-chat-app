module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '4f251f6eba41243c94b5c2ed78e6d84c'),
  },
});
