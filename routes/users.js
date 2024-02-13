const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile, getMyProfile,
} = require('../controllers/users');

const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

router.get('/me', getMyProfile);
router.patch('/me', updateProfileValidation, updateProfile);

module.exports = router;
