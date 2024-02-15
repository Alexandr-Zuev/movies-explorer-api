const router = require('express').Router();
const { updateProfileValidation } = require('../middlewares/validations');
const {
  updateProfile, getMyProfile,
} = require('../controllers/users');

router.get('/me', getMyProfile);
router.patch('/me', updateProfileValidation, updateProfile);

module.exports = router;
